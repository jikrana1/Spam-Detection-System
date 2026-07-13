// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controllers import
const {
  register,
  login,
  logout,
  getMe,
  googleLogin,
  updateAvatar,
  forgotPassword,
  resetPassword,
  changePassword,
  updateWebhook,
  getSessionStatus,
  assignRole,
  getUserPermissions,
  getRolesAndPermissions
} = require('../controllers/authController');

// Validators import (For Issue #805)
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../validators/auth.validator');

// Middleware import
const { protect } = require('../middleware/authMiddleware');
const {
  registerLimiter,
  loginLimiter,
  resetLimiter,
  apiLimiter
} = require('../middleware/rateLimiter');

// Multer setup for avatar upload
const upload = multer();

// ============================================
// AUTH ROUTES (Validation Middleware Applied Here)
// ============================================

// Public routes
router.post('/register', registerLimiter, registerValidation, register);
router.post('/login', loginLimiter, loginValidation, login);
router.post('/google', apiLimiter, googleLogin);
router.post('/forgot-password', resetLimiter, forgotPasswordValidation, forgotPassword);
router.get('/roles', getRolesAndPermissions);

// Protected routes (require authentication via `protect` middleware)
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/avatar', protect, upload.single('avatar'), updateAvatar);
router.post('/reset-password/:id/:token', resetPasswordValidation, resetPassword);
router.post('/change-password', protect, changePassword);
router.put('/webhook', protect, updateWebhook);
router.get('/session-status', protect, getSessionStatus);

// Admin routes
router.post('/admin/assign-role', protect, assignRole);
router.get('/admin/user-permissions/:userId', protect, getUserPermissions);

module.exports = router;