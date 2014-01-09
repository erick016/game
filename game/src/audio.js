//test
define(function () {
    var self = {};
    helloWorld = function () {
        console.log("Hello world.");
    }

    self.createAudioContext = function () {

        var context;

        self.init = function () {
            try {
                // Fix up for prefixing
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                context = new AudioContext();
            }
            catch (e) {
                alert('Web Audio API is not supported in this browser');
            }
        }
        return context;
    }

    //window.addEventListener('load', init, false);

    self.loadSound = function (url,context) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                thisSoundBuffer = buffer;
            }, onError);
        }
        request.send();
        return thisSoundBuffer;
    }

    self.playSound = function (buffer) {
        var source = context.createBufferSource(); // creates a sound source
        source.buffer = buffer;                    // tell the source which sound to play
        source.connect(context.destination);       // connect the source to the context's destination (the speakers)
        source.start(0);                           // play the source now
        // note: on older systems, may have to use deprecated noteOn(time);
    }
    return self;
});
