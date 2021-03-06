// Copyright 2018-2019 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)

/* eslint-disable no-unused-vars */

// Global Constants //
/**
 * Absolute acceleration due to gravity. (m/s)
 * @default
 * @constant
 * @global
 * @type {number}
 */
const Agrav = 9.80665;
/**
 * Milliseconds between timestamps to assume isMultiSession.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const maxGapInSession = 5 * 60 * 1000;
/**
 * Minimum milliseconds a lap is allowed to be.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const minLapTime = 7000;

// Relationship Status //
/**
 * No relationship
 * @default
 * @constant
 * @global
 * @type {number}
 */
const noStatus = -1;
/**
 * User 1 requested to be friends.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const oneRequestStatus = 0;
/**
 * User 2 requested to be friends.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const twoRequestStatus = 1;
/**
 * Users are friends.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const friendStatus = 2;
/**
 * User 1 blocked user 2.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const oneBlockedStatus = 3;
/**
 * User 2 blocked user 1.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const twoBlockedStatus = 4;
/**
 * Both users blocked eachother.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const bothBlockedStatus = 5;
/**
 * User 1 requested User 2 to be crew for 1.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const onePullRequestCrew = 6;
/**
 * User 1 requested to be crew for 2.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const onePushRequestCrew = 7;
/**
 * user 2 requested 1 to be crew for 2.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const twoPushRequestCrew = 8;
/**
 * User 2 requested to be crew for 1.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const twoPullRequestCrew = 9;
/**
 * User 1 is crew for 2.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const oneCrewStatus = 10;
/**
 * User 2 is crew for 1.
 * @default
 * @constant
 * @global
 * @type {number}
 */
const twoCrewStatus = 11;

/* eslint-enable no-unused-vars */

(function(TraX, undefined) {
  /**
   * Unit conversion helper functions.
   * @class Units
   * @augments TraX
   */
  (function(Units, undefined) {
    /**
     * If this is implemented, others should override this with the DOM element
     * that selects the units.
     *
     * @default
     * @public
     * @type {{value: string}|Element}
     */
    TraX.unitDropdownDom = {value: 'imperial'};

    /**
     * Meters per second to miles per hour or kilometers per hour.
     *
     * @public
     * @param {number} input Speed in meters per second.
     * @param {string} [units] The units system to convert to, default uses
     * TraX.unitDropdownDom.value
     * @return {number} Number rounded to tenths place in unit.
     */
    Units.speedToUnit = function(input, units) {
      return Math.round(
          Units.distanceToLargeUnit(input * 60.0 * 60.0, units, true) *
                 10.0) /
          10.0;
    };
    /**
     * Meters to mile or kilometer
     *
     * @public
     * @param {number} input Distance in meters.
     * @param {string} [units] Unit system to convert to, default uses
     * TraX.unitDropdownDom.value
     * @param {boolean} [noround=false] Disable rounding final value to tenths
     * place.
     * @return {number} Converted value.
     */
    Units.distanceToLargeUnit = function(input, units, noround) {
      if (typeof units === 'undefined') {
        units = TraX.unitDropdownDom.value == 'imperial';
      }
      let val;
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
    /**
     * Kilometers per hour to MPH or KPH.
     *
     * @public
     * @param {number} input Speed in kilometers per hour.
     * @param {string} [units] The unit system to convert to, default uses
     * TraX.unitDropdownDom.value
     * @return {number} Converted value.
     */
    Units.speedToLargeUnit = function(input, units) {
      if (typeof units === 'undefined') {
        units = TraX.unitDropdownDom.value == 'imperial';
      }
      let val;
      if (units) {
        val = input / 0.621371;
      } else {
        val = input;
      }
      return Math.round(val * 10.0) / 10.0;
    };
    /**
     * Meters to feet or meters.
     *
     * @public
     * @param {number} input Input in meters.
     * @param {string} [units] The unit system to convert to, default uses
     * TraX.unitDropdownDom.value
     * @return {number} Converted value.
     */
    Units.distanceToSmallUnit = function(input, units) {
      if (typeof units === 'undefined') {
        units = TraX.unitDropdownDom.value == 'imperial';
      }
      if (units) {
        return input * 3.28084;
      } else {
        return input;
      }
    };
    /**
     * Get feet or meters unit.
     *
     * @public
     * @param {string} [units] The unit system to get the units for, default
     * uses TraX.unitDropdownDom.value
     * @return {string} The unit names. (ft or m)
     */
    Units.getSmallDistanceUnit = function(units) {
      if (typeof units === 'undefined') {
        units = TraX.unitDropdownDom.value == 'imperial';
      }
      if (units) {
        return 'ft';
      } else {
        return 'm';
      }
    };
    /**
     * Get miles per hour, or kilometers per hour unit.
     *
     * @public
     * @param {string} [units] The units system to get the unit for, default
     * uses TraX.unitDropdownDom.value
     * @return {string} The unit names. (kmh or mph)
     */
    Units.getLargeSpeedUnit = function(units) {
      if (typeof units === 'undefined') {
        units = TraX.unitDropdownDom.value == 'imperial';
      }
      if (units) {
        return 'mph';
      } else {
        return 'kmh';
      }
    };
    /**
     * Convert given two points latitude and longitude, get the distance between
     * the two. Treats Earth as a sphere with radius 6378.137km.
     *
     * @public
     * @param {number} lat1 The first latitude.
     * @param {number} lng1 The first longitude.
     * @param {number} lat2 The second latitude.
     * @param {number} lng2 The second longitude.
     * @return {number} Distance in meters between the two coords.
     */
    Units.coordToMeters = function(lat1, lng1, lat2, lng2) {
      const R = 6378.137;  // Radius of earth in KM
      const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
      const dLon = lng2 * Math.PI / 180 - lng1 * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d * 1000;
    };
    /**
     * Given two coords, find distance in meters between the two.
     * @see {Units~coordToMeters}
     *
     * @public
     * @param {{lat: number, lng: number}} one First coordinate.
     * @param {{lat: number, lng: number}} two Second coordinate.
     * @return {number} Distance in meters between the two coords.
     */
    Units.latLngToMeters = function(one, two) {
      return Units.coordToMeters(one.lat, one.lng, two.lat, two.lng);
    };
  }(TraX.Units = TraX.Units || {}));
  /**
   * Other common helper functions.
   * @class Common
   * @augments TraX
   */
  (function(Common, undefined) {
    /**
     * Defines a point in space with a color.
     *
     * @public
     * @class
     * @param {number|Common.Point3d} x X Coord or instance of Point3d to copy.
     * @param {number} [y] Y Coord.
     * @param {number} [z] Z Coord.
     * @param {string} [color]
     * @property {number} x X Coord.
     * @property {number} y Y Coord.
     * @property {number} z Z Coord.
     * @property {string} color The color of the point.
     */
    Common.Point3d = function(x, y, z, color) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.color = 'white';

      if (x instanceof Common.Point3d) {
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

    /**
     * Rotates a vector by a given rotation by applying a z->x->y Tait-Bryan
     * rotation. Enabling flip applies the inverse of this rotation.
     *
     * @public
     * @param {Common.Point3d|Array} vector The point to flip defined by xyz
     * values, or 0 1 2 elements in the order of x y z.
     * @param {Array|{a: number, b: number, g: number}} rotation Rotation in
     * alpha beta gamma rotations.
     * @param {boolean} [flip=false] Applies the inverse of the given rotation.
     * @return {Common.Point3d} The rotated vector.
     */
    Common.rotateVector = function(vector, rotation, flip) {
      let point;
      if (vector instanceof Common.Point3d) {
        point = new Common.Point3d(vector);
      } else {
        point = new Common.Point3d(vector[0], vector[1], vector[2]);
      }
      let xRot;
      let yRot;
      let zRot;
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

      const c1 = Math.cos(zRot);
      const s1 = Math.sin(zRot);
      const c2 = Math.cos(xRot);
      const s2 = Math.sin(xRot);
      const c3 = Math.cos(yRot);
      const s3 = Math.sin(yRot);
      // Rotation matrix (z,x,y) Tait-Bryan
      let A = [
        [c1 * c3 - s1 * s2 * s3, -c2 * s1, c1 * s3 + c3 * s1 * s2],
        [c3 * s1 + c1 * s2 * s3, c1 * c2, s1 * s3 - c1 * c3 * s2],
        [-c2 * s3, s2, c2 * c3],
      ];
      // Rotation matrix (x,y,z) Tair-Bryan
      /* var A = [
        [c2 * c3, -c2 * s3, s2],
        [c1 * s3 + c3 * s1 * s2, c1 * c3 - s1 * s2 * s3, -c2 * s1],
        [s1 * s3 - c1 * c3 * s2, c3 * s1 + c1 * s2 * s3, c1 * c2]
      ]; */

      // Apply inverse rotation instead.
      if (flip) {
        const det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
            A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
            A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
        const invdet = 1 / det;

        const iA = [[], [], []];
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

      const x = (point.x * A[0][0]) + (point.y * A[1][0]) + (point.z * A[2][0]);
      const y = (point.x * A[0][1]) + (point.y * A[1][1]) + (point.z * A[2][1]);
      const z = (point.x * A[0][2]) + (point.y * A[1][2]) + (point.z * A[2][2]);

      point.x = x;
      point.y = y;
      point.z = z;

      return point;
    };

    /**
     * Rotates a vector around the X axis by a certain angle in radians.
     * Rotation is applied in-place.
     *
     * @public
     * @param {Common.Point3d} point The vector to rotate.
     * @param {number} rad The angle in radians.
     */
    Common.rotateX = function(point, rad) {
      const y = point.y;
      point.y = (y * Math.cos(rad)) + (point.z * Math.sin(rad) * -1.0);
      point.z = (y * Math.sin(rad)) + (point.z * Math.cos(rad));
    };
    /**
     * Rotates a vector around the Y axis by a certain angle in radians.
     * Rotation is applied in-place.
     *
     * @public
     * @param {Common.Point3d} point The vector to rotate.
     * @param {number} rad The angle in radians.
     */
    Common.rotateY = function(point, rad) {
      const x = point.x;
      point.x = (x * Math.cos(rad)) + (point.z * Math.sin(rad) * -1.0);
      point.z = (x * Math.sin(rad)) + (point.z * Math.cos(rad));
    };
    /**
     * Rotates a vector around the Z axis by a certain angle in radians.
     * Rotation is applied in-place.
     *
     * @public
     * @param {Common.Point3d} point The vector to rotate.
     * @param {number} rad The angle in radians.
     */
    Common.rotateZ = function(point, rad) {
      const x = point.x;
      point.x = (x * Math.cos(rad)) + (point.y * Math.sin(rad) * -1.0);
      point.y = (x * Math.sin(rad)) + (point.y * Math.cos(rad));
    };

    /**
     * Calculates the cross product of two vectors.
     *
     * @public
     * @param {Common.Point3d|Array} a First vector.
     * @param {Common.Point3d|Array} b Second vector.
     * @return {Array} Array of length 3 defining the vector as xyz.
     */
    Common.cross = function(a, b) {
      if (a instanceof Common.Point3d) {
        a[0] = a.x;
        a[1] = a.y;
        a[2] = a.z;
      }
      if (b instanceof Common.Point3d) {
        b[0] = b.x;
        b[1] = b.y;
        b[2] = b.z;
      }
      return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
      ];
    };

    /**
     * Formats a duration in milliseconds as a human-readable string.
     *
     * @public
     * @param {number} msecs The duration in milliseconds to format.
     * @param {boolean} [plusSign=false] Whether to unclude the plus sign on
     * positive numbers or not.
     * @param {number} [minSections=0] Minimum sections of digits to show. <=0
     * shows seconds and milliseconds, >0 shows minutes, >1 shows hours, >2
     * shows days.
     * @return {string} The formatted string.
     */
    Common.formatMsec = function(msecs, plusSign, minSections) {
      msecs = Math.floor(msecs);
      const sign = msecs >= 0 ? (plusSign ? '+' : '') : '-';
      if (msecs < 0) msecs *= -1;
      const milliseconds = msecs % 1000;
      const seconds = Math.floor(msecs / 1000) % 60;
      const minutes = Math.floor(msecs / 1000 / 60) % 60;
      const hours = Math.floor(msecs / 1000 / 60 / 60) % 24;
      const days = Math.floor(msecs / 1000 / 60 / 60 / 24);
      if (minSections > 2 || days > 0) {
        return sign + Common.pad(days, 2) + ':' + Common.pad(hours, 2) + ':' +
            Common.pad(minutes, 2) + ':' + Common.pad(seconds, 2) + '.' +
            Common.pad(milliseconds, 3);
      } else if (minSections > 1 || hours > 0) {
        return sign + Common.pad(hours, 2) + ':' + Common.pad(minutes, 2) +
            ':' + Common.pad(seconds, 2) + '.' + Common.pad(milliseconds, 3);
      } else if (minSections > 0 || minutes > 0) {
        return sign + Common.pad(minutes, 2) + ':' + Common.pad(seconds, 2) +
            '.' + Common.pad(milliseconds, 3);
      } else {
        return sign + Common.pad(seconds, 2) + '.' +
            Common.pad(milliseconds, 3);
      }
    };

    /**
     * Formats a time givin in milliseconds since epoch as a human readable
     * string.
     *
     * @public
     * @param {number} msecs Time as millisconds since epoch.
     * @param {boolean} [showSeconds=false] Whether to show seconds on the time
     * or
     * not.
     * @return {string} Formatted time as a string.
     */
    Common.formatTime = function(msecs, showSeconds) {
      const date = new Date(msecs);
      return TraX.Common.pad(date.getHours(), 2) + ':' +
          TraX.Common.pad(date.getMinutes(), 2) +
          (showSeconds ? (':' + TraX.Common.pad(date.getSeconds(), 2)) : '');
    };

    /**
     * Pad a number with leading zeros to a minimum length of given digits.
     *
     * @public
     * @param {number|string} num Number to pad with leading zeroes.
     * @param {number} digits Number of digits long to make the final string at
     * a minimum.
     * @return {string} Number with leading zeroes to match specified length.
     */
    Common.pad = function(num, digits) {
      let str = String(num);
      while (str.length < digits) {
        str = '0' + str;
      }
      return str;
    };

    /**
     * Linearly interpolates between two coordinates. Does not take into account
     * curvature of Earth. Individually interpolates latitude and longitude.
     *
     * @public
     * @param {{lat: number, lng: number}} one The first coordinate.
     * @param {{lat: number, lng: number}} two The second coordinate.
     * @param {number} val The value from 0 to 1 inclusive to interpolate
     * between
     * the coordinates.
     * @return {{lat: number, lng: number}} The interpolated coord.
     */
    Common.interpolateCoord = function(one, two, val) {
      const latitude = Common.lerp(one['lat'], two['lat'], val);
      const longitude = Common.lerp(one['lng'], two['lng'], val);
      return {lat: latitude, lng: longitude};
    };

    /**
     * Linearly interpolate between two numbers.
     *
     * @public
     * @param {number} one The first number.
     * @param {number} two The second number.
     * @param {number} val Value from 0 to 1 inclusive to interpolate between
     * the given numbers.
     * @return {number} The interpolated value.
     */
    Common.lerp = function(one, two, val) {
      return (1.0 - val) * one + val * two;
    };

    /**
     * Uses the Pythagorean theorem to calculate distance between coordinates as
     * if they were on a flat plane.
     *
     * @public
     * @param {{lat: number, lng: number}} one Coordinate one.
     * @param {{lat: number, lng: number}} two Coordinate one.
     * @return {number} Distance in original latitude and longitude units.
     */
    Common.coordDistance = function(one, two) {
      return Math.sqrt(
          Math.pow(two.lat - one.lat, 2) + Math.pow(two.lng - one.lng, 2));
    };

    /**
     * Check if a line segment intersects a circle.
     *
     * @public
     * @param {number} ax First line end X coord.
     * @param {number} ay First line end Y coord.
     * @param {number} bx Second line end X coord.
     * @param {number} by Second line end Y coord.
     * @param {number} cx Circle end X coord.
     * @param {number} cy Circle end Y coord.
     * @param {number} r Circle radius.
     * @return {boolean} True if intersects, false otherwise.
     */
    Common.segmentIntersectCircle = function(ax, ay, bx, by, cx, cy, r) {
      ax -= cx;
      ay -= cy;
      bx -= cx;
      by -= cy;
      const c = ax * ax + ay * ay - r * r;
      const b = 2 * (ax * (bx - ax) + ay * (by - ay));
      const a = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
      const disc = b * b - 4 * a * c;
      if (disc <= 0) return false;
      const sqrtdisc = Math.sqrt(disc);
      t1 = (-b + sqrtdisc) / (2 * a);
      t2 = (-b - sqrtdisc) / (2 * a);
      if ((0 < t1 && t1 < 1) || (0 < t2 && t2 < 1)) return true;
      return false;
    };

    /**
     * Compare two version strings to see which version is a higher value.
     *
     * @public
     * @param {string} a Version separated by decimals.
     * @param {string} b Version in same format as a.
     * @return {number} -1 if a < b, 0 if a == b, +1 if a > b;
     */
    Common.compareVersion = function(a, b) {
      const as = a.split('.');
      const bs = b.split('.');
      for (let i = 0; i < as.length && i < bs.length; i++) {
        as[i] = Number(as[i]);
        bs[i] = Number(bs[i]);
        if (as[i] < bs[i]) return -1;
        if (as[i] > bs[i]) return 1;
      }
      return 0;
    };
  }(TraX.Common = TraX.Common || {}));
}(window.TraX = window.TraX || {}));
