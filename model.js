let canvas;
let ctx;

function loadImage(imageId) {
    return new Promise(resolve => {
        const image = document.getElementById(imageId);
        if (image.complete) {
            return resolve(image);
        }

        image.onload = () => {
            resolve(image);
        };
    });
}
async function drawImage(imageId) {
    const image = await loadImage(imageId)
    ctx.drawImage(image, 0, 0);
}

function clearEyes() {
    ctx.fillStyle = "rgb(90, 81, 74)";
    ctx.fillRect(167, 156, 40, 44);
    ctx.fillRect(293, 156, 40, 44);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function eyeBlink() {
    const leftEye = await loadImage("eye-l");
    const rightEye = await loadImage("eye-r");

    const targetHeight = Math.floor(leftEye.height * 0.2)
    let height = leftEye.height;
    const ANIMATION_STEP = 20;

    while (height > targetHeight) {
        await sleep(ANIMATION_STEP);
        height *= 0.8;
        clearEyes();
        ctx.drawImage(leftEye, 0, (leftEye.height - height) / 3, leftEye.width, height);
        ctx.drawImage(rightEye, 0, (rightEye.height - height) / 3, rightEye.width, height);
    }

    await sleep(ANIMATION_STEP);
    clearEyes();
    ctx.drawImage(leftEye, 0, (leftEye.height - targetHeight) / 3, leftEye.width, targetHeight);
    ctx.drawImage(rightEye, 0, (rightEye.height - targetHeight) / 3, rightEye.width, targetHeight);

    await sleep(75);
    clearEyes();
    await drawImage("eye-l-closed");
    await drawImage("eye-r-closed");

    await sleep(120);
    clearEyes();
    await drawImage("eye-l");
    await drawImage("eye-r");
}

document.addEventListener("DOMContentLoaded", async function() {
    canvas = document.getElementById("canvas");
    canvas.width = 512;
    canvas.height = 512;

    ctx = canvas.getContext("2d");

    await drawImage("body");
    await drawImage("eye-l");
    await drawImage("eye-r");
    await drawImage("mouth-a");

    eyeBlink();
    const BLINK_INTERVAL = 3500;
    setInterval(() => {
        eyeBlink();
    }, BLINK_INTERVAL);
});

// Viseme ID lookup
const frameLookup = {
    0: "mouth-a",
    1: "mouth-d",
    2: "mouth-h",
    3: "mouth-e",
    4: "mouth-c",
    5: "mouth-c",
    6: "mouth-b",
    7: "mouth-f",
    8: "mouth-c",
    9: "mouth-d",
    10: "mouth-e",
    11: "mouth-h",
    12: "mouth-c",
    13: "mouth-e",
    14: "mouth-c",
    15: "mouth-b",
    16: "mouth-f",
    17: "mouth-c",
    18: "mouth-g",
    19: "mouth-b",
    20: "mouth-d",
    21: "mouth-x"
};

function drawMouthFrame(frameId) {
    ctx.fillStyle = "rgb(90, 81, 74)";
    ctx.fillRect(200, 165, 100, 75);

    const assetId = frameLookup[frameId];
    drawImage(assetId);
}

const ttsAudio = new Audio("tts.wav");

async function playAudio() {
    const response = await fetch(new Request("viseme.json"), {
        method: "GET",
        mode: "no-cors"
    });
    const visemeData = await response.json();

    ttsAudio.ontimeupdate = (event) => {
        const currentFrame = visemeData.find(frameData => {
            return frameData.offset > ttsAudio.currentTime * 1000;
        });
        drawMouthFrame(currentFrame?.id ?? 0);
    };

    ttsAudio.play();
}
