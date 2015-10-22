/**
 * Created by freakazo on 28/06/15.
 */

/*jslint browser: true*/
/*global $, jQuery*/


function ProgramCounter() {
    'use strict';
    this.count = 0;
    this.PCout = 0;
    this.in = 0;
}

ProgramCounter.prototype.step = function (edge) {
    'use strict';
    if (this.PCout === 1 && this.in === 1)
        console.log('ERROR: Program Counter can\'t write and read from system bus at the same time');
    else if (this.PCout === 1 && edge === 1) {
        sim.SB.write(this.count);
        this.PCout = 0;
        playBusAnim("PC", 0);
    }
    else if (this.in === 1 && edge === 0) {
        this.count = sim.SB.value;
        this.in = 0;
        playBusAnim("PC", 1);
    }

    if (edge === 0) {
        $('.CPULog').append("PC: " + this.count + "<br>");
    }
};

function DisplayPC(display, xOffset, yOffset) {
    var reg = new CreateRegister(display, xOffset, yOffset, "PC");
    this.value = reg.value;
    this.BBox = reg.BBox;

    var func = function(written) {
        playRectUpdateAnim(reg.BBox,written);
    };

    display.SB.attachToBus(xOffset, yOffset + 10, "PC", func);
}
