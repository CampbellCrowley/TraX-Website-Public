// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)

window.onload = preinit;

const additionalScripts = [
  {
    url: "https://dev.campbellcrowley.com/trax/traxCommon.js",
    init: ["TraX", "Common"]
  },
  {
    url: "https://dev.campbellcrowley.com/trax/live/livecontroller.js",
    init: ["TraX", "Live"]
  },
  {
    url: "https://dev.campbellcrowley.com/trax/canvascontroller.js",
    init: ["TraX", "Canvases"]
  },
  {url: "https://dev.campbellcrowley.com/socket.io.js"},
  {url: "https://dev.campbellcrowley.com/trax/lz-string.min.js"},
  {url: "https://dev.campbellcrowley.com/trax/constants.js"}
];
var numInit = 0;

// Fetch additional necessary scripts.
function preinit() {
  var head = document.getElementsByTagName("head")[0];
  for (var i = 0; i < additionalScripts.length; i++) {
    var newScript = document.createElement('script');
    newScript.src = additionalScripts[i].url;
    newScript.type = "text/javascript";
    newScript.onload = handleScriptLoad;
    head.appendChild(newScript);
  }
}
// A script loaded.
function handleScriptLoad() {
  numInit++;
  if (numInit < additionalScripts.length) return;
  console.log("INIT: begin");
  for (var i = 0; i < additionalScripts.length; i++) {
    if (typeof additionalScripts[i].init !== "object") continue;
    console.log("INIT:", additionalScripts[i].init);
    try {
      getScriptRef(window, additionalScripts[i].init, 0).init();
    } catch (e) {
      console.error("Failed to init", additionalScripts[i].init, e);
      if (TraX && TraX.showMessageBox) {
        TraX.showMessageBox(
            "Failed to load scripts! Only data collection may work!", 30000,
            true);
      }
    }
  }
  console.log("INIT: complete");
}
function getScriptRef(win, namespaces, index) {
  if (index < namespaces.length) {
    return getScriptRef(win[namespaces[index]], namespaces, ++index);
  } else {
    return win;
  }
}
