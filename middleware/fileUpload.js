const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const saveType = !req.body.title ? '/profile' : '/event';
        cb(null, './public/uploads'+saveType);
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
    }
});

const upload = multer({storage: storage}).single('imagePost');

module.exports = upload;