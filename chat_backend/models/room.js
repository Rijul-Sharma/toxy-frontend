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
    }
    },
    { versionKey: false }
)

let roomModel = model('room',roomSchema)

export default roomModel