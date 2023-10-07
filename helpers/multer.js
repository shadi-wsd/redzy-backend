const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/wsd/backendImgs/public/uploads'); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Set a unique filename for each uploaded file
    },
});


const upload = multer({ storage });

module.exports = {
    upload
}
