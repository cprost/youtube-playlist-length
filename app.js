function timeToString(totalTime) {
    // converts seconds to a string in format hh:mm:ss

    let h = Math.floor(totalTime / 3600);
    let m = Math.floor(totalTime % 3600 / 60);
    let s = Math.floor(totalTime % 60);

    let timeString = ((h > 0) ? h + ':' + ((m < 10) ? '0' : '') : '') + m + ':' + ((s < 10) ? '0' : '') + s;

    return timeString;
}

function getTotalTime(times) {
    // parses a string array of video times (e.g. "3:39") and returns the total time in seconds

    totalTime = 0;

    times.forEach(function (time) {
        let h_m_s = time.split(":");  // videos over an hour long have 3 vals to process
        if (h_m_s.length === 3) {
            totalTime += parseInt(h_m_s[0]) * 3600 + parseInt(h_m_s[1]) * 60 + parseInt(h_m_s[2]);
        } else {
            totalTime += parseInt(h_m_s[0]) * 60 + parseInt(h_m_s[1]);
        }
    });

    return totalTime;
}

function getTimes(videos) {
    // reads html video durations, returns a string array of video lengths

    let rawTimes = [];

    for (let i = 0; i < videos.length; i++) {
        rawTimes.push(videos[i].innerText || "");
    }

    cleanedTimes = [];

    rawTimes.forEach(function (element) {
        if (element || element.length > 0) {
            cleanedTimes.push(element.trim());
        }
    });

    return cleanedTimes;
}

function addTimeSpan(timeString) {
    // creates/elements the actual total runtime element

    let spanNode = document.createElement("span");
    let spanTextNode = document.createTextNode(" - Total Time:  " + timeString);

    spanNode.id = "total_playlist_length";
    spanNode.className = "style-scope yt-formatted-string";
    spanNode.appendChild(spanTextNode);

    // if element has already been created, replace it since youtube does not clear all resources on loading a new playlist
    if (document.getElementById("total_playlist_length")) {
        document.getElementById("total_playlist_length").remove();
    }

    document.querySelector("yt-formatted-string.index-message.style-scope.ytd-playlist-panel-renderer").appendChild(spanNode);
}

function loadTotalTime() {
    // repeatedly reads video lengths and updates total duration

    if (document.readyState === 'complete') {
        // get playlist parent element
        let playlistContainer = document.getElementsByClassName('playlist-items').items;

        // get videos from parent
        let videos = playlistContainer.getElementsByClassName('style-scope ytd-thumbnail-overlay-time-status-renderer');

        // get total runtime as string
        let times = getTimes(videos);
        let totalTime = getTotalTime(times);
        let timeString = timeToString(totalTime);

        // create new div/span
        addTimeSpan(timeString);
    }
}

let cycler = setInterval(loadTotalTime, 5000);