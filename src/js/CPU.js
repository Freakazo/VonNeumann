/**
 * Created by freakazo on 28/06/15.
 */


var components = [ControlUnit, ALU, IR, Memory, RegisterFile, ProgramCounter, SystemBus];

function step() {
    for(var i = 0; i < components.length; i++) {
        components[i].step(1); //First step with a rising edge.
    }
    for(var i = 0; i < components.length; i++) {
        components[i].step(0); //Step with falling edge.
    }
}