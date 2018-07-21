// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)

// const URL = 'https://dev.campbellcrowley.com/trax';
// const indexURLs = [
//   '', '/', '?hud=1', '/?hud=1', '?video=1', '/?video=1', '?hud=1&video=1',
//   '?video=1&hud=1', '/?hud=1&video=1',
//   '/?video=1&hud=1', /* , '/live', '/live/', '/live/index.html'*/
// ];

self.addEventListener('install', function(event) {
  // if (caches) {
  //   if (location.hostname.indexOf('dev') == 0) {
  //     caches.delete('TraX Offline');
  //     console.warn(
  //         "DEVELOPMENT PAGE DETECTED. NOT ENABLING OFFLINE MODE AND CLEARING
  //         CACHE.");
  //     return;
  //   }
  //   event.waitUntil(caches.open('TraX Offline').then(function(cache) {
  //     return cache.addAll([
  //       '/version.txt',
  //       '/styles.css',
  //       '/dataViewStyles.css',
  //       '/paneStyles.css',
  //       '/mapStyles.css',
  //       '/friendStyles.css',
  //       '/keepAwake.js',
  //       'https://dev.campbellcrowley.com/socket.io.js',
  //       'https://dev.campbellcrowley.com/loading.gif',
  //       '/pagecontroller.js',
  //       '/viewdatacontroller.js',
  //       '/paneController.js',
  //       '/mymapcontroller.js',
  //       '/lz-string.min.js',
  //       '/canvascontroller.js',
  //       '/constants.js',
  //       '/videocontroller.js',
  //       '/importexport.js',
  //       '/xml2json.min.js',
  //       '/Blob.js',
  //       '/images/checkeredFlag.png',
  //       '/images/greenFlag.png',
  //       '/images/greenLight.png',
  //       '/images/pencil.png',
  //       '/images/processing.png',
  //       '/images/redLight.png',
  //       '/images/trash.png',
  //       '/images/yellowLight.png'/*,
  //       '/live/livecontroller.js',
  //       '/live/styles.css'*/
  //     ].concat(indexURLs).map(x => URL + x));
  //   }));
  // } else {
  //   console.warn("traxSW Caching not supported.");
  // }
  console.log('traxSW.js Installed!');
});

// self.addEventListener('fetch', function(event) {
//   if (event.request.cache === 'only-if-cached' &&
//       event.request.mode !== 'same-origin')
//     return;
//
//   if (caches) {
//     event.respondWith(caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     }));
//   }
// });
