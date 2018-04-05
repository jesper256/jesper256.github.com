
Vue.component('button-counter', {
    data: function () {
      return {
        likes: 0,
        dislikes: 0,
      }
    },
    template: '<div><button v-on:click="likes++">Likes {{ likes }} </button><button v-on:click="dislikes++">Dislikes {{ dislikes }} </button></div>'
  });

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello super mega cool cat! ' + new Date().toLocaleString(),
        catNamePrefix: "Cool ",
        showCats: true,
        cats: [
            { name: 'Cool cat', id: 0, prefix: this.catNamePrefix },
            { name: 'Yellow Vue cat', id: 1, prefix: this.catNamePrefix },
            { name: 'No cat at all', id: 2, prefix: this.catNamePrefix }
        ]
    },
    methods: {
        addCat: function () {
            this.cats.push({ name: 'cat #' + this.cats.length, id: this.cats.length, prefix: this.catNamePrefix });
        },
        removeCat: function (cat) {
            this.cats = this.cats.filter(function (c) { return c.id !== cat.id });
        }
    }
});

