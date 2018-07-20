// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)

// Global Constants //
// Filesize conversions.
const byteTokByte = 1 / 1000.0;
const byteToMByte = byteTokByte / 1000.0;
const byteToGByte = byteToMByte / 1000.0;
const byteToTByte = byteToGByte / 1000.0;
const byteToPByte = byteToTByte / 1000.0;
const byteToEByte = byteToPByte / 1000.0;
// Absolute acceleration due to gravity. (m/s)
const Agrav = 9.80665;
// Milliseconds between timestamps to assume isMultiSession.
const maxGapInSession = 5 * 60 * 1000;
// Minimum milliseconds a lap is allowed to be.
const minLapTime = 7000;

// Relationship Status //
// No relationship
const noStatus = -1;
// User 1 requested to be friends.
const oneRequestStatus = 0;
// User 2 requested to be friends.
const twoRequestStatus = 1;
// Users are friends.
const friendStatus = 2;
// User 1 blocked user 2.
const oneBlockedStatus = 3;
// User 2 blocked user 1.
const twoBlockedStatus = 4;
// Both users blocked eachother.
const bothBlockedStatus = 5;
// User 1 requested User 2 to be crew for 1.
const onePullRequestCrew = 6;
// User 1 requested to be crew for 2.
const onePushRequestCrew = 7;
// user 2 requested 1 to be crew for 2.
const twoPushRequestCrew = 8;
// User 2 requested to be crew for 1.
const twoPullRequestCrew = 9;
// User 1 is crew for 2.
const oneCrewStatus = 10;
// User 2 is crew for 1.
const twoCrewStatus = 11;

(function(TraX, undefined) {
(function(Units, undefined) {

// If this is implemented, others should override this with the DOM element that
// selects the units.
TraX.unitDropdownDom = {value: "imperial"};

// Meters per second to miles per hour or kilometers per hour
Units.speedToUnit = function(input, units) {
  return Math.round(
             Units.distanceToLargeUnit(input * 60.0 * 60.0, units, true) *
             10.0) /
      10.0;
};
// Meters to mile or kilometer
Units.distanceToLargeUnit = function(input, units, noround) {
  if (typeof units === "undefined") {
    units = TraX.unitDropdownDom.value == 'imperial';
  }
  var val;
  if (units) {
    val = input / 1609.34;
  } else {
    val = input / 1000.0;
  }
  if (noround) {
    return val;
  }
  return Math.round(val * 10.0) / 10.0;
};
// Kilometers per hour to MPH or KPH.
Units.speedToLargeUnit = function(input, units) {
  if (typeof units === "undefined") {
    units = TraX.unitDropdownDom.value == 'imperial';
  }
  var val;
  if (units) {
    val = input / 0.621371;
  } else {
    val = input;
  }
  return Math.round(val * 10.0) / 10.0;
};
// Meters to feet or meters.
Units.distanceToSmallUnit = function(input, units) {
  if (typeof units === "undefined") {
    units = TraX.unitDropdownDom.value == 'imperial';
  }
  if (units) {
    return input * 3.28084;
  } else {
    return input;
  }
};
// Get feet or meters unit.
Units.getSmallDistanceUnit = function(units) {
  if (typeof units === "undefined") {
    units = TraX.unitDropdownDom.value == 'imperial';
  }
  if (units) {
    return "ft";
  } else {
    return "m";
  }
};
// Get miles per hour, or kilometers per hour unit.
Units.getLargeSpeedUnit = function(units) {
  if (typeof units === "undefined") {
    units = TraX.unitDropdownDom.value == 'imperial';
  }
  if (units) {
    return "mph";
  } else {
    return "kmh";
  }
};
// Convert given two points latitude and longitude, get the distance between the
// two.
Units.coordToMeters = function(lat1, lng1, lat2, lng2) {
  var R = 6378.137;  // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lng2 * Math.PI / 180 - lng1 * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000;
};
// Given two coords, find distance in meters between the two.
Units.latLngToMeters = function(one, two) {
  return Units.coordToMeters(one.lat, one.lng, two.lat, two.lng);
};

}(TraX.Units = TraX.Units || {}));
(function(Common, undefined) {

Common.point3d = function(x, y, z, color) {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.color = "black";

  if (x instanceof Common.point3d) {
    this.x = x.x;
    this.y = x.y;
    this.z = x.z;
    this.color = x.color;
  } else {
    if (typeof x === 'number') this.x = x;
    if (typeof y === 'number') this.y = y;
    if (typeof z === 'number') this.z = z;
    if (typeof color === 'string') this.color = color;
  }
};

Common.rotateVector = function(vector, rotation, flip) {
  var point;
  if (vector instanceof Common.point3d) {
    point = new Common.point3d(vector);
  } else {
    point = new Common.point3d(vector[0], vector[1], vector[2]);
  }
  var xRot, yRot, zRot;
  if (typeof rotation[0] === 'undefined') {
    zRot = rotation.a;
    xRot = rotation.b;
    yRot = rotation.g;
  } else {
    zRot = rotation[0];
    xRot = rotation[1];
    yRot = rotation[2];
  }

  /* var c1 = Math.cos(yRot);
  var s1 = Math.sin(yRot);
  var c2 = Math.cos(xRot);
  var s2 = Math.sin(xRot);
  var c3 = Math.cos(zRot);
  var s3 = Math.sin(zRot);

  // Rotation matrix (x,y,z) Tait-Bryan (transpose)
  var A = [
    [c1 * c3, c2 * s3 + s2 * s1 * c3, s2 * s3 - c2 * s1 * c3],
    [-c1 * s3, c2 * c3 - s2 * s1 * s3, s2 * c3 + c2 * s1 * s3],
    [s1, -s2 * c1, c2 * c1]
  ]; */

  var c1 = Math.cos(zRot);
  var s1 = Math.sin(zRot);
  var c2 = Math.cos(xRot);
  var s2 = Math.sin(xRot);
  var c3 = Math.cos(yRot);
  var s3 = Math.sin(yRot);
  // Rotation matrix (z,x,y) Tait-Bryan
  var A = [
    [c1 * c3 - s1 * s2 * s3, -c2 * s1, c1 * s3 + c3 * s1 * s2],
    [c3 * s1 + c1 * s2 * s3, c1 * c2, s1 * s3 - c1 * c3 * s2],
    [-c2 * s3, s2, c2 * c3]
  ];
  // Rotation matrix (x,y,z) Tair-Bryan
  /* var A = [
    [c2 * c3, -c2 * s3, s2],
    [c1 * s3 + c3 * s1 * s2, c1 * c3 - s1 * s2 * s3, -c2 * s1],
    [s1 * s3 - c1 * c3 * s2, c3 * s1 + c1 * s2 * s3, c1 * c2]
  ]; */

  // Apply inverse rotation instead.
  if (flip) {
    var det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
        A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
        A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    var invdet = 1 / det;

    var iA = [[], [], []];
    iA[0][0] = (A[1][1] * A[2][2] - A[2][1] * A[1][2]) * invdet;
    iA[0][1] = (A[0][2] * A[2][1] - A[0][1] * A[2][2]) * invdet;
    iA[0][2] = (A[0][1] * A[1][2] - A[0][2] * A[1][1]) * invdet;
    iA[1][0] = (A[1][2] * A[2][0] - A[1][0] * A[2][2]) * invdet;
    iA[1][1] = (A[0][0] * A[2][2] - A[0][2] * A[2][0]) * invdet;
    iA[1][2] = (A[1][0] * A[0][2] - A[0][0] * A[1][2]) * invdet;
    iA[2][0] = (A[1][0] * A[2][1] - A[2][0] * A[1][1]) * invdet;
    iA[2][1] = (A[2][0] * A[0][1] - A[0][0] * A[2][1]) * invdet;
    iA[2][2] = (A[0][0] * A[1][1] - A[1][0] * A[0][1]) * invdet;

    A = iA;
  }

  var x = (point.x * A[0][0]) + (point.y * A[1][0]) + (point.z * A[2][0]);
  var y = (point.x * A[0][1]) + (point.y * A[1][1]) + (point.z * A[2][1]);
  var z = (point.x * A[0][2]) + (point.y * A[1][2]) + (point.z * A[2][2]);

  point.x = x;
  point.y = y;
  point.z = z;

  return point;
};

Common.rotateX = function(point, rad) {
  var y = point.y;
  point.y = (y * Math.cos(rad)) + (point.z * Math.sin(rad) * -1.0);
  point.z = (y * Math.sin(rad)) + (point.z * Math.cos(rad));
};
Common.rotateY = function(point, rad) {
  var x = point.x;
  point.x = (x * Math.cos(rad)) + (point.z * Math.sin(rad) * -1.0);
  point.z = (x * Math.sin(rad)) + (point.z * Math.cos(rad));
};
Common.rotateZ = function(point, rad) {
  var x = point.x;
  point.x = (x * Math.cos(rad)) + (point.y * Math.sin(rad) * -1.0);
  point.y = (x * Math.sin(rad)) + (point.y * Math.cos(rad));
};

Common.cross = function(a, b) {
  if (a instanceof Common.point3d) {
    a[0] = a.x;
    a[1] = a.y;
    a[2] = a.z;
  }
  if (b instanceof Common.point3d) {
    b[0] = b.x;
    b[1] = b.y;
    b[2] = b.z;
  }
  return [
    a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
};

Common.formatMsec = function(msecs, plusSign, minSections) {
  msecs = Math.floor(msecs);
  var sign = msecs >= 0 ? (plusSign ? "+" : "") : "-";
  if (msecs < 0) msecs *= -1;
  var milliseconds = msecs % 1000;
  var seconds = Math.floor(msecs / 1000) % 60;
  var minutes = Math.floor(msecs / 1000 / 60) % 60;
  var hours = Math.floor(msecs / 1000 / 60 / 60) % 24;
  var days = Math.floor(msecs / 1000 / 60 / 60 / 24);
  if (minSections > 2 || days > 0) {
    return sign + Common.pad(days, 2) + ":" + Common.pad(hours, 2) + ":" +
        Common.pad(minutes, 2) + ":" + Common.pad(seconds, 2) + "." +
        Common.pad(milliseconds, 3);
  } else if (minSections > 1 || hours > 0) {
    return sign + Common.pad(hours, 2) + ":" + Common.pad(minutes, 2) + ":" +
        Common.pad(seconds, 2) + "." + Common.pad(milliseconds, 3);
  } else if (minSections > 0 || minutes > 0) {
    return sign + Common.pad(minutes, 2) + ":" + Common.pad(seconds, 2) + "." +
        Common.pad(milliseconds, 3);
  } else {
    return sign + Common.pad(seconds, 2) + "." + Common.pad(milliseconds, 3);
  }
};

Common.formatTime = function(msecs, showSeconds) {
  var date = new Date(msecs);
  return TraX.Common.pad(date.getHours(), 2) + ":" +
      TraX.Common.pad(date.getMinutes(), 2) +
      (showSeconds ? ("." + TraX.Common.pad(date.getSeconds(), 2)) : "");
};

Common.pad = function(num, digits) {
  var str = String(num);
  while (str.length < digits) {
    str = "0" + str;
  }
  return str;
};

Common.interpolateCoord = function(one, two, val) {
  var latitude = Common.lerp(one["lat"], two["lat"], val);
  var longitude = Common.lerp(one["lng"], two["lng"], val);
  return {lat: latitude, lng: longitude};
};

Common.lerp = function(one, two, val) { return (1.0 - val) * one + val * two; };

Common.coordDistance = function(one, two) {
  return Math.sqrt(
      Math.pow(two.lat - one.lat, 2) + Math.pow(two.lng - one.lng, 2));
};

Common.compareVersion = function(a, b) {
  var as = a.split('.');
  var bs = b.split('.');
  for (var i = 0; i < a.length && i < b.length; i++) {
    a[i] = Number(a[i]);
    b[i] = Number(b[i]);
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
};

}(TraX.Common = TraX.Common || {}));
}(window.TraX = window.TraX || {}));
