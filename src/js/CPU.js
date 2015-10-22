/**
 * Created by freakazo on 28/06/15.
 */


/*jslint browser: true*/
/*global $, jQuery*/

function CPUSimulation() {
    'use strict';
    this.CU = new ControlUnit();
    this.ALU = new ALU();
    this.IR = new IR();
    this.MEM = new MEM();
    this.RF = new REG_FILE(32);
    this.PC = new ProgramCounter();
    this.SB = new SystemBus();

    this.allComponents = [this.CU, this.ALU, this.IR, this.MEM, this.RF, this.PC, this.SB];
}

CPUSimulation.prototype.step = function () {
    'use strict';
    for (var i = 0; i < this.allComponents.length; i++) {
        this.allComponents[i].step(1); //First step with a rising edge.
    }
    for (i = 0; i < this.allComponents.length; i++) {
        this.allComponents[i].step(0); //Step with falling edge.
    }
};