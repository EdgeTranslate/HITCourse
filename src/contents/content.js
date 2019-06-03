const ALERT_PATTERN = /alert\(['"](.*?)['"]\);/;

var courses = null;
var intervalId = null;
var baseFormData = null;
var courseFrame = document.getElementById("iframename");
var queryForm = courseFrame.contentWindow.document.getElementById("queryform");

function selectCourse(course) {
    var formData = new FormData();
    var request = new XMLHttpRequest();
    baseFormData.forEach((value, key) => {
        formData.append(key, value);
    });

    formData.set("rwh", course.courseNo);
    request.open("POST", "/xsxk/saveXsxk");
    request.send(formData);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var msg = ALERT_PATTERN.exec(request.responseText)[1];
                if (msg.includes("选课成功")) {
                    course.selected = true;
                }
            }
        }
    };
}

function watchCourses() {
    var finished = true;
    courses.forEach(course => {
        if (!course.selected) {
            selectCourse(course);
        }
        finished = finished & course.selected;
    });

    if (finished) {
        clearInterval(intervalId);
    }
}

function start(courseNos) {
    courses = new Array();
    courseNos.forEach(courseNo => {
        courses.push({ courseNo: courseNo, selected: false });
    });
    baseFormData = new FormData(queryForm);
    intervalId = setInterval(watchCourses, 3000);
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId);
    }
}

start(new Array());
stop();

// chrome.runtime.onMessage.addListener(function(message, sender, callback) {
//     switch (message.type) {
//         case "start":
//             start(message.content);
//             break;
//         case "stop":
//             stop();
//             break;
//         default:
//             break;
//     }

//     if (callback) {
//         callback();
//     }
// });
