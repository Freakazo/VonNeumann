$(document).ready(function () {

    $("#step-btn").click(function () {
        clearDisplay();
        step();
        updateDisplay();
    });

    //Manually set initial registers.
    RegisterFile.regs[0].value = 1;
    RegisterFile.regs[1].value = 1;

    //Set program memory
    Memory.data[0] = 0x1C10; //ADC r0, r1
    Memory.data[1] = 0xE014; //LDI r17, 4
    Memory.data[2] = 0x1E11; //ADC r1, r17
    Memory.data[3] = 0x1E11; //ADC r1, r17
    Memory.data[4] = 0x1E11; //ADC r1, r17
    Memory.data[5] = 0x1E11; //ADC r1, r17
    initDisplay();
    updateDisplay();
});


function Disp() {
    this.regHeight = 10;
    this.width = 800;
    this.height = 600;
}

var display = new Disp();

function initDisplay() {
    display.paper = Raphael("vizHolder", 800, 600);
    var paper = display.paper;

    createSB(400, 40);
    createPC(650, 50);
    createRF();
    createALU();
    createIR(650, 100);
    createMemory(450, 350);
}

var clearCallbacks = [];

function clearDisplay() {
    var callbck;
    while( callbck = clearCallbacks.pop()) {
        callbck();
    }
    for (var i = 0; i < RegisterFile.regs.length; i++) {
        display.regSquares[i].attr('opacity', 0.0);
    }
    for(var i = 0; i < display.SB.busAttachments.length; i++) {
        display.SB.busAttachments[i].path.attr({stroke: "#000", "stroke-width": "1px"});
    }

    if(display.RF.followPath)
        display.RF.followPath.remove();

    display.ALU.ALUToA.attr({stroke: "#000", "stroke-width": 1});
    display.ALU.Cout.attr({stroke: "#000", "stroke-width": 1});
}

function updateDisplay() {
    for (var i = 0; i < RegisterFile.regs.length; i++) {
        display.regs[i].attr('text', RegisterFile.regs[i].value );
        display.regSquares[i].attr('opacity', 0.0);
    }
    for(var i = 0; i < display.SB.busAttachments.length; i++) {
        display.SB.busAttachments[i].path.attr({stroke: "#000", "stroke-width": "1px"});
    }

    display.PC.value.attr('text', ProgramCounter.count);
    display.ALU.CValue.attr('text', ALU.A.value);
    display.ALU.AValue.attr('text', ALU.C.value);
    display.ALU.ALUOperation.attr('text', ALU.operation);

    display.IR.value.attr('text', IR.value);


    //$("td[name=IRValue]").text(IR.value);
    //$("td[name=PCValue]").text(ProgramCounter.count);
    //$("td[name=MA]").text(Memory.MemoryAddress.value);
    //$("td[name=MD]").text(Memory.MemoryData.value);
}