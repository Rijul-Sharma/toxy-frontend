import userModel from "../models/user.js";

export const getUser = async (req,res) => {
    const userId = req.query.userId
    console.log(userId)
    let a = await userModel.findOne({_id : userId})
    console.log({user : a}, 'This one')
    res.json(a);
}