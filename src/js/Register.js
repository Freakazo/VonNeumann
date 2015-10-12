/**
 * Created by freakazo on 28/06/15.
 */

function Register(){
    this.in = 0;
    this.out = 0;
    this.value = 0;
}

//Helper functions
function createRegister(x, y, label) {

    //Bounding box
    var paper = display.paper;
    this.BBox = paper.rect(x, y, 100, 20);
    //create Label
    this.label = paper.text(x+10, y+10, label);
    //label|Value separator
    var separatorPath = "M" + (x + 20) + " " + y + " L" + (x + 20) + " " + (y + 20);
    this.separator = paper.path(separatorPath);

    this.value = paper.text(x+60, y + 10, "0");
}