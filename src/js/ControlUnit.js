/**
 * Created by freakazo on 28/06/15.
 */

var ControlUnit = {
    state: "FETCH_INSTRUCTION",
    executeState: "EXE_0"
};

ControlUnit.step = function (edge) {

    //Control unit only updates on rising edge
    if (edge !== 1)
        return;

    $('.CPULog').append("CU state: " + this.state + "<br>");

    this.updateState(this.state);

    //Fetch the instruction and hand of to execute() after instruction is fetched.
    switch (this.state) {
        case "FETCH_INSTRUCTION":
        case "FETCH_INSTRUCTION_0":
            ProgramCounter.PCout = 1;
            Memory.MemoryAddress.in = 1;
            ALU.A.in = 1;
            this.state = "FETCH_INSTRUCTION_1";
            break;
        case "FETCH_INSTRUCTION_1":
            Memory.MemoryData.out = 1;
            IR.in = 1;
            ALU.operation = "INC";
            this.state = "FETCH_INSTRUCTION_2";
            break;
        case "FETCH_INSTRUCTION_2":
            ALU.operation = "NOP";
            ProgramCounter.in = 1;
            ALU.C.out = 1;
            this.state = "EXECUTE";
            break;
        case "EXECUTE" :
            this.execute();
            break;

        default :
            console.log('ERROR: Control unit in invalid state');
    }
};

ControlUnit.execute = function(){

    //Identify the instruction:
    var instruction = "Unknown";
    if((IR.value >> 10) === 7)
        instruction = "ADC";
    else if ((IR.value >> 10) === 3)
        instruction = "ADD";
    else if ((IR.value >> 12) === 14)
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
                    ALU.operation = "ADC";
                    this.executeState = "EXE_2";
                    break;
                case "EXE_2":
                    ALU.operation = "NOP";
                    ALU.C.out = 1;
                    RegisterFile.selectInputReg(IR.value >> 4 & 0x1F);
                    RegisterFile.in = 1;
                    ControlUnit.state = "FETCH_INSTRUCTION_0";
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
                    ALU.operation = "ADD";
                    this.executeState = "EXE_2";
                    break;
                case "EXE_2":
                    ALU.operation = "NOP";
                    ALU.C.out = 1;
                    RegisterFile.selectInputReg(IR.value >> 4 & 0x1F);
                    RegisterFile.in = 1;
                    ControlUnit.state = "FETCH_INSTRUCTION_0";
                    this.executeState = "EXE_0";
                    break;
                default :
                    break;
            }
            break;
        case "LDI":
            IR.outputMode = "IMMEDIATE";
            IR.out = 1;
            RegisterFile.selectInputReg(16+ ((IR.value >> 4) & 0x0F));
            RegisterFile.in = 1;
            ControlUnit.state = "FETCH_INSTRUCTION_0";
            break;
        default :
            $('.CPULog').append("Unsupported instruction<br>");
            ControlUnit.state = "FETCH_INSTRUCTION_0";
            break;
    }
};

ControlUnit.RdToALU = function(){
    RegisterFile.selectOutputReg(IR.value >> 4 & 0x1F);
    RegisterFile.out = 1;
    ALU.A.in = 1;
};

ControlUnit.RrToBus = function(){
    RegisterFile.selectOutputReg( (IR.value >> 5 & 0x10) | (IR.value & 0x0F));
    RegisterFile.out = 1;
};

function ControlUnitDisplay(x, y, controlUnit) {
    var paper = display.paper;
    this.BBox = paper.rect(x, y, 200, 100);
    this.label = paper.text(x+100, y+15, "Control Unit");

    var state = new createRegister(x+15, y+30, "State", 170);
    this.stateValue = state.value;
    this.stateBBox = state.BBox;

    var instruction = new createRegister(x+15, y+65, "Instruction", 170);
    this.instValue = instruction.value;
    this.instBBox = instruction.BBox;

    //CU display update callbacks.
    controlUnit.updateState = (function(newState) {
        this.stateValue.attr('text', newState);
        playRectUpdateAnim(this.stateBBox, 1);
    }).bind(this);

    controlUnit.updateInstruction = (function(newInstr) {
        if(this.instValue.attr('text') !== newInstr) {
            playRectUpdateAnim(this.instBBox, 1);
        }
        this.instValue.attr('text', newInstr);
    }).bind(this);

}