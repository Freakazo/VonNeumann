/**
 * Created by freakazo on 28/06/15.
 */

/*jslint browser: true*/
/*global $, jQuery*/


var REG_FILE = function (size) {
    'use strict';
    this.regs = [];
    var i;
    for (i = 0; i < size; i++) {
        this.regs[i] = new Register();
    }
    this.outReg = null;
    this.inReg = null;
    this.in = 0;
    this.out = 0;
};

REG_FILE.prototype.selectOutputReg = function (regSelect) {
    if (regSelect >= this.regs.length) {
        console.log("ERROR: Requested Register Out of range");
        return;
    }
    $('.CPULog').append("Output reg is: R[" + regSelect + "]<br>");
    this.outReg = this.regs[regSelect];
};

REG_FILE.prototype.selectInputReg = function (regSelect) {
    if (regSelect >= this.regs.length) {
        console.log("ERROR: Requested Register Out of range");
        return;
    }
    $('.CPULog').append("Input reg is: R[" + regSelect + "]<br>");
    this.inReg = this.regs[regSelect];
};

REG_FILE.prototype.step = function (edge) {
    if (edge === 1 && this.out === 1) {
        sim.SB.write(this.outReg.value);
        this.out = 0;
        regUpdated(this.regs.indexOf(this.outReg), 0);
        playBusAnim("RF", 0);
    }

    if (edge === 0 && this.in === 1) {
        this.inReg.value = sim.SB.value;
        this.in = 0;
        regUpdated(this.regs.indexOf(this.inReg), 1);
        playBusAnim("RF", 1);
    }
};

function DisplayRF(display) {
    var RFOffset = 10;

    var paper = display.paper;
    paper.text(50, RFOffset, "Register File");
    this.regHolder = paper.rect(10, RFOffset + 30, 100, 32 * 10 + 5, 1);

    this.regs = [];
    this.regSquares = [];
    for (var i = 0; i < display.SIM.RF.regs.length; i++) {
        paper.text(20, 45 + i * display.regHeight, i);
        this.regs[i] = paper.text(70, 45 + i * display.regHeight, "0");
        this.regSquares[i] = paper.rect(10, 40 + i * 10, 100, display.regHeight);
        this.regSquares[i].attr({"opacity": 0, "fill": "#F00", "stroke-width": 0.5});
    }

    paper.path("M30 40L30 365");
    display.SB.attachToBus(110, (40 + 320) / 2, "RF");
}