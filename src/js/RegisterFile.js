/**
 * Created by freakazo on 28/06/15.
 */


var REG_FILE = function (size) {
    this.regs = [];
    for (var i = 0; i < size; i++) {
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
        SystemBus.write(this.outReg.value);
        this.out = 0;
    }

    if(edge === 0 && this.in === 1) {
        this.inReg.value = SystemBus.value;
        this.in = 0;
    }
};

var RegisterFile = new REG_FILE(32);