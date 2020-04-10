/* PLEASE DO NOT COPY AND PASTE THIS CODE ON TAMPERMONKEY. */

var canvas_jogo = document.getElementById("defaultCanvas1");
var context_jogo = canvas_jogo.getContext("2d");

var x, y, w, h, imgLoad;

drawImage = function() {

    let XX = (x - tiled.leftTopX) * zoom
    let YY = (y - tiled.leftTopY) * zoom

    context_jogo.globalAlpha = .5;
    context_jogo.imageSmoothingEnabled = false;
    context_jogo.drawImage(imgLoad, XX, YY, w * zoom, h * zoom);

    if(zoom <= 4) {
        context_jogo.lineWidth = "1";
    } else {
        context_jogo.lineWidth = "3";
    };

    context_jogo.globalAlpha = 1;
    context_jogo.beginPath();
    context_jogo.strokeStyle = "red";
    context_jogo.rect(XX, YY, w * zoom, h * zoom);
    context_jogo.stroke();

    window.requestAnimationFrame(drawImage);
}

/*
getData = function() {

    let canvas_jogo0 = document.getElementById("defaultCanvas0");
    let context_jogo0 = canvas_jogo0.getContext("2d");

    let XX = (x - tiled.leftTopX) * zoom
    let YY = (y - tiled.leftTopY) * zoom

    let imageCanvasData = context_jogo.getImageData(XX, YY, w, h);
    let canvasData = context_jogo0.getImageData(XX, YY, w, h);

    dataPixeis.correct = 0;
    dataPixeis.errors  = 0;

    for(i = 0; i < w * h; i++) {

        let rC = rgbToHex(imageCanvasData.data[i])
        let gC = rgbToHex(imageCanvasData.data[i + 1])
        let bC = rgbToHex(imageCanvasData.data[i + 2])

        let rI = rgbToHex(canvasData.data[i])
        let gI = rgbToHex(canvasData.data[i + 1])
        let bI = rgbToHex(canvasData.data[i + 2])

        let canvasTemplate = [rC,gC,bC]
        let canvasGameData = [rI,gI,bI]

        if(canvasTemplate == canvasGameData) {
            dataPixeis.correct++
        } else {
            dataPixeis.errors++
        };
    }
}
*/

handleFileSelect = function(data) {
    if(imgLoad) return;
    let file = data.target.files[0];

    if(file.type != "image/png") {
        document.getElementById("fileP").textContent = "use .png images"
        return
    };

    if(!x || !y) {
        document.getElementById("XYCoord").style.color = "red";
        return
    };

    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {

            let img = new Image();
            img.src = e.target.result;
            img.onload = function() {

                h = this.height;
                w = this.width;
                imgLoad = img

                drawImage()
            };

        };
    })(file);
    reader.readAsDataURL(file);
}

var container = document.createElement("div");

container.innerHTML = `<div style="margin-top:100px" class="overlay"><p style="text-align: center;font-size:15px" id="XYCoord">Use B key to<br>define x, y TESTE</p><p style="text-align: center;font-size:15px" id="fileP">Use J key to<br>open file</p><canvas id="Template" width="0" height="0"></canvas></div><input id="btnfile" type="file" style="margin-left: 15px;opacity:0" size="1"></input>`;

document.body.appendChild(container);

document.getElementById("btnfile").addEventListener("change", handleFileSelect, false);

document.addEventListener("keypress", (event) => {
    if(event.key == "b") {

        x = lastPos[0]
        y = lastPos[1]

        document.getElementById("XYCoord").textContent = x + "," + y
        document.getElementById("XYCoord").style.color = "#ffffff"

    } else if(event.key == "j") {

        if(!x || !y) {
            document.getElementById("XYCoord").style.color = "red";
            return
        };

        $("#btnfile").click();
    }
});
