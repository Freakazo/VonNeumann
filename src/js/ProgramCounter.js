/**
 * Created by freakazo on 28/06/15.
 */


var ProgramCounter = {
    count : 0,
    PCout : 0,
    in : 0
};

ProgramCounter.step = function (edge) {
    if(this.PCout === 1 && this.PCin === 1)
        console.log('ERROR: Program Counter can\'t write and read from system bus at the same time');
    else if( this.PCout === 1 && edge === 1) {
        SystemBus.write(this.count);
        this.PCout = 0;
    }
    else if(this.in === 1 && edge === 0) {
        this.count = SystemBus.value;
        this.in = 0;
    }

    if(edge === 0) {
        $('.CPULog').append("PC: " + this.count + "<br>");
    }


};