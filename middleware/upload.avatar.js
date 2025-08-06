const path = require('path');
const statusHelper = require('../utils/status.helper');


const multer = require('multer');
const errorHelper = require('../utils/error.helper');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = `user-${Date.now()}${ext}`;
        cb(null, fileName);
    },
})
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType == 'image') {
        cb(null, true);
    } else {
        const error = errorHelper.create('Invalid file type', 400,statusHelper.FAIL);
        cb(error, false);
    }
};
const upload = multer({storage: diskStorage, fileFilter: fileFilter});

module.exports = upload;