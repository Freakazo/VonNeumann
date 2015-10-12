/**
 * Created by freakazo on 28/06/15.
 */


var ProgramCounter = {
    count: 0,
    PCout: 0,
    in: 0
};

ProgramCounter.step = function (edge) {
    if (this.PCout === 1 && this.PCin === 1)
        console.log('ERROR: Program Counter can\'t write and read from system bus at the same time');
    else if (this.PCout === 1 && edge === 1) {
        SystemBus.write(this.count);
        this.PCout = 0;
        playBusAnim("PC", 0);
    }
    else if (this.in === 1 && edge === 0) {
        this.count = SystemBus.value;
        this.in = 0;
        playBusAnim("PC", 1);
    }

    if (edge === 0) {
        $('.CPULog').append("PC: " + this.count + "<br>");
    }
};

function createPC(xOffset, yOffset) {
    var reg = new createRegister(xOffset, yOffset, "PC");
    this.value = reg.value;
    this.BBox = reg.BBox;

    var func = function(written) {
        playRectUpdateAnim(reg.BBox,written);
    };

    display.SB.attachToBus(xOffset, yOffset + 10, "PC", func);
}
