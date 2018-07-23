# Viewing Live Data Outline
This document outlines features and general layout for allowing users to view data being recorded by drivers as it is recorded.  
This document is mostly a guideline and is open for discussion, and is subject to change.

Features with `(F)` are less important, or intended to be added later in the future.  
Features with `(?)` are undecided on whether they should be implemented/important.

## Features
* View single driver's session.
* View multiple drivers' sessions.
* View all sessions on track.

## Interesting Data
* Single Driver
  - Track Information
    * Track Name
    * Track Configuration
      - Plot line on map
      - Mark Start and Finish lines on map
    * Current Weather Forecast
  - Driver Information
    * Driver Name
    * Car(F)
    * Nationality/World region(?)
  - Session Information
    * Current GPS position on map
    * Current Speed
    * Current G-Force magnitude
    * Lap Times
      - Total time on track this session
      - Current Lap time
      - Current Lap number
      - Predicted lap time / current split from best
      - Previous Lap
        * All previous laps(?)
      - Best Lap
    * Video streams(F)
    * Advanced data
      - G-Force as 3 vectors
        * Lateral, Longitudinal, Vertical
      - World Orientation
        * Down and forward directions clear
      - Other data from connected peripherals(F)
* Multiple Drivers on Same Track
  - Track Information
    * Track Name
    * Track Configuration
      - Plot line on map
      - Mark Start and Finish lines on map
    * Current Weather Forecast
    * Track time if different from client time
  - Driver information for each driver
    * Driver Name
    * Car(F)
    * Nationality/World region(?)
  - Session Information
    * Current GPS position on map
    * Lap Times
      - Total time on track this session
      - Current Lap time
      - Current Lap number
      - Predicted lap time / current split from best
      - Previous Lap time
        * All previous laps(?)
      - Best Lap time
* Multiple Drivers on Different Tracks
  - Track information for each driver
    * Track Name
    * Track Configuration
    * Track time if different from client time
  - Driver information for each driver
    * Driver Name
    * Car(F)
    * Nationality/World region(?)
  - Session information for each driver
    * Current GPS position on map
    * Lap Times
      - Current Lap Number
      - Current Lap
      - Best Lap

## Finding / Showing Drivers
* Visible sessions
  - Friends, sessions marked public, own sessions
* Viewing drivers
  - User can show / hide drivers in prominent display
  - Finding drivers to show / hide
    * Show offline friends
    * Sorting by
      - First or Last name
      - Current Track
      - Best lap time
      - Nationality / World Region(?)
  - Drivers can be highlighted in prominent display for more information
    * Any number of drivers can be highlighted
