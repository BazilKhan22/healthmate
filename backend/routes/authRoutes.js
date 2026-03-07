import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

export default router;