/**
 * Created by freakazo on 28/06/15.
 */

var SystemBus = {
    value : 0,
    _written : 0

};

SystemBus.write = function(newValue) {
    if(this._written === 1)
        console.log("ERROR: Value already written to system bus");
    else {
        this.value = newValue;
        this._written = 1;
        playSBUpdateAnim();
        $('.CPULog').append("Written to bus: " + newValue + "<br>");
    }
};

SystemBus.step = function (edge) {
    if(edge === 0)
        this._written = 0;

};

function createSB(xOffset, yOffset) {
    display.SB = this;

    this.xOffset = xOffset;
    this.yOffset = yOffset;

    var paper = display.paper;
    var vertLinePath = "M" + xOffset + " " + yOffset + "L" + xOffset + " " + (yOffset + 500);
    this.vertLine = paper.path(vertLinePath);
    this.vertLine.attr({"opacity": 1.0});


    this.busAttachments = [];
    this.attachToBus = function (x, y, obj, callback) {
        var pathString = "M" + x + " " + y + "L" + display.SB.xOffset + " " + y;
        var busPath = paper.path(pathString);
        this.busAttachments.push({"path" : busPath, "obj" : obj, "clb": callback});
    }
}