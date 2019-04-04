// Copyright 2018-2019 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)

(function(TraX, undefined) {
  /**
   * Import into TraX.
   * @TODO: Do this.
   * @class Import
   * @augments TraX
   */
  (function(Import, undefined) {

  }(window.TraX.Import = window.TraX.Import || {}));

  /**
   * Export from TraX.
   * @class Export
   * @augments TraX
   */
  (function(Export, undefined) {
    /**
     * JS Object to XML converter instance.
     * @private
     */
    let x2js;
    /**
     * Settings for converting to XML/GPX format.
     * @private
     * @default
     * @type {Object}
     */
    const gpxOpts = {
      useDoubleQuotes: true,
    };

    let version = 'Unknown';

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
          version = xhr.responseText.trim();
          console.log('Version', version);
        } else {
          console.warn(
              'Failed to get current client version!', xhr.status,
              xhr.response);
        }
      };
      xhr.send();
    }
    requestVersionNum();
    /**
     * Download given sessionData between durations as a GPX formatted file.
     *
     * @public
     * @param {Object} sessionData The session data to export.
     * @param {Array.<{0: number, 1: number}>} [durations] start and end indexes
     * of sessionData to export.
     * @param {string} trackName The formatted name of the track to include in
     * the file.
     * @param {string} sessionName The formatted name of the session to include
     * in the file.
     */
    Export.exportGPX = function(
        sessionData, durations, trackName, sessionName) {
      let intData = [];
      if (durations && durations.length > 0 && durations[0].length == 2) {
        for (let i = 0; i < durations.length; i++) {
          intData.concat(sessionData.slice(durations[i][0], durations[i][1]));
        }
      } else {
        intData = sessionData;
      }
      const finalData = {
        gpx: {
          _version: '1.1',
          _creator: 'TraX',
          metadata: {
            link: {_href: 'trax.campbellcrowley.com', text: 'TraX'},
            time: dateToXML(intData[0]['clientTimestamp']),
          },
          trk: {name: trackName, trkseg: {trkpt: []}},
        },
      };
      for (let i = 0; i < intData.length; i++) {
        if (!intData[i]['longitude'] || !intData[i]['latitude']) {
          continue;
        }
        finalData.gpx.trk.trkseg.trkpt.push({
          _lon: intData[i]['longitude'],
          _lat: intData[i]['latitude'],
          ele: intData[i]['altitude'],
          time: dateToXML(intData[i]['clientTimestamp']),
        });
      }
      if (!x2js) {
        x2js = new X2JS(gpxOpts);
      }
      Export.download(
          sessionName + finalData.gpx.metadata.time + '.gpx',
          formatXml(x2js.json2xml_str(finalData), true));
    };
    /**
     * Convert a date given in millisectonds since epoch, to XML format.
     *
     * @private
     * @param {number} msecs Date in milliseconds since epoch.
     * @return {string} Formatted date for XML.
     */
    function dateToXML(msecs) {
      const date = new Date(msecs);
      return date.getUTCFullYear() + '-' +
          TraX.Common.pad(date.getUTCMonth() + 1, 2) + '-' +
          TraX.Common.pad(date.getUTCDate(), 2) + 'T' +
          TraX.Common.pad(date.getUTCHours(), 2) + ':' +
          TraX.Common.pad(date.getUTCMinutes(), 2) + ':' +
          TraX.Common.pad(date.getUTCSeconds(), 2) + '.' +
          TraX.Common.pad(date.getUTCMilliseconds(), 3) + 'Z';
    }
    /**
     * Format XML file as human readable.
     *
     * @private
     * @param {string} xml The xml string to format as human readable.
     * @param {boolean} [addPrefix=false] Add the xml version to the top of the
     * file.
     * @return {string} Human readable formatted xml.
     */
    function formatXml(xml, addPrefix) {
      let formatted = '';
      const reg = /(>)(<)(\/*)/g;
      xml = xml.replace(reg, '$1\n$2$3');
      let pad = 0;
      xml.split('\n').forEach(function(node, index) {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad != 0) {
            pad -= 1;
          }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        let padding = '';
        for (let i = 0; i < pad; i++) {
          padding += '  ';
        }

        formatted += padding + node + '\n';
        pad += indent;
      });

      if (addPrefix) {
        formatted = '<?xml version="1.0" encoding="UTF-8"?>\n' + formatted;
      }

      return formatted;
    }
    /**
     * Export given sessionData between durations as a raw JSON file for use in
     * re-importing back into TraX. Exports ALL data.
     *
     * @public
     * @param {Object} sessionData The session data to export.
     * @param {Array.<{0: number, 1: number}>} [durations] start and end indexes
     * of sessionData to export.
     * @param {string} trackName The formatted name of the track to include in
     * the file.
     * @param {string} sessionName The formatted name of the session to include
     * in the file.
     */
    Export.exportJSON = function(
        sessionData, durations, trackName, sessionName) {
      let finalData = [];
      if (durations && durations.length > 0 && durations[0].length == 2) {
        for (let i = 0; i < durations.length; i++) {
          finalData.concat(sessionData.slice(durations[i][0], durations[i][1]));
        }
      } else {
        finalData = sessionData;
      }
      Export.download(
          sessionName + dateToXML(finalData[0]['clientTimestamp']) + '.json',
          JSON.stringify(finalData, null, 2));
    };
    /** Export given sessionData between durations as a CSV that can be used in
     * other apps.
     *
     * @public
     * @param {Object} sessionData The session data to export.
     * @param {Array.<{0: number, 1: number}>} [durations] start and end indexes
     * of sessionData to export.
     * @param {string} trackName The formatted name of the track to include in
     * the file.
     * @param {string} sessionName The formatted name of the session to include
     * in the file.
     */
    Export.exportFormattedCSV = function(
        sessionData, durations, trackName, sessionName) {
      let exportScope = '';
      const now = new Date();
      let intData = [];
      if (durations && durations.length > 0 && durations[0].length == 2) {
        for (let i = 0; i < durations.length; i++) {
          intData.concat(sessionData.slice(durations[i][0], durations[i][1]));
        }
        exportScope = 'Partial session';
      } else {
        intData = sessionData;
        exportScope = 'Whole session';
      }
      const driverName = intData[0]['driverName'] || '';
      const finalData = [
        ['This file is created using RaceChrono ' +
         'v4.1.5 ( http://www.racechrono.com/ ).'],
        [],
        ['Session title', sessionName.replace(/,/g, '')],
        ['Session type', 'Lap timing'],
        ['Track name', ''],
        ['Driver name', driverName],
        ['Export scope', exportScope],
        [
          'Created',
          now.getUTCDate() + '/' + (now.getUTCMonth() + 1) + '/' +
              now.getUTCFullYear(),
          now.getUTCHours() + ':' + TraX.Common.pad(now.getUTCMinutes(), 2),
        ],
        [
          'Note',
          (intData[0]['traxVersion'] ?
               ('Recorded with TraX v' +
                intData[0]['traxVersion'].replace('\n', '')) :
               ''),
          'File created using TraX v' + version + ' ( ' + location.href + ' ).',
          'Using RaceChrono style for import into Serious-Racing.com',
        ],
        [],
        [
          'Lap #',
          'Timestamp (s)',
          'Distance (m)',
          'Distance (km)',
          'Locked satellites',
          'Latitude (deg)',
          'Longitude (deg)',
          'Speed (m/s)',
          'Speed (kph)',
          'Speed (mph)',
          'Altitude (m)',
          'Bearing (deg)',
          'Longitudinal Acceleration (G)',
          'Lateral Acceleration (G)',
          'X-position (m)',
          'Y-position (m)',
          'RPM (rpm)',
          'Throttle Position (%)',
          'Trap name',
        ],
      ];
      let lastLng = 0;
      let lastLat = 0;
      let lastAlt = 0;
      let lastAcc = 0;
      let lastSpd = 0;


      let lastHed = 0;
      let startPos;
      let distTotal = 0;
      for (let i = 0; i < intData.length; i++) {
        const dat = intData[i];
        if (!dat['longitude'] || !dat['latitude']) continue;
        const gF = TraX.DataView.transformSensors(dat);
        if (lastLng && dat['longitude']) {
          distTotal += TraX.Units.coordToMeters(
              lastLat, lastLng, dat['latitude'], dat['longitude']);
        }
        lastLng = dat['longitude'] || lastLng;
        lastLat = dat['latitude'] || lastLat;
        lastAlt = dat['altitude'] || lastAlt;
        lastAcc = dat['accuracy'] || lastAcc;
        lastSpd = dat['gpsSpeed'] || lastSpd;
        lastHed = dat['heading'] || lastHed;
        if (lastLng && !startPos) startPos = {lat: lastLat, lng: lastLng};
        finalData.push([
          dat['lap'] > 0 ? dat['lap'] : 'N/A',          // Lap #
          Math.round(dat['clientTimestamp'] / 1000.0),  // Timestamp (s)
          distTotal,                                    // Distance (m)
          distTotal / 1000.0,                           // Distance (km)
          lastLng ? '10' : '0',                         // Locked satellites
          lastLat,                                      // Latitude (deg)
          lastLng,                                      // Longitude (deg)
          lastSpd,                                      // Speed (m/s)
          TraX.Units.speedToUnit(lastSpd, false),       // Speed (kph)
          TraX.Units.speedToUnit(lastSpd, true),        // Speed (mph)
          lastAlt,                                      // Altitude (m)
          lastHed,                                      // Bearing (deg)
          gF.y / Agrav,  // Longutudinal Acceleration (g)
          gF.x / Agrav,  // Lateral Acceleration (g)
          startPos ?
              TraX.Units.latLngToMeters(
                  startPos, {lat: lastLat, lng: startPos.lng}) :
              0,  // X-position (m)
          startPos ?
              TraX.Units.latLngToMeters(
                  startPos, {lat: startPos.lat, lng: lastLng}) :
              0,  // Y-position (m)
          '',     // RPM (rpm)
          '',     // Throttle Position (%)
          '',     // Trap name
        ]);
      }
      let longestRow = 0;
      for (let i = 0; i < finalData.length; i++) {
        if (finalData[i].length > longestRow) longestRow = finalData[i].length;
      }
      for (let i = 0; i < finalData.length; i++) {
        while (finalData[i].length < longestRow) finalData[i].push('');
        finalData[i] = finalData[i].join(',');
      }
      Export.download(
          sessionName + dateToXML(intData[0]['clientTimestamp']) + '.csv',
          finalData.join('\n'));
    };
    /** Export sessionData between durations as a CSV with raw sensor data.
     *
     * @public
     * @param {Object} sessionData The session data to export.
     * @param {Array.<{0: number, 1: number}>} [durations] start and end indexes
     * of sessionData to export.
     * @param {string} trackName The formatted name of the track to include in
     * the file.
     * @param {string} sessionName The formatted name of the session to include
     * in the file.
     */
    Export.exportRawCSV = function(
        sessionData, durations, trackName, sessionName) {
      let intData = [];
      if (durations && durations.length > 0 && durations[0].length == 2) {
        for (let i = 0; i < durations.length; i++) {
          intData.concat(sessionData.slice(durations[i][0], durations[i][1]));
        }
      } else {
        intData = sessionData;
      }
      const finalData = [[
        'Timestamp (ms)',
        'Longitude (deg)',
        'Latitude (deg)',
        'Altitude (m)',
        'Accuracy (m)',
        'Speed (m/s)',
        'gyro a (deg)',
        'gyro b (deg)',
        'gyro g (deg)',
        'accelerometer x (m/s)',
        'accelerometer y (m/s)',
        'accelerometer z (m/s)',
      ].join(',')];
      let lastLng = 0;
      let lastLat = 0;
      let lastAlt = 0;
      let lastAcc = 0;
      for (let i = 0; i < intData.length; i++) {
        lastLng = intData[i]['longitude'] || lastLng;
        lastLat = intData[i]['latitude'] || lastLat;
        lastAlt = intData[i]['altitude'] || lastAlt;
        lastAcc = intData[i]['accuracy'] || lastAcc;
        finalData.push([
          intData[i]['clientTimestamp'],
          lastLng,
          lastLat,
          lastAlt,
          lastAcc,
          intData[i]['gpsSpeed'],
          intData[i]['gyro'][0],
          intData[i]['gyro'][1],
          intData[i]['gyro'][2],
          intData[i]['accelIncGrav'][0],
          intData[i]['accelIncGrav'][1],
          intData[i]['accelIncGrav'][2],
        ].join(','));
      }
      Export.download(
          sessionName + dateToXML(intData[0]['clientTimestamp']) + '.csv',
          finalData.join('\n'));
    };
    /**
     * Download data as file with given filename.
     *
     * @public
     * @param {string} filename The name of the file.
     * @param {*} data Any data that can be made into a Blob for downloading.
     */
    Export.download = function(filename, data) {
      console.log('Downloading', filename);
      let blob = data;
      if (!(data instanceof Blob)) blob = new Blob([data], {type: 'text/xml'});
      const a = document.createElement('a');
      a.download = filename;
      a.href = URL.createObjectURL(blob);
      a.click();
      document.body.appendChild(a);
      a.outerHTML = '';
    };
  }(window.TraX.Export = window.TraX.Export || {}));
}(window.TraX = window.TraX || {}));
