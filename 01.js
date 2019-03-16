const app = new Vue({
  el: '#app',
  data: {
    images: [],
    imagesURL: [],
    imagesGroups: []
  },
  computed: {
    imagesTotal(){
      return this.images.reduce((sum, image) => {
        return sum + 1
      }, 0);
    }
  },
  methods: {
    randChunkSplit() {
      let size = 1;
      let max = 3;
      let min = 2;
      let contador = this.imagesGroups.length;
      while ( contador > 3) {
        size = Math.min(max, Math.floor((Math.random() * max) + min));
        this.imagesGroups.push(this.imagesGroups.splice(0, size));
      }
    }
  },
  created(){
    fetch('http://localhost:3000')
    .then(response => response.json())
    .then(json => {
      console.log('Imágenes obtenidas', json)
      this.images = json;
      this.imagesURL = json.map((el)=>{
        return 'images/resized/' + el
      });
      let max = 3;
      let min = 2;
      while ( this.imagesURL.length > 3) {
        size = Math.min(max, Math.floor((Math.random() * max) + min));
        this.imagesGroups.push(this.imagesURL.splice(0, size));
      }
      this.imagesGroups.push(this.imagesURL.splice(0, this.imagesURL.length));
      console.log("Grupos", this.imagesGroups);
    })
  }
});