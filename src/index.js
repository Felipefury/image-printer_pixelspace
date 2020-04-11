var canvas_jogo = document.getElementById("defaultCanvas0");
var context_jogo = canvas_jogo.getContext("2d");

var templateCanvas;
var templateContext;

var x,y,w,h,imgLoad;

getxy = function() {
    let dataXY = []
    let XY = document.getElementById('coords').textContent

    dataXY[0] = parseInt(XY.substring(0,XY.indexOf(',')))
    dataXY[1] = parseInt(XY.substring(XY.indexOf(',')+2,XY.length))

    return dataXY
}

getZoom = function () {
	let params = window.location.href.split('?')[1]
    let num = 0
    let zoom = 1

    for(i=0;i<params.length;i++) {
        if(params.charAt(i) == ",") {
            num++
            if(num == 2) {
                zoom = params.substring(i+1,params.length)
            }
        }
    }
    return parseInt(zoom)
};

const colorsIds = {
    "[0,0,0]":0,
    "[73,73,73]":1,
    "158,158,158]":2,
    "[255,255,255]":3,
    "[245,21,21]":4,
    "[245,89,21]":5,
    "[245,218,21]":6,
    "[123,73,6]":7,
    "[16,16,101]":8,
    "[37,37,227]":9,
    "[10,240,226]":10,
    "[34,104,19]":11,
    "[67,203,37]":12,
    "[20,162,59]":13,
    "[97,18,102]":14,
    "[206,35,133]":15,
}

drawImage = function() {

    let zoom = getZoom()

    let XX = (x - tiled.leftTopX) *zoom
    let YY = (y - tiled.leftTopY) *zoom

    context_jogo.globalAlpha = .5;
    context_jogo.imageSmoothingEnabled = false;
    context_jogo.drawImage(imgLoad, XX, YY, w * zoom,h * zoom);
    
    if(zoom <= 4) {
        context_jogo.lineWidth = "1";
    } else {
        context_jogo.lineWidth = "3";
    };

    context_jogo.globalAlpha = 1;
    context_jogo.beginPath();
    context_jogo.strokeStyle = "red";
    context_jogo.rect(XX, YY, w * zoom,h * zoom);
    context_jogo.stroke();

    window.requestAnimationFrame(drawImage);
}


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

                templateCanvas = document.createElement('canvas');
                templateCanvas.width = this.width;
                templateCanvas.height = this.height;
                templateContext = templateCanvas.getContext('2d');
                templateContext.drawImage(img, 0, 0, w, h);

                drawImage()
            };

        };
    })(file);
    reader.readAsDataURL(file);
}

var container = document.createElement("div");

container.innerHTML = `<div style="margin-top:100px" class="overlay"><p style="text-align: center;font-size:15px" id="XYCoord">Use B key to<br>define x, y</p><p style="text-align: center;font-size:15px" id="fileP">Use J key to<br>open file</p><canvas id="Template" width="0" height="0"></canvas></div><input id="btnfile" type="file" style="margin-left: 15px;opacity:0" size="1"></input>`;

document.body.appendChild(container);
  
document.getElementById("btnfile").addEventListener("change", handleFileSelect, false);

document.addEventListener("keypress", (event) => {
    if(event.key == "b") {
        let XY = getxy()

        x = XY[0]
        y = XY[1]

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

document.addEventListener("mousemove", () => {
    if(!imgLoad) return;

    let XY = getxy()

    XX = XY[0]
    YY = XY[1]

    if(XX >= x && XX <= (x+w)-1 && YY >= y && YY <= (y+h)-1) {
    
        let colorData = templateContext.getImageData((x - XX)*-1, (y - YY)*-1, 1, 1);
    
        if(colorData.data[3] == 255) {
            let color = `[${colorData.data[0]},${colorData.data[1]},${colorData.data[2]}]`
    
            if (typeof colorsIds[color] != "undefined") {
                $('#picker > div:eq('+colorsIds[color]+')').click()
            }
        };
    }
})
