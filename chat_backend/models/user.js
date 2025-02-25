import { Schema,model } from "mongoose";

const userSchema = Schema({
    email : {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        unique: true,
    },
    password : {
        type: String,
        required: true,
    },
    rooms : {
        type: [Schema.Types.ObjectId],
        ref: 'room'
    },
    icon : {
        type: Schema.Types.ObjectId,
        ref: 'image'
    }
    },
    { versionKey: false }
)

let userModel = model('user',userSchema)

export default userModel