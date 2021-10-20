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

        guac.onstatechange = function (state) {
            console.log(`State changed: ${state}`);
            if (thisClass.onstatechange) {
                thisClass.onstatechange(state);
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

        guac.onaudio = function (stream,mimetype) {
            console.log(`onaudio! mimetype: ${mimetype}`);
            //return null;
            //startAudio = true;
            return null;
            
        }

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
        var keyboard = new Guacamole.Keyboard(document);


        const keyDownFunc = function (keysym) {
            //console.log("onkeydown");
            //console.log(keysym);
            guac.sendKeyEvent(1, keysym);

        };
        keyboard.onkeydown = keyDownFunc;   
        keyboard.onkeyup = keyUpFunc;
        
        const keyUpFunc = function (keysym) {
            //console.log("onkeyup");
            //console.log(keysym);
            guac.sendKeyEvent(0, keysym);
        };

        this.onEnd = function () {
            console.log('GuacClient. onEnd..');
            keyboard.onkeydown = null;   
            keyboard.onkeyup = null;
            mouse.onmousedown = null;
            mouse.onmouseup = null;
            mouse.onmousemove = null;
            guac.disconnect();
        }
    }


    end() {
        if (this.onEnd) {
            this.onEnd();
        }
    }
}

export default GuacClient;