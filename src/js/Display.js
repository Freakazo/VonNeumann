/**
 * Created by freakazo on 28/07/15.
 */

//CPU Display functions

function regUpdated(index, written) {

    //Asynchronous function for display and deletion of update animation
    var square = display.regSquares[index];
    playUpdateAnim(square, written);

    var y = (50+index*10);
    var vertDistance =  y - (40 + 320)/2;
    if(vertDistance > 0 ) {
        y -= 10;
        vertDistance += 10;
    }

    var regPathString = "M 70" + " " + y;
    regPathString += "Q 85 " + (y - vertDistance/4) + ", " + 80 + " " + (y - vertDistance/2);
    regPathString += "T 110 " + (40 + 320)/2;
    display.RF.followPath = display.paper.path(regPathString);
    if(written === 1) {
        display.RF.followPath.node.setAttribute('class', 'pathReverse');
    } else {
        display.RF.followPath.node.setAttribute('class', 'path');
    }



    var colour = "#0F0";
    if(written === 1)
        colour = "#F00";

    display.RF.followPath.attr({opacity: 0.5, stroke: colour});
}


function playUpdateAnim(rect, written) {
    var animLength = 800;
    setTimeout(function() {
        var colour = "#0F0";
        if(written === 1)
            colour = "#F00";

        rect.attr({"fill": colour, "opacity" : 0.8});
        rect.animate({"opacity": 0.1}, animLength);
    }, 0);
}

function playBusAnim(caller, written) {
    var BA = display.SB.busAttachments;
    for(var i = 0; i < BA.length; i++) {
        if(BA[i].obj === caller) {
            busAnim(BA[i].path, written);
            if(BA[i].clb != undefined) {
                BA[i].clb(written);
            }
        }
    }
}

function busAnim(path, written) {
    setTimeout(function () {
        var color = "#0F0";
        if(written === 1)
            color = "#F00";
        path.attr({"stroke": color});
        path.attr({"stroke-width": "4"});
        path.animate({"stroke-width": "1"}, 800);
        if(written) {
            path.node.setAttribute('class', 'pathReverse');
        } else {
            path.node.setAttribute('class', 'path');
        }
    }, 0);

    clearCallbacks.push(function () {
        path.node.removeAttribute('class');
    });
}

function playALUToAAnim() {

}

function playCoutAnim() {
    display.ALU.Cout.attr({stroke: "#0F0", "stroke-width": 4});
    setTimeout(function(){
        display.ALU.Cout.animate({"stroke-width": 1}, 800);
    }, 0)
}

function playSBUpdateAnim() {
    var VL = display.SB.vertLine;

    VL.attr({"stroke-width": 4});
    setTimeout(function () {
        VL.animate({"stroke-width": 2}, 200);
    }, 0)
}


//Animation helper functions
function playRectUpdateAnim(rect, written) {
    var color = "#0F0";
    if(written === 1)
        color = "#F00";
    rect.attr({fill: color, "fill-opacity" : 1});
    setTimeout(function () {
        rect.animate({"fill-opacity": 0.3}, 800);
    }, 0);
    clearCallbacks.push(function () {
        rect.stop();
        rect.attr({"fill-opacity": 0});
    })
}
