const {resize_images } = require('./util.local');

test('the array of local images should be and Array', () => {
const serv = resize_images('./images');
console.log(serv)
expect(serv).toEqual([]);
});