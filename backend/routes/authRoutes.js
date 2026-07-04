const express = require('express');
const router = express.Router();
const { registerValidation,loginValidation,forgotPasswordValidation,resetPasswordValidation} = require("../validators/auth.validator");
// ---> NEW: Added updateWebhook to imports
const { register, login, getMe, googleLogin, updateAvatar, forgotPassword, resetPassword, updateWebhook } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerLimiter, loginLimiter, resetLimiter } = require('../middleware/rateLimiter');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

const { handleAvatarUpload } = require('../middleware/avatarUpload');

router.post('/login', loginValidation, loginLimiter, login);
router.post('/register', registerValidation, registerLimiter, register);
router.post('/google', loginLimiter, googleLogin);
router.get('/me', protect, getMe);
router.post('/avatar', protect, handleAvatarUpload, updateAvatar);

// ---> NEW: Webhook Settings Route (Protected)
router.put('/webhook', protect, updateWebhook);


router.post('/forgot-password', resetLimiter, forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:id/:token', resetLimiter, resetPasswordValidation, resetPassword);

module.exports = router;