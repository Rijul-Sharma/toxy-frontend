import express from 'express'
import { createRoom, joinRoom, exitRoom, getRoomInfo, changeAdmin, kickMember, getRooms, editRoom } from '../controllers/roomController.js'

const router = express.Router()

router.post('/create', createRoom)
router.post('/join', joinRoom)
// router.get('/getUsers', getRoomUsers)
router.delete('/exit', exitRoom)
router.get(`/info`, getRoomInfo)
router.post(`/allrooms`, getRooms)
router.post(`/admin`, changeAdmin)
router.post(`/kick`, kickMember)
router.post('/edit', editRoom)

export default router