import roomModel from "../models/room.js";
import userModel from "../models/user.js"
import mongoose from "mongoose";

export const createRoom = async (req,res) => {
    try{
        const { user_id, room_name, room_desc} = req.body;
        // console.log(user_id,'ui')
        // console.log(room_name,'rn')
        // console.log(room_desc, 'rd')
        const newRoom = new roomModel({
            name : room_name,
            createdBy: user_id,
            description: room_desc,
            admin: user_id,
            createdAt: new Date(),
            users: [user_id],
        })
        await newRoom.save();
        const user = await userModel.findOne({_id : user_id})
        user.rooms.push(newRoom._id);
        await user.save()
        // const populatedRoom = await newRoom.populate('createdBy').populate('users')
        return res.status(200).json({
            response : newRoom,
            message : "Created room successfully!"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error : err.message})
    }
    
}


export const joinRoom = async (req,res) => {
    try {
        const { user_id, room_id} = req.body;
        // console.log(user_id,'ui')
        // console.log(room_id,'ri')

        if (!mongoose.Types.ObjectId.isValid(room_id)) {
            return res.status(400).json({ response: "Invalid room ID format" });
        }

        const room = await roomModel.findOne({_id : room_id});
        if(!room) return res.status(404).json({response : "Room not found"})
        if (room.users.includes(user_id)) {
            return res.status(400).json({ response: "User is already a part of this room" });
        }
        if (!room.users) room.users = [];
        room.users.push(user_id);
        await room.save();

        const user = await userModel.findOne({_id : user_id})
        if(!user) return res.status(404).json({response : "User not found"})
        user.rooms.push(room_id);
        await user.save()

        // const populatedRoom = await roomModel.findOne({ _id : room_id}).populate('createdBy').populate('users')
        return res.status(200).json({
            response : room,
            message : "Joined room successfully!"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error : err.message})
    }
    
}


export const exitRoom = async (req,res) => {
    const { roomId, userId } = req.body;

    try {
        const room = await roomModel.findOne({_id: roomId});
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const user = await userModel.findOne({_id:userId});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!room.users.includes(userId)) {
            return res.status(400).json({ message: 'User is not in the room' });
        }
        // room.users.map(user=>console.log(userId === user._id))
        room.users = room.users.filter(user => user._id.toString() !== userId);
        await room.save();
        if (room.users.length === 0) {
            await roomModel.deleteOne({ _id: room._id });
        }
        user.rooms = user.rooms.filter(room => room._id.toString() !== roomId);
        await user.save();

        return await  res.status(200).json({
            response: room,
            message: 'User exited the room successfully' });
    } catch (error) {
        console.error('Error exiting room:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export const getRoomInfo = async (req,res) => {
    // console.log('called')
    const { roomId } = req.query;

    try {
        const room = await roomModel.findOne({ _id : roomId})
        .populate('createdBy')
        .populate('users')
        .populate('admin')
        .populate({
            path: 'users',
            populate : { path : 'icon'}
        })
        .populate('icon')
        // console.log(room, 'room hai')
        if(!room){
            return res.status(404).json({ message: 'Room not found'});
        }
        return res.status(200).json(room)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error : err})
    }
}


export const getRooms = async (req,res) => {
    try {
        const { roomIds } = req.body;
        // console.log(req.body, 'rb')
        const rooms = await roomModel.find({_id : { $in : roomIds }})
        .populate('createdBy')
        .populate('users')
        .populate({
            path: 'users',
            populate : { path : 'icon'}
        })
        .populate('admin')
        .populate('icon')
        .populate('lastMessage')
        .populate({
            path: 'lastMessage',
            populate : { path: 'sender'}
        })
        return res.status(200).json(rooms)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error : err})
    }
}



export const changeAdmin = async (req,res) => {
    const { room_id, newAdminId } = req.body;
    try {
        const room = await roomModel.findOne({_id : room_id});
        room.admin = newAdminId;
        await room.save();
        return res.status(200).json({
            response: room,
            message: "Room Admin Changed Successfully!"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error : err})
    }
}


export const kickMember = async (req,res) => {
    const { room_id, memberId } = req.body;
    try {
        const room = await roomModel.findOne({_id : room_id});
        room.users = room.users.filter(user => user._id.toString() !== memberId);
        await room.save();

        const user = await userModel.findOne({_id : memberId})
        user.rooms = user.rooms.filter(room => room._id.toString() !== room_id);
        await user.save()
        return res.status(200).json({
            response: room,
            message: "Member Kicked Out of the Room Successfully!"
        })
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error : err})
    }
}


export const editRoom = async (req,res) => {
    const {roomId, newName, newDesc} = req.body;
    try{
        const room = await roomModel.findOne({_id : roomId})
        room.name = newName;
        room.description = newDesc;
        await room.save();
        return res.status(200).json({ response: room, message: "Room Updated Successfully!"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error : err})
    }
}