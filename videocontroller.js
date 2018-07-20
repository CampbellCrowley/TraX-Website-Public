// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
(function(Video, undefined) {

// DOM Elements
var enableVideoDom, videoPreviewDom, videoCanvasesDom;

// States and objects //
// Streams from cameras currently open.
var localStreams = [];
// Media recorders receiving streams and buffering data.
var mediaRecorders = [];
// Are we currently recording cameras.
var recording = false;
// Currentl lap number.
var lapNum = -1;

Video.init = function() {
  enableVideoDom = document.getElementById('enableVideo');
  videoPreviewDom = document.getElementById('realtimeVideo');
  videoCanvasesDom = document.getElementById('videoCanvases');
};

// Check if we have permission to edit user's data.
Video.getPerms = function(silent) {};

// Set that we have perms or not and update UI.
Video.setPerms = function(perm) {};

// Start buffering or streaming video.
Video.startRecording = function() {
  if (recording || !enableVideoDom.checked) return false;
  recorder = function(stream, index) {
    const mediaRecorder = new MediaRecorder(stream);
    var recordedChunks = [];

    const fileType = mediaRecorder.mimeType;
    var ext = ".vid";
    if (fileType == "video/webm") ext = ".webm";
    if (fileType == "video/mp4") ext = ".mp4";
    const fileName = "TraX " + (new Date()).toString() + " Cam" + index +
        " Lap" + lapNum + ext;

    mediaRecorder.addEventListener('dataavailable', function(e) {
      if (e.data.size > 0) recordedChunks.push(e.data);
    });
    mediaRecorder.addEventListener('stop', function() {
      console.log("Downloading recording...");
      download(fileName, recordedChunks, true);
    });
    mediaRecorder.start();
    mediaRecorders.push(mediaRecorder);
  };
  mediaRecorders = [];
  recording = true;
  for (var i = 0; i < localStreams.length; i++) {
    recorder(localStreams[i], i);
  }
  console.log("Starting recording...");
  return true;
};
// Stop streaming or buffering video.
Video.stopRecording = function(preventDelayedTrigger) {
  if (!recording) return;
  for (var i = 0; i < mediaRecorders.length; i++) {
    mediaRecorders[i].stop();
  }
  console.log("Stopping recording...");
  recording = false;
  if (!preventDelayedTrigger) {
    if (confirm(
            "The videos have been recorded. Would you like to download them now?\nYou may download then from the options menu indiviually.")) {
      setTimeout(function() {
        const delayed = document.getElementsByClassName("DELAYEDDOWNLOADLINK");
        for (var i = delayed.length - 1; i >= 0; i--) {
          delayed[i].click();
          delayed[i].classList.remove("DELAYEDDOWNLOADLINK");
        }
      }, 1000);
    }
  }
};
// Toggle the visibility of cameras. Also opens and closes streams of video.
// Must be open in order to record video.
Video.toggleVideo = function(force) {
  if (typeof force !== 'undefined') {
    enableVideoDom.checked = force;
  }
  if (TraX.debugMode) console.log("Video open:", enableVideoDom.checked);
  videoPreviewDom.style.display = enableVideoDom.checked ? "block" : "none";
  TraX.setURLOption("video", enableVideoDom.checked ? "1" : undefined);
  if (enableVideoDom.checked) {
    videoPreviewDom.scrollIntoView({behaviour: 'smooth'});
    getCamera();
  } else {
    releaseCamera();
  }
};
// Get all cameras and start streams to record them.
function getCamera() {
  navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        var audioIndex = -1;
        var backupAudio = -1;
        for (var i = 0; i < devices.length; i++) {
          if (devices[i].kind == "audioinput") {
            if (devices[i].deviceId == "default") {
              audioIndex = i;
              break;
            } else if (backupAudio < 0) {
              backupAudio = i;
            }
          }
        }
        if (audioIndex < 0 && backupAudio >= 0) {
          audioIndex = backupAudio;
        }
        console.log(
            "Media Devices:", devices, "Using audio input:", audioIndex);
        for (var i = 0; i < devices.length; i++) {
          if (devices[i].kind == "videoinput" ) {
            var constraints = {video: {deviceId: {exact: devices[i].deviceId}}};
            if (audioIndex >= 0) {
              constraints.audio = {
                deviceId: {exact: devices[audioIndex].deviceId}
              };
            }
            navigator.mediaDevices.getUserMedia(constraints)
                .then(handleRecordSucces)
                .catch(handleRecordFail);
          }
        }
      })
      .catch(function(err) { console.log(err); });
}
// Release all cameras and stop streaming data.
function releaseCamera() {
  if (!localStreams) return;
  for (var i = 0; i < localStreams.length; i++) {
    var tracks = localStreams[i].getTracks();
    for (var j = 0; j < tracks.length; j++) {
      tracks[j].stop();
    }
    localStreams.splice(i, 1);
    i--;
  }
  videoCanvasesDom.innerHTML = "";
  console.log("Video Cameras released");
}
// Successfully started receiving data from camera, show it on UI.
function handleRecordSucces(stream) {
  localStreams.push(stream);
  var newVideo = document.createElement("video");
  newVideo.className = "videoCanvas";
  newVideo.muted = true;
  newVideo.autoplay = true;
  newVideo.srcObject = stream;
  // newVideo.play();
  videoCanvases.appendChild(newVideo);
  console.log("Video Camera authorized");
}
// Failed to get camera stream, notify user.
function handleRecordFail(err) {
  console.error("Failed to get camera", err);
  TraX.showMessageBox("Failed to get camera");
  Video.toggleVideo(false);
}

function download(filename, chunks, delay) {
  var blob = new Blob(chunks);
  var a = document.createElement('a');
  a.download = filename;
  a.href = URL.createObjectURL(blob);
  if (delay) a.classList.add("DELAYEDDOWNLOADLINK");
  console.log(
      "Downloading (delay:", (delay && "true") || "false", ")", filename,
      a.href, chunks, blob);
  a.appendChild(document.createTextNode("Re-Download: " + filename));
  var p = document.createElement('p');
  p.appendChild(a);
  enableVideoDom.parentNode.appendChild(p);
  if (!delay) a.click();
}

Video.lapChange = function(newNum) {
  lapNum = newNum;
  if (recording) {
    Video.stopRecording(true);
    Video.startRecording();
  }
};

}(window.TraX.Video = window.TraX.Video || {}));
}(window.TraX = window.TraX || {}));
