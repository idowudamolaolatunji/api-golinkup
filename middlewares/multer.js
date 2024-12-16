const multer = require('multer');
// const sharp = require('sharp');


//////////////////////////////////////////////////
//// MULTER STORAGE ////
//////////////////////////////////////////////////
const multerStorage = multer.memoryStorage();


//////////////////////////////////////////////////
//// MULTER FILTER ////
//////////////////////////////////////////////////
const multerFilter = (req, file, cb) => {
    try {
        if (file.mimetype.startsWith('image') || file.mimetype.startsWith("video") || file.mimetype.startsWith("audio")) {
            cb(null, true);
        } else {
            throw new Error('Not a Vaild file! Please upload only accepted files');
        }
    } catch (error) {
        cb(error, false);
    }
}


//////////////////////////////////////////////////
//// MULTER UPLOAD ////
//////////////////////////////////////////////////
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 1024 * 1024 * 5 }
});


//////////////////////////////////////////////////
//// MULTER UPLOADS ////
//////////////////////////////////////////////////
exports.uploadSingleImage = upload.single('image');
exports.uploadMultipleImage = upload.array('images', 4);


//////////////////////////////////////////////////
//// SHARP RESIZE COLLECTION IMAGE ////
//////////////////////////////////////////////////
exports.resizeSingleDisplayImage = async function (req, _, next) {
    if(!req.file) return next();
    const { id } = req.params;

    try {
        req.file.filename = `display-${id}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 75 })
            .toFile(`public/images/${req.file.filename}`);
        next();

    } catch(err) {
        next(err);
    }
};