////////////////////////////////////////////////////////////////////
//
//  Tuna Universal Widget
//  Author: Dinopony
//  Version: 1.0
//
////////////////////////////////////////////////////////////////////

///////////////////////////////////////
// Global constants
///////////////////////////////////////

const UPDATE_TICK_TIME = 1000 / 30;


///////////////////////////////////////
// Global variables
///////////////////////////////////////

let $fullWidget = null;

let $leftPaneRightSide = null;
let $cover = null;
let $title = null;
let $artists = null;

let $rightPane = null;
let $currentTime = null;
let $totalTime = null;
let $progressBar = null;
let $progressBarValue = null;

let lastReadTitleWasValid = false;
let timeBeforeHidingWidget = 0;
let titleScroller = null;
let artistsScroller = null;

let currentTime = 0;
let songDuration = 0;


/**
 * Parses a string with a time as outputted by Tuna into an integer value containing elapsed milliseconds.
 * @param {string} timeStr the string to parse
 * @returns an integer value of the matching time, or 0 if format was invalid / string was empty
 */
function parseTime(timeStr) {
    const parts = timeStr.split(":");
    if(parts.length < 2) {
        return 0;
    }
    minutes = parseInt(parts[0]);
    seconds = parseInt(parts[1]);
    return (minutes * 60 + seconds) * 1000;
}

/**
 * Formats a time represented as an integer value containing elapsed milliseconds into a human-readable string.
 * @param {number} value the time value to format
 * @returns the time formatted as "M:SS"
 */
function formatTime(value) {
    const timeInSeconds = Math.round(value / 1000);
    const seconds = timeInSeconds % 60;
    const minutes = (timeInSeconds - seconds) / 60;
    
    const strMinutes = `${minutes}`;
    const strSeconds = (seconds < 10) ? `0${seconds}` : `${seconds}`;
    return `${strMinutes}:${strSeconds}`;
}

function updateCoverImage() {
    // Try updating the cover image if a valid title was provided by Tuna, using the path in config.
    // We append the current time to the URL to prevent any cache from working, which would prevent the cover from updating
    $cover.style.visibility = "visible";
    $cover.src = `http://absolute/${PATH_TO_COVER}?t=`+ new Date().getTime();
}

/**
 * Read files outputted by Tuna to get the data about the song being currently played.
 */
function readFiles() {
    // Read title file
    fetch(`http://absolute/${PATH_TO_TITLE_FILE}`).then((res) => res.text()).then((text) => {
        setIsPlayingState(text.trim() != "");
        if(text.trim() != "") {
            titleScroller.setText(text);
            updateCoverImage();
        }
    }).catch(() => titleScroller.setInError());

    // Read artists file
    fetch(`http://absolute/${PATH_TO_ARTISTS_FILE}`).then((res) => res.text()).then((text) => {
        if(text.trim() != "") {
            artistsScroller.setText(text);
        }
    }).catch(() => artistsScroller.setInError());

    if(HANDLE_SONG_PROGRESS) {
        // Read progress file
        fetch(`http://absolute/${PATH_TO_PROGRESS_FILE}`).then((res) => res.text()).then((text) => {
            currentTime = (text.trim() != "") ? parseTime(text) : 0;
        }).catch(() => HANDLE_SONG_PROGRESS = false);

        // Read duration file
        fetch(`http://absolute/${PATH_TO_DURATION_FILE}`).then((res) => res.text()).then((text) => {
            songDuration = (text.trim() != "") ? parseTime(text) : 0;
        }).catch(() => HANDLE_SONG_PROGRESS = false);
    }
}

function setIsPlayingState(isPlaying) {
    if(lastReadTitleWasValid && !isPlaying) {
        timeBeforeHidingWidget = TUNA_FILE_UPDATE_INTERVAL * 4;
    }
    lastReadTitleWasValid = isPlaying;

    if(!HIDE_WIDGET_IF_IDLE) {
        // If the option to hide the full widget is disabled, only hide the elements with the "masked-if-idle" class
        // For instance, this is used to hide the cover image when no song is playing, as well as the "now playing" animation.
        const expectedVisibility = (lastReadTitleWasValid) ? "visible" : "hidden";
        const elems = document.getElementsByClassName("masked-if-idle");
        for(let elem of elems) {
            if(elem.style.visibility != expectedVisibility) {
                elem.style.visibility = expectedVisibility;
            }
        }
    }
}

/**
 * Update the view of the widget with up-to-date information, as well as animating parts where relevant.
 */
function updateView() {
    // If the full widget must be hidden when no song is playing...
    if(HIDE_WIDGET_IF_IDLE) {
        if(lastReadTitleWasValid) {
            // ... show it if a song is playing
            $fullWidget.style.opacity = 1;
        } else {
            // ... and hide it after a pity timer if no song is playing
            timeBeforeHidingWidget -= UPDATE_TICK_TIME;
            if(timeBeforeHidingWidget <= 0)
                $fullWidget.style.opacity = 0;
        }
    }

    // Make the title & artists texts scroll in case it's too big to fit in the left pane
    titleScroller.update(UPDATE_TICK_TIME);
    artistsScroller.update(UPDATE_TICK_TIME);

    // Update displayed time values
    if(HANDLE_SONG_PROGRESS) {
        currentTime += UPDATE_TICK_TIME;
        $currentTime.textContent = formatTime(currentTime);
        $totalTime.textContent = formatTime(songDuration);

        // Update the progress bar
        let progressBarValueWidth = (currentTime / songDuration) * $progressBar.offsetWidth;
        if(progressBarValueWidth < 20) {
            progressBarValueWidth = 20;
        }
        if(songDuration <= 0) {
            progressBarValueWidth = 0;
        }
        $progressBarValue.style.width = `${progressBarValueWidth}px`;
    } else {
        $rightPane.style.display = "none";
    }
}

/**
 * Initialize the widget.
 */
function main() {
    $fullWidget = document.getElementsByTagName("body")[0];

    $leftPaneRightSide = document.getElementById("left-pane-right-side");
    $cover = document.getElementById("cover");
    $title = document.getElementById("title");
    $artists = document.getElementById("artists");

    $rightPane = document.getElementById("right-pane");
    $currentTime = document.getElementById("current-time");
    $totalTime = document.getElementById("total-time");
    $progressBar = document.getElementById("progress-bar");
    $progressBarValue = document.getElementById("progress-bar-value");

    titleScroller = new TextScroller($title, $leftPaneRightSide, ALLOW_TITLE_SCROLLING);
    artistsScroller = new TextScroller($artists, $leftPaneRightSide, ALLOW_ARTISTS_SCROLLING);

    if(!HANDLE_SONG_PROGRESS) {
        $rightPane.style.display = "none";
    }

    if(!HIDE_WIDGET_IF_IDLE) {
        $fullWidget.style.opacity = 1;
    }

    setInterval(readFiles, TUNA_FILE_UPDATE_INTERVAL);
    setInterval(updateView, UPDATE_TICK_TIME);
}

document.addEventListener("DOMContentLoaded", main);