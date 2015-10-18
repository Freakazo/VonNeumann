/**
 * Created by freakazo on 28/06/15.
 */

var ALU = {
    A: new Register(), //Output buffer register.
    C: new Register(), //Input buffer register.
    operation: "0",
    //SREG contains the ALU operation Status Registers.
    SREG: {
        I: 0,
        T: 0,
        H: 0,
        S: 0,
        V: 0, //Two's complement overflow
        N: 0, //Negative TODO:Verify!
        Z: 0, //Zero
        C: 0  //Carry
    }
};

ALU.A.step = function (edge) {
    //Read from system bus
    if (edge === 0 && this.in === 1) {
        this.value = SystemBus.value;
        this.in = 0;
        playBusAnim('C', 1);
    }
};

ALU.C.step = function (edge) {
    //Write to system bus.
    if (edge === 1 && this.out === 1) {
        SystemBus.write(this.value);
        this.out = 0;
        playBusAnim('A', 0);
    }
};

//Perform ALU operation
ALU.step = function (edge) {
    if (edge === 0) {
        switch (this.operation) {
            case "INC": //Increment value
                this.C.value = this.A.value + 1;
                this.updateA(this.A.value);
                playALUToAAnim();
                playCoutAnim();
                break;
            case "ADC": //Add with carry
                var result = add8Bit(this.A.value, SystemBus.value + this.SREG.C);
                this.C.value = result.value;
                this.SREG.C = result.Cout;
                this.setSREGFlags(this.A.value, SystemBus.value, this.C.value);
                playBusAnim('ALU', 1);
                playALUToAAnim();
                playCoutAnim();
                break;
            case "ADD":
                var result = add8Bit(this.A.value, SystemBus.value);
                this.C.value = result.value;
                this.SREG.C = result.Cout;
                this.setSREGFlags(this.A.value, SystemBus.value, this.C.value);
                playBusAnim('ALU', 1);
                playALUToAAnim();
                playCoutAnim();
                break;
            default:
                break;
        }
    }
    this.A.step(edge);
    this.C.step(edge);
};

//Add two eight bit values, returns carry.
function add8Bit(a, b) {
    var result = a + b;
    var carry = 0;
    if(result > Math.pow(2,8)-1) {
        result = result - Math.pow(2,8) -1;
        carry = 1;
    }
    return {value: result, Cout: carry};
}

//Sets all SREG flags except for Carry.
ALU.setSREGFlags = function (Rd, Rr, R) {
    this.SREG.H = testHalfCarry(Rd, Rr, R);
    this.SREG.N = this.C.value >> 7 & 1;
    this.SREG.V = testTwosComplementOvelflow(Rd, Rr, R);
    this.SREG.S = this.SREG.N ^ this.SREG.V;
    this.SREG.Z = (R === 0) ? 1 : 0;
};

function testHalfCarry(val1, val2, result) {
    var b1 = (val1 >> 3) & 1;
    var b2 = (val2 >> 3) & 1;
    var r = (~result >> 3) & 1; //Note R3 is negated here
    var halfCarryResult = b1 & b2 | b2 & r | r & b1;
    return halfCarryResult & 1;
}

function testTwosComplementOvelflow(Rd, Rr, R) {
    var d = (Rd >> 7) & 1;
    var rr = (Rr >> 7) & 1;
    var r = (R >> 7) & 1;
    var result = (d & rr & ~r ) | (~d & ~rr & r);
    return result & 1;
}

//Creates display for ALU
function createALU(ALU) {
    display.ALU = this;
    var paper = display.paper;
    this.ALUBorder = paper.path('m 48,435 -31.877028,0 32.297483,55.940883 42.392485,0 32.064616,-55.537552 -31.366579,0 -21.847971,37.841795 z');
    this.CBBox = paper.rect(80, 400, 100, 20);
    paper.path("M100 400L100 420").translate(0.5, 0.5);
    paper.text(90, 410, "C");
    this.CValue = paper.text(140, 410, "0");
    display.SB.attachToBus(180, 410, "C", function(written) {
        playRectUpdateAnim(display.ALU.CBBox, written);
    });

    display.SB.attachToBus(30, 390, "ALU");
    for(var i = 0; i < display.SB.busAttachments.length; i++) {
        if(display.SB.busAttachments[i].obj === "ALU") {
            var oldPath = display.SB.busAttachments[i].path.attr('path');
            oldPath += " M30 435 L30, 390";
            display.SB.busAttachments[i].path.attr('path', oldPath);
        }
    }
    this.ALUOperation = paper.text(70, 480, "noop");

    this.ABBox = paper.rect(20, 510, 100, 20);
    paper.path("M40 510L40 530").translate(0.5, 0.5);
    paper.text(30, 520, "A");
    this.AValue = paper.text(80, 520, "0");
    display.SB.attachToBus(120, 520, "A");

    this.Cout = paper.path("M110 420 L110 435").translate(0.5, 0.5);

    this.ALUToA = paper.path("M70 490L70 510");
    this.ALUToA.translate(0.5, 0.5);

    //
    ALU.updateA = function (value) {
        display.ALU.ALUToA.attr({stroke: "#F00", "stroke-width": 4});
        display.ALU.ALUToA.node.setAttribute('class', 'path');
        setTimeout(function(){
            display.ALU.ALUToA.animate({"stroke-width": 1}, 800);
        }, 0);
        playRectUpdateAnim(display.ALU.ABBox, 1);
        //Clear path animation after step.
        clearCallbacks.push((function() {
            display.ALU.ALUToA.node.removeAttribute('class');
        }).bind(this));
    };
}