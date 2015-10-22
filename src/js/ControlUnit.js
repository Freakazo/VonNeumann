/**
 * Created by freakazo on 28/06/15.
 */

/*jslint browser: true*/
/*global $, jQuery*/

function ControlUnit() {
    'use strict';
    this.state = "FETCH_INSTRUCTION";
    this.executeState = "EXE_0";
}

ControlUnit.prototype.step = function (edge) {
    'use strict';

    //Control unit only updates on rising edge
    if (edge !== 1) {
        return;
    }

    $('.CPULog').append("CU state: " + this.state + "<br>");

    this.updateState(this.state);

    //Fetch the instruction and hand of to execute() after instruction is fetched.
    switch (this.state) {
        case "FETCH_INSTRUCTION":
        case "FETCH_INSTRUCTION_0":
            sim.PC.PCout = 1;
            sim.MEM.MemoryAddress.in = 1;
            sim.ALU.A.in = 1;
            this.state = "FETCH_INSTRUCTION_1";
            break;
        case "FETCH_INSTRUCTION_1":
            sim.MEM.MemoryData.out = 1;
            sim.IR.in = 1;
            sim.ALU.operation = "INC";
            this.state = "FETCH_INSTRUCTION_2";
            break;
        case "FETCH_INSTRUCTION_2":
            sim.ALU.operation = "NOP";
            sim.PC.in = 1;
            sim.ALU.C.out = 1;
            this.state = "EXECUTE";
            break;
        case "EXECUTE":
            this.execute();
            break;
        default :
            console.log('ERROR: Control unit in invalid state');
    }
};

ControlUnit.prototype.execute = function () {
    'use strict';

    //Identify the instruction:
    var instruction = "Unknown";
    if ((sim.IR.value >> 10) === 7)
        instruction = "ADC";
    else if ((sim.IR.value >> 10) === 3)
        instruction = "ADD";
    else if ((sim.IR.value >> 12) === 14)
        instruction = "LDI";

    this.updateInstruction(instruction);
    this.updateState(this.executeState);


    switch (instruction) {
        case "ADC":
            $('.CPULog').append("Executing ADC instruction, phase " + this.executeState + "<br>");
            switch (this.executeState) {
                case "EXE_0":
                    this.RdToALU();
                    this.executeState = "EXE_1";
                    break;
                case "EXE_1":
                    this.RrToBus();
                    sim.ALU.operation = "ADC";
                    this.executeState = "EXE_2";
                    break;
                case "EXE_2":
                    sim.ALU.operation = "NOP";
                    sim.ALU.C.out = 1;
                    sim.RF.selectInputReg(IR.value >> 4 & 0x1F);
                    sim.RF.in = 1;
                    sim.CU.state = "FETCH_INSTRUCTION_0";
                    this.executeState = "EXE_0";
                    break;
                default :
                    break;
            }
            break;
        case "ADD":
            switch (this.executeState) {
                case "EXE_0":
                    this.RdToALU();
                    this.executeState = "EXE_1";
                    break;
                case "EXE_1":
                    this.RrToBus();
                    sim.ALU.operation = "ADD";
                    this.executeState = "EXE_2";
                    break;
                case "EXE_2":
                    sim.ALU.operation = "NOP";
                    sim.ALU.C.out = 1;
                    sim.RF.selectInputReg(IR.value >> 4 & 0x1F);
                    sim.RF.in = 1;
                    sim.CU.state = "FETCH_INSTRUCTION_0";
                    this.executeState = "EXE_0";
                    break;
                default :
                    break;
            }
            break;
        case "LDI":
            sim.IR.outputMode = "IMMEDIATE";
            sim.IR.out = 1;
            sim.RF.selectInputReg(16 + ((IR.value >> 4) & 0x0F));
            sim.RF.in = 1;
            sim.CU.state = "FETCH_INSTRUCTION_0";
            break;
        default :
            $('.CPULog').append("Unsupported instruction<br>");
            sim.CU.state = "FETCH_INSTRUCTION_0";
            break;
    }
};

ControlUnit.prototype.RdToALU = function () {
    'use strict';
    sim.RF.selectOutputReg(IR.value >> 4 & 0x1F);
    sim.RF.out = 1;
    sim.ALU.A.in = 1;
};

ControlUnit.prototype.RrToBus = function () {
    'use strict';
    sim.RF.selectOutputReg((IR.value >> 5 & 0x10) | (IR.value & 0x0F));
    sim.RF.out = 1;
};

function DisplayCU(display, x, y) {
    'use strict';
    var paper = display.paper;
    this.BBox = paper.rect(x, y, 200, 100);
    this.label = paper.text(x + 100, y + 15, "Control Unit");

    var state = new CreateRegister(display, x + 15, y + 30, "State", 170);
    this.stateValue = state.value;
    this.stateBBox = state.BBox;

    var instruction = new CreateRegister(display, x + 15, y + 65, "Instruction", 170);
    this.instValue = instruction.value;
    this.instBBox = instruction.BBox;

    //CU display update callbacks.
    sim.CU.updateState = (function (newState) {
        this.stateValue.attr('text', newState);
        playRectUpdateAnim(this.stateBBox, 1);
    }).bind(this);

    sim.CU.updateInstruction = (function (newInstr) {
        if (this.instValue.attr('text') !== newInstr) {
            playRectUpdateAnim(this.instBBox, 1);
        }
        this.instValue.attr('text', newInstr);
    }).bind(this);
}