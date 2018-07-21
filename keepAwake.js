let Util = {};
Util.base64 = function(mimeType, base64) {
  return 'data:' + mimeType + ';base64,' + base64;
};

// Create video to play on loop in order to keep device awake.
let video = document.createElement('video');
video.loop = true;
document.body.appendChild(video);

/**
 * Add data to for video to play.
 *
 * @param {Element} element The parent video element to attach the source to.
 * @param {string} type The mimeType of the source.
 * @param {string} dataURI The src value.
 */
function addSourceToVideo(element, type, dataURI) {
  let source = document.createElement('source');
  source.src = dataURI;
  source.type = 'video/' + type;
  element.appendChild(source);
}

addSourceToVideo(
    video, 'webm',
    Util.base64(
        'video/webm',
        'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq' +
            '17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu' +
            '14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9D' +
            'tnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='));
addSourceToVideo(
    video, 'mp4',
    Util.base64(
        'video/mp4',
        'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAH' +
            'AAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAA' +
            'AAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAA' +
            'QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hk' +
            'AAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAA' +
            'AAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAg' +
            'bWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRl' +
            'AAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAA' +
            'AAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3Ri' +
            'bAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAA' +
            'AAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
            'AAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAA' +
            'AbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0' +
            'cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAA' +
            'FHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAA' +
            'WG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2ls' +
            'c3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='));

/**
 * Set method for keeping device awake.
 *
 * @param {string} mode The method to use.
 */
function keepAwakeSetting(mode) { // eslint-disable-line no-unused-vars
  keepAwakeMode = mode;
}
/**
 * Enable/Disable keeping device awake.
 * TODO: Fix pageload leak.
 *
 * @param {boolean} setting Enable or Disable.
 */
function keepAwake(setting) { // eslint-disable-line no-unused-vars
  try {
    if (keepAwakeMode == 'video') {
      // Play a video to keep the device awake. (Chrome)
      setting ? video.play() : video.pause();
    } else if (keepAwakeMode == 'pageload') {
      // Every 30s change the page then cancel page change. (Safari)
      setInterval(function() {
        window.location.href = '/fake/page';
        window.setTimeout(window.stop);
      }, 30000);
    }
  } catch (err) {
    console.error(err);
  }
}
