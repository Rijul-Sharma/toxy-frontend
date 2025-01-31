import express from 'express'
import { getAllMessages, saveMessage } from '../controllers/messageController.js'

const router = express.Router()

router.get('/', getAllMessages)
router.post('/save', saveMessage)
    
export default router