const { zara } = require('./util.web');
const { resize_images } = require('./util.local');
const { server } = require('./util.server');

const initApp = () => {
  zara('https://www.zara.com/es/es/hombre-prendas-exterior-l715.html?v1=1181226')
  .then(() => {
    let arr_img = resize_images();
    server(arr_img);
  });
};

initApp();