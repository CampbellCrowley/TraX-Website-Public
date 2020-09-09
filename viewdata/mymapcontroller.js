// Copyright 2018-2020 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
  (function(DataView, undefined) {
    /**
     * Controls the map in DataView.
     * @class MyMap
     * @augments DataView
     */
    (function(MyMap, undefined) {
      /**
       * Default options for a polyline on the map.
       * @default
       * @private
       * @type {google.maps.PolylineOptions}
       */
      const polyLineOpts = {
        strokeColor: '#000000',
        strokeWeight: 5,
        clickable: true,
        editable: false,
      };
      /**
       * List of possible colors the polyline can be.
       * @default
       * @constant
       * @private
       * @type {string[]}
       */
      const colorList = [
        '#000000',
        '#0000FF',
        '#00FF00',
        '#FF0000',
        '#FF00FF',
        '#FF8800',
        '#00FFFF',
        '#88FF00',
        '#888888',
        '#FF8888',
        '#880000',
        '#000088',
      ];

      /**
       * Play character to show on playback toggle button.
       * @default
       * @constant
       * @private
       * @type {string}
       */
      const playChar = '&#9658;';
      /**
       * Pause character to show on playback toggle button.
       * @default
       * @constant
       * @private
       * @type {string}
       */
      const pauseChar = '&#10074;&#10074;';
      // DOM Elements.
      let overlayDom;
      let overlayButtonsDom;
      let mapConfigButtonsDom;
      let overlayTextInputDom;
      let overlayTrackNameInput;
      let overlayConfigNameInput;
      let colorOverlayDom;
      let mapSliderOverlayDom;
      let playbackSliderDom;

      // Map markers and other items. //
      /**
       * Map object reference. Created once map should become visible, not when
       * page is loaded to reduce calls to the API and thus using less of our
       * quota.
       * @default
       * @private
       * @type {?google.maps.Map}
       */
      let mymap = null;
      /**
       * Circles drawn on map.
       * @default
       * @private
       * @type {google.maps.Circle}
       */
      const myMapCircles = [];
      /**
       * Marker marking start line.
       * @private
       * @type {google.maps.Marker}
       */
      let startMarker;
      /**
       * Marker marking finish line.
       * @private
       * @type {google.maps.Marker}
       */
      let finishMarker;
      /**
       * Marker marking start line placed by user.
       * @private
       * @type {google.maps.Marker}
       */
      let placedStartMarker;
      /**
       * Marker marking finish line placed by user.
       * @private
       * @type {google.maps.Marker}
       */
      let placedFinishMarker;
      /**
       * Image to show as the start line marker.
       * @private
       * @type {google.maps.Icon}
       */
      let startImg;
      /**
       * Image to show as the finish line marker.
       * @private
       * @type {google.maps.Icon}
       */
      let finishImg;
      /**
       * Marker marking the track center.
       * @private
       * @type {google.maps.Marker}
       */
      let trackMarker;
      /**
       * Array of all polylines on the map.
       * @default
       * @private
       * @type {google.maps.Polyline[]}
       */
      let myPolyLines = [];

      let trackDoneButton;
      let configDoneButton;
      let infoWindow;

      /**
       * Current start index of visible data on map.
       * @private
       * @type {number}
       */
      let currentStartIndex;
      /**
       * Current end index of visible data on map.
       * @private
       * @type {number}
       */
      let currentEndIndex;

      /**
       * Are we currently playing back data?
       * @private
       * @default
       * @type {boolean}
       */
      let currentlyPlaying = false;
      /**
       * The interval refreshing visible data.
       * @private
       * @type {Interval}
       */
      let playbackInterval;
      /**
       * The frequency in milliseconds to refresh visible data.
       * @default
       * @constant
       * @private
       * @type {number}
       */
      const playbackFrequency = 48;
      /**
       * The current time in milliseconds after session start shown on map.
       * @default
       * @private
       * @type {number}
       */
      let playbackTime = 0;
      /**
       * The number of milliseconds after session start that the current
       * playback data starts.
       * @default
       * @private
       * @type {number}
       */
      let playbackStartTime = 0;
      /**
       * The number of milliseconds after session start that the current
       * playback data ends.
       * @default
       * @private
       * @type {number}
       */
      let playbackEndTime = 0;

      /**
       * Current mode for dropping points onto map for choosing start and
       * finish. Can be "none", "start", "finish", or "center".
       * @default
       * @private
       * @type {string}
       */
      let pointMode = 'none';
      /**
       * Current mode for which data is being edited. Can be "none", "track", or
       * "config".
       * @default
       * @private
       * @type {string}
       */
      let trackMode = 'none';
      /**
       * Current mode whether we are editing or creating a new track or config.
       * Can be "create", or "edit".
       * @default
       * @private
       * @type {string}
       */
      let editMode = 'create';

      /**
       * The current way the polyline is being colored.
       * @TODO: Change this to data key to allow coloring of any data.
       * @private
       * @default
       * @type {string}
       */
      let lineColorMode = 'laps';

      /**
       * Is the info window open currently.
       * @private
       * @default
       * @type {boolean}
       */
      let infoWindowOpen = false;

      /**
       * Initialize TraX~MyMap
       *
       * @public
       */
      MyMap.init = function() {
        overlayDom = document.getElementById('mymapOverlay');
        mapTrackButtonsDom = document.getElementById('mapTrackButtons');
        mapConfigButtonsDom = document.getElementById('mapOverlayButtons');
        overlayTextInputDom = document.getElementById('mapOverlayTextInput');
        overlayTrackNameInput = document.getElementById('mapOverlayTrackName');
        overlayConfigNameInput =
            document.getElementById('mapOverlayConfigName');
        trackDoneButton = document.getElementById('donePlacingTrack');
        trackNoneButton = document.getElementById('cancelPlaceTrack');
        configDoneButton = document.getElementById('donePlacing');
        colorOverlayDom = document.getElementById('mapColorButtons');
        mapSliderOverlayDom = document.getElementById('mapSliderOverlay');
        playbackSliderDom = document.getElementById('playbackSlider');

        // All buttons that may overlay the map.
        overlayButtonsDom = document.getElementsByClassName('overlayButton');

        // Default color choosing overlay to visible.
        colorOverlayDom.style.display = 'block';

        // Setup listeners for buttons to be able to update UI to show selected
        // button.
        for (let i = 0; i < overlayButtonsDom.length; i++) {
          overlayButtonsDom[i].addEventListener('click', overlayButtonClicked);
        }
      };

      /**
       * Data view is openeing, and map may be visible now.
       *
       * @public
       */
      MyMap.handleOpening = function() {
        console.log('handleOpening');
        if (!mymap) {
          console.warn('INITIALIZING Google Maps');
          // Initialize map only once visible to reduce API calls.
          mymap = new google.maps.Map(document.getElementById('mymap'), {
            zoom: 1,
            center: {lat: 0.0, lng: 0.0},
            gestureHandling: 'auto',
            clickableIcons: false,
            fullscreenControlOption: false,
            streetViewControl: false,
          });
          const input = document.getElementById('mapSearchOverlay');
          const searchBox = new google.maps.places.SearchBox(input);
          mymap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          mymap.addListener('bounds_changed', function() {
            searchBox.setBounds(mymap.getBounds());
          });
          searchBox.addListener('places_changed', function() {
            const places = searchBox.getPlaces();
            if (places.length === 0) return;
            const bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              if (!place.geometry) return;
              if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            mymap.fitBounds(bounds);
          });
          // Initialize markers for editing track data..
          placedStartMarker =
              new google.maps.Marker({label: 'S', map: mymap, draggable: true});
          placedFinishMarker =
              new google.maps.Marker({label: 'F', map: mymap, draggable: true});
          trackMarker = new google.maps.Marker({label: 'T', map: mymap});
          placedStartMarker.setVisible(false);
          placedFinishMarker.setVisible(false);
          placedStartMarker.addListener('drag', handleMarkerDragged);
          placedFinishMarker.addListener('drag', handleMarkerDragged);
          trackMarker.setVisible(false);
          placedStartMarker.addListener('click', handleMapMarkerClicked);
          placedFinishMarker.addListener('click', handleMapMarkerClicked);
          trackMarker.addListener('click', handleMapMarkerClicked);

          playbackSliderDom.oninput = function() {
            if (currentlyPlaying) MyMap.togglePlayback(false);
            playbackTime = playbackSliderDom.value;
            refreshPlaybackData(true);
          };

          // Initialize markers for start and finish line.
          startImg = {
            url: 'https://dev.campbellcrowley.com/trax/images/greenFlag.png',
            size: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(2, 30),
            scaledSize: new google.maps.Size(32, 32),
          };
          finishImg = {
            url:
                'https://dev.campbellcrowley.com/trax/images/checkeredFlag.png',
            size: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 30),
            scaledSize: new google.maps.Size(32, 32),
          };
          startMarker = new google.maps.Marker({
            map: mymap,
            position: {lat: 0, lng: 0},
            icon: startImg,
            title: 'Start Line',
          });
          startMarker.addListener('click', handleMapMarkerClicked);
          finishMarker = new google.maps.Marker({
            map: mymap,
            position: {lat: 0, lng: 0},
            icon: finishImg,
            title: 'Finish Line',
          });
          finishMarker.addListener('click', handleMapMarkerClicked);

          // Initialize circles for start/finish thresholds.
          myMapCircles.push(new google.maps.Circle({
            map: mymap,
            fillColor: '#00FF00',
            strokeColor: '#00FF00',
            center: {lat: 0, lng: 0},
            radius: 100,
          }));
          myMapCircles.push(new google.maps.Circle({
            map: mymap,
            fillColor: '#FF0000',
            strokeColor: '#FF0000',
            center: {lat: 0, lng: 0},
            radius: 100,
          }));
          // Initialize info window for clicking on the track data.
          infoWindow = new google.maps.InfoWindow({
            content: 'Something else should be here...',
            position: {lat: 0, lng: 0},
          });

          // Add listener to know when where map is clicked.
          mymap.addListener('click', handleMapClicked);
          // Show polyline on map;
          polyLineOpts.map = mymap;
        }
        resetSelectedButtons();
      };
      /**
       * Data view is closing, and map is not visible anymore.
       *
       * @public
       */
      MyMap.handleClosing = function() {
        MyMap.togglePlayback(false);
      };

      /**
       * Add track selected from track list.
       *
       * @public
       */
      MyMap.handleClickAddTrack = function() {
        MyMap.updateMyMap();
        Panes.nextPane();
        resetSelectedButtons(trackNoneButton);

        overlayTrackNameInput.value = '';
        overlayConfigNameInput.value = '';
        overlayTrackNameInput.disabled = false;
        overlayConfigNameInput.disabled = true;
        trackDoneButton.disabled = true;

        // console.log("Adding new track with coords: ",
        // DataView.coordAverage.coord);
        trackMarker.setPosition(DataView.coordAverage.coord);

        showOverlay(true);
        trackMarker.setVisible(false);
        trackMode = 'track';
        editMode = 'create';
      };
      /**
       * Handle click edit track.
       *
       * @public
       */
      MyMap.handleClickEditTrack = function() {
        console.log('Edit track clicked!');
        MyMap.handleClickAddTrack();
        if (!DataView.trackData.track.coord) {
          setTimeout(function() {
            trackMarker.setPosition(DataView.trackData.track.coord);
          }, 500);
        } else {
          trackMarker.setPosition(DataView.trackData.track.coord);
        }
        trackMarker.setVisible(true);
        overlayTrackNameInput.value =
            DataView.trackData.track.name.replace('You: ', '');
        trackDoneButton.disabled = false;
        editMode = 'edit';
      };
      /**
       * Add config selected from config list.
       *
       * @public
       */
      MyMap.handleClickAddConfig = function() {
        if (DataView.trackData.track.ownerId != TraX.getDriverId()) {
          TraX.showMessageBox(
              'Adding configs for other user\'s tracks doesn\'t work yet.');
          return;
        }
        MyMap.updateMyMap();
        Panes.nextPane();
        resetSelectedButtons();
        showOverlay();
        if (DataView.trackData.track) {
          overlayTrackNameInput.value = DataView.trackData.track.name;
        } else {
          overlayTrackNameInput.value = '';
        }
        overlayTrackNameInput.disabled = true;
        overlayConfigNameInput.disabled = false;
        overlayConfigNameInput.value = '';
        configDoneButton.disabled = false;
        trackMode = 'config';
        editMode = 'create';
        fitTrackInMap();
      };
      /**
       * Handle click edit config button.
       *
       * @public
       */
      MyMap.handleClickEditConfig = function() {
        MyMap.handleClickAddConfig();
        overlayConfigNameInput.value = DataView.trackData.config.name;
        placedStartMarker.setPosition(DataView.trackData.config.start.coord);
        placedStartMarker.setVisible(true);
        placedFinishMarker.setPosition(DataView.trackData.config.finish.coord);
        placedFinishMarker.setVisible(true);
        editMode = 'edit';
      };
      /**
       * Select no tool for placing.
       *
       * @public
       */
      MyMap.handleClickEndPlace = function() {
        pointMode = 'none';
      };
      /**
       * Select place start line.
       *
       * @public
       */
      MyMap.handleClickPlaceStart = function() {
        pointMode = 'start';
      };
      /**
       * Select place finish line.
       *
       * @public
       */
      MyMap.handleClickPlaceFinish = function() {
        pointMode = 'finish';
      };
      /**
       * Select place track center.
       *
       * @public
       */
      MyMap.handleClickPlaceTrackCenter = function() {
        pointMode = 'center';
      };

      /**
       * Increase radius of start line.
       *
       * @public
       */
      MyMap.handleClickEnlargeStart = function() {
        const startLine = DataView.getStartLine();
        if (!startLine) return;
        startLine.radius += 0.0001;
        const startRadius = TraX.Units.coordToMeters(
            startLine.coord.lat, startLine.coord.lng,
            startLine.coord.lat + startLine.radius * Math.cos(Math.PI / 4.0),
            startLine.coord.lng + startLine.radius * Math.sin(Math.PI / 4.0));
        myMapCircles[0].setRadius(startRadius);
      };
      /**
       * Decrease radius of start line.
       *
       * @public
       */
      MyMap.handleClickShrinkStart = function() {
        const startLine = DataView.getStartLine();
        if (!startLine) return;
        if (startLine.radius > 0.0001) startLine.radius -= 0.0001;
        const startRadius = TraX.Units.coordToMeters(
            startLine.coord.lat, startLine.coord.lng,
            startLine.coord.lat + startLine.radius * Math.cos(Math.PI / 4.0),
            startLine.coord.lng + startLine.radius * Math.sin(Math.PI / 4.0));
        myMapCircles[0].setRadius(startRadius);
      };

      /**
       * Increase radius of finish line.
       *
       * @public
       */
      MyMap.handleClickEnlargeFinish = function() {
        const finishLine = DataView.getFinishLine();
        if (!finishLine) return;
        finishLine.radius += 0.0001;
        const finishRadius = TraX.Units.coordToMeters(
            finishLine.coord.lat, finishLine.coord.lng,
            finishLine.coord.lat + finishLine.radius * Math.cos(Math.PI / 4.0),
            finishLine.coord.lng + finishLine.radius * Math.sin(Math.PI / 4.0));
        myMapCircles[1].setRadius(finishRadius);
      };
      /**
       * Decrease radius of finish line.
       *
       * @public
       */
      MyMap.handleClickShrinkFinish = function() {
        const finishLine = DataView.getFinishLine();
        if (!finishLine) return;
        if (finishLine.radius > 0.0001) finishLine.radius -= 0.0001;
        const finishRadius = TraX.Units.coordToMeters(
            finishLine.coord.lat, finishLine.coord.lng,
            finishLine.coord.lat + finishLine.radius * Math.cos(Math.PI / 4.0),
            finishLine.coord.lng + finishLine.radius * Math.sin(Math.PI / 4.0));
        myMapCircles[1].setRadius(finishRadius);
      };

      /**
       * User has finished naming new track or config and placing markers.
       *
       * @public
       */
      MyMap.handleClickSubmitMapNames = function() {
        if (!overlayTrackNameInput.value && trackMode == 'track') return;
        if (!overlayConfigNameInput.value && trackMode == 'config') return;
        Panes.previousPane();
        resetSelectedButtons();

        console.log('Requesting new', trackMode);
        if (trackMode == 'track') {
          const trackName = overlayTrackNameInput.value;

          if (editMode == 'create') {
            TraX.socket.emit('newtrack', trackName, trackMarker.getPosition());
          } else if (editMode == 'edit') {
            TraX.socket.emit(
                'edittrack', trackName, trackMarker.getPosition(),
                DataView.trackData.track.id);
          }

          setTimeout(DataView.fetchTrackList, 500);
          setTimeout(TraX.requestFilesize, 1000);
        } else {
          if (!DataView.trackData.config) {
            DataView.trackData.config = new DataView.Config();
          }
          if (placedStartMarker.getVisible()) {
            const pos = placedStartMarker.getPosition();
            if (!DataView.trackData.config.start) {
              DataView.trackData.config.start = {};
            }
            DataView.trackData.config.start.coord = {
              lat: pos.lat(),
              lng: pos.lng(),
            };
            if (!DataView.trackData.config.start.radius) {
              DataView.trackData.config.start.radius = 0.0004;
            }
          }
          if (placedFinishMarker.getVisible()) {
            const pos = placedFinishMarker.getPosition();
            if (!DataView.trackData.config.finish) {
              DataView.trackData.config.finish = {};
            }
            DataView.trackData.config.finish.coord = {
              lat: pos.lat(),
              lng: pos.lng(),
            };
            if (!DataView.trackData.config.finish.radius) {
              DataView.trackData.config.finish.radius = 0.0004;
            }
          }
          const configName = overlayConfigNameInput.value;
          if (editMode == 'create') {
            TraX.socket.emit(
                'newconfig', DataView.trackData.track.id,
                DataView.trackData.track.name, configName,
                DataView.trackData.config.start,
                DataView.trackData.config.finish, []);
          } else if (editMode == 'edit') {
            TraX.socket.emit(
                'editconfig', DataView.trackData.track.id,
                DataView.trackData.track.name, configName,
                DataView.trackData.config.start,
                DataView.trackData.config.finish, [],
                DataView.trackData.config.id);
          }
          setTimeout(DataView.fetchTrackConfigList, 500);
          setTimeout(TraX.requestFilesize, 1000);
        }

        overlayTrackNameInput.value = '';
        overlayConfigNameInput.value = '';

        trackMode = 'none';

        DataView.updateSessionData();
        hideOverlay();
      };
      /**
       * User back while naming, show marker selection again.
       *
       * @public
       */
      MyMap.handleClickBackMapNames = function() {
        if (trackMode == 'track') {
          MyMap.handleClickCancelPlacing();
          return;
        }
        if (trackMode == 'config') {
          resetSelectedButtons();
          mapConfigButtonsDom.style.display = 'block';
        } else if (trackMode == 'track') {
          resetSelectedButtons(trackNoneButton);
          mapTrackButtonsDom.style.display = 'block';
        }
        overlayTextInputDom.style.display = 'none';
      };
      /**
       * User is done placing markers and is ready to name track or config.
       *
       * @public
       */
      MyMap.handleClickDonePlacing = function() {
        if (trackMode == 'config') {
          if (!placedStartMarker.getVisible() ||
              !placedFinishMarker.getVisible()) {
            TraX.showMessageBox(
                'Both start and finish lines must be placed. ' +
                'They can be in the same place.');
            return;
          }
        } else if (trackMode == 'track') {
          if (!trackMarker.getVisible()) {
            TraX.showMessageBox(
                'The center of the track should be marked before continuing.');
            return;
          }
        }
        pointMode = 'none';
        mapConfigButtonsDom.style.display = 'none';
        mapTrackButtonsDom.style.display = 'none';
        overlayTextInputDom.style.display = 'block';
      };
      /**
       * User aborted adding track or config.
       *
       * @public
       */
      MyMap.handleClickCancelPlacing = function() {
        trackMode = 'none';
        hideOverlay();
        resetSelectedButtons();
        Panes.previousPane();
      };
      /**
       * If any map overlay button is clicked, show it as the only selected
       * button.
       *
       * @private
       * @param {Event} event Event from button that was clicked.
       */
      function overlayButtonClicked(event) {
        resetSelectedButtons(event.target);
      }
      /**
       * Pass coordinate where map was clicked to handler.
       *
       * @private
       * @param {Event} event Event of map clicked.
       */
      function handleMapClicked(event) {
        if (TraX.debugMode) {
          console.log(
              'Map Clicked: Lat: ', event.latLng.lat(), 'Lng:',
              event.latLng.lng());
        }

        handleMapClickCoord(
            {lat: event.latLng.lat(), lng: event.latLng.lng()}, false);
      }
      /**
       * Handle a map marker being dragged.
       *
       * @private
       * @param {Event} event Dragged marker event.
       */
      function handleMarkerDragged(event) {
        if (TraX.debugMode > 1) {
          console.log(
              'Marker Dragged: Lat: ', event.latLng.lat(), 'Lng:',
              event.latLng.lng());
        }

        myMapCircles[0].setCenter(placedStartMarker.getPosition());
        myMapCircles[1].setCenter(placedFinishMarker.getPosition());
      }
      /**
       * Pass coordinate where polyline was clicked to handler.
       *
       * @private
       * @param {Event} event Event of Polyline clicked.
       */
      function handleMapLineClicked(event) {
        if (TraX.debugMode) {
          console.log(
              'PolyLine Clicked: Lat: ', event.latLng.lat(), 'Lng:',
              event.latLng.lng());
        }
        handleMapClickCoord(
            {lat: event.latLng.lat(), lng: event.latLng.lng()}, true);
      }
      /**
       * Pass coordinate where marker was clicked to handler.
       *
       * @private
       * @param {Event} event Event of map marker clicked.
       */
      function handleMapMarkerClicked(event) {
        if (TraX.debugMode) {
          console.log(
              'PolyLine Clicked: Lat: ', event.latLng.lat(), 'Lng:',
              event.latLng.lng());
        }
        handleMapClickCoord(
            {lat: event.latLng.lat(), lng: event.latLng.lng()}, true);
      }
      /**
       * Handle some element on the map being clicked at coord. wasMarker is
       * true for anything other than the map itself.
       *
       * @private
       * @param {{lat: number, lng: number}} coord Location map was clicked.
       * @param {boolean} wasMarker Was a marker clicked. False if anything else
       * was clicked.
       */
      function handleMapClickCoord(coord, wasMarker) {
        if (trackMode == 'config') {
          const distToTrack =
              TraX.Units.latLngToMeters(coord, DataView.trackData.track.coord);
          if (distToTrack > 10 * 1000) {
            console.log(
                coord, 'is', distToTrack, 'meters from',
                DataView.trackData.track.coord, '(', DataView.trackData.track,
                ')');
            TraX.showMessageBox('That point is too far from the track.');
            return;
          }
          if (pointMode == 'start') {
            placedStartMarker.setPosition(coord);
            placedStartMarker.setVisible(true);
            if (placedFinishMarker.getVisible()) {
              configDoneButton.disabled = false;
            }
            myMapCircles[0].setMap(mymap);
            myMapCircles[0].setCenter(coord);
          } else if (pointMode == 'finish') {
            placedFinishMarker.setPosition(coord);
            placedFinishMarker.setVisible(true);
            if (placedStartMarker.getVisible() ) {
              configDoneButton.disabled = false;
            }
            myMapCircles[1].setMap(mymap);
            myMapCircles[1].setCenter(coord);
          }
        } else if (trackMode == 'track') {
          if (pointMode == 'center') {
            trackMarker.setPosition(coord);
            trackMarker.setVisible(true);
            trackDoneButton.disabled = false;
          }
        } else if (wasMarker && trackMode == 'none') {
          showMessageWindow(coord);
        } else {
          hideMessageWindow();
        }
      }
      /**
       * Hide all overlays and re-show default view.
       *
       * @private
       */
      function hideOverlay() {
        placedStartMarker.setVisible(false);
        placedFinishMarker.setVisible(false);
        trackMarker.setVisible(false);
        overlayDom.style.display = 'none';
        mapConfigButtonsDom.style.display = 'none';
        mapTrackButtonsDom.style.display = 'none';
        overlayTextInputDom.style.display = 'none';
        colorOverlayDom.style.display = 'block';
        mapSliderOverlayDom.style.display = 'none';
      }
      /**
       * Show overlay for editing track or config.
       *
       * @private
       * @param {boolean} [addingTrack=false] Is the overlay in "adding track"
       * mode.
       */
      function showOverlay(addingTrack) {
        hideMessageWindow();
        placedStartMarker.setVisible(false);
        placedFinishMarker.setVisible(false);
        overlayDom.style.display = 'block';
        if (addingTrack) {
          mapConfigButtonsDom.style.display = 'none';
          mapTrackButtonsDom.style.display = 'block';
        } else {
          mapConfigButtonsDom.style.display = 'block';
          mapTrackButtonsDom.style.display = 'none';
        }
        overlayTextInputDom.style.display = 'none';
        colorOverlayDom.style.display = 'none';
        mapSliderOverlayDom.style.display = 'none';
      }
      /**
       * Reset all buttons to not selected, then show currently selected button
       * as such.
       *
       * @private
       * @param {Element} addTarget The element to set as selected.
       */
      function resetSelectedButtons(addTarget) {
        for (let i = 0; i < overlayButtonsDom.length; i++) {
          overlayButtonsDom[i].classList.remove('selected');
        }
        if (addTarget) {
          addTarget.classList.add('selected');
        } else {
          overlayButtonsDom[0].classList.add('selected');
          pointMode = 'none';
        }
      }
      /**
       * Convert datapoint to human readable string for info window when user
       * clicks on track data.
       *
       * @private
       * @param {Object} data A single chunk of which to format into a pretty
       * string.
       * @return {string} HTML string of data.
       */
      function dataToString(data) {
        const output = document.createElement('div');
        output.id = 'mapInfoWindow';
        const lapNum = document.createElement('a');
        lapNum.appendChild(document.createTextNode('Lap: #' + data['lap']));
        lapNum.style.color =
            (DataView.getSessionSummary().laps[data['lap'] - 1] || {
              color: '#000000',
            }).color;
        output.appendChild(lapNum);
        output.innerHTML += '<br>';
        output.appendChild(
            document.createTextNode(
                'G-Force: ' +
                Math.round(DataView.sensorsToGForce(data) / Agrav * 100.0) /
                    100.0 +
                'G'));
        output.innerHTML += '<br>';
        output.appendChild(
            document.createTextNode(
                'Speed: ' + TraX.Units.speedToUnit(data['estimatedSpeed']) +
                TraX.Units.getLargeSpeedUnit()));
        output.innerHTML += '<br>';
        output.appendChild(
            document.createTextNode(
                'Lap time: ' +
                TraX.Common.formatMsec(
                    data['clientTimestamp'] - data['sessionStart'] -
                        data['lapStart'],
                    false, 1)));
        if (currentEndIndex &&
            currentEndIndex < DataView.getSessionDataLength() - 1) {
          output.innerHTML += '<br>';
          output.appendChild(
              document.createTextNode(
                  'Lap total: ' +
                  TraX.Common.formatMsec(
                      DataView.getDataAtIndex(
                          currentEndIndex)['clientTimestamp'] -
                          data['sessionStart'] - data['lapStart'],
                      false, 1)));
        }
        output.innerHTML += '<br>';
        output.appendChild(
            document.createTextNode(
                'Session time: ' +
                TraX.Common.formatMsec(
                    data['clientTimestamp'] - data['sessionStart'], false, 1)));
        output.innerHTML += '<br>';

        return output.outerHTML;
      }
      /**
       * Show info window with more information at coordinates with information
       * from the point closest to the given coordinates.
       *
       * @private
       * @param {{lat: number, lng: number}} coord The coordinate of which to
       * find the data for to show.
       * @param {boolean} [zoomToFit=false] Zoom map to fit new data.
       */
      function showMessageWindow(coord, zoomToFit) {
        const startTime = DataView.getTimeAtIndex(currentStartIndex || 0) - 1;
        const data = DataView.getDataAtPosition(coord, startTime);
        const content = dataToString(data);
        infoWindow.setContent(content);
        infoWindow.setPosition(coord);
        if (!infoWindowOpen) infoWindow.open(mymap);
        infoWindowOpen = true;
        if (zoomToFit) mymap.panTo(coord);
      }
      /**
       * Show info window with more information at coordinates with information
       * from the index provided.
       *
       * @public
       * @param {number} index Index of sessionData to show the data for.
       * @param {boolean} [zoomToFit=false] Zoom map to fit new data.
       */
      MyMap.showMessageWindowIndex = function(index, zoomToFit) {
        const data = DataView.getDataAtIndex(index);
        const content = dataToString(data);
        infoWindow.setContent(content);
        infoWindow.setPosition(data.estimatedCoord);
        if (!infoWindowOpen) infoWindow.open(mymap);
        infoWindowOpen = true;
        Panes.gotoPane(3);
        if (zoomToFit) mymap.panTo(data.estimatedCoord);
      };
      /**
       * Show info window with more information at coordinates with information
       * from the number of milliseconds after session start.
       *
       * @public
       * @param {number} msecs Number of milliseconds since session start to
       * show data for.
       * @param {boolean} [zoomToFit=false] Zoom map to fit new data.
       */
      MyMap.showMessageWindowTime = function(msecs, zoomToFit) {
        const data = DataView.getDataAtTime(msecs);
        const content = dataToString(data);
        infoWindow.setContent(content);
        infoWindow.setPosition(data.estimatedCoord);
        if (!infoWindowOpen) infoWindow.open(mymap);
        infoWindowOpen = true;
        if (zoomToFit) mymap.panTo(data.estimatedCoord);
      };
      /**
       * Hide message window if user clicks off of it.
       *
       * @private
       */
      function hideMessageWindow() {
        if (infoWindowOpen) infoWindow.close();
        infoWindowOpen = false;
      }
      /**
       * Show marker denoting the center of the track.
       *
       * @public
       */
      function showTrackMarker() {
        if (trackMode != 'track') {
          if (DataView.trackData.track) {
            trackMarker.setVisible(true);
            trackMarker.setPosition(DataView.trackData.track.coord);
          }
        }
      }
      /**
       * Ensure all enabled track markers fit within visible map.
       *
       * @private
       */
      function fitTrackInMap() {
        showTrackMarker();
        const bounds = mymap.getBounds();
        if (trackMarker.getVisible() && bounds &&
            !bounds.contains(trackMarker.getPosition())) {
          mymap.setCenter(trackMarker.getPosition());
        }
      }
      /**
       * Show the map with data between start and end indexes: a and b.
       *
       * @public
       * @param {number} a Start index of sessionData to show.
       * @param {number} b End index of sessionData to show.
       */
      MyMap.showMap = function(a, b) {
        MyMap.updateMyMap(a, b);
        Panes.nextPane();
      };
      /**
       * Clear the polyline and hide it.
       *
       * @public
       */
      MyMap.resetPolyLine = function() {
        for (let i = 0; i < myPolyLines.length; i++) {
          myPolyLines[i].setVisible(false);
        }
        myPolyLines = [];
      };
      /**
       * Get coordinates from all data with gps data and add to array.
       *
       * @private
       * @param {Array} input Array of points to filter.
       * @return {Array} Array of filtered points.
       */
      function filterPoints(input) {
        const output = [];
        for (let i = 0; i < input.length; i++) {
          output.push(DataView.getFilteredCoords(input[i]).points);
        }
        return output;
      }
      /**
       * Get the color from the list at an index.
       *
       * @public
       * @param {number} index The index in the color list to get.
       * @return {string} Hex code of a color including leading `#`.
       */
      MyMap.getColor = function(index) {
        return colorList[index % colorList.length];
      };
      /**
       * Creates a new polyline with the given points.
       *
       * @private
       * @param {Array.<{lat: number, lng: number, color: string}>} points
       * Points to plot.
       */
      function addPolyLine(points) {
        const newPolyLine = new google.maps.Polyline(polyLineOpts);
        newPolyLine.setOptions(
            {path: points, strokeColor: points.color || '#000000'});
        newPolyLine.addListener('click', handleMapLineClicked);
        myPolyLines.push(newPolyLine);
      }
      /**
       * Updates all polylines to show data between start and end indexes.
       *
       * @private
       * @param {number} [startIndex] The first index of session data to show on
       * the map.
       * @param {number} [endIndex] The last index of session data to show on
       * the map.
       */
      function updatePolyLine(startIndex, endIndex) {
        if (typeof startIndex === 'undefined') startIndex = 0;
        if (typeof endIndex === 'undefined') {
          endIndex = DataView.getSessionDataLength();
        }
        MyMap.resetPolyLine();

        if (lineColorMode == 'laps') {
          const sessionSummary = DataView.getSessionSummary();
          const neglength = sessionSummary.laps.neglength;
          for (let i = neglength; i < sessionSummary.laps.length; i++) {
            if (sessionSummary.laps[i].startIndex < startIndex ||
                sessionSummary.laps[i].endIndex > endIndex) {
              continue;
            }
            const coordPoints = DataView.getDataWithCoords(
                sessionSummary.laps[i].startIndex,
                sessionSummary.laps[i].endIndex);
            const filteredPoints =
                filterPoints(DataView.getFilteredDurations(coordPoints));
            for (let j = 0; j < filteredPoints.length; j++) {
              if (j == 0 && sessionSummary.laps[i].color) {
                filteredPoints[j].color = sessionSummary.laps[i].color;
              }
              addPolyLine(filteredPoints[j]);
            }
          }
        } else if (lineColorMode == 'gforce') {
          const sessionSummary = DataView.getSessionSummary();
          const maxGForce = sessionSummary.maxGForce.val;
          for (let i = startIndex; i < endIndex - 1; i++) {
            const coordPoints = DataView.getDataWithCoords(i, undefined, 2);
            const filteredPoints =
                filterPoints(DataView.getFilteredDurations(coordPoints));
            for (let j = 0; j < filteredPoints.length; j++) {
              if (maxGForce != 0) {
                const thisGForce = DataView.sensorsToGForce(i) / Agrav;
                const colorVal =
                    Math.round(Math.pow(thisGForce / maxGForce, 0.5) * 255);
                const colorHex =
                    '#' + numToHex(colorVal) + '00' + numToHex(255 - colorVal);
                filteredPoints[j].color = colorHex;
              }
              addPolyLine(filteredPoints[j]);
            }
          }
        } else if (lineColorMode == 'altitude') {
          const sessionSummary = DataView.getSessionSummary();
          const maxHeight = sessionSummary.maxAltitude.val;
          const minHeight = sessionSummary.minAltitude.val;
          for (let i = startIndex; i < endIndex - 1; i++) {
            const coordPoints = DataView.getDataWithCoords(i, undefined, 2);
            const filteredPoints =
                filterPoints(DataView.getFilteredDurations(coordPoints));
            for (let j = 0; j < filteredPoints.length; j++) {
              if (filteredPoints[j].length > 0 && maxHeight != 0 &&
                  minHeight != 0) {
                const thisAltitude = filteredPoints[j][0]['alt'];
                const colorVal = Math.round(
                    Math.pow(
                        (thisAltitude - minHeight) / (maxHeight - minHeight),
                        0.5) *
                    255);
                const colorHex =
                    '#' + numToHex(colorVal) + '00' + numToHex(255 - colorVal);
                filteredPoints[j].color = colorHex;
              }
              addPolyLine(filteredPoints[j]);
            }
          }
        } else if (lineColorMode == 'speed') {
          const sessionSummary = DataView.getSessionSummary();
          const maxSpeed = sessionSummary.speeds.topSpeed.val;
          const minSpeed = sessionSummary.speeds.lowestSpeed.val;
          for (let i = startIndex; i < endIndex - 1; i++) {
            const coordPoints = DataView.getDataWithCoords(i, undefined, 2);
            const filteredPoints =
                filterPoints(DataView.getFilteredDurations(coordPoints));
            for (let j = 0; j < filteredPoints.length; j++) {
              if (filteredPoints[j].length > 0 && maxSpeed != 0) {
                const thisSpeed = filteredPoints[j][0]['spd'];
                const colorVal = Math.round(
                    Math.pow(
                        1 - ((thisSpeed - minSpeed) / (maxSpeed - minSpeed)),
                        0.5) *
                    255) || 0;
                const colorHex =
                    '#' + numToHex(colorVal) + '00' + numToHex(255 - colorVal);
                filteredPoints[j].color = colorHex;
              }
              addPolyLine(filteredPoints[j]);
            }
          }
        }
      }
      /**
       * Convert number to color hex. Rectifies between 0 and 255.
       *
       * @private
       * @param {number} num A number value from 0-255 to convert to hex.
       * @return {string} The number converted to hex including leading 0.
       */
      function numToHex(num) {
        if (num > 255) num = 255;
        if (num < 0) num = 0;
        const hex = num.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
      }
      /**
       * Change the setting for how the polyline gets colored. Can currently be
       * "laps", "gforce", "altitude", or "speed".
       *
       * @public
       * @param {string} mode The mode to set the line coloring.
       */
      MyMap.changeLineColorMode = function(mode) {
        lineColorMode = mode;
        MyMap.updateMyMap(currentStartIndex, currentEndIndex);
      };
      /** Update all markers and data shown on map to show data between start
       * and end index.
       *
       * @public
       * @param {number} [startIndex] The first index of session data to show on
       * the map.
       * @param {number} [endIndex] The last index of session data to show on
       * the map.
       */
      MyMap.updateMyMap = function(startIndex, endIndex) {
        if (!mymap) MyMap.handleOpening();
        currentStartIndex = startIndex;
        currentEndIndex = endIndex;
        MyMap.resetPolyLine();
        const pathPoints = DataView.getFilteredCoords(
            DataView.getDataWithCoords(startIndex, endIndex));
        const SWBound = pathPoints.SWBound;
        const NEBound = pathPoints.NEBound;
        if (!SWBound || !SWBound.lat || !SWBound.lng || !NEBound ||
            !NEBound.lat || !NEBound.lng) {
          if (!TraX.DataView.editTrackMode) {
            TraX.showMessageBox(
                'This session doesn\'t appear to have any gps data.');
          }
          if (mymap && mymap.getZoom() < 2) mymap.setZoom(2);
          return;
        }

        const bounds = new google.maps.LatLngBounds(SWBound, NEBound);

        // Color the line;
        updatePolyLine(startIndex, endIndex);
        showTrackMarker();

        const startLine = DataView.getStartLine();
        const finishLine = DataView.getFinishLine();
        if (startLine) {
          startMarker.setPosition(startLine.coord);
          startMarker.setVisible(true);
          myMapCircles[0].setMap(mymap);
          myMapCircles[0].setCenter(startLine.coord);
          if (!bounds.contains(startLine.coord)) bounds.extend(startLine.coord);
        }
        if (finishLine) {
          finishMarker.setPosition(finishLine.coord);
          finishMarker.setVisible(true);
          myMapCircles[1].setMap(mymap);
          myMapCircles[1].setCenter(finishLine.coord);
          if (!bounds.contains(finishLine.coord)) {
            bounds.extend(finishLine.coord);
          }
        }
        if (finishLine && startLine) {
          const startRadius = TraX.Units.coordToMeters(
              startLine.coord.lat, startLine.coord.lng,
              startLine.coord.lat + startLine.radius * Math.cos(Math.PI / 4.0),
              startLine.coord.lng + startLine.radius * Math.sin(Math.PI / 4.0));
          myMapCircles[0].setRadius(startRadius);
          const finishRadius = TraX.Units.coordToMeters(
              finishLine.coord.lat, finishLine.coord.lng, finishLine.coord.lat +
                  finishLine.radius * Math.cos(Math.PI / 4.0),
              finishLine.coord.lng +
                  finishLine.radius * Math.sin(Math.PI / 4.0));
          myMapCircles[1].setRadius(finishRadius);

          if (TraX.debugMode) {
            console.log(
                'Start Radius:', startRadius, 'Finish Radius:', finishRadius);
            console.log('Finished Map update for ', DataView.trackData);
          }
        } else {
          console.log('Start and finish unknown');
        }

        if (trackMode == 'none') {
          mymap.fitBounds(bounds);
          if (mymap.getZoom() > 18) mymap.setZoom(18);
        }

        playbackStartTime = DataView.getTimeAtIndex(startIndex || 0);
        playbackEndTime = DataView.getTimeAtIndex(
            endIndex || DataView.getSessionDataLength() - 1);
        playbackSliderDom.max = playbackEndTime;
        playbackSliderDom.min = playbackStartTime;
        if (playbackTime < playbackStartTime) playbackTime = playbackStartTime;
        if (playbackTime > playbackEndTime) playbackTime = playbackEndTime;
        playbackSliderDom.value = playbackTime;

        if (TraX.debugMode > 1) {
          console.log(
              'Playback:', playbackStartTime, '->', playbackEndTime, ':',
              playbackTime);
        }
      };

      /**
       * Show or hide playback slider and controls.
       *
       * @public
       * @param {?boolean} [force=undefined] Set state or toggle with undefined.
       */
      MyMap.togglePlaybackOverlay = function(force) {
        if (typeof force === 'undefined') {
          force = mapSliderOverlayDom.style.display != 'block';
        }
        if (force) {
          hideOverlay();
          mapSliderOverlayDom.style.display = 'block';
          colorOverlayDom.style.display = 'none';
        } else {
          hideOverlay();
        }
      };
      /**
       * Start or stop playing data on map.
       *
       * @public
       * @param {?boolean} [force=undefined] Set state or toggle with undefined.
       */
      MyMap.togglePlayback = function(force) {
        if (typeof force !== 'undefined') {
          currentlyPlaying = force;
        } else {
          currentlyPlaying = !currentlyPlaying;
        }
        if (currentlyPlaying) {
          playbackInterval =
              setInterval(refreshPlaybackData, playbackFrequency);
          togglePlaybackButton.innerHTML = pauseChar;
          if (TraX.debugMode > 1) {
            console.log(
                'Starting:', playbackStartTime, '->', playbackEndTime, ':',
                playbackTime);
          }
        } else {
          clearInterval(playbackInterval);
          togglePlaybackButton.innerHTML = playChar;
          if (TraX.debugMode > 1) {
            console.log(
                'Stopping:', playbackStartTime, '->', playbackEndTime, ':',
                playbackTime);
          }
        }
      };
      /**
       * Updates visible data on playback map.
       *
       * @private
       * @param {boolean} skipIncrement Skip incrementing playbackTime by the
       * playback frequency.
       */
      function refreshPlaybackData(skipIncrement) {
        if (typeof playbackTime !== 'number') {
          playbackTime = Number(playbackTime);
        }
        if (!skipIncrement) playbackTime += playbackFrequency;
        if (playbackTime >= playbackEndTime) {
          playbackTime = playbackEndTime;
          if (currentlyPlaying) MyMap.togglePlayback(false);
          return;
        }
        MyMap.showMessageWindowTime(playbackTime, true);
        if (!skipIncrement) playbackSliderDom.value = playbackTime;
      }
    }(window.TraX.DataView.MyMap = window.TraX.DataView.MyMap || {}));
  }(window.TraX.DataView = window.TraX.DataView || {}));
}(window.TraX = window.TraX || {}));
