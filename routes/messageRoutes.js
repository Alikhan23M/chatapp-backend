import express from 'express'
import { 
  sendMessage,
  getAllMessages
} from '../controllers/messageController.js'
import { protect } from '../middleware/authMiddleware.js'
import multer from 'multer'

const router = express.Router()

// Setup file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

router.route('/').post(protect, upload.array('files', 5), sendMessage)
router.route('/:chatId').get(protect, getAllMessages)

export default router