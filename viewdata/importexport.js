// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)

(function(TraX, undefined) {
// Import into TraX. //
// TODO: Do this.
(function(Import, undefined) {

}(window.TraX.Import = window.TraX.Import || {}));

// Export from TraX. //
(function(Export, undefined) {
// JS Object to XML converter instance.
var x2js;
// Settings for converting to XML/GPX format.
const gpxOpts = {
  useDoubleQuotes: true
};
// Download given sessionData between durations as a GPX formatted file.
Export.exportGPX = function(sessionData, durations, trackName, sessionName) {
  var intData = [];
  if (durations && durations.length > 0 && durations[0].length == 2) {
    for (var i = 0; i < durations.length; i++) {
      intData.concat(sessionData.slice(durations[i][0], durations[i][1]));
    }
  } else {
    intData = sessionData;
  }
  var finalData = {
    gpx: {
      _version: "1.1",
      _creator: "TraX",
      metadata: {
        link: {_href: "trax.campbellcrowley.com", text: "TraX"},
        time: dateToXML(intData[0]["clientTimestamp"])
      },
      trk: {name: trackName, trkseg: {trkpt: []}}
    }
  };
  for (var i = 0; i < intData.length; i++) {
    if (!intData[i]["longitude"] || !intData[i]["latitude"]) {
      continue;
    }
    finalData.gpx.trk.trkseg.trkpt.push({
      _lon: intData[i]["longitude"],
      _lat: intData[i]["latitude"],
      ele: intData[i]["altitude"],
      time: dateToXML(intData[i]["clientTimestamp"])
    });
  }
  if (!x2js) {
    x2js = new X2JS(gpxOpts);
  }
  Export.download(
      sessionName + finalData.gpx.metadata.time + ".gpx",
      formatXml(x2js.json2xml_str(finalData), true));
};
// Convert a date given in millisectonds since epoch, to XML format.
function dateToXML(msecs) {
  var date = new Date(msecs);
  return date.getUTCFullYear() + "-" +
      TraX.Common.pad(date.getUTCMonth() + 1, 2) + "-" +
      TraX.Common.pad(date.getUTCDate(), 2) + "T" +
      TraX.Common.pad(date.getUTCHours(), 2) + ":" +
      TraX.Common.pad(date.getUTCMinutes(), 2) + ":" +
      TraX.Common.pad(date.getUTCSeconds(), 2) + "." +
      TraX.Common.pad(date.getUTCMilliseconds(), 3) + "Z";
}
// Format XML file as human readable.
function formatXml(xml, addPrefix) {
  var formatted = '';
  var reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\n$2$3');
  var pad = 0;
  jQuery.each(xml.split('\n'), function(index, node) {
    var indent = 0;
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

    var padding = '';
    for (var i = 0; i < pad; i++) {
      padding += '  ';
    }

    formatted += padding + node + '\n';
    pad += indent;
  });

  if (addPrefix)
    formatted = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + formatted;

  return formatted;
}
// Export given sessionData between durations as a raw JSON file for use in
// re-importing back into TraX. Exports ALL data.
Export.exportJSON = function(sessionData, durations, trackName, sessionName) {
  var finalData = [];
  if (durations && durations.length > 0 && durations[0].length == 2) {
    for (var i = 0; i < durations.length; i++) {
      finalData.concat(sessionData.slice(durations[i][0], durations[i][1]));
    }
  } else {
    finalData = sessionData;
  }
  Export.download(
      sessionName + dateToXML(finalData[0]["clientTimestamp"]) + ".json",
      JSON.stringify(finalData, null, 2));
};
// Export given sessionData between durations as a CSV that can be used in other
// apps.
Export.exportFormattedCSV = function(
    sessionData, durations, trackName, sessionName) {
  var exportScope = "";
  var now = new Date();
  var intData = [];
  if (durations && durations.length > 0 && durations[0].length == 2) {
    for (var i = 0; i < durations.length; i++) {
      intData.concat(sessionData.slice(durations[i][0], durations[i][1]));
    }
    exportScope = "Partial session";
  } else {
    intData = sessionData;
    exportScope = "Session start";
  }
  var driverName = intData[0]["driverName"] ? intData[0]["driverName"] : "";
  var finalData = [
    ["This file was created using TraX v" + TraX.getVersion() + " ( " +
     location.href + " )."],
    [], ["Session title", "\"" + sessionName + "\""],
    ["Session type", "Data logging"], ["", ""], ["Driver name", driverName],
    ["Export scope", exportScope],
    [
      "Created", now.getUTCDate() + "/" + (now.getUTCMonth() + 1) + "/" +
          now.getUTCFullYear(),
      now.getUTCHours() + ":" + TraX.Common.pad(now.getUTCMinutes(), 2)
    ],
    [
      "Note", (intData[0]["traxVersion"] ?
                   ("Recorded with TraX v" +
                    intData[0]["traxVersion"].replace('\n', '')) :
                   "")
    ],
    [],
    [
      "Lap #", "Timestamp (s)", "Distance (m)", "Distance (km)",
      "Locked satellites", "Latitude (deg)", "Longitude (deg)", "Speed (m/s)",
      "Speed (kph)", "Speed (mph)", "Altitude (m)", "Bearing (deg)",
      "Longitudinal Acceleration (G)", "Lateral Acceleration (G)",
      "X-position (m)", "Y-position (m)", "RPM (rpm)", "Throttle Position (%)",
      "Trap name"
    ]
  ];
  var lastLng = 0, lastLat = 0, lastAlt = 0, lastAcc = 0, lastSpd = 0,
      lastHed = 0;
  var startPos;
  var distTotal = 0;
  for (var i = 0; i < intData.length; i++) {
    var dat = intData[i];
    var gF = TraX.DataView.transformSensors(dat);
    if (lastLng && dat["longitude"])
      distTotal += TraX.Units.coordToMeters(
          lastLat, lastLng, dat["latitude"], dat["longitude"]);
    lastLng = dat["longitude"] || lastLng;
    lastLat = dat["latitude"] || lastLat;
    lastAlt = dat["altitude"] || lastAlt;
    lastAcc = dat["accuracy"] || lastAcc;
    lastSpd = dat["gpsSpeed"] || lastSpd;
    lastHed = dat["heading"] || lastHed;
    if (lastLng && !startPos) startPos = {lat: lastLat, lng: lastLng};
    finalData.push([
      dat["lap"] || "N/A",                     // Lap #
      dat["clientTimestamp"] / 1000.0,         // Timestamp (s)
      distTotal,                               // Distance (m)
      distTotal / 1000.0,                      // Distance (km)
      lastLng ? "10" : "0",                    // Locked satellites
      lastLat,                                 // Latitude (deg)
      lastLng,                                 // Longitude (deg)
      lastSpd,                                 // Speed (m/s)
      TraX.Units.speedToUnit(lastSpd, false),  // Speed (kph)
      TraX.Units.speedToUnit(lastSpd, true),   // Speed (mph)
      lastAlt,                                 // Altitude (m)
      lastHed,                                 // Bearing (deg)
      gF.y / Agrav,                            // Longutudinal Acceleration (g)
      gF.x / Agrav,                            // Lateral Acceleration (g)
      startPos ?
          TraX.Units.latLngToMeters(
              startPos, {lat: lastLat, lng: startPos.lng}) :
          0,  // X-position (m)
      startPos ?
          TraX.Units.latLngToMeters(
              startPos, {lat: startPos.lat, lng: lastLng}) :
          0,  // Y-position (m)
      "",     // RPM (rpm)
      "",     // Throttle Position (%)
      ""      // Trap name
    ]);
  }
  for (var i = 0; i < finalData.length; i++) {
    finalData[i] = finalData[i].join(",");
  }
  Export.download(
      sessionName + dateToXML(intData[0]["clientTimestamp"]) + ".csv",
      finalData.join("\n"));
};
// Export sessionData between durations as a CSV with raw sensor data.
Export.exportRawCSV = function(sessionData, durations, trackName, sessionName) {
  var intData = [];
  if (durations && durations.length > 0 && durations[0].length == 2) {
    for (var i = 0; i < durations.length; i++) {
      intData.concat(sessionData.slice(durations[i][0], durations[i][1]));
    }
  } else {
    intData = sessionData;
  }
  var finalData = [[
    "Timestamp (ms)", "Longitude (deg)", "Latitude (deg)", "Altitude (m)",
    "Accuracy (m)", "Speed (m/s)", "gyro a (deg)", "gyro b (deg)",
    "gyro g (deg)", "accelerometer x (m/s)", "accelerometer y (m/s)",
    "accelerometer z (m/s)"
  ].join(",")];
  var lastLng = 0, lastLat = 0, lastAlt = 0, lastAcc = 0;
  for (var i = 0; i < intData.length; i++) {
    lastLng = intData[i]["longitude"] || lastLng;
    lastLat = intData[i]["latitude"] || lastLat;
    lastAlt = intData[i]["altitude"] || lastAlt;
    lastAcc = intData[i]["accuracy"] || lastAcc;
    finalData.push([
      intData[i]["clientTimestamp"], lastLng, lastLat, lastAlt, lastAcc,
      intData[i]["gpsSpeed"], intData[i]["gyro"][0], intData[i]["gyro"][1],
      intData[i]["gyro"][2], intData[i]["accelIncGrav"][0],
      intData[i]["accelIncGrav"][1], intData[i]["accelIncGrav"][2]
    ].join(","));
  }
  Export.download(
      sessionName + dateToXML(intData[0]["clientTimestamp"]) + ".csv",
      finalData.join("\n"));
};
// Download data as file with given filename.
Export.download = function(filename, data) {
  console.log("Downloading", filename);
  var blob = data;
  if (!(data instanceof Blob)) blob = new Blob([data], {type: 'text/xml'});
  var a = document.createElement('a');
  a.download = filename;
  a.href = URL.createObjectURL(blob);
  a.click();
  document.body.appendChild(a);
  a.outerHTML = "";
}
}(window.TraX.Export = window.TraX.Export || {}));
}(window.TraX = window.TraX || {}));
