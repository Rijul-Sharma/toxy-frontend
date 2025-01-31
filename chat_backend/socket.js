import { Server } from "socket.io";
import roomModel from "./models/room.js";
import { saveMessage } from "./controllers/messageController.js";
import { send } from "process";

// const socketMap = {}

export const setupSocketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log("A user has connected")
    
        socket.on('disconnect', () => {
            console.log("A user has disconnected", socket.id)
        })
    
        socket.on('sendMessage', async (roomId, content, sender)=> {
            console.log(roomId, 'room')
            if(roomId){
                const now = new Date();
                const message = {
                    content : content,
                    room_id : roomId,
                    sender : sender,
                    sentAt : now.toISOString()
                }
                console.log('Message received : ', content)
                io.to(roomId).emit('receiveMessage', message)
            }
        })

        socket.on('joinRoom', (userId, rooms) => {
            console.log(userId,rooms)
            rooms?.forEach((room)=> {
                const roomId = room._id
                socket.join(roomId)
            })

        })
    })
}