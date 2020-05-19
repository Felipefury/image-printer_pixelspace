    // ==UserScript==
// @name        IPP
// @version     2.1
// @match       https://pxspace.herokuapp.com/*
// @author      Felipe GM
// @description see an image as it would be inside the game.
// @updateURL   https://raw.githubusercontent.com/Felipefury/image-printer_pixelspace/master/src/index.user.js
// @run-at      document-start
   // ==/UserScript==

/* FUCK EUZU AND ARKEROS */

run = function(){
    var canvas_jogo = document.getElementById("defaultCanvas0");
    var context_jogo = canvas_jogo.getContext("2d");

    var container = document.createElement("div");
    var container2 = document.createElement("div");
    var templates = []

    var moveimage = new Image();
    moveimage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAF1SURBVHjaxNjRDYQgDAbgf4oLI3Q6RoAtbjVGYIzeCxjForTWHAlvWj5JKQjg00Lr6sbMh+7RYgiBQwgMIP4bFEMIXErhUooJ5QnaML1ZUF6gE8aK8gBNMRbUU9AtRot6AlrGaFBWUNBiBFTwAvVAEUABwL3P2v6Z9k4cYplB8WLK70BLsTSgLWfaVz4FFSmnVkGHBJ4MoAWJib4COq2myQDfnDNLHcD36gP2qDuQuLSHJO0DfgDkSf+0Z3i2CGYoU51ps5Av8i/nnFV1agSpip4XSEKZip4nSCqeRERca/0bqNbKRMQAqAdIGpQnaIdJY1Ivo7xAI0Za9iLqjWUvYWaF8YTyLowzzNXWcUB5bh17jHZz3VAAqgOojhjL8SONAR6AxFiWA1qvDanNlPaAVncI8jrCqovnVdHzOuQnLUrKGe/foGXUCsbrR/EWtYrx/JWeojQY78uGE0qLeeM6ZkNZMG9dWCUiMmHeAvWCRx5Xer8BAE0kU463B5TjAAAAAElFTkSuQmCC"

    getxy = function() {
        let dataXY = {}
        let XY = document.getElementById('coords').textContent

        dataXY['x'] = parseInt(XY.substring(0,XY.indexOf(',')))
        dataXY['y'] = parseInt(XY.substring(XY.indexOf(',')+2,XY.length))

        return dataXY
    };

    getZoom = function () {
        return tiled.zoom
    };

    container.innerHTML = `

<style>
td,th,label {
color: rgb(255, 255, 255);
font-size:15px;
}
.cursor {
cursor: pointer;
}
.slider {
width: 100px;
height: 10px;
border-radius: 5px;
background: #d3d3d3;
outline: none;
opacity: 0.7;
-webkit-transition: .2s;
transition: opacity .2s;
}

.slider:hover {
opacity: 1;
}

.slider::-webkit-slider-thumb {
appearance: none;
width: 23px;
height: 24px;
border: 0;

cursor: pointer;
}

.slider::-moz-range-thumb {
width: 23px;
height: 25px;
border: 0;
cursor: pointer;
}
</style>

<div style="margin-top:100px;margin-left:30px;border-radius: 8px;" class="overlay">
<p style="text-align: center">PxSpace Printer</p>
<table id="table">
<thead>
<tr>
<th>Visible/Name</th>
<th>X,Y</th>
</tr>
</thead>
<tbody id="tbody">
</tbody>
</table>
<p id="addTemplate" class="cursor" style="text-align: center">+</p>
</div>
<input id="btnfile" type="file" style="margin-left: 15px;opacity:0" size="1"></input>`;

    container2.innerHTML = `

<div id="container2" style="margin-top:-100px;margin-left:-310px;border-radius: 8px;opacity:0;padding: 5px;" class="overlay">
<p class="cursor" id="close" style="color: rgb(255, 0, 0);text-align: right;margin-top: -5px" onClick="closeContainer()">x</p>
<p id="templateinfo" style="text-align: center"></p>

<div class="slidecontainer">
<p style="text-align: center;font-size:10px !important;"> visibility: <input type="range" min="10" max="100" value="50" class="slider" id="myRange"></p>
</div>

<p id="deleteTemplate" onClick="deleteTemplate()" class="cursor" style="text-align: center;color: rgb(255, 0, 0);">delete template</p>
</div>`

    closeContainer = function() {
        $("#container2").css({"margin-top": "-100","margin-left": "-310","opacity": 0})
    }

    deleteTemplate = function() {
        let info;

        for(let i = 0;i < templates.length; i++) {
            if(templates[i].name == document.getElementById("templateinfo").innerHTML) info = i
        }

        templates.splice(info, 1)
        closeContainer()
        document.getElementById("tr_" + document.getElementById("templateinfo").innerHTML).remove();

        let localTemplate = JSON.parse(localStorage.getItem('templates'))
        delete localTemplate[document.getElementById("templateinfo").innerHTML]
        localStorage.setItem("templates", JSON.stringify(localTemplate));

    }

    templateInfo = function(template) {
        let info;

        for(let i = 0;i < templates.length; i++) {
            if(templates[i].name == template.id) info = i
        }
        $("#container2").css({"margin-top": "100","margin-left": "310","opacity": .8})
        $('#myRange').val(templates[info].alpha*100)
        document.getElementById("templateinfo").innerHTML = template.id


    }

    handleFileSelect = function(data) {
        let file = data.target.files[0];

        if(file.type != "image/png") {
            alert("use .png images")
            return
        };

        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {

                let img = new Image();
                img.src = e.target.result;
                img.onload = function() {

                    let h = this.height;
                    let w = this.width;

                    let templateCanvas = document.createElement('canvas');
                    templateCanvas.width = w;
                    templateCanvas.height = h;
                    let templateContext = templateCanvas.getContext('2d');
                    templateContext.drawImage(img, 0, 0, w, h);

                    let xy = getxy()

                    templates.push({"name": file.name.replace(".png",""), "x": xy.x, "y": xy.y, "h": h, "w": w, "data": img, "alpha": 0.5, "hidden": false, "context": templateContext, "move": {"x": null, "y": null, "w": null, "h": null, "hidden": false, "moving": false}})

                    if(templates.length == 1) drawImage()


                    let name = file.name.replace(".png","")

                    if(name.length > 18) {
                        name = name.substring(18,0)
                        name += '...'
                    }

                    let tr = `<tr id = "tr_${file.name.replace(".png","")}"><td><input name="checkbox_${file.name.replace(".png","")}" type="checkbox" checked onclick='changeHiddenTemplate(this);'/><label class="cursor" onClick="templateInfo(this)" id="${file.name.replace(".png","")}">${name}</label></td><td onClick="gotoxy(this)" class="cursor" id="xy_${file.name.replace(".png","")}">${xy.x},${xy.y}</td></tr>`

                    tbody.insertAdjacentHTML('beforeend', tr );

                    let localTemplate = JSON.parse(localStorage.getItem('templates'))
                    if(Object.keys(localTemplate).indexOf(file.name.replace(".png","")) == -1) {
                        localTemplate[file.name.replace(".png","")] = {
                            "name": file.name.replace(".png",""), "x": xy.x, "y": xy.y, "h": h, "w": w, "data": img.src, "alpha": 0.5, "hidden": false, "move": {x: null, y: null, w: null, h: null, hidden: false, moving: false}
                        }
                        localStorage.setItem("templates", JSON.stringify(localTemplate));
                    }
                };

            };
        })(file);
        reader.readAsDataURL(file);
    }

    loadTemplates = function() {
        let userTemplates = JSON.parse(localStorage.getItem('templates'))
        if(Object.keys(userTemplates).length == 0) return;

        for(let i = 0; i < Object.keys(userTemplates).length; i++) {

            let templateCanvas = document.createElement('canvas');
            templateCanvas.width = userTemplates[Object.keys(userTemplates)[i]].w;
            templateCanvas.height = userTemplates[Object.keys(userTemplates)[i]].h;
            let templateContext = templateCanvas.getContext('2d');

            let img = new Image();
            img.src = userTemplates[Object.keys(userTemplates)[i]].data

            img.onload = function() {
                templateContext.drawImage(img, 0, 0, userTemplates[Object.keys(userTemplates)[i]].w, userTemplates[Object.keys(userTemplates)[i]].h);
            }

            let name = Object.keys(userTemplates)[i]

            if(name.length > 18) {
                name = name.substring(18,0)
                name += '...'
            }

            templates.push({"name": Object.keys(userTemplates)[i], "x": userTemplates[Object.keys(userTemplates)[i]].x, "y": userTemplates[Object.keys(userTemplates)[i]].y, "h": userTemplates[Object.keys(userTemplates)[i]].h, "w": userTemplates[Object.keys(userTemplates)[i]].w, "data": userTemplates[Object.keys(userTemplates)[i]].data, "alpha": userTemplates[Object.keys(userTemplates)[i]].alpha, "hidden": userTemplates[Object.keys(userTemplates)[i]].hidden, "move": userTemplates[Object.keys(userTemplates)[i]].move, "changed": false, "context": templateContext})

            tr = `<tr id = "tr_${Object.keys(userTemplates)[i]}">
<td><input name="checkbox_${Object.keys(userTemplates)[i]}" type="checkbox" checked onclick='changeHiddenTemplate(this);'/><label onClick="templateInfo(this)" class="cursor" id="${Object.keys(userTemplates)[i]}">${name}</label></td>
<td onClick="gotoxy(this)" class="cursor" id="xy_${Object.keys(userTemplates)[i]}">${userTemplates[Object.keys(userTemplates)[i]].x},${userTemplates[Object.keys(userTemplates)[i]].y}</td>
</tr>`

            tbody.insertAdjacentHTML('beforeend', tr );
        }
        console.log('found templates: ', Object.keys(userTemplates))
        drawImage()

    }

    moveTemplate = function() {
        for(let i = 0; i < templates.length; i++) {
            if(templates[i].move.moving == true) return templates[i].move.moving = false
            let xy = getxy()

            if (templates[i].move.hidden == false && xy.x >= templates[i].move.x && xy.x <= (templates[i].move.x + templates[i].move.w) - 1 && xy.y >= templates[i].move.y && xy.y <= (templates[i].move.y + templates[i].move.h) - 1) {
                templates[i].move.moving = true
                interval = setInterval(() => {
                    xy = getxy()

                    templates[i].x = xy.x
                    templates[i].y = xy.y

                    if(templates[i].move.moving == false) {
                        let userTemplates = JSON.parse(localStorage.getItem('templates'))
                        userTemplates[templates[i].name].x = xy.x
                        userTemplates[templates[i].name].y = xy.y

                        localStorage.setItem("templates", JSON.stringify(userTemplates));

                        return clearInterval(interval)
                    }

                    $("#xy_" + templates[i].name).html(xy.x + ',' + xy.y)
                }, 25);
            }
        }
    }

    changeHiddenTemplate = function(checkbox) {
        for(let i = 0; i < templates.length;i++) {
            if(templates[i].name == checkbox.name.replace("checkbox_","")) {
                checked = checkbox.checked
                checked = !checkbox.checked
                templates[i].hidden = checked
            }
        }
    }

    gotoxy = function(xy) {

        xy = xy.innerHTML

        let x = parseInt(xy.substring(0,xy.indexOf(',')))
        let y = parseInt(xy.substring(xy.indexOf(',')+1,xy.length))

        tiled.goto(x-tiled.canvas.offsetWidth/3,y-tiled.canvas.offsetHeight/3)
    }

    drawImage = function() {

        let zoom = getZoom()

        for(let i = 0; i < templates.length; i++) {
            if(templates[i].hidden == true) continue;
            let x = (templates[i].x - tiled.leftTopX) *zoom
            let y = (templates[i].y - tiled.leftTopY) *zoom

            context_jogo.globalAlpha = templates[i].alpha;
            context_jogo.imageSmoothingEnabled = false;

            if(typeof templates[i].data == "string" && templates[i].changed == false) {
                let img = new Image();

                img.onload = function() {
                    context_jogo.drawImage(img, x, y, templates[i].w * zoom, templates[i].h * zoom);
                    templates[i].data = img
                    templates[i].changed = true
                };

                img.src = templates[i].data
            } else {
                context_jogo.drawImage(templates[i].data, x, y, templates[i].w * zoom, templates[i].h * zoom);
            }

            if(zoom <= 4) {
                context_jogo.lineWidth = "1";

                context_jogo.drawImage(moveimage, x + ((templates[i].w/2)*zoom), y - (42*zoom), 36 * zoom, 36 * zoom);

                templates[i].move.x = templates[i].x + templates[i].w/2
                templates[i].move.y = templates[i].y - 46
                templates[i].move.w = 36
                templates[i].move.h = 36
                templates[i].move.hidden = false

            } else {
                context_jogo.lineWidth = "3";
                templates[i].move.hidden = true
            }

            context_jogo.globalAlpha = 1;
            context_jogo.beginPath();
            context_jogo.strokeStyle = "red";
            context_jogo.rect(x, y, templates[i].w * zoom, templates[i].h * zoom);
            context_jogo.stroke();
        }

        window.requestAnimationFrame(drawImage);
    }

    document.body.appendChild(container);
    document.body.appendChild(container2);

    var slider = document.getElementById("myRange");

    slider.oninput = function() {
        let info;

        for(let i = 0;i < templates.length; i++) {
            if(templates[i].name == document.getElementById("templateinfo").innerHTML) info = i
        }

        templates[info].alpha = this.value/100
    }

    document.getElementById("btnfile").addEventListener("change", handleFileSelect, false);

    document.getElementById("defaultCanvas0").addEventListener('click', moveTemplate, true);

    $("#addTemplate").click(function() {
        $("#btnfile").click();
    });

    if(!localStorage.getItem("templates")) {
        localStorage.setItem("templates", JSON.stringify({}));
    } else {
        loadTemplates()
    }

    const colorsIds = {
        "[0,0,0]":0,
        "[53,49,49]":1,
        "[158,158,158]":2,
        "[255,255,255]":3,
        "[245,21,21]":4,
        "[234,124,18]":5,
        "[245,218,21]":6,
        "[123,73,6]":7,
        "[16,16,101]":8,
        "[37,37,227]":9,
        "[10,240,226]":10,
        "[34,104,19]":11,
        "[67,203,37]":12,
        "[20,162,59]":13,
        "[97,18,102]":14,
        "[206,35,133]":15
    }

    document.addEventListener("mousemove", () => {
        if(templates.length == 0) return;

        let xy = getxy()

        for(let i = 0; i < templates.length; i++) {
            if(templates[i].hidden == true) return;
            if(xy.x >= templates[i].x && xy.x <= (templates[i].x + templates[i].w) - 1 && xy.y >= templates[i].y && xy.y <= (templates[i].y + templates[i].h) - 1) {

                let color = templates[i].context.getImageData((templates[i].x - xy.x)*-1, (templates[i].y - xy.y)*-1, 1, 1);

                if(color.data[3] == 255) {
                    let colorRGB = `[${color.data[0]},${color.data[1]},${color.data[2]}]`

                    if (typeof colorsIds[colorRGB] != "undefined") {
                        $('#picker > div:eq(' + colorsIds[colorRGB] + ')').click()
                    }
                };
            }
        }
    })
}

window.onload = function(){
    setTimeout(()=> {
        run()
    }, 3000)
}
