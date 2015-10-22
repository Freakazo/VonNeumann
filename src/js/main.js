/*jslint browser: true*/
/*global $, jQuery*/


$(document).ready(function () {
    'use strict';


    sim = new CPUSimulation();

    //Set program memory
    sim.MEM.data[0] = 0x1C10; //ADC r0, r1
    sim.MEM.data[1] = 0xE014; //LDI r17, 4
    sim.MEM.data[2] = 0x1E11; //ADC r1, r17
    sim.MEM.data[3] = 0x1E11; //ADC r1, r17
    sim.MEM.data[4] = 0x1E11; //ADC r1, r17
    sim.MEM.data[5] = 0x1E11; //ADC r1, r17

    //Manually set initial registers.
    sim.RF.regs[0].value = 1;
    sim.RF.regs[1].value = 2;

    $("#step-btn").click(function () {
        display.clearDisplay();
        display.SIM.step();
        display.updateDisplay();
    });


    display = new Disp("vizHolder", sim, 800, 600);
    display.updateDisplay();

});


var display;
var sim;