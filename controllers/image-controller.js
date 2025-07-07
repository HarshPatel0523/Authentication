const Image = require('../models/Image');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const cloudinary = require('../config/cloudinary')

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image file.',
            });
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path);

        const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId, 
        });

        await newImage.save();

        // fs.unlinkSync(req.file.path); // Remove the file from local storage after uploading to Cloudinary

        return res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newImage,
        });
    } catch (error) {
        console.log('Error uploading image:', error);
        return res.status(500).json({
            success: false,
            message: 'Some error occurred while uploading the image',
        });
    }
}

const fetchAllImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find()
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: totalPages,
            totalImages: totalImages,
            data: images
        });
    } catch (error) {
        console.log('Error fetching images:', error);
        return res.status(500).json({
            success: false,
            message: 'Some error occurred while fetching images',
        });
    }
}

const deleteImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const userId = req.userInfo.userId; 

        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        //check if the user is authorized to delete the image
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image',
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // Delete from database
        await Image.findByIdAndDelete(imageId);

        return res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
        });
    } catch (error) {
        console.log('Error deleting image:', error);
        return res.status(500).json({
            success: false,
            message: 'Some error occurred while deleting the image',
        });
    }
}

module.exports = {
    uploadImage,
    fetchAllImages,
    deleteImage
};