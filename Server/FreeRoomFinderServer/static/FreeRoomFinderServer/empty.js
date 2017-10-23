function HH_MM_SS_to_HH_MM(time) {
    /**
     * Converts time from HH:MM:SS format to HH:MM format
     * @type {string[]}
     */
    var split = time.split(":");
    return split[0] + ":" + split[1];
}
var weekdayElement = $("#day");
var timeElement = $("#time");
var timeNowButton = $("#timenow");
var time;
var weekday;
var emptyList;
var emptyRooms;
function init() {
    // set up event handlers
    weekdayElement.change(refreshList);
    timeElement.change(refreshList);
    // set up time picker
    timeElement.timepicker({ timeFormat: "H:i" });
    // set time to now
    timeNowButton.on('click', function () {
        timeElement.timepicker('setTime', new Date());
    });
    timeNowButton.trigger("click");
    // TODO: set weekday to today
    // set up sorting
    var options = {
        valueNames: ["room", "next_start_time", "last_end_time"],
        item: '<tr><td class="room"></td><td class="last_end_time"></td><td class="next_start_time"</td></tr>'
    };
    // set up list
    emptyList = new List('emptylist', options, []);
    // refresh list
    refreshList();
}
function refreshList() {
    time = timeElement.val();
    weekday = weekdayElement.val();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/api?search=empty&time=" + time + "&weekday=" + weekday, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
        var decoded = String.fromCharCode.apply(null, new Uint8Array(this.response));
        emptyRooms = JSON.parse(decoded);
        emptyList.clear();
        emptyList.add(emptyRooms);
        emptyList.sort("room");
    };
    xhr.send();
}
init();
