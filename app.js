const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const path = require('path');
const jimp = require('jimp');

// ZARA.COM
(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.tracing.start({path: 'trace.json', categories: ['devtools.timeline']})
  console.log("Cargando web Zara.com...")
  await page.goto('https://www.zara.com/es/es/hombre-prendas-exterior-l715.html?v1=1181226')
  
  // Hacemos scroll hasta el final para cargar todas las imagenes
  await autoScroll(page);

  // Seleccionamos la IMGs de toda la web
  const images = await page.$$eval('img._img', anchors => { return anchors.map(anchor => anchor.src) })
  console.log(`Recuperadas ${images.length} imágenes`)

  // Recorremos el array guardando cada imagen en local
  images.forEach((element, index) => {
    let my_image = element.split('/')[element.split('/').length-1].split('?')[0];
    if (my_image.indexOf("background") === -1){
      console.log(`Guardando ${my_image}...`);
      request(element).pipe(fs.createWriteStream(`./images/${my_image}`));
    }
  })
  
  await page.tracing.stop();
  await browser.close()
  resize_images();
})()


async function autoScroll(page){
  console.log("Haciendo scroll en la web...")
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}


//LOCAL...
function resize_images(){
  const folder = './images/';

  fs.readdir(folder, (err, files) => {
    files.forEach(file => {
      if (file !== '.DS_Store' && file.indexOf('.jpg') > -1){
        console.log(`Redimensionando (75%) ${file}`);
        jimp.read(path.join(folder, file))
        .then(image => {
          return image
            .scale(0.75)
            .write(path.join('images', 'resized', file)); // save
        })
        .catch(err => {
          console.error(file  +": "+ err);
        });

      }
    });
  });
  
}