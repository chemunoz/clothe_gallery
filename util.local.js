const jimp = require('jimp');
const fs = require('fs');
const path = require('path');


exports.resize_images = (folder) => {
  console.log(`Redimensionando imágenes al 75%...`);
  let array_images = [];

  fs.readdir(folder, (err, files) => {
    files.forEach(file => {
      if (file !== '.DS_Store' && file.indexOf('.jpg') > -1){
        // console.log(`Redimensionando (75%) ${file}`);
        array_images.push(file);
        jimp.read(path.join(folder, file))
        .then(image => {
          return image
            .scale(0.75)
            .write(path.join('images', 'resized', file)); // save
        })
        .catch(err => {
          // console.error(file  +": "+ err);
        });
      }
    });
  });
  return array_images;
}
