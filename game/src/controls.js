define(["jquery","board", "data", "player"], function ($,board, data, player) {
    "use strict";

    var Tangle = window.Tangle
        , controls
        , controlSystem = {
            addSettingsTo: function () { },
            applySettings: function () { }
        };

    controls = {
        left: function () { player.moveLeft(board); },
        right: function () { player.moveRight(board); },
        togglePlay: function () {
        },
        teardown: function () {
        }

    };

    controlSystem.toggleControls = (function () {
        var createWith;
        var currentControls = false;
        var cvs;
        var hero;
        var toggle;
        var toMouse;
        var toKeyboard;

        controlSystem.control = Object.create(controls);

        createWith = function (ctor) {
            controlSystem.control.teardown();
            controlSystem.control = ctor(hero, cvs);
        };

        toMouse = function () {
            createWith(createMouseControls);
            toggle = toKeyboard;
        };

        toKeyboard = function () {
            createWith(createKeyboardControls);
            toggle = toMouse;
        };

        toKeyboard();

        return function (controlType, $player, canvas) {
            if (currentControls !== controlType) {
                data.collectDataAsync("Controls", "ControlType", controlType);
                hero = $player;
                cvs = canvas;
                toggle();
            }
        };
    })();

    function createKeyboardControls() {
        var self = Object.create(controls);
        var leftArrow = 37;
        var rightArrow = 39;
        var spaceBar = 32;

        var listener = function (event) {
            var key = event.keyCode;

            if (key === leftArrow) {
                //self.left();
                player.vspeed = -5;
                event.preventDefault();
            } else if (key === rightArrow) {
                //self.right();
                player.vspeed = 5;
                event.preventDefault();
            } else if (key === spaceBar) {
                self.togglePlay();
                event.preventDefault();
            }
        };

        document.addEventListener('keydown', listener);

        var releaseListener = function (event) {
            var key = event.keyCode;

            if (key === leftArrow) {
                //self.left();
                player.vspeed = 0;
                event.preventDefault();
            } else if (key === rightArrow) {
                //self.right();
                player.vspeed = 0;
                event.preventDefault();
            } else if (key === spaceBar) {
                self.togglePlay();
                event.preventDefault();
            }
        };

        document.addEventListener('keyup', releaseListener);

        self.teardown = function () {
            document.removeEventListener('keydown', listener);
            player.vspeed = 0;
        };

        return self;
    }

    function createMouseControls(ref, canvas) {
        var self = Object.create(controls);

        function pointerToTheLeft(e) {
            return ref.X + canvas.offsetLeft > e.pageX;
        }

        function pointerToTheRight(e) {
            return ref.X + canvas.offsetLeft < e.pageX;
        }

        document.onmousemove = function (e) {
            if (pointerToTheLeft(e)) {
                self.left();
            } else if (pointerToTheRight(e)) {
                self.right();
            }
        };

        var listener = function (event) {
            var key = event.keyCode;
            var spaceBar = 32;

            if (key === spaceBar) {
                self.togglePlay();
                event.preventDefault();
            }
        };

        document.addEventListener('keydown', listener);

        self.teardown = function () {
            document.onmousemove = null;
            document.onmousedown = null;
            document.removeEventListener('keydown', listener);
        };

        return self;
    }

    controlSystem.ct = (function () {
        var t = null, e = $("#controls")[0];
        if (e) {
            t = new Tangle(e, {
                initialize: function () {
                    this.controlType = false;
                },
                update: function () {
                    this.controlInstructions = this.controlType;
                    controlSystem.toggleControls(this.controlType, player, board.canvas());
                }
            });
        }
        return t;
    }
)();

    return controlSystem;
});