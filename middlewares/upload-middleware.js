const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + path.extname(file.originalname));
    }
});

const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    } else {
        cb('Error: File upload only supports image files.', false);
    }
}

const upload = multer({ 
    storage: storage, 
    fileFilter: checkFileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } 
}).single('image');

module.exports = upload;