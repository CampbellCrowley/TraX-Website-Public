# Viewing Recorded Data Outline
This document outlines features and general layout for allowing users to analyze the data they recorded at an earlier time.  
This document is mostly a guideline and is open for discussion, and is subject to change.

Features with `(F)` are less important, or intended to be added later in the future.  
Features with `(?)` are undecided on whether they should be implemented/important.

## Features
* View all interesting data in simplified and easy to understand format.
* Modify session metadata.
* Download own session data.
* View sessions from friends.
* View sessions made public.

## Interesting Data
* Track Information
  - Track Name
  - Track Configuration Name
  - Altitudes
  - Length
* Driver Information
  - Name
  - Car(F)
  - Nationality/World region(?)
* Full session
  - Time, Date, Duration
  - Top Speed
  - Max G-Force
  - Fastest Lap
    * As well as comparison to Personal Best
    * Or comparison to "Optimal" time(F)
  - Slowest Lap
  - Average Lap
  - Weather(F)
* Single Lap
  - Lap Time
    * Comparison to Session Fastest lap(?)
    * Comparison to Personal Best lap time
  - Top Speed
  - Average Speed(?)
  - Slowest Speed(?)
  - Max G-Force(?)
* Single Instant
  - Instantaneous speed
  - G-Force (Number as magnitude, or divided into 3 vectors?)
    * Lateral Acceleration
    * Longitudinal Acceleration
    * Vertical Acceleration
  - Rotation(?)
    * Heading (Facing direction)
    * Track (Direction of movement)
    * Roll
    * Pitch
  - Altitude
  - Number of Satellites locked(F)
* Real Time Playback
  - Ability to play data back in real time
* Map view
  - Ability to view data plotted on a map for easier understanding and interface

## Modifiable Session Metadata
Only the owner of the data and Crew should be able to edit __any__ metadata.
* Session title
* Session Description
* User Comments(?)
* Track and Track Configuration
  - For if the auto-selected value is incorrect
* Car information(F)
  - Information about what car was driven during this session
* Sharing status
  - Public
    * Anybody can view
    * Shows up in public searches
    * Blocked users can't view(?)
  - Private
    * Only the owner can view
    * Not even friends can view
  - Crew only(F)
    * Only crew and owner can view
  - Unlisted
    * Only those with the valid URL can view
    * Blocked users can't view(?)
  - Friends only
    * All friends can view
  - Direct Share(?)
    * Individuals specifically given access can also view
    * Allow giving edit permissions(?)

## Download Session Data
* Data is exportable in a format usable by third party apps
  - Multiple formats available for greater compatibility
    * Common CSV format for [RaceRender 3](http://racerender.com/RR3/Features.html)
    * GPX Version for [Strava](https://www.strava.com/)
      - Direct uploading through [APIv3](https://developers.strava.com/docs/reference/)(F)
    * JSON raw data for re-uploading to TraX
    * GIF(F)
      - Generate customizable video overlay GIFs from data
    * MP4(F)
      - Directly add overlays to videos
* Sections of whole session can be downloaded
  - Divided by laps
  - Only positive laps (On-track laps, exclude data off track)(?)

## Viewable Sessions
* Interface for organizing own sessions
  - Sort
    * Name
    * Record date
    * Track and Track Configuration
    * Car(F)
  - Search
  - Folders(?)
* Interface for viewing other sessions (Need to be able to find wanted information easily. Below data is what should be available)
  - Search (Searching within sections as well as globally)
  - Sections (Sorting and searching by sub-sections)
    * Crew(F)
      - Drivers
    * Friends
      - Individual Friend
      - Track
        * Record Date
        * Best Lap Time
        * Average Best Lap Time
        * Car(F)
      - Car(F)
    * Public
      - Track
        * Record Date
        * Best Lap Time
        * Car(F)
      - Driver
      - Car(F)
  
---

© Copyright 2018, Campbell Crowley
