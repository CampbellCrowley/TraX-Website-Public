// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
(function(Canvases, undefined) {

// Number of points to draw to show a line.
const numAccelPoints = 15;
// The delta angle between points to draw a sphere in radians.
const pointAngleDelta = Math.PI / 5.0;

// DOM Elements.
var gyroCanvas, accelCanvas;
// Canvas contexts.
var gyroCtx, accelCtx;
// Sphere being drawn in canvas.
var sphere;
// Rotation where -Z is down.
TraX.downRotation = {a: 0, b: 0, g: 0};
// Current given rotation of device.
Canvases.rotation = {a: 0, b: 0, g: 0};
// Current acceleration being exerted on device.
Canvases.drawAccel = [0, 0, 0];
// Vector where +X is forwards.
Canvases.forwardVector = [0, 1, 0];
// Accumulator for resetting forward vector.
var forwardAcc = 0;
// Calculated offset between what we think is forwards and the direction GPS
// tells us we are going.
Canvases.headingOffset = 0;
// The current rate at which the device is rotating.
Canvases.rotationRate = {a: 0, b: 0, g: 0};
// The distance the sphere is away from front of page. (Depth into screen)
var distance = 100;
// Dimensions of canvases.
var gyroWidth, gyroHeight, accelWidth, accelHeight;

// Initialize
Canvases.init = function() {
  gyroCanvas = document.getElementById("realtimeGyroSphere");
  accelCanvas = document.getElementById("realtimeAccelCanvas");
  gyroCtx = gyroCanvas.getContext('2d');
  accelCtx = accelCanvas.getContext('2d');
  gyroWidth = gyroCanvas.width;
  gyroHeight = gyroCanvas.height;
  accelWidth = accelCanvas.width;
  accelHeight = accelCanvas.height;

  sphere = new Canvases.sphere3d(50);

  // Render one frame.
  Canvases.renderGyro();
  Canvases.renderAccel();
};

// Class storing information about how to draw a sphere on the canvas.
Canvases.sphere3d = function(radius) {
  this.point = [];
  this.color = "#000000";
  this.radius = (typeof radius === 'undefined') ? 20.0 : radius;
  this.radius = (typeof radius !== 'number') ? 20.0 : radius;
  this.numberOfVertexes = 0;

  for (var alpha = 0.0; alpha < 2.0 * Math.PI; alpha += pointAngleDelta) {
    var point = new TraX.Common.Point3d();

    point.x = Math.cos(alpha) * this.radius;
    point.y = 0;
    point.z = Math.sin(alpha) * this.radius;

    this.point[this.numberOfVertexes++] = point;
  }

  for (var direction = 1; direction >= -1; direction -= 2) {
    for (var beta = pointAngleDelta; beta < Math.PI / 2.0 - pointAngleDelta;
         beta += pointAngleDelta) {
      var r = Math.cos(beta) * this.radius;
      var Y = Math.sin(beta) * this.radius * direction;

      for (var alpha = 0; alpha < Math.PI * 2.0; alpha += pointAngleDelta) {
        var point = new TraX.Common.Point3d();

        point.x = Math.cos(alpha) * r;
        point.y = Y;
        point.z = Math.sin(alpha) * r;

        this.point[this.numberOfVertexes++] = point;
      }
    }
  }
};
// Project a point onto the screen plane.
function projection(xy, z, xyOffset, zOffset, distance) {
  return (distance * xy) / (z - zOffset) + xyOffset;
}

function arrayToRad(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr.push(arr[i] / 180.0 * Math.PI);
  }
  return newArr;
}
function arrayToDeg(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr.push(arr[i] * 180.0 / Math.PI);
  }
  return newArr;
}
// Render the canvas showing orientation/gyro data.
Canvases.renderGyro = function(makeDown) {
  gyroCtx.save();
  gyroCtx.clearRect(0, 0, gyroWidth, gyroHeight);
  var rotatedPoints = [];

  var rotation =
      [Canvases.rotation.a, Canvases.rotation.b, Canvases.rotation.g];

  // TODO: Nothing differnet anymore. Remove?
  var downRotationAdjusted = {
    a: TraX.downRotation.a,
    b: TraX.downRotation.b,
    g: TraX.downRotation.g
  };

  // Gyro Sphere
  for (var i = 0; i < sphere.numberOfVertexes; i++) {
    var point = new TraX.Common.Point3d(sphere.point[i]);

    point = TraX.Common.rotateVector(point, rotation, makeDown);

    rotatedPoints.push(point);
  }

  // Calculated down vector
  for (var i = 0; i < numAccelPoints; i++) {
    var percent = i / numAccelPoints;
    var point =
        new TraX.Common.Point3d(0, 0, -sphere.radius * percent, "magenta");

    point = TraX.Common.rotateVector(point, downRotationAdjusted, false);
    point = TraX.Common.rotateVector(point, rotation, makeDown);

    rotatedPoints.push(point);
  }
  if (!makeDown) {
    // Measured down vector
    for (var i = 0; i < numAccelPoints; i++) {
      var percent = i / numAccelPoints;
      var point =
          new TraX.Common.Point3d(0, 0, -sphere.radius * percent, "green");

      point = TraX.Common.rotateVector(point, downRotationAdjusted, false);

    rotatedPoints.push(point);
    }
  }
  // Calculated forwards vector
  for (var i = 0; i < numAccelPoints; i++) {
    var percent = i / numAccelPoints;
    var point = new TraX.Common.Point3d(
        Canvases.forwardVector[0] * sphere.radius * percent,
        Canvases.forwardVector[1] * sphere.radius * percent,
        Canvases.forwardVector[2] * sphere.radius * percent, "blue");

    point = TraX.Common.rotateVector(point, downRotationAdjusted, true);
    point = TraX.Common.rotateVector(point, rotation, makeDown);

    rotatedPoints.push(point);
  }

  // Flip z and y axes so down is down on the screen, not into the screen.
  if (makeDown) {
    for (var i = 0; i < rotatedPoints.length; i++) {
      // TraX.Common.rotateZ(rotatedPoints[i], Canvases.headingOffset);
      var tmp = new TraX.Common.Point3d(rotatedPoints[i]);
      rotatedPoints[i].y = tmp.z;
      rotatedPoints[i].z = -tmp.y;
    }
  }

  // Sort based off Z to draw things in back first.
  sortPoints(rotatedPoints);

  // Draw all points.
  for (var i = 0; i < rotatedPoints.length; i++) {
    var point = rotatedPoints[i];

    var x = projection(point.x, point.z, gyroWidth / 2.0, 100.0, distance);
    var y = projection(point.y, point.z, gyroHeight / 2.0, 100.0, distance);

    if (x >= 0 && x < gyroWidth) {
      if (y >= 0 && y < gyroHeight) {
        if (point.z < 0) {
          drawPoint(gyroCtx, x, y, 2, point.color);
        } else {
          drawPoint(gyroCtx, x, y, 4, point.color);
        }
      }
    }
  }
  gyroCtx.restore();
};
// Sort points by z-index to draw things in back first.
function sortPoints(points) {
  points.sort(function(a, b) {
    return (a.z == b.z) ? 0 : ((a.z < b.z) ? -1 : 1);
  });
}
// Draw data on canvas showing acceleration data.
Canvases.renderAccel = function(externalDevice) {
  accelCtx.save();
  accelCtx.clearRect(0, 0, accelWidth, accelHeight);

  // Border
  accelCtx.strokeStyle = "rgba(0, 0, 0, 1.0)";
  accelCtx.beginPath();
  accelCtx.rect(
      accelWidth * 0.05, accelHeight * 0.05, accelWidth * 0.90,
      accelHeight * 0.90);
  accelCtx.stroke();
  accelCtx.closePath();

  // 1G guide ring
  accelCtx.strokeStyle = "rgba(125, 125, 125, 0.6)";
  accelCtx.beginPath();
  accelCtx.arc(
      accelWidth * 0.5, accelHeight * 0.5, accelWidth * 0.90 * 3.0 / 4.0 / 2.0,
      0, Math.PI * 2.0);
  accelCtx.stroke();
  accelCtx.closePath();
  // 2G guide ring
  accelCtx.beginPath();
  accelCtx.arc(
      accelWidth * 0.5, accelHeight * 0.5, accelWidth * 0.90 * 3.0 / 4.0, 0,
      Math.PI * 2.0);
  accelCtx.stroke();
  accelCtx.closePath();

  // Acceleration vector3d
  var point = new TraX.Common.Point3d(
      -Canvases.drawAccel[0], Canvases.drawAccel[1], Canvases.drawAccel[2]);

  point = TraX.Common.rotateVector(point, Canvases.rotation, true);
  var Ax_ = point.x;
  var Ay_ = point.y;
  var Az_ = point.z;

  var more = 0;
  if (screen && screen.orientation && !externalDevice) {
    more = -screen.orientation.angle || 0;
    more /= 180.0 / Math.PI;
  }
  TraX.Common.rotateZ(point, -Canvases.rotation.a + more);

  var Ax = point.x;
  var Ay = point.y;
  var Az = point.z + Agrav;

  // Draw lateral acceleration line/points.
  for (var i = 0; i < numAccelPoints; i++) {
    var percent = i / numAccelPoints;
    var x = accelWidth / 2.0 +
        Ax / Agrav / 2.0 * 0.90 * percent * accelWidth * 3.0 / 4.0;
    var y = accelHeight / 2.0 +
        Ay / Agrav / 2.0 * 0.90 * percent * accelHeight * 3.0 / 4.0;
    drawPoint(accelCtx, x, y, 3, "red");
  }

  // Draw vertical acceleration bar.
  accelCtx.fillStyle = Az < 0 ? "rgb(255, 50, 50)" : "red";
  accelCtx.rect(
      accelWidth * 0.95, accelHeight * 0.50, accelWidth * 0.05,
      Az / Agrav / 2.0 * 0.90 * 3.0 / 4.0 * accelHeight);
  accelCtx.fill();

  accelCtx.restore();

  if (!externalDevice) {
    var accelMag = Math.abs(Math.hypot(Ax, Ay, Az));
    var rotMag = Math.abs(
        Math.hypot(
            Canvases.rotationRate.a, Canvases.rotationRate.b,
            Canvases.rotationRate.g));
    // If device is not rotating, and acceleration is greater than 0-60mph in
    // 27 seconds (1 m/s^2), reset which direction is forwards.
    if (rotMag < 0.1 && accelMag > 1.0) {
      // After 50 samples (50 * 16ms = 0.8s), then update forward vector.
      forwardAcc++;
      if (forwardAcc > 50) {
        forwardAcc = 0;
        Canvases.forwardVector =
            [-Ax / accelMag, -Ay / accelMag, -Az / accelMag];
      }
    } else {
      forwardAcc = 0;
    }
  }
};

// Draw a point on the canvas with given settings.
function drawPoint(ctx, x, y, size, color) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, size, 0, 2.0 * Math.PI);
  ctx.fill();
  ctx.restore();
}

Canvases.resetEstimatedVelocity = function(gpsSpeed, gpsHeading) {
  // Need to be moving faster than 1m/s, otherwise the UI will go a little
  // crazy.
  if (gpsSpeed < 1.0) return;
  var newHeading = gpsHeading / 180.0 * Math.PI;

  var point =
      TraX.Common.rotateVector(Canvases.forwardVector, TraX.downRotation, true);
  point = TraX.Common.rotateVector(point, Canvases.rotation, false);

  var estimatedHeading = Math.atan2(point.y, point.x);

  Canvases.headingOffset = newHeading - estimatedHeading;
};

}(window.TraX.Canvases = window.TraX.Canvases || {}));
}(window.TraX = window.TraX || {}));
