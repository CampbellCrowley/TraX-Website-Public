// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(Sidebar, undefined) {
// Screen size (x/y) in pixels.
var w = window, d = document, e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
const minWidthToOpen = 1710;

var isOpen = false;

var sidebarDom;
Sidebar.init = function() {
  sidebarDom = document.getElementById("sidebar");
  if (x <= minWidthToOpen) {
    sidebarOptionDoms = document.getElementsByClassName("sidebarOption");
    for (var i = 0; i < sidebarOptionDoms.length; i++) {
      var onClick = sidebarOptionDoms[i].onclick;
      sidebarOptionDoms[i].addEventListener(
          'click', function() { Sidebar.toggleOpen(false); });
    }
  }
};

Sidebar.toggleOpen = function(force) {
  if (typeof force === 'undefined') {
    force = !isOpen;
  } else if (force === "default") {
    if (x > minWidthToOpen) {
      force = true;
    } else {
      force = false;
    }
  }
  isOpen = force;
  sidebarDom.classList.toggle("open", isOpen);
};

}(window.Sidebar = window.Sidebar || {}));
