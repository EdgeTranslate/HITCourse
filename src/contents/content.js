const TOKEN_PATTERN = /id=['"]token['"] *name=['"]token['"] *value=['"](.*?)['"] *\/>/;
const ALERT_PATTERN = /alert\(['"](.*?)['"]\);/;

var locked = false;
var courses = null;
var intervalId = null;
var baseFormData = null;
var refreshButton = document.getElementById("person_info2");
var coursesList = [];
var courseFrame = document.getElementById("iframename");
var queryForm = courseFrame.contentWindow.document.getElementById("queryform");

function getToken(callback) {
    var formData = new FormData();
    formData.append("pageXklb", baseFormData.get("pageXklb"));
    formData.append("pageXnxq", baseFormData.get("pageXnxq"));

    var request = new XMLHttpRequest();
    request.open("POST", "/xsxk/queryXsxkList");
    request.send(formData);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var token = TOKEN_PATTERN.exec(request.responseText)[1];
                callback(token);
            }
        }
    };
}

function selectCourse(course) {
    if (!locked) {
        locked = true;
        var formData = new FormData();
        var request = new XMLHttpRequest();
        baseFormData.forEach((value, key) => {
            formData.append(key, value);
        });
        formData.set("rwh", course.courseNo);
        request.open("POST", "/xsxk/saveXsxk");

        getToken(function(token) {
            formData.set("token", token);
            request.send(formData);
            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        var msg = ALERT_PATTERN.exec(request.responseText)[1];
                        if (msg.includes("选课成功")) {
                            course.selected = true;
                            coursesList.splice(coursesList.indexOf(course.courseNo), 1);
                            refreshButton.click();
                            // eslint-disable-next-line no-console
                            console.log("Course " + course.courseNo + " selected.");
                        }
                    }
                    locked = false;
                }
            };
        });
    }
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

function getTable() {
    courseFrame = document.getElementById("iframename");
    var courseTable = courseFrame.contentWindow.document.getElementsByClassName("bot_line");
    if (courseTable && courseTable[0] && courseTable[0].childNodes[1]) {
        courseTable = courseTable[0].childNodes[1];
        if (courseTable.children.length > 1) {
            return courseTable;
        }
    }
    return undefined;
}

courseFrame.onload = function() {
    queryForm = courseFrame.contentWindow.document.getElementById("queryform");
    var courseTable = getTable();
    if (courseTable) {
        var submit = document.createElement("button");
        var status = coursesList.length === 0; // indicate if query has started  true:not start false: started
        if (status) {
            submit.innerText = "开始抢课";
        } else {
            submit.innerText = "结束选课";
        }

        courseTable.childNodes[0].childNodes[1].appendChild(submit);
        submit.onclick = function() {
            var status = coursesList.length === 0; // indicate if query has started  true:not start false: started
            for (var i = 1; i < courseTable.children.length; i++) {
                var tempDiv = courseTable.childNodes[2 * i].childNodes[1].childNodes[1];
                if (status) {
                    if (tempDiv.childNodes[0].checked) {
                        coursesList.push(tempDiv.childNodes[2].id);
                    }
                }
            }
            if (status) {
                start(coursesList);
            } else {
                stop();
                coursesList = [];
            }
            refreshButton.click();
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
            if (!status) {
                if (coursesList.indexOf(tempDiv.childNodes[2].id) !== -1) {
                    tempDiv.childNodes[0].checked = true;
                }
            }
        }
    }
};
