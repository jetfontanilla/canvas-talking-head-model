let canvas;
let ctx;

function drawImage(imageId) {
    return new Promise(resolve => {
        const image = document.getElementById(imageId);
        
        if (image.complete) {
            ctx.drawImage(image, 0, 0);
            return resolve();
        }

        image.onload = () => {
            ctx.drawImage(image, 0, 0);
            resolve();
        }
    });
}

document.addEventListener("DOMContentLoaded", async function() {
    canvas = document.getElementById("canvas");
    canvas.width = 512;
    canvas.height = 512;

    ctx = canvas.getContext("2d");

    await drawImage("body");
    await drawImage("eye-l");
    await drawImage("eye-r");
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
    ctx.fillStyle = "rgb(09, 81, 74)";
    ctx.fillRec(195, 165, 110, 75);

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
            return ttsAudio.currentTime * 1000 > frameData.offset;
        });
        drawMouthFrame(currentFrame.id);
    };

    ttsAudio.play();
}