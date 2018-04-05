var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue! ' + new Date().toLocaleString(),
        catNamePrefix: "Cool ",
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