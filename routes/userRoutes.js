import express from 'express'
import { 
  registerUser, 
  authUser, 
  getUserProfile,
  updateUserProfile,
  searchUsers
} from '../controllers/userController.js'
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
  }
})

// Routes
router.route('/register').post(upload.single('profilePic'), registerUser)
router.post('/login', authUser)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profilePic'), updateUserProfile)
router.get('/', protect, searchUsers)

export default router