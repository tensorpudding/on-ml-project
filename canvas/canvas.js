/*
    canvas.js
    Code to drive canvas input to TF model UI
*/

// Server connection handling code
// Uses unprotected WebSockets connection to server running tf-server.py

let WS_HOST = "dev.moorman.xyz";
let WS_PORT = 8850;

let server_socket = new WebSocket(`ws://${WS_HOST}:${WS_PORT}`, "tf");

server_socket.onopen = function (e) {
    console.log("Connected to websocket");
}
server_socket.onerror = function (error) {
    console.error(`Error detected in websocket`);
}

server_socket.onclose = function (e) {
    console.error("Lost connection with websocket");
}

server_socket.onmessage = function (e) {
    print_prediction(e.data);
    console.log(`Received TF model prediction: ${e.data}`);
} 

// Response event handlers:

print_prediction = function (value) {
    //tb = document.getElementById('prediction');
    //tb.value = `TF model predicts: ${value}`;
    bot_predict(value);
};

// Top-level event handlers:

// Initial code to setup when loading page
window.addEventListener("load", initialize_canvas);
// When the user resizes the window, dynamically resize canvas
window.addEventListener("onresize", resize_canvas, false);

var is_painting = false;
var m = 1;
function initialize_canvas(e) {
    var canvas = document.getElementById('user_canvas');
    var context = canvas.getContext('2d');

    // Variables to describe pointer position in the canvas
    var x;
    var y;

    // Event listeners for drawing on the canvas

    canvas.addEventListener("pointerdown", on_pointer_down, false);
    canvas.addEventListener("pointermove", on_pointer_move, false);
    canvas.addEventListener("pointerup", on_pointer_up, false);
    canvas.addEventListener("pointerout", on_pointer_out, false);

    // Event listeners 
    var submit_button = document.getElementById('submit');
    submit_button.addEventListener("click", submit);
    var reset_button = document.getElementById('reset');
    reset_button.addEventListener("click", reset_canvas);

    // Now that we have a window, resize the canvas to the right size, and prepare it for working
    resize_canvas();
    reset_canvas();
}

function resize_canvas() {
    var canvas = document.getElementById('user_canvas');
    var w = window.innerWidth;
    var h = window.innerHeight;
    var l = 0.9*Math.min(w,h) - (0.9 * Math.min(w,h) % 128);
    m = l / 128.0;
    canvas.width = l;
    canvas.height = l;
}

function draw(x, y) {
    var canvas = document.getElementById('user_canvas');
    var context = canvas.getContext('2d');
    context.fillRect(x, y, 7*m, 7*m);
    console.log(`drawing! with ${m}`);
}

function on_pointer_down(e) {
    is_painting = true;
    draw(x, y);
    var div_canvas = document.getElementById('canvas');
    div_canvas.addEventListener("touchmove", no_swiping, {passive: false});
}

function no_swiping(e) {
    console.log("event fired!");
    console.log("swipe prevented!");
    e.preventDefault();
    e.returnValue = false;
    return false;
}

function on_pointer_move(e) {
    x = e.offsetX == undefined ? e.layerX : e.offsetX;
    y = e.offsetY == undefined ? e.layerY : e.offsetY;
    if (is_painting) {
        draw(x, y);
    }
}

function on_pointer_up(e) {
    is_painting = false;
    var div_canvas = document.getElementById('canvas');
    div_canvas.removeEventListener("touchmove", no_swiping, {passive: false});
}

function on_pointer_out(e) {
    is_painting = false;
    var div_canvas = document.getElementById('canvas');
    div_canvas.removeEventListener("touchmove", no_swiping, {passive: false});
}


function submit(e) {
    var canvas = document.getElementById('user_canvas');
    img_data = canvas.toDataURL();
    if (server_socket.readyState === 1)
    {
        server_socket.send(img_data);
        console.log(`Sent image to websocket`)
    }
    else
    {
        console.error("Error: socket is not ready");
    }

}

function reset_canvas(e) {
    var canvas = document.getElementById('user_canvas');
    var context = canvas.getContext('2d');
    context.fillStyle = '#000000';
    context.fillRect(0,0,m*128,m*128);
    context.fillStyle = '#ffffff';
    context.strokeStyle = '#ffffff';
    paint_bot();   
}
