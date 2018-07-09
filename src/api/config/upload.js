var multer = require('multer');
var common = require('../../../common');
var moment = require('moment');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, common.rootPath + '/photos')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + moment().format(common.dateFormat))
  }
});
var upload = multer({ storage: storage });