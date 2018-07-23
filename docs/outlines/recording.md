# Recording data View Outline
This document outlines features and general layout for users to record their data and what they will see while recording.  
This document is mostly a guideline and is open for discussion, and is subject to change.

Features with `(F)` are less important, or intended to be added later in the future.  
Features with `(?)` are undecided on whether they should be implemented/important.

## Features
* Recording interesting data.
* Showing relevant data to driver.

## Recording data
* One or two buttons
  - Clear of recording state
    * It should be obvious whether we are currently recording data or not.
* Settings
  - All settings can be changed later as [Modifiable Session Metadata](/docs/outlines/view-recordings.md#modifiable-session-metadata)
  - Override auto-selected track information
  - Pre-set session name
  - Pre-set car
  - Disable video recording(F)
  - Peripherals(F)
    * Allow user to connect their peripheral devices

## Showing Information to Driver
* Cannot be distracting
* Multiple views
  - Simple Status
    * Shows basic information about whether things are working or not.
  - Simple Lap timing
    * Current lap time
    * Previous lap time
    * Best lap time
    * Previous lap split to best
  - Advanced Lap Timing
    * Total session elapsed time
    * Current lap time
    * Previous lap time
    * Best lap time
    * Previous lap split from best
    * Predicted lap time or split from best
  - Simple Data
    * Speed
    * G-Force
    * Advanced lap timer
      - Changes between numbers to show
      - Current lap time
        * Default/fallback
      - Current split from best lap
        * Shown 33% and 66% into lap
      - Final lap time and split from best
        * Show final lap time after finish line
        * After short delay, show split from previously best lap
  - Custom view(F)
    * Grid based drag & drop system for dropping in UI elements.
