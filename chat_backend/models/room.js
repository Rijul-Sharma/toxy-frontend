import { Schema,model } from "mongoose";

const roomSchema  = Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
    },
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'user'
    },
    icon: {
        type: Schema.Types.ObjectId,
        ref: 'image'
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'message'
    }
    },
    { versionKey: false }
)

let roomModel = model('room',roomSchema)

export default roomModel