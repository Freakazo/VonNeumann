/**
 * Created by freakazo on 28/07/15.
 */

//CPU Display functions

function regUpdated(index, written) {

    //Asynchronous function for display and deletion of update animation
    var square = display.regSquares[index];
    playUpdateAnim(square, written);

    var y = (50+index*10);
    var vertDistance =  y - (40 + 320)/2;
    if(vertDistance > 0 ) {
        y -= 10;
        vertDistance += 10;
    }

    var regPathString = "M 70" + " " + y;
    regPathString += "Q 85 " + (y - vertDistance/4) + ", " + 80 + " " + (y - vertDistance/2);
    regPathString += "T 110 " + (40 + 320)/2;
    display.RF.followPath = display.paper.path(regPathString);

    var colour = "#0F0";
    if(written === 1)
        colour = "#F00";

    display.RF.followPath.attr({opacity: 0.5, stroke: colour});
}


function playUpdateAnim(rect, written) {
    var animLength = 800;
    setTimeout(function() {
        var colour = "#0F0";
        if(written === 1)
            colour = "#F00";

        rect.attr({"fill": colour, "opacity" : 0.8});
        rect.animate({"opacity": 0.1}, animLength);
    }, 0);
}

function playBusAnim(caller, written) {
    var BA = display.SB.busAttachments;
    for(var i = 0; i < BA.length; i++) {
        if(BA[i].obj === caller) {
            busAnim(BA[i].path, written);
        }
    }
}

function busAnim(path, written) {
    setTimeout(function () {
        var color = "#0F0";
        if(written === 1)
            color = "#F00";
        path.attr({"stroke": color});
        path.attr({"stroke-width": "4"});
        path.animate({"stroke-width": "1"}, 800);
    }, 0);
}

function playALUToAAnim() {
    display.ALU.ALUToA.attr({stroke: "#F00", "stroke-width": 4});
    setTimeout(function(){
        display.ALU.ALUToA.animate({"stroke-width": 1}, 800);
    }, 0)
}

function playCoutAnim() {
    display.ALU.Cout.attr({stroke: "#0F0", "stroke-width": 4});
    setTimeout(function(){
        display.ALU.Cout.animate({"stroke-width": 1}, 800);
    }, 0)
}

function playMAAnim() {
    playRectUpdateAnim(display.MEM.MABBox, 1);
}

function playSBUpdateAnim() {
    var VL = display.SB.vertLine;

    VL.attr({"stroke-width": 4});
    setTimeout(function () {
        VL.animate({"stroke-width": 2}, 200);
    }, 0)
}


//Animation helper functions
function playRectUpdateAnim(rect, written) {
    var color = "#0F0";
    if(written === 1)
        color = "#F00";
    rect.attr({fill: color, "fill-opacity" : 1});
    setTimeout(function () {
        rect.animate({"fill-opacity": 0.3}, 800);
    }, 0);
    clearCallbacks.push(function () {
        rect.attr({"fill-opacity": 0});
    })
}

//CPU display Components

function createPC(xOffset, yOffset) {
    display.PC = this;
    var paper = display.paper;
    this.border = paper.rect(xOffset, yOffset, 100, 20);
    //Label
    paper.text(xOffset + 10, yOffset + 10, "PC");
    var vertLinePath = "M" + (xOffset + 30) + " " + yOffset + "L" + (xOffset + 30) + " " + (yOffset + 20);
    paper.path(vertLinePath);

    this.value = paper.text(xOffset + 65, yOffset+10, "0");
    this.updateSquare = paper.rect(xOffset, yOffset, 100, 20);

    display.SB.attachToBus(xOffset, yOffset + 10, "PC");
}

function createSB(xOffset, yOffset) {
    display.SB = this;

    this.xOffset = xOffset;
    this.yOffset = yOffset;

    var paper = display.paper;
    var vertLinePath = "M" + xOffset + " " + yOffset + "L" + xOffset + " " + (yOffset + 500);
    this.vertLine = paper.path(vertLinePath);
    this.vertLine.attr({"opacity": 1.0});


    this.busAttachments = [];
    this.attachToBus = function (x, y, obj) {
        var pathString = "M" + x + " " + y + "L" + display.SB.xOffset + " " + y;
        var busPath = paper.path(pathString);
        this.busAttachments.push({"path" : busPath, "obj" : obj});
    }
}


function createRF() {
    display.RF = this;
    var RFOffset = 10;

    var paper = display.paper;
    paper.text(50, RFOffset, "Register File");
    display.regHolder = paper.rect(10, RFOffset + 30, 100, 32 * 10 + 5, 1);

    display.regs = [];
    display.regSquares = [];
    for (var i = 0; i < RegisterFile.regs.length; i++) {
        paper.text(20, 45 + i * display.regHeight, i);
        display.regs[i] = paper.text(70, 45 + i * display.regHeight, "0");
        display.regSquares[i] = paper.rect(10, 40 + i * 10, 100, display.regHeight);
        display.regSquares[i].attr({"opacity": 0, "fill": "#F00", "stroke-width": 0.5});
    }

    paper.path("M30 40L30 365");
    display.SB.attachToBus(110, (40 + 320)/2, "RF");
}


function createALU() {
    display.ALU = this;
    var paper = display.paper;
    this.ALUBorder = paper.path('m 48,435 -31.877028,0 32.297483,55.940883 42.392485,0 32.064616,-55.537552 -31.366579,0 -21.847971,37.841795 z');
    paper.rect(80, 400, 100, 20);
    paper.path("M100 400L100 420");
    paper.text(90, 410, "C");
    this.CValue = paper.text(140, 410, "0");
    display.SB.attachToBus(180, 410, "C");

    display.SB.attachToBus(30, 390, "ALU");
    for(var i = 0; i < display.SB.busAttachments.length; i++) {
        if(display.SB.busAttachments[i].obj === "ALU") {
            var oldPath = display.SB.busAttachments[i].path.attr('path');
            oldPath += " M30 390 L30, 435";
            display.SB.busAttachments[i].path.attr('path', oldPath);
        }
    }
    this.ALUOperation = paper.text(70, 480, "noop");

    paper.rect(20, 510, 100, 20);
    paper.path("M40 510L40 530");
    paper.text(30, 520, "A");
    this.AValue = paper.text(80, 520, "0");
    display.SB.attachToBus(120, 520, "A");

    this.Cout = paper.path("M110 420 L110 435");

    this.ALUToA = paper.path("M70 490L70 510");
}

function createIR(x, y) {
    display.IR = this;
    var reg = createRegister(x, y, "IR");
    this.value = reg.value;
    display.SB.attachToBus(x, y+10, "IR");


}

function createMemory(x, y) {
    display.MEM = this;
    var paper = display.paper;
    this.BBox = paper.rect(x, y, 150, 100);
    this.label = paper.text(x+75, y+15, "Memory Interface");

    var MA = createRegister(x, y+30, "MA");
    this.MAValue = MA.value;
    this.MABBox = MA.BBox;
    display.SB.attachToBus(x, y+40, "MA");

    var MD = createRegister(x, y+65, "MD");
    this.MDValue = MD.value;
    this.MDBBox = MD.BBox;
    display.SB.attachToBus(x, y+75, "MD");

    paper.rect(x+150+50, y-40, 100, 200);


}

//Helper functions
function createRegister(x, y, label) {

    //Bounding box
    var paper = display.paper;
    this.BBox = paper.rect(x, y, 100, 20);
    //create Label
    this.label = paper.text(x+10, y+10, label);
    //label|Value seperator
    var seperatorPath = "M" + (x + 20) + " " + y + " L" + (x + 20) + " " + (y + 20);
    this.separator = paper.path(seperatorPath);

    this.value = paper.text(x+60, y + 10, "0");

    return this;
}
