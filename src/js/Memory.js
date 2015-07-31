/**
 * Created by freakazo on 28/06/15.
 */

function MEM_reg_update(edge) {
    if (this.out === 1 && this.out === 0) {
        console.log("ERROR: MD can't write and read to system bus at the same time");
        return;
    }

    if (this.out === 1 && edge === 1) {
        SystemBus.write(this.value);
        this.out = 0;
    }

    if (this.in === 1 && edge === 0) {
        this.value = SystemBus.value;
        playMAAnim();
        playBusAnim("MA", 1);
        this.in = 0;
    }
}

function memDataStep(edge) {
    if (this.out === 1 && this.out === 0) {
        console.log("ERROR: MD can't write and read to system bus at the same time");
        return;
    }

    else if (this.out === 1 && edge === 1) {
        SystemBus.write(Memory.data[Memory.MemoryAddress.value]);
        this.out = 0;
    }

    else if (this.in === 1 && edge === 0) {
        Memory.data[Memory.MemoryAddress] = SystemBus.value;
        this.in = 0;
    }
}

function MEM() {
    this.MemoryData = new Register();
    this.MemoryData.step = memDataStep;
    this.MemoryAddress = new Register();
    this.MemoryAddress.step = MEM_reg_update;
    this.data = [];
    this.data.length = 800;
}

var Memory = new MEM();

Memory.step = function (edge) {
    this.MemoryAddress.step(edge);
    this.MemoryData.step(edge);
};

