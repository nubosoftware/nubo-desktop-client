import Guacamole from 'guacamole-common-js';

class GuacClient {
    constructor(display,width, height,sessID,url) {
        console.log(`GuacClient. sessID: ${sessID}, width: ${width}, height: ${height}`);
        this.display = display;
        this.width = width;
        this.height = height;
        this.sessID = sessID;
        this.guacURL = url;
        this.start();
    }
    start() {
        if (!this.guacURL) {
            this.guacURL = "/guacWebSocket";
        }

        var tunnel = new Guacamole.WebSocketTunnel(this.guacURL);
        tunnel.onstatechange = function (state) {
            console.log(`Tunnel state changed: ${state}`);
            if (state == Guacamole.Tunnel.State.CLOSED) {
                if (guac) {
                    guac.disconnect();
                }
            }
        }
        var guac = new Guacamole.Client(
            tunnel
        );
        //this.guac = guac;

        

        //guac.sendSize(this.width,this.height);

        // Add client to display div
        this.display.appendChild(guac.getDisplay().getElement());


        guac.onname = function (name) {
            console.log(`Name changed: ${name}`);
        }

        const thisClass = this;

        const AUDIO_INPUT_MIMETYPE = 'audio/L16;rate=44100,channels=2';

        var requestAudioStream = function requestAudioStream(client) {

            // Create new audio stream, associating it with an AudioRecorder
            var stream = client.createAudioStream(AUDIO_INPUT_MIMETYPE);
            var recorder = Guacamole.AudioRecorder.getInstance(stream, AUDIO_INPUT_MIMETYPE);
    
            // If creation of the AudioRecorder failed, simply end the stream
            if (!recorder)
                stream.sendEnd();
    
            // Otherwise, ensure that another audio stream is created after this
            // audio stream is closed
            else {
                recorder.onclose = requestAudioStream.bind(this, client);
                console.log(`requestAudioStream. stream and recorder created!`);
            }
    
        };

        let videoTypes = Guacamole.VideoPlayer.getSupportedTypes();
        let audioType = Guacamole.AudioPlayer.getSupportedTypes();
        console.log("videoTypes",videoTypes);
        console.log("audioType",audioType);
        

        guac.onstatechange = function (state) {
            console.log(`State changed: ${state}`);
            if (thisClass.onstatechange) {
                thisClass.onstatechange(state);
                if (state == 3) {
                    requestAudioStream(guac);
                }
            }
        }

        // Error handler
        guac.onerror = function(error) {
            console.error(error);
            //alert(`Error: ${JSON.stringify(error,null,2)}`);
            if (thisClass.onerror) {
                thisClass.onerror(error);
            }
        };

        //let startAudio = false;

        /*guac.onaudio = function (stream,mimetype) {
            console.log(`onaudio. mimetype: ${mimetype}`);
            //return null;
            //startAudio = true;
            return null;
            
        }*/

        // Connect
        guac.connect(`sessID=${this.sessID}&width=${this.width}&height=${this.height}`);

        // Disconnect on close
        window.onunload = function() {
            guac.disconnect();
        }

        this.guac = guac;

        // Mouse
        var mouse = new Guacamole.Mouse(this.display);

        const handleMouseEvent = function (state) {

            // Do not attempt to handle mouse state changes if the client
            // or display are not yet available
            //console.log("handleMouseEvent");
            //console.log(event);
            if (!guac)
                return;

            //event.stopPropagation();
            //event.preventDefault();

            // Send mouse state, show cursor if necessary
            //guac.getDisplay().showCursor(true);
            guac.sendMouseState(state);
            /*if (startAudio) {
                console.log('starting audio...')
                let context = Guacamole.AudioContextFactory.getAudioContext()
                context.resume().then(() => {
                    startAudio = false;
                    console.log('play audio')
                })
            };*/

        };
        mouse.onmousedown = handleMouseEvent;
        mouse.onmouseup = handleMouseEvent;
        mouse.onmousemove = handleMouseEvent;

        /*mouse.onEach(['mousedown', 'mouseup', 'mousemove'], function sendMouseEvent(e) {
            guac.sendMouseState(e.state);
        });*/

        // Keyboard

        var sink = new Guacamole.InputSink();
        document.body.appendChild(sink.getElement());


        var keyboard = new Guacamole.Keyboard(document);
        keyboard.listenTo(sink.getElement());
        


        const keyDownFunc = function (keysym) {
            console.log(`onkeydown: keysym: ${keysym}`);
            //console.log(keysym);
            guac.sendKeyEvent(1, keysym);
            //event.preventDefault();

        };

        const keyUpFunc = function (keysym) {
            //console.log("onkeyup");
            //console.log(keysym);
            guac.sendKeyEvent(0, keysym);
        };


        window.onblur = function() {
            console.log(`onblur..`);
            keyboard.reset();
        }
        keyboard.onkeydown = keyDownFunc;   
        keyboard.onkeyup = keyUpFunc;
        
       

        this.onEnd = function () {
            console.log('GuacClient. onEnd..');
            keyboard.onkeydown = null;   
            keyboard.onkeyup = null;
            mouse.onmousedown = null;
            mouse.onmouseup = null;
            mouse.onmousemove = null;
            guac.disconnect();
        }

        // Automatically update the client thumbnail
        guac.onsync = function syncReceived(ts) {

            //var thumbnail = managedClient.thumbnail;
            //var timestamp = new Date().getTime();

            // Update thumbnail if it doesn't exist or is old
            /*if (!thumbnail || timestamp - thumbnail.timestamp >= THUMBNAIL_UPDATE_FREQUENCY) {
                $rootScope.$apply(function updateClientThumbnail() {
                    ManagedClient.updateThumbnail(managedClient);
                });
            }*/
            console.log(`onsync: ${ts}`)

        };

        // Test for argument mutability whenever an argument value is
        // received
        guac.onargv = function clientArgumentValueReceived(stream, mimetype, name) {

            console.log(`onargv.  mimetype: ${mimetype}, name: ${name}`)
            // Ignore arguments which do not use a mimetype currently supported
            // by the web application
            if (mimetype !== 'text/plain')
                return;

            var reader = new Guacamole.StringReader(stream);

            // Assemble received data into a single string
            var value = '';
            reader.ontext = function textReceived(text) {
                value += text;
            };

            // Test mutability once stream is finished, storing the current
            // value for the argument only if it is mutable
            reader.onend = function textComplete() {
                /*ManagedArgument.getInstance(managedClient, name, value).then(function argumentIsMutable(argument) {
                    managedClient.arguments[name] = argument;
                }, function ignoreImmutableArguments() {});*/
                console.log(`onargv.  onend. value: ${value}`);
            };

        };

        // Handle any received clipboard data
        guac.onclipboard = function clientClipboardReceived(stream, mimetype) {

            console.log(`onclipboard.  mimetype: ${mimetype}`)
            var reader;

            // If the received data is text, read it as a simple string
            if (/^text\//.exec(mimetype)) {

                reader = new Guacamole.StringReader(stream);

                // Assemble received data into a single string
                var data = '';
                reader.ontext = function textReceived(text) {
                    data += text;
                };

                // Set clipboard contents once stream is finished
                reader.onend = function textComplete() {
                    /*clipboardService.setClipboard(new ClipboardData({
                        source : managedClient.id,
                        type : mimetype,
                        data : data
                    }))['catch'](angular.noop);*/
                    console.log(`onclipboard.  onend. data: ${data}`);
                };

            }

            // Otherwise read the clipboard data as a Blob
            else {
                reader = new Guacamole.BlobReader(stream, mimetype);
                reader.onend = function blobComplete() {
                    /*clipboardService.setClipboard(new ClipboardData({
                        source : managedClient.id,
                        type : mimetype,
                        data : reader.getBlob()
                    }))['catch'](angular.noop);*/
                };
            }

        };
    }

    reportWindowSize(x,y) {
        console.log('Send new size...');
        this.width = x;
        this.height = y;
        this.guac.sendSize(this.width,this.height);
    }


    end() {
        if (this.onEnd) {
            this.onEnd();
        }
    }
}

export default GuacClient;