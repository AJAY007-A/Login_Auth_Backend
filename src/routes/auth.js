const express = require('express');
const { signup, login, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, getMe);

const passport = require('../lib/passport');
const jwt = require('jsonwebtoken');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Generate JWT
        const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        }))}`);
    }
);

module.exports = router;