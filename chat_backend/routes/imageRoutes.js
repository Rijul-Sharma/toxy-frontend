import express from 'express'
import { uploadImage } from '../controllers/imageController.js'

import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage()
});


const router = express.Router()

router.post('/upload', upload.single('image'), uploadImage)

export default router
