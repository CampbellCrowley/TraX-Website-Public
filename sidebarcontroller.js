// Copyright 2018-2019 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
/**
 * Controls a sidebar menu.
 * @class Sidebar
 */
(function(Sidebar, undefined) {
  // Screen size (x/y) in pixels.
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  const x = w.innerWidth || e.clientWidth || g.clientWidth;
  // let y = w.innerHeight || e.clientHeight || g.clientHeight;
  /**
   * The minimum width of the screen in pixels at which the sidebar
   * automatically
   * opens.
   * @default
   * @constant
   * @private
   * @type {number}
   */
  const minWidthToOpen = 1710;

  /**
   * Is the sidebar currently open.
   * @default
   * @private
   * @type {boolean}
   */
  let isOpen = false;

  /**
   * Stores the reference to the sidebar Element.
   * @private
   * @type {Element}
   */
  let sidebarDom;
  /**
   * Initialize Sidebar.
   *
   * @public
   */
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

  /**
   * Toggle the sidebar open and closed.
   *
   * @pulbic
   * @param {?boolean|string} [force=undefined] "default" sets to default
   * setting,
   * a boolean sets it to that value, undefined toggles state.
   */
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
