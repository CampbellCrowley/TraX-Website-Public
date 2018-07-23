/**
 * Keeps devices from falling asleep or turning off their displays while
 * recording data.
 * @class KeepAwake
 */
(function(KeepAwake, undefined) {
/**
 * Formats a string with given mimeType and data for a src value in a source
 * element for a video.
 *
 * @private
 * @param {string} mimeType The mime type.
 * @param {string} base64 The base 64 data.
 * @return {string} THe formatted string.
 */
function base64(mimeType, base64) {
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
    base64(
        'video/webm',
        'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq' +
            '17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu' +
            '14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9D' +
            'tnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='));
addSourceToVideo(
    video, 'mp4',
    base64(
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
 * @public
 * @param {string} mode The method to use.
 */
KeepAwake.keepAwakeSetting = function(mode) {
  keepAwakeMode = mode;
};
/**
 * Enable/Disable keeping device awake.
 * @TODO: Fix pageload leak.
 *
 * @public
 * @param {boolean} setting Enable or Disable.
 */
KeepAwake.keepAwake = function(setting) {
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
};
}(window.KeepAwake = window.KeepAwake || {}));
