
Vue.component('cat-component', {
    props: {
        data: {
            type: Object
        }
    },    
    data: function(){ return { catImage: "" } },
    template: '<div><img :src="catImage"><button @click="removeCat(cat)">remove cat</button></div>',
    methods: {
        removeCat: function () {
            this.$parent.removeCat(this.data);
        }
    }
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

