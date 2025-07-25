////////////////////////////////////////////////////////////////
// These values can be changed to match your preferences
// and your Tuna configuration
////////////////////////////////////////////////////////////////

/// The time (in milliseconds) between two Tuna updates, as configured in Tuna settings
const TUNA_FILE_UPDATE_INTERVAL = 400;

/// If true, the full widget is hidden when no music is playing.
/// If false, it will still be visible (but will display last played title)
const HIDE_WIDGET_IF_IDLE = true;

// ------------------------------------------------------------------------

/// The path to the cover image downloaded by Tuna, as configured in Tuna settings
const PATH_TO_COVER = "C:/Streaming/cover.png";

// ------------------------------------------------------------------------

/// The path to the text file containing the "{title}" Tuna tag, as configured in Tuna settings
const PATH_TO_TITLE_FILE = "C:/Streaming/music_title.txt";

/// If true, title text will scroll to be fully visible if it's too long and overflows the widget pane. 
/// If false, it will just be cropped
const ALLOW_TITLE_SCROLLING = true;

// ------------------------------------------------------------------------

/// The path to the text file containing the "{artists}" Tuna tag, as configured in Tuna settings
const PATH_TO_ARTISTS_FILE = "C:/Streaming/music_artist.txt";

/// If true, artists text will scroll to be fully visible if it's too long and overflows the widget pane. 
/// If false, it will just be cropped
const ALLOW_ARTISTS_SCROLLING = false;

// ------------------------------------------------------------------------

/// If true, current song progress will be handled and the following files (progress & duration) will be read to display the progress inside the widget.
/// If false, we don't want progress to be displayed inside the widget and therefore we won't read the following files.
let HANDLE_SONG_PROGRESS = true;

/// The path to the text file containing the "{progress}" Tuna tag, as configured in Tuna settings
const PATH_TO_PROGRESS_FILE = "C:/Streaming/music_progress.txt";

/// The path to the text file containing the "{duration}" Tuna tag, as configured in Tuna settings
const PATH_TO_DURATION_FILE = "C:/Streaming/music_duration.txt";

