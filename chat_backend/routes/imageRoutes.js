import express from 'express'
import { uploadImage, deleteImage  } from '../controllers/imageController.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

router.post('/upload', upload.single('image'), uploadImage)
router.post('/delete', deleteImage);

export default router
