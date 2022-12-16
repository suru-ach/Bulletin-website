// multer is used for file upload here
const path = require('path');
const multer = require('multer');

// diskStorage access is given for file saving in public
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `img_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage }).single('eventImage');

module.exports = upload;