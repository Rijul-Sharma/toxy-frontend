import roomModel from "../models/room.js";
import userModel from "../models/user.js";
import mongoose from "mongoose";

export const getUser = async (req,res) => {
    const userId = req.query.userId
    // console.log(userId)
    let a = await userModel.findOne({_id : userId})
    // console.log({user : a}, 'This one')
    res.json(a);
}


export const getUserIcon = async (req,res) => {
    try{
        const userId = req.query.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        let user = await userModel.findOne({_id : userId}).populate('icon')
        if(!user){
            return res.status(404).json({ error: "User not found"})
        }
        return res.status(200).json(user.icon)
    } catch (err){
        res.status(500).json({ error: err.message})
    }
    
}

export const updateUserName = async (req,res) => {
    try{
        const { userId, newUserName } = req.body
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        let user = await userModel.findOne({_id : userId})
        if(!user){
            return res.status(404).json({ error: "User not found"})
        }
        user.name = newUserName;
        await user.save()
        res.status(200).json({ message: "Username changed Successfully!", response: user})
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
    
}


export const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.query;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await roomModel.updateMany(
            { users: userId },
            { $pull: { users: userId } }
        );

        await roomModel.deleteMany(
            { users: { $size: 0 } }
        );

        await user.deleteOne();
        return res.status(200).json({ message: 'Account successfully deleted' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};