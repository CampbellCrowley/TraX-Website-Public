// Copyright 2018-2019 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
/**
 * The base class for all TraX related things.
 * @class TraX
 */
(function(TraX, undefined) {
  /**
   * Prevent navigating away from page if not all data was sent saved.
   * @return {?string}
   */
  window.onbeforeunload = function() {
    if (!isPaused) {
      return 'You are still recording data, are you sure you wish to leave?';
    }
    if (sendBuffer.length > 0) {
      return 'Not all data has been sent to the server, ' +
          'are you sure you wish to leave?';
    }
    return null;
  };

  // Constants //
  /**
   * Milliseconds to retry sending missed chunks.
   * @default
   * @constant
   * @private
   * @type {number}
   */
  const successTimeout = 10000;
  /**
   * Milliseconds to check for stale data.
   * @default
   * @constant
   * @private
   * @type {number}
   */
  const staleDataFlushFrequency = 100;
  /**
   * Milliseconds to check filesize on server.
   * @default
   * @constant
   * @private
   * @type {number}
   */
  const filesizeCheckFrequency = 10000;
  /**
   * Milliseconds to update HUD.
   * @default
   * @constant
   * @private
   * @type {number}
   */
  const realtimeClockUpdateFrequency = 51;
  /**
   * Milliseconds of minimum allowable delta between gps updates.
   * @default
   * @constant
   * @private
   * @type {number}
   */
  const gpsMinFrequency = 5000;

  // Screen size (x/y) in pixels.
  /* let w = window;
  let d = document;
  let e = d.documentElement;
  let g = d.getElementsByTagName('body')[0];
  let x = w.innerWidth || e.clientWidth || g.clientWidth;
  let y = w.innerHeight || e.clientHeight || g.clientHeight; */

  // Settings/Events/Intervals/Timeouts //
  /**
   * All scripts loaded and initialized.
   * @default
   * @public
   * @readonly
   * @type {boolean}
   */
  TraX.initialized = false;
  /**
   * Debug setting used across scripts for additional logging and additional UI
   * sections that most users do not wish to see.
   * @default
   * @public
   * @type {number}
   */
  TraX.debugMode = 0;
  /**
   * Timeout until heartbeat hasn't happened for too long and we can assume
   * death of sensors.
   * @private
   * @type {Timeout}
   */
  let heartbeatTimeout;
  /**
   * Timeout until heartbeat hasn't happened for too long and we can assume
   * death of GPS updates.
   * @private
   * @type {Timeout}
   */
  let gpsHeartbeatTimeout;
  /**
   * Heartbeat from server
   * @private
   * @type {Timeout}
   */
  let serverTimeout;
  /**
   * Watch Position ID. For GPS update watching.
   * @private
   * @type {number}
   */
  let wpid;
  /**
   * If data sending to server is paused or recording.
   * @default
   * @private
   * @type {boolean}
   */
  let isPaused = true;
  /**
   * If we have prevented sending to server via options or setting. Not flipped
   * due to errors or invalid state.
   * @default
   * @private
   * @type {boolean}
   */
  let preventSend = false;
  /**
   * If we have sent the user's login token to server at least once. If the
   * token is empty this will also be false.
   * @default
   * @private
   * @type {boolean}
   */
  let tokenSent = false;
  /**
   * How often to save data in milliseconds.
   * @private
   * @type {number}
   */
  let updateFrequency;
  /**
   * Number of heartbeats we have received since starting getting data to
   * determine if this device has usable sensors.
   * @private
   * @type {number}
   */
  let heartbeatCount;
  /**
   * Previous setting the user had chosen for frequency of sending data to
   * server.
   * @default
   * @private
   * @type {number}
   */
  let previousUpdateFrequency = Math.Infinity;
  /**
   * Interval to check for data to pop from preSendBuffer and send to server.
   * @private
   * @type {Interval}
   */
  let updateInterval;
  /**
   * Interval to update clocks in live data view.
   * @private
   * @type {Interval}
   */
  let realtimeDataClockInterval;
  /**
   * Interval to update the realtime timers HUD.
   * @private
   * @type {Interval}
   */
  let updateTimersInterval;
  /**
   * Options to pass into watching GPS.
   * @default
   * @constant
   * @private
   * @type {PositionOptions}
   */
  const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity,
  };

  // UI States //
  /**
   * Are the mini status lights currently visible.
   * @default
   * @private
   * @type {boolean}
   */
  let statusLightsVisible = false;
  /**
   * Is the options menu open.
   * @private
   * @default
   * @type {boolean}
   */
  let optionsMenuOpen = false;
  /**
   * Is the sensors view open.
   * @private
   * @default
   * @type {boolean}
   */
  let realtimeViewOpen = false;
  /**
   * Is the friends overlay open.
   * @private
   * @default
   * @type {boolean}
   */
  let friendViewOpen = false;
  /**
   * Is the map visible.
   * @private
   * @default
   * @type {boolean}
   */
  let friendmapEnabled = false;
  /**
   * The currently visible HUD.
   * @private
   * @default
   * @type {number}
   */
  let visibleHUD = 1;

  // Socket //
  /**
   * Whether we are connected to the server or not.
   * @private
   * @default
   * @type {boolean}
   */
  let isConnected = false;
  /**
   * The session we are recording right now.
   * @private
   * @default
   * @type {string}
   */
  let sessionId = '';
  /**
   * The previous session id we were recording for.
   * @private
   * @default
   * @type {string}
   */
  const previousSessionId = '';
  /**
   * The name of the session we are recording now.
   * @private
   * @default
   * @type {string}
   */
  let sessionName = '';
  /**
   * ID of the currently selected track.
   * @private
   * @type {string|number}
   */
  let trackId;
  /**
   * The id of the user who owns the track data.
   * @private
   * @type {string}
   */
  let trackOwnerId;
  /**
   * The id of the currently selected track configuration.
   * @private
   * @type {string|number}
   */
  let configId;
  /**
   * The id of the user who owns the config data, currently is ignored and must
   * be the same as trackOwnerId.
   * @private
   * @type {string}
   */
  let configOwnerId;
  /**
   * Queue of messages to send once we have connected to the server.
   * @private
   * @default
   * @type {Array}
   */
  let socketMessageQueue = [];

  /**
   * App version.
   * @private
   * @default
   * @type {string}
   */
  let versionNum = 'Unknown';

  // HTML Elements
  let redLight;
  let greenLight;
  let absoluteDom;
  let compassAlphaDom;
  let alphaDom;
  let betaDom;
  let gammaDom;
  let accelerationDom;
  let accelIncGravDom;
  let rotationRateDom;
  let intervalDom;
  let longitudeDom;
  let latitudeDom;
  let posInfoDom;
  let pausePlayButton;
  let pausedGreenLight;
  let pausedRedLight;
  let debugDom;
  let updateFrequencyDom;
  let sendBufferDom;
  let greenLightConnected;
  let redLightConnected;
  let friendmapDom;
  let greenLightSending;
  let yellowLightSending;
  let redLightSending;
  let greenLightWriting;
  let redLightWriting;
  let filesizeDom;
  let needIMUDom;
  let needAccountDom;
  let sessionInputDom;
  let trackNameSelectDom;
  let configNameSelectDom;
  let optionsMenuDom;
  let realtimeDataDom;
  let realtimeDeviceClockDom;
  let realtimeGPSClockDom;
  let realtimeSensorClockDom;
  let largeGreenLight;
  let largeYellowLight;
  let largeRedLight;
  let largeProcessingLight;
  let statusLightListDom;
  let greenLightGPS;
  let redLightGPS;
  let greenLightScripts;
  let redLightScripts;
  let xAxisFlipDom;
  let yAxisFlipDom;
  let zAxisFlipDom;
  let realtimeDeviceTypeDom;
  let realtimeDeviceBrowserDom;
  let friendmapToggleDom;
  let optionsToggleDom;
  let realtimeDataToggleDom;
  let toggleDebugDom;
  let trackNameEditButton;
  let configNameEditButton;
  let bigButtonModeButton;
  let timerModeButton;
  // let customModeButton;
  let timersHUDDom;
  let bigButtonHUDDom;
  // let customHUDDom;
  let bigTimerDom;
  let littleTimerTopDom;
  let littleTimerLeftDom;
  let littleTimerRightDom;
  let littleTimerLeftTopDom;
  let littleTimerRightTopDom;
  let doCompressionDom;
  let timersTrackTitleDom;
  let debugBluetoothDom;
  let friendsViewToggleDom;
  let friendsViewDom;
  let friendsUsernameDom;
  let friendsListDom;
  let friendsIdDom;
  let friendsIdInputDom;
  let friendsRequestListDom;
  let blockedListDom;
  let extraDataDom;
  let dataViewButtonDom;
  let streamIsPublicDom;
  let secretURLDom;

  // Device Info //
  // Buffered data to send
  let longitude;
  let latitude;
  let accuracy;
  let altitude;
  let altAccuracy;
  let heading;
  let speed;
  let timestamp;
  let absolute;
  let compassAlpha;
  let acceleration;
  let accelIncGrav;
  let rotationRate;
  let interval;
  let asBar;
  let bsBar;
  let gsBar;
  let acBar;
  let bcBar;
  let gcBar;
  let alpha;
  let beta;
  let gamma;


  /**
   * Debugging messages to send along with the data chunks.
   * @private
   * @type {Array.<string>}
   */
  let messages;
  /**
   * Number of sensors readings received to average.
   * @private
   * @type {number}
   */
  let orientationCount;
  /**
   * Number of sensors readings received to average.
   * @private
   * @type {number}
   */
  let accelerationCount;
  /**
   * User agent of current browser.
   * @private
   * @type {string}
   */
  let userAgent;
  /**
   * Should we reset buffered gyro data since data changes periodically but the
   * value doesn't necessarily change.
   * @default
   * @private
   * @type {boolean}
   */
  let doGyroDataReset = true;
  /**
   * Rotation with -Z pointing towards the Earth.
   * @default
   * @public
   * @readonly
   * @type {{a: number, b: number, g: number}}
   */
  TraX.downRotation = {a: 0, b: 0, g: 0};
  /**
   * Number of received sensor values with minimal acceleration.
   * @default
   * @private
   * @type {number}
   */
  let resetDownCount = 0;
  /**
   * The last time we attempted to pop the preSendBuffer.
   * @private
   * @type {number}
   */
  let previousUpdate;
  /**
   * Collection of buffered data chunks to send to server.
   * @private
   * @default
   * @type {Array.<Object>}
   */
  const sendBuffer = [];
  /**
   * Current rotation of device screen only used for realtime canvases.
   * @default
   * @private
   * @type {{angle: number}}
   */
  let currentScreenOrientation = {angle: 0};

  // Message Box //
  /**
   * Number of message boxes shown for warning the user their device is slow.
   * @default
   * @private
   * @type {number}
   */
  let popMessageWarningCount = 0;

  // Code status //
  /**
   * No sensor data received for too long.
   * @default
   * @private
   * @type {boolean}
   */
  let sensorsDead = false;
  /**
   * No gps data received for too long.
   * @default
   * @private
   * @type {boolean}
   */
  let gpsDead = false;
  /**
   * Socket.io thinks the server connection died.
   * @default
   * @private
   * @type {boolean}
   */
  let connectionDead = true;
  /**
   * No data from server received for too long.
   * @default
   * @private
   * @type {boolean}
   */
  // let serverDead = true;
  /**
   * A script failed to load.
   * @default
   * @private
   * @type {boolean}
   */
  let scriptsDead = false; // eslint-disable-line prefer-const
  /**
   * If the user is not signed in.
   * @default
   * @private
   * @type {boolean}
   */
  let accountDead = true;
  /**
   * Override to force the big light to red. Set if we're sure sensors don't
   * work
   * and we're not getting enough data to function minimally.
   * @default
   * @private
   * @type {boolean}
   */
  let forceDead = false;

  // Timers Data view //
  /**
   * The time when Record was pressed.
   * @default
   * @private
   * @type {number}
   */
  let sessionStartTime = 0;
  /**
   * The time when the start line was crossed.
   * @default
   * @private
   * @type {number}
   */
  let lapStartTime = 0;
  /**
   * The time the previous lap started to allow for processing laps while data
   * overlaps.
   * @default
   * @private
   * @type {number}
   */
  let previousLapStartTime = 0;
  /**
   * Previous lap duration in milliseconds.
   * @default
   * @private
   * @type {number}
   */
  let previousLapDuration = 0;
  /**
   * The best lap duration in milliseconds.
   * @default
   * @private
   * @type {number}
   */
  let bestLapDuration = 0;
  /**
   * The predicted milliseconds the current lap will take.
   * @default
   * @private
   * @type {number}
   */
  let predictedLapDuration = 0;
  /**
   * Driver has crossed start but not finish yet.
   * @default
   * @private
   * @type {boolean}
   */
  let currentlyRacing = false;
  /**
   * Just crossed the start line and haven't left the threshold radius yet.
   * @default
   * @private
   * @type {boolean}
   */
  let justStartedRacing = false;
  /**
   * Just crossed the finish line and haven't left the threshold radius yet.
   * @default
   * @private
   * @type {boolean}
   */
  let justFinishedRacing = false;
  /**
   * Just crossed the start and finish line and haven't left the threshold
   * radius
   * yet, but are transitioning to next lap.
   * @default
   * @private
   * @type {boolean}
   */
  let inTransition = false;
  /**
   * Are we currently in a lap.
   * @default
   * @private
   * @type {boolean}
   */
  let currentLapState = false;
  /**
   * Previous received coordinate.
   * @default
   * @private
   * @type {{lat: number, lng: number}}
   */
  let previousCoord = {lat: 0, lng: 0};
  /**
   * Previous previously received coordinate.
   * @default
   * @private
   * @type {{lat: number, lng: number}}
   */
  let previousPreviousCoord = {lat: 0, lng: 0};
  /**
   * Times at distances driven during the best lap.
   * @default
   * @private
   * @type {Array.<Object>}
   */
  let bestLapData = [];
  /**
   * Times at distances through lap driven (Starts at start line).
   * @default
   * @private
   * @type {Array.<Object>}
   */
  let previousLapData = [];
  /**
   * Current lap times at distances since start line.
   * @default
   * @private
   * @type {Array.<Object>}
   */
  let currentLapData = [];
  /**
   * Current lap distance driven since start line.
   * @default
   * @private
   * @type {number}
   */
  let currentDistanceDriven = 0;
  /**
   * Number of laps driven this session.
   * @default
   * @private
   * @type {number}
   */
  let lapNum = 0;
  /**
   * Number of nonlaps driven this session.
   * @default
   * @private
   * @type {number}
   */
  let nonLapNum = 1;


  // Friends //
  /**
   * All of user's friends.
   * @default
   * @public
   * @type {Array.<Object>}
   */
  TraX.friendsList = [];
  /**
   * All users with a relationship to user.
   * @default
   * @private
   * @type {Array.<Object>}
   */
  let allRelations = [];
  /**
   * Locations of friends who are currently sharing location.
   * @default
   * @private
   * @type {Array.<Object>}
   */
  const friendPositions = [];
  /**
   * Array of markers on map of each friend position.
   * @default
   * @private
   * @type {Array.<google.maps.Marker>}
   */
  let friendMarkers = [];
  /**
   * The user's current secret.
   * @private
   * @default
   * @type {string}
   */
  let secret = '';

  /**
   * List of available tracks to select
   * @default
   * @private
   * @type {Array.<Object>}
   */
  let trackList = [];
  /**
   * List of available configs to select.
   * @default
   * @private
   * @type {Array.<Object>}
   */
  const configList = [];
  /**
   * Have we sent a request to the server are still waiting for a response from
   * the server with the track list.
   * @default
   * @private
   * @type {boolean}
   */
  let waitingForTrackList = false;

  /**
   * Current amount of data the user has stored on the server for TraX in bytes.
   * @default
   * @private
   * @type {number}
   */
  let datasize = 0;
  /**
   * The maximum amount of data the user may store on the server in bytes.
   * @default
   * @private
   * @type {number}
   */
  let datalimit = 0;

  /**
   * Resume receiving data and sending.
   *
   * @private
   */
  function resume() {
    // Event Listeners / Data collection
    if (!realtimeViewOpen) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      window.addEventListener('devicemotion', handleMotion, true);
      if (!friendmapEnabled) {
        if (!navigator.geolocation) {
          TraX.showMessageBox(
              'Your current browser does not allow me to view geolocation.');
        } else {
          wpid = navigator.geolocation.watchPosition(
              handleNewPosition, handlePosError, geoOptions);
        }
      }
    }

    // TraX.triggerHUDFullscreen();

    // Buffer management
    updateInterval = setInterval(popPreSendBuffer, updateFrequency);

    // Session management
    sessionName = sessionInputDom.value;
    sessionId = 'S' + Date.now() +
        (TraX.socket.id || Math.random().toString(36).substring(2, 15));

    // UI updates. Disable options that could be distracting while driving.
    sessionInputDom.disabled = true;
    TraX.sessionInputChange();
    trackNameSelectDom.disabled = true;
    configNameSelectDom.disabled = true;
    trackNameEditButton.disabled = true;
    configNameEditButton.disabled = true;
    doCompressionDom.disabled = true;
    optionsToggleDom.disabled = true;
    friendsViewToggleDom.disabled = true;
    realtimeDataToggleDom.disabled = true;
    dataViewButtonDom.disabled = true;

    // Ensure UIs are closed while driving.
    TraX.toggleOptionsMenu(false);
    TraX.toggleFriendsView(false);

    // Create new session for recording we are starting.
    if (!preventSend && TraX.isSignedIn) {
      if (isConnected) {
        TraX.socket.emit(
            'newsession', sessionName, trackId, trackOwnerId, configId,
            configOwnerId, sessionId);
      } else {
        socketMessageQueue.push([
          'newsession',
          sessionName,
          trackId,
          trackOwnerId,
          configId,
          configOwnerId,
          sessionId,
        ]);
      }
    } else if (!preventSend) {
      socketMessageQueue.push([
        'newsession',
        sessionName,
        trackId,
        trackOwnerId,
        configId,
        configOwnerId,
        sessionId,
      ]);
    }

    // Reset timers since we are starting a new session.
    resetTimersHUD();
    lapNum = 0;
    nonLapNum = 1;
    sessionStartTime = Date.now();
    updateTimersInterval =
        setInterval(updateTimersHUD, realtimeClockUpdateFrequency);
    popMessageWarningCount = 0;

    // Reset values to show we have resumed.
    pausePlayButton.innerHTML = 'Stop';
    isPaused = false;
    heartbeatCount = 0;
    updateServerLights();

    // Prevent device from sleeping.
    KeepAwake.keepAwake(true);

    // Record video.
    if (TraX.Video) TraX.Video.startRecording();
  }
  /**
   * Pause/Stop data collection
   *
   * @private
   */
  function pause() {
    // Stop data collection to save device resources
    if (!realtimeViewOpen) {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('devicemotion', handleMotion, true);
      if (!friendmapEnabled) {
        if (navigator.geolocation) {
          navigator.geolocation.clearWatch(wpid);
        }
      }
    }
    clearInterval(updateInterval);

    // Reset timers and freeze on current display.
    resetTimersHUD(true);

    // Re-enable UI
    sessionInputDom.disabled = false;
    sessionId = '';
    TraX.sessionInputChange();
    trackNameSelectDom.disabled = false;
    configNameSelectDom.disabled = false;
    trackNameEditButton.disabled = false;
    configNameEditButton.disabled = false;
    doCompressionDom.disabled = false;
    optionsToggleDom.disabled = false;
    friendsViewToggleDom.disabled = false;
    realtimeDataToggleDom.disabled = false;
    dataViewButtonDom.disabled = false;

    // Show user data collection has stopped.
    pausePlayButton.innerHTML =
        previousSessionId.length <= 0 ? 'Record' : 'Resume';
    pausedRedLight.style.display = 'inline-block';
    pausedGreenLight.style.display = 'none';
    isPaused = true;
    updateServerLights();

    // Allow device to sleep.
    KeepAwake.keepAwake(false);

    // End video recording.
    if (TraX.Video) TraX.Video.stopRecording();
  }
  /**
   * Toggle recording of data.
   *
   * @public
   * @param {?boolean} [force=undefined] Force state, or toggle with undefined.
   */
  TraX.togglePause = function(force) {
    if (typeof force === 'boolean') {
      if (force == isPaused) return;
    }
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  /**
   * Initialize script
   *
   * @public
   */
  TraX.init = function() {
    redLight = document.getElementById('redLightStatus');
    greenLight = document.getElementById('greenLightStatus');
    absoluteDom = document.getElementById('absolute');
    compassAlphaDom = document.getElementById('compassAlpha');
    alphaDom = document.getElementById('alpha');
    betaDom = document.getElementById('beta');
    gammaDom = document.getElementById('gamma');
    accelerationDom = document.getElementById('acceleration');
    accelIncGravDom = document.getElementById('accelIncGrav');
    rotationRateDom = document.getElementById('rotationRate');
    intervalDom = document.getElementById('interval');
    longitudeDom = document.getElementById('longitude');
    latitudeDom = document.getElementById('latitude');
    posInfoDom = document.getElementById('posinfo');
    pausePlayButton = document.getElementById('pausePlay');
    pausedGreenLight = document.getElementById('greenLightPaused');
    pausedRedLight = document.getElementById('redLightPaused');
    debugDom = document.getElementById('debug');
    sendBufferDom = document.getElementById('sendBuffer');
    updateFrequencyDom = document.getElementById('updateFrequency');
    redLightConnected = document.getElementById('redLightConnected');
    greenLightConnected = document.getElementById('greenLightConnected');
    redLightSending = document.getElementById('redLightSending');
    yellowLightSending = document.getElementById('yellowLightSending');
    greenLightSending = document.getElementById('greenLightSending');
    redLightWriting = document.getElementById('redLightWriting');
    greenLightWriting = document.getElementById('greenLightWriting');
    friendmapDom = document.getElementById('friendmap');
    filesizeDom = document.getElementById('filesize');
    needIMUDom = document.getElementById('needIMU');
    needAccountDom = document.getElementById('needAccount');
    sessionInputDom = document.getElementById('sessionInput');
    trackNameSelectDom = document.getElementById('sessionTrackNameSelect');
    configNameSelectDom = document.getElementById('sessionConfigNameSelect');
    optionsMenuDom = document.getElementById('optionsMenu');
    realtimeDataDom = document.getElementById('realtimeData');
    realtimeLngDom = document.getElementById('realtimeLongitude');
    realtimeLatDom = document.getElementById('realtimeLatitude');
    realtimeAltDom = document.getElementById('realtimeAltitude');
    realtimeSpdDom = document.getElementById('realtimeGPSSpeed');
    realtimeHedDom = document.getElementById('realtimeGPSHeading');
    realtimeDeviceClockDom = document.getElementById('realtimeDeviceClock');
    realtimeGPSClockDom = document.getElementById('realtimeGPSClock');
    realtimeSensorClockDom = document.getElementById('realtimeSensorClock');
    realtimeDeviceTypeDom = document.getElementById('realtimeDeviceType');
    realtimeDeviceBrowserDom = document.getElementById('realtimeDeviceBrowser');
    largeGreenLight = document.getElementById('greenLightLarge');
    largeYellowLight = document.getElementById('yellowLightLarge');
    largeRedLight = document.getElementById('redLightLarge');
    largeProcessingLight = document.getElementById('processingLightLarge');
    statusLightListDom = document.getElementById('statusLightList');
    greenLightGPS = document.getElementById('greenLightGPS');
    redLightGPS = document.getElementById('redLightGPS');
    greenLightScripts = document.getElementById('greenLightScripts');
    redLightScripts = document.getElementById('redLightScripts');
    xAxisFlipDom = document.getElementById('flipXAxisButton');
    yAxisFlipDom = document.getElementById('flipYAxisButton');
    zAxisFlipDom = document.getElementById('flipZAxisButton');
    // TraX.unitDropdownDom = document.getElementById("unitDropdown");
    friendmapToggleDom = document.getElementById('mapToggle');
    optionsToggleDom = document.getElementById('optionsMenuToggle');
    realtimeDataToggleDom = document.getElementById('realtimeDataToggle');
    toggleDebugDom = document.getElementById('debugMode');
    trackNameEditButton = document.getElementById('sessionTrackNameEdit');
    configNameEditButton = document.getElementById('sessionConfigNameEdit');
    bigButtonModeButton = document.getElementById('chooseBigButton');
    timerModeButton = document.getElementById('chooseTimers');
    // customModeButton = document.getElementById("chooseCustom");
    bigButtonHUDDom = document.getElementById('bigButtonHUD');
    timersHUDDom = document.getElementById('timersHUD');
    // customHUDDom = document.getElementById("customHUD");
    bigTimerDom = document.getElementById('bigTimer');
    littleTimerTopDom = document.getElementById('littleTimer0');
    littleTimerLeftDom = document.getElementById('littleTimer1');
    littleTimerRightDom = document.getElementById('littleTimer2');
    littleTimerLeftTopDom = document.getElementById('littleTimer3');
    littleTimerRightTopDom = document.getElementById('littleTimer4');
    doCompressionDom = document.getElementById('doCompression');
    timersTrackTitleDom = document.getElementById('timersTitle');
    debugBluetoothDom = document.getElementById('bluetoothDebug');
    friendsViewToggleDom = document.getElementById('friendViewToggle');
    friendsViewDom = document.getElementById('friendView');
    friendsUsernameDom = document.getElementById('friendViewName');
    friendsIdDom = document.getElementById('friendViewId');
    friendsListDom = document.getElementById('friendList');
    friendsIdInputDom = document.getElementById('friendInput');
    friendsRequestListDom = document.getElementById('friendRequestList');
    blockedListDom = document.getElementById('blockedList');
    extraDataDom = document.getElementById('extraDataCheckbox');
    dataViewButtonDom = document.getElementById('viewDataToggle');
    streamIsPublicDom = document.getElementById('streamIsPublicCheckbox');
    secretURLDom = document.getElementById('secretURL');

    const detectTrackButton = document.createElement('button');
    detectTrackButton.onclick = function() {
      navigator.geolocation.getCurrentPosition(
          handleNewPosition, handlePosError, geoOptions);
    };
    detectTrackButton.innerHTML = '<span>Detect Track</span>';
    detectTrackButton.classList.add('links');
    detectTrackButton.classList.add('smaller');
    detectTrackButton.classList.add('nohover');
    timersTrackTitleDom.appendChild(detectTrackButton);

    streamIsPublicDom.onchange = function() {
      if (this.checked) {
        if (confirm(
            'Are you sure you wish to make your live data public?\n' +
                'Anybody on the live view page will be able to see your live ' +
                'position and name.')) {
          TraX.socket.emit('setpublic', true);
        } else {
          this.checked = false;
        }
      } else {
        TraX.socket.emit('setpublic', false);
      }
    };

    // Reset stored variables.
    resetData();
    resetTimersHUD();

    // Start background processes.
    setInterval(flushStaleData, staleDataFlushFrequency);
    filesizeCheckInterval =
        setInterval(TraX.requestFilesize, filesizeCheckFrequency);

    // Attempt to get user info if they are already signed in. Otherwise we will
    // catch the sign-in state changing.
    try {
      token = gapi.auth2.getAuthInstance()
          .currentUser.get()
          .getAuthResponse()
          .id_token;
    } catch (e) {  // Page probably not loaded yet or user not signed in.
    }

    // Fault checking
    updateFrequency = updateFrequencyDom.value;
    heartbeat();
    gpsHeartbeat();
    serverHeartbeat();

    // Update UI to ready.
    greenLightScripts.style.display = 'inline-block';
    redLightScripts.style.display = 'none';
    timerModeButton.disabled = false;
    // customModeButton.disabled = false;
    bigButtonModeButton.disabled = false;
    pausePlayButton.innerHTML = 'Record';
    pausePlayButton.disabled = false;

    doCompressionDom.onchange = function() {
      TraX.setURLOption(
          'docompression', doCompressionDom.checked ? 1 : undefined);
    };
    updateFrequencyDom.onchange = function() {
      if (updateFrequencyDom.value != 140) {
        TraX.setURLOption('frequency', updateFrequencyDom.value);
      } else {
        TraX.setURLOption('frequency', undefined);
      }
    };
    TraX.addEventListener('signin', signInStateChange);
    TraX.addEventListener('signout', signInStateChange);

    // Add bluetooth menu.
    const btRefresh = document.createElement('button');
    btRefresh.onclick = TraX.handleClickBluetoothRefresh;
    btRefresh.innerHTML = 'Add Device';
    debugBluetoothDom.innerHTML = '';
    debugBluetoothDom.appendChild(btRefresh);

    socketInit();

    // Register service worker to allow for offline loading, or fasting loading
    // of cached version.
    if (navigator.serviceWorker) {
      navigator.serviceWorker
          .register('https://dev.campbellcrowley.com/trax/traxSW.js')
          .then(function(registration) {
            if (TraX.debugMode) {
              console.log(
                  'ServiceWorker registration successful with scope:',
                  registration.scope);
            }
          })
          .catch(function(err) {
            console.warn('ServiceWorker registration failed:', err);
          });
    }

    // Everything is ready
    TraX.initialized = true;

    updateMainStatus();

    // Post-Init
    setTimeout(function() {
      // Check for settings the user specified in the url.
      checkURLOptions();
      checkDeviceOptions();

      // Cause UI update to happen sooner.
      TraX.sessionInputChange();
    });
  };
  /**
   * Initialize socket portion of script.
   *
   * @private
   */
  function socketInit() {
    TraX.socket.on('connected', function() {
      isConnected = true;
      connectionDead = false;
      updateMainStatus();
      updateServerLights();
      requestVersionNum();
      fetchTrackList();
      TraX.requestFilesize();

      TraX.socket.emit('fetchSecret');

      console.log('Flushing unsent messages:', socketMessageQueue);
      for (let i = 0; i < socketMessageQueue.length; i++) {
        TraX.socket.emit(...socketMessageQueue[i]);
      }
      socketMessageQueue = [];
    });
    TraX.socket.on('disconnect', function(reason) {
      isConnected = false;
      tokenSent = false;
      connectionDead = true;
      updateServerLights();
      handleSecret();
    });
    TraX.socket.on('reconnect', function(attempts) {
      // 'connected' also fires when this happens.
      TraX.socket.emit('setpublic', streamIsPublicDom.checked);
    });
    TraX.socket.on('stats', function(filesize, sessionid) {
      connectionDead = false;
      datasize = filesize;
      updateFilesize();
    });
    TraX.socket.on('datalimit', function(limit) {
      connectionDead = false;
      datalimit = limit;
      updateFilesize();
    });
    TraX.socket.on('createdsession', function(newSessionId) {
      console.log('Session created successfully:', newSessionId);
    });
    TraX.socket.on('success', function(chunkid) {
      connectionDead = false;
      serverHeartbeat();
      popSendBuffer(chunkid);
    });
    TraX.socket.on('fail', function(reason, extraInfo) {
      connectionDead = false;
      // console.log("Server failed. Reason:", reason, extraInfo);
      if (reason === 'noid' && TraX.isSignedIn) {
        if (token) {
          console.log('Re-sending token');
          TraX.socket.emit('newtoken', token);
          tokenSent = true;
          TraX.requestFriendsList();
        }
      } else if (TraX.isSignedIn && !isPaused && reason === 'writeerror') {
        console.log('Writing failed due to session not created yet.');
      } else if (reason === 'readerr') {
        console.log(
            'Reading data failed. Data probably doesn\'t exist.', extraInfo);
      } else if (reason === 'invalidsessionid') {
        console.error(
            'Server says we are not sending sessionId', sessionId,
            getSessionId(), extraInfo);
      } else if (reason === 'createsession') {
        console.log(
            'Re-sending session creation per server request.', extraInfo);
        if (extraInfo == sessionId) {
          if (!preventSend && TraX.isSignedIn) {
            if (isConnected) {
              TraX.socket.emit(
                  'newsession', sessionName, trackId, trackOwnerId, configId,
                  configOwnerId, sessionId);
            } else {
              socketMessageQueue.push([
                'newsession',
                sessionName,
                trackId,
                trackOwnerId,
                configId,
                configOwnerId,
                sessionId,
              ]);
            }
          } else if (!preventSend) {
            socketMessageQueue.push([
              'newsession',
              sessionName,
              trackId,
              trackOwnerId,
              configId,
              configOwnerId,
              sessionId,
            ]);
          }
        }
      } else if (reason === 'nostorage') {
        console.log('User has run out of storage space on server.');
        TraX.showMessageBox(
            'You are out of storage space! You are unable to send more data' +
            ' to the server!');
      } else if (reason !== 'noid') {
        console.warn(
            'UNCAUGHT SERVER FAIL:', reason, extraInfo,
            'All failures should be handled properly!');
        if (isPaused) {
          TraX.showMessageBox(
              'Ignore this message: (Server responded with fail code: ' +
              reason + ')');
        }
      }
    });
    TraX.socket.on('friendPos', function(friendId, pos) {
      connectionDead = false;
      updateFriendPos(friendId, pos);
    });
    TraX.socket.on('tracklist', handleNewTrackData);
    TraX.socket.on('version', handleNewVersion);
    TraX.socket.on('friendslist', function() {
      setTimeout(function() {
        updateFriendsList();
        fetchTrackList();
      });
    });
    TraX.socket.on('relationshiplist', function(list) {
      if (TraX.debugMode) console.log('All relations', list);
      allRelations = list;
      updateFriendsList();
    });
    TraX.socket.on('friendfail', function(fail, more) {
      console.log('Server failed friend request. Reason:', fail, more);
      if (fail == 'success') {
        TraX.showMessageBox('Successfully sent friend request!');
      } else if (fail == 'nowfriends') {
        TraX.showMessageBox(
            'Both of you wish to be friends. You are now friends!');
      } else if (fail == 'unknownuser') {
        TraX.showMessageBox(
            'I don\'t know who that is. Perhaps that person has not made ' +
            'an account yet.');
      } else if (fail == 'addingself') {
        TraX.showMessageBox(
            'Sorry, adding yourself as a friend doesn\'t work.');
      } else {
        TraX.showMessageBox('Sending friend request failed: ' + fail);
      }
    });
    TraX.socket.on('secret', handleSecret);
    TraX.socket.on('pong_', console.log);
  }
  /**
   * Request total storage size the user has on server.
   *
   * @public
   */
  TraX.requestFilesize = function() {
    TraX.socket.emit('requestsessionsize', '../');
    TraX.socket.emit('requestsessionlimit');
  };
  /**
   * Request the summary of the best lap for this configuration.
   *
   * @private
   * @param {boolean} [force=false] Force updating even if we already have the
   * summary.
   */
  function requestConfigSummary(force) {
    if (typeof trackId === 'undefined') return;
    let tempConfigId = configId;
    if (typeof configId === 'undefined') {
      tempConfigId = configNameSelectDom.value;
    }
    if (typeof tempConfigId === 'undefined') return;

    for (let i = 0; i < TraX.friendsList.length; i++) {
      if (!force) {
        const search = [
          TraX.friendsList[i].id,
          trackOwnerId,
          trackId,
          tempConfigId,
        ].join(',');
        if (TraX.summaryList[search]) continue;
      }
      console.log(
          'Requested config summary', TraX.friendsList[i].id, trackOwnerId,
          trackId, /* configOwnerId,*/ tempConfigId);
      TraX.socket.emit(
          'getsummary', trackId, tempConfigId, TraX.friendsList[i].id,
          trackOwnerId);
    }
    if (!force) {
      const search =
          [TraX.getDriverId(), trackOwnerId, trackId, tempConfigId].join(',');
      if (TraX.summaryList[search]) return;
    }
    if (TraX.debugMode) {
      console.log(
          'Requested config summary', TraX.getDriverId(), trackOwnerId, trackId,
          /* configOwnerId,*/ tempConfigId);
    }
    TraX.socket.emit(
        'getsummary', trackId, tempConfigId, TraX.getDriverId(), trackOwnerId);
  }
  /**
   * Update the summary of the current configuration with current data.
   *
   * @private
   */
  function updateConfigSummary() {
    const search =
        [TraX.getDriverId(), trackOwnerId, trackId, configId].join(',');
    let summary = TraX.summaryList[search];
    if (!summary || summary.bestLapDuration > bestLapDuration) {
      summary = {
        'bestLapDuration': bestLapDuration,
        'bestLapData': bestLapData,
        'sessionStartTime': sessionStartTime,
        'sessionId': sessionId,
      };
      console.log('Updating Summary:', search, summary);
      TraX.socket.emit(
          'updatesummary', trackId, configId, TraX.getDriverId(), trackOwnerId,
          JSON.stringify(summary));
    }
  }
  /**
   * Reset buffered data.
   *
   * @private
   */
  function resetData() {
    doGyroDataReset = true;
    longitude = 0.0;
    latitude = 0.0;
    accuracy = 0.0;
    altitude = 0.0;
    altAccuracy = 0.0;
    heading = 0.0;
    speed = 0.0;
    timestamp = 0;
    acceleration = [0, 0, 0];
    accelIncGrav = [0, 0, 0];
    rotationRate = [0, 0, 0];
    accelerationCount = 0;
    messages = [];
  }
  /**
   * Check URL for queries.
   *
   * @private
   */
  function checkURLOptions() {
    const options = getURLOptions();
    if (TraX.debugMode) console.log('Options:', options);
    if (options['map'] > 0 /* && y < 690*/) {
      TraX.toggleMap();
    }
    if (options['debug'] > 0) {
      toggleDebugDom.style.display = 'block';
      TraX.toggleDebug(options['debug'] - 1);
    }
    if (options['livedata'] > 0) {
      TraX.toggleRealtimeView(true);
    }
    if (options['friends'] > 0) {
      TraX.toggleFriendsView(true);
    }
    if (options['friendId'] > 0) {
      TraX.toggleFriendsView(true);
      friendsIdInputDom.value = options['friendId'];
      TraX.showMessageBox(
          'Click Send Request at the bottom to confirm sending request.',
          15000);
      TraX.setURLOption('friendId');

      friendsIdInputDom.parentNode.style.backgroundColor = 'yellow';
      friendsIdInputDom.parentNode.style.transition =
          'background-color 1.5s cubic-bezier(0.01, 1.18, 1, -0.04) 0s';
      setTimeout(function() {
        friendsIdInputDom.parentNode.style.backgroundColor = '';
      }, 2000);
    }
    if (options['docompression'] > 0) {
      doCompressionDom.checked = true;
    }
    if (options['frequency'] > 0) {
      updateFrequencyDom.value = options['frequency'];
    }
    if (options['options'] > 0) {
      TraX.toggleOptionsMenu(true);
    }
    if (options['video'] > 0) {
      if (TraX.Video) TraX.Video.toggleVideo(true);
    }
    if (options['sidebar'] > 0) {
      if (Sidebar) Sidebar.toggleOpen(true);
    } else {
      if (Sidebar) Sidebar.toggleOpen('default');
    }
    if (typeof options['id'] !== 'undefined') {
      sessionInputDom.value = options['id'];
      TraX.sessionInputChange();
      // TraX.requestFilesize();
    }
    if (options['hud'] > 0) {
      if (options['hud'] == 1) TraX.handleClickTimers();
      /* if (options["hud"] == 2) {
        let tries = 0;
        checkIfLoaded = function() {
          tries++;
          if (tries > 20) {
            console.log("CustomHUD Failed to load");
            TraX.showMessageBox("Failed to load Custom HUD", 5000, false);
            return;
          }
          if (TraX.CustomHUD) TraX.handleClickCustom();
          else setTimeout(checkIfLoaded, 100);
        }
        checkIfLoaded();
      } */
    }
    if (options['start'] == 1) {
      setTimeout(resume);
    }
    if (options['nosend'] == 1) {
      preventSend = true;
      console.warn('SENDING DATA HAS BEEN DISABLED DUE TO HREF FLAG.');
    }
    // if (y > 822) {
    //   toggleOptionsMenu();
    // }
  }
  /**
   * Parse options embedded in URL.
   *
   * @private
   * @return {Object.<string>} The options defined in the URL.
   */
  function getURLOptions() {
    const options = {};
    const optionString = document.URL.split('?')[1];
    if (typeof optionString === 'undefined') return options;
    const splitURI = optionString.split('#')[0].split('&');
    for (let i = 0; i < splitURI.length; i++) {
      const pair = splitURI[i].split('=');
      options[pair[0]] = pair[1];
    }
    return options;
  }
  /**
   * Set query option in URL.
   *
   * @public
   * @param {string} option The key name.
   * @param {string} setting The key value.
   */
  TraX.setURLOption = function(option, setting) {
    let newhref;
    const postregex = '=[^&#]*';
    if (typeof setting !== 'undefined') {
      newhref = location.href.replace(
          new RegExp(option + postregex), option + '=' + setting);
      let postOptions = newhref.split('#');
      let Options = postOptions[0];
      postOptions = postOptions[1] || '';
      if (newhref == location.href && newhref.indexOf(option + '=') < 0) {
        if (newhref.indexOf('?') > 0) {
          Options += '&' + option + '=' + setting;
        } else {
          Options += '?' + option + '=' + setting;
        }
      }
      newhref = Options + '#' + postOptions;
    } else {
      newhref = location.href.replace(new RegExp('&' + option + postregex), '');
      if (newhref == location.href) {
        newhref =
            location.href.replace(new RegExp('\\?' + option + postregex), '');
        if (newhref != location.href) {
          newhref = newhref.replace('&', '?');
        }
      }
    }
    history.pushState(null, 'TraX: Racing Data Collector', newhref);
  };
  /**
   * Change certain settings based off device variables (browser/OS etc.).
   *
   * @private
   */
  function checkDeviceOptions() {
    userAgent = navigator.userAgent;
    const deviceType = TraX.getDeviceType();
    const browserType = TraX.getBrowser();

    realtimeDeviceTypeDom.innerHTML = deviceType;
    realtimeDeviceBrowserDom.innerHTML = browserType;

    if (browserType == 'Safari') {
      xAxisFlipDom.checked = false;
      yAxisFlipDom.checked = false;
      zAxisFlipDom.checked = false;
      KeepAwake.keepAwakeSetting('pageload');
    } else if (browserType == 'Chrome') {
      xAxisFlipDom.checked = true;
      yAxisFlipDom.checked = true;
      zAxisFlipDom.checked = true;
      KeepAwake.keepAwakeSetting('video');
    } else if (browserType == 'Firefox') {
      xAxisFlipDom.checked = true;
      yAxisFlipDom.checked = true;
      zAxisFlipDom.checked = true;
      KeepAwake.keepAwakeSetting('video');
      Trax.showMessageBox(
          'Firefox does not allow me to keep your phone on while recording.');
    } else {
      KeepAwake.keepAwakeSetting('video');
    }
  }
  /**
   * Update the big light.
   *
   * @private
   */
  function updateMainStatus() {
    if (forceDead) {
      setMainLights('red');
    } else if (isPaused && !realtimeViewOpen && !friendmapEnabled) {
      if (!connectionDead && !accountDead) {
        if (sendBuffer.length > 1) {
          setMainLights('processing');
        } else {
          setMainLights('green');
        }
      } else if (!connectionDead && accountDead) {
        setMainLights('yellow');
      } else {
        setMainLights('red');
      }
    } else if (!isPaused || realtimeViewOpen) {
      if (!sensorsDead && !gpsDead && !scriptsDead && !accountDead) {
        if (sendBuffer.length > 1) {
          setMainLights('processing');
        } else {
          setMainLights('green');
        }
      } else if (!sensorsDead && !gpsDead && !scriptsDead && accountDead) {
        setMainLights('yellow');
      } else {
        setMainLights('red');
      }
    } else if (friendmapEnabled) {
      if (!gpsDead && !scriptsDead && !accountDead) {
        if (sendBuffer.length > 1) {
          setMainLights('processing');
        } else {
          setMainLights('green');
        }
      } else if (!gpsDead && !scriptsDead && accountDead) {
        setMainLights('yellow');
      } else {
        setMainLights('red');
      }
    } else {
      setMainLights('red yellow');
    }
  }
  /**
   * Add setting to main light to show multiple lights.
   *
   * @private
   * @param {string} color The light or list of light names to show.
   */
  // function addMainLights(color) {
  //   if (color.indexOf('red') != -1) {
  //     largeRedLight.style.display = 'inline-block';
  //   }
  //   if (color.indexOf('yellow') != -1) {
  //     largeYellowLight.style.display = 'inline-block';
  //   }
  //   if (color.indexOf('green') != -1) {
  //     largeGreenLight.style.display = 'inline-block';
  //   }
  //   if (color.indexOf('processing') != -1) {
  //     largeProcessingLight.style.display = 'inline-block';
  //   }
  // }
  /**
   * Set main light to color or list of colors.
   *
   * @private
   * @param {string} color Acceptable light name to show or list of lights.
   */
  function setMainLights(color) {
    if (color.indexOf('red') != -1) {
      largeRedLight.style.display = 'inline-block';
    } else {
      largeRedLight.style.display = 'none';
    }

    if (color.indexOf('yellow') != -1) {
      largeYellowLight.style.display = 'inline-block';
    } else {
      largeYellowLight.style.display = 'none';
    }

    if (color.indexOf('green') != -1) {
      largeGreenLight.style.display = 'inline-block';
    } else {
      largeGreenLight.style.display = 'none';
    }

    if (color.indexOf('processing') != -1) {
      largeProcessingLight.style.display = 'inline-block';
    } else {
      largeProcessingLight.style.display = 'none';
    }
  }
  /**
   * Returns current client version.
   *
   * @public
   * @return {string} Current version.
   */
  TraX.getVersion = function() {
    return versionNum;
  };
  /**
   * Heartbeat to check if data is actually being received.
   *
   * @private
   */
  function heartbeat() {
    sensorsDead = false;
    clearTimeout(heartbeatTimeout);
    heartbeatTimeout = setTimeout(pageDeath, updateFrequency);
    greenLight.style.display = 'inline-block';
    redLight.style.display = 'none';
    updateMainStatus();
  }
  /**
   * Triggered if heartbeat hasn't happened for a while.
   *
   * @private
   */
  function pageDeath() {
    sensorsDead = true;
    redLight.style.display = 'inline-block';
    greenLight.style.display = 'none';
    if ((!isPaused || realtimeViewOpen) && heartbeatCount < 2) {
      TraX.showMessageBox(
          'We aren\'t able to get some sensor data.' +
              ' Your device may be incompatible with this site.',
          10000);
      forceDead = true;
    } else if (!isPaused) {
      // This is disabled because the user doesn't really care if we missed
      // data,
      // and in most cases wont notice.
      // TraX.showMessageBox("Oops! We missed some sensor data!");
    }
    updateMainStatus();
  }
  /**
   * Heartbeat from server responses.
   *
   * @private
   */
  function serverHeartbeat() {
    // serverDead = false;
    clearTimeout(serverTimeout);
    // If server doesn't reply with 200% of the time we gave it, we can assume
    // it
    // is dead.
    serverTimeout = setTimeout(serverDeath, updateFrequency * 2);
    greenLightWriting.style.display = 'inline-block';
    redLightWriting.style.display = 'none';
    updateMainStatus();
  }
  /**
   * Triggered if serverHeartbeat hasn't happened for a while.
   *
   * @private
   */
  function serverDeath() {
    // serverDead = true;
    redLightWriting.style.display = 'inline-block';
    greenLightWriting.style.display = 'none';
    updateMainStatus();
  }
  /**
   * Heartbeat to check if we're actually getting gps data.
   *
   * @private
   */
  function gpsHeartbeat() {
    gpsDead = false;
    clearTimeout(gpsHeartbeatTimeout);
    gpsHeartbeatTimeout = setTimeout(gpsDeath, gpsMinFrequency);

    greenLightGPS.style.display = 'inline-block';
    redLightGPS.style.display = 'none';
    updateMainStatus();
  }
  /**
   * gpsHeartbeat hasn't happened for too long and GPS can be assumed dead.
   *
   * @private
   */
  function gpsDeath() {
    gpsDead = true;
    redLightGPS.style.display = 'inline-block';
    greenLightGPS.style.display = 'none';
    if (!isPaused || realtimeViewOpen || friendmapEnabled) {
      TraX.showMessageBox(
          'We aren\'t able to get GPS data, or data is infrequent.', 5000,
          false);
    }
    updateMainStatus();
  }
  /**
   * Handler for when the sign in state changes.
   *
   * @private
   */
  function signInStateChange() {
    updateServerLights();
    needAccountDom.style.display = TraX.isSignedIn ? 'none' : 'block';
    friendsUsernameDom.innerHTML = TraX.getDriverName() || '_';
    friendsIdDom.innerHTML = TraX.getDriverId();
    accountDead = !TraX.isSignedIn;
    updateMainStatus();
  }
  /**
   * Update the green and red lights for things related to the connection with
   * the
   * server.
   *
   * @private
   */
  function updateServerLights() {
    if (sendBuffer.length > 0 || !isPaused) {
      pausedGreenLight.style.display = 'inline-block';
      pausedRedLight.style.display = 'none';
    } else {
      pausedRedLight.style.display = 'inline-block';
      pausedGreenLight.style.display = 'none';
    }
    if (isConnected) {
      greenLightConnected.style.display = 'inline-block';
      redLightConnected.style.display = 'none';
      if ((TraX.isSignedIn || tokenSent) &&
          (sendBuffer.length > 0 || !isPaused)) {
        greenLightSending.style.display = 'inline-block';
        yellowLightSending.style.display = 'none';
        redLightSending.style.display = 'none';
      } else if ((TraX.isSignedIn || tokenSent) && isPaused) {
        yellowLightSending.style.display = 'inline-block';
        greenLightSending.style.display = 'none';
        redLightSending.style.display = 'none';
      } else {
        redLightSending.style.display = 'inline-block';
        yellowLightSending.style.display = 'none';
        greenLightSending.style.display = 'none';
      }
    } else {
      redLightConnected.style.display = 'inline-block';
      redLightSending.style.display = 'inline-block';
      greenLightConnected.style.display = 'none';
      greenLightSending.style.display = 'none';
      yellowLightSending.style.display = 'none';
    }
  }
  /** Determine the closest track to the given coordinates. A maximum distance
   * of 10km is checked.
   *
   * @private
   * @param {{lat: number, lng: number}} coord The coordinates to determine the
   * closest track to.
   * @return {?DataView.Track} The track, or null if unable to determine track.
   */
  function determineTrack(coord) {
    if (!trackList || (!coord && !DataView.coordAverage.coord)) {
      return null;
    }
    if (!coord) coord = DataView.coordAverage.coord;
    const closest = {dist: 10 * 1000, index: -1};  // 10km maximum
    for (let i = 0; i < trackList.length; i++) {
      const dist = TraX.Units.latLngToMeters(trackList[i].coord, coord);
      if (dist < closest.dist) {
        closest.dist = dist;
        closest.index = i;
      }
    }

    if (closest.index >= 0) {
      console.log('Closest track to center of data:', trackList[closest.index]);
      return trackList[closest.index];
    } else {
      if (TraX.debugMode) {
        console.log('Couldn\'t determine closest track to:', coord);
      }
      return null;
    }
  }
  /**
   * Request the list of tracks from server.
   *
   * @private
   */
  function fetchTrackList() {
    if (waitingForTrackList) return;
    waitingForTrackList = true;
    trackList = [];
    TraX.socket.emit('requesttracklist', 'track');
    TraX.socket.emit('requesttracklist', 'track', 'myself');
    for (let i = 0; i < TraX.friendsList.length; i++) {
      TraX.socket.emit('requesttracklist', 'track', TraX.friendsList[i].id);
    }
  }
  /**
   * Request the list of configs from the server.
   *
   * @private
   * @param {DataView.Track} track The track to request the configs for.
   */
  function fetchTrackConfigList(track) {
    TraX.socket.emit('requesttracklist', track.id, track.ownerId);
  }
  /**
   * New track or config data is received from server. Store it properly.
   *
   * @private
   * @param {string|Array} data Received response data from server.
   * @param {string} request The request sent that caused this data to be sent.
   * @param {string} ownerId The id of the user who owns the received data.
   */
  function handleNewTrackData(data, request, ownerId) {
    if (typeof data === 'string') {
      if (data !== 'readerror') {
        data = JSON.parse(data);
      } else {
        console.warn('TrackData Readerr', data, request);
        return;
      }
    }
    if (request == 'track') {
      if (ownerId == TraX.getDriverId()) {
        data = data.map(function(obj) {
          obj.name = 'You: ' + obj.name;
          return obj;
        });
      } else if (ownerId) {
        let prefix = 'F: ';
        for (let i = 0; i < TraX.friendsList.length; i++) {
          if (TraX.friendsList[i].id == ownerId) {
            prefix = TraX.friendsList[i].firstName[0] +
                TraX.friendsList[i].lastName[0] + ': ';
            break;
          }
        }
        data = data.map(function(obj) {
          obj.name = prefix + obj.name;
          return obj;
        });
      }
      if (trackList.length > 0) {
        Array.prototype.push.apply(trackList, data);
      } else {
        trackList = data;
      }
      if (TraX.debugMode) console.log('New track list:', trackList);
      waitingForTrackList = false;
    } else {
      configList[request + ',' + (ownerId || '')] = data;
      if (TraX.debugMode) console.log('New config list:', configList);
    }
    updateTrackSelection();
  }
  /**
   * Update dropdown menus for track and config based selected track and config
   * ids.
   *
   * @private
   * @param {boolean} [forceTrack=false] Force updating the track selection.
   * @param {boolean} [forceConfig=false] Force updating the config selection.
   */
  function updateTrackSelection(forceTrack, forceConfig) {
    if (forceTrack || trackNameSelectDom.options.length != trackList.length) {
      const wasDisabled = trackNameSelectDom.disabled;
      trackNameSelectDom.disabled = false;
      for (let i = trackNameSelectDom.options.length - 1; i >= 0; i--) {
        trackNameSelectDom.remove(i);
      }
      for (let i = 0; i < (trackList.length || 0); i++) {
        const newOpt = document.createElement('option');
        newOpt.text = trackList[i].name;
        newOpt.value = trackList[i].id + ',' + trackList[i].ownerId;

        trackNameSelectDom.add(newOpt);
      }
      trackNameSelectDom.disabled = wasDisabled;
      trackId = undefined;
      trackOwner = undefined;
    }
    if (forceConfig ||
        configNameSelectDom.options.length !=
            (configList[trackNameSelectDom.value] || []).length) {
      const wasDisabled = configNameSelectDom.disabled;
      configNameSelectDom.disabled = false;
      const config = configList[trackNameSelectDom.value] || [];
      for (let i = configNameSelectDom.options.length - 1; i >= 0; i--) {
        configNameSelectDom.remove(i);
      }
      for (let i = 0; i < config.length; i++) {
        const newOpt = document.createElement('option');
        newOpt.text = config[i].name;
        newOpt.value = config[i].id;

        configNameSelectDom.add(newOpt);
      }
      if (configNameSelectDom.options[configNameSelectDom.selectedIndex]) {
        timersTrackTitleDom.innerHTML =
            trackNameSelectDom.options[trackNameSelectDom.selectedIndex].text +
            '/' +
            configNameSelectDom.options[configNameSelectDom.selectedIndex].text;
        setTimeout(configNameSelectDom.onchange);
      } else {
        configId = undefined;
        configOwnerId = undefined;
      }
      configNameSelectDom.disabled = wasDisabled;
    }
  }
  /**
   * Dropdown menu for track name changed.
   *
   * @public
   */
  TraX.sessionTrackNameChange = function() {
    const splitId = trackNameSelectDom.value.split(',');
    trackId = splitId[0];
    trackOwnerId = splitId[1];
    if (!configList[trackNameSelectDom.value]) {
      fetchTrackConfigList({id: trackId, ownerId: trackOwnerId});
    }
    updateTrackSelection(false, true);
  };
  /**
   * Dropdown menu for config name changed.
   *
   * @public
   */
  TraX.sessionConfigNameChange = function() {
    trackId = trackNameSelectDom.value.split(',')[0];
    trackOwnerId = trackNameSelectDom.value.split(',')[1];
    configId = configNameSelectDom.value; /* .split(',')[0];
    configOwnerId = configNameSelectDom.value.split(',')[1]; */
    timersTrackTitleDom.innerHTML =
        trackNameSelectDom.options[trackNameSelectDom.selectedIndex].text +
        '/' +
        configNameSelectDom.options[configNameSelectDom.selectedIndex].text;
    requestConfigSummary();
  };
  /**
   * Request the server's version number.
   *
   * @private
   */
  function requestVersionNum() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://dev.campbellcrowley.com/trax/version.txt');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      if (xhr.status == 200) {
        handleNewVersion(xhr.responseText);
      } else {
        console.warn(
            'Failed to get current client version!', xhr.status, xhr.response);
      }
    };
    xhr.send();
  }
  /**
   * Handle receiving new version number from server.
   *
   * @private
   * @param {string} version Version number.
   */
  function handleNewVersion(version) {
    version = version.replace(/\n/g, '');
    console.log('Version:', version);
    const versHolder = document.getElementById('version');
    if (versHolder) {
      const htmlVer = versHolder.innerHTML;
      if (versionNum == 'Unknown') {
        versionNum = htmlVer;
        console.log('Reading version from HTML');
      }
    }
    if (versionNum !== 'Unknown' && version !== 'Unknown' &&
        version !== versionNum) {
      if (isPaused) {
        TraX.showMessageBox(
            'Your page is a different version than the server! Please refresh' +
                ' the page to get the latest version.',
            30000, true);
      }
      if (caches) caches.delete('TraX Offline');
    } else if (versionNum === 'Unknown' && version !== 'Unknown') {
      versionNum = version;
      const versHolder = document.createElement('a');
      versHolder.id = 'version';
      versHolder.innerHTML = version;
      document.body.appendChild(versHolder);
    }
  }
  /**
   * Handle the UI rotating due to device rotation.
   *
   * @private
   */
  function handleScreenRotate() {
    if (!screen) {
      currentScreenOrientation = {angle: 0};
      return;
    }
    currentScreenOrientation = screen.orientation;
  }
  /**
   * Handle phone rotated. (Gyro data)
   *
   * @private
   * @param {Event} event Event storing updated orientation data.
   */
  function handleOrientation(event) {
    heartbeat();
    absolute = event.absolute;

    let nowAlpha = -event.alpha;
    let nowBeta = event.beta;
    let nowGamma = -event.gamma;

    nowAlpha /= 180.0 / Math.PI;
    nowBeta /= 180.0 / Math.PI;
    nowGamma /= 180.0 / Math.PI;

    if (doGyroDataReset) {
      compassAlpha = event.webkitCompassHeading;
      asBar = Math.sin(nowAlpha);  // Z-axis
      bsBar = Math.sin(nowBeta);   // X-axis
      gsBar = Math.sin(nowGamma);  // Y-axis
      acBar = Math.cos(nowAlpha);  // Z-axis
      bcBar = Math.cos(nowBeta);   // X-axis
      gcBar = Math.cos(nowGamma);  // Y-axis
      orientationCount = 1;
      doGyroDataReset = false;
    } else {
      compassAlpha += event.webkitCompassHeading;
      asBar += Math.sin(nowAlpha);  // Z-axis
      bsBar += Math.sin(nowBeta);   // X-axis
      gsBar += Math.sin(nowGamma);  // Y-axis
      acBar += Math.cos(nowAlpha);  // Z-axis
      bcBar += Math.cos(nowBeta);   // X-axis
      gcBar += Math.cos(nowGamma);  // Y-axis
      orientationCount++;
    }

    alpha = Math.atan2(asBar, acBar);
    beta = Math.atan2(bsBar, bcBar);
    gamma = Math.atan2(gsBar, gcBar);

    // Realtime gyrosphere
    TraX.Canvases.rotation.a =
        nowAlpha - currentScreenOrientation.angle / 180.0 * Math.PI;
    TraX.Canvases.rotation.b = nowBeta;
    TraX.Canvases.rotation.g = nowGamma;
    if (realtimeViewOpen) TraX.Canvases.renderGyro();

    if (TraX.debugMode) {
      absoluteDom.innerHTML = absolute;
      compassAlphaDom.innerHTML = compassAlpha / orientationCount;
      alphaDom.innerHTML = alpha;
      betaDom.innerHTML = beta;
      gammaDom.innerHTML = gamma + '<br><br>Minus Down<br>' +
          (alpha - TraX.downRotation.a) + '<br>' +
          (beta - TraX.downRotation.b) + '<br>' + (gamma - TraX.downRotation.g);
    }
  }
  /**
   * Handle phone moved. (Accelerometer data)
   *
   * @private
   * @param {Event} event Event that fires on a motion update.
   */
  function handleMotion(event) {
    heartbeat();
    needIMUDom.style.display = 'none';
    heartbeatCount++;
    if (isPaused) {
      resetData();
    }
    acceleration[0] += event.acceleration.x;
    acceleration[1] += event.acceleration.y;
    acceleration[2] += event.acceleration.z;
    accelIncGrav[0] += event.accelerationIncludingGravity.x;
    accelIncGrav[1] += event.accelerationIncludingGravity.y;
    accelIncGrav[2] += event.accelerationIncludingGravity.z;
    rotationRate[0] += event.rotationRate.alpha;
    rotationRate[1] += event.rotationRate.beta;
    rotationRate[2] += event.rotationRate.gamma;
    interval = event.interval;
    accelerationCount++;

    TraX.Canvases.drawAccel = [
      (xAxisFlipDom.checked ? -1 : 1) * event.accelerationIncludingGravity.x,
      (yAxisFlipDom.checked ? -1 : 1) * event.accelerationIncludingGravity.y,
      (zAxisFlipDom.checked ? -1 : 1) * event.accelerationIncludingGravity.z,
    ];
    TraX.Canvases.rotationRate = {
      a: event.rotationRate.alpha,
      b: event.rotationRate.beta,
      g: event.rotationRate.gamma,
    };
    TraX.Canvases.renderAccel();

    const magnitude =
        Math.hypot(accelIncGrav[0], accelIncGrav[1], accelIncGrav[2]) /
        accelerationCount;
    const rotMag =
        Math.hypot(rotationRate[0], rotationRate[1], rotationRate[2]) /
        accelerationCount;
    if (Math.abs(magnitude - Agrav) < 0.1 && Math.abs(rotMag) < 0.1) {
      resetDownCount++;
      if (resetDownCount > 20) {
        TraX.downRotation = {a: alpha, b: beta, g: gamma};
        TraX.Canvases.velocity = [0, 0, 0];
        resetDownCount = 0;
      }
    } else {
      resetDownCount = 0;
    }

    if (realtimeViewOpen) {
      realtimeSensorClockDom.innerHTML = formatRealtimeNow(event.timestamp);
    }

    if (TraX.debugMode) {
      accelerationDom.innerHTML = '<br>X: ' + event.acceleration.x + '<br>Y: ' +
          event.acceleration.y + '<br>Z: ' + event.acceleration.z;
      accelIncGravDom.innerHTML = '<br>X: ' +
          event.accelerationIncludingGravity.x + '<br>Y: ' +
          event.accelerationIncludingGravity.y + '<br>Z: ' +
          event.accelerationIncludingGravity.z + '<br>Mag: ' + magnitude +
          '<br>No Grav Mag: ' + (magnitude - Agrav);
      rotationRateDom.innerHTML = '<br>A: ' + event.rotationRate.alpha +
          '<br>B: ' + event.rotationRate.beta + '<br>G: ' +
          event.rotationRate.gamma;
      intervalDom.innerHTML = event.interval + 'ms';
    }
  }

  /**
   * Handle new GPS/Position data.
   *
   * @private
   * @param {Position} position Geolocation data object.
   */
  function handleNewPosition(position) {
    gpsHeartbeat();
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
    accuracy = position.coords.accuracy;
    altitude = position.coords.altitude;
    altAccuracy = position.coords.altitudeAccuracy;
    heading = position.coords.heading;
    speed = position.coords.speed;
    timestamp = position.timestamp;

    TraX.Canvases.resetEstimatedVelocity(speed, heading);

    if (TraX.debugMode) {
      longitudeDom.innerHTML = longitude;
      latitudeDom.innerHTML = latitude;
      posInfoDom.innerHTML = 'Altitude: ' + altitude + 'm<br>Pos Accuracy: ' +
          accuracy + 'm<br>Alt Accuracy: ' + altAccuracy + 'm<br>Heading: ' +
          heading + 'deg<br>Speed: ' + speed + 'm/s<br>Timestamp: ' + timestamp;
    }
    setTimeout(updateLapTimes);
    if (friendmapEnabled) updateMap();
    if (realtimeViewOpen) updateRealtimePos();
    TraX.socket.emit('updateposition', {lat: latitude, lng: longitude});
    if (!trackId && longitude && latitude) {
      const track = determineTrack({lat: latitude, lng: longitude});
      if (track != null) {
        const opts = trackNameSelectDom.options;
        for (let i = 0; i < opts.length; i++) {
          if (opts[i].value == track.id + ',' + track.ownerId) {
            trackNameSelectDom.selectedIndex = i;
            trackId = track.id;
            trackOwnerId = track.ownerId;
            trackNameSelectDom.onchange();
            if (!isPaused) updateSession();
            break;
          }
        }
      }
    }
  }
  /**
   * Triggered if error received while getting GPS data.
   *
   * @private
   * @param {Error} err The error information.
   */
  function handlePosError(err) {
    console.log(err);
    TraX.showMessageBox('GPS Error: ' + err.message);
    handleNewPosition({
      coords: {
        longitude: 0,
        latitude: 0,
        accuracy: -1,
        altitude: 0,
        altitudeAccuracy: -1,
        heading: -1,
        speed: -1,
      },
      timestamp: -1,
    });
    messages.push('GPS ERROR: ' + err.message);
    if (TraX.debugMode) {
      posinfo.innerHTML = 'POS ERROR ' + err.code + ': ' + err.message;
    }
    if (err.code != PERMISSION_DENIED) {
      navigator.geolocation.clearWatch(wpid);
      wpid = navigator.geolocation.watchPosition(
          handleNewPosition, handlePosError, geoOptions);
    }
  }
  /**
   * Update track selection for current session.
   *
   * @private
   */
  function updateSession() {
    TraX.socket.emit(
        'editsession', sessionInputDom.value, trackId, trackOwnerId, configId,
        configOwnerId, sessionId);
  }
  /**
   * Update clock for realtime view.
   *
   * @private
   */
  function updateRealtimeClock() {
    realtimeDeviceClockDom.innerHTML = formatRealtimeNow();
  }
  /**
   * Reset timers HUD to zero. If doMinimal, the UI will not be updated, but all
   * variables controlling the UI will be reset.
   *
   * @private
   * @param {boolean} [doMinimal=false] Disables updating the UI.
   * @param {boolean} [skipVars=false] Disables resetting the variables
   */
  function resetTimersHUD(doMinimal, skipVars) {
    if (!skipVars) {
      clearInterval(updateTimersInterval);
      currentlyRacing = false;
      justStartedRacing = false;
      sessionStartTime = 0;
      lapStartTime = 0;
      bestLapData = [];
      previousLapData = [];
      currentLapData = [];
    }
    if (!doMinimal) {
      bigTimerDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(0, false, 1);
      littleTimerTopDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(0, false, 1);
      littleTimerLeftDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(0, false, 1);
      littleTimerRightDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(0, false, 1);

      littleTimerLeftTopDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(0, false, 1);
      littleTimerRightTopDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(0, true, 0);
    }
  }
  /**
   * Update the HUD with current times.
   *
   * @private
   */
  function updateTimersHUD() {
    const now = Date.now();
    if (currentlyRacing) {
      bigTimerDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(now - lapStartTime, false, 1);
    }
    littleTimerTopDom.getElementsByClassName('timerBody')[0].innerHTML =
        TraX.Common.formatMsec(now - sessionStartTime, false, 1);
    littleTimerLeftDom.getElementsByClassName('timerBody')[0].innerHTML =
        TraX.Common.formatMsec(previousLapDuration, false, 1);
    littleTimerRightDom.getElementsByClassName('timerBody')[0].innerHTML =
        TraX.Common.formatMsec(bestLapDuration, false, 1);

    littleTimerLeftTopDom.getElementsByClassName('timerBody')[0].innerHTML =
        TraX.Common.formatMsec(predictedLapDuration, false, 1);
    if (predictedLapDuration > 0) {
      littleTimerRightTopDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(
              predictedLapDuration - bestLapDuration, true, 0);
    }
    if (isPaused) sessionStartTime = 0;
  }
  /**
   * Print stored lap data to console.
   *
   * @public
   */
  TraX.PRINT = function() {
    console.log(currentLapData, bestLapData, previousLapData);
  };
  /**
   * Update calculations for realtime lap times based off new GPS data.
   *
   * @private
   */
  function updateLapTimes() {
    const trackNameValue = trackNameSelectDom.value;
    const configNameValue = configNameSelectDom.value;
    if (!configList || typeof configList[trackNameValue] === 'undefined' ||
        typeof configList[trackNameValue][configNameValue] === 'undefined') {
      return;
    }
    const now = Date.now();
    const coord = {lat: latitude, lng: longitude, time: now};
    const config = configList[trackNameValue][configNameValue];
    const start = config.start;
    const finish = config.finish;
    const distFinish = TraX.Common.coordDistance(coord, finish.coord);
    const distStart = TraX.Common.coordDistance(coord, start.coord);

    const halfCoord = TraX.Common.interpolateCoord(coord, previousCoord, 0.5);
    const halfDistStart = TraX.Common.coordDistance(halfCoord, start.coord);
    const halfDistFinish = TraX.Common.coordDistance(halfCoord, finish.coord);

    const deltaPos = TraX.Units.latLngToMeters(coord, previousCoord);
    currentDistanceDriven += deltaPos;

    const tempConfigId = configId || configNameValue;
    if (!bestLapData.length == 0 && TraX.summaryList.length > 0) {
      const summarySearch =
          [TraX.getDriverId(), trackOwnerId, trackId, tempConfigId].join(',');
      if (TraX.summaryList[summarySearch] &&
          TraX.summaryList[summarySearch].bestLapData) {
        bestLapData = TraX.summaryList[summarySearch].bestLapData;
      }
    }

    // If we just crossed the finish line and haven't left threshold radius yet.
    if (justFinishedRacing && distFinish > previousCoord.distFinish) {
      justFinishedRacing = false;

      // This needs to get the same results as post-analysis since we can save
      // the
      // calculated data from the realtime session.
      // const increment = 0.05;
      const increment = 0.001;

      let lookBack = true;

      // Estimate finish line crossing time more accurately.
      if (TraX.Common.coordDistance(
          TraX.Common.interpolateCoord(previousCoord, coord, increment),
          finish.coord) <
          TraX.Common.coordDistance(previousCoord, finish.coord)) {
        lookBack = false;
      }
      let newClosest = {index: 0, dist: -1, time: 0};
      for (let i = 0; i <= 1.0; i += increment) {
        const intCoord = TraX.Common.interpolateCoord(
            previousCoord, lookBack ? previousPreviousCoord : coord, i);
        const dist = TraX.Common.coordDistance(intCoord, finish.coord);
        const currentTime = TraX.Common.lerp(
            previousCoord.time,
            lookBack ? previousPreviousCoord.time : coord.time, i);
        if (newClosest.dist < 0 || dist < newClosest.dist) {
          newClosest = {index: i, dist: dist, time: currentTime};
        } else {
          previousLapDuration = newClosest.time - previousLapStartTime;
          if (previousLapDuration > minLapTime &&
              (bestLapDuration == 0 || previousLapDuration < bestLapDuration)) {
            bestLapDuration = previousLapDuration;
            bestLapData = previousLapData.splice(0);
          }
          updateTimersHUD();
          console.log(
              'New Predictive Data (prev/best):', previousLapData, bestLapData);
          messages.push('New predictive lap data');
          updateConfigSummary();
          break;
        }
      }
    }

    // We are in a lap and just entered the finish line threshold.
    if (currentlyRacing && !justStartedRacing &&
        (distFinish < finish.radius || halfDistFinish < finish.radius) &&
        !inTransition) {
      previousLapStartTime = lapStartTime;
      lapStartTime = now;
      currentlyRacing = false;
      justFinishedRacing = true;
      previousLapData = currentLapData.splice(0);
      resetTimersHUD(false, true);
      console.log('Lap', lapNum, 'end!');
      messages.push('Lap ' + lapNum + ' end!');
    } else if (
      currentlyRacing && justStartedRacing &&
        distFinish > previousCoord.distFinish) {
      justStartedRacing = false;

      // This needs to get the same results as post-analysis since we can save
      // the
      // calculated data from the realtime session.
      // const increment = 0.05;
      const increment = 0.001;
      let lookBack = true;

      // Estimate start line cross time more accurately.
      if (TraX.Common.coordDistance(
          TraX.Common.interpolateCoord(previousCoord, coord, increment),
          start.coord) <
          TraX.Common.coordDistance(previousCoord, start.coord)) {
        lookBack = false;
      }
      let newClosest = {index: 0, dist: -1, time: 0};
      for (let i = 0; i < 1.0; i += increment) {
        const intCoord = TraX.Common.interpolateCoord(
            previousCoord, lookBack ? previousPreviousCoord : coord, i);
        const dist = TraX.Common.coordDistance(intCoord, start.coord);
        const currentTime = TraX.Common.lerp(
            previousCoord.time,
            lookBack ? previousPreviousCoord.time : coord.time, i);
        if (newClosest.dist < 0 || dist < newClosest.dist) {
          newClosest = {index: i, dist: dist, time: currentTime};
        } else {
          lapStartTime = newClosest.time;
          currentDistanceDriven = TraX.Units.latLngToMeters(start.coord, coord);
          break;
        }
      }
    } else if (
      inTransition && currentlyRacing && !justStartedRacing &&
        distFinish > finish.radius) {
      inTransition = false;
    }

    // Check if crossing start line after checking finish line in case they are
    // the same point.
    if (!currentlyRacing &&
        (distStart < start.radius || halfDistStart < start.radius)) {
      lapStartTime = now;
      currentlyRacing = true;
      justStartedRacing = true;
      inTransition = true;
      currentDistanceDriven = 0;
      currentLapData = [];
      lapNum++;
      console.log('Lap', lapNum, 'start!');
      messages.push('Lap ' + lapNum + ' start!');
      if (currentlyRacing == currentLapState) TraX.Video.lapChange(lapNum);
    }

    // Add data to list of datapoints for predictive time estimation.
    if (currentlyRacing) {
      currentLapData.push({
        distance: currentDistanceDriven,
        time: Date.now() - lapStartTime,
        coord: coord,
      });
    }

    // Count non-laps and trigger video opdates if necessary.
    if (currentlyRacing !== currentLapState) {
      if (!currentlyRacing) {
        nonLapNum++;
        TraX.Video.lapChange(-nonLapNum);
      } else {
        TraX.Video.lapChange(lapNum);
      }
    }

    previousPreviousCoord = {
      lat: previousCoord.lat,
      lng: previousCoord.lng,
      time: previousCoord.time,
      distStart: previousCoord.distStart,
      distFinish: previousCoord.distFinish,
    };
    previousCoord = {
      lat: coord.lat,
      lng: coord.lng,
      time: coord.time,
      distStart: distStart,
      distFinish: distFinish,
    };

    if (distFinish < finish.radius) messages.push('Within finish radius');
    if (distStart < start.radius) messages.push('Within start radius');

    // Predict lap time and split if we have a lap to base times off of.
    if (bestLapData.length > 0 && currentlyRacing && !justFinishedRacing) {
      const predictedSplit = (Date.now() - lapStartTime) -
          getTimeAtDistance(bestLapData, currentDistanceDriven);
      predictedLapDuration = bestLapDuration + predictedSplit;

      littleTimerLeftTopDom.getElementsByClassName('timerBody')[0].innerHTML =
          TraX.Common.formatMsec(predictedLapDuration, false, 1);
      const splitBody =
          littleTimerRightTopDom.getElementsByClassName('timerBody')[0];
      splitBody.innerHTML = TraX.Common.formatMsec(predictedSplit, true, 0);
      if (predictedSplit > 0) {
        splitBody.classList.add('redText');
        splitBody.classList.remove('greenText');
      } else if (predictedSplit < 0) {
        splitBody.classList.remove('redText');
        splitBody.classList.add('greenText');
      } else {
        splitBody.classList.remove('redText');
        splitBody.classList.remove('greenText');
      }
    }
    currentLapState = currentlyRacing;
  }
  /** Get time at a given distance through a lap from given data. Interpolates
   * between datapoints for more accurate value.
   *
   * @private
   * @param {Array} data Array of data to use to estimate time.
   * @param {number} distance Distance in meters traveled.
   * @return {number} Time at given distance.
   */
  function getTimeAtDistance(data, distance) {
    for (let i = 1; i < data.length; i++) {
      if (data[i].distance >= distance && data[i - 1].distance < distance) {
        const min = data[i - 1].distance;
        const large = data[i].distance - min;
        const intVal = (distance - min) / large;
        return TraX.Common.lerp(data[i - 1].time, data[i].time, intVal);
      }
    }
    if (distance < 100) {
      return 0;
    } else {
      return data[data.length - 1].time;
    }
  };
  /**
   * Toggle the live data view. If force is set to true or false it will force
   * the UI open or closed.
   *
   * @public
   * @param {?boolean} [force=undefined] Set view state or toggle if undefined.
   */
  TraX.toggleRealtimeView = function(force) {
    if (typeof force !== 'undefined') {
      realtimeViewOpen = force;
    } else {
      realtimeViewOpen = !realtimeViewOpen;
    }

    heartbeatCount = 0;
    realtimeDataDom.style.display = realtimeViewOpen ? 'block' : 'none';
    if (realtimeViewOpen) {
      realtimeDataClockInterval =
          setInterval(updateRealtimeClock, realtimeClockUpdateFrequency);
      realtimeDataToggleDom.classList.add('selected');
      realtimeDataDom.scrollIntoView({behaviour: 'smooth'});
    } else {
      clearInterval(realtimeDataClockInterval);
      realtimeDataToggleDom.classList.remove('selected');
    }

    if (realtimeViewOpen) {
      handleScreenRotate();
      window.addEventListener('orientationchange', handleScreenRotate, false);
    } else {
      window.removeEventListener(
          'orientationchange', handleScreenRotate, false);
    }
    // If paused, we need to start receiving data to show or stop if we started
    // the data streams.
    if (isPaused) {
      if (realtimeViewOpen) {
        // TODO: Use window.DeviceMotionEvent and window.DeviceOrientationEvent
        // to check if device is compatible.
        window.addEventListener('deviceorientation', handleOrientation, true);
        window.addEventListener('devicemotion', handleMotion, true);
        if (!friendmapEnabled) {
          if (!navigator.geolocation) {
            TraX.showMessageBox(
                'Your current browser does not allow me to view geolocation.');
          } else {
            wpid = navigator.geolocation.watchPosition(
                handleNewPosition, handlePosError, geoOptions);
          }
        }
      } else {
        window.removeEventListener(
            'deviceorientation', handleOrientation, true);
        window.removeEventListener('devicemotion', handleMotion, true);
        if (!friendmapEnabled) {
          if (navigator.geolocation) {
            navigator.geolocation.clearWatch(wpid);
          }
        }
      }
    }
  };
  /**
   * Toggle the debug menu open or closed.
   *
   * @public
   * @param {?boolean} [isDebug=undefined] Sets debug mode, or toggles if
   * undefined.
   */
  TraX.toggleDebug = function(isDebug) {
    let debug = TraX.debugMode ? 0 : 1;
    if (typeof isDebug !== 'undefined') {
      debug = isDebug;
    }
    TraX.debugMode = debug;
    if (debug) {
      debugDom.style.display = 'block';
      toggleDebugDom.classList.add('selected');
    } else {
      debugDom.style.display = 'none';
      toggleDebugDom.classList.remove('selected');
    }
  };
  /**
   * Toggle the status light UI.
   *
   * @public
   */
  TraX.toggleStatus = function() {
    statusLightsVisible = !statusLightsVisible;
    statusLightListDom.style.display = statusLightsVisible ? 'block' : 'none';
  };
  /**
   * Update live data gps data view.
   *
   * @private
   */
  function updateRealtimePos() {
    realtimeLngDom.innerHTML = longitude;
    realtimeLatDom.innerHTML = latitude;
    realtimeAltDom.innerHTML =
        Math.round(TraX.Units.distanceToSmallUnit(altitude)) +
        TraX.Units.getSmallDistanceUnit();
    realtimeSpdDom.innerHTML =
        TraX.Units.speedToUnit(speed) + TraX.Units.getLargeSpeedUnit();
    realtimeHedDom.innerHTML = heading + '&deg;';

    realtimeGPSClockDom.innerHTML = formatRealtimeNow(timestamp);
  }

  /**
   * Returns a date as a formatted time.
   *
   * @private
   * @param {?number|string} now Date in format accepted by `Date()`.
   * @return {string} Date formatted in UTC time.
   */
  function formatRealtimeNow(now) {
    if (typeof now === 'undefined') {
      now = new Date();
    } else {
      now = new Date(now);
    }
    return nowFormatted = now.getUTCHours() + ':' + now.getUTCMinutes() + ';' +
        now.getUTCSeconds() + '.' + now.getUTCMilliseconds();
  }
  /**
   * Called when user changes save frequency dropdown.
   *
   * @public
   */
  TraX.changeUpdateFreq = function() {
    updateFrequency = updateFrequencyDom.value;
  };
  /**
   * Triggered at an interval when data will be saved (updateFrequency), and
   * moves data into buffer to be sent to server.
   *
   * @private
   */
  function popPreSendBuffer() {
    const now = new Date();
    if (previousUpdateFrequency !== updateFrequency) {
      previousUpdateFrequency = updateFrequency;
      clearInterval(updateInterval);
      updateInterval = setInterval(popPreSendBuffer, updateFrequency);
      popMessageWarningCount = 0;
    } else {
      // If timing is 100% slow, we can assume data was lost.
      if (now.getTime() - previousUpdate > updateFrequency * 2.0) {
        const hz = Math.round(1 / ((now.getTime() - previousUpdate) / 1000));
        console.log('Client slowed to', hz, 'Hz');
        messages.push('Client slowed to ' + hz + 'Hz');
        if (popMessageWarningCount < 3) {
          TraX.showMessageBox(
              'Oops! Your device is running a little slow!', 3000, false);
        }
        popMessageWarningCount++;
      }
    }
    previousUpdate = now.getTime();
    const nextDataset = {
      'clientTimestamp': now.getTime(),
      'tzOffset': now.getTimezoneOffset(),
      'longitude': longitude,
      'latitude': latitude,
      'accuracy': accuracy,
      'altitude': altitude,
      'altAccuracy': altAccuracy,
      'heading': heading,
      'gpsSpeed': speed,
      'gpsTimestamp': timestamp,
      'compass': compassAlpha / orientationCount,
      'gyroAbsolute': absolute,
      'gyro': [alpha, beta, gamma],
      'estimatedDownRotation':
          [TraX.downRotation.a, TraX.downRotation.b, TraX.downRotation.g],
      'acceleration': [
        acceleration[0] / accelerationCount,
        acceleration[1] / accelerationCount,
        acceleration[2] / accelerationCount,
      ],
      'accelIncGrav': [
        accelIncGrav[0] / accelerationCount,
        accelIncGrav[1] / accelerationCount,
        accelIncGrav[2] / accelerationCount,
      ],
      'rotationRate': [
        rotationRate[0] / accelerationCount,
        rotationRate[1] / accelerationCount,
        rotationRate[2] / accelerationCount,
      ],
      'reportedSensorInterval': interval,
      'selectedTrack': trackNameSelectDom.value,
      'selectedConfig': configNameSelectDom.value,
      'sessionId': sessionId,
      'driverName': TraX.getDriverName(),
      'peripherals': [],
      'videoUrl': '',
      'userAgent': userAgent,
      'traxVersion': TraX.getVersion(),
      'sessionStartTime': sessionStartTime,
      'bestLapSession': bestLapDuration,
      'lapStartTime': lapStartTime,
      'lapNum': (currentlyRacing ? lapNum : -nonLapNum),
      'predictedLapDuration': predictedLapDuration,
      '[NODECOMPRESS]': !doCompressionDom.checked,
    };
    if (TraX.Canvases) {
      nextDataset['estimatedForwardVector'] = TraX.Canvases.forwardVector;
      nextDataset['headingOffset'] = TraX.Canvases.headingOffset;
    }
    if (extraDataDom.checked) {
      nextDataset.extra = {
        'previousLapStartTime': previousLapStartTime,
        'previousLapDuration': previousLapDuration,
        'justFinishedRacing': justFinishedRacing,
        'justStartedRacing': justStartedRacing,
        'currentlyRacing': currentlyRacing,
        'inTransition': inTransition,
        'messages': messages,
        'lapNum': lapNum,
        'nonLapNum': nonLapNum, /* ,
        "bestLapData": bestLapData,
        "currentLapData": currentLapData */
      };
    }
    messages = [];
    resetData();
    sendBuffer.push(nextDataset);
    sendChunk(now.getTime());
    if (TraX.debugMode) {
      sendBufferDom.innerHTML = 'Chunks Buffered: ' + sendBuffer.length;
    }
    updateServerLights();
  }
  /**
   * Check for data that the server did not confirm was sent, and resend it.
   *
   * @private
   */
  function flushStaleData() {
    const now = Date.now();
    let count = 0;
    for (let i = 0; i < sendBuffer.length; i++) {
      if (now - sendBuffer[i]['sendTimestamp'] > successTimeout) {
        if (!sendChunk(sendBuffer[i]['clientTimestamp'])) return;
        count++;
      }
    }
    if (count > 0) {
      if (preventSend) {
        console.log('Cancelling flush of chunks due to \'nosend\' href flag');
      } else {
        console.log('Flushed', count, 'stale chunks to server.');
      }
    }
  }
  /**
   * Send chunk to server.
   *
   * @private
   * @param {string} chunkid The id of the chunk to attempt to send.
   * @return {boolean} True of successfully sent chunk, false otherwise.
   */
  function sendChunk(chunkid) {
    const now = Date.now();
    for (let i = 0; i < sendBuffer.length; i++) {
      if (sendBuffer[i]['clientTimestamp'] == chunkid) {
        if (!TraX.isSignedIn && !tokenSent) {
          sendBuffer[i]['sendTimestamp'] = 0;
          console.log('UserID is unknown, can\'t send data.');
          return false;
        } else if (!isConnected) {
          sendBuffer[i]['sendTimestamp'] = 0;
          console.log('Not connected to server, can\'t send data.');
          return false;
        } else if (
          sessionId.length <= 0 && sendBuffer[i]['sessionId'].length <= 0) {
          if (!preventSend) console.log('No sessionId, delaying chunk send.');
          return;
        } else {
          if (sendBuffer[i]['sessionId'].length <= 0) {
            sendBuffer[i]['sessionId'] = sessionId;
          }
          sendBuffer[i]['sendTimestamp'] = now;
          let finalData = JSON.stringify(sendBuffer[i]);

          if (!sendBuffer[i]['[NODECOMPRESS]']) {
            finalData = LZString.compressToUTF16(finalData);
          }

          if (!preventSend) {
            TraX.socket.emit(
                'appendsession', sendBuffer[i]['sessionId'], chunkid,
                finalData + '[CHUNKEND]');
          }
          return true;
        }
      }
    }
    console.log('FAILED TO FIND CHUNK TO SEND', chunkid);
    return false;
  }
  /**
   * Remove chunk from buffer to send to server if the server confirmed it was
   * sent.
   *
   * @private
   * @param {string} chunkid The id of the chunk to pop from the buffer.
   */
  function popSendBuffer(chunkid) {
    for (let i = 0; i < sendBuffer.length; i++) {
      if (sendBuffer[i]['clientTimestamp'] === chunkid) {
        sendBuffer.splice(i, 1);
        if (sendBuffer.length === 0) updateServerLights();
        if (TraX.debugMode) {
          sendBufferDom.innerHTML = 'Chunks Buffered: ' + sendBuffer.length;
        }
        return;
      }
    }
    console.log('FAILED TO POP', chunkid, 'FROM SENDBUFFER!');
  }

  /**
   * Update friendmap markers and zoom.
   *
   * @private
   */
  function updateMap() {
    const bounds = {
      sw: {lat: latitude, lng: longitude},
      ne: {lat: latitude, lng: longitude},
    };
    if (friendMarkers.length != friendPositions.length + 1) {
      friendMarkerCluster.clearMarkers();
      friendMarkers = [new google.maps.Marker(
          {position: {lat: latitude, lng: longitude}, label: '1'})];
      friendMarkers[0].userId = 'myself';

      let numMe = 1;
      for (let i = 0; i < friendPositions.length; i++) {
        let label = '?';
        if (friendPositions[i].userId == TraX.getDriverId()) {
          label = (++numMe) % 10 + '';
        } else {
          for (let j = 0; j < TraX.friendsList.length; j++) {
            if (friendPositions[i].userId == TraX.friendsList[j].id) {
              label = friendsList[j].firstName[0];
              break;
            }
          }
        }
        friendMarkers.push(
            new google.maps.Marker(
                {position: friendPositions[i], label: label}));
        friendMarkers[i].userId = friendPositions[i].userId;

        if (bounds.sw['lat'] > friendPositions[i].lat) {
          bounds.sw['lat'] = friendPositions[i].lat;
        }
        if (bounds.sw['lng'] > friendPositions[i].lng) {
          bounds.sw['lng'] = friendPositions[i].lng;
        }
        if (bounds.ne['lat'] < friendPositions[i].lat) {
          bounds.ne['lat'] = friendPositions[i].lat;
        }
        if (bounds.ne['lng'] < friendPositions[i].lng) {
          bounds.ne['lng'] = friendPositions[i].lng;
        }
      }
      friendMarkerCluster.addMarkers(friendMarkers);
    } else {
      friendMarkers[0].setPosition({lat: latitude, lng: longitude});
      for (let i = 1; i < friendMarkers.length; i++) {
        for (let j = 0; j < friendPositions.length; j++) {
          if (friendMarkers[i].userId == friendPositions[j].userId) {
            friendMarkers[i].setPosition(friendPositions[j]);
          }
          if (bounds.sw['lat'] > friendPositions[j].lat) {
            bounds.sw['lat'] = friendPositions[j].lat;
          }
          if (bounds.sw['lng'] > friendPositions[j].lng) {
            bounds.sw['lng'] = friendPositions[j].lng;
          }
          if (bounds.ne['lat'] < friendPositions[j].lat) {
            bounds.ne['lat'] = friendPositions[j].lat;
          }
          if (bounds.ne['lng'] < friendPositions[j].lng) {
            bounds.ne['lng'] = friendPositions[j].lng;
          }
        }
      }
    }
    friendmap.panTo({lat: latitude, lng: longitude});
    friendmap.setZoom(15);
    friendmap.panToBounds(new google.maps.LatLngBounds(bounds.sw, bounds.ne));
    if (friendmap.getZoom() > 15) friendmap.setZoom(15);
  }
  /**
   * Toggle the friendmap visibility.
   *
   * @public
   */
  TraX.toggleMap = function() {
    friendmapEnabled = !friendmapEnabled;
    if (friendmapEnabled) {
      friendmapDom.parentElement.style.display = 'block';
      friendmapToggleDom.classList.add('selected');
      google.maps.event.trigger(friendmap, 'resize');
      if (isPaused && !realtimeViewOpen) {
        if (!navigator.geolocation) {
          TraX.showMessageBox(
              'Your current browser does not allow me to view geolocation.');
        } else {
          wpid = navigator.geolocation.watchPosition(
              handleNewPosition, handlePosError, geoOptions);
        }
      }
      if (optionsMenuOpen || realtimeViewOpen) {
        // window.scrollTo(0, document.getElementById("content").scrollHeight);
        friendmapDom.scrollIntoView({behaviour: 'smooth'});
      }
    } else {
      friendmapDom.parentElement.style.display = 'none';
      friendmapToggleDom.classList.remove('selected');
      if (isPaused && !realtimeViewOpen) {
        if (navigator.geolocation) {
          navigator.geolocation.clearWatch(wpid);
        }
      }
    }
  };
  /**
   * Toggle the options menu visibility.
   *
   * @public
   * @param {?boolean} [force=undefined] Force menu state or undefined to
   * toggle.
   */
  TraX.toggleOptionsMenu = function(force) {
    if (!isPaused) return;
    if (typeof force === 'undefined') {
      optionsMenuOpen = !optionsMenuOpen;
    } else {
      optionsMenuOpen = force;
    }
    if (optionsMenuOpen) {
      optionsMenuDom.style.display = 'block';
      optionsToggleDom.classList.add('selected');
      optionsMenuDom.scrollIntoView({behaviour: 'smooth'});
    } else {
      optionsMenuDom.style.display = 'none';
      optionsToggleDom.classList.remove('selected');
    }
  };
  /**
   * Toggle the friends view/manager visibility.
   *
   * @public
   * @param {?boolean} [force=undefined] Force view to state, or undefined to
   * toggle.
   */
  TraX.toggleFriendsView = function(force) {
    if (!isPaused) return;
    if (typeof force === 'undefined') {
      friendViewOpen = !friendViewOpen;
    } else {
      friendViewOpen = force;
    }
    if (friendViewOpen) {
      TraX.requestFriendsList();
      friendsViewDom.classList.remove('hidden');
      friendsViewToggleDom.classList.add('selected');
      if (Sidebar) Sidebar.toggleOpen(false);
    } else {
      friendsViewDom.classList.add('hidden');
      friendsViewToggleDom.classList.remove('selected');
      if (Sidebar) Sidebar.toggleOpen('default');
    }
  };
  /**
   * Session name changed in input box.
   *
   * @public
   */
  TraX.sessionInputChange = function() {
    const newVal = sessionInputDom.value;
    if (newVal !== sessionInputDom.value) {
      const start = sessionInputDom.selectionStart;
      const end = sessionInputDom.selectionEnd;
      sessionInputDom.value = newVal;
      sessionInputDom.setSelectionRange(start, end);
    }
  };
  /**
   * Returns current recording session ID.
   *
   * @private
   * @return {string} Id of current session being recorded.
   */
  function getSessionId() {
    return sessionId;
  }
  /**
   * Received new filesize from server, update UI.
   *
   * @private
   */
  function updateFilesize() {
    if (TraX.debugMode) {
      console.log('User is using', datasize, 'bytes on server, of', datalimit);
    }
    let HRFilesize = datasize + 'B';
    let dividedFilesize = datasize;
    let numDivide = 0;
    const fileLetters = 'B kBMBGBTBPBEB';
    while (dividedFilesize > 1000) {
      numDivide++;
      dividedFilesize /= 1000;
    }
    if (datasize <= 0) {
      HRFilesize = '0B';
    } else {
      HRFilesize = Math.round(dividedFilesize * 10) / 10 +
          fileLetters.substr(numDivide * 2, 2);
    }

    let HRFilelimit = datalimit + 'B';
    dividedFilesize = datalimit;
    numDivide = 0;
    while (dividedFilesize > 1000) {
      numDivide++;
      dividedFilesize /= 1000;
    }
    if (datalimit <= 0) {
      HRFilelimit = '';
    } else {
      HRFilelimit = ' / ' + Math.round(dividedFilesize * 10) / 10 +
          fileLetters.substr(numDivide * 2, 2);
    }
    filesizeDom.innerHTML = 'Data on server: ' + HRFilesize + HRFilelimit;
  }
  /**
   * User chose HUD 0, big button.
   *
   * @public
   */
  TraX.handleClickBigButton = function() {
    visibleHUD = 0;
    bigButtonModeButton.classList.add('selected');
    timerModeButton.classList.remove('selected');
    // customModeButton.classList.remove('selected');
    bigButtonHUDDom.classList.add('visibleHUD');
    bigButtonHUDDom.classList.remove('hiddenHUD');
    timersHUDDom.classList.add('hiddenHUD');
    timersHUDDom.classList.remove('visibleHUD');
    // customHUDDom.classList.add("hiddenHUD");
    // customHUDDom.classList.remove("visibleHUD");
    TraX.setURLOption('hud', 0);
  };
  /**
   * User chose HUD 1, realtime timers.
   *
   * @public
   */
  TraX.handleClickTimers = function() {
    visibleHUD = 1;
    bigButtonModeButton.classList.remove('selected');
    timerModeButton.classList.add('selected');
    // customModeButton.classList.remove('selected');
    bigButtonHUDDom.classList.add('hiddenHUD');
    bigButtonHUDDom.classList.remove('visibleHUD');
    timersHUDDom.classList.add('visibleHUD');
    timersHUDDom.classList.remove('hiddenHUD');
    // customHUDDom.classList.add("hiddenHUD");
    // customHUDDom.classList.remove("visibleHUD");
    TraX.setURLOption('hud');
  };
  /**
   * User chose HUD 2, custom.
   *
   * @public
   */
  TraX.handleClickCustom = function() {
    visibleHUD = 2;
    bigButtonModeButton.classList.remove('selected');
    timerModeButton.classList.remove('selected');
    // customModeButton.classList.add('selected');
    bigButtonHUDDom.classList.add('hiddenHUD');
    bigButtonHUDDom.classList.remove('visibleHUD');
    timersHUDDom.classList.add('hiddenHUD');
    timersHUDDom.classList.remove('visibleHUD');
    // customHUDDom.classList.add("visibleHUD");
    // customHUDDom.classList.remove("hiddenHUD");
    if (TraX.CustomHUD) TraX.CustomHUD.handleOpening();
    TraX.setURLOption('hud', 2);
  };

  /**
   * Bring HUD to fullscreen to remove distractions.
   *
   * @public
   */
  TraX.triggerHUDFullscreen = function() {
    TraX.releaseHUDFullscreen();
    let dom;
    if (visibleHUD == 0) {
      dom = bigButtonHUDDom;
    } else if (visibleHUD == 1) {
      dom = timersHUDDom;
    }
    const requestMethod = dom.requestFullScreen ||
        dom.webkitRequestFullScreen || dom.mozRequestFullScreen ||
        dom.msRequestFullScreen;
    if (requestMethod) {
      requestMethod.call(dom);
      dom.classList.add('fsHUD');
    }
  };
  /**
   * Exit fullscreen.
   *
   * @public
   */
  TraX.releaseHUDFullscreen = function() {
    if (document.fullscreenElement || document.webkitFullscreenElement ||
        document.mozFullScreenElement || document.msFullscreenElement) {
      let dom;
      if (visibleHUD == 0) {
        dom = bigButtonHUDDom;
      } else if (visibleHUD == 1) {
        dom = timersHUDDom;
      }
      dom.classList.remove('fsHUD');
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitCancelFullscreen) {
        document.webkitCancelFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  /**
   * Toggle fullscreen HUD state.
   *
   * @public
   */
  TraX.toggleHUDFullscreen = function() {
    if (document.fullscreenElement || document.webkitFullscreenElement ||
        document.mozFullScreenElement || document.msFullscreenElement) {
      TraX.releaseHUDFullscreen();
    } else {
      TraX.triggerHUDFullscreen();
    }
  };
  /**
   * New list of friends received from server, update UI.
   *
   * @private
   */
  function updateFriendsList() {
    // Requests list
    friendsRequestListDom.innerHTML = '';
    const outgoing = document.createElement('ol');
    const incoming = document.createElement('ol');
    for (let i = 0; i < allRelations.length; i++) {
      if (allRelations[i].relation != oneRequestStatus &&
          allRelations[i].relation != twoRequestStatus) {
        continue;
      }
      const newItem = document.createElement('li');
      newItem.innerHTML = '<strong>' + (allRelations[i].firstName || '') + ' ' +
          (allRelations[i].lastName || '') +
          '</strong> <a class="friendListId">' + allRelations[i].id + '</a>';

      const cancel = document.createElement('button');
      cancel.innerHTML = '<span>Cancel</span>';
      cancel.className = 'links mini nohover';
      cancel.setAttribute(
          'onclick', 'TraX.removeFriend(' + allRelations[i].id + ');');
      const accept = document.createElement('button');
      accept.innerHTML = '<span>Accept</span>';
      accept.className = 'links mini nohover';
      accept.setAttribute(
          'onclick', 'TraX.acceptFriend(' + allRelations[i].id + ');');
      const decline = document.createElement('button');
      decline.innerHTML = '<span>Decline</span>';
      decline.className = 'links mini nohover';
      decline.setAttribute(
          'onclick', 'TraX.declineFriend(' + allRelations[i].id + ');');

      if (allRelations[i].usernum == 1) {
        if (allRelations[i].relation == oneRequestStatus) {
          newItem.appendChild(cancel);
          outgoing.appendChild(newItem);
          accept.remove();
          decline.remove();
        } else if (allRelations[i].relation == twoRequestStatus) {
          newItem.appendChild(accept);
          newItem.appendChild(decline);
          incoming.appendChild(newItem);
          cancel.remove();
        }
      } else {
        if (allRelations[i].relation == oneRequestStatus) {
          newItem.appendChild(accept);
          newItem.appendChild(decline);
          incoming.appendChild(newItem);
          cancel.remove();
        } else if (allRelations[i].relation == twoRequestStatus) {
          newItem.appendChild(cancel);
          outgoing.appendChild(newItem);
          accept.remove();
          decline.remove();
        }
      }
    }
    friendsRequestListDom.appendChild(incoming);
    friendsRequestListDom.appendChild(outgoing);
    if (incoming.innerHTML.length > 0) {
      incoming.outerHTML = 'Incoming requests' + incoming.outerHTML;
    }
    if (outgoing.innerHTML.length > 0) {
      outgoing.outerHTML = 'Outgoing requests' + outgoing.outerHTML;
    }
    if (outgoing.innerHTML.length == 0 && incoming.innerHTML.length == 0) {
      incoming.outerHTML = 'None';
    }

    // Friend list
    friendsListDom.innerHTML = '';
    for (let i = 0; i < TraX.friendsList.length; i++) {
      const newItem = document.createElement('li');

      const name = document.createElement('strong');
      name.appendChild(
          document.createTextNode(
              TraX.friendsList[i].firstName + ' ' +
              TraX.friendsList[i].lastName));

      newItem.appendChild(name);

      const remove = document.createElement('button');
      remove.innerHTML = '<span>Remove</span>';
      remove.className = 'links mini nohover';
      remove.setAttribute(
          'onclick', 'TraX.removeFriend(' + TraX.friendsList[i].id + ');');

      const block = document.createElement('button');
      block.innerHTML = '<span>Block</span>';
      block.className = 'links mini nohover';
      block.setAttribute(
          'onclick', 'TraX.blockFriend(' + TraX.friendsList[i].id + ');');
      newItem.appendChild(remove);
      newItem.appendChild(block);

      const newId = document.createElement('a');
      newId.classList.add('friendListId');
      newId.innerHTML = TraX.friendsList[i].id;
      newItem.appendChild(newId);

      friendsListDom.appendChild(newItem);
    }
    if (TraX.friendsList.length == 0) {
      const newItem = document.createElement('li');
      if (TraX.isSignedIn) {
        newItem.innerHTML = 'It looks like you don\'t have any friends :(<br>' +
            'Send a request below to make some!';
      } else {
        newItem.innerHTML = 'I don\'t know who you are!<br>' +
            'You must be signed in for me to find your friends!';
      }
      friendsListDom.appendChild(newItem);
    }

    // Blocked list
    blockedListDom.innerHTML = '';
    const outgoing2 = document.createElement('ol');
    const incoming2 = document.createElement('ol');
    for (let i = 0; i < allRelations.length; i++) {
      if (allRelations[i].relation != oneBlockedStatus &&
          allRelations[i].relation != twoBlockedStatus &&
          allRelations[i].relation != bothBlockedStatus) {
        continue;
      }
      const newItem = document.createElement('li');
      newItem.innerHTML = '<strong>' + allRelations[i].firstName + ' ' +
          allRelations[i].lastName + '</strong> <a class="friendListId">' +
          allRelations[i].id + '</a>';

      const cancel = document.createElement('button');
      cancel.innerHTML = '<span>Unblock</span>';
      cancel.className = 'links mini nohover';
      cancel.setAttribute(
          'onclick', 'TraX.unblockUser(' + allRelations[i].id + ');');

      if (allRelations[i].usernum == 1) {
        if (allRelations[i].relation == oneBlockedStatus ||
            allRelations[i].relation == bothBlockedStatus) {
          newItem.appendChild(cancel);
          outgoing2.appendChild(newItem);
        } else if (allRelations[i].relation == twoBlockedStatus) {
          // newItem.appendChild(cancel);
          incoming2.appendChild(newItem);
        } else {
          continue;
        }
      } else {
        if (allRelations[i].relation == twoBlockedStatus ||
            allRelations[i].relation == bothBlockedStatus) {
          newItem.appendChild(cancel);
          outgoing2.appendChild(newItem);
        } else if (allRelations[i].relation == oneBlockedStatus) {
          // newItem.appendChild(cancel);
          incoming2.appendChild(newItem);
        } else {
          continue;
        }
      }
    }
    blockedListDom.appendChild(incoming2);
    blockedListDom.appendChild(outgoing2);
    if (incoming2.innerHTML.length > 0) {
      incoming2.outerHTML = 'Blocked you' + incoming2.outerHTML;
    }
    if (outgoing2.innerHTML.length > 0) {
      outgoing2.outerHTML = 'You\'ve blocked' + outgoing2.outerHTML;
    }
    if (outgoing2.innerHTML.length == 0 && incoming2.innerHTML.length == 0) {
      incoming2.outerHTML = 'Nobody';
    }
  }
  /**
   * Add friend button clicked.
   *
   * @public
   */
  TraX.addFriend = function() {
    console.log('Adding friend', friendsIdInputDom.value);
    TraX.socket.emit('addfriend', friendsIdInputDom.value);
  };
  /**
   * Remove friend button clicked.
   *
   * @public
   * @param {string} id Id of friend to remove as friend.
   */
  TraX.removeFriend = function(id) {
    console.log('Removing friend', id);
    TraX.socket.emit('removefriend', id);
  };
  /**
   * Decline friend request button clicked.
   *
   * @public
   * @param {string} id Id of user to decline friend request.
   */
  TraX.declineFriend = function(id) {
    console.log('Denying friend', id);
    TraX.socket.emit('denyrequest', id);
  };
  /**
   * Accept friend request button clicked.
   *
   * @public
   * @param {string} id Id of user to accept friend request.
   */
  TraX.acceptFriend = function(id) {
    console.log('Accepting friend', id);
    TraX.socket.emit('acceptrequest', id);
  };
  /**
   * Block user button clicked.
   *
   * @public
   * @param {string} id Id of friend to block.
   */
  TraX.blockFriend = function(id) {
    console.log('Blocking friend', id);
    TraX.socket.emit('blockrequest', id);
  };
  /**
   * Unblock user button clicked.
   *
   * @public
   * @param {string} id Id of user to unblock.
   */
  TraX.unblockUser = function(id) {
    console.log('Unblocking user', id);
    TraX.socket.emit('unblockuser', id);
  };
  /**
   * Friend position received from server, update map.
   *
   * @private
   * @param {string} friendId The id of the friend we are updating the position
   * of.
   * @param {{lat: number, lng: number}} pos Friend's position.
   */
  function updateFriendPos(friendId, pos) {
    for (let i = 0; i < friendPositions.length; i++) {
      if (friendPositions[i].userId == friendId) {
        friendPositions[i].lat = pos.lat;
        friendPositions[i].lng = pos.lng;
        friendPositions[i].time = Date.now();
        updateMap();
        return;
      }
    }
    if (TraX.debugMode > 1) {
      console.log('FriendPos:', friendId, pos);
    }
    if (!pos) return;
    friendPositions.push(
        {lat: pos.lat, lng: pos.lng, userId: friendId, time: Date.now()});
    updateMap();
  }
  /**
   * Clicked copy link button on account for sharing.
   *
   * @public
   */
  TraX.copyFriendLink = function() {
    if (TraX.isSignedIn) {
      const text = document.createElement('input');
      text.type = 'text';
      text.value = 'https://' + location.hostname + location.pathname +
          '?friendId=' + TraX.getDriverId();
      document.body.appendChild(text);
      copy = function() {
        text.select();
        document.execCommand('copy');
        TraX.showMessageBox('Copied link!');
        text.outerHTML = '';
      };
      setTimeout(copy);
    } else {
      TraX.showMessageBox('Must be signed in to share your id.');
    }
  };

  /**
   * Copy the current live view URL with this user's secret.
   *
   * @public
   */
  TraX.copySecretURL = function() {
    if (secret && secret.length > 0) {
      const text = document.createElement('input');
      text.type = 'text';
      text.value = 'https://' + location.hostname +
          (location.pathname + '/live/?s=').replace(/\/\//g, '/') + secret;
      document.body.appendChild(text);
      copy = function() {
        text.select();
        document.execCommand('copy');
        TraX.showMessageBox('Copied link!');
        text.outerHTML = '';
      };
      setTimeout(copy);
    } else {
      if (!TraX.isSignedIn) {
        TraX.showMessageBox('Please sign in and create a new link first.');
      } else {
        TraX.showMessageBox('Please create a new link first.');
      }
    }
  };

  /**
   * Handle receiving the current user's secret.
   *
   * @private
   * @param {?string} s The current user's secret, or null if none.
   */
  function handleSecret(s) {
    secret = s || '';
    secretURLDom.textContent = 'https://' + location.hostname +
        (location.pathname + '/live/?s=').replace(/\/\//g, '/') + secret;
  }

  /**
   * Handle user requesting new secret.
   *
   * @public
   */
  TraX.resetSecret = function() {
    if (!TraX.isSignedIn) {
      TraX.showMessageBox('Please sign in first.');
      return;
    }
    if (!secret ||
        confirm(
            'Are you sure you wish to create a new link?\n\nThe current link ' +
            'will stop working.')) {
      TraX.socket.emit('resetSecret');
    }
  };

  /**
   * Click add bluetooth device.
   *
   * @public
   */
  TraX.handleClickBluetoothRefresh = function() {
    const serviceUUID = 0xe47c8027;
    const allServiceUUIDs = [
      serviceUUID,
      'b2e7d564-c077-404e-9d29-b547f4512dce',
      'e47c8027-cca1-4e3b-981f-bdc47abeb5b5',
    ];
    if (navigator.bluetooth) {
      /* const characteristicUUID = 0xcacc07ff;
      console.log(
          "BT Request with service:", serviceUUID, "characteristic:",
          characteristicUUID); */
      navigator.bluetooth
          .requestDevice({
            acceptAllDevices: true,
            optionalServices: allServiceUUIDs,
          } /* {filters: [{services: [serviceUUID]}]}*/)
          .then((device) => {
            device.addEventListener('gattserverdisconnected', btDisconnect);
            const newSection = document.createElement('p');
            newSection.innerHTML = device.name + '(' + device.id + ')';
            newSection.id = 'debugBTList' + device.name;
            debugBluetoothDom.appendChild(newSection);

            console.log('BT Device', device);

            // TODO: Implement auto-reconnect
            return device.gatt.connect();
          })
          .then((server) => {
            console.log('BT Server', server);
            return server.getPrimaryServices();
          })
          .then((services) => {
            console.log('BT Services', services);
            let queue = Promise.resolve();
            services.forEach((service) => {
              queue = queue.then(() => {
                service.getCharacteristics().then((characteristics) => {
                  console.log('BT Service', service);
                  const newService = document.createElement('p');
                  newService.innerHTML = '>Service:' + service.uuid;
                  const btDeviceDom = document.getElementById(
                      'debugBTList' + service.device.name);
                  btDeviceDom.appendChild(newService);
                  characteristics.forEach((characteristic) => {
                    console.log('BT Characteristic', characteristic);
                    const newCharacteristic = document.createElement('p');
                    newCharacteristic.innerHTML =
                        '>>Characteristic:' + service.uuid;
                    btDeviceDom.appendChild(newCharacteristic);
                  });
                });
              });
            });
            return queue;
          })
          .catch((error) => {
            console.log(error);
            const errDom = document.createElement('p');
            errDom.innerHTML = 'Error:' + error;
            debugBluetoothDom.appendChild(errDom);
          });
    } else {
      TraX.showMessageBox('This browser does not support bluetooth devices.');
    }
  };
  /**
   * Bluetooth device disconnected.
   *
   * @private
   * @param {Event} event The event that triggered this.
   */
  function btDisconnect(event) {
    const device = event.target;
    console.log('BT Disconnect', device);
    document.getElementById('debugBTList' + device.name).outerHTML = '';
  }
}(window.TraX = window.TraX || {}));
