// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
/**
 * Controls a sidebar menu.
 * @class Sidebar
 */
(function(Sidebar, undefined) {
// Screen size (x/y) in pixels.
let w = window; let d = document; let e = d.documentElement;
let g = d.getElementsByTagName('body')[0];
let x = w.innerWidth || e.clientWidth || g.clientWidth;
// let y = w.innerHeight || e.clientHeight || g.clientHeight;
const minWidthToOpen = 1710;

let isOpen = false;

let sidebarDom;
Sidebar.init = function() {
  sidebarDom = document.getElementById('sidebar');
  if (x <= minWidthToOpen) {
    sidebarOptionDoms = document.getElementsByClassName('sidebarOption');
    for (let i = 0; i < sidebarOptionDoms.length; i++) {
      sidebarOptionDoms[i].addEventListener('click', function() {
        Sidebar.toggleOpen(false);
      });
    }
  }
};

Sidebar.toggleOpen = function(force) {
  if (typeof force === 'undefined') {
    force = !isOpen;
  } else if (force === 'default') {
    if (x > minWidthToOpen) {
      force = true;
    } else {
      force = false;
    }
  }
  isOpen = force;
  sidebarDom.classList.toggle('open', isOpen);
};
}(window.Sidebar = window.Sidebar || {}));
