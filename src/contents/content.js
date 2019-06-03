window.oldAlert = window.alert;
window.alert = function(msg) {
    window.selectStatus = msg;
};

var intervalId = null;
var courseFrame = document.getElementById("iframename");
var refreshButton = document.getElementById("person_info2");
var courseButton = courseFrame.contentWindow.document.getElementById("2018-2019-3-CS33903B-001");

function selectCourse() {
    refreshButton.click();
    courseButton.click();
    if (window.selectStatus && window.selectStatus === "选课成功") {
        window.oldAlert("选课成功");
        clearInterval(intervalId);
    }
}

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    switch (message) {
        case "start":
            intervalId = setInterval(selectCourse, 3000);
            break;
        case "stop":
            if (intervalId) {
                clearInterval(intervalId);
            }
            break;
        default:
            break;
    }

    if (callback) {
        callback();
    }
});
