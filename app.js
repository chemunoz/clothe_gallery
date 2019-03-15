const puppeteer = require('puppeteer');
const request = require('request');
const jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const http = require ("http");
const url = require('url');
 

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
      // console.log(`Guardando ${my_image}...`);
      let writeStream = fs.createWriteStream(`./images/${my_image}`);
      writeStream.on('error', function (err) {
        console.log("ERROR Stream Capturado", err);
      });
      console.log(element);
      request(element).pipe(writeStream).on('error', error => {
        console.log("requeusst error", error)
      });;
    }
  })
  
  await page.tracing.stop();
  await browser.close()
  arr_img = resize_images();
  server(arr_img);
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

function server(arr){
  // fs.readFile('./index.html', function (err, html) {

    http.createServer(function(req, res){
      let urlParts = url.parse(req.url);

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Request-Method', '*');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
      res.setHeader('Access-Control-Allow-Headers', '*');

      switch(urlParts.pathname) {
        case "/photos":
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(arr))
          break;
        default:
          res.setHeader("Content-Type", "text/html");
          res.write(html);
          res.end(); 
          break;
    } 
    }).listen(3000);
  // });
  console.log(`\Sirviendo imágenes descargadas en http://localhost:3000/photos \nAcceda al fichero "index.html"`);
}