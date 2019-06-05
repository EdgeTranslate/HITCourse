chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    switch (message.type) {
        case "course_selected":
            chrome.notifications.create(message.content, {
                type: "basic",
                iconUrl: "./icon/icon128.png",
                title: chrome.i18n.getMessage("AppName"),
                message: chrome.i18n.getMessage("CourseSelected") + message.content
            });
            break;
        default:
            break;
    }
    if (callback) {
        callback();
    }
});
