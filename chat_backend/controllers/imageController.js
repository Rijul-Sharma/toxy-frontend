import imageModel from '../models/image.js'
import roomModel from '../models/room.js';
import userModel from '../models/user.js';
import { cloudinary } from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
    // console.log('File:', req.file);
    // console.log('Body:', req.body);
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const newImage = new imageModel({
            url: req.file.path,
            public_id: req.file.filename,
            name: req.body.name,
        });
        const savedImage = await newImage.save();

        if (req.body.roomId) {
            const room = await roomModel.findOne({_id: req.body.roomId});
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            const currentIconId = room.icon;
            if (currentIconId) {
                const oldImage = await imageModel.findById(currentIconId);
                if (oldImage) {
                    await cloudinary.uploader.destroy(oldImage.public_id);
                    await imageModel.findByIdAndDelete(currentIconId);
                }
            }
            room.icon = savedImage._id;
            await room.save()
        }
        
        if(req.body.userId){
            const user = await userModel.findOne({_id : req.body.userId});
            if(!user) {
                return res.status(404).json({ error : 'User not found'});
            }
            const currentIconId = user.icon;
            if (currentIconId) {
                const oldImage = await imageModel.findById(currentIconId);
                if (oldImage) {
                    await cloudinary.uploader.destroy(oldImage.public_id);
                    await imageModel.findByIdAndDelete(currentIconId);
                }
            }
            user.icon = savedImage._id;
            await user.save()
        }

        res.status(201).json(savedImage);
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Image upload failed', details: err.message });
    }
}


export const deleteImage = async (req, res) => {
    try {
        const { userId, roomId } = req.body;

        if (!userId && !roomId) {
            return res.status(400).json({ error: 'userId or roomId must be provided' });
        }

        let imageIdToDelete;

        if (userId) {
            const user = await userModel.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            imageIdToDelete = user.icon;
            user.icon = null;
            await user.save();
        }

        if (roomId) {
            const room = await roomModel.findById(roomId);
            if (!room) return res.status(404).json({ error: 'Room not found' });

            imageIdToDelete = room.icon;
            room.icon = null;
            await room.save();
        }

        if (imageIdToDelete) {
            const image = await imageModel.findById(imageIdToDelete);
            if (image) {
                await cloudinary.uploader.destroy(image.public_id);
                await imageModel.findByIdAndDelete(imageIdToDelete);
            }
        }

        res.status(200).json({ message: 'Icon deleted successfully' });
    } catch (err) {
        console.error('Delete icon error:', err);
        res.status(500).json({ error: 'Failed to delete icon', details: err.message });
    }
};