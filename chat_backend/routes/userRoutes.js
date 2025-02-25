import express from 'express'
import { deleteAccount, getUser, getUserIcon, updateUserName } from '../controllers/userController.js'

const router = express.Router()

router.get('/', getUser)
router.get('/icon', getUserIcon)
router.post('/updateName', updateUserName)
router.delete('/delete', deleteAccount)

export default router