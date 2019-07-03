// Copyright 2018-2019 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
  /**
   * Milliseconds to check signed in state.
   * @default
   * @constant
   * @private
   * @type {number}
   */
  const signInStateCheckFrequency = 500;

  /**
   * The open socket to the server.
   *
   * @public
   * @type {SocketIO}
   */
  TraX.socket;

  let messageBoxDom;
  let messageBoxWrapperDom;

  // Message Box //
  /**
   * Queue of messages.
   * @default
   * @private
   * @type {Array.<{message: string, time: number}>}
   */
  const messageBoxQueue = [];
  /**
   * Timeout for current open message box.
   * @private
   * @type {Timeout}
   */
  let messageBoxTimeout;
  /**
   * Timeout for closing current message box.
   * @private
   * @type {Timeout}
   */
  let messageBoxClearTimeout;

  /**
   * All of user's friends.
   * @default
   * @public
   * @type {Array.<Object>}
   */
  TraX.friendsList = [];
  /**
   * List of summaries organized by id.
   * @default
   * @public
   * @type {Object}
   */
  TraX.summaryList = {};
  /**
   * Last time when we requested the friends list. Null if not waiting for a
   * reply anymore, unix timestamp if request has not yet been fulfilled.
   * @default
   * @private
   * @type {?number}
   */
  let friendsListRequestTimestamp = null;

  /**
   * Is the user currently signed in.
   * @default
   * @public
   * @readonly
   * @type {boolean}
   */
  TraX.isSignedIn = false;
  /**
   * The driver's account ID.
   * @default
   * @private
   * @type {string}
   */
  let driverId = '';
  /**
   * The driver's full name.
   * @default
   * @private
   * @type {string}
   */
  let driverName = '';
  /**
   * The driver's current account token.
   * @default
   * @private
   * @type {string}
   */
  let token = '';

  /**
   * Current TraXEvent registered listeners.
   * @default
   * @private
   * @type {Array.<Object>}
   */
  const listeners = [];

  /**
   * Prevent sending information to servers.
   * @default
   * @public
   * @type {boolean}
   */
  TraX.preventSend = false;

  /**
   * Defines the an init function for the common functions which get
   * added directly to TraX.
   * @see {Common}
   */
  (function(Common, undefined) {
    /**
     * Initialize TraX.Common
     *
     * @public
     */
    Common.init = function() {
      messageBoxDom = document.getElementById('messageBox');
      messageBoxWrapperDom = document.getElementById('messageBoxWrapper');

      clearMessageBox();

      setInterval(signInStateCheck, signInStateCheckFrequency);
      // Attempt to get user info if they are already signed in. Otherwise we
      // will catch the sign-in state changing.
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

  /**
   * Fired the event loop after init.
   *
   * @private
   */
  function postInit() {
    if (typeof Panes !== 'undefined') Panes.setCurrent(0);
    checkURLOptions();
  }

  /**
   * Check URL for queries.
   *
   * @private
   */
  function checkURLOptions() {
    const options = TraX.getURLOptions();
    if (TraX.debugMode) console.log('Options:', options);
    if (options['debug'] > 0) {
      TraX.toggleDebug(options['debug'] - 1);
    }
    if (options['nosend'] == 1) {
      TraX.preventSend = true;
      console.warn('SENDING DATA HAS BEEN DISABLED DUE TO HREF FLAG.');
    }
    if (typeof Panes !== 'undefined' && options['viewdata'] > 0) {
      Panes.gotoPane(options['viewdata'] - 1);
    }
    if (TraX.DataView && options['edittrack'] > 0) {
      TraX.DataView.editTrackMode = true;
      TraX.DataView.toggleDataViewOverlay(true);
      Panes.addEventListener('changePane', editModePaneChange);
    }
  }

  /**
   * Go to previous page, or if it wasn't one of our pages, go to the home page.
   *
   * @public
   */
  TraX.goBack = function() {
    if (document.referer && document.referrer.contains('trax')) {
      window.history.back();
    } else {
      window.location.href = 'https://dev.campbellcrowley.com/trax/';
    }
  };

  /**
   * Return to previous page when user goes left of first pane.
   *
   * @private
   * @param {PaneEvent} event The event triggered by Panes.
   */
  function editModePaneChange(event) {
    if (event.toIndex <= 1) TraX.goBack();
  }
  /**
   * Parse options embedded in URL.
   *
   * @private
   * @return {Object.<string>} Object of URL query key-value pairs.
   */
  TraX.getURLOptions = function() {
    const options = {};
    const optionString = document.URL.split('?')[1];
    if (typeof optionString === 'undefined') return options;
    const splitURI = optionString.split('#')[0].split('&');
    for (let i = 0; i < splitURI.length; i++) {
      const pair = splitURI[i].split('=');
      options[pair[0]] = pair[1];
    }
    return options;
  };
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
   * Toggle the debug menu open or closed.
   *
   * @public
   * @param {?boolean} [isDebug=undefined] Set debug mode or toggle with
   * undefined.
   */
  TraX.toggleDebug = function(isDebug) {
    let debug = TraX.debugMode ? 0 : 1;
    if (typeof isDebug !== 'undefined') {
      debug = isDebug;
    }
    TraX.debugMode = debug;
  };

  /**
   * Initialize socket connection and handlers.
   *
   * @private
   */
  function socketInit() {
    // eslint-disable-next-line max-len
    TraX.socket =
        io('dev.campbellcrowley.com',
            {path: '/socket.io/trax', reconnectiondelay: 5000});
    TraX.socket.on('connected', function() {
      console.log('Socket Connected');
      TraX.requestFriendsList();
      if (TraX.onSocketConnected) TraX.onSocketConnected();
    });
    TraX.socket.on('error', function(err) {
      console.error('Socket Error:', err);
    });
    TraX.socket.on('disconnect', function(reason) {
      console.log('Socket Disconnect:', reason);
      if (TraX.onSocketDisconnect) TraX.onSocketDisconnect();
    });
    TraX.socket.on('reconnect', function(attempt) {
      console.log('Socket Reconnect:', attempt, 'tries');
      if (TraX.onSocketReconnect) TraX.onSocketReconnect();
    });
    TraX.socket.on('friendslist', function(list) {
      friendsListRequestTimestamp = null;
      console.log('New Friends List', list);
      TraX.friendsList = list.map(function(obj) {
        if (!obj.firstName || obj.firstName == 'undefined') obj.firstName = '';
        if (!obj.lastName || obj.lastName == 'undefined') obj.lastName = '';
        return obj;
      });
      if (TraX.onFriendsList) TraX.onFriendsList();
    });
    TraX.socket.on('friendlistchanged', function() {
      console.log('Friends list changed');
      TraX.requestFriendsList();
    });
    TraX.socket.on(
        'newsummary',
        function(trackId, configId, friendId, trackOwnerId, summary) {
          let string;
          try {
            string = String.fromCharCode.apply(null, new Uint8Array(summary));
          } catch (e) {
            console.error(
                'Convert summary to string', trackId, configId, friendId,
                trackOwnerId, summary, e);
            return;
          }
          try {
            TraX.summaryList[[friendId, trackOwnerId, trackId, configId].join(
                ',')] = JSON.parse(string);
          } catch (e) {
            console.error(
                'Failed to parse summary:', trackId, configId, friendId,
                trackOwnerId, string, e);
            return;
          }
          if (TraX.debugMode) console.log('New summaryList:', TraX.summaryList);
        });
  };

  /**
   * Request friends list for signed in user from server.
   *
   * @public
   */
  TraX.requestFriendsList = function() {
    if (!TraX.isSignedIn) return;
    const req = !friendsListRequestTimestamp ||
        Date.now() - friendsListRequestTimestamp > 5000;
    if (TraX.debugMode) console.log('Requesting new friends list', req);
    if (!req) return;
    friendsListRequestTimestamp = Date.now();
    TraX.socket.emit('getfriendslist');
    TraX.socket.emit('getallrelations');
  };

  /**
   * Add new message to queue of message boxes.
   *
   * @public
   * @param {string} message The message to show.
   * @param {number} [time=5000] The number of milliseconds to show the message
   * for.
   * @param {boolean} [urgent=true] Should this message cancel the current
   * message and show this one immediately?
   */
  TraX.showMessageBox = function(message, time = 5000, urgent = true) {
    if (!messageBoxDom) return;
    console.log('New MessageBox:', message, time, urgent);
    if (message == messageBoxDom.innerHTML || message == '') {
      return;
    }
    for (let i = 0; i < messageBoxQueue.length; i++) {
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
  /**
   * Check if a message box is currently open and change it to the next message
   * if it is gone.
   *
   * @private
   */
  function checkMessageBox() {
    if (!messageBoxDom) return;
    if (messageBoxDom.innerHTML == '' && messageBoxQueue.length > 0) {
      messageBoxDom.innerHTML = messageBoxQueue[0].message;
      messageBoxWrapperDom.classList.remove('messageBoxHidden');
      messageBoxWrapperDom.classList.add('messageBoxVisible');
      clearTimeout(messageBoxTimeout);
      clearTimeout(messageBoxClearTimeout);
      messageBoxTimeout =
          setTimeout(TraX.hideMessageBox, messageBoxQueue[0].time);
      messageBoxQueue.splice(0, 1);
    }
  }
  /**
   * Hide currently open message box.
   *
   * @public
   */
  TraX.hideMessageBox = function() {
    clearTimeout(messageBoxTimeout);
    messageBoxWrapperDom.classList.remove('messageBoxVisible');
    messageBoxWrapperDom.classList.add('messageBoxHidden');
    clearTimeout(messageBoxClearTimeout);
    messageBoxClearTimeout = setTimeout(clearMessageBox, 500);
  };
  /**
   * Reset message box text in preparation for next message.
   *
   * @private
   */
  function clearMessageBox() {
    if (!messageBoxDom) return;
    clearTimeout(messageBoxClearTimeout);
    messageBoxDom.innerHTML = '';
    checkMessageBox();
  }

  /**
   * Returns current user's account Id.
   *
   * @public
   * @return {string} The driver's account id.
   */
  TraX.getDriverId = function() {
    return driverId;
  };
  /**
   * Returns current user's full name.
   *
   * @public
   * @return {string} The driver's full name.
   */
  TraX.getDriverName = function() {
    return driverName;
  };

  /**
   * Check that the user is signed in since the server will require that they
   * are.
   *
   * @private
   */
  function signInStateCheck() {
    const lastToken = token;
    const newSignIn = signedIn();
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
        driverName = '';
        driverId = 0;
        triggerEvent('signout');
      }

      TraX.requestFriendsList();
      if (TraX.debugMode) console.log('Sign in state change detected');
    }
  }
  /**
   * Check if user is signed in.
   *
   * @private
   * @return {boolean} Whether the user is signed in or not.
   */
  function signedIn() {
    token = getToken();
    return token && String(token).length > 0;
  }
  /**
   * Gets signed in user's token.
   *
   * @private
   * @return {string} The current signed in user's token.
   */
  function getToken() {
    return gapi.auth2.getAuthInstance()
        .currentUser.get()
        .getAuthResponse()
        .id_token;
  }
  /**
   * Get relevant device OS distinction from userAgent.
   *
   * @public
   * @param {string} [userAgent] A userAgent to user instead of browser's agent.
   * @return {string} The name of the OS from the user agent.
   */
  TraX.getDeviceType = function(userAgent) {
    if (typeof userAgent !== 'string') userAgent = navigator.userAgent;
    if (/iPhone/i.test(userAgent)) {
      return 'iPhone';
    } else if (/Android/i.test(userAgent)) {
      return 'Android';
    } else if (/Windows/i.test(userAgent)) {
      return 'Windows';
    } else {
      return 'Unknown';
    }
  };
  /**
   * Get relevant browser name from userAgent.
   *
   * @public
   * @param {string} [userAgent] A userAgent to user instead of browser's agent.
   * @return {string} The name of the browser from the user agent.
   */
  TraX.getBrowser = function(userAgent) {
    if (typeof userAgent !== 'string') userAgent = navigator.userAgent;
    if (userAgent.search('MSIE') >= 0) {
      return 'IE';
    } else if (userAgent.search('Chrome') >= 0) {
      return 'Chrome';
    } else if (userAgent.search('Firefox') >= 0) {
      return 'Firefox';
    } else if (
      userAgent.search('Safari') >= 0 && userAgent.search('Chrome') < 0) {
      return 'Safari';
    } else if (userAgent.search('Opera') >= 0) {
      return 'Opera';
    } else {
      console.log('Unknown userAgent', userAgent);
      return 'Unknown';
    }
  };

  /**
   * Add a listener to a TraX event.
   *
   * @public
   * @param {string} name The name of the event to listen for.
   * @param {listenerCB} callback The callback to fire when the event fires.
   */
  TraX.addEventListener = function(name, callback) {
    listeners.push({name: name, callback: callback});
  };
  /**
   * Triggers a TraX event for all listeners.
   *
   * @private
   * @param {string} name The name of the event to fire.
   * @param {*} data The data to send with the event.
   */
  function triggerEvent(name, data) {
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i].name == name) {
        listeners[i].callback(data);
      }
    }
  }
}(window.TraX = window.TraX || {}));

