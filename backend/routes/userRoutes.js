import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/forgot', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', protect, getCurrentUser);
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;
