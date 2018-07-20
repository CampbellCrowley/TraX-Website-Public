// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
(function(Live, undefined) {

// Constants //
// milliseconds to check for stale data.
const purgeFrequency = 1000;
// Maximum number of milliseconds without new data until data is deleted for a
// user.
const maxDataAge = 60000;
// After this much time without new data for a user, the data is considered
// stale.
const staleDelay = 5000;
// Milliseconds to update the driver list table.
const listUpdateFrequency = 51;
// Milliseconds to check for number of viewers.
const viewerUpdateFrequency = 15000;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const listCols = ["label", "name", "speed", "lapTimeExt", "bestLapTime"];
const standingsCols = ["rank", "bestLapTime", "name", "predLapTime"];

const notifTitle = "TraX";
const notifOpts = {
  body: "Notification body!",
  icon: "https://dev.campbellcrowley.com/favicon.ico"
};

// Default options for a polyline on the map.
var polyLineOpts = {
  strokeColor: '#000000',
  strokeWeight: 5,
  clickable: false,
  editable: false,
  map: map
};
var polyline = new google.maps.Polyline(polyLineOpts);

// DOM Elements
var driverStandingsDom, driverListDom, realtimeLongitudeDoms,
    realtimeLatitudeDoms, realtimeAltitudeDoms, realtimeSpeedDoms,
    realtimeGForceDoms, realtimeHeadingDoms, realtimeDeviceClockDoms,
    realtimeGPSClockDoms, realtimeDeviceTypeDoms, realtimeDeviceBrowserDoms,
    overlayDom, lapTimerDom, lapNumberDom, lapPredictedTimeDom,
    lapPredictedSplitSessionDom, lapPredictedSplitEverDom, viewerNumDom,
    viewerNumParentDom, simpleSensorViewDom, fullSensorViewDom,
    showMoreSensorsDom, showLessSensorsDom;
TraX.unitDropdownDom = {};
TraX.unitDropdownDom.value = "imperial";

// Buffered data.
var friendsData = {length: 0};
var friendStandings = [];
var friendMarkers = [];

var nextLabelIndex = 0;
var selectedId = "";

var viewerNumUpdateInterval;

var lastSummaryRequestTime = 0;

// Initialize
Live.init = function() {
  driverStandingsDom = document.getElementById("driverStandings");
  driverListDom = document.getElementById("driverList");
  realtimeLongitudeDoms = document.getElementsByClassName("realtimeLongitude");
  realtimeLatitudeDoms = document.getElementsByClassName("realtimeLatitude");
  realtimeAltitudeDoms = document.getElementsByClassName("realtimeAltitude");
  realtimeSpeedDoms = document.getElementsByClassName("realtimeGPSSpeed");
  realtimeGForceDoms = document.getElementsByClassName("realtimeGForce");
  realtimeHeadingDoms = document.getElementsByClassName("realtimeGPSHeading");
  realtimeDeviceClockDoms = document.getElementsByClassName("realtimeDeviceClock");
  realtimeGPSClockDoms = document.getElementsByClassName("realtimeGPSClock");
  realtimeDeviceTypeDoms = document.getElementsByClassName("realtimeDeviceType");
  realtimeDeviceBrowserDoms = document.getElementsByClassName("realtimeDeviceBrowser");
  overlayDom = document.getElementById("pageOverlay");
  lapNumberDom = document.getElementById("singleLapNum");
  lapTimerDom = document.getElementById("singleLapTime");
  lapPredictedTimeDom = document.getElementById("singleLapPredictedTime");
  lapPredictedSplitSessionDom = document.getElementById("singleLapPredictedSplitSession");
  lapPredictedSplitEverDom = document.getElementById("singleLapPredictedSplitEver");
  viewerNumDom = document.getElementById("viewerNum");
  viewerNumParentDom = document.getElementById("viewerNumParent");
  simpleSensorViewDom = document.getElementById("simpleData");
  fullSensorViewDom = document.getElementById("allData");
  showMoreSensorsDom = document.getElementById("showMoreData");
  showLessSensorsDom = document.getElementById("showLessData");

  socketInit();

  setInterval(purgeData, purgeFrequency);
  setInterval(function() { updateFriendsList(true); }, listUpdateFrequency);

  showMoreSensorsDom.onclick = function() {
    console.log('Showing more sensor data');
    simpleSensorViewDom.style.display = "none";
    fullSensorViewDom.style.display = "block";
  };
  showLessSensorsDom.onclick = function() {
    console.log('Showing less sensor data');
    simpleSensorViewDom.style.display = "block";
    fullSensorViewDom.style.display = "none";
  };

  viewerNumUpdateInterval = setInterval(updateViewerNum, viewerUpdateFrequency);
  viewerNumDom.innerHTML = 0;

  if (navigator.serviceWorker) {
    navigator.serviceWorker
        .register("https://dev.campbellcrowley.com/trax/traxSW.js")
        .then(function(registration) {
          if (TraX.debugMode)
            console.log(
                "ServiceWorker registration successful with scope:",
                registration.scope);
        })
        .catch(function(err) {
          console.warn("ServiceWorker registration failed:", err);
        });
  }

  updateFriendsList();
  updateStandingsList();
};
// Initialize socket connection and handlers.
function socketInit() {
  TraX.socket.on('connected', function() {
    TraX.socket.emit('setliveview');
    connected = true;
    updateViewerNum();
  });
  TraX.socket.on('disconnect', function(reason) {
    connected = false;
  });
  TraX.socket.on('reconnect', function(attempt) {});
  TraX.socket.on('livefrienddata', newData);
  TraX.socket.on('friendslist', function(list) {
    setTimeout(function() { updateFriendsList(); });
  });
  TraX.socket.on('numliveview', handleNewViewerNum);
  TraX.socket.on('newsummary', handleNewSummary);
  TraX.socket.on('fail', console.warn);
}
function requestConfigSummary(ownerId, driverId, trackId, configId, force) {
  if (Date.now() - lastSummaryRequestTime < 3000) return;
  lastSummaryRequestTime = Date.now();
  for (var i = 0; i < TraX.friendsList.length; i++) {
    if (!force) {
      const search =
          [TraX.friendsList[i], ownerId, trackId, configId].join(',');
      if (TraX.summaryList[search]) continue;
    }
    TraX.socket.emit(
        'getsummary', trackId, configId, TraX.friendsList[i].id, ownerId);
  }
  if (!force) {
    const search = [driverId, ownerId, trackId, configId].join(',');
    if (TraX.summaryList[search]) return;
  }
  TraX.socket.emit('getsummary', trackId, configId, driverId, ownerId);
}
function handleNewSummary(trackId, configId, userId, ownerId, data) {
  console.log('Summary:', trackId, configId, userId, ownerId, data);
}
function newData(friendId, chunkId, buffer) {
  if (buffer && buffer.length > 0 && friendId) {
    var shouldDecompress = true;
    try {
      shouldDecompress = buffer.indexOf("[NODECOMPRESS]") < 0;
      buffer = buffer.replace("[CHUNKEND]", "");
    } catch (err) {
      console.warn("Failed to read chunks", err);
      return;
    }
    if (shouldDecompress) {
      try {
        buffer = LZString.decompressFromUTF16(buffer);
      } catch (err) {
        console.warn("Failed to decompress chunk", err);
        return;
      }
    }
    try {
      buffer = JSON.parse(buffer);
    } catch (err) {
      console.warn("Failed to parse chunk", err);
      return;
    }
    if (buffer &&
        (!friendsData[friendId] || friendsData[friendId].chunkId < chunkId ||
         friendsData[friendId].sessionId != buffer.sessionId)) {
      buffer.chunkId = chunkId;
      buffer.receivedTime = Date.now();
      buffer.netDelta = buffer.receivedTime - buffer.clientTimestamp;
      buffer.speed = 0;
      if (TraX.getBrowser(buffer.userAgent) == "Chrome") {
        buffer.axisFlip = [true, true, true];
      } else {
        buffer.axisFlip = [false, false, false];
      }
      var willUpdateStandings = !friendsData[friendId] ||
          friendsData[friendId].bestLapSession != buffer.bestLapSession ||
          friendsData[friendId].predictedLapDuration !=
              buffer.predictedLapDuration;
      if (friendsData[friendId]) {
        buffer.label = friendsData[friendId].label;
        if (buffer.latitude) {
          buffer.speed = buffer.gpsSpeed;
        } else if (friendsData[friendId].latitude) {
          buffer.speed = friendsData[friendId].speed;
        }

        buffer.latitude = buffer.latitude || friendsData[friendId].latitude;
        buffer.longitude = buffer.longitude || friendsData[friendId].longitude;
      } else {
        // if (friendsData.length == 0) {
        //   setTimeout(function() {
        //     handleSelectUser(friendStandings[0].userId)
        //   });
        // }
        friendsData.length++;
      }
      var splitName = buffer.selectedTrack.split(',');
      var ownerId = splitName[1];
      var trackId = splitName[0];
      if (buffer.selectedTrack != null && buffer.selectedConfig != null &&
          (!buffer.summary || buffer.summary.trackId != buffer.selectedTrack ||
           buffer.summary.configId != buffer.selectedConfig ||
           buffer.summary.trackOwnerId != ownerId)) {
        requestConfigSummary(ownerId, friendId, trackId, buffer.selectedConfig);
      }
      if (!buffer.bestLapSession &&
          TraX.summaryList[
              [friendId, ownerId, trackId, buffer.selectedConfig].join(',')]) {
        buffer.bestLapSession =
            TraX.summaryList[[friendId, ownerId, trackId, buffer.selectedConfig]
                                 .join(',')]
                .bestLapDuration;
      }
      friendsData[friendId] = buffer;
      updateFriendRow(friendId);
      updateFriendMap();
      if (willUpdateStandings) updateStandings();

      if (friendsData[friendId].extra && friendsData[friendId].extra.messages &&
          friendsData[friendId].extra.messages.length > 0) {
        console.log(
            "Data Messages:", friendId, friendsData[friendId].extra.messages);
      }
    }
  }
}
function updateFriendsList(doMinimal) {
  if (friendsData.length == 0) {
    driverListDom.innerHTML = "";
  }
  Object.keys(friendsData).map(function(key) {
    if (key == "length") return;
    updateFriendRow(key, doMinimal);
  });
}
function updateFriendRow(id, doMinimal) {
  var row = document.getElementById("listRow" + id);
  var cells;
  if (row) {
    cells = row.getElementsByTagName("td");
  } else {
    row = document.createElement("tr");
    row.id = "listRow" + id;
    row.onclick = function() { handleSelectUser(id); };
    driverListDom.appendChild(row);
    row = document.getElementById("listRow" + id);
    for (var i = 0; i < listCols.length; i++) {
      var col = document.createElement("td");
      col.innerHTML = "?";
      row.appendChild(col);
    }
    cells = row.getElementsByTagName("td");
    sendNotif("One of your friends started a session!");
  }
  if (friendsData[id]) {
    var isStale = Date.now() - friendsData[id].receivedTime > staleDelay;
    row.classList.toggle("stale", isStale);
  }
  for (var i = 0; i < listCols.length; i++) {
    cells[i].innerHTML = "";
    cells[i].appendChild(document.createTextNode(getText(listCols[i], id)));
  }
  if (!doMinimal && id == selectedId) {
    updateCanvases(id);
    updateRealtime(id);
  }
}
function updateStandings() {
  friendStandings = [];

  Object.keys(friendsData).map(function(key) {
    if (key == "length") return;
    friendStandings.push({userId: key, time: friendsData[key].bestLapSession});
  });
  friendStandings.sort(function(a, b) {
    if (b.time == 0) return 1;
    if (a.time == 0) return -1;
    return b.time - a.time;
  });

  updateStandingsList();
}

function updateStandingsList() {
  if (friendStandings.length == 0) {
    driverStandingsDom.innerHTML = "";
  }
  for (var i = 0; i < 10 && i < friendStandings.length; i++) {
    var id = friendStandings[i].userId;
    var row = document.getElementById("standingRow" + (i + 1));
    var cells;
    if (row) {
      cells = row.getElementsByTagName("td");
    } else {
      row = document.createElement("tr");
      row.id = "standingRow" + (i + 1);
      row.onclick = function() { handleSelectUser(id); };
      driverStandingsDom.appendChild(row);
      row = document.getElementById("standingRow" + (i + 1));
      for (var j = 0; j < standingsCols.length; j++) {
        var col = document.createElement("td");
        col.innerHTML = "?";
        row.appendChild(col);
      }
      cells = row.getElementsByTagName("td");
    }
    for (var j = 0; j < standingsCols.length; j++) {
      cells[j].innerHTML = "";
      cells[j].appendChild(
          document.createTextNode(getText(standingsCols[j], id)));
    }
  }
  handleSelectUser(selectedId, true);
}

function getText(key, id) {
  try {
    switch (key) {
      case "label":
        if (!friendsData[id].label) {
          friendsData[id].label = alphabet[nextLabelIndex++ % alphabet.length];
        }
        return friendsData[id].label;
      case "name":
        return friendsData[id].driverName;
      case "speed":
        return TraX.Units.speedToUnit(friendsData[id].speed) +
            TraX.Units.getLargeSpeedUnit();
      case "lapTime":
        if (friendsData[id].lapStartTime <= 0) {
          return TraX.Common.formatMsec(
              friendsData[id].clientTimestamp -
                  friendsData[id].sessionStartTime,
              false, 1);
        } else {
          return TraX.Common.formatMsec(
              friendsData[id].clientTimestamp - friendsData[id].lapStartTime,
              false, 1);
        }
      case "lapTimeExt":
        if (Date.now() - friendsData[id].receivedTime > staleDelay) {
          return getText("lapTime", id);
        } else {
          var lapStart = friendsData[id].lapStartTime;
          if (lapStart <= 0) {
            lapStart = friendsData[id].sessionStartTime;
          }
          return TraX.Common.formatMsec(
              Date.now() - lapStart - friendsData[id].netDelta, false, 1);
        }
      case "predLapTime":
        return TraX.Common.formatMsec(
            friendsData[id].predictedLapDuration, false, 1);
      case "predLapSplitSession":
        return TraX.Common.formatMsec(
            friendsData[id].predictedLapDuration -
                friendsData[id].bestLapSession,
            true, 0);
      case "predLapSplitEver":
        const search = [
          selectedId, friendsData[selectedId].selectedTrack.split(',')[1],
          friendsData[selectedId].selectedTrack.split(',')[1],
          friendsData[selectedId].selectedConfig
        ].join(',');
        var finalTime = 0;
        if (TraX.summaryList[search] && TraX.summaryList[search].bestLapDuration) {
          finalTime = TraX.summaryList[search].bestLapDuration -
              friendsData[id].predictedLapDuration;
        }
        return TraX.Common.formatMsec(finalTime, true, 0);
      case "bestLapTime":
        return TraX.Common.formatMsec(friendsData[id].bestLapSession, false, 1);
      case "rank":
        return "#" + getRank(id);
      case "bestLapTime":
        return "XX:XX.XXX";
      default:
        return "BADKEY";
    }
  } catch (err) {
    console.error("Failed to get data for key:", key, "ID:", id, err);
    return key;
  }
}

function getRank(id) {
  for (var i = 0; i < friendStandings.length; i++) {
    if (friendStandings[i].userId == id) {
      return i + 1;
    }
  }
  return 0;
}

function updateFriendMap() {
  var bounds = {sw: {}, ne: {}};
  Object.keys(friendsData).map(function(key) {
    if (key == "length") return;
    var label = getText("label", key);
    var pos = {lat: friendsData[key].latitude, lng: friendsData[key].longitude};
    if (!pos.lat || !pos.lng) return;
    if (friendMarkers[key]) {
      friendMarkers[key].setPosition(pos);
    } else {
      friendMarkers[key] =
          new google.maps.Marker({position: pos, label: label, map: map});
      friendMarkers[key].addListener(
          'click', function() { handleSelectUser(key); });
    }

    if (!bounds.sw.lat || bounds.sw.lat > pos.lat) bounds.sw.lat = pos.lat;
    if (!bounds.sw.lng || bounds.sw.lng > pos.lng) bounds.sw.lng = pos.lng;
    if (!bounds.ne.lat || bounds.ne.lat < pos.lat) bounds.ne.lat = pos.lat;
    if (!bounds.ne.lng || bounds.ne.lng < pos.lng) bounds.ne.lng = pos.lng;
  });
  if (selectedId) {
    bounds = {
      sw: {
        lat: friendsData[selectedId].latitude,
        lng: friendsData[selectedId].longitude
      }
    };
    bounds.ne = bounds.sw;

    const search = [
      selectedId, friendsData[selectedId].selectedTrack.split(',')[1],
      friendsData[selectedId].selectedTrack.split(',')[1],
      friendsData[selectedId].selectedConfig
    ].join(',');
    if (TraX.summaryList[search] && TraX.summaryList[search].bestLapData) {
      polyline.setPath(TraX.summaryList[search].bestLapData.map(function(el) {
        return el.coord;
      }));
      polyline.setVisible(true);
    } else {
      polyline.setVisible(false);
    }
  } else if (polyline.getVisible()) {
    polyline.setVisible(false);
  }
  if (bounds.sw.lat && bounds.sw.lng && bounds.ne.lat && bounds.ne.lng) {
    if (bounds.ne.lat == bounds.sw.lat && bounds.ne.lng == bounds.sw.lng) {
      map.panTo(bounds.ne);
      // map.setZoom(15);
    } else {
      map.panToBounds(new google.maps.LatLngBounds(bounds.sw, bounds.ne));
      if (map.getZoom() > 15) map.setZoom(15);
      map.fitBounds(new google.maps.LatLngBounds(bounds.sw, bounds.ne));
    }
  }
}

function purgeData() {
  var now = Date.now();
  Object.keys(friendsData).map(function(key) {
    if (key == "length") return;
    if (now - friendsData[key].receivedTime > maxDataAge) {
      var row = document.getElementById("listRow" + key);
      if (row) row.outerHTML = "";
      // row = document.getElementById("standingRow" + getRank(key));
      // if (row) row.outerHTML = "";
      delete friendsData[key];
      friendMarkers[key].setVisible(false);
      delete friendMarkers[key];
      friendsData.length--;
      if (selectedId == key) handleSelectUser();
    }
  });
}

function updateCanvases(id) {
  var dat = friendsData[id];
  TraX.Canvases.rotation.a = dat["gyro"][0];
  TraX.Canvases.rotation.b = dat["gyro"][1];
  TraX.Canvases.rotation.g = dat["gyro"][2];
  TraX.downRotation = {
    a: dat["estimatedDownRotation"][0],
    b: dat["estimatedDownRotation"][1],
    g: dat["estimatedDownRotation"][2]
  };
  TraX.Canvases.drawAccel = [
    (dat.axisFlip[0] ? -1 : 1) * dat["accelIncGrav"][0],
    (dat.axisFlip[1] ? -1 : 1) * dat["accelIncGrav"][1],
    (dat.axisFlip[2] ? -1 : 1) * dat["accelIncGrav"][2]
  ];
  TraX.Canvases.rotationRate = {
    a: dat["rotationRate"][0],
    b: dat["rotationRate"][1],
    g: dat["rotationRate"][2]
  };
  TraX.Canvases.forwardVector = dat["estimatedForwardVector"];
  TraX.Canvases.headingOffset = dat["headingOffset"];

  TraX.Canvases.renderGyro(true);
  TraX.Canvases.renderAccel(true);
}
function updateRealtime(id) {
  // Sensors
  if (friendsData[id].longitude) {
    var gpsLongitude = friendsData[id].longitude + "\u00B0";
    for (var i = 0; i < realtimeLongitudeDoms.length; i++) {
      realtimeLongitudeDoms[i].innerHTML = "";
      realtimeLongitudeDoms[i].appendChild(
          document.createTextNode(gpsLongitude));
    }
  }
  if (friendsData[id].latitude) {
    var gpsLatitude = friendsData[id].latitude + "\u00B0";
    for (var i = 0; i< realtimeLatitudeDoms.length; i++) {
      realtimeLatitudeDoms[i].innerHTML = "";
      realtimeLatitudeDoms[i].appendChild(document.createTextNode(gpsLatitude));
    }
  }
  if (friendsData[id].altitude) {
    var gpsAltitude =
        Math.round(
            TraX.Units.distanceToSmallUnit(friendsData[id].altitude) * 10.0) /
            10.0 +
        TraX.Units.getSmallDistanceUnit();
    for (var i = 0; i < realtimeAltitudeDoms.length; i++) {
      realtimeAltitudeDoms[i].innerHTML = "";
      realtimeAltitudeDoms[i].appendChild(document.createTextNode(gpsAltitude));
    }
  }
  if (friendsData[id].heading) {
    var heading = friendsData[id].heading + "\u00B0";
    for (var i = 0; i < realtimeHeadingDoms.length; i++) {
      realtimeHeadingDoms[i].innerHTML = "";
      realtimeHeadingDoms[i].appendChild(document.createTextNode(heading));
    }
  }
  if (friendsData[id].gpsTimestamp) {
    var gpsTime = TraX.Common.formatTime(friendsData[id].gpsTimestamp, true);
    for (var i = 0; i < realtimeGPSClockDoms.length; i++) {
      realtimeGPSClockDoms[i].innerHTML = "";
      realtimeGPSClockDoms[i].appendChild(document.createTextNode(gpsTime));
    }
  }

  var gpsSpeed = TraX.Units.speedToUnit(friendsData[id].speed) +
      TraX.Units.getLargeSpeedUnit();
  for (var i = 0; i < realtimeSpeedDoms.length; i++) {
    realtimeSpeedDoms[i].innerHTML = "";
    realtimeSpeedDoms[i].appendChild(document.createTextNode(gpsSpeed));
  }
  var gForce = TraX.Units.speedToUnit(friendsData[id].speed) +
      TraX.Units.getLargeSpeedUnit();
  for (var i = 0; i < realtimeSpeedDoms.length; i++) {
    realtimeSpeedDoms[i].innerHTML = "";
    realtimeSpeedDoms[i].appendChild(document.createTextNode(gpsSpeed));
  }
  var deviceClock =
      TraX.Common.formatTime(friendsData[id].clientTimestamp, true);
  for (var i = 0; i < realtimeDeviceClockDoms.length; i++) {
    realtimeDeviceClockDoms[i].innerHTML = "";
    realtimeDeviceClockDoms[i].appendChild(
        document.createTextNode(deviceClock));
  }
  var deviceType = TraX.getDeviceType(friendsData[id].userAgent);
  for (var i = 0; i < realtimeDeviceTypeDoms.length; i++) {
    realtimeDeviceTypeDoms[i].innerHTML = "";
    realtimeDeviceTypeDoms[i].appendChild(document.createTextNode(deviceType));
  }
  var browser = TraX.getBrowser(friendsData[id].userAgent);
  for (var i = 0; i < realtimeDeviceBrowserDoms.length; i++) {
    realtimeDeviceBrowserDoms[i].innerHTML = "";
    realtimeDeviceBrowserDoms[i].appendChild(document.createTextNode(browser));
  }

  // Timers
  lapNumberDom.innerHTML = "";
  lapTimerDom.innerHTML = "";
  lapPredictedTimeDom.innerHTML = "";
  lapPredictedSplitSessionDom.innerHTML = "";
  lapPredictedSplitEverDom.innerHTML = "";

  lapNumberDom.appendChild(
      document.createTextNode("#" + (friendsData[id].lapNum || -1)));
  lapTimerDom.appendChild(document.createTextNode(getText("lapTime", id)));
  lapPredictedTimeDom.appendChild(
      document.createTextNode(getText("predLapTime", id)));
  lapPredictedSplitSessionDom.appendChild(
      document.createTextNode(getText("predLapSplitSession", id)));
  lapPredictedSplitEverDom.appendChild(
      document.createTextNode(getText("predLapSplitEver", id)));
}

function handleSelectUser(id, force) {
  var sel = document.getElementsByClassName("selected");
  for (var i = sel.length - 1; i > -1; i--) {
    sel[i].classList.remove("selected");
  }

  clearInterval(viewerNumUpdateInterval);
  if (!id || (id == selectedId && !force)) {
    selectedId = "";
    // viewerNumParentDom.style.display = "none";
    return;
  }
  var row = document.getElementById("listRow" + id);
  if (row) row.classList.add("selected");
  row = document.getElementById("standingRow" + getRank(id));
  if (row) row.classList.add("selected");

  selectedId = id;
  updateFriendRow(id);

  map.setZoom(15);

  // viewerNumUpdateInterval = setInterval(updateViewerNum, viewerUpdateFrequency);
  // viewerNumDom.innerHTML = 0;
  // viewerNumParentDom.style.display = "block";
}

function updateViewerNum() {
  TraX.socket.emit("getnumliveview"/*, selectedId*/);
}
function handleNewViewerNum(num/*, friendId*/) {
  viewerNumDom.innerHTML = num;
  viewerNumParentDom.style.display = "block";
}

Live.handleToggleNotifs = function() {
  if (!Notification) {
    console.warn(
        'User attempted to enable notifications on browser that ' +
        'doesn\'t support notifications.');
    return;
  }

  Notification.requestPermission().then(function(result) {
    console.log("Notifs:", result);
    if (result === "granted") {
      sendNotif(
          'Hi there! If you have this page open, I will let you know when ' +
          'your friend starts recording!')
    }
  });
};
function sendNotif(body) {
  if (Notification && Notification.permission == "granted") {
    notifOpts.body = body;
    var n = new Notification(notifTitle, notifOpts);
    setTimeout(n.close.bind(n), 7000);
  }
}

Live.PRINT = function() {
  console.log(
      "Friends List:", TraX.friendsList, "Friends Data:", friendsData,
      "Friends Standings:", friendStandings, 'Summaries:', TraX.summaryList);
};

}(window.TraX.Live = window.TraX.Live || {}));
}(window.TraX = window.TraX || {}));
