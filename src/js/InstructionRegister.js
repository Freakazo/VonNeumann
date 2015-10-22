/**
 * Created by freakazo on 28/06/15.
 */


/*jslint browser: true*/
/*global $, jQuery*/

function IR() {
    'use strict';
    this.in = 0;
    this.out = 0;
    this.value = 0;
    this.outputMode = "NONE";
}

IR.prototype.step = function (edge) {
    'use strict';
    if (edge === 0 && this.in === 1) {
        this.value = sim.SB.value;
        this.in = 0;
        playBusAnim("IR", 1);
    } else if (edge === 1 && this.outputMode === "IMMEDIATE") {
        sim.SB.write(((sim.IR.value >> 4) & 0xF0) | (sim.IR.value & 0x0F));
        this.out = 0;
        sim.IR.outputMode = "NONE";
        playBusAnim("IR", 0);
    }
};

function DisplayIR(display, x, y) {
    'use strict';
    var reg = new CreateRegister(display, x, y, "IR");
    this.value = reg.value;
    this.BBox = reg.BBox;
    var func = function (written) {
        playRectUpdateAnim(reg.BBox, written);
    };
    display.SB.attachToBus(x, y + 10, "IR", func);
}