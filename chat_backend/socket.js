import { Server } from "socket.io";
import roomModel from "./models/room.js";
import { saveMessage } from "./controllers/messageController.js";
// import { send } from "process";

// const socketMap = {}

export const setupSocketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log("A user has connected")
    
        socket.on('disconnect', () => {
            console.log("A user has disconnected", socket.id)
        })
    
        socket.on('sendMessage', async (roomId, content, sender)=> {
            console.log("sm called")
            console.log(roomId, 'room')
            console.log(content, 'this is content')
            console.log(sender, 'tis is the sender')
            if(roomId){
                const now = new Date();
                const message = {
                    content : content,
                    room_id : roomId,
                    sender : sender,
                    sentAt : now.toISOString()
                }
                console.log(message, 'this is message')
                console.log('Message received : ', content)
                io.to(roomId).emit('receiveMessage', message)
            }
        })

        socket.on('joinRoom', (userId, roomIds) => {
            console.log(userId,roomIds, 'this is it')
            if (Array.isArray(roomIds) && roomIds.length > 0) {
                roomIds.forEach((roomId) => {
                    socket.join(roomId);
                });
            }

        })

        socket.on('roomUpdate', (roomId) => {
            if(roomId){
                io.to(roomId).emit('roomUpdate', roomId)
            }
        })

        socket.on('userKicked', (roomId, userId) => {
            if(roomId && userId){
                console.log(roomId, 'sr', userId, 'su')
                io.to(roomId).emit('userKicked', {roomId, userId})
            }
        })
    })
}