window.addEventListener("load", paint_bot, false);

let speech_bubble_offset_x = 244;
let speech_bubble_offset_y = 53;

function paint_bot(_) {
    let bot_canvas = document.getElementById("bot_canvas");
    let ctx = bot_canvas.getContext('2d');
    let bot_image = new Image();
    bot_image.onload = () => {
        ctx.drawImage(bot_image, 0, 0);
    };
    bot_image.src = 'assets/bot.png';
}

function bot_predict(prediction) {
    let bot_canvas = document.getElementById("bot_canvas");
    let ctx = bot_canvas.getContext('2d');    
    let pred_image = new Image();
    pred_image.onload = () => {
        ctx.drawImage(pred_image, speech_bubble_offset_x, speech_bubble_offset_y);
        console.log("Printed speech bubble");
    };
    pred_image.src = `assets/bot-${prediction}.png`;
}
