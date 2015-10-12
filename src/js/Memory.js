/**
 * Created by freakazo on 28/06/15.
 */

function MEM() {
    this.MemoryData = new Register();
    this.MemoryData.step = MDStep;
    this.MemoryAddress = new Register();
    this.MemoryAddress.step = MAStep;
    this.data = [];
    this.data.length = 800;
}

MEM.prototype.step = function (edge) {
    this.MemoryAddress.step(edge);
    this.MemoryData.step(edge);
};

function MAStep (edge) {
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
        this.in = 0;
        if(this.updateAddress !== undefined) {
            this.updateAddress(this.value, 1);
        }
    }
}

function MDStep(edge) {
    if (this.out === 1 && this.out === 0) {
        console.log("ERROR: MD can't write and read to system bus at the same time");
    }

    //Read from the system bus
    else if (this.out === 1 && edge === 1) {
        this.value = Memory.data[Memory.MemoryAddress.value];
        SystemBus.write(Memory.data[Memory.MemoryAddress.value]);
        this.out = 0;
        if(this.updateDataValue !== undefined) {
            this.updateDataValue(this.value, 0);
        }
    }
    //Write to the system bus
    else if (this.in === 1 && edge === 0) {
        this.value = SystemBus.value;
        Memory.data[Memory.MemoryAddress] = SystemBus.value;
        this.in = 0;
        if(this.updateDataValue !== undefined) {
            this.updateDataValue(this.value, 1);
        }
    }
}

var Memory = new MEM();

function createMemoryDisplay(x, y, memory) {

    this.x = x;
    this.y = y;

    //Callbacks for updating display
    memory.MemoryAddress.updateAddress = (function(address, isWrite) {
        //Update Memory Address
        this.MAValue.attr('text', address);
        playRectUpdateAnim(this.MABBox, isWrite);
        playBusAnim("MA", isWrite);
    }).bind(this);

    memory.MemoryData.updateDataValue = (function (dataValue, isWrite) {
        this.MDValue.attr('text', dataValue);
        playRectUpdateAnim(this.MDBBox, isWrite);
        playBusAnim("MD", isWrite);

        //Display path from Memory Data register to memory cell being read/written.
        var startX = this.x + 115;
        var startY = this.y + 75;

        var qx = this.x + 140; //Control point for bezier curve
        var qy = this.y + 40;

        var midX = this.x + 160; //Midpoint of bezier curve
        var midY = this.y + 50;

        var endX = this.x + 175 + 15 * (Memory.MemoryAddress.value % 10);
        var endY = this.y - 15 + (parseInt(Memory.MemoryAddress.value / 10)) * 15;

        var memPathString = "M " + startX + " " + startY;
        memPathString += "Q " + qx + " " + qy + ", " + midX + " " + midY;
        memPathString += "T " + endX + " " + endY;
        this.followPath = display.paper.path(memPathString);

        var colour = "#0F0";
        if (isWrite === 1)
            colour = "#F00";

        this.followPath.attr({opacity: 0.6, stroke: colour, "stroke-width": 1.5});

    }).bind(this);

    // Create Memory interface items.
    display.MEM = this;
    var paper = display.paper;
    this.BBox = paper.rect(x, y, 150, 100);
    this.label = paper.text(x+75, y+15, "Memory Interface");

    var MA = new createRegister(x+15, y+30, "MA");
    this.MAValue = MA.value;
    this.MABBox = MA.BBox;
    display.SB.attachToBus(x, y+40, "MA");

    var MD = new createRegister(x+15, y+65, "MD");
    this.MDValue = MD.value;
    this.MDBBox = MD.BBox;
    display.SB.attachToBus(x, y+75, "MD");


    //Create Main memory display.
    var memBox = paper.rect(x+150+20, y-25, 153, 153);

    //Initialize the 2D array.
    var rects = new Array(10);
    for(var i=0; i<10; i++) {
        rects[i] = new Array(10);
    }

    //Create boxes for Main Memory cells.
    for(var i=0; i< 10; i++) {
        for(var iy=0; iy<10; iy++) {
            rects[i][iy] = paper.rect(x + 175 + 15 * i, y - 20 + iy*15, 8, 8);
            var memCell = rects[i][iy];
            memCell.node.memIndexX = i;
            memCell.node.memIndexY = iy;
            memCell.node.memX = x + 175 + 15 * i;
            memCell.node.memY = y - 20 + iy*15;

            //Display memory cell value on mouse over.
            memCell.node.onmouseover = function () {
                var memCell = rects[this.memIndexX][this.memIndexY];
                memCell.animate({'fill' : "#A0A", 'transform' : "s10 2"}, 100);
                //Ensure the cell is not behind other cells when it is expanded.
                memCell.toFront();
                //Transform the cells x and y index back to a memory address to find the value of the cell.
                var index = memCell.node.memIndexX + memCell.node.memIndexY*10;
                memCell.valueDisplay = display.paper.text(memCell.node.memX+3, memCell.node.memY+3, Memory.data[index]);
                memCell.valueDisplay.node.setAttribute("pointer-events", "none");
            };

            memCell.node.onmouseout = function () {
                var memCell = rects[this.memIndexX][this.memIndexY];
                //Have to set stroke-width back to 1, raphael animation messes it up for some unknown reason.
                memCell.animate({'fill' : "", 'transform' : "s1 1", "stroke-width": 1}, 100);
                memCell.valueDisplay.remove();
            };
        }
    }
}