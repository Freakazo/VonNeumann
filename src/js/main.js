$(document).ready(function () {

    //Setup GUI

    $("#step-btn").click(function () {
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
    updateDisplay();
});

function updateDisplay() {
    for (var i = 0; i < RegisterFile.regs.length; i++) {
        $("td[name=R" + i + "Value]").text(RegisterFile.regs[i].value);
    }
    $("td[name=IRValue]").text(IR.value);
    $("td[name=PCValue]").text(ProgramCounter.count);
    $("td[name=MA]").text(Memory.MemoryAddress.value);
    $("td[name=MD]").text(Memory.MemoryData.value);
}