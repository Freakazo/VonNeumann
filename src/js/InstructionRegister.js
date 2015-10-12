/**
 * Created by freakazo on 28/06/15.
 */

var IR = new Register();

IR.outputMode = "NONE";

IR.step = function (edge) {
    if (edge === 0 && this.in === 1) {
        this.value = SystemBus.value;
        this.in = 0;
        playBusAnim("IR", 1);
    }
    else if (edge === 1 && this.outputMode === "IMMEDIATE") {
        SystemBus.write(((IR.value >> 4) & 0xF0) | (IR.value & 0x0F));
        this.out = 0;
        IR.outputMode = "NONE";
        playBusAnim("IR", 0);
    }
};

function createIR(x, y) {
    display.IR = this;
    var reg = new createRegister(x, y, "IR");
    this.value = reg.value;
    this.BBox = reg.BBox;
    var func = function(written) {
        playRectUpdateAnim(reg.BBox, written);
    };
    display.SB.attachToBus(x, y+10, "IR", func);
}
