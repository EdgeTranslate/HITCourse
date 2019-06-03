window.oldAlert = window.alert;
window.alert = function(msg) {
    window.selectStatus = msg;
};

var intervalId = null;
var courseFrame = document.getElementById("iframename");
var courseFrameDocument = courseFrame.contentWindow.document;
var refreshButton = document.getElementById("person_info2");
var courseButton = courseFrameDocument.getElementById("2018-2019-3-CS33903B-001");

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

var getTable = function() {
    courseFrame = document.getElementById("iframename");
    courseFrameDocument = courseFrame.contentWindow.document;
    var courseTable = courseFrameDocument.getElementsByClassName("bot_line");
    if (courseTable && courseTable[0] && courseTable[0].childNodes[1]) {
        courseTable = courseTable[0].childNodes[1];
        if (courseTable.children.length > 1) {
            return courseTable;
        }
    }
    return undefined;
};

var test = function() {
    var courseTable = getTable();
    if (courseTable) {
        var submit = document.createElement("button");
        submit.innerText = "开始抢课";
        var message = {};
        message.type = "start";
        message.content = [];
        courseTable.childNodes[0].childNodes[1].appendChild(submit);
        submit.onclick = function() {
            var message = {};
            message.type = "start";
            message.content = [];
            // var courseTable = getTable();
            // if (courseTable) {
            for (var i = 1; i < courseTable.children.length; i++) {
                var tempDiv = courseTable.childNodes[2 * i].childNodes[1].childNodes[1];
                if (tempDiv.childNodes[0].checked) {
                    message.content.push(tempDiv.childNodes[2].id);
                }
            }
            start(message);
            // }
        };

        for (var i = 1; i < courseTable.children.length; i++) {
            var button = document.createElement("input");

            button.type = "checkbox";
            button.style.cssFloat = "left";
            button.style.position = "relative";
            button.style.width = "19px";
            button.style.height = "19px";
            button.style.top = "1px";
            // button.style.cssFloat = "left";
            var tempDiv = courseTable.childNodes[2 * i].childNodes[1].childNodes[1];
            tempDiv.insertBefore(button, tempDiv.firstChild);
        }
    }
};

courseFrame.addEventListener("load", test);
