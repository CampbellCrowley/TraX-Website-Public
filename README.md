# TraX
TraX is a website for calculating your lap times on a race track,
as well as collecting other information such as G-Forces,
and streaming it live to any internet connected device.
Previously recorded track sessions can also be viewed later and played back.

## Usage
Go to [https://trax.campbellcrowley.com][home] on a smartphone to record data  
or  
[https://trax.campbellcrowley.com/viewdata/][viewdata] to view previously recorded data  
or  
[https://trax.campbellcrowley.com/live/][live] to view current data being recorded by you, your friends, or public sessions.  

## Features
* Tracks smartphone GPS position, acceleration, and rotation.
* Streams the data to a server
  - Server saves the data for later download
  - Server sends the data to friends in the [live view][live] page
  - Buffers data on device while internet connection is lost, then sends buffered data once connected again.
  - Users have a limit of the amount of data allowed to be stored on the server. This limit can be expanded by donating on [Patreon][patreon].
* Lap times while recording
  - Current session duration (since recording start)
  - Current lap time (since crossing start line, until crossing finish line)
  - Predicted lap time and split
    * Takes difference of best lap and current lap
    * Compares distance around lap of both laps, and takes the difference in time
    * Requires driving at least one lap first
  - Previous lap time
  - Your best lap time
* Keeps device awake while recording
  - Chrome and Safari implemented
  - Firefox is insists on making this difficult...
* Viewing recorded data
  - Your recordings as well as friends' recordings
  - Lap times
    * Fastest lap
    * Slowest lap
    * Average lap time
    * Split from best lap in individual laps
  - Speeds (based off what GPS reports)
    * Top speed
    * Lowest speed
    * Average speed
  - Max G-Force
  - Data plotted on map
    * GPS position
    * Linearly interpolated between datapoints
    * Realtime playback
    * Plotted line can be colored based off data (__very__ slow to change currently)
  - Download recorded data for use in other apps
    * Data can be downloaded as a CSV or GPX for use in third party apps.
    * Raw data can also be downloaded, but is fairly useless to most people.

## Future
* Better UI (It's really bad rn)
* Recording video (live streaming?)
* Offline mode
* Record while app/webpage is in background
* App version
* Crew
* Social
  - Comparing times to friends
  - Commenting on friends
  - Setting a session as public/unlisted
  - Finding public sessions
* Better data analysis
  - Snap GPS to known tracks
  - Auto detect track configurations
* Store more information
  - Store car information with session data
  - Show weather information with session data
* Configurable notifications
  - Received friend request
  - Friend beats your time
  - Friend is currently at a track
  - Friend is recording a track session
  
---

© Copyright 2018, Campbell Crowley

[home]: https://trax.campbellcrowley.com
[live]: https://trax.campbellcrowley.com/live/
[viewdata]: https://trax.campbellcrowley.com/viewdata/
[patreon]: https://www.patreon.com/campbellcrowley/
