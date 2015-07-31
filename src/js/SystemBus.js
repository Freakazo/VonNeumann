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