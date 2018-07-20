// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
(function(DataView, undefined) {

// const updateListFrequency = 7000; // Milliseconds

// Folders to show user for organizing sessions. "#friends#" shows list of all
// friends.
const sessionFolders = ['All', 'Only Me', '#friends#'];
// Sorting methods for visible list of sessions.
const sessionSorts = ['Name', 'Date', 'Track', 'User'];

// DOM elements.
var mymapDom, sessionsListDom, loadBarDom, dataLoadingDom, dataTitleDom,
    dataViewChartDom, trackNameDom, trackConfigDom, timeDom, numLapsDom,
    fastLapDom, slowLapDom, avgLapDom, topSpeedDom, avgSpeedDom, maxGForceDom,
    lapListDom, sessionsListTextInput, sessionsListConfirmButton,
    sessionsListTextDom, sessionsListCancelButton, sessionsListOverlay,
    dataViewOverlay, trackListDom, configListDom, carListDom,
    trackListTitlesDom, downloadOverlayDom, folderListDom;

// List of all sessions.
var fileList = [];
var currentSession = {};
// Currently loaded session list of data.
var sessionData;
// Buffer of chunks received from server.
var chunkReceiveBuffer;
// Number of bytes received from server.
var bytesreceived;
// Array of list of bytes missing that we need to re-request from server.
var missingBytesList;
// Currently displayed session name on UI.
var HRTitle;
// Average of all coordinates received for session.
DataView.coordAverage = {};
// Data about a track and it's configuration.
DataView.trackData = {};
// List of all tracks.
DataView.trackList = [];
// List of configs arranged by track id and user id in object.
DataView.configList = {};
// Summary of session.
var sessionSummary = {};
// Previous requested sort mode.
var sortMode = "None";

// State where we are trying to get track and config data.
var fetchState = 0;
// Number of times picktrack has run without any updates. If this get's too high
// pick track times out and continues.
var pickTrackCount = 0;
// Last fetch state for checking if pick track has made progress.
var lastFetchState = 0;
// Should pick track determine which track the current session is on after
// getting list of tracks?
var shouldDetermineTrack = false;

// Currently visible users.
var folderUsers = [];

var viewOpeningTimeout, updateListInterval, pickTrackTimeout;

// Class for necessary info about a track.
DataView.Track = function(name, id, ownerId) {
  this.name = "";
  this.id = "";
  this.ownerId = "";
  if (typeof name === "string") this.name = name;
  if (typeof id === "number" || typeof id === "string") this.id = id;
  if (typeof ownerId === "string") this.ownerId = ownerId;
};
// Class for necessary info about a config.
DataView.Config = function(name, id, track, ownerId) {
  this.track = DataView.Track;
  this.name = "";
  this.id = "";
  this.ownerId = "";
  if (typeof name === "string") this.name = name;
  if (typeof id === "number" || typeof id === "string") this.id = id;
  if (typeof track === "DataView.Track") this.track = track;
  if (typeof ownerId === "string") this.ownerId = ownerId;
}

// Initialize
DataView.init = function() {
  sessionsListDom = document.getElementById("sessionsList");
  loadBarDom = document.getElementById("loadBar");
  dataLoadingDom = document.getElementById("dataLoading");
  dataTitleDom = document.getElementById("dataTitle");
  dataViewChartDom = document.getElementById("dataViewChart");
  trackNameDom = document.getElementById("dataViewTrackName");
  trackConfigDom = document.getElementById("dataViewTrackConfig");
  timeDom = document.getElementById("dataViewTime");
  numLapsDom = document.getElementById("dataViewNumLaps");
  fastLapDom = document.getElementById("dataViewFastLap");
  slowLapDom = document.getElementById("dataViewSlowLap");
  avgLapDom = document.getElementById("dataViewAvgLap");
  topSpeedDom = document.getElementById("dataViewTopSpeed");
  avgSpeedDom = document.getElementById("dataViewAvgSpeed");
  lowestSpeedDom = document.getElementById("dataViewLowestSpeed");
  maxGForceDom = document.getElementById("dataViewMaxGForce");
  lapListDom = document.getElementById("lapList");
  dataViewMapButtonDom = document.getElementById("trackSummaryMapButton");
  sessionsListTextInput = document.getElementById("sessionsListRenameInput");
  sessionsListConfirmButton = document.getElementById("sessionsListConfirmButton");
  sessionsListTextDom = document.getElementById("sessionsListConfirmMessage");
  sessionsListCancelButton = document.getElementById("sessionsListCancelButton");
  sessionsListOverlay = document.getElementById("sessionsListOverlay");
  dataViewOverlay = document.getElementById("dataViewTrackListOverlay");
  trackListDom = document.getElementById("trackList");
  configListDom = document.getElementById("configList");
  carListDom = document.getElementById("carList");
  trackListTitlesDom = document.getElementById("trackTitles");
  downloadOverlayDom = document.getElementById("dataViewDownloadOverlay");
  folderListDom = document.getElementById("folderList");

  // Show sort mode buttons.
  var sortModes = document.createElement("div");
  sortModes.innerHTML = "&nbsp;Sort:<br>";
  for (var i=0; i< sessionSorts.length; i++) {
    var newItem = document.createElement("input");
    newItem.type = "button";
    newItem.className = "links smaller nohover";
    newItem.value = sessionSorts[i];
    newItem.setAttribute(
        'onclick', "TraX.DataView.sortSessions('" + sessionSorts[i] + "');");
    sortModes.appendChild(newItem);
  }
  sortModes.style.display = "block";
  sessionsListDom.parentNode.insertBefore(sortModes, sessionsListDom);

  TraX.socket.on("sessionlist", handleNewFiles);
  TraX.socket.on("streamresponse", newChunk);
  TraX.socket.on("tracklist", handleNewTrackData);
  TraX.socket.on("friendslist", refreshFriendData);

  resetSessionData();

  setTimeout(postInit);
};
function postInit() {
  enterDataView();
}
function enterDataView() {
  DataView.handleOpening();
  var currPane = Panes.getPane();
  Panes.handleOpening();
  Panes.setCurrent(currPane);
  DataView.MyMap.handleOpening();
}
TraX.leaveDataView = function() { TraX.goBack(); };
// Reset all data about current session in preparation for new session data.
function resetSessionData(sameSession) {
  bytesreceived = 0;
  missingBytesList = [];
  sessionData = [];
  chunkReceiveBuffer = [];
  DataView.updateSessionData();
  DataView.coordAverage = {lat: 0, lng: 0, count: 0, coord: {lat: 0, lng: 0}};
  if (!sameSession) {
    currentSession = {};
  }
}
// The view just opened.
DataView.handleOpening = function() {
  // updateListInterval = setInterval(DataView.requestList, updateListFrequency);
  // setTimeout(DataView.requestList, updateListFrequency / 3.0);
  DataView.requestList();
  if (!TraX.isSignedIn) {
    // Retry once a second until the user signs in.
    clearTimeout(viewOpeningTimeout);
    viewOpeningTimeout = setTimeout(DataView.handleOpening, 1000);

    sessionsListDom.innerHTML = "";
    var newList = document.createElement("ul");
    var newItem = document.createElement("li");
    newItem.innerHTML = "Please sign in to view your data.";
    newList.appendChild(newItem);
    sessionsListDom.appendChild(newList);
  }
};
// The view is closing.
DataView.handleClosing = function() {
  clearInterval(updateListInterval);
};
// Received new friends list from server.
function refreshFriendData() {
  setTimeout(function() {
    DataView.requestList();
    DataView.fetchTrackList();
  });
}
// Request list of sessions.
DataView.requestList = function() {
  fileList = [];
  TraX.socket.emit("requestsessionlist");
  for (var i = 0; i < TraX.friendsList.length; i++) {
    TraX.socket.emit("requestsessionlist", TraX.friendsList[i].id);
  }
};
// Received new list of sessions from server.
function handleNewFiles(files) {
  if (typeof files === 'string') {
    console.warn("Getting file list failed", files);
    if (fileList.length == 0) {
      sessionsListDom.innerHTML = "";
      switch (files) {
        case "noperm":
          TraX.showMessageBox("You don't have permission to view that data.");
          break;
        case "readerror":
          /*TraX.showMessageBox(
              "The server got confused and had trouble finding your data. Maybe
             you don't have any?");*/
          // console.warn("handleNewFiles:", files);
          break;
        case "deleteerror":
          TraX.showMessageBox(
              "The server seems sentimental and has refused to delete your data. Try again?");
          break;
        default:
          var additional = "";
          if (files.length < 100) additional = " (Server said: " + files + ")";
          TraX.showMessageBox(
              "An unknown thing happened. Sorry, that's all I know." +
              additional);
          break;
      }
      var newList = document.createElement("ul");
      var newItem = document.createElement("li");
      newItem.innerHTML =
          "Such empty... Session will appear here as we can find them.";
      newList.appendChild(newItem);
      sessionsListDom.appendChild(newList);
    }
    return;
  }
  if (!files || fileArraysEqual(fileList, files)) return;
  // console.log("New files list", files);
  fileList = fileList.concat(files);
  if (TraX.debugMode) console.log("Current session list", fileList);
  DataView.sortSessions(sortMode);
}
// Update UI of session list.
function showSessionList() {
  // Update folder list.
  folderListDom.innerHTML = "";
  var folderList = document.createElement("ul");
  for (var i = 0, j = -1; i < sessionFolders.length; i++) {
    var text = sessionFolders[i];
    var id = text;
    if (text == "#friends#") {
      if (j == -1) {
        text = "All Friends";
        id = text;
      } else if (j >= TraX.friendsList.length) {
        j = -1;
        continue;
      } else {
        text =
            TraX.friendsList[j].firstName + " " + TraX.friendsList[j].lastName;
        id = "id:" + TraX.friendsList[j].id;
      }
      i--;
      j++;
    }
    var newItem = document.createElement("li");
    var newButton = document.createElement("input");
    newButton.type = "button";
    newButton.setAttribute(
        "onclick", "TraX.DataView.showSessions('" + id + "');");
    newButton.value = text;
    newItem.appendChild(newButton);
    folderList.appendChild(newItem);
  }
  folderListDom.appendChild(folderList);

  // Update sessions list.
  sessionsListDom.innerHTML = "";
  var newList = document.createElement("ul");
  var visibleSessions = 0;
  var prevTrack, prevTrackOwner;
  for (var i = 0; i < fileList.length; i++) {
    var ownerId = fileList[i]["ownerId"];
    var sessionId = fileList[i]["id"];
    if (folderUsers && folderUsers.length > 0) {
      var match = false;
      for (var j = 0; j < folderUsers.length; j++) {
        if (ownerId == folderUsers[j]) {
          match = true;
          break;
        }
      }
      if (!match) continue;
    }
    visibleSessions++;

    addTitle = function(title) {
      var newItem = document.createElement("li");
      newItem.appendChild(document.createTextNode(title));
      newItem.style.height = "22px";
      newItem.style.padding = "4px";
      newItem.style.fontSize = "1.2em";
      newList.appendChild(newItem);
    };

    if (sortMode == "Track" &&
        (fileList[i]["trackId"] != prevTrack ||
         fileList[i]["trackOwnerId"] != prevTrackOwner)) {
      addTitle(
          getTrackName(
              new DataView.Track(
                  "", fileList[i]["trackId"], fileList[i]["trackOwnerId"]),
              true) ||
          "Unknown");
      prevTrack = fileList[i]["trackId"];
      prevTrackOwner = fileList[i]["trackOwnerId"];
    } else if (sortMode == "Name") {
      var name = (fileList[i]["HRtitle"] || " ")[0].toUpperCase();
      if (name != prevTrack) {
        addTitle(name);
        prevTrack = name;
      }
    } else if (sortMode == "Date") {
      var date = new Date(fileList[i]["date"]).toDateString();
      if (date != prevTrack) {
        addTitle(date);
        prevTrack = date;
      }
    } else if (sortMode == "User") {
      var user = fileList[i]["ownerId"];
      if (user != prevTrack) {
        var userName = user;
        if (user == TraX.getDriverId()) {
          userName = "Your sessions";
        } else {
          for (var j = 0; j < TraX.friendsList.length; j++) {
            if (TraX.friendsList[j].id == user) {
              userName = TraX.friendsList[j].firstName + " " +
                  TraX.friendsList[j].lastName;
              break;
            }
          }
        }
        addTitle(userName);
        prevTrack = user;
      }
    }

    var newItem = document.createElement("li");
    var newButton = document.createElement("input");
    newButton.type = "button";

    newButton.setAttribute(
        "onclick",
        "TraX.DataView.sessionClick('" + sessionId + "','" + ownerId + "');");

    newButton.value = "";
    var splitName = fileList[i].name.match(/%(.*?)%/) || [fileList[i].name];
    var dateToParse = splitName[1];
    var stringDate = "";
    if (typeof dateToParse !== 'undefined' && dateToParse.length > 0) {
      try {
        splitName[0] = fileList[i].name.replace("%" + dateToParse + "%", "");
        var date = new Date(Number(dateToParse));
        stringDate = date.toDateString() + " at " +
            TraX.Common.formatTime(date.getTime());
      } catch (err) {
        console.log("Failed to parse", fileList[i], "date");
        TraX.showMessageBox("Date error", 2000);
      }
    }
    if (stringDate == "" && fileList[i].date) {
      for (var j = 0; j < fileList.length; j++) {
        if (i == j) continue;
        if (fileList[j].name == fileList[i].name) {
          var date = new Date(Number(fileList[i].date));
          stringDate = date.toDateString() + " at " +
              TraX.Common.formatTime(date.getTime(), true);
          break;
        }
      }
    }
    var seperator = "";
    if (splitName[0] && stringDate) seperator = " on ";
    var newName = splitName[0] + seperator + stringDate;
    if (newName == "") {
      var date = new Date(Number(fileList[i].date));
      newName =
          date.toDateString() + " at " + TraX.Common.formatTime(date.getTime());
    }
    newButton.value = newName;

    // fileList[i] = {title: fileList[i].name, HRtitle: newButton.value};
    fileList[i].title = fileList[i].name;
    fileList[i].HRtitle = newButton.value;
    newItem.appendChild(newButton);

    var editable = TraX.getDriverId() == ownerId;

    var deleteButton = document.createElement("button");
    var deleteIcon = document.createElement("img");
    deleteIcon.src = "https://dev.campbellcrowley.com/trax/images/trash.png";
    deleteButton.appendChild(deleteIcon);
    deleteButton.setAttribute(
        "onclick",
        "TraX.DataView.deleteSession('" + sessionId + "','" + ownerId + "')");
    deleteButton.disabled = !editable;
    newItem.appendChild(deleteButton);

    var editButton = document.createElement("button");
    var editIcon = document.createElement("img");
    editIcon.src = "https://dev.campbellcrowley.com/trax/images/pencil.png";
    editButton.appendChild(editIcon);
    editButton.setAttribute(
        "onclick",
        "TraX.DataView.editSession('" + sessionId + "','" + ownerId + "')");
    editButton.disabled = !editable;
    newItem.appendChild(editButton);

    newList.appendChild(newItem);
  }
  if (visibleSessions == 0) {
    var newItem = document.createElement("li");
    newItem.innerHTML = "There appears to be nothing here...";
    newList.appendChild(newItem);
  }
  sessionsListDom.appendChild(newList);
}
// Folder selected by user.
DataView.showSessions = function(setting) {
  if (setting == "All") {
    folderUsers = [];
  } else if (setting == "Only Me") {
    folderUsers = [TraX.getDriverId()];
  } else if (setting == "All Friends") {
    folderUsers = TraX.friendsList.map(function(obj) { return obj.id; });
  } else if (setting.indexOf("id:") == 0) {
    folderUsers = [setting.replace('id:', '')];
  } else {
    console.log("Unknown folder setting:", setting);
    return;
  }
  Panes.nextPane();
  showSessionList();
};
// Sort sessions based on user input.
DataView.sortSessions = function(setting) {
  sortMode = setting;
  if (setting == 'Name') {
    var before = fileList;
    fileList.sort(function(a, b) {
      var A = (a.HRtitle || "").toLowerCase();
      var B = (b.HRtitle || "").toLowerCase();
      if (A < B) return -1;
      else if (A > B) return 1;
      else return 0;
    });
  } else if (setting == 'Date') {
    fileList.sort(function(a, b) { return b.date - a.date; });
  } else if (setting == 'Track') {
    fileList.sort(function(a, b) {
      if (a.trackOwnerId == b.trackOwnerId && a.trackId == b.trackId) {
        // Sort alphabetically within same track.
        var A = a.HRtitle.toLowerCase();
        var B = b.HRtitle.toLowerCase();
        if (A < B) return -1;
        else if (A > B) return 1;
        else return 0;
      }
      // Put user defined tracks and sessions with track data at top.
      if ((a.trackOwnerId === null || typeof a.trackOwnerId === 'undefined') &&
          (a.trackId == null || typeof a.trackId === 'undefined')) {
        return 1;
      }
      if ((b.trackOwnerId === null || typeof b.trackOwnerId === 'undefined') &&
          (b.trackId == null || typeof b.trackId === 'undefined')) {
        return -1;
      }
      // Sort by owner id then track id.
      if (a.trackOwnerId == b.trackOwnerId) {
        if (a.trackId === null || typeof a.trackId === 'undefined') return 1;
        if (b.trackId === null || typeof b.trackId === 'undefined') return -1;
        var A = (a.trackId + '').toLowerCase();
        var B = (b.trackId + '').toLowerCase();
        if (A < B) return -1;
        else if (A > B) return 1;
        else return 0;
      } else {
        if (a.trackOwnerId === null || typeof a.trackOwnerId === 'undefined')
          return 1;
        if (b.trackOwnerId === null || typeof b.trackOwnerId === 'undefined')
          return -1;
        var A = a.trackOwnerId.toLowerCase();
        var B = b.trackOwnerId.toLowerCase();
        if (A < B) return -1;
        else if (A > B) return 1;
        else return 0;
      }
    });
  } else if (setting == 'User') {
    fileList.sort(function(a, b) {
      if (a.ownerId == b.ownerId) {
        // Sort alphabetically within same user.
        var A = (a.HRtitle || "").toLowerCase();
        var B = (b.HRtitle || "").toLowerCase();
        if (A < B) return -1;
        else if (A > B) return 1;
        else return 0;
      } else if (a.ownerId == TraX.getDriverId()) {
        // Sort current user above all friends.
        return -1;
      } else if (b.ownerId == TraX.getDriverId()) {
        // Sort current user above all friends.
        return 1;
      } else if (a.ownerId < b.ownerId) {
        // Sort lexicographically by ID (IDs are strings, basically numerical
        // order).
        return -1;
      } else {
        return 1;
      }
    });
  } else if (setting == 'None') {
  } else {
    console.warn("Unknown sort setting:", setting);
  }
  showSessionList();
};
// Check if arrays of sessions are equivalent.
function fileArraysEqual(one, two) {
  if (one == null || two == null) {
    return (one == null && two == null);
  }
  if (one.length != two.length) return false;
  for (var i = 0; i < one.length; i++) {
    if (one[i].id != two[i].id) return false;
    if (one[i].name != two[i].name) return false;
  }
  return true;
}
// Check if two generic arrays are equivalent.
function arraysEqual(one, two) {
  if (one === two) return true;
  if (one == null || two == null) return false;
  if (one.length != two.length) return false;
  for (var i = 0; i < one.length; i++) {
    if (one[i] !== two[i]) return false;
  }
  return true;
}

// TODO: Decompress/parse chunks asynchronously while receiving data.
// Received chunk of session from server.
function newChunk(size, chunk, sessionid, bytessent, totalbytes) {
  if (bytessent === size) resetSessionData(true);
  bytesreceived += size;
  if (size < 0) {
    if (chunk === "readerr") {
      console.log("Server replied with readerr for", sessionid);
      sessionData = ["No Data, does this session exist?"];
      dataTitleDom.innerHTML = "Error...";
      updateProgress(false, bytessent, totalbytes);
      pickTrack();
    } else {
      dataTitleDom.innerHTML = "Processing...";
      finalizeData(function() {
        updateProgress(false, 0, 0);
        shouldDetermineTrack = true;
        pickTrack();
      });
    }
  } else {
    dataTitleDom.innerHTML = "Downloading...";
    chunkReceiveBuffer.push(chunk);
    updateProgress(true, bytesreceived, totalbytes);
    if (bytesreceived != bytessent) {
      missingBytesList.push([bytesreceived - size, bytessent - size]);
      console.log(
          "Skipped chunk", missingBytesList[missingBytesList.length - 1],
          bytesreceived - bytessent);
      bytesreceived = bytessent;
      TraX.showMessageBox(
          "Some data was not received. In the future this will attempt to redownload these chunks.");
    }
  }
}
// All data from server has been received, and we are ready to process the data.
function finalizeData(mainCB) {
  var shouldDecompress = true;
  if (TraX.debugMode >= 2) console.log(chunkReceiveBuffer);
  try {
    chunkReceiveBuffer = chunkReceiveBuffer.join("");
    shouldDecompress = chunkReceiveBuffer.indexOf("[NODECOMPRESS]") < 0;
    chunkReceiveBuffer = chunkReceiveBuffer.split("[CHUNKEND]");
  } catch (err) {
    console.log("Failed to split chunks", err);
    TraX.showMessageBox("This session appears to be corrupt. :(");
    return;
  }
  processChunk = function(chunkReceiveBuffer, shouldDecompress, cb) {
    var decompressedChunk;
    if (shouldDecompress) {
      try {
        decompressedChunk = LZString.decompressFromUTF16(chunkReceiveBuffer);
      } catch (err) {
        console.log("Failed to decompress chunk", err);
        console.log(chunkReceiveBuffer);
        cb();
        return;
      }
    } else {
      decompressedChunk = chunkReceiveBuffer;
    }
    var parsedChunk;
    try {
      parsedChunk = JSON.parse(decompressedChunk);
    } catch (err) {
      console.warn("Failed to parse chunk", err);
      cb();
      return;
    }
    if (parsedChunk != null) {
      sessionData.push(parsedChunk);
      if (parsedChunk["latitude"] != 0 && parsedChunk["longitude"] != 0) {
        DataView.coordAverage.lat += parsedChunk["latitude"];
        DataView.coordAverage.lng += parsedChunk["longitude"];
        DataView.coordAverage.count++;
      }
    }
    cb();
  };
  var numComplete = 0;
  var numTotal = chunkReceiveBuffer.length;
  function chunkProcessCB() {
    updateProgress(true, numComplete, numTotal);
    if (++numComplete == numTotal) {
      DataView.coordAverage.coord.lat =
          DataView.coordAverage.lat / DataView.coordAverage.count;
      DataView.coordAverage.coord.lng =
          DataView.coordAverage.lng / DataView.coordAverage.count;
      sortData(sessionData);
      if (TraX.debugMode) console.log("SESSION DATA:", sessionData);
      mainCB();
    }
  }
  while (chunkReceiveBuffer.length > 0) {
    const chunk = chunkReceiveBuffer[0];
    setTimeout(function() {
      processChunk(chunk, shouldDecompress, chunkProcessCB);
    });
    chunkReceiveBuffer.splice(0, 1);
  }
}
// Update progress bar.
function updateProgress(visible, bytessent, totalbytes) {
  if (typeof bytessent !== 'undefined') loadBarDom.value = bytessent;
  if (typeof totalbytes !== 'undefined') loadBarDom.max = totalbytes;
  dataLoadingDom.style.display = visible ? "block" : "none";
  dataViewChartDom.style.display = visible ? "none" : "inline-block";
  lapListDom.parentNode.style.display = visible ? "none" : "inline-block";
}
// Sort sessionData based off timestamp when data was recorded to ensure all
// data is in order regardless of when the server received it.
function sortData(sessionData) {
  sessionData.sort(function(a, b) {
    return (a["clientTimestamp"] == b["clientTimestamp"]) ?
        0 :
        ((a["clientTimestamp"] < b["clientTimestamp"]) ? -1 : 1);
  });
  for (var i = 1; i < sessionData.length; i++) {
    if (sessionData[i]["clientTimestamp"] ==
        sessionData[i - 1]["clientTimestamp"]) {
      sessionData.splice(i, 1);
      i--;
    }
  }
}
// Update data and summary from newly collected session.
DataView.updateSessionData = function() {
  dataTitleDom.innerHTML = "";
  if (HRTitle) dataTitleDom.appendChild(document.createTextNode(HRTitle));
  else dataTitleDom.innerHTML = "Please select a session from the previous pane.";
  if (sessionData.length < 1) {
    TraX.DataView.MyMap.resetPolyLine();
    lapListDom.innerHTML = "";
  } else {
    var times = getDurations(sessionData);
    var laps = getLaps(sessionData);

    var speeds = {
      topSpeed: {val: 0, lap: 0, index: 0},
      avgSpeed: 0,
      lowestSpeed: {val: 0, lap: 0, index: 0}
    };
    var speedSum = 0;
    var speedCount = 0;
    var maxGForce = {val: 0, lap: 0, index: 0};
    var maxAlt = {val: 0, lap: 0};
    var minAlt = {val: 0, lap: 0};
    for (var i = 0; i < laps.length; i++) {
      if (laps[i].topSpeed.val > speeds.topSpeed.val) {
        speeds.topSpeed = {
          val: laps[i].topSpeed.val,
          lap: i,
          index: laps[i].topSpeed.index
        };
      }
      if (laps[i].lowestSpeed.val > speeds.lowestSpeed.val) {
        speeds.lowestSpeed = {
          val: laps[i].lowestSpeed.val,
          lap: i,
          index: laps[i].lowestSpeed.index
        };
      }
      speedSum += laps[i].avgSpeed;
      speedCount++;

      if (laps[i].maxGForce.val > maxGForce.val) {
        maxGForce = {val: laps[i].maxGForce.val, lap: i, index: laps[i].maxGForce.index};
      }
      if (!maxAlt.val || laps[i].maxAlt > maxAlt.val) {
        maxAlt = {val: laps[i].maxAltitude, lap: i};
      }
      if (!minAlt.val || laps[i].minAlt < minAlt.val) {
        minAlt = {val: laps[i].minAltitude, lap: i};
      }
    }
    if (speedCount > 0) speeds.avgSpeed = speedSum / speedCount;
    else speeds.avgSpeed = 0;

    var numLaps = laps.length;
    var slowLap = {val: 0, lap: 0};
    var avgLap = 0;
    var fastLap = {val: 365 * 24 * 60 * 60 * 1000, lap: 0};
    for (var i = 0; i < numLaps; i++) {
      var lapDur = laps[i].duration;
      if (lapDur > slowLap.val) {
        slowLap = {val: lapDur, lap: i};
      }
      if (lapDur < fastLap.val) {
        fastLap = {val: lapDur, lap: i};
      }
      avgLap += lapDur;
    }
    if (numLaps > 0) avgLap = avgLap / numLaps;
    else avgLap = 0;
    if (fastLap.val == 365 * 24 * 60 * 60 * 1000) fastLap.val = 0;

    sessionSummary = {
      times: times,
      laps: laps,
      fastestLap: fastLap,
      avgLap: avgLap,
      slowestLap: slowLap,
      speeds: speeds,
      maxGForce: maxGForce,
      maxAltitude: maxAlt,
      minAltitude: minAlt
    };

    if (TraX.debugMode) console.log("SUMMARY:", sessionSummary);

    showSessionData();

    DataView.MyMap.updateMyMap();
  }
};
// Show data from updateSessionData() to the user.
function showSessionData() {
  showTrackNames();

  // TODO: Convert timezones. Timestamps are msecs since UTC epoch.
  timeDom.innerHTML = "";
  if (isMultiSession(sessionData)) {
    timeDom.innerHTML += "(Multi-Session)";
  }
  var lastDay = -1;
  for (var i = 0; sessionSummary.times && i < sessionSummary.times.length;
       i++) {
    for (var j = 0; j < sessionSummary.times[i].length; j++) {
      var date = new Date(sessionSummary.times[i][j]);
      if (date.getDay() != lastDay) {
        lastDay = date.getDay();
        timeDom.innerHTML += "<br>" + date.toDateString() + "<br>";
      }
      timeDom.innerHTML += TraX.Common.pad(date.getHours(), 2) + ":" +
          TraX.Common.pad(date.getMinutes(), 2);
      if (j == sessionSummary.times[i].length-1) {
        timeDom.innerHTML += "<br>";
      } else {
        timeDom.innerHTML += " - ";
      }
    }
  };

  var numLaps = (sessionSummary.laps || []).length;
  var numNonLaps = -(sessionSummary.laps || []).neglength;
  var showNonLapInfo = numNonLaps == 1 && numLaps == 0;

  numLapsDom.innerHTML =
      numLaps /* + " (" + -sessionSummary.laps.neglength + ") "*/;
  if (numLaps == 0 && numNonLaps > 1) {
    numLapsDom.innerHTML +=
        "<a class=\"tip\">Is the selected configuration correct?</a>";
  } else if (numLaps == 0) {
    numLapsDom.innerHTML +=
        "<a class=\"tip\">Is the selected track correct?</a>";
  }

  if (!sessionSummary.laps ||
      (sessionSummary.laps.length == 0 && sessionSummary.laps.neglength == 0) ||
      !sessionSummary.fastestLap || !sessionSummary.slowestLap ||
      !sessionSummary.avgLap || !sessionData || sessionData.length == 0) {
    return;
  }

  // Times
  fastLapDom.parentNode.style.display = numLaps <= 1 ? "none" : "block";
  avgLapDom.parentNode.style.display = numLaps <= 1 ? "none" : "block";
  slowLapDom.parentNode.style.display = numLaps <= 1 ? "none" : "block";

  fastLapDom.innerHTML = "<strong>#" + (sessionSummary.fastestLap.lap + 1) +
      "</strong>: " + TraX.Common.formatMsec(sessionSummary.fastestLap.val);
  slowLapDom.innerHTML = "<strong>#" + (sessionSummary.slowestLap.lap + 1) +
      "</strong>: " + TraX.Common.formatMsec(sessionSummary.slowestLap.val);
  avgLapDom.innerHTML = TraX.Common.formatMsec(sessionSummary.avgLap);

  // Speeds / Acceleration
  if (showNonLapInfo) {
    topSpeedDom.innerHTML =
        TraX.Units.speedToUnit(sessionSummary.laps[-1].topSpeed.val) +
        TraX.Units.getLargeSpeedUnit();
    addClickIndexCallback(
        topSpeedDom.parentNode, sessionSummary.laps[-1].topSpeed.index);
    lowestSpeedDom.innerHTML =
        TraX.Units.speedToUnit(sessionSummary.laps[-1].lowestSpeed.val) +
        TraX.Units.getLargeSpeedUnit();
    addClickIndexCallback(
        lowestSpeedDom.parentNode, sessionSummary.laps[-1].lowestSpeed.index);
    avgSpeedDom.innerHTML =
        TraX.Units.speedToUnit(sessionSummary.laps[-1].avgSpeed) +
        TraX.Units.getLargeSpeedUnit();

    maxGForceDom.innerHTML = sessionSummary.laps[-1].maxGForce.val + "G";
    addClickIndexCallback(
        maxGForceDom.parentNode, sessionSummary.laps[-1].maxGForce.index);
  } else {
    topSpeedDom.innerHTML = "<strong>#" +
        (sessionSummary.speeds.topSpeed.lap + 1) + "</strong>: " +
        TraX.Units.speedToUnit(sessionSummary.speeds.topSpeed.val) +
        TraX.Units.getLargeSpeedUnit();
    addClickIndexCallback(
        topSpeedDom.parentNode, sessionSummary.speeds.topSpeed.index);
    lowestSpeedDom.innerHTML = "<strong>#" +
        (sessionSummary.speeds.lowestSpeed.lap + 1) + "</strong>: " +
        TraX.Units.speedToUnit(sessionSummary.speeds.lowestSpeed.val) +
        TraX.Units.getLargeSpeedUnit();
    addClickIndexCallback(
        lowestSpeedDom.parentNode, sessionSummary.speeds.lowestSpeed.index);
    avgSpeedDom.innerHTML =
        TraX.Units.speedToUnit(sessionSummary.speeds.avgSpeed) +
        TraX.Units.getLargeSpeedUnit();

    maxGForceDom.innerHTML = "<strong>#" + (sessionSummary.maxGForce.lap + 1) +
        "</strong>: " + sessionSummary.maxGForce.val + "G";
    addClickIndexCallback(
        maxGForceDom.parentNode, sessionSummary.maxGForce.index);
  }

  var showMoreInfo = numLaps > 0 || showNonLapInfo;
  topSpeedDom.parentNode.style.display = showMoreInfo ? "block" : "none";
  avgSpeedDom.parentNode.style.display = showMoreInfo ? "block" : "none";
  lowestSpeedDom.parentNode.style.display = showMoreInfo ? "block" : "none";
  maxGForceDom.parentNode.style.display = showMoreInfo ? "block" : "none";

  showLapList(sessionData);
}
// Show list of laps to user. Called by showSessionData().
function showLapList(sessionData) {
  lapListDom.innerHTML = "";
  const neglength = sessionSummary.laps.neglength;
  const length = sessionSummary.laps.length;
  for (var j = neglength; j < length; j++) {
    var i = j - neglength;
    if (i >= length) i = length - i - 1;

    var newRow = document.createElement('li');
    if (i >= 0) {
      newRow.style.zIndex = length - i;
    } else {
      newRow.style.zIndex = -neglength + i;
    }
    if (i == -1) {
      var seperator = document.createElement('li');
      seperator.style.padding = "1em";
      seperator.style.marginTop = "1px";
      seperator.style.textAlign = "center";
      seperator.innerHTML =
          "Negative laps are durations that are not between a start and finish line. (e.g. Driving off track, driving onto track.)";
      lapListDom.appendChild(seperator);
    }
    var header = document.createElement('button');
    header.classList.add("lapListHeader");
    header.setAttribute("onclick", "TraX.DataView.lapListClick(" + i + ");");

    var title = document.createElement('p');
    title.classList.add("lapNum");
    title.id = "lapNum" + i;
    title.innerHTML = "#" + (i < 0 ? i : (i + 1));
    header.appendChild(title);

    var time = document.createElement('a');
    time.classList.add("lapListSubHeader");
    time.id = "lapListSubHeader" + i;
    time.innerHTML =
        TraX.Common.formatMsec(sessionSummary.laps[i].duration);
    if (length > 1) {
      if (sessionSummary.fastestLap.lap == i) {
        time.classList.add("greenText");
      } else if (sessionSummary.slowestLap.lap == i) {
        time.classList.add("redText");
      }
    }
    header.appendChild(time);
    newRow.appendChild(header);

    var mapButton = document.createElement('button');
    mapButton.classList.add("lapListMapButton");
    mapButton.classList.add("links");
    mapButton.classList.add("nohover");
    mapButton.id = "lapListMapButton" + i;
    mapButton.setAttribute(
        "onclick", "TraX.DataView.MyMap.showMap(" +
            sessionSummary.laps[i].startIndex + ", " +
            sessionSummary.laps[i].endIndex + ");");
    mapButton.innerHTML = "Map";
    newRow.appendChild(mapButton);

    // Main Body
    var info = document.createElement('div');
    info.classList.add("lapListBody");
    info.id = "lapListBody" + i;

    // Times
    info.appendChild(
        createRow(
            "listBodyRowTitle", "listBodyRowVal", "Start: ",
            TraX.Common.formatMsec(
                sessionData[sessionSummary.laps[i].startIndex]
                           ["clientTimestamp"] -
                sessionData[0]["clientTimestamp"]) +
                " " +
                TraX.Common.formatTime(
                    sessionData[sessionSummary.laps[i].startIndex]
                               ["clientTimestamp"])));
    info.appendChild(
        createRow(
            "listBodyRowTitle", "listBodyRowVal", i < 0 ? "Length: " : "Lap: ",
            TraX.Common.formatMsec(sessionSummary.laps[i].duration)));
    if (i >= 0 && length > 1) {
      var fastColor = sessionSummary.fastestLap.lap == i ?
          " greenText" :
          " redText";
      info.appendChild(
          createRow(
              "listBodyRowTitle", "listBodyRowVal" + fastColor, "Split: ",
              TraX.Common.formatMsec(
                  sessionSummary.laps[i].duration -
                      sessionSummary.fastestLap.val,
                  true)));
    }
    // Speeds
    var fastColor =
        sessionSummary.speeds.topSpeed.lap == i ? " greenText" : "";
    info.appendChild(
        createRow(
            "listBodyRowTitle", "listBodyRowVal" + fastColor, "Top Speed: ",
            TraX.Units.speedToUnit(sessionSummary.laps[i].topSpeed.val) +
                TraX.Units.getLargeSpeedUnit(),
            sessionSummary.laps[i].topSpeed.index));
    info.appendChild(
        createRow(
            "listBodyRowTitle", "listBodyRowVal", "Avg Speed: ",
            TraX.Units.speedToUnit(sessionSummary.laps[i].avgSpeed) +
                TraX.Units.getLargeSpeedUnit()));
    fastColor =
        sessionSummary.speeds.lowestSpeed.lap == i ? " redText" : "";
    info.appendChild(
        createRow(
            "listBodyRowTitle", "listBodyRowVal" + fastColor, "Lowest Speed: ",
            TraX.Units.speedToUnit(sessionSummary.laps[i].lowestSpeed.val) +
                TraX.Units.getLargeSpeedUnit(),
            sessionSummary.laps[i].lowestSpeed.index));

    // G-Force
    fastColor = sessionSummary.maxGForce.lap == i ? " greenText" : "";
    info.appendChild(
        createRow(
            "listBodyRowTitle", "listBodyRowVal" + fastColor, "Max G-Force: ",
            sessionSummary.laps[i].maxGForce.val + "G",
            sessionSummary.laps[i].maxGForce.index));

    newRow.appendChild(info);
    lapListDom.appendChild(newRow);
  }
}
// Creates a row with the given classes and text for the elements. Called in
// showLapList().
function createRow(titleClass, valClass, title, val, clickIndex) {
  var row = document.createElement('p');
  var title_ = document.createElement('a');
  var classes = titleClass.split(" ").filter(obj => obj.length > 0);
  for (var i = 0; i < classes.length; i++) title_.classList.add(classes[i]);
  title_.appendChild(document.createTextNode(title));
  row.appendChild(title_);

  var val_ = document.createElement('a');
  classes = valClass.split(" ");
  for (var i = 0; i < classes.length; i++) val_.classList.add(classes[i]);
  val_.appendChild(document.createTextNode(val));
  row.appendChild(val_);

  if (clickIndex) addClickIndexCallback(row, clickIndex);
  return row;
}
function addClickIndexCallback(div, index) {
  div.style.cursor = "pointer";
  div.href = "#";
  div.onclick = function() {
    DataView.MyMap.showMessageWindowIndex(index);
  };
}
// A lap was clicked in the lap list. It should be expanded or collapsed.
DataView.lapListClick = function(num) {
  document.getElementById("lapNum" + num).classList.toggle("expanded");
  document.getElementById("lapListSubHeader" + num).classList.toggle("expanded");
  document.getElementById("lapListMapButton" + num).classList.toggle("expanded");
  document.getElementById("lapListBody" + num).classList.toggle("expanded");
};
// If there is a gap larger than maxGapInSession in the session data, then this
// can be considered a multi-session.
function isMultiSession(sessionData) {
  for (var i = 1; i < sessionData.length; i++) {
    if (sessionData[i]["clientTimestamp"] -
            sessionData[i - 1]["clientTimestamp"] >
        maxGapInSession) {
      return true;
    }
  }
  return false;
}
// Calculates start and end times of each session if this is a multi session, or
// just the start and end of the only session.
function getDurations(sessionData) {
  var numDurations = 0;
  var durations = [[]];
  var start = sessionData[0]["clientTimestamp"];
  for (var i = 1; i < sessionData.length; i++) {
    if (sessionData[i]["clientTimestamp"] -
            sessionData[i - 1]["clientTimestamp"] >
        maxGapInSession) {
      durations[numDurations] = [start, sessionData[i - 1]["clientTimestamp"]];
      numDurations++;
      start = sessionData[i]["clientTimestamp"];
    }
  }
  durations[numDurations] =
      [start, sessionData[sessionData.length - 1]["clientTimestamp"]];

  return durations;
}
// Assumes there is data before crossing the start line for the first time and
// data after crossing the finish line for the final time. Gets summary for each
// lap and calculates lap times.
function getLaps(sessionData) {
  var laps = {};
  var numLap = 0;
  var numNonLap = 1;
  var startTime = sessionData[0]["clientTimestamp"];
  var endTime = sessionData[sessionData.length - 1]["clientTimestamp"];
  var startPoint = DataView.getStartLine();
  var endPoint = DataView.getFinishLine();

  // TODO: Skip gap between multi-session?
  // TODO: Pick last time to cross start instead of first if crossed multiple
  // times?
  var previousIndex = 0;
  var previousTime = 0;
  while (previousIndex < sessionData.length - 1) {
    if (TraX.debugMode >= 2) console.log("Next Lap");
    var lapStart = getTimeAtPosition(
        startPoint.coord, previousTime - 2, startPoint.radius, false,
        sessionData);
    var startIndex = getIndexAtTime(lapStart, undefined, sessionData);

    var lapEnd = getTimeAfterPosition(
        startPoint.coord, lapStart, startPoint.radius, sessionData);
    var newLapEnd = getTimeAtPosition(
        endPoint.coord, lapEnd, endPoint.radius, false, sessionData);
    var endIndex = getIndexAtTime(newLapEnd, undefined, sessionData);

    // Duration between end of previous and start of this lap
    if (startIndex != previousIndex) {
      laps[-numNonLap] = getSectionSummary(
          previousIndex, startIndex,
          {lap: -numNonLap, lapStart: lapStart, sessionStart: startTime},
          sessionData);
      laps[-numNonLap].color = "#000000";
      laps[-numNonLap++].duration = lapStart - previousTime;
    }

    if (startIndex == sessionData.length - 1) {
      break;
    }
    if (endIndex == sessionData.length - 1) {
      // Duration between start of lap and end of session
      laps[-numNonLap] = getSectionSummary(
          startIndex, endIndex,
          {lap: -numNonLap, lapStart: lapStart, sessionStart: startTime},
          sessionData);
      laps[-numNonLap].color = "#000000";
      laps[-numNonLap++].duration = newLapEnd - lapStart;
      break;
    }

    if (previousIndex >= endIndex) {
      if (previousIndex == sessionData.length - 1) {
        break;
      } else {
        endIndex = sessionData.length - 1;
      }
    }
    previousIndex = endIndex;
    previousTime = lapEnd;
    laps[numLap] = getSectionSummary(
        startIndex, endIndex,
        {lap: numLap + 1, lapStart: lapStart, sessionStart: startTime},
        sessionData);
    laps[numLap].color = DataView.MyMap.getColor(numLap + numNonLap);
    laps[numLap++].duration = newLapEnd - lapStart;
    sessionData[startIndex]["lap"] = numLap;
  }
  laps.length = numLap;
  laps.neglength = -numNonLap + 1;
  return laps;
}
// Gets summary for given section between start and end indexes. setData will
// set the given object of data in every datapoint in sessionData between the
// given indexes.
function getSectionSummary(startIndex, endIndex, setData, sessionData) {
  var duration = sessionData[endIndex]["clientTimestamp"] -
      sessionData[startIndex]["clientTimestamp"];
  var speedTotal = 0;
  var speedCount = 0;
  var topSpeed = {val: 0, index: 0};
  var lowestSpeed = {val: 10000, index: 0};
  var maxGForce = {val: 0, index: 0};
  var maxAlt = 0;
  var minAlt = 0;
  for (var i = startIndex; i <= endIndex; i++) {
    if (sessionData[i]["gpsSpeed"] != "null") {
      var speed = sessionData[i]["gpsSpeed"];
      if (speed > 0) {
        if (speed > topSpeed.val) {
          topSpeed.val = speed;
          topSpeed.index = i;
        }
        if (speed < lowestSpeed.val) {
          lowestSpeed.val = speed;
          lowestSpeed.index = i;
        }
        speedTotal += speed;
        speedCount++;
      }
      if (sessionData[i]["altitude"] != "null" && sessionData[i]["altitude"]) {
        var alt = sessionData[i]["altitude"];
        if (!maxAlt || alt > maxAlt) maxAlt = alt;
        if (!minAlt || alt < minAlt) minAlt = alt;
      }
    }

    var gForce = DataView.sensorsToGForce(i);
    if (gForce > maxGForce.val) {
      maxGForce.val = gForce;
      maxGForce.index = i;
    }

    if (setData) sessionData[i] = Object.assign(sessionData[i], setData);
  }
  var avgSpeed;
  if (speedCount > 0) avgSpeed = speedTotal / speedCount;
  else avgSpeed = 0;
  if (lowestSpeed == 10000) lowestSpeed = 0;

  maxGForce.val = Math.round(maxGForce.val / Agrav * 100.0) / 100.0;

  return {
    startIndex: startIndex,
    endIndex: endIndex,
    startTime: sessionData[startIndex]["clientTimestamp"],
    endTime: sessionData[endIndex]["clientTimestamp"],
    duration: duration,
    topSpeed: topSpeed,
    lowestSpeed: lowestSpeed,
    avgSpeed: avgSpeed,
    maxGForce: maxGForce,
    maxAltitude: maxAlt,
    minAltitude: minAlt
  };
}
function arrayToRad(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr.push(arr[i] / 180.0 * Math.PI);
  }
  return newArr;
}
// Given raw sensor data, rectify to be correctly rotated relative to the
// vehicle. Also removes Agrav.
DataView.transformSensors = function(data) {
  var gyro = data["gyro"];
  var accelIncGrav = data["accelIncGrav"];
  var browserType = TraX.getBrowser(data["userAgent"]);
  var isOld = typeof data["traxVersion"] === 'undefined';

  // TODO: Rotate gyro by offset from forwards in all versions.
  if (isOld) gyro = arrayToRad(gyro);

  accelIncGrav = [-accelIncGrav[0], accelIncGrav[1], accelIncGrav[2]];
  if (browserType == "Chrome") {
    for (var i = 0; i < accelIncGrav.length; i++) accelIncGrav[i] *= -1;
  }
  var rotatedAccel = TraX.Common.rotateVector(accelIncGrav, gyro, true);
  rotatedAccel.z += Agrav;
  return rotatedAccel;
};
// Given an index or datapoint, calculate the magnitude of G-force at the
// instant.
DataView.sensorsToGForce = function(data) {
  if (typeof data === "number") data = sessionData[data];
  var rotatedAccel = DataView.transformSensors(data);
  return Math.hypot(rotatedAccel.x, rotatedAccel.y, rotatedAccel.z);
};
// Request the list of tracks from server.
DataView.fetchTrackList = function() {
  DataView.trackList = [];
  TraX.socket.emit('requesttracklist', "track");
  TraX.socket.emit('requesttracklist', "track", "myself");
  for (var i = 0; i < TraX.friendsList.length; i++) {
    TraX.socket.emit('requesttracklist', "track", TraX.friendsList[i].id);
  }
};
// Request the list of configs from the server.
DataView.fetchTrackConfigList = function(track) {
  var req;
  var userId = "";
  if (!track) {
    req = DataView.trackData.trackId;
    userId =
        DataView.trackData.trackOwnerId ? DataView.trackData.trackOwnerId : 0;
  } else {
    req = track.id;
    userId = track.ownerId;
  }
  TraX.socket.emit('requesttracklist', req, userId);
};
// Set current track data to match requested params.
function fetchTrackData() {
  for (var i = 0; i < DataView.trackList.length; i++) {
    if (DataView.trackList[i].id == DataView.trackData.trackId &&
        DataView.trackList[i].ownerId == DataView.trackData.trackOwnerId) {
      DataView.trackData.track = DataView.trackList[i];
      return;
    }
  }
  if (trackList.length > 0) DataView.trackData.track = DataView.trackList[0];
}
// Set current config data to match requested params.
function fetchTrackConfigData() {
  for (var i = 0; i < DataView.getConfigList().length; i++) {
    if (DataView.getConfigList()[i].id == DataView.trackData.configId &&
        DataView.getConfigList()[i].ownerId ==
            DataView.trackData.configOwnerId) {
      DataView.trackData.config = DataView.getConfigList()[i];
      return;
    }
  }
  if (DataView.getConfigList().length > 0)
    DataView.trackData.config = DataView.getConfigList()[0];
}
// Ensure all track data and config data required is received for current
// selections.
function pickTrack() {
  if (lastFetchState == fetchState) pickTrackCount++;
  else pickTrackCount = 0;
  lastFetchState = fetchState;
  if (pickTrackCount > 300) {
    console.warn("PICK TRACK STUCK AT FETCH STATE:", fetchState);
    fetchState++;
  }
  if (fetchState <= 2 && DataView.trackList.length == 0) {
    if (fetchState <= 1) DataView.fetchTrackList();
    fetchState = 2;
    clearTimeout(pickTrackTimeout);
    pickTrackTimeout = setTimeout(pickTrack, 10);
    return;
  }
  if (fetchState <= 3 &&
      (!DataView.trackData.track ||
       (DataView.trackData.track.id != DataView.trackData.trackId ||
        DataView.trackData.track.ownerId != DataView.trackData.trackOwnerId))) {
    fetchTrackData();
    fetchState = 3;
    clearTimeout(pickTrackTimeout);
    pickTrackTimeout = setTimeout(pickTrack, 10);
    return;
  }
  if (fetchState == 3 && DataView.getConfigList().length > 0) {
    DataView.changeConfig(DataView.getConfigList()[0], true);
  }
  if (fetchState <= 4 &&
      DataView.getConfigList(
                  new DataView.Track(
                      DataView.trackData.trackName, DataView.trackData.trackId,
                      DataView.trackData.trackOwnerId))
              .length == 0) {
    if (fetchState <= 3) DataView.fetchTrackConfigList();
    fetchState = 4;
    clearTimeout(pickTrackTimeout);
    pickTrackTimeout = setTimeout(pickTrack, 10);
    return;
  }
  if (fetchState <= 5 &&
      (!DataView.trackData.config ||
       (DataView.trackData.config.id != DataView.trackData.configId ||
        DataView.trackData.config.ownerId != DataView.trackData.configOwnerId ||
        DataView.trackData.config.trackId != DataView.trackData.trackId))) {
    fetchTrackConfigData();
    fetchState = 5;
    clearTimeout(pickTrackTimeout);
    pickTrackTimeout = setTimeout(pickTrack, 10);
    return;
  }
  if (TraX.debugMode) {
    console.log(
        "Ending fetchState:", fetchState, "TrackData:", DataView.trackData);
  }

  showTrackNames();
  fetchState = 0;
  dataTitleDom.innerHTML = "Refreshing...";
  if (shouldDetermineTrack) {
    shouldDetermineTrack = false;
    DataView.autoPickTrack();
  }
  DataView.updateSessionData();
}
// Automatically determine the closest track to data, then change selected track
// to the closest track if it can be determined.
DataView.autoPickTrack = function(forceUseCoord) {
  var newTrack;
  if (!forceUseCoord) {
    for (var i = 0; i < DataView.trackList.length; i++) {
      if (currentSession.trackId == DataView.trackList[i].id &&
          currentSession.trackOwnerId == DataView.trackList[i].ownerId) {
        newTrack = DataView.trackList[i];
      }
    }
  }
  if (newTrack) {
    console.log("Determining track via sessionData");
  } else {
    newTrack = DataView.determineTrack();
  }
  if (newTrack) DataView.changeTrack(newTrack);
};
// Determine the closest track to the given coordinates. A maximum distance of
// 10km is checked.
DataView.determineTrack = function(coord) {
  if (!DataView.trackList || (!coord && !DataView.coordAverage.coord))
    return null;
  if (!coord) coord = DataView.coordAverage.coord;
  var closest = {dist: 10 * 1000, index: -1}; // 10km maximum
  for (var i = 0; i < DataView.trackList.length; i++) {
    var dist = TraX.Units.latLngToMeters(DataView.trackList[i].coord, coord);
    if (dist < closest.dist) {
      closest.dist = dist;
      closest.index = i;
    }
  }

  if (closest.index >= 0) {
    console.log(
        "Closest track to center of data:", DataView.trackList[closest.index]);
    return DataView.trackList[closest.index];
  } else {
    if (TraX.debugMode)
      console.log("Couldn't determine closest track to:", coord);
    return null;
  }
};
// A new track has been selected. Change relevant information to request
// necessary data.
DataView.changeTrack = function(newTrack) {
  if (TraX.debugMode) console.log("Changing track to", newTrack);
  DataView.trackData.trackName = newTrack.name;
  DataView.trackData.trackId = newTrack.id;
  DataView.trackData.trackOwnerId = newTrack.ownerId;
  DataView.trackData.configName = "";
  trackNameDom.innerHTML = "";
  trackNameDom.appendChild(document.createTextNode(newTrack.name));
  var ownerId = newTrack.ownerId;
  trackConfigDom.setAttribute(
      'onclick', 'TraX.DataView.toggleDataViewOverlay(true, ' +
          DataView.trackData.trackId + ',"' + ownerId + '");');
  fetchState = 0;
  pickTrack();
};
// A new config has been selected. Change relevant information to request
// necessary data.
DataView.changeConfig = function(newConfig, norefresh) {
  if (TraX.debugMode) console.log("Changing config to", newConfig);
  DataView.trackData.configName = newConfig.name;
  DataView.trackData.configId = newConfig.id;
  DataView.trackData.configOwnerId = newConfig.ownerId;
  trackConfigDom.innerHTML = "";
  trackConfigDom.appendChild(document.createTextNode(newConfig.name));
  if (!norefresh) pickTrack();
};
// Get the name of the currently selected track.
function getTrackName(track, useIdAsName) {
  if (!track) {
    if (DataView.trackData && DataView.trackData.trackName) {
      return DataView.trackData.trackName;
    } else {
      return "";
    }
  } else {
    for (var i = 0; i < DataView.trackList.length; i++) {
      if (DataView.trackList[i].id == track.id &&
          DataView.trackList[i].ownerId == track.ownerId) {
        if (!useIdAsName || DataView.trackList[i].name) {
          return DataView.trackList[i].name;
        } else {
          return DataView.trackList[i].trackOwnerId + "," +
              DataView.trackList[i].trackId;
        }
      }
    }
    if (!useIdAsName) {
      return "";
    } else {
      return track.ownerId + "," + track.id;
    }
  }
}
// Get the name of the currently selected config.
function getTrackConfigName() {
  if (DataView.trackData && DataView.trackData.configName) {
    return DataView.trackData.configName;
  } else {
    return "";
  }
}
// Get the list of configs for the currently selected track from buffer.
DataView.getConfigList = function(track) {
  if (!track) track = DataView.trackData.track;
  if (!track) return [];

  return DataView.configList[track.id + "," + (track.ownerId || "")] || [];
};
// New track or config data is received from server. Store it properly.
function handleNewTrackData(data, request, ownerId) {
  if (typeof data === 'string') {
    if (data !== 'readerror') {
      data = JSON.parse(data);
    } else {
      console.warn("TrackData Readerr", data, request);
      return;
    }
  }
  if (request == 'track') {
    if (ownerId == TraX.getDriverId()) {
      data = data.map(function(obj) {
        obj.name = "You: " + obj.name;
        return obj;
      });
    } else if (ownerId) {
      var prefix = "F: ";
      for (var i = 0; i < TraX.friendsList.length; i++) {
        if (TraX.friendsList[i].id == ownerId) {
          prefix = TraX.friendsList[i].firstName[0] +
              TraX.friendsList[i].lastName[0] + ": ";
          break;
        }
      }
      data = data.map(function(obj) {
        obj.name = prefix + obj.name;
        return obj;
      });
    }
    if (DataView.trackList.length > 0) {
      Array.prototype.push.apply(DataView.trackList, data);
    } else {
      DataView.trackList = data;
    }
    if (TraX.debugMode) console.log("New track list:", DataView.trackList);
    if (!DataView.trackData.trackOwnerId) {
      DataView.changeTrack(data[0]);
    }
    showTrackNames();
  } else {
    DataView.configList[request + "," + (ownerId || "")] = data;
    if (TraX.debugMode) console.log("New config list:", DataView.configList);
    if (!DataView.trackData.config ||
        DataView.trackData.config.trackId != DataView.trackData.track.id) {
      DataView.changeConfig(data[0]);
    }
  }
  showTrackNames();
}
// Toggle track and config choosing overlay. Force forces open or closed.
// TrackId will auto-select the track if ownerId is also set.
DataView.toggleDataViewOverlay = function(force, trackId, ownerId) {
  if (typeof force !== 'boolean') {
    dataViewOverlay.classList.toggle('visible');
  } else if (force) {
    dataViewOverlay.classList.add('visible');
    resetDataViewOverlay(true);
    if (typeof trackId === 'string') {
      if (trackId == -1) {
        DataView.dataOverlayBack();
        DataView.dataOverlayBack();
      } else {
        DataView.dataOverlayBack();
        DataView.handleClickTrackName(trackId, ownerId);
      }
    }
  } else {
    console.log('Closing dataview overlay', force, trackId, ownerId);
    if (DataView.editTrackMode) TraX.goBack();
    dataViewOverlay.classList.remove('visible');
  }
  if (dataViewOverlay.classList.contains('visible')) {
    lapListDom.style.display = "none";
    downloadOverlayDom.classList.remove('visible');
  } else {
    lapListDom.style.display = "block";
  }
};
// Track name in dataViewOverlay was selected.
DataView.handleClickTrackName = function(trackId, ownerId) {
  if (TraX.debugMode) console.log("Clicked trackname:", trackId, ownerId);
  var track;
  for (var i = 0; i < DataView.trackList.length; i++) {
    if (DataView.trackList[i].id == trackId &&
        DataView.trackList[i].ownerId == ownerId) {
      track = DataView.trackList[i];
      break;
    }
  }
  if (!track) return;
  DataView.changeTrack(track);
  showTrackNames();
  trackListDom.classList.add("covered");
  configListDom.classList.remove("hidden");
  if (trackListTitlesDom.children.length > 0)
    trackListTitlesDom.children[0].remove();
  var newTitle = document.createElement("p");
  newTitle.innerHTML = "<strong>Track:</strong> ";
  newTitle.appendChild(document.createTextNode(track.name));
  trackListTitlesDom.innerHTML = newTitle.outerHTML;
  if (TraX.debugMode) console.log("Editing session?", currentSession);
  if (currentSession && currentSession.ownerId == TraX.getDriverId()) {
    if (TraX.debugMode) console.log("Editing session", currentSession, track);
    currentSession.trackId = trackId;
    currentSession.trackOwnerId = ownerId;
    currentSession.configId = undefined;
    currentSession.configOwnerId = undefined;
    TraX.socket.emit(
        'editsession', currentSession.name, trackId, ownerId, undefined,
        undefined, currentSession.id);
  }
};
// Config name was selected in dataViewOverlay.
DataView.handleClickConfigName = function(configId, ownerId) {
  if (TraX.debugMode) console.log("Clicked configname:", configId, ownerId);
  var config;
  for (var i = 0; i < DataView.getConfigList().length; i++) {
    if (DataView.getConfigList()[i].id == configId &&
        DataView.getConfigList()[i].ownerId == ownerId) {
      config = DataView.getConfigList()[i];
      break;
    }
  }
  if (!config) return;
  DataView.changeConfig(config);
  // configListDom.classList.add("covered");
  // carListDom.classList.remove("hidden");
  DataView.toggleDataViewOverlay(false);
  if (trackListTitlesDom.children.length > 1)
    trackListTitlesDom.children[1].remove();
  var newTitle = document.createElement("p");
  newTitle.innerHTML = "<strong>Config:</strong> ";
  newTitle.appendChild(document.createTextNode(config.name));
  trackListTitlesDom.appendChild(newTitle);
  if (currentSession && currentSession.ownerId == TraX.getDriverId()) {
    if (TraX.debugMode) console.log("Editing session", currentSession, config);
    currentSession.configId = configId;
    currentSession.configOwnerId = ownerId;
    TraX.socket.emit(
        'editsession', currentSession.name, currentSession.trackId,
        currentSession.trackOwnerId, configId, ownerId, currentSession.id);
  }
};
// The back button was pressed in dataViewOverlay.
DataView.dataOverlayBack = function() {
  if (configListDom.classList.contains('covered')) {
    carListDom.classList.add('hidden');
    configListDom.classList.remove('covered');
    if (trackListTitlesDom.children.length > 2)
      trackListTitlesDom.children[2].remove();
  } else if (!configListDom.classList.contains('hidden')) {
    configListDom.classList.add('hidden');
    trackListDom.classList.remove('covered');
    if (trackListTitlesDom.children.length > 1)
      trackListTitlesDom.children[1].remove();
  }
};
// Reset UI in overlay to fresh. Does not clear data or change values.
// Deselects all values and goes to first visible menu.
function resetDataViewOverlay(refresh) {
  for (var i = 1; i < trackListDom.childNodes.length; i++) {
    if (typeof trackListDom.childNodes[i].classList !== 'undefined') {
      if (trackListDom.childNodes[i].tagName == "BUTTON" &&
          trackListDom.childNodes[i].innerHTML.indexOf(getTrackName()) == 0) {
        trackListDom.childNodes[i].classList.add('selected');
      } else {
        trackListDom.childNodes[i].classList.remove('selected');
      }
    }
  }
  for (var i = 1; i < configListDom.childNodes.length; i++) {
    if (typeof configListDom.childNodes[i].classList !== 'undefined') {
      if (configListDom.childNodes[i].tagName == "BUTTON" &&
          configListDom.childNodes[i].innerHTML.indexOf(getTrackConfigName()) ==
              0 &&
          getTrackConfigName()) {
        configListDom.childNodes[i].classList.add('selected');
      } else {
        configListDom.childNodes[i].classList.remove('selected');
      }
    }
  }
  if (!refresh) {
    trackListDom.classList.remove("covered");
    configListDom.classList.remove("covered");
    configListDom.classList.add("hidden");
    carListDom.classList.add("hidden");
  }
}
// Shows the track and config names in the dataViewOverlay list.
function showTrackNames() {
  // trackNameDom.innerHTML = "";
  // trackConfigDom.innerHTML = "";
  trackListDom.innerHTML = trackListDom.firstElementChild.outerHTML;
  configListDom.innerHTML = configListDom.firstElementChild.outerHTML;
  if (DataView.trackList.length == 0) {
    DataView.fetchTrackList();
    return;
  }
  trackNameDom.innerHTML = "";
  trackNameDom.appendChild(
      document.createTextNode(DataView.trackData.trackName));
  trackConfigDom.innerHTML = "";
  trackConfigDom.appendChild(
      document.createTextNode(DataView.trackData.configName));
  for (var i = 0; i < DataView.trackList.length; i++) {
    var opt = document.createElement("button");
    opt.appendChild(document.createTextNode(DataView.trackList[i].name));
    var ownerId = DataView.trackList[i].ownerId;
    opt.setAttribute(
        'onclick', 'TraX.DataView.handleClickTrackName(' +
            DataView.trackList[i].id + ',"' + ownerId + '");');

    if (ownerId == TraX.getDriverId()) {
      var deleteIcon = document.createElement("img");
      deleteIcon.src = "https://dev.campbellcrowley.com/trax/images/trash.png";
      deleteIcon.href = "#";
      deleteIcon.setAttribute(
          "onclick", "TraX.DataView.deleteTrack(" + DataView.trackList[i].id +
              ",\"" + ownerId + "\")");
      opt.appendChild(deleteIcon);

      var editIcon = document.createElement("img");
      editIcon.src = "https://dev.campbellcrowley.com/trax/images/pencil.png";
      editIcon.href = "#";
      editIcon.setAttribute(
          "onclick", "TraX.DataView.editTrack(" + DataView.trackList[i].id +
              ",\"" + ownerId + "\")");
      opt.appendChild(editIcon);
    }

    trackListDom.appendChild(opt);
  }
  resetDataViewOverlay(true);
  if (DataView.getConfigList().length == 0) return;
  for (var i = 0; i < DataView.getConfigList().length; i++) {
    var opt = document.createElement("button");
    opt.appendChild(document.createTextNode(DataView.getConfigList()[i].name));
    var ownerId = DataView.getConfigList()[i].ownerId;
    opt.setAttribute(
        'onclick', 'TraX.DataView.handleClickConfigName(' +
            DataView.getConfigList()[i].id + ',"' + ownerId + '");');

    if (ownerId == TraX.getDriverId()) {
      var deleteIcon = document.createElement("img");
      deleteIcon.src = "https://dev.campbellcrowley.com/trax/images/trash.png";
      deleteIcon.href = "#";
      deleteIcon.setAttribute(
          "onclick", "TraX.DataView.deleteConfig(" +
              DataView.getConfigList()[i].id + ",\"" + ownerId + "\")");
      opt.appendChild(deleteIcon);

      var editIcon = document.createElement("img");
      editIcon.src = "https://dev.campbellcrowley.com/trax/images/pencil.png";
      editIcon.href = "#";
      editIcon.setAttribute(
          "onclick", "TraX.DataView.editConfig(" +
              DataView.getConfigList()[i].id + ",\"" + ownerId + "\")");
      opt.appendChild(editIcon);
    }

    configListDom.appendChild(opt);
  }
  resetDataViewOverlay(true);
}
// Deletes a track from a user after confirmation from user.
DataView.deleteTrack = function(trackId, ownerId) {
  var track;
  for (var i = 0; i < DataView.trackList.length; i++) {
    if (DataView.trackList[i].id == trackId &&
        DataView.trackList[i].ownerId == ownerId) {
      track = DataView.trackList[i];
      break;
    }
  }
  if (track.ownerId != TraX.getDriverId()) {
    TraX.showMessageBox("You can't delete that track.");
    setTimeout(DataView.dataOverlayBack);
    return;
  }
  if (confirm(
          "Are you sure you wish to delete \"" + track.name +
          "\"? All of its configurations will also be deleted. This cannot be undone")) {
    TraX.socket.emit('deletefolder', track.id, ownerId);
    console.log("Deleting track", track);
    setTimeout(DataView.fetchTrackList, 50);
    setTimeout(TraX.requestFilesize, 50);
  }
  setTimeout(DataView.dataOverlayBack);
};
// Renames a user's track to their given input.
DataView.editTrack = function(trackId, ownerId) {
  var track;
  for (var i = 0; i < DataView.trackList.length; i++) {
    if (DataView.trackList[i].id == trackId &&
        DataView.trackList[i].ownerId == ownerId) {
      track = DataView.trackList[i];
      break;
    }
  }
  if (!track) return;
  if (track.ownerId != TraX.getDriverId()) {
    TraX.showMessageBox("You can't edit that track.");
    setTimeout(DataView.dataOverlayBack);
    return;
  }
  // DataView.changeTrack(track);
  setTimeout(DataView.MyMap.handleClickEditTrack, 100);
  /*var input = prompt(
      "What would you like \"" + track.name + "\" to be named?", track.name);
  if (input) {
    TraX.socket.emit('editfolder', track.id, input, ownerId);
    console.log("Renaming track", track, "to", input);
    DataView.fetchTrackList();
  }*/
  setTimeout(DataView.dataOverlayBack);
};
// Deletes a user's track config after confirmation.
DataView.deleteConfig = function(configId) {
  var config;
  for (var i = 0; i < DataView.getConfigList().length; i++) {
    if (DataView.getConfigList()[i].id == configId) {
      config = DataView.getConfigList()[i];
      break;
    }
  }
  if (!config) {
    console.warn("Failed to delete config", configId, DataView.getConfigList());
    return;
  }
  if (confirm(
          "Are you sure you wish to delete \"" + config.name +
          "\"? This cannot be undone")) {
    TraX.socket.emit(
        'deletefolder', DataView.trackData.track.id + "/" + config.id, ownerId);
    console.log(
        "Deleting config", DataView.trackData.track.name + "(" +
            DataView.trackData.track.id + ")/" + config.name + "(" + config.id +
            ")");
    setTimeout(DataView.fetchTrackConfigList, 50);
    setTimeout(TraX.requestFilesize, 50);
  }
  setTimeout(function() { DataView.toggleDataViewOverlay(true); });
};
// Renames a user's track config.
DataView.editConfig = function(configId) {
  var config;
  for (var i = 0; i < DataView.getConfigList().length; i++) {
    if (DataView.getConfigList()[i].id == configId) {
      config = DataView.getConfigList()[i];
      break;
    }
  }
  if (!config) {
    console.log("Failed to rename config", configId, DataView.getConfigList());
    return;
  }

  // DataView.changeConfig(config);
  setTimeout(DataView.MyMap.handleClickEditConfig, 100);

  /*var input = prompt(
      "What would you like \"" + config.name + "\" to be named?", config.name);
  if (input) {
    TraX.socket.emit(
        'editfolder', DataView.trackData.track.id + "/" + config.id, input,
        ownerId);
    console.log("Renaming config", config, "to", input);
    DataView.fetchTrackConfigList();
  }*/
  setTimeout(function() {
    DataView.toggleDataViewOverlay(true, config.trackId, config.ownerId);
  });
};
// Gets the start line information for the current track config.
DataView.getStartLine = function() {
  if (!DataView.trackData.config) return null;
  return DataView.trackData.config.start;
};
// Gets the finish line information for the current track config.
DataView.getFinishLine = function() {
  if (!DataView.trackData.config) return null;
  return DataView.trackData.config.finish;
};
// Get sessionData at the time closest to msecs after start of data. If
// forceAfter, it will find the closest index after msecs, otherwise index could
// be before.
function getIndexAtTime(msecs, forceAfter, sessionData) {
  var start = sessionData[0]["clientTimestamp"];
  for (var i = 0; i < sessionData.length; i++) {
    var thisTime = sessionData[i]["clientTimestamp"] - start;
    if (thisTime >= msecs) {
      if (!forceAfter && i > 0 &&
          Math.abs(msecs - (sessionData[i - 1]["clientTimestamp"] - start)) <
              thisTime - msecs) {
        return i - 1;
      }
      return i;
    }
  }
  return msecs > 0 ? sessionData.length - 1 : 0;
}
// Returns datapoint closest to given coordinates and after msecs if given.
DataView.getDataAtPosition = function(coord, msecs, data) {
  if (typeof data === 'undefined') data = sessionData;
  return DataView.getDataAtIndex(
      getIndexAtTime(
          getTimeAtPosition(
              coord, msecs || 0, DataView.getStartLine().radius, !msecs, data),
          false, data),
      data);
};
DataView.getDataAtIndex = function(index, data) {
  if (typeof data === 'undefined') data = sessionData;
  var prevPos = {coord: {lat: 0, lng: 0}, speed: 0, time: 0};
  var nextPos = {coord: {lat: 0, lng: 0}, speed: 0, time: 0};
  for (var i = index; i >= 0; i--) {
    if (data[i]["latitude"] && data[i]["longitude"]) {
      prevPos = {
        coord: {lat: data[i]["latitude"], lng: data[i]["longitude"]},
        speed: data[i]["gpsSpeed"],
        time: data[i]["clientTimestamp"]
      };
      break;
    }
  }
  for (var i = index; i < data.length; i++) {
    if (data[i]["latitude"] && data[i]["longitude"]) {
      nextPos = {
        coord: {lat: data[i]["latitude"], lng: data[i]["longitude"]},
        speed: data[i]["gpsSpeed"],
        time: data[i]["clientTimestamp"]
      };
      break;
    }
  }
  var shiftedNextTime = nextPos.time - prevPos.time;
  var shiftedThisTime = data[index]['clientTimestamp'] - prevPos.time;
  var intVal = shiftedThisTime / shiftedNextTime || 0;
  sessionData[index].estimatedCoord =
      TraX.Common.interpolateCoord(prevPos.coord, nextPos.coord, intVal);
  sessionData[index].estimatedSpeed =
      TraX.Common.lerp(prevPos.speed, nextPos.speed, intVal);
  return sessionData[index];
};
DataView.getTimeAtIndex = function(index, data) {
  if (typeof data === 'undefined') data = sessionData;
  if (typeof index !== 'number' || index < 0 || index >= data.length) return 0;
  return data[index]['clientTimestamp'] - data[0]['clientTimestamp'];
};
// Find the first time after msecs with the point closest to the given coords.
function getTimeAtPosition(coord, msecs, tolerance, absolute, sessionData) {
  tolerance = tolerance || 360.0;
  var start = sessionData[0]["clientTimestamp"];
  var obj =
      DataView.getDataWithCoords(undefined, undefined, undefined, sessionData);
  var coords = DataView.getFilteredCoords(obj).points;
  var closest = {index: -1, dist: -1};
  for (var i = 0; i < obj.length; i++) {
    if (obj[i]["clientTimestamp"] - start > msecs) {
      var dist = TraX.Common.coordDistance(coord, coords[i]);
      if ((dist < closest.dist || closest.dist == -1) && dist <= tolerance) {
        closest = {index: i, dist: dist};
      } else if (closest.index >= 0 && !absolute) {
        if (TraX.debugMode >= 2)
          console.log(
              "POINT!", obj[closest.index]["clientTimestamp"] - start, ">",
              msecs, closest.index);
        break;
      }
    }
  }
  if (closest.index == -1) {
    return sessionData[sessionData.length - 1]["clientTimestamp"] - start;
  }
  var current = obj[closest.index];
  var next = obj[closest.index + 1];
  var previous = obj[closest.index - 1];
  var currentCoord = {lat: current["latitude"], lng: current["longitude"]};
  var nextCoord, previousCoord;
  if (next) nextCoord = {lat: next["latitude"], lng: next["longitude"]};
  if (previous)
    previousCoord = {lat: previous["latitude"], lng: previous["longitude"]};

  var lookBack = typeof previous !== "undefined";
  const increment = 0.001;

  if (typeof next !== "undefined" &&
      TraX.Common.coordDistance(
          TraX.Common.interpolateCoord(currentCoord, nextCoord, increment),
          coord) < closest.dist) {
    lookBack = false;
  } else if (!lookBack) {
    return obj[closest.index]["clientTimestamp"] - start;
  }
  var newClosest = {index: 0, dist: -1, time: 0};
  for (var i = 0; i < 1.0; i += increment) {
    var intCoord = TraX.Common.interpolateCoord(
        currentCoord, lookBack ? previousCoord : nextCoord, i);
    var dist = TraX.Common.coordDistance(intCoord, coord);
    var currentTime = TraX.Common.lerp(
        current["clientTimestamp"],
        lookBack ? previous["clientTimestamp"] : next["clientTimestamp"], i);
    if (currentTime - start > msecs &&
        (newClosest.dist < 0 || dist < newClosest.dist)) {
      newClosest = {index: i, dist: dist, time: currentTime};
    } else {
      var newTime = newClosest.time;
      if (TraX.debugMode >= 2)
        console.log(
            "Closest:", current["clientTimestamp"] - start,
            "(" + closest.index + ")", "Other:",
            (lookBack ? previous["clientTimestamp"] : next["clientTimestamp"]) -
                start,
            "newClosest:", newTime - start, "index:",
            closest.index + (lookBack ? -1 : 1) * newClosest.index);
      return newTime - start;
    }
  }
  return obj[closest.index]["clientTimestamp"] - start;
}
// Find the first time after msecs with the point closest to the given coords
// that is outside of tolerance.
function getTimeAfterPosition(coord, msecs, tolerance, sessionData) {
  tolerance = tolerance || 360.0;
  var start = sessionData[0]["clientTimestamp"];
  var obj = DataView.getDataWithCoords();
  var coords = DataView.getFilteredCoords(obj).points;
  var latest = {index: -1, dist: -1};
  for (var i = 0; i < obj.length; i++) {
    if (obj[i]["clientTimestamp"] - start > msecs) {
      var dist = TraX.Common.coordDistance(coord, coords[i]);
      // In case the first point given is within tolerance.
      if (i > 0 && latest.index == -1 && dist > tolerance) {
        dist = TraX.Common.coordDistance(coord, coords[i - 1]);
      }
      if (dist <= tolerance) {
        latest = {index: i, dist: dist};
      } else if (latest.index >= 0) {
        if (TraX.debugMode >= 2)
          console.log(
              "Final Point!", obj[latest.index]["clientTimestamp"] - start, ">",
              msecs, latest.index);
        break;
      }
    }
  }
  if (latest.index == -1) {
    return sessionData[sessionData.length - 1]["clientTimestamp"] - start;
  }
  var current = obj[latest.index];
  var next = obj[latest.index + 1];
  var currentCoord = {lat: current["latitude"], lng: current["longitude"]};
  var nextCoord;
  if (next) nextCoord = {lat: next["latitude"], lng: next["longitude"]};
  else return obj[latest.index]["clientTimestamp"] - start;

  const increment = 0.001;

  for (var i = 0; i < 1.0; i += increment) {
    var intCoord = TraX.Common.interpolateCoord(currentCoord, nextCoord, i);
    var dist = TraX.Common.coordDistance(intCoord, coord);
    if (dist > tolerance) {
      var newTime = TraX.Common.lerp(
          current["clientTimestamp"], next["clientTimestamp"], i);
      if (TraX.debugMode >= 2)
        console.log(
            "Latest:", current["clientTimestamp"] - start,
            "(" + latest.index + ")", "Other:", next["clientTimestamp"] - start,
            "newClosest:", newTime - start, "index:", latest.index + i);
      return newTime - start;
    }
  }
  return obj[latest.index]["clientTimestamp"] - start;
}
// Returns the interpolated data at a certain number of milliseconds after
// session start.
DataView.getDataAtTime = function(msecs, data) {
  if (typeof data === 'undefined') data = sessionData;
  var start = data[0]["clientTimestamp"];
  var prevIndex = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i]["clientTimestamp"] - start <= msecs) {
      prevIndex = i;
    } else {
      break;
    }
  }
  var nextIndex = getIndexAtTime(msecs, true, data);
  var shiftedNextTime =
      data[nextIndex]["clientTimestamp"] - data[prevIndex]["clientTimestamp"];
  var shiftedNowTime = msecs - (data[prevIndex]["clientTimestamp"] - start);
  var intVal = shiftedNowTime / shiftedNextTime || 0;

  var prevData = DataView.getDataAtIndex(prevIndex, data);
  var nextData = DataView.getDataAtIndex(nextIndex, data);
  var newData = {};
  Object.keys(prevData).map(function(key) {
    if (key == "estimatedCoord") {
      newData[key] =
          TraX.Common.interpolateCoord(prevData[key], nextData[key], intVal);
    } else if (typeof prevData[key] !== "number" || key === "lap") {
      newData[key] = prevData[key];
    } else {
      newData[key] = TraX.Common.lerp(prevData[key], nextData[key], intVal);
    }
  });
  return newData;
};
// Returns the interpolated position at a certain number of milliseconds after
// session start.
function getPositionAtTime(msecs) {
  var filteredPoints = DataView.getDataWithCoords();
  var start = filteredPoints[0]["clientTimestamp"];
  for (var i = 0; i < filteredPoints.length; i++) {
    if (filteredPoints[i]["clientTimestamp"] - start > msecs &&
        filteredPoints[i - 1]["clientTimestamp"] - start < msecs) {
      var prevPoint = {
        lat: filteredPoints[i - 1]["latitude"],
        lng: filteredPoints[i - 1]["longitude"],
        alt: filteredPoints[i - 1]["altitude"]
      };
      var nextPoint = {
        lat: filteredPoints[i]["latitude"],
        lng: filteredPoints[i]["longitude"],
        alt: filteredPoints[i]["altitude"]
      };
      var prevTime = filteredPoits[i - 1]["clientTimestamp"] - start;
      var nextTime = filteredPoits[i]["clientTimestamp"] - start - prevTime;
      var normalizedTime = (msecs - prevTime) / nextTime;
      return TraX.Common.interpolateCoord(prevPoint, nextPoint, normalizedTime);
    } else if (filteredPoints[i]["clientTimestamp"] - start == msecs) {
      return {
        lat: filteredPoints[i]["latitude"],
        lng: filteredPoints[i]["longitude"],
        alt: filteredPoints[i]["altitude"]
      };
    }
  }
  return null;
}
// Returns all data between start and end indexes that includes gps coordinates.
// MaxIndexes can limit the number of returned results.
DataView.getDataWithCoords = function(startIndex, endIndex, maxIndexes, data) {
  if (typeof data === 'undefined') data = sessionData;
  if (typeof startIndex === 'undefined') startIndex = 0;
  if (typeof endIndex === 'undefined') endIndex = data.length - 1;
  var numIndexes = 0;
  return data.filter(function(obj, i) {
    if (maxIndexes && numIndexes >= maxIndexes) return false;
    if (i < startIndex || i > endIndex) return false;
    if (obj === null) return false;
    if (obj['latitude'] == 0 || obj['latitude'] == 0) return false;
    numIndexes++;
    return true;
  })
};
// Get session info with given ids.
function getSession(sessionId, ownerId) {
  var index = -1;
  for (var i = 0; i < fileList.length; i++) {
    if (fileList[i].id == sessionId && fileList[i].ownerId == ownerId) {
      index = i;
      break;
    }
  }
  if (index < 0) {
    console.error("THIS SHOULD NOT HAPPEN. FAILED TO FIND SESSION");
    return;
  }
  return fileList[index];
}
// Session is clicked, request data from server.
DataView.sessionClick = function(sessionId, ownerId) {
  // if (Panes.getPane() != 0) return;
  var thisSession = getSession(sessionId, ownerId);
  HRTitle = thisSession.HRtitle;
  dataTitleDom.innerHTML = "";
  dataTitleDom.appendChild(document.createTextNode(HRTitle));
  Panes.nextPane();
  DataView.toggleDataViewOverlay(false);
  DataView.toggleDownloadOverlay(false);
  resetDataViewOverlay();
  resetSessionData();
  showSessionData();
  TraX.socket.emit('streamsession', thisSession.id, thisSession.ownerId);
  console.log("Began stream of", thisSession);
  currentSession = thisSession;
};
// Renaming session was cancelled.
DataView.cancelSessionEdit = function() {
  sessionsListOverlay.style.display = "none";
  sessionsListTextInput.style.display = "none";
};
// User requested to delete session.
DataView.deleteSession = function(sessionId, ownerId) {
  var thisSession = getSession(sessionId, ownerId);
  sessionsListOverlay.style.display = "block";
  sessionsListTextDom.innerHTML = "Are you sure you wish to delete<br>\"";
  sessionsListTextDom.appendChild(
      document.createTextNode(thisSession.HRtitle + "\"?"));
  sessionsListConfirmButton.setAttribute(
      'onclick', 'TraX.DataView.confirmDeleteSession(\'' + sessionId + '\',"' +
          ownerId + '")');
};
// User confirmed deleting session.
DataView.confirmDeleteSession = function(sessionId, ownerId) {
  var thisSession = getSession(sessionId, ownerId);
  console.log("Deleted session", thisSession);
  TraX.socket.emit("deletesession", thisSession.id);
  setTimeout(DataView.requestList, 50);
  setTimeout(TraX.requestFilesize, 50);
  if (dataTitleDom.innerHTML == thisSession.HRtitle) {
    resetSessionData();
    DataView.updateSessionData();
  }
  DataView.cancelSessionEdit();
};
// User requested to rename session.
DataView.editSession = function(sessionId, ownerId) {
  var thisSession = getSession(sessionId, ownerId);
  sessionsListOverlay.style.display = "block";
  sessionsListTextInput.style.display = "block";
  sessionsListTextDom.innerHTML = "Enter a new name for<br>\"";
  sessionsListTextDom.appendChild(
      document.createTextNode(thisSession.HRtitle + "\""));
  sessionsListTextInput.value = thisSession.HRtitle;
  sessionsListConfirmButton.setAttribute(
      'onclick', 'TraX.DataView.confirmRenameSession(\'' + sessionId + '\',"' +
          ownerId + '")');
};
// User confirmed renaming session.
DataView.confirmRenameSession = function(sessionId, ownerId) {
  var newName = sessionsListTextInput.value;
  var thisSession = getSession(sessionId, ownerId);
  console.log("Renaming session", thisSession, newName);
  if (!newName) return;
  TraX.socket.emit("renamesession", thisSession.id, newName);
  setTimeout(DataView.requestList, 50);
  dataTitleDom.innerHTML = "";
  dataTitleDom.appendChild(document.createTextNode(newName));
  DataView.cancelSessionEdit();
};
// Rename coordinate data to more common format and determine bounds of data.
DataView.getFilteredCoords = function(input, SWBound, NEBound) {
  SWBound = SWBound || {};
  NEBound = NEBound || {};
  return {
    points: (input ||
             DataView.getDataWithCoords(
                 undefined, undefined, undefined, sessionData))
                .map(function(obj) {
                  var lat = obj["latitude"];
                  var lng = obj["longitude"];
                  var alt = obj["altitude"];
                  var spd = obj["gpsSpeed"];
                  if (!SWBound["lat"] || SWBound["lat"] > lat)
                    SWBound["lat"] = lat;
                  if (!SWBound["lng"] || SWBound["lng"] > lng)
                    SWBound["lng"] = lng;
                  if (!NEBound["lat"] || NEBound["lat"] < lat)
                    NEBound["lat"] = lat;
                  if (!NEBound["lng"] || NEBound["lng"] < lng)
                    NEBound["lng"] = lng;
                  if (spd == 'null' || spd == null) spd = 0;
                  return {lat: lat, lng: lng, alt: alt, spd: spd};
                }),
    NEBound: NEBound,
    SWBound: SWBound
  };
};
// Get data divided into each duration (multi-session).
DataView.getFilteredDurations = function(input) {
  var output = [[]];
  for (var i = 0; i < input.length; i++) {
    for (var j = 0; j < sessionSummary.times.length; j++) {
      if (input[i]["clientTimestamp"] > sessionSummary.times[j][0] &&
          input[i]["clientTimestamp"] < sessionSummary.times[j][1]) {
        if (!output[j]) output[j] = [input[i]];
        else output[j].push(input[i]);
      }
    }
  }
  if (output.length == 0) output = input;
  return output;
};
// Returns number of elements currently in sessionData.
DataView.getSessionDataLength = function() { return sessionData.length; };
// Returns summary of session.
DataView.getSessionSummary = function() { return sessionSummary; };

// User clicked download session as GPX.
DataView.handleDownloadClick = function() {
  TraX.Export.exportGPX(sessionData, undefined, getTrackName(), HRTitle);
};
// User clicked download session as JSON raw.
DataView.handleDownload2Click = function() {
  TraX.Export.exportJSON(sessionData, undefined, getTrackName(), HRTitle);
};
// User clicked download session as CSV raw.
DataView.handleDownload3Click = function() {
  TraX.Export.exportRawCSV(sessionData, undefined, getTrackName(), HRTitle);
};
// User clicked download session as CSV formatted.
DataView.handleDownload4Click = function() {
  TraX.Export.exportFormattedCSV(sessionData, undefined, getTrackName(), HRTitle);
};
// Toggle the overlay to download a session.
DataView.toggleDownloadOverlay = function(force) {
  if (typeof force !== 'undefined') {
    if (force) {
      downloadOverlayDom.classList.add('visible');
    } else {
      downloadOverlayDom.classList.remove('visible');
    }
  } else {
    downloadOverlayDom.classList.toggle('visible');
  }
  if (downloadOverlayDom.classList.contains('visible')) {
    lapListDom.style.display = "none";
    dataViewOverlay.classList.remove('visible');
  } else {
    lapListDom.style.display = "block";
  }
};

}(window.TraX.DataView = window.TraX.DataView || {}));
}(window.TraX = window.TraX || {}));
