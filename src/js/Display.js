/**
 * Created by freakazo on 28/07/15.
 */

/*jslint browser: true*/
/*global $, jQuery*/

function Disp(container, cpuSim, width, height) {
    'use strict';
    this.regHeight = 10;
    this.width = width;
    this.height = height;

    this.paper = Raphael(container, width, height);
    this.paper.renderfix();

    this.SIM = cpuSim;

    this.SB = new DisplaySB(this, width * 0.4, 40);
    this.PC = new DisplayPC(this, width * 0.8, 50);
    this.RF = new DisplayRF(this);
    this.ALU = new DisplayALU(this, cpuSim.ALU);
    this.IR = new DisplayIR(this, width * 0.8, 100);
    this.MEM = new DisplayMemory(this, width * 0.45, 350, cpuSim.MEM);
    this.CU = new DisplayCU(this, width * 0.65, 170);
}

Disp.prototype.updateDisplay = function () {
    'use strict';
    for (var i = 0; i < this.RF.regs.length; i++) {
        this.RF.regs[i].attr('text', sim.RF.regs[i].value);
        this.RF.regSquares[i].attr('opacity', 0.0);
    }
    for (i = 0; i < display.SB.busAttachments.length; i++) {
        this.SB.busAttachments[i].path.attr({stroke: "#000", "stroke-width": "1px"});
    }

    this.PC.value.attr('text', this.SIM.PC.count);
    this.ALU.CValue.attr('text', this.SIM.ALU.A.value);
    this.ALU.AValue.attr('text', this.SIM.ALU.C.value);
    this.ALU.ALUOperation.attr('text', this.SIM.ALU.operation);

    this.IR.value.attr('text', this.SIM.IR.value);
    this.MEM.MAValue.attr('text', this.SIM.MEM.MemoryAddress.value);
    this.MEM.MDValue.attr('text', this.SIM.MEM.MemoryData.value);
};

var clearCallbacks = [];

Disp.prototype.clearDisplay = function () {
    var callbck;
    while (callbck = clearCallbacks.pop()) {
        callbck();
    }
    for (var i = 0; i < this.RF.regs.length; i++) {
        this.RF.regSquares[i].stop();
        this.RF.regSquares[i].attr('opacity', 0.0);
    }
    for (i = 0; i < this.SB.busAttachments.length; i++) {
        this.SB.busAttachments[i].path.stop();
        this.SB.busAttachments[i].path.attr({stroke: "#000", "stroke-width": "1px"});
    }

    if (this.RF.followPath)
        this.RF.followPath.remove();

    if (this.MEM.followPath)
        this.MEM.followPath.remove();

    this.ALU.ALUToA.attr({stroke: "#000", "stroke-width": 1});
    this.ALU.Cout.attr({stroke: "#000", "stroke-width": 1});
};

function regUpdated(index, written) {

    //Asynchronous function for display and deletion of update animation
    var square = display.RF.regSquares[index];
    playUpdateAnim(square, written);

    var y = (50 + index * 10);
    var vertDistance = y - (40 + 320) / 2;
    if (vertDistance > 0) {
        y -= 10;
        vertDistance += 10;
    }

    var regPathString = "M 70" + " " + y;
    regPathString += "Q 85 " + (y - vertDistance / 4) + ", " + 80 + " " + (y - vertDistance / 2);
    regPathString += "T 110 " + (40 + 320) / 2;
    display.RF.followPath = display.paper.path(regPathString);
    if (written === 1) {
        display.RF.followPath.node.setAttribute('class', 'pathReverse');
    } else {
        display.RF.followPath.node.setAttribute('class', 'path');
    }


    var colour = "#0F0";
    if (written === 1)
        colour = "#F00";

    display.RF.followPath.attr({opacity: 0.5, stroke: colour});
}


function playUpdateAnim(rect, written) {
    var animLength = 800;
    setTimeout(function () {
        var colour = "#0F0";
        if (written === 1)
            colour = "#F00";

        rect.attr({"fill": colour, "opacity": 0.8});
        rect.animate({"opacity": 0.1}, animLength);
    }, 0);
}

function playBusAnim(caller, written) {
    var BA = display.SB.busAttachments;
    for (var i = 0; i < BA.length; i++) {
        if (BA[i].obj === caller) {
            busAnim(BA[i].path, written);
            if (BA[i].clb != undefined) {
                BA[i].clb(written);
            }
        }
    }
}

function busAnim(path, written) {
    setTimeout(function () {
        var color = "#0F0";
        if (written === 1)
            color = "#F00";
        path.attr({"stroke": color});
        path.attr({"stroke-width": "4"});
        path.animate({"stroke-width": "1"}, 800);
        if (written) {
            path.node.setAttribute('class', 'pathReverse');
        } else {
            path.node.setAttribute('class', 'path');
        }
    }, 0);

    clearCallbacks.push(function () {
        path.node.removeAttribute('class');
    });
}

function playALUToAAnim() {

}

function playCoutAnim() {
    display.ALU.Cout.attr({stroke: "#0F0", "stroke-width": 4});
    setTimeout(function () {
        display.ALU.Cout.animate({"stroke-width": 1}, 800);
    }, 0)
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
    if (written === 1)
        color = "#F00";
    rect.attr({fill: color, "fill-opacity": 1});
    setTimeout(function () {
        rect.animate({"fill-opacity": 0.3}, 800);
    }, 0);
    clearCallbacks.push(function () {
        rect.stop();
        rect.attr({"fill-opacity": 0});
    })
}
