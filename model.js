const canvas = document.getElementById("canvas");
canvas.width = 512;
canvas.height = 512;

const ctx = canvas.getContext("2d");

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

(async function drawBase() {
    await drawImage("body");
    await drawImage("eye-l");
    await drawImage("eye-r");
})();
