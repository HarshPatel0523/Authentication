const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the home page',
    });
});

module.exports = router; 