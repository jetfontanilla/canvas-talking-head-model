const canvas = document.getElementById("canvas");
canvas.width = 512;
canvas.height = 512;

const ctx = canvas.getContext("2d");

function drawImage(imageId) {
    const image = document.getElementById(imageId);
    ctx.drawImage(image, 0, 0)
}

drawImage("body");
drawImage("eye-l");
drawImage("eye-r");