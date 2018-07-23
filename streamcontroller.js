// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(TraX, undefined) {
/**
 * Manages phone cameras, capturing the media, and then streaming the media to
 * server.
 *
 * This may NOT be used with the other Video class.
 *
 * @class Video
 * @augments TraX
 */
(function(Video, undefined) {
// var SESSION_STATUS;
// var STREAM_STATUS;

// const GOpts = {'scope': 'https://www.googleapis.com/auth/youtube.force-ssl'};
// const flashphonerURL =
//     "https://dev.campbellcrowley.com/trax/video/flashphoner-api-0.5.27/
//                                                 flashphoner-no-flash.min.js";
// const youTubeRTMP = "rtmp://a.rtmp.youtube.com/live2/";

// DOM Elements
// let authorizeButtonDom;
let enableVideoDom;
let videoPreviewDom;
let videoCanvasesDom;

// States and objects //
// Streams from cameras currently open.
let localStreams = [];
// Media recorders receiving streams and buffering data.
let mediaRecorders = [];
// The user has given permission to stream to YouTube.
let havePerms = false;
// Are we currently recording cameras.
let recording = false;
// The access token for managing YouTube data.
// var accessToken = "";
// Has flashphoner been initialized.
// var flashphonerReady = false;
// Has flashphoner been downloaded.
// var flashphonerFetched = false;

/**
 * Initialize Video module.
 *
 * @public
 */
Video.init = function() {
  // authorizeButtonDom = document.getElementById('authorizeVideo');
  enableVideoDom = document.getElementById('enableVideo');
  videoPreviewDom = document.getElementById('realtimeVideo');
  videoCanvasesDom = document.getElementById('videoCanvases');

  // enableVideoDom.disabled = true;

  // downloadFlashphoner();
};

/**
 * Download flashphoner to manage streaming video.
 *
 * @private
 */
/* function downloadFlashphoner() {
  if (flashphonerFetched) return;
  if (!TraX.initialized) {
    setTimeout(downloadFlashphoner, 50);
    return;
  }
  flashphonerFetched = true;
  var script = document.createElement('script');
  script.src = flashphonerURL;
  script.type = "text/javascript";
  script.onload = flashphonerDownloaded;
  document.getElementsByTagName("head")[0].appendChild(script);
  console.log("Downloading Flashphoner");
}

function flashphonerDownloaded() {
  console.log("Downloaded Flashphoner");
  SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
  STREAM_STATUS = Flashphoner.constants.STREAM_STATUS;
  Flashphoner.init();
  flashphonerReady = true;
}*/

/**
 * Check if we have permission to edit user's data.
 *
 * @public
 * @param {boolean} [silent=false] Reduce messages sent to user.
 */
Video.getPerms = function(silent) {
  Video.setPerms(true);
  /*
  var googleUser = gapi.auth2.getAuthInstance().currentUser.get();
  if (!googleUser) {
    Video.setPerms(false);
    if (!silent) TraX.showMessageBox("You must be signed in to stream video.");
    return;
  }
  if (googleUser.hasGrantedScopes(GOpts.scope)) {
    if (havePerms) {
      TraX.showMessageBox("Already authorized");
    } else {
      accessToken = googleUser.Zi.access_token;
      verifyPerms(accessToken, silent);
    }
  } else if (!silent) {
    googleUser.grant(new gapi.auth2.SigninOptionsBuilder(GOpts))
        .then(
            function(success) {
              console.log("Video Success:", success);
              verifyPerms(success.Zi.access_token);
            },
            function(fail) {
              console.log("Video fail:", fail);
              Video.setPerms(false);
              TraX.showMessageBox("Failed to authorized streaming!");
            });
  } */
};

/**
 * Verify that the given permissions will work once we start recording.
 *
 * @private
 * @param {string} accessToken Token for streaming to user's account.
 * @param {boolean} [silent=false] Reduce messages sent to user.
 */
/* function verifyPerms(accessToken, silent) {
  var xhr = new XMLHttpRequest();
  xhr.open(
      'GET',
      'https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id&mine=true');
  xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr.onload = function() {
    if (xhr.status == 200) {
      Video.setPerms(true);
      if (!silent) {
        TraX.showMessageBox("Successfully authorized streaming!");
      }
      console.log("Video successfully authorized.");
    } else {
      Video.setPerms(false);
      if (!silent) TraX.showMessageBox("Failed to authorized streaming!");
      console.log("Video:", xhr.status, xhr.responseText);
    }
  };
  xhr.send();
} */

/**
 * Set that we have perms or not and update UI.
 *
 * @public
 * @param {boolean} perm Whether we have permission or not.
 */
Video.setPerms = function(perm) {
  havePerms = perm;
  if (!perm) {
    Video.toggleVideo(false);
    enableVideoDom.disabled = true;
  } else {
    enableVideoDom.disabled = false;
  }
  // authorizeButtonDom.disabled = havePerms;
};

/**
 * Start buffering or streaming video.
 *
 * @public
 * @return {boolean} Whether recording actually started or not.
 */
Video.startRecording = function() {
  if (!havePerms || recording || !enableVideoDom.checked) return false;
  recorder = function(stream, index) {
    const mediaRecorder = new MediaRecorder(stream);
    let recordedChunks = [];

    const fileType = mediaRecorder.mimeType;
    let ext = '.vid';
    if (fileType == 'video/webm') ext = '.webm';
    if (fileType == 'video/mp4') ext = '.mp4';
    const fileName = 'TraX ' + (new Date()).toString() + ' Cam' + index + ext;

    mediaRecorder.addEventListener('dataavailable', function(e) {
      if (e.data.size > 0) recordedChunks.push(e.data);
    });
    mediaRecorder.addEventListener('stop', function() {
      console.log('Downloading recording...');
      TraX.Export.download(fileName, new Blob(recordedChunks));
    });
    mediaRecorder.start();
    mediaRecorders.push(mediaRecorder);
  };
  mediaRecorders = [];
  recording = true;
  for (let i = 0; i < localStreams.length; i++) {
    recorder(localStreams[i], i);
  }
  console.log('Starting recording...');
  return true;


  /* if (!flashphonerReady) {
    TraX.showMessageBox(
        "Video encoder not ready yet. Please try again in a moment.");
    return false;
  }
  console.log("Starting recording...");

  createStream(function(err, res) {
    if (err) {
      TraX.showMessageBox("Failed to create YouTube stream");
      console.error("Create stream:", err);
      return;
    }
    console.log(res);

    var youtubeRTMPURL =
        youTubeRTMP + res.contentDetails.boundStreamId;

    Flashphoner.createSession({urlServer: youtubeRTMPURL})
        .on(SESSION_STATUS.ESTABLISHED,
            function(session) { startStreaming(session); })
        .on(SESSION_STATUS.DISCONNECTED,
            function() { TraX.showMessageBox("Disconnected from YouTube"); })
        .on(SESSION_STATUS.FAILED, function() {
          TraX.showMessageBox("Failed to start video stream");
        });
  });

  return true;
  */
};
/**
 * Stop streaming or buffering video.
 *
 * @public
 */
Video.stopRecording = function() {
  if (!recording) return;
  for (let i = 0; i < mediaRecorders.length; i++) {
    mediaRecorders[i].stop();
  }
  console.log('Stopping recording...');
  recording = false;
};
/**
 * Pause a recording without completely eding the file.
 * @TODO: Remove?
 *
 * @public
 */
Video.pauseRecording = function() {
  if (!recording) return;
};

/**
 * Get URL where we can find the saved video if it was streamed to a server.
 *
 * @public
 * @return {string} URL of where to watch the current video being streamed.
 */
Video.getURL = function() {
 return '';
};

/**
 * Toggle the visibility of cameras. Also opens and closes streams of video.
 * Must be open in order to record video.
 *
 * @public
 * @param {?boolean} [force=undefined] Set video state or toggle with undefined.
 */
Video.toggleVideo = function(force) {
  if (typeof force !== 'undefined') {
    enableVideoDom.checked = force;
  }
  if (TraX.debugMode) console.log('Video open:', enableVideoDom.checked);
  videoPreviewDom.style.display = enableVideoDom.checked ? 'block' : 'none';
  TraX.setURLOption('video', enableVideoDom.checked ? '1' : undefined);
  if (enableVideoDom.checked) {
    videoPreviewDom.scrollIntoView({behaviour: 'smooth'});
    getCamera();
  } else {
    releaseCamera();
  }
};

/**
 * Setup settings for streaming to YouTube.
 * I was unable to find a client side encoder to allow for this to work.
 *
 * @private
 */
/* function createStream(callback) {
  if (!TraX.debugMode) {
    callback("notimplemented", null);
    return;
  }

  var liveBroadcast = JSON.stringify(
      {
        "snippet": {
          "title": "TraX " + (new Date()).toString(),
          "description": "This was broadcasted using TraX v" +
              TraX.getVersion() + " ( " + location.href + " ).",
          "scheduledStartTime": (new Date()).toISOString()
        },
        "status": {"privacyStatus": "unlisted"}
      },
      null, 2);

  if (TraX.debugMode > 1) console.log("liveBroadcast:", liveBroadcast);

  var xhr = new XMLHttpRequest();
  xhr.open(
      'POST',
      'https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id%2Csnippet%2Cstatus%2CcontentDetails&alt=json');
  xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    if (xhr.status == 200) {
      console.log("liveBroadcast:", xhr.status);
      callback(null, JSON.parse(xhr.responseText));
    } else {
      console.log("liveBroadcast:", xhr.status, xhr.responseText);
      callback("YouTube Deny", null);
    }
  };
  xhr.send(liveBroadcast);
} */

/**
 * Get all cameras and start streams to record them.
 *
 * @private
 */
function getCamera() {
  navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        let audioIndex = -1;
        let backupAudio = -1;
        for (let i = 0; i < devices.length; i++) {
          if (devices[i].kind == 'audioinput') {
            if (devices[i].deviceId == 'default') {
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
            'Media Devices:', devices, 'Using audio input:', audioIndex);
        for (let i = 0; i < devices.length; i++) {
          if (devices[i].kind == 'videoinput' ) {
            let constraints = {video: {deviceId: {exact: devices[i].deviceId}}};
            if (audioIndex >= 0) {
              constraints.audio = {
                deviceId: {exact: devices[audioIndex].deviceId},
              };
            }
            navigator.mediaDevices.getUserMedia(constraints)
                .then(handleRecordSucces)
                .catch(handleRecordFail);
          }
        }
      })
      .catch(function(err) {
        console.log(err);
      });
}
/**
 * Release all cameras and stop streaming data.
 *
 * @private
 */
function releaseCamera() {
  if (!localStreams) return;
  for (let i = 0; i < localStreams.length; i++) {
    let tracks = localStreams[i].getTracks();
    for (let j = 0; j < tracks.length; j++) {
      tracks[j].stop();
    }
    localStreams.splice(i, 1);
    i--;
  }
  videoCanvasesDom.innerHTML = '';
  console.log('Video Cameras released');
}
/**
 * Successfully started receiving data from camera, show it on UI.
 *
 * @private
 * @param {MediaStream} stream The media stream being recorded..
 */
function handleRecordSucces(stream) {
  localStreams.push(stream);
  let newVideo = document.createElement('video');
  newVideo.className = 'videoCanvas';
  newVideo.muted = true;
  newVideo.autoplay = true;
  newVideo.srcObject = stream;
  // newVideo.play();
  videoCanvases.appendChild(newVideo);
  console.log('Video Camera authorized');
}
/**
 * Failed to get camera stream, notify user.
 *
 * @private
 * @param {Error} err The error.
 */
function handleRecordFail(err) {
  console.error('Failed to get camera', err);
  TraX.showMessageBox('Failed to get camera');
  Video.toggleVideo(false);
}
}(window.TraX.Video = window.TraX.Video || {}));
}(window.TraX = window.TraX || {}));
