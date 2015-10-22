/**
 * Created by freakazo on 28/06/15.
 */


/*jslint browser: true*/
/*global $, jQuery*/


function SystemBus() {
    'use strict';
    this.value = 0;
    this.written = 0;
}

SystemBus.prototype.write = function (newValue) {
    'use strict';
    if (this.written === 1) {
        console.log("ERROR: Value already written to system bus");
    } else {
        this.value = newValue;
        this.written = 1;
        playSBUpdateAnim();
        $('.CPULog').append("Written to bus: " + newValue + "<br>");
    }
};

SystemBus.prototype.step = function (edge) {
    'use strict';
    if (edge === 0)
        this.written = 0;

};

function DisplaySB(display, xOffset, yOffset) {
    'use strict';

    this.xOffset = xOffset;
    this.yOffset = yOffset;

    var paper = display.paper;
    var vertLinePath = "M" + xOffset + " " + yOffset + "L" + xOffset + " " + (yOffset + 500);
    this.vertLine = paper.path(vertLinePath);
    this.vertLine.attr({"opacity": 1.0});
    this.vertLine.translate(0.5, 0.5);


    this.busAttachments = [];
    this.attachToBus = function (x, y, obj, callback) {
        var pathString = "M" + x + " " + y + "L" + display.SB.xOffset + " " + y;
        var busPath = paper.path(pathString);
        busPath.translate(0.5, 0.5);
        this.busAttachments.push({"path": busPath, "obj": obj, "clb": callback});
    }
}