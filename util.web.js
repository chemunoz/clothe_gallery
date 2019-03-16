const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');


// ZARA.COM
exports.zara = async (url) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.tracing.start({path: 'trace.json', categories: ['devtools.timeline']})
  console.log("Cargando web Zara.com...")
  await page.goto(url)
  
  // Hacemos scroll hasta el final para cargar todas las imagenes
  await autoScroll(page);

  // Seleccionamos la IMGs de toda la web
  const images = await page.$$eval('img._img', anchors => { return anchors.map(anchor => anchor.src) })
  console.log(`Identificadas ${images.length} imágenes`)

  // Recorremos el array guardando cada imagen en local
  console.log("Obteniendo imágenes...")
  images.forEach((element, index) => {
    let image_name = element.split('/')[element.split('/').length-1].split('?')[0];
    if (image_name.indexOf("background") === -1){
      console.log(`   ${element}`);
      // console.log(`Guardando ${image_name}...`);
      let writeStream = fs.createWriteStream(`./images/${image_name}`);
      request(element).pipe(writeStream).on('error', error => {
        console.log("request error", error)
      });
    }
  })
  
  await page.tracing.stop();
  await browser.close()
}


async function autoScroll(page){
  console.log("Scroll en la web para visualizar imágenes...")
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