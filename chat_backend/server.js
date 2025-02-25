import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import messageRoutes from './routes/messageRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import cors from 'cors'
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupSocketEvents } from './socket.js';

const app = express();

app.use(cors());

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
      }
})

const PORT = process.env.PORT

const dbURL = process.env.MONGO_URI;

mongoose.connect(dbURL)
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((err) => console.log("Error connecting to MongoDB", err))

app.get('/', (req,res) => {
    res.send("Server is running")
})

// app.listen(PORT, () => {
//     console.log(`Example app listening on port ${PORT}`)
// })

app.use(express.json())

app.use("/api/message", messageRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/room", roomRoutes)
app.use("/api/image", imageRoutes)

setupSocketEvents(io)

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
