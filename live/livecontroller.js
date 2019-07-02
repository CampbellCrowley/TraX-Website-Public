// Copyright 2018-2019 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
  /**
   * Controls live data viewing page.
   * @class Live
   * @augments TraX
   */
  (function(Live, undefined) {
    // Constants //
    /**
     * milliseconds to check for stale data.
     * @constant
     * @default
     * @private
     * @type {number}
     */
    const purgeFrequency = 1000;
    /**
     * Maximum number of milliseconds without new data until data is deleted for
     * a user.
     * @constant
     * @default
     * @private
     * @type {number}
     */
    const maxDataAge = 60000;
    /**
     * After this much time without new data for a user, the data is considered
     * stale.
     * @constant
     * @default
     * @private
     * @type {number}
     */
    const staleDelay = 5000;
    /**
     * Milliseconds to update the driver list table.
     * @constant
     * @default
     * @private
     * @type {number}
     */
    const listUpdateFrequency = 51;
    /**
     * Milliseconds to check for number of viewers.
     * @constant
     * @default
     * @private
     * @type {number}
     */
    const viewerUpdateFrequency = 15000;
    /**
     * The alphabet in upper case first then lowercase.
     * @default
     * @constant
     * @private
     * @type {string}
     */
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    /**
     * The columns to show in the driver list.
     * @default
     * @constant
     * @private
     * @type {Array.<string>}
     */
    const listCols = ['label', 'name', 'speed', 'lapTimeExt', 'bestLapTime'];
    /**
     * The columns to show in the standings list.
     * @default
     * @constant
     * @private
     * @type {Array.<string>}
     */
    const standingsCols = ['rank', 'bestLapTime', 'name', 'predLapTime'];
    /**
     * The title to show in notifications.
     * @default
     * @constant
     * @private
     * @type {string}
     */
    const notifTitle = 'TraX';
    /**
     * The default notification options to be passed into the notification
     * manager.
     * @default
     * @constant
     * @private
     * @type {{body: string, icon: string}}
     */
    const notifOpts = {
      body: 'Notification body!',
      icon: 'https://dev.campbellcrowley.com/favicon.ico',
    };

    /**
     * Default options for a polyline on the map.
     * @constant
     * @default
     * @private
     * @type {google.maps.PolylineOptions}
     */
    const polyLineOpts = {
      strokeColor: '#000000',
      strokeWeight: 5,
      clickable: false,
      editable: false,
      map: map,
    };
    const polyline = new google.maps.Polyline(polyLineOpts);

    // DOM Elements
    // let realtimeGForceDoms;
    let driverStandingsDom;
    let driverListDom;
    let realtimeLongitudeDoms;
    let realtimeLatitudeDoms;
    let realtimeAltitudeDoms;
    let realtimeSpeedDoms;
    let realtimeHeadingDoms;
    let realtimeDeviceClockDoms;
    let realtimeGPSClockDoms;
    let realtimeDeviceTypeDoms;
    let realtimeDeviceBrowserDoms;
    let lapTimerDom;
    let lapNumberDom;
    let lapPredictedTimeDom;
    let lapPredictedSplitSessionDom;
    let lapPredictedSplitEverDom;
    let viewerNumDom;
    let viewerNumParentDom;
    let simpleSensorViewDom;
    let fullSensorViewDom;
    let showMoreSensorsDom;
    let showLessSensorsDom;
    // let userMaskDom;
    TraX.unitDropdownDom = {value: 'imperial'};

    // Buffered data.
    /**
     * All received data about friends.
     * @private
     * @type {Object}
     */
    const friendsData = {length: 0};
    /**
     * The friends in order of their standings on a track by best lap time.
     * @private
     * @type {Array}
     */
    let friendStandings = [];
    /**
     * Array storing all markers for all friends.
     * @private
     * @type {Array.<google.maps.Marker>}
     */
    const friendMarkers = [];

    /**
     * The next index to look for the label for a marker.
     * @default
     * @private
     * @type {number}
     */
    let nextLabelIndex = 0;
    /**
     * The ID of the currently selected user in the UI.
     * @default
     * @private
     * @type {string}
     */
    let selectedId = '';

    /**
     * The interval that is checking for a new viewer count number.
     * @private
     * @type {Interval}
     */
    let viewerNumUpdateInterval;

    /**
     * The last time we requested a summary to prevent flooding the server with
     * too
     * many requests all at once.
     * @default
     * @private
     * @type {number}
     */
    let lastSummaryRequestTime = 0;

    /**
     * Initialize TraX~Live
     */
    Live.init = function() {
      driverStandingsDom = document.getElementById('driverStandings');
      driverListDom = document.getElementById('driverList');
      realtimeLongitudeDoms =
          document.getElementsByClassName('realtimeLongitude');
      realtimeLatitudeDoms =
          document.getElementsByClassName('realtimeLatitude');
      realtimeAltitudeDoms =
          document.getElementsByClassName('realtimeAltitude');
      realtimeSpeedDoms = document.getElementsByClassName('realtimeGPSSpeed');
      realtimeHeadingDoms =
          document.getElementsByClassName('realtimeGPSHeading');
      // realtimeGForceDoms = document.getElementsByClassName("realtimeGForce");
      realtimeDeviceClockDoms =
          document.getElementsByClassName('realtimeDeviceClock');
      realtimeGPSClockDoms =
          document.getElementsByClassName('realtimeGPSClock');
      realtimeDeviceTypeDoms =
          document.getElementsByClassName('realtimeDeviceType');
      realtimeDeviceBrowserDoms =
          document.getElementsByClassName('realtimeDeviceBrowser');
      lapNumberDom = document.getElementById('singleLapNum');
      lapTimerDom = document.getElementById('singleLapTime');
      lapPredictedTimeDom = document.getElementById('singleLapPredictedTime');
      lapPredictedSplitSessionDom =
          document.getElementById('singleLapPredictedSplitSession');
      lapPredictedSplitEverDom =
          document.getElementById('singleLapPredictedSplitEver');
      viewerNumDom = document.getElementById('viewerNum');
      viewerNumParentDom = document.getElementById('viewerNumParent');
      simpleSensorViewDom = document.getElementById('simpleData');
      fullSensorViewDom = document.getElementById('allData');
      showMoreSensorsDom = document.getElementById('showMoreData');
      showLessSensorsDom = document.getElementById('showLessData');
      // userMaskDom = document.getElementById('userMask');

      socketInit();

      setInterval(purgeData, purgeFrequency);
      setInterval(function() {
        updateFriendsList(true);
      }, listUpdateFrequency);

      showMoreSensorsDom.onclick = function() {
        console.log('Showing more sensor data');
        simpleSensorViewDom.style.display = 'none';
        fullSensorViewDom.style.display = 'block';
      };
      showLessSensorsDom.onclick = function() {
        console.log('Showing less sensor data');
        simpleSensorViewDom.style.display = 'block';
        fullSensorViewDom.style.display = 'none';
      };

      viewerNumUpdateInterval =
          setInterval(updateViewerNum, viewerUpdateFrequency);
      viewerNumDom.innerHTML = 0;

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

      updateFriendsList();
      updateStandingsList();
    };
    /**
     * Initialize socket connection and handlers.
     *
     * @private
     */
    function socketInit() {
      TraX.onSocketConnected = function() {
        TraX.socket.emit('setliveview');
        connected = true;
        updateViewerNum();

        const s = TraX.getURLOptions()['s'];
        console.log('Secret:', s);
        if (s) TraX.socket.emit('setSecret', s);
      };
      TraX.onSocketDisconnect = function(reason) {
        connected = false;
      };
      TraX.socket.on('livefrienddata', newData);
      TraX.onFriendsList = function() {
        updateFriendsList();
      };
      TraX.socket.on('numliveview', handleNewViewerNum);
      TraX.socket.on('newsummary', handleNewSummary);
      TraX.socket.on('fail', console.warn);
      TraX.socket.on('secretUser', handleUserMask);
    }
    /**
     * Requests a summary for a track config from the server.
     *
     * @private
     * @param {string} ownerId The id of the user who owns the summary we are
     * requesting.
     * @param {string} driverId The id of the current user.
     * @param {string} trackId The id of the track to fetch.
     * @param {string} configId The id of the config to fetch.
     * @param {boolean} [force=false] Force fetching from server instead of
     * aborting
     * of we already have the summary.
     */
    function requestConfigSummary(ownerId, driverId, trackId, configId, force) {
      const now = Date.now();
      if (now - lastSummaryRequestTime < 3000) return;
      lastSummaryRequestTime = now;
      for (let i = 0; i < TraX.friendsList.length; i++) {
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
    /**
     * New summary received from server.
     *
     * @private
     * @param {string} trackId The id of the track this summary is for.
     * @param {string} configId The id of the config this summary is for.
     * @param {string} userId The id of the user who requested this summary.
     * @param {string} ownerId The id of the user who owns this summary.
     * @param {string|Object} data The summary data.
     */
    function handleNewSummary(trackId, configId, userId, ownerId, data) {
      console.log('Summary:', trackId, configId, userId, ownerId, data);
    }
    /**
     * New data was received from server about a user.
     *
     * @private
     * @param {string} friendId The id of the user whose data we received.
     * @param {string} chunkId The id of the chunk received from the user.
     * @param {string} buffer The stringified JSON object storing the data.
     */
    function newData(friendId, chunkId, buffer) {
      if (buffer && buffer.length > 0 && friendId) {
        let shouldDecompress = true;
        try {
          shouldDecompress = buffer.indexOf('[NODECOMPRESS]') < 0;
          buffer = buffer.replace('[CHUNKEND]', '');
        } catch (err) {
          console.warn('Failed to read chunks', err);
          return;
        }
        if (shouldDecompress) {
          try {
            buffer = LZString.decompressFromUTF16(buffer);
          } catch (err) {
            console.warn('Failed to decompress chunk', err);
            return;
          }
        }
        try {
          buffer = JSON.parse(buffer);
        } catch (err) {
          console.warn('Failed to parse chunk', err);
          return;
        }
        if (buffer && (!friendsData[friendId] ||
                       friendsData[friendId].chunkId < chunkId ||
                       friendsData[friendId].sessionId != buffer.sessionId)) {
          buffer.chunkId = chunkId;
          buffer.receivedTime = Date.now();
          buffer.netDelta = buffer.receivedTime - buffer.clientTimestamp;
          buffer.speed = 0;
          if (TraX.getBrowser(buffer.userAgent) == 'Chrome') {
            buffer.axisFlip = [true, true, true];
          } else {
            buffer.axisFlip = [false, false, false];
          }
          const willUpdateStandings = !friendsData[friendId] ||
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
            buffer.longitude =
                buffer.longitude || friendsData[friendId].longitude;
          } else {
            // if (friendsData.length == 0) {
            //   setTimeout(function() {
            //     handleSelectUser(friendStandings[0].userId)
            //   });
            // }
            friendsData.length++;
          }
          const splitName = buffer.selectedTrack.split(',');
          const ownerId = splitName[1];
          const trackId = splitName[0];
          if (buffer.selectedTrack != null && buffer.selectedConfig != null &&
              (!buffer.summary ||
               buffer.summary.trackId != buffer.selectedTrack ||
               buffer.summary.configId != buffer.selectedConfig ||
               buffer.summary.trackOwnerId != ownerId)) {
            requestConfigSummary(
                ownerId, friendId, trackId, buffer.selectedConfig);
          }
          if (!buffer.bestLapSession && TraX.summaryList[[
            friendId,
            ownerId,
            trackId,
            buffer.selectedConfig,
          ].join(',')]) {
            buffer.bestLapSession = TraX.summaryList[[
              friendId,
              ownerId,
              trackId,
              buffer.selectedConfig,
            ].join(',')]
                .bestLapDuration;
          }
          friendsData[friendId] = buffer;
          updateFriendRow(friendId);
          updateFriendMap();
          if (willUpdateStandings) updateStandings();

          if (friendsData[friendId].extra &&
              friendsData[friendId].extra.messages &&
              friendsData[friendId].extra.messages.length > 0) {
            console.log(
                'Data Messages:', friendId,
                friendsData[friendId].extra.messages);
          }
        }
      }
    }
    /**
     * Update list of visible friends.
     *
     * @private
     * @param {boolean} [doMinimal=false] Passed to updateFriendRow.
     */
    function updateFriendsList(doMinimal) {
      if (friendsData.length == 0) {
        driverListDom.innerHTML = '';
      }
      Object.keys(friendsData).map(function(key) {
        if (key == 'length') return;
        updateFriendRow(key, doMinimal);
      });
    }
    /**
     * Updates a single user's row.
     *
     * @private
     * @param {string} id User's id to update.
     * @param {boolean} [doMinimal=false] Only update row, not the rest of the
     * UIs.
     */
    function updateFriendRow(id, doMinimal) {
      let row = document.getElementById('listRow' + id);
      let cells;
      if (row) {
        cells = row.getElementsByTagName('td');
      } else {
        row = document.createElement('tr');
        row.id = 'listRow' + id;
        row.onclick = function() {
          handleSelectUser(id);
        };
        driverListDom.appendChild(row);
        row = document.getElementById('listRow' + id);
        for (let i = 0; i < listCols.length; i++) {
          const col = document.createElement('td');
          col.innerHTML = '?';
          row.appendChild(col);
        }
        cells = row.getElementsByTagName('td');
        sendNotif('One of your friends started a session!');
      }
      if (friendsData[id]) {
        const isStale = Date.now() - friendsData[id].receivedTime > staleDelay;
        row.classList.toggle('stale', isStale);
      }
      for (let i = 0; i < listCols.length; i++) {
        cells[i].innerHTML = '';
        cells[i].appendChild(document.createTextNode(getText(listCols[i], id)));
      }
      if (!doMinimal && id == selectedId) {
        updateCanvases(id);
        updateRealtime(id);
      }
    }
    /**
     * Sorts drivers array by their rank.
     *
     * @private
     */
    function updateStandings() {
      friendStandings = [];

      Object.keys(friendsData).map(function(key) {
        if (key == 'length') return;
        friendStandings.push(
            {userId: key, time: friendsData[key].bestLapSession});
      });
      friendStandings.sort(function(a, b) {
        if (b.time == 0) return 1;
        if (a.time == 0) return -1;
        return b.time - a.time;
      });

      updateStandingsList();
    }

    /**
     * Updates the list of driver standings based off rank.
     *
     * @private
     */
    function updateStandingsList() {
      if (friendStandings.length == 0) {
        driverStandingsDom.innerHTML = '';
      }
      for (let i = 0; i < 10 && i < friendStandings.length; i++) {
        const id = friendStandings[i].userId;
        let row = document.getElementById('standingRow' + (i + 1));
        let cells;
        if (row) {
          cells = row.getElementsByTagName('td');
        } else {
          row = document.createElement('tr');
          row.id = 'standingRow' + (i + 1);
          row.onclick = function() {
            handleSelectUser(id);
          };
          driverStandingsDom.appendChild(row);
          row = document.getElementById('standingRow' + (i + 1));
          for (let j = 0; j < standingsCols.length; j++) {
            const col = document.createElement('td');
            col.innerHTML = '?';
            row.appendChild(col);
          }
          cells = row.getElementsByTagName('td');
        }
        for (let j = 0; j < standingsCols.length; j++) {
          cells[j].innerHTML = '';
          cells[j].appendChild(
              document.createTextNode(getText(standingsCols[j], id)));
        }
      }
      handleSelectUser(selectedId, true);
    }

    /**
     * Fetches formatted text for the requested data and user.
     *
     * @private
     * @param {string} key The key for the formatted data to fetch.
     * @param {string} id The user for which to look for the data.
     * @return {string} The formatted data requested, or 'BADKEY' if key was
     * invalid.
     */
    function getText(key, id) {
      try {
        switch (key) {
          case 'label':
            if (!friendsData[id].label) {
              friendsData[id].label =
                  alphabet[nextLabelIndex++ % alphabet.length];
            }
            return friendsData[id].label;
          case 'name':
            return friendsData[id].driverName;
          case 'speed':
            return TraX.Units.speedToUnit(friendsData[id].speed) +
                TraX.Units.getLargeSpeedUnit();
          case 'lapTime':
            if (friendsData[id].lapStartTime <= 0) {
              return TraX.Common.formatMsec(
                  friendsData[id].clientTimestamp -
                      friendsData[id].sessionStartTime,
                  false, 1);
            } else {
              return TraX.Common.formatMsec(
                  friendsData[id].clientTimestamp -
                      friendsData[id].lapStartTime,
                  false, 1);
            }
          case 'lapTimeExt':
            if (Date.now() - friendsData[id].receivedTime > staleDelay) {
              return getText('lapTime', id);
            } else {
              let lapStart = friendsData[id].lapStartTime;
              if (lapStart <= 0) {
                lapStart = friendsData[id].sessionStartTime;
              }
              return TraX.Common.formatMsec(
                  Date.now() - lapStart - friendsData[id].netDelta, false, 1);
            }
          case 'predLapTime':
            return TraX.Common.formatMsec(
                friendsData[id].predictedLapDuration, false, 1);
          case 'predLapSplitSession':
            return TraX.Common.formatMsec(
                friendsData[id].predictedLapDuration -
                    friendsData[id].bestLapSession,
                true, 0);
          case 'predLapSplitEver':
            const search = [
              selectedId,
              friendsData[selectedId].selectedTrack.split(',')[1],
              friendsData[selectedId].selectedTrack.split(',')[1],
              friendsData[selectedId].selectedConfig,
            ].join(',');
            let finalTime = 0;
            if (TraX.summaryList[search] &&
                TraX.summaryList[search].bestLapDuration) {
              finalTime = TraX.summaryList[search].bestLapDuration -
                  friendsData[id].predictedLapDuration;
            }
            return TraX.Common.formatMsec(finalTime, true, 0);
          case 'bestLapTime':
            return TraX.Common.formatMsec(
                friendsData[id].bestLapSession, false, 1);
          case 'rank':
            return '#' + getRank(id);
          case 'bestLapTime':
            return 'XX:XX.XXX';
          default:
            return 'BADKEY';
        }
      } catch (err) {
        console.error('Failed to get data for key:', key, 'ID:', id, err);
        return key;
      }
    }

    /**
     * Gets the rank of the given user.
     *
     * @private
     * @param {string} id The id of the user to check.
     * @return {number} The position or 0 if we couldn't find the user.
     */
    function getRank(id) {
      for (let i = 0; i < friendStandings.length; i++) {
        if (friendStandings[i].userId == id) {
          return i + 1;
        }
      }
      return 0;
    }

    /**
     * Update the map with known data.
     *
     * @private
     */
    function updateFriendMap() {
      let bounds = {sw: {}, ne: {}};
      Object.keys(friendsData).map(function(key) {
        if (key == 'length') return;
        const label = getText('label', key);
        const pos = {
          lat: friendsData[key].latitude,
          lng: friendsData[key].longitude,
        };
        if (!pos.lat || !pos.lng) return;
        if (friendMarkers[key]) {
          friendMarkers[key].setPosition(pos);
        } else {
          friendMarkers[key] =
              new google.maps.Marker({position: pos, label: label, map: map});
          friendMarkers[key].addListener('click', function() {
            handleSelectUser(key);
          });
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
            lng: friendsData[selectedId].longitude,
          },
        };
        bounds.ne = bounds.sw;

        const search = [
          selectedId,
          friendsData[selectedId].selectedTrack.split(',')[1],
          friendsData[selectedId].selectedTrack.split(',')[0],
          friendsData[selectedId].selectedConfig,
        ].join(',');
        if (TraX.summaryList[search] && TraX.summaryList[search].bestLapData) {
          polyline.setPath(
              TraX.summaryList[search]
                  .bestLapData
                  .map(function(el) {
                    return el.coord;
                  })
                  .filter(function(el) {
                    return el.lat && el.lng;
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

    /**
     * Purge stale data from memory.
     *
     * @private
     */
    function purgeData() {
      const now = Date.now();
      Object.keys(friendsData).map(function(key) {
        if (key == 'length') return;
        if (now - friendsData[key].receivedTime > maxDataAge) {
          const row = document.getElementById('listRow' + key);
          if (row) row.outerHTML = '';
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

    /**
     * Updates the canvases showing graphical data.
     *
     * @private
     * @param {string} id The id of the user whose data we should show.
     */
    function updateCanvases(id) {
      const dat = friendsData[id];
      TraX.Canvases.rotation.a = dat['gyro'][0];
      TraX.Canvases.rotation.b = dat['gyro'][1];
      TraX.Canvases.rotation.g = dat['gyro'][2];
      TraX.downRotation = {
        a: dat['estimatedDownRotation'][0],
        b: dat['estimatedDownRotation'][1],
        g: dat['estimatedDownRotation'][2],
      };
      TraX.Canvases.drawAccel = [
        (dat.axisFlip[0] ? -1 : 1) * dat['accelIncGrav'][0],
        (dat.axisFlip[1] ? -1 : 1) * dat['accelIncGrav'][1],
        (dat.axisFlip[2] ? -1 : 1) * dat['accelIncGrav'][2],
      ];
      TraX.Canvases.rotationRate = {
        a: dat['rotationRate'][0],
        b: dat['rotationRate'][1],
        g: dat['rotationRate'][2],
      };
      TraX.Canvases.forwardVector = dat['estimatedForwardVector'];
      TraX.Canvases.headingOffset = dat['headingOffset'];

      TraX.Canvases.renderGyro(true);
      TraX.Canvases.renderAccel(true);
    }
    /**
     * Updates the realtime data UI.
     *
     * @private
     * @param {string} id The id of the user whose data we should show.
     */
    function updateRealtime(id) {
      // Sensors
      if (friendsData[id].longitude) {
        const gpsLongitude = friendsData[id].longitude + '\u00B0';
        for (let i = 0; i < realtimeLongitudeDoms.length; i++) {
          realtimeLongitudeDoms[i].innerHTML = '';
          realtimeLongitudeDoms[i].appendChild(
              document.createTextNode(gpsLongitude));
        }
      }
      if (friendsData[id].latitude) {
        const gpsLatitude = friendsData[id].latitude + '\u00B0';
        for (let i = 0; i < realtimeLatitudeDoms.length; i++) {
          realtimeLatitudeDoms[i].innerHTML = '';
          realtimeLatitudeDoms[i].appendChild(
              document.createTextNode(gpsLatitude));
        }
      }
      if (friendsData[id].altitude) {
        const gpsAltitude =
            Math.round(
                TraX.Units.distanceToSmallUnit(friendsData[id].altitude) *
                10.0) /
                10.0 +
            TraX.Units.getSmallDistanceUnit();
        for (let i = 0; i < realtimeAltitudeDoms.length; i++) {
          realtimeAltitudeDoms[i].innerHTML = '';
          realtimeAltitudeDoms[i].appendChild(
              document.createTextNode(gpsAltitude));
        }
      }
      if (friendsData[id].heading) {
        const heading = friendsData[id].heading + '\u00B0';
        for (let i = 0; i < realtimeHeadingDoms.length; i++) {
          realtimeHeadingDoms[i].innerHTML = '';
          realtimeHeadingDoms[i].appendChild(document.createTextNode(heading));
        }
      }
      if (friendsData[id].gpsTimestamp) {
        const gpsTime =
            TraX.Common.formatTime(friendsData[id].gpsTimestamp, true);
        for (let i = 0; i < realtimeGPSClockDoms.length; i++) {
          realtimeGPSClockDoms[i].innerHTML = '';
          realtimeGPSClockDoms[i].appendChild(document.createTextNode(gpsTime));
        }
      }

      const gpsSpeed = TraX.Units.speedToUnit(friendsData[id].speed) +
          TraX.Units.getLargeSpeedUnit();
      for (let i = 0; i < realtimeSpeedDoms.length; i++) {
        realtimeSpeedDoms[i].innerHTML = '';
        realtimeSpeedDoms[i].appendChild(document.createTextNode(gpsSpeed));
      }

      // TODO: Implement this.
      // let gForce = TraX.Common.(friendsData[id].gForce) + 'G';
      // for (var i = 0; i < realtimeGForceDoms.length; i++) {
      //   realtimeGForceDoms[i].innerHTML = "";
      //   realtimeGForceDoms[i].appendChild(document.createTextNode(gForce));
      // }

      const deviceClock =
          TraX.Common.formatTime(friendsData[id].clientTimestamp, true);
      for (let i = 0; i < realtimeDeviceClockDoms.length; i++) {
        realtimeDeviceClockDoms[i].innerHTML = '';
        realtimeDeviceClockDoms[i].appendChild(
            document.createTextNode(deviceClock));
      }
      const deviceType = TraX.getDeviceType(friendsData[id].userAgent);
      for (let i = 0; i < realtimeDeviceTypeDoms.length; i++) {
        realtimeDeviceTypeDoms[i].innerHTML = '';
        realtimeDeviceTypeDoms[i].appendChild(
            document.createTextNode(deviceType));
      }
      const browser = TraX.getBrowser(friendsData[id].userAgent);
      for (let i = 0; i < realtimeDeviceBrowserDoms.length; i++) {
        realtimeDeviceBrowserDoms[i].innerHTML = '';
        realtimeDeviceBrowserDoms[i].appendChild(
            document.createTextNode(browser));
      }

      // Timers
      lapNumberDom.innerHTML = '';
      lapTimerDom.innerHTML = '';
      lapPredictedTimeDom.innerHTML = '';
      lapPredictedSplitSessionDom.innerHTML = '';
      lapPredictedSplitEverDom.innerHTML = '';

      lapNumberDom.appendChild(
          document.createTextNode('#' + (friendsData[id].lapNum || -1)));
      lapTimerDom.appendChild(document.createTextNode(getText('lapTime', id)));
      lapPredictedTimeDom.appendChild(
          document.createTextNode(getText('predLapTime', id)));
      lapPredictedSplitSessionDom.appendChild(
          document.createTextNode(getText('predLapSplitSession', id)));
      lapPredictedSplitEverDom.appendChild(
          document.createTextNode(getText('predLapSplitEver', id)));
    }

    /**
     * Handle a user being selected in the list.
     *
     * @private
     * @param {string} id The user's id that was selected.
     * @param {boolean} [force=false] Forces the user to be selected instead of
     * toggling..
     */
    function handleSelectUser(id, force) {
      const sel = document.getElementsByClassName('selected');
      for (let i = sel.length - 1; i > -1; i--) {
        sel[i].classList.remove('selected');
      }

      clearInterval(viewerNumUpdateInterval);
      if (!id || (id == selectedId && !force)) {
        selectedId = '';
        // viewerNumParentDom.style.display = "none";
        return;
      }
      let row = document.getElementById('listRow' + id);
      if (row) row.classList.add('selected');
      row = document.getElementById('standingRow' + getRank(id));
      if (row) row.classList.add('selected');

      selectedId = id;
      updateFriendRow(id);

      map.setZoom(15);

      // viewerNumUpdateInterval = setInterval(updateViewerNum,
      // viewerUpdateFrequency);
      // viewerNumDom.innerHTML = 0;
      // viewerNumParentDom.style.display = "block";
    }

    /**
     * Request the latest number of viewers from the server.
     *
     * @private
     */
    function updateViewerNum() {
      TraX.socket.emit('getnumliveview' /* , selectedId*/);
    }
    /**
     * Handles receiving a new number of users watching live data.
     *
     * @private
     * @param {number} num The number of viewers.
     */
    function handleNewViewerNum(num /* , friendId*/) {
      viewerNumDom.innerHTML = num;
      viewerNumParentDom.style.display = 'block';
    }

    /**
     * Handles server notifying us that we will only be receiving data for a
     * specific user from now on.
     *
     * @private
     * @param {string} maskId The ID of the user we will be receiving data of.
     */
    function handleUserMask(maskId) {
      console.log('Mask set for user', maskId);
      if (!maskId) return;
      const friend = TraX.friendsList.find(function(el) {
        return el.id == maskId;
      });
      if (friend) {
        userMask.textContent = 'Only showing user ' + maskId + '(' +
            friend.firstName + ' ' + friend.lastNam + ')';
      } else {
        userMask.textContent = 'Only showing user ' + maskId;
      }
      if (friendStandings && friendStandings.find(function(el) {
        return el.userId == maskId;
      })) {
        handleSelectUser(maskId, true);
      } else {
        selectedId = maskId;
      }
    }

    /**
     * Handles user requesting to enable notifications.
     *
     * @public
     */
    Live.handleToggleNotifs = function() {
      if (!Notification) {
        console.warn(
            'User attempted to enable notifications on browser that ' +
            'doesn\'t support notifications.');
        return;
      }

      Notification.requestPermission().then(function(result) {
        console.log('Notifs:', result);
        if (result === 'granted') {
          sendNotif(
              'Hi there! If you have this page open, I will let you know when' +
              ' your friend starts recording!');
        }
      });
    };
    /**
     * Sends a notification with given message.
     *
     * @private
     * @param {string} body The message to show to the user.
     */
    function sendNotif(body) {
      if (Notification && Notification.permission == 'granted') {
        notifOpts.body = body;
        const n = new Notification(notifTitle, notifOpts);
        setTimeout(n.close.bind(n), 7000);
      }
    }

    /**
     * Print stored data for debugging.
     *
     * @public
     */
    Live.PRINT = function() {
      console.log(
          'Friends List:', TraX.friendsList, 'Friends Data:', friendsData,
          'Friends Standings:', friendStandings, 'Summaries:',
          TraX.summaryList);
    };
  }(window.TraX.Live = window.TraX.Live || {}));
}(window.TraX = window.TraX || {}));
