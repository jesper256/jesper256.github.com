
var main = function () {

    var areaWidth = 800;
    var areaHeight = 600;
    var gameRate = 1;
    var numberOfBoxes = 10;


    var walls = [{
        y: 0,
        x: 0,
        height: areaHeight,
        width: 1
    }, {
        y: 0,
        x: 0,
        height: 1,
        width: areaWidth
    }, {
        y: 0,
        x: areaWidth,
        height: areaHeight,
        width: 1
    }, {
        y: areaHeight,
        x: 0,
        height: 1,
        width: areaWidth
    }];

    var direction = {
        UP: 1,
        RIGHT: 2,
        DOWN: 3,
        LEFT: 4
    };

    var controls = function (e) {

        e = e || window.event;

        if (e.keyCode == '38') {
            console.log("up");
            viewModel.player().direction(direction.UP);
        }
        else if (e.keyCode == '40') {
            console.log("down");
            viewModel.player().direction(direction.DOWN);
        }
        else if (e.keyCode == '37') {
            console.log("left");
            viewModel.player().direction(direction.LEFT);
        }
        else if (e.keyCode == '39') {
            console.log("right");
            viewModel.player().direction(direction.RIGHT);
        }
    }

    document.onkeydown = controls;

    var viewModel = {
        numberOfBoxes: ko.observable(1),
        speed: ko.observable(1),
        autoPlay: ko.observable(false),
        boxes: ko.observableArray([]),
        player: ko.observable({
            score: ko.observable(0),
            x: ko.observable(100),
            y: ko.observable(100),
            direction: ko.observable(direction.RIGHT),
            height: ko.observable(20),
            width: ko.observable(20)
        })
    };


    viewModel.player().x.subscribe(function (xPos) {

        if (!viewModel.autoPlay())
            return;

        var x = viewModel.boxes()[0].x();
        var y = viewModel.boxes()[0].y();

        if (xPos >= (x + 3) || xPos <= (x + 3)) {
            var yPos = viewModel.player().y();
            if (yPos > y) {
                viewModel.player().direction(direction.UP);
            } else if (yPos < y) {
                viewModel.player().direction(direction.DOWN);
            }
            return;
        }

        if (xPos > x) {
            viewModel.player().direction(direction.LEFT);
        } else if (xPos < x) {
            viewModel.player().direction(direction.RIGHT);
        }
    });

    viewModel.player().y.subscribe(function (yPos) {

        if (!viewModel.autoPlay())
            return;

        var x = viewModel.boxes()[0].x();
        var y = viewModel.boxes()[0].y();

        if (yPos >= (y + 3) || yPos <= (y + 3)) {
            var xPos = viewModel.player().x();
            if (xPos > x) {
                viewModel.player().direction(direction.LEFT);
            } else if (xPos < x) {
                viewModel.player().direction(direction.RIGHT);
            }
            return;
        }


        if (yPos > y) {
            viewModel.player().direction(direction.UP);
        } else if (yPos < y) {
            viewModel.player().direction(direction.DOWN);
        }
    });

    viewModel.speed.subscribe(function (newValue) {
        console.log(newValue)
        restart();
    });

    viewModel.numberOfBoxes.subscribe(function (newValue) {
        viewModel.boxes.removeAll();

        setBoxes();
        restart();
    });


    var restart = function () {
        viewModel.player().direction(direction.RIGHT);
        viewModel.player().y(100);
        viewModel.player().x(100);
        viewModel.player().score(0);
        run();
    };

    var isCollisionObservable = function (observable1, observable2) {
        var rect1 = {
            y: observable1.y(),
            x: observable1.x(),
            height: observable1.height(),
            width: observable1.width()
        };

        var rect2 = {
            y: observable2.y(),
            x: observable2.x(),
            height: observable2.height(),
            width: observable2.width()
        };
        return isCollision(rect1, rect2);
    };


    var isCollision = function (rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
        );
    };

    var gameLoop = function () {

        var currentTop = viewModel.player().y();
        var currentLeft = viewModel.player().x();
        var currentDirection = viewModel.player().direction();


        var player = {
            y: currentTop,
            x: currentLeft,
            height: viewModel.player().height(),
            width: viewModel.player().width()
        }

        var crashed = false;

        for (var i = 0; i < walls.length; i++) {
            if (isCollision(walls[i], player)) {
                crashed = true;
                break;
            }
        }

        if (crashed) {
            restart();
            return;
        }



        ko.utils.arrayForEach(viewModel.boxes(), function (box) {

            if (isCollisionObservable(viewModel.player(), box)) {
                box.move();
                var newScore = viewModel.player().score() + 1;
                viewModel.player().score(newScore);
                return;
            }
        });


        if (currentDirection === direction.UP)
            viewModel.player().y((currentTop - parseInt(viewModel.speed())));
        else if (currentDirection === direction.DOWN)
            viewModel.player().y((currentTop + parseInt(viewModel.speed())));
        else if (currentDirection === direction.LEFT)
            viewModel.player().x((currentLeft - parseInt(viewModel.speed())));
        else if (currentDirection === direction.RIGHT)
            viewModel.player().x((currentLeft + parseInt(viewModel.speed())));

        run();

    };

    var run = function () {
        setTimeout(gameLoop, gameRate);
    };

    run();


    var getRandomNumberBetween = function (min, max) {
        return Math.floor(((Math.random() * max) + min));
    };


    var setBoxes = function () {

        for (var i = 0; i != viewModel.numberOfBoxes(); i++) {
            var rndColor = '#' + Math.random().toString(16).substring(2, 8);

            viewModel.boxes.push({
                height: ko.observable(20),
                width: ko.observable(20),
                y: ko.observable(getRandomNumberBetween(1, areaHeight - 20)),
                x: ko.observable(getRandomNumberBetween(1, areaWidth - 20)),
                color: ko.observable(rndColor),
                move: function () {

                    var newY = getRandomNumberBetween(1, areaHeight - this.height());
                    var newX = getRandomNumberBetween(1, areaWidth - this.width());

                    this.y(newY);
                    this.x(newX);

                    viewModel.boxes().sort(function (left, right) {
                        return left.x() < right.x()
                    });

                }
            });
        }
    };
    


    ko.applyBindings(viewModel);
};


main();