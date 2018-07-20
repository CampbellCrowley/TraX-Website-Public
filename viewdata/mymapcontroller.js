// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
(function(DataView, undefined) {
(function(MyMap, undefined) {

// Default options for a polyline on the map.
var polyLineOpts = {
  strokeColor: '#000000',
  strokeWeight: 5,
  clickable: true,
  editable: false
};
// List of possible colors the polyline can be.
const colorList = [
  "#000000", "#0000FF", "#00FF00", "#FF0000", "#FF00FF", "#FF8800", "#00FFFF",
  "#88FF00", "#888888", "#FF8888", "#880000", "#000088"
];

// Pause and play characters to show on playback toggle button.
const playChar = "&#9658;";
const pauseChar = "&#10074;&#10074;";
// DOM Elements.
var overlayDom, overlayButtonsDom, mapConfigButtonsDom, overlayTextInputDom,
    overlayTrackNameInput, overlayConfigNameInput, colorOverlayDom,
    mapSliderOverlayDom, playbackSliderDom, playbackToggleButton,
    mapSearchInputDom;

// Map markers and other items.
var myMapCircles = [], startMarker, finishMarker, placedStartMarker,
    placedFinishMarker, startImg, finishImg, trackMarker, trackDoneButton,
    configDoneButton, myPolyLines = [], infoWindow;

// Current start and end index of visible data on map.
var currentStartIndex, currentEndIndex;

// Are we currently playing back data?
var currentlyPlaying = false;
// The interval refreshing visible data.
var playbackInterval;
// The frequency in milliseconds to refresh visible data.
const playbackFrequency = 48;
// The current time in milliseconds after session start shown on map.
var playbackTime = 0;
// The number of milliseconds after session start that the current playback data
// starts.
var playbackStartTime = 0;
// The number of milliseconds after session start that the current playback data
// ends.
var playbackEndTime = 0;

// Current mode for dropping points onto map for choosing start and finish. Can
// be "none", "start", "finish", or "center".
var pointMode = "none";
// Current mode for which data is being edited. Can be "none", "track", or
// "config".
var trackMode = "none";
// Current mode whether we are editing or creating a new track or config. Can be
// "create", or "edit".
var editMode = "create";

// TODO: Change this to data key to allow coloring of any data.
// The current way the polyline is being colored.
var lineColorMode = "laps";

var infoWindowOpen = false;

// Initialize
MyMap.init = function() {
  overlayDom = document.getElementById("mymapOverlay");
  mapTrackButtonsDom = document.getElementById("mapTrackButtons");
  mapConfigButtonsDom = document.getElementById("mapOverlayButtons");
  overlayTextInputDom = document.getElementById("mapOverlayTextInput");
  overlayTrackNameInput = document.getElementById("mapOverlayTrackName");
  overlayConfigNameInput = document.getElementById("mapOverlayConfigName");
  trackDoneButton = document.getElementById("donePlacingTrack");
  trackNoneButton = document.getElementById("cancelPlaceTrack");
  configDoneButton = document.getElementById("donePlacing");
  colorOverlayDom = document.getElementById("mapColorButtons");
  mapSliderOverlayDom = document.getElementById("mapSliderOverlay");
  playbackSliderDom = document.getElementById("playbackSlider");
  playbackToggleButton = document.getElementById("togglePlaybackButton");
  mapSearchInputDom = document.getElementById("mapSearchOverlay");

  // All buttons that may overlay the map.
  overlayButtonsDom = document.getElementsByClassName("overlayButton");

  // Default color choosing overlay to visible.
  colorOverlayDom.style.display = "block";

  // Initialize markers for editing track data..
  placedStartMarker =
      new google.maps.Marker({label: "S", map: mymap, draggable: true});
  placedFinishMarker =
      new google.maps.Marker({label: "F", map: mymap, draggable: true});
  trackMarker = new google.maps.Marker({label: "T", map: mymap});
  placedStartMarker.setVisible(false);
  placedFinishMarker.setVisible(false);
  placedStartMarker.addListener('drag', handleMarkerDragged);
  placedFinishMarker.addListener('drag', handleMarkerDragged);
  trackMarker.setVisible(false);
  placedStartMarker.addListener('click', handleMapMarkerClicked);
  placedFinishMarker.addListener('click', handleMapMarkerClicked);
  trackMarker.addListener('click', handleMapMarkerClicked);

  Panes.addEventListener(
      'changePane', function(data) { MyMap.togglePlayback(false); });

  playbackSliderDom.oninput = function() {
    if (currentlyPlaying) MyMap.togglePlayback(false);
    playbackTime = playbackSliderDom.value;
    refreshPlaybackData(true);
  };

  // Initialize markers for start and finish line.
  startImg = {
    url: "https://dev.campbellcrowley.com/trax/images/greenFlag.png",
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(2, 30),
    scaledSize: new google.maps.Size(32, 32)
  };
  finishImg = {
    url: "https://dev.campbellcrowley.com/trax/images/checkeredFlag.png",
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 30),
    scaledSize: new google.maps.Size(32, 32)
  };
  startMarker = new google.maps.Marker({
    map: mymap,
    position: {lat: 0, lng: 0},
    icon: startImg,
    title: "Start Line"
  });
  startMarker.addListener('click', handleMapMarkerClicked);
  finishMarker = new google.maps.Marker({
    map: mymap,
    position: {lat: 0, lng: 0},
    icon: finishImg,
    title: "Finish Line"
  });
  finishMarker.addListener('click', handleMapMarkerClicked);

  // Initialize circles for start/finish thresholds.
  myMapCircles.push(new google.maps.Circle({
    map: mymap,
    fillColor: '#00FF00',
    strokeColor: '#00FF00',
    center: {lat: 0, lng: 0},
    radius: 100
  }));
  myMapCircles.push(new google.maps.Circle({
    map: mymap,
    fillColor: '#FF0000',
    strokeColor: '#FF0000',
    center: {lat: 0, lng: 0},
    radius: 100
  }));
  // Initialize info window for clicking on the track data.
  infoWindow = new google.maps.InfoWindow({
    content: "Something else should be here...",
    position: {lat: 0, lng: 0}
  });

  // Setup listeners for buttons to be able to update UI to show selected
  // button.
  for (var i = 0; i < overlayButtonsDom.length; i++) {
    overlayButtonsDom[i].addEventListener('click', overlayButtonClicked);
  }

  // Add listener to know when where map is clicked.
  mymap.addListener('click', handleMapClicked);
  // Show polyline on map;
  polyLineOpts.map = mymap;
};

// Data view is openeing, and map may be visible now.
MyMap.handleOpening = function() { resetSelectedButtons(); };
// Data view is closing, and map is not visible anymore.
MyMap.handleClosing = function() { MyMap.togglePlayback(false); };

// Add track selected from track list.
MyMap.handleClickAddTrack = function() {
  MyMap.updateMyMap();
  Panes.nextPane();
  resetSelectedButtons(trackNoneButton);

  overlayTrackNameInput.value = "";
  overlayConfigNameInput.value = "";
  overlayTrackNameInput.disabled = false;
  overlayConfigNameInput.disabled = true;
  trackDoneButton.disabled = true;

  // console.log("Adding new track with coords: ", DataView.coordAverage.coord);
  trackMarker.setPosition(DataView.coordAverage.coord);

  showOverlay(true);
  trackMarker.setVisible(false);
  trackMode = "track";
  editMode = "create";
};
MyMap.handleClickEditTrack = function() {
  console.log("Edit track clicked!");
  MyMap.handleClickAddTrack();
  if (!DataView.trackData.track.coord) {
    setTimeout(function() {
      trackMarker.setPosition(DataView.trackData.track.coord)
    }, 500);
  } else {
    trackMarker.setPosition(DataView.trackData.track.coord);
  }
  trackMarker.setVisible(true);
  overlayTrackNameInput.value =
      DataView.trackData.track.name.replace('You: ', '');
  trackDoneButton.disabled = false;
  editMode = "edit";
}
// Add config selected from config list.
MyMap.handleClickAddConfig = function() {
  if (DataView.trackData.track.ownerId != TraX.getDriverId()) {
    TraX.showMessageBox(
        "Adding configs for other user's tracks doesn't work yet.");
    return;
  }
  MyMap.updateMyMap();
  Panes.nextPane();
  resetSelectedButtons();
  showOverlay();
  if (DataView.trackData.track) {
    overlayTrackNameInput.value = DataView.trackData.track.name;
  } else {
    overlayTrackNameInput.value = "";
  }
  overlayTrackNameInput.disabled = true;
  overlayConfigNameInput.disabled = false;
  overlayConfigNameInput.value = "";
  configDoneButton.disabled = false;
  fitTrackInMap();
  trackMode = "config";
  editMode = "create";
};
MyMap.handleClickEditConfig = function() {
  MyMap.handleClickAddConfig();
  overlayConfigNameInput.value = DataView.trackData.config.name;
  placedStartMarker.setPosition(DataView.trackData.config.start.coord);
  placedStartMarker.setVisible(true);
  placedFinishMarker.setPosition(DataView.trackData.config.finish.coord);
  placedFinishMarker.setVisible(true);
  editMode = "edit";
}
// Select no tool for placing.
MyMap.handleClickEndPlace = function() { pointMode = "none"; };
// Select place start line.
MyMap.handleClickPlaceStart = function() { pointMode = "start"; };
// Select place finish line.
MyMap.handleClickPlaceFinish = function() { pointMode = "finish"; };
// Select place track center.
MyMap.handleClickPlaceTrackCenter = function() { pointMode = "center"; };

// User has finished naming new track or config and placing markers.
MyMap.handleClickSubmitMapNames = function() {
  if (!overlayTrackNameInput.value && trackMode == "track") return;
  if (!overlayConfigNameInput.value && trackMode == "config") return;
  Panes.previousPane();
  resetSelectedButtons();

  console.log("Requesting new", trackMode);
  if (trackMode == "track") {
    var trackName = overlayTrackNameInput.value;

    if (editMode == "create") {
      TraX.socket.emit('newtrack', trackName, trackMarker.getPosition());
    } else if (editMode == "edit") {
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
      var pos = placedStartMarker.getPosition();
      DataView.trackData.config.start.coord = {lat: pos.lat(), lng: pos.lng()};
      DataView.trackData.config.start.radius = 0.0004;
    }
    if (placedFinishMarker.getVisible()) {
      var pos = placedFinishMarker.getPosition();
      DataView.trackData.config.finish.coord = {lat: pos.lat(), lng: pos.lng()};
      DataView.trackData.config.finish.radius = 0.0004;
    }
    var configName = overlayConfigNameInput.value;
    if (editMode == "create") {
      TraX.socket.emit(
          'newconfig', DataView.trackData.track.id,
          DataView.trackData.track.name, configName,
          DataView.trackData.config.start, DataView.trackData.config.finish,
          []);
    } else if (editMode == 'edit') {
      TraX.socket.emit(
          'editconfig', DataView.trackData.track.id,
          DataView.trackData.track.name, configName,
          DataView.trackData.config.start, DataView.trackData.config.finish, [],
          DataView.trackData.config.id);
    }
    setTimeout(DataView.fetchTrackConfigList, 500);
    setTimeout(TraX.requestFilesize, 1000);
  }

  overlayTrackNameInput.value = "";
  overlayConfigNameInput.value = "";

  trackMode = "none";

  DataView.updateSessionData();
  hideOverlay();
};
// User back while naming, show marker selection again.
MyMap.handleClickBackMapNames = function() {
  if (trackMode == "track") {
    MyMap.handleClickCancelPlacing();
    return;
  }
  if (trackMode == "config") {
    resetSelectedButtons();
    mapConfigButtonsDom.style.display = "block";
  } else if (trackMode == "track") {
    resetSelectedButtons(trackNoneButton);
    mapTrackButtonsDom.style.display = "block";
  }
  overlayTextInputDom.style.display = "none";
};
// User is done placing markers and is ready to name track or config.
MyMap.handleClickDonePlacing = function() {
  if (trackMode == "config") {
    if(!placedStartMarker.getVisible() || !placedFinishMarker.getVisible()) {
      TraX.showMessageBox(
          "Both start and finish lines must be placed. They can be in the same place.");
      return;
    }
  } else if (trackMode == "track") {
    if (!trackMarker.getVisible()) {
      TraX.showMessageBox(
          "The center of the track should be marked before continuing.");
      return;
    }
  }
  pointMode = "none";
  mapConfigButtonsDom.style.display = "none";
  mapTrackButtonsDom.style.display = "none";
  overlayTextInputDom.style.display = "block";
};
// User aborted adding track or config.
MyMap.handleClickCancelPlacing = function() {
  trackMode = "none";
  hideOverlay();
  resetSelectedButtons();
  Panes.previousPane();
};
// If any map overlay button is clicked, show it as the only selected button.
function overlayButtonClicked(event) {
  resetSelectedButtons(event.target);
}
// Pass coordinate where map was clicked to handler.
function handleMapClicked(event) {
  if (TraX.debugMode)
    console.log(
        "Map Clicked: Lat: ", event.latLng.lat(), "Lng:", event.latLng.lng());

  handleMapClickCoord(
      {lat: event.latLng.lat(), lng: event.latLng.lng()}, false);
}
function handleMarkerDragged(event) {
  var coord = {lat: event.latLng.lat(), lng: event.latLng.lng()};
  if (TraX.debugMode > 1)
    console.log(
        "Marker Dragged: Lat: ", event.latLng.lat(), "Lng:",
        event.latLng.lng());

  var distToTrack =
      TraX.Units.latLngToMeters(coord, DataView.trackData.track.coord);
  myMapCircles[0].setCenter(placedStartMarker.getPosition());
  myMapCircles[1].setCenter(placedFinishMarker.getPosition());
}
// Pass coordinate where polyline was clicked to handler.
function handleMapLineClicked(event) {
  if (TraX.debugMode)
    console.log(
        "PolyLine Clicked: Lat: ", event.latLng.lat(), "Lng:",
        event.latLng.lng());
  handleMapClickCoord({lat: event.latLng.lat(), lng: event.latLng.lng()}, true);
}
// Pass coordinate where marker was clicked to handler.
function handleMapMarkerClicked(event) {
  if (TraX.debugMode)
    console.log(
        "PolyLine Clicked: Lat: ", event.latLng.lat(), "Lng:",
        event.latLng.lng());
  handleMapClickCoord({lat: event.latLng.lat(), lng: event.latLng.lng()}, true);
}
// Handle some element on the map being clicked at coord. wasMarker is true for
// anything other than the map itself.
function handleMapClickCoord(coord, wasMarker) {
  if (trackMode == "config") {
    var distToTrack =
        TraX.Units.latLngToMeters(coord, DataView.trackData.track.coord);
    if (distToTrack > 10 * 1000) {
      console.log(
          coord, "is", distToTrack, "meters from",
          DataView.trackData.track.coord, "(", DataView.trackData.track, ")");
      TraX.showMessageBox("That point is too far from the track.");
      return;
    }
    if (pointMode == "start") {
      placedStartMarker.setPosition(coord);
      placedStartMarker.setVisible(true);
      if (placedFinishMarker.getVisible()) {
        configDoneButton.disabled = false;
      }
      myMapCircles[0].setMap(mymap);
      myMapCircles[0].setCenter(coord);
    } else if (pointMode == "finish") {
      placedFinishMarker.setPosition(coord);
      placedFinishMarker.setVisible(true);
      if (placedStartMarker.getVisible() ){
        configDoneButton.disabled = false;
      }
      myMapCircles[1].setMap(mymap);
      myMapCircles[1].setCenter(coord);
    }
  } else if (trackMode == "track") {
    if (pointMode == "center") {
      trackMarker.setPosition(coord);
      trackMarker.setVisible(true);
      trackDoneButton.disabled = false;
    }
  } else if (wasMarker && trackMode == "none") {
    showMessageWindow(coord);
  } else {
    hideMessageWindow();
  }
}
// Hide all overlays and re-show default view.
function hideOverlay() {
  placedStartMarker.setVisible(false);
  placedFinishMarker.setVisible(false);
  trackMarker.setVisible(false);
  overlayDom.style.display = "none";
  mapConfigButtonsDom.style.display = "none";
  mapTrackButtonsDom.style.display = "none";
  overlayTextInputDom.style.display = "none";
  colorOverlayDom.style.display = "block";
  mapSliderOverlayDom.style.display = "none";
}
// Show overlay for editing track or config.
function showOverlay(addingTrack) {
  hideMessageWindow();
  placedStartMarker.setVisible(false);
  placedFinishMarker.setVisible(false);
  overlayDom.style.display = "block";
  if (addingTrack) {
    mapConfigButtonsDom.style.display = "none";
    mapTrackButtonsDom.style.display = "block";
  } else {
    mapConfigButtonsDom.style.display = "block";
    mapTrackButtonsDom.style.display = "none";
  }
  overlayTextInputDom.style.display = "none";
  colorOverlayDom.style.display = "none";
  mapSliderOverlayDom.style.display = "none";
}
// Reset all buttons to not selected, then show currently selected button as
// such.
function resetSelectedButtons(addTarget) {
  for (var i = 0; i < overlayButtonsDom.length; i++) {
    overlayButtonsDom[i].classList.remove('selected');
  }
  if (addTarget) {
    addTarget.classList.add('selected');
  } else {
    overlayButtonsDom[0].classList.add('selected');
    pointMode = "none";
  }
}
// Convert datapoint to human readable string for info window when user clicks
// on track data.
function dataToString(data) {
  var output = document.createElement("div");
  var lapNum = document.createElement("a");
  lapNum.appendChild(document.createTextNode("Lap: #" + data["lap"]));
  lapNum.style.color = (DataView.getSessionSummary().laps[data["lap"] - 1] || {
                         color: "#000000"
                       }).color;
  output.appendChild(lapNum);
  output.innerHTML += "<br>";
  output.appendChild(
      document.createTextNode(
          "G-Force: " +
          Math.round(DataView.sensorsToGForce(data) / Agrav * 100.0) / 100.0 +
          "G"));
  output.innerHTML += "<br>";
  output.appendChild(
      document.createTextNode(
          "Speed: " + TraX.Units.speedToLargeUnit(data["estimatedSpeed"]) +
          TraX.Units.getLargeSpeedUnit()));
  output.innerHTML += "<br>";
  output.appendChild(
      document.createTextNode(
          "Lap time: " +
          TraX.Common.formatMsec(
              data["clientTimestamp"] - data["sessionStart"] - data["lapStart"],
              false, 1)));
  if (currentEndIndex &&
      currentEndIndex < DataView.getSessionDataLength() - 1) {
    output.innerHTML += "<br>";
    output.appendChild(
        document.createTextNode(
            "Lap total: " +
            TraX.Common.formatMsec(
                DataView.getDataAtIndex(currentEndIndex)["clientTimestamp"] -
                    data["sessionStart"] - data["lapStart"],
                false, 1)));
  }
  output.innerHTML += "<br>";
  output.appendChild(
      document.createTextNode(
          "Session time: " +
          TraX.Common.formatMsec(
              data["clientTimestamp"] - data["sessionStart"], false, 1)));
  output.innerHTML += "<br>";

  return output
      .outerHTML /*+ JSON.stringify(data, null, 2).replaceAll("\n", "<br>")*/;
}
// Show info window with more information at coordinates with information from
// the point closest to the given coordinates.
function showMessageWindow(coord, zoomToFit) {
  var startTime = DataView.getTimeAtIndex(currentStartIndex || 0) - 1;
  var data = DataView.getDataAtPosition(coord, startTime);
  var content = dataToString(data);
  infoWindow.setContent(content);
  infoWindow.setPosition(coord);
  if (!infoWindowOpen) infoWindow.open(mymap);
  infoWindowOpen = true;
  if (zoomToFit) mymap.panTo(coord);
}
// Show info window with more information at coordinates with information from
// the index provided.
MyMap.showMessageWindowIndex = function(index, zoomToFit) {
  var data = DataView.getDataAtIndex(index);
  var content = dataToString(data);
  infoWindow.setContent(content);
  infoWindow.setPosition(data.estimatedCoord);
  if (!infoWindowOpen) infoWindow.open(mymap);
  infoWindowOpen = true;
  Panes.gotoPane(3);
  if (zoomToFit) mymap.panTo(data.estimatedCoord);
};
// Show info window with more information at coordinates with information from
// the number of milliseconds after session start.
MyMap.showMessageWindowTime = function(msecs, zoomToFit) {
  var data = DataView.getDataAtTime(msecs);
  var content = dataToString(data);
  infoWindow.setContent(content);
  infoWindow.setPosition(data.estimatedCoord);
  if (!infoWindowOpen) infoWindow.open(mymap);
  infoWindowOpen = true;
  if (zoomToFit) mymap.panTo(data.estimatedCoord);
};
// Hide message window if user clicks off of it.
function hideMessageWindow() {
  if (infoWindowOpen) infoWindow.close();
  infoWindowOpen = false;
}
// Show marker denoting the center of the track.
function showTrackMarker() {
  if (trackMode != "track") {
    if (DataView.trackData.track) {
      trackMarker.setVisible(true);
      trackMarker.setPosition(DataView.trackData.track.coord);
    }
  }
}
// Ensure all enabled track markers fit within visible map.
function fitTrackInMap() {
  showTrackMarker();
  if (trackMarker.getVisible() &&
      !mymap.getBounds().contains(trackMarker.getPosition())) {
    mymap.setCenter(trackMarker.getPosition());
  }
}
// Show the map with data between start and end indexes: a and b.
MyMap.showMap = function(a, b) {
  MyMap.updateMyMap(a, b);
  Panes.nextPane();
};
// Clear the polyline and hide it.
MyMap.resetPolyLine = function() {
  for (var i = 0; i < myPolyLines.length; i++) {
    myPolyLines[i].setVisible(false);
  }
  myPolyLines = [];
};
// Get coordinates from all data with gps data and add to array.
function filterPoints(input) {
  var output = [];
  for (var i = 0; i < input.length; i++) {
    output.push(DataView.getFilteredCoords(input[i]).points);
  }
  return output;
}
// Get the color from the list at an index.
MyMap.getColor = function(index) {
  return colorList[index % colorList.length];
};
// Creates a new polyline with the given points.
function addPolyLine(points) {
  var newPolyLine = new google.maps.Polyline(polyLineOpts);
  newPolyLine.setOptions(
      {path: points, strokeColor: points.color || "#000000"});
  newPolyLine.addListener('click', handleMapLineClicked);
  myPolyLines.push(newPolyLine);
}
// Updates all polylines to show data between start and end indexes.
function updatePolyLine(startIndex, endIndex) {
  if (typeof startIndex === 'undefined') startIndex = 0;
  if (typeof endIndex === 'undefined')
    endIndex = DataView.getSessionDataLength();
  MyMap.resetPolyLine();

  if (lineColorMode == "laps") {
    var sessionSummary = DataView.getSessionSummary();
    var neglength = sessionSummary.laps.neglength;
    for (var i = neglength; i < sessionSummary.laps.length; i++) {
      if (sessionSummary.laps[i].startIndex < startIndex ||
          sessionSummary.laps[i].endIndex > endIndex) {
        continue;
      }
      var coordPoints = DataView.getDataWithCoords(
          sessionSummary.laps[i].startIndex, sessionSummary.laps[i].endIndex);
      var filteredPoints =
          filterPoints(DataView.getFilteredDurations(coordPoints));
      for (var j = 0; j < filteredPoints.length; j++) {
        if (j == 0 && sessionSummary.laps[i].color) {
          filteredPoints[j].color = sessionSummary.laps[i].color;
        }
        addPolyLine(filteredPoints[j]);
      }
    }
  } else if (lineColorMode == "gforce") {
    var sessionSummary = DataView.getSessionSummary();
    var maxGForce = sessionSummary.maxGForce.val;
    for (var i = startIndex; i < endIndex - 1; i++) {
      var coordPoints = DataView.getDataWithCoords(i, undefined, 2);
      var filteredPoints =
          filterPoints(DataView.getFilteredDurations(coordPoints));
      for (var j = 0; j < filteredPoints.length; j++) {
        if (maxGForce != 0) {
          var thisGForce = DataView.sensorsToGForce(i) / Agrav;
          var colorVal = Math.round(Math.pow(thisGForce / maxGForce, 0.5) * 255);
          var colorHex =
              "#" + numToHex(colorVal) + "00" + numToHex(255 - colorVal);
          filteredPoints[j].color = colorHex;
        }
        addPolyLine(filteredPoints[j]);
      }
    }
  } else if (lineColorMode == "altitude") {
    var sessionSummary = DataView.getSessionSummary();
    var maxHeight = sessionSummary.maxAltitude.val;
    var minHeight = sessionSummary.minAltitude.val;
    for (var i = startIndex; i < endIndex - 1; i++) {
      var coordPoints = DataView.getDataWithCoords(i, undefined, 2);
      var filteredPoints =
          filterPoints(DataView.getFilteredDurations(coordPoints));
      for (var j = 0; j < filteredPoints.length; j++) {
        if (filteredPoints[j].length > 0 && maxHeight != 0 && minHeight != 0) {
          var thisAltitude = filteredPoints[j][0]["alt"];
          var colorVal = Math.round(
              Math.pow(
                  (thisAltitude - minHeight) / (maxHeight - minHeight), 0.5) *
              255);
          var colorHex =
              "#" + numToHex(colorVal) + "00" + numToHex(255 - colorVal);
          filteredPoints[j].color = colorHex;
        }
        addPolyLine(filteredPoints[j]);
      }
    }
  } else if (lineColorMode == "speed") {
    var sessionSummary = DataView.getSessionSummary();
    var maxSpeed = sessionSummary.speeds.topSpeed.val;
    var minSpeed = sessionSummary.speeds.lowestSpeed.val;
    for (var i = startIndex; i < endIndex - 1; i++) {
      var coordPoints = DataView.getDataWithCoords(i, undefined, 2);
      var filteredPoints =
          filterPoints(DataView.getFilteredDurations(coordPoints));
      for (var j = 0; j < filteredPoints.length; j++) {
        if (filteredPoints[j].length > 0 && maxSpeed != 0) {
          var thisSpeed = filteredPoints[j][0]["spd"];
          var colorVal =
              Math.round(
                  Math.pow(
                      1 - ((thisSpeed - minSpeed) / (maxSpeed - minSpeed)),
                      0.5) *
                  255) ||
              0;
          var colorHex =
              "#" + numToHex(colorVal) + "00" + numToHex(255 - colorVal);
          filteredPoints[j].color = colorHex;
        }
        addPolyLine(filteredPoints[j]);
      }
    }
  }
}
// Convert number to color hex. Rectifies between 0 and 255.
function numToHex(num) {
  if (num > 255) num = 255;
  if (num < 0) num = 0;
  var hex = num.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
// Change the setting for how the polyline gets colored. Can currently be
// "laps", "gforce", "altitude", or "speed".
MyMap.changeLineColorMode = function(mode) {
  lineColorMode = mode;
  MyMap.updateMyMap(currentStartIndex, currentEndIndex);
};
// Update all markers and data shown on map to show data between start and end
// index.
MyMap.updateMyMap = function(startIndex, endIndex) {
  currentStartIndex = startIndex;
  currentEndIndex = endIndex;
  MyMap.resetPolyLine();
  var pathPoints = DataView.getFilteredCoords(
      DataView.getDataWithCoords(startIndex, endIndex));
  var SWBound = pathPoints.SWBound;
  var NEBound = pathPoints.NEBound;
  if (!SWBound || !SWBound.lat || !SWBound.lng || !NEBound || !NEBound.lat ||
      !NEBound.lng) {
    if (!TraX.DataView.editTrackMode)
      TraX.showMessageBox("This session doesn't appear to have any gps data.");
    if (mymap.getZoom() < 2) mymap.setZoom(2);
    return;
  }

  var bounds = new google.maps.LatLngBounds(SWBound, NEBound);

  // Color the line;
  updatePolyLine(startIndex, endIndex);
  showTrackMarker();

  var markers = [];
  var startLine = DataView.getStartLine();
  var finishLine = DataView.getFinishLine();
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
    if (!bounds.contains(finishLine.coord)) bounds.extend(finishLine.coord);
  }
  if (finishLine && startLine) {
    var startRadius = TraX.Units.coordToMeters(
        startLine.coord.lat, startLine.coord.lng,
        startLine.coord.lat + startLine.radius * Math.cos(Math.PI / 4.0),
        startLine.coord.lng + startLine.radius * Math.sin(Math.PI / 4.0));
    myMapCircles[0].setRadius(startRadius);
    var finishRadius = TraX.Units.coordToMeters(
        finishLine.coord.lat, finishLine.coord.lng,
        finishLine.coord.lat + finishLine.radius * Math.cos(Math.PI / 4.0),
        finishLine.coord.lng + finishLine.radius * Math.sin(Math.PI / 4.0));
    myMapCircles[1].setRadius(finishRadius);

    if (TraX.debugMode) {
      console.log("Start Radius:", startRadius, "Finish Radius:", finishRadius);
      console.log("Finished Map update for ", DataView.trackData);
    }
  } else {
    console.log("Start and finish unknown");
  }

  if (trackMode == "none") {
    mymap.fitBounds(bounds);
    if (mymap.getZoom() > 18) mymap.setZoom(18);
  }

  playbackStartTime = DataView.getTimeAtIndex(startIndex || 0);
  playbackEndTime =
      DataView.getTimeAtIndex(endIndex || DataView.getSessionDataLength() - 1);
  playbackSliderDom.max = playbackEndTime;
  playbackSliderDom.min = playbackStartTime;
  if (playbackTime < playbackStartTime) playbackTime = playbackStartTime;
  if (playbackTime > playbackEndTime) playbackTime = playbackEndTime;
  playbackSliderDom.value = playbackTime;

  if (TraX.debugMode > 1)
    console.log(
        "Playback:", playbackStartTime, "->", playbackEndTime, ":",
        playbackTime);
};

// Show or hide playback slider and controls.
MyMap.togglePlaybackOverlay = function(force) {
  if (typeof force === 'undefined') {
    force = mapSliderOverlayDom.style.display != "block";
  }
  if (force) {
    hideOverlay();
    mapSliderOverlayDom.style.display = "block";
    colorOverlayDom.style.display = "none";
  } else {
    hideOverlay();
  }
};
// Start or stop playing data on map.
MyMap.togglePlayback = function(force) {
  if (typeof force !== 'undefined') {
    currentlyPlaying = force;
  } else {
    currentlyPlaying = !currentlyPlaying;
  }
  if (currentlyPlaying) {
    playbackInterval = setInterval(refreshPlaybackData, playbackFrequency);
    togglePlaybackButton.innerHTML = pauseChar;
    if (TraX.debugMode > 1)
      console.log(
          "Starting:", playbackStartTime, "->", playbackEndTime, ":",
          playbackTime);
  } else {
    clearInterval(playbackInterval);
    togglePlaybackButton.innerHTML = playChar;
    if (TraX.debugMode > 1)
      console.log(
          "Stopping:", playbackStartTime, "->", playbackEndTime, ":",
          playbackTime);
  }
};
// Updates visible data on playback map.
function refreshPlaybackData(skipIncrement) {
  if (typeof playbackTime !== 'number') playbackTime = Number(playbackTime);
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
