/**
 * Created by freakazo on 28/06/15.
 */

//Constructs the A register

var ALU = {
    A: new Register(),
    C: new Register(),
    operation: "0",
    SREG: {
        I: 0,
        T: 0,
        H: 0,
        S: 0,
        V: 0,
        N: 0,
        Z: 0,
        C: 0
    }
};

ALU.A.step = function (edge) {
    if (edge === 0 && this.in === 1) {
        this.value = SystemBus.value;
        this.in = 0;
        playBusAnim('C', 1);

    }
};

ALU.C.step = function (edge) {
    if (edge === 1 && this.out === 1) {
        SystemBus.write(this.value);
        this.out = 0;
        playBusAnim('A', 0);
    }
};

ALU.step = function (edge) {
    if (edge === 0) {
        switch (this.operation) {
            case "INC":
                this.C.value = this.A.value + 1;
                playALUToAAnim();
                playCoutAnim();
                break;
            case "ADC":
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