const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const fs = require('fs');
const common = require('../common');
const path = require('path');
const photoFix = require('../src/api/config/photos');
const bluebird = require('bluebird');
const archive = require('../src/api/config/archive');

function deleteAllInDirectory(photoPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(photoPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        files.forEach((photo) => {
          fs.unlink(path.join(photoPath, photo), (e) => {
            if (e) {
              reject(e);
            } else {
              resolve();
            }
          });
        });
      }
    });
  });
}

module.exports.seedPhoto = function (user) {
  // remove all photos from DB
  Photo.remove({}, (err) => {
    if (err) {
      throw err;
    }
    // delete all photo files
    const photosPath = path.join(common.rootPath, 'public/photos');

    // fs.readdir(photoPath, (err, files) => {
    //   if (err) {
    //     throw err;
    //   } else {
    //     files.forEach((photo) => {
    //       fs.unlink(path.join(photoPath, photo), (err) => {
    //         throw err;
    //       });
    //     });
    //   }
    // });
    // delete zip file if one exists
    fs.unlink(path.join(common.rootPath, 'public/Skipg.zip'), (err) => {
      if (err.code === 'ENOENT') {
        console.warn('No zip file to delete!')
      } else {
        throw err;
      }
    });
    // copy see photo to photos dir
    const readStream = fs.createReadStream(path.join(common.rootPath, 'seed/seedPhoto.jpeg'));
    const writeStream = fs.createWriteStream(path.join(common.rootPath, 'public/photos/photo-seed--test.jpeg'));

    readStream.on('error', (err) => {
      throw err;
    });
    writeStream.on('error', (err) => {
      throw err;
    });

    readStream.on('close', function () {
      console.warn('SEED PHOTO READ!');
    });

    readStream.pipe(writeStream);

    // add transform photo and add to DB
    const promiseArr = [photoFix.removeExif, photoFix.createThumb];
    // // remove geo tag data
    bluebird.map(promiseArr, (step) => {
      return step({ filename: 'photo-seed--test.jpeg', path: path.join(common.rootPath, 'public/photos/photo-seed--test.jpeg') });
    })
      .then((result) => {
        let photo = new Photo();
        photo.fillDetails(result);
        photo.timestamp();
        photo.uploadedBy = user._id;
        photo.fileName = 'photo-seed--test.jpeg';
        photo.tags = ['seed', 'test'];
        photo.comments = [];
        photo.save((err) => {
          if (err) {
            throw err;
          } else {
            archive.makeZip();
          }
        })
      })
      .catch((error) => {
        throw error;
      });
  });
};