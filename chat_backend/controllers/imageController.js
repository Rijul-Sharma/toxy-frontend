import imageModel from '../models/image.js'
import roomModel from '../models/room.js';
import userModel from '../models/user.js';

export const uploadImage = async (req, res) => {
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const base64Image = req.file.buffer.toString('base64');
        const newImage = new imageModel({
            imageData: base64Image,
            name: req.body.name,
        });
        const savedImage = await newImage.save();

        if (req.body.roomId) {
            const room = await roomModel.findOne({_id : req.body.roomId});
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            const currentIconId = room.icon;
            if (currentIconId) {
                await imageModel.findByIdAndDelete(currentIconId);
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
                await imageModel.findByIdAndDelete(currentIconId);
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