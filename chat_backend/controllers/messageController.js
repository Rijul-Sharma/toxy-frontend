import messageModel from "../models/message.js";
import roomModel from "../models/room.js";


export const getAllMessages = async (req,res) => {
    try{
        const {room_id} = req.query;
        // console.log(room_id)
        let a = await messageModel.find({ room_id })
        .populate('sender')
        // .populate({
        //     path : 'sender',
        //     populate : { path : 'icon'}
        // })
        res.status(200).json({response : a})
    } catch (err){
        console.log(err)
        res.status(500).json({error : err.message})
    }
}

export const saveMessage = async (req,res) => {
    console.log('Save Message called')
    try {
        const { content, room_id, sender } = req.body;
        // console.log(content , room_id, sender )
        const msg = new messageModel({ content, room_id, sender})
        await msg.save();
        const room = await roomModel.findOne({ _id : room_id })
        room.lastMessage = msg;
        await room.save()
        res.status(200).json(msg)
    } catch (err) {
        console.log(err)
        res.status(500).json({error : err.message})
    }
}