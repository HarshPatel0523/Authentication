const express = require('express');

const router = express.Router();
const { uploadImage, fetchAllImages, deleteImage } = require('../controllers/image-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const uploadMiddleware = require('../middlewares/upload-middleware');

router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware, uploadImage);
router.get('/all', authMiddleware, fetchAllImages);
router.delete('/delete/:imageId', authMiddleware, adminMiddleware, deleteImage);

module.exports = router;