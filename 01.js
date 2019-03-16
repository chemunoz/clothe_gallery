const app = new Vue({
  el: '#app',
  data: {
    images: [],
    imagesURL: [],
    imagesGroups: []
  },
  computed: {
    imagesTotal(){
      return this.images.length;
    },
    groupsTotal(){
      return {
        total: this.imagesGroups.length,
        group2: this.imagesGroups.filter((element => element.length ===2 )).length,
        group3: this.imagesGroups.filter((element => element.length === 3)).length
      }
    }
  },
  methods: {
    randomGroups() {
      this.imagesGroups = [];
      let max = 3;
      let min = 2;
      console.log(this.imagesURL.length);
      while ( this.imagesURL.length > 3) {
        (this.imagesURL.length === max+1) ? size = 2 : size = Math.min(max, Math.floor((Math.random() * max) + min));
        this.imagesGroups.push(this.imagesURL.splice(0, size));
      }
      this.imagesGroups.push(this.imagesURL.splice(0, this.imagesURL.length));
      console.log("Grupos", this.imagesGroups);
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
      this.randomGroups();
    })
  }
});