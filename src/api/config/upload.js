var multer = require('multer');
var common = require('../../../common');
var moment = require('moment');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dest = path.join(common.rootPath + '/public/photos');
    cb(null, dest);
  },
  fileFilter: function (req, file, cb) {
    if (!file) {
      cb();
    }
    var image = file.mimetype.startsWith('image/');
    if (image) {
      cb(null, true);
    } else {
      console.log('file not supported');
      return cb();
    }
  },
  filename: function (req, file, cb) {
    var ext = file.mimetype.split('/')[1];
    var photoName = file.fieldname + '-' + moment().format(common.photoDateFormat) + '.' + ext;
    cb(null, photoName);
  }
});

var upload = multer({ storage: storage });
module.exports = upload;