/**
 * Created by freakazo on 28/06/15.
 */

function Register(){
    this.in = 0;
    this.out = 0;
    this.value = 0;
}

//Helper functions
function createRegister(x, y, label, customValueWidth) {
    var paper = display.paper;

    this.label = paper.text(x+5, y+10, label);
    this.label.attr({'text-anchor': 'start'});
    var labelWidth = this.label.getBBox().width;

    //Create Bounding box, if label is short use 100 as width for better GUI conformity.
    //Unless a custom value width has been defined.
    var BBoxWidth = 100;
    if(customValueWidth !== undefined) {
        BBoxWidth = customValueWidth;
    } else {
        if(labelWidth > 20) {
            BBoxWidth = labelWidth + 80;
        }
    }
    this.BBox = paper.rect(x, y, BBoxWidth, 20);
    //Ensure text is always above BBox
    this.BBox.toBack();

    //label|Value separator
    var separatorPath = "M" + (x + labelWidth+10) + " " + y + " L" + (x + labelWidth+10) + " " + (y + 20);
    this.separator = paper.path(separatorPath);

    //Create the value label at the center of the value display area.
    this.value = paper.text(x+labelWidth + (BBoxWidth-labelWidth+10)/2, y + 10, "0");
}