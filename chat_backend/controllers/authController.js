import userModel from "../models/user.js";
import roomModel from "../models/room.js";

export const Signup = async (req,res) => {
    try {
        const {email, name, password} = req.body;
        const newUser = new userModel({ email, name, password})
        await newUser.save();
        res.status(200).json(newUser)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message})
    }
}

export const Login = async (req,res) => {
    console.log(req.body)
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email})
        if(!user) return res.status(404).json({ error: "User not found"})
        if(password !== user.password) return res.status(401).json({ error: "Incorrect Password"})
        return res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}