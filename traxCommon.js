// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
// milliseconds to check signed in state.
const signInStateCheckFrequency = 500;

// The open socket to the server.
TraX.socket;

var messageBoxDom, messageBoxWrapperDom;

// Message Box //
// Queue of messages.
var messageBoxQueue = [];
// Timeout for current open message box.
var messageBoxTimeout;
// Timeout for closing current message box.
var messageBoxClearTimeout;

// All of user's friends.
TraX.friendsList = [];
TraX.summaryList = {};

TraX.isSignedIn = false;
var driverId = "";
var driverName = "";
var token = "";

var listeners = [];

// TODO: Implement this.
TraX.preventSend = false;

(function(Common, undefined) {
  Common.init = function() {
    messageBoxDom = document.getElementById('messageBox');
    messageBoxWrapperDom = document.getElementById('messageBoxWrapper');

    clearMessageBox();

    setInterval(signInStateCheck, signInStateCheckFrequency);
    // Attempt to get user info if they are already signed in. Otherwise we will
    // catch the sign-in state changing.
    try {
      token = gapi.auth2.getAuthInstance()
                  .currentUser.get()
                  .getAuthResponse()
                  .id_token;
      driverName = gapi.auth2.getAuthInstance()
                       .currentUser.get()
                       .getBasicProfile()
                       .getName();
    } catch (e) {  // Page probably not loaded yet or user not signed in.
    }

    socketInit();

    setTimeout(postInit);
  };
}(window.TraX.Common = window.TraX.Common || {}));

function postInit() {
  if (typeof Panes !== 'undefined') Panes.setCurrent(0);
  checkURLOptions();
}

// Check URL for queries.
function checkURLOptions() {
  var options = getURLOptions();
  if (TraX.debugMode) console.log("Options:", options);
  if (options["debug"] > 0) {
    TraX.toggleDebug(options["debug"] - 1);
  }
  if (options["nosend"] == 1) {
    TraX.preventSend = true;
    console.warn("SENDING DATA HAS BEEN DISABLED DUE TO HREF FLAG.");
  }
  if (typeof Panes !== 'undefined' && options["viewdata"] > 0) {
    Panes.gotoPane(options["viewdata"] - 1);
  }
  if (TraX.DataView && options["edittrack"] > 0) {
    TraX.DataView.editTrackMode = true;
    TraX.DataView.toggleDataViewOverlay(true);
    Panes.addEventListener('changePane', editModePaneChange);
  }
}
TraX.goBack = function() {
  if (document.referer && document.referrer.contains("trax")) {
    window.history.back();
  } else {
    window.location.href = "https://dev.campbellcrowley.com/trax/";
  }
};

function editModePaneChange(event) {
  if (event.toIndex <= 1) TraX.goBack();
}
// Parse options embedded in URL.
function getURLOptions() {
  var options = {};
  var optionString = document.URL.split("?")[1];
  if (typeof optionString === 'undefined') return options;
  var splitURI = optionString.split("#")[0].split("&");
  for (var i = 0; i < splitURI.length; i++) {
    const pair = splitURI[i].split("=");
    options[pair[0]] = pair[1];
  }
  return options;
}
// Set query option in URL.
TraX.setURLOption = function(option, setting) {
  var newhref;
  const postregex = "=[^&#]*";
  if (typeof setting !== 'undefined') {
    newhref = location.href.replace(
        new RegExp(option + postregex), option + "=" + setting);
    var postOptions = newhref.split("#");
    var Options = postOptions[0];
    postOptions = postOptions[1] || "";
    if (newhref == location.href && newhref.indexOf(option + "=") < 0) {
      if (newhref.indexOf("?") > 0) {
        Options += "&" + option + "=" + setting;
      } else {
        Options += "?" + option + "=" + setting;
      }
    }
    newhref = Options + "#" + postOptions;
  } else {
    newhref = location.href.replace(new RegExp("&" + option + postregex), "");
    if (newhref == location.href) {
      newhref =
          location.href.replace(new RegExp("\\?" + option + postregex), "");
      if (newhref != location.href) {
        newhref = newhref.replace("&", "?");
      }
    }
  }
  history.pushState(null, "TraX: Racing Data Collector", newhref);
};

// Toggle the debug menu open or closed.
TraX.toggleDebug = function(isDebug) {
  var debug = TraX.debugMode ? 0 : 1;
  if (typeof isDebug !== 'undefined') {
    debug = isDebug;
  }
  TraX.debugMode = debug;
};

// Initialize socket connection and handlers.
function socketInit() {
  TraX.socket = io('dev.campbellcrowley.com', {path: '/socket.io/trax', reconnectiondelay: 5000});
  TraX.socket.on('connected', function() {
    console.log("Socket Connected");
    TraX.requestFriendsList();
  });
  TraX.socket.on(
      'error', function(err) { console.error("Socket Error:", err); });
  TraX.socket.on('disconnect', function(reason) {
    console.log("Socket Disconnect:", reason);
  });
  TraX.socket.on('reconnect', function(attempt) {
    console.log("Socket Reconnect:", attempt, "tries");
  });
  TraX.socket.on('friendslist', function(list) {
    console.log("New Friends List", list);
    TraX.friendsList = list.map(function(obj) {
      if (!obj.firstName || obj.firstName == 'undefined') obj.firstName = "";
      if (!obj.lastName || obj.lastName == 'undefined') obj.lastName = "";
      return obj;
    });
  });
  TraX.socket.on('friendlistchanged', function() {
    console.log("Friends list changed");
    TraX.requestFriendsList();
  });
  TraX.socket.on(
      'newsummary',
      function(trackId, configId, friendId, trackOwnerId, summary) {
        var string;
        try {
          string = String.fromCharCode.apply(null, new Uint8Array(summary));
        } catch (e) {
          console.error(
              "Convert summary to string", trackId, configId, friendId,
              trackOwnerId, summary, e);
          return;
        }
        try {
          TraX.summaryList[[friendId, trackOwnerId, trackId, configId].join(
              ',')] = JSON.parse(string);
        } catch (e) {
          console.error(
              "Failed to parse summary:", trackId, configId, friendId,
              trackOwnerId, string, e);
          return;
        }
        if (TraX.debugMode) console.log("New summaryList:", TraX.summaryList);
      });
};

// Request friends list for signed in user from server.
TraX.requestFriendsList = function() {
  if (!TraX.isSignedIn) return;
  if (TraX.debugMode) console.log("Requesting new friends list");
  TraX.socket.emit('getfriendslist');
  TraX.socket.emit('getallrelations');
};

// Add new message to queue of message boxes.
TraX.showMessageBox = function(message, time = 5000, urgent = true) {
  if (!messageBoxDom) return;
  console.log("New MessageBox:", message, time, urgent);
  if (message == messageBoxDom.innerHTML || message == "") {
    return;
  }
  for (var i = 0; i < messageBoxQueue.length; i++) {
    if (messageBoxQueue[i].message == message) {
      clearTimeout(messageBoxTimeout);
      clearTimeout(messageBoxClearTimeout);
      messageBoxTimeout = setTimeout(TraX.hideMessageBox, time);
      return;
    }
  }
  if (urgent) TraX.hideMessageBox();
  messageBoxQueue.push({message: message, time: time});
  checkMessageBox();
};
// Check if a message box is currently open and change it to the next message if
// it is gone.
function checkMessageBox() {
  if (!messageBoxDom) return;
  if (messageBoxDom.innerHTML == "" && messageBoxQueue.length > 0) {
    messageBoxDom.innerHTML = messageBoxQueue[0].message;
    messageBoxWrapperDom.classList.remove("messageBoxHidden");
    messageBoxWrapperDom.classList.add("messageBoxVisible");
    clearTimeout(messageBoxTimeout);
    clearTimeout(messageBoxClearTimeout);
    messageBoxTimeout = setTimeout(TraX.hideMessageBox, messageBoxQueue[0].time);
    messageBoxQueue.splice(0, 1);
  }
}
// Hide currently open message box.
TraX.hideMessageBox = function() {
  clearTimeout(messageBoxTimeout);
  messageBoxWrapperDom.classList.remove("messageBoxVisible");
  messageBoxWrapperDom.classList.add("messageBoxHidden");
  clearTimeout(messageBoxClearTimeout);
  messageBoxClearTimeout = setTimeout(clearMessageBox, 500);
};
// Reset message box text in preparation for next message.
function clearMessageBox() {
  if (!messageBoxDom) return;
  clearTimeout(messageBoxClearTimeout);
  messageBoxDom.innerHTML = "";
  checkMessageBox();
}

// Returns current user's account Id.
TraX.getDriverId = function() { return driverId; };
// Returns current user's full name.
TraX.getDriverName = function() { return driverName; };

// Check that the user is signed in since the server will require this.
function signInStateCheck() {
  var lastToken = token;
  var newSignIn = signedIn();
  if (token !== lastToken) TraX.socket.emit('newtoken', token);
  if (TraX.isSignedIn !== newSignIn) {
    TraX.isSignedIn = newSignIn;
    if (TraX.isSignedIn) {
      driverName = gapi.auth2.getAuthInstance()
                       .currentUser.get()
                       .getBasicProfile()
                       .getName();
      driverId = gapi.auth2.getAuthInstance()
                     .currentUser.get()
                     .getBasicProfile()
                     .getId();
      triggerEvent('signin');
    } else {
      driverName = "";
      driverId = 0;
      triggerEvent('signout');
    }

    TraX.requestFriendsList();
    if (TraX.debugMode) console.log("Sign in state change detected");
  }
}
// Check if user is signed in.
function signedIn() {
  token = getToken();
  return token && String(token).length > 0;
}
// Gets signed in user's token.
function getToken() {
  return gapi.auth2.getAuthInstance()
      .currentUser.get()
      .getAuthResponse()
      .id_token;
}
// Get relevant device OS distinction from userAgent.
TraX.getDeviceType = function(userAgent) {
  if (typeof userAgent !== 'string') userAgent = navigator.userAgent;
  if (/iPhone/i.test(userAgent)) {
    return "iPhone";
  } else if (/Android/i.test(userAgent)) {
    return "Android";
  } else if (/Windows/i.test(userAgent)) {
    return "Windows";
  } else {
    return "Unknown";
  }
};
// Get relevant browser name from userAgent.
TraX.getBrowser = function(userAgent) {
  if (typeof userAgent !== 'string') userAgent = navigator.userAgent;
  if (userAgent.search("MSIE") >= 0) {
    return "IE";
  } else if (userAgent.search("Chrome") >= 0) {
    return "Chrome";
  } else if (userAgent.search("Firefox") >= 0) {
    return "Firefox";
  } else if (
      userAgent.search("Safari") >= 0 &&
      userAgent.search("Chrome") < 0) {
    return "Safari";
  } else if (userAgent.search("Opera") >= 0) {
    return "Opera"
  } else {
    console.log("Unknown userAgent", userAgent);
    return "Unknown";
  }
};

TraX.addEventListener = function(name, callback) {
  listeners.push({name: name, callback: callback});
};
function triggerEvent(name, data) {
  for (var i = 0; i < listeners.length; i++) {
    if (listeners[i].name == name) {
      listeners[i].callback(data);
    }
  }
}

}(window.TraX = window.TraX || {}));
