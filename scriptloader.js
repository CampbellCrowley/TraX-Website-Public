// Copyright 2018-2019 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)

/**
 * Loads page's necessary scripts after page has loaded to help with
 * initial load times, and possibly to later allow for better caching control.
 * @module ScriptLoader/
 */
(function() {
  window.onload = preinit;

  /**
   * Additional scripts to fetch after page has loaded.
   *
   * @default
   * @constant
   * @private
   * @type {Array.<{url: string, init: ?Array.<string>}>}
   */
  const additionalScripts = [
    {
      url: 'https://dev.campbellcrowley.com/trax/traxCommon.js',
      init: ['TraX', 'Common'],
    },
    {
      url: 'https://dev.campbellcrowley.com/trax/pagecontroller.js',
      init: ['TraX'],
    },
    {
      url: 'https://dev.campbellcrowley.com/trax/canvascontroller.js',
      init: ['TraX', 'Canvases'],
    },
    {url: 'https://dev.campbellcrowley.com/trax/constants.js'},
    {url: 'https://dev.campbellcrowley.com/trax/keepAwake.js'},
    {url: 'https://dev.campbellcrowley.com/trax/lz-string.min.js'},
    {
      url: 'https://dev.campbellcrowley.com/trax/videocontroller.js',
      init: ['TraX', 'Video'],
    },
    {url: 'https://dev.campbellcrowley.com/socket.io.js'},
    {
      url: 'https://dev.campbellcrowley.com/trax/sidebarcontroller.js',
      init: ['Sidebar'],
    },
    {url: 'https://c6.patreon.com/becomePatronButton.bundle.js', nowait: true},
  ];
  let numInit = 0;

  /**
   * Fetch additional necessary scripts.
   *
   * @private
   */
  function preinit() {
    const head = document.getElementsByTagName('head')[0];
    for (let i = 0; i < additionalScripts.length; i++) {
      const newScript = document.createElement('script');
      newScript.src = additionalScripts[i].url;
      newScript.type = 'text/javascript';
      if (additionalScripts[i].nowait) {
        numInit++;
      } else {
        newScript.onload = handleScriptLoad;
      }
      head.appendChild(newScript);
    }
  }
  /**
   * A script loaded.
   *
   * @private
   */
  function handleScriptLoad() {
    numInit++;
    if (numInit < additionalScripts.length) return;
    console.log('INIT: begin');
    for (let i = 0; i < additionalScripts.length; i++) {
      if (typeof additionalScripts[i].init !== 'object') continue;
      console.log('INIT:', additionalScripts[i].init);
      try {
        getScriptRef(window, additionalScripts[i].init, 0).init();
      } catch (e) {
        console.error('Failed to init', additionalScripts[i].init, e);
        if (TraX && TraX.showMessageBox) {
          TraX.showMessageBox(
              'Failed to load scripts! Only data collection may work!', 30000,
              true);
        }
      }
    }
    console.log('INIT: complete');
  }
  /**
   * Gets a reference to the requested script object via nemspace names.
   *
   * @private
   * @param {Object} win The parent obeject to start looking in. Usually window.
   * @param {Array.<string>} namespaces Array of namespace names to recurse
   * through.
   * @param {number} index The array index to start looking at.
   * @return {Object} Reference to the requested object.
   */
  function getScriptRef(win, namespaces, index) {
    if (index < namespaces.length) {
      return getScriptRef(win[namespaces[index]], namespaces, ++index);
    } else {
      return win;
    }
  }
})();
