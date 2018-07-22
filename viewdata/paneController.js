// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)
(function(Panes, undefined) {
const swipeThreshold = 100; // Minimum pixels traveled to be considered swipe.
const swipeDuration = 200; // Maximum milliseconds of finger down to be swipe.
const dragElasticity = 1 / 60.0;  // Ratio of distance finger moved vs UI moves
                                  // to simulate elstic feel.

// Finger down attributes.
let swipeStartTime;
let startX;
let startY;
let cancelSwipe;
// Currently visible pane index, and target to go to when panes open.
let currentPane = -1;
let targetPane = 0;
// Number of fingers currently placed on screen.
let numFingers = 0;

// DOM Elements
let paneContainerDom;
let panesList;

let listeners = [];

/**
 * Initialize Panes
 *
 * @public
 */
Panes.init = function() {
  paneContainerDom = document.getElementById('paneContainer');
  panesList = document.getElementsByClassName('dataViewPane');

  panesList[0].classList.add('firstPane');

  // TODO: Add {passive: true} as option for touchstart and touchend with
  // support for old browsers
  paneContainerDom.addEventListener('touchstart', handleTouchStart, false);
  paneContainerDom.addEventListener('touchmove', handleTouchMove, false);
  paneContainerDom.addEventListener('touchend', handleTouchEnd, false);
  paneContainerDom.style.transition = 'left 0.1s ease-in';

  updatePanes();
};
/**
 * Panes are becoming visible.
 *
 * @public
 */
Panes.handleOpening = function() {
  Panes.setCurrent(0);
  viewDataOverlay.style.right = '0';
  setTimeout(animatePanes(), 200);
};
/**
 * Panes are transitioning to no longer visible.
 *
 * @public
 */
Panes.handleClosing = function() {
  targetPane = currentPane;
  Panes.setCurrent(0);
  updatePanes();
  viewDataOverlay.style.right = '-100%';
  TraX.leaveDataView(false);
};
/**
 * Animate transition to targetPane from currentPane.
 *
 * @private
 */
function animatePanes() {
  if (targetPane < 0) targetPane = 0;
  if (targetPane >= panesList.length) targetPane = panesList.length - 1;
  if (targetPane > currentPane) {
    setTimeout(function() {
      Panes.setCurrent(currentPane + 1);
      updatePanes();
      animatePanes();
    }, 100);
  } else if (targetPane < currentPane) {
    setTimeout(function() {
      Panes.setCurrent(currentPane - 1);
      updatePanes();
      animatePanes();
    }, 100);
  }
}
/**
 * Set each pane class appropriately as it will appear.
 *
 * @private
 */
function updatePanes() {
  if (currentPane < 0) {
    Panes.setCurrent(0);
  } else {
    viewDataOverlay.style.right = '0';
  }
  if (currentPane >= panesList.length) currentPane = panesList.length - 1;
  for (let i = 0; i < panesList.length; i++) {
    panesList[i].classList.remove('visiblePane');
    panesList[i].classList.remove('nextPane');
    panesList[i].classList.remove('previousPane');
    panesList[i].classList.remove('farRightPane');
    panesList[i].classList.remove('farLeftPane');
    if (i == currentPane) {
      panesList[i].classList.add('visiblePane');
    } else if (i - 1 == currentPane) {
      panesList[i].classList.add('nextPane');
    } else if (i + 1 == currentPane) {
      panesList[i].classList.add('previousPane');
    } else if (i > currentPane) {
      panesList[i].classList.add('farRightPane');
    } else if (i < currentPane) {
      panesList[i].classList.add('farLeftPane');
    }
  }
}
/**
 * Sets the current index for panes but does not trigger change in panes. Used
 * for setting default pane.
 *
 * @public
 * @param {number} index Index of pane to set to.
 */
Panes.setCurrent = function(index) {
  currentPane = index;
};
/**
 * Go to next pane.
 *
 * @public
 */
Panes.nextPane = function() {
  Panes.gotoPane(currentPane + 1);
};
/**
 * Go to previous pane.
 *
 * @public
 */
Panes.previousPane = function() {
  Panes.gotoPane(currentPane - 1);
};
/**
 * Go to pane with given index.
 *
 * @public
 * @param {number} index Index of pane to go to.
 */
Panes.gotoPane = function(index) {
  if (index != currentPane) {
    triggerEvent('changePane', {fromIndex: currentPane, toIndex: index});
  }

  currentPane = index;
  if (currentPane < 0) Panes.handleClosing();
  else updatePanes();
};
/**
 * Get current pane index.
 *
 * @public
 * @return {number} Index of currently visible pane.
 */
Panes.getPane = function() {
  return currentPane;
};
/**
 * User swiped, change to next or previous pane.
 *
 * @private
 * @param {boolean} isRightSwipe Was the swipe towrds the right.
 * @param {number} [startY] The Y coordinate of the screen the touch started on.
 */
function handleSwipe(isRightSwipe, startY) {
  isRightSwipe ? Panes.previousPane() : Panes.nextPane();
}
/**
 * Finger is placed on screen.
 *
 * @private
 * @param {Event} event The touch event.
 */
function handleTouchStart(event) {
  let touchobj = event.changedTouches[0];
  numFingers++;

  // If there is more than one finger, cancel moving screen and swipe.
  if (numFingers > 1) {
    cancelSwipe = true;
    paneContainerDom.style.left = 0;
    return;
  }
  fingerDown = true;
  startX = touchobj.pageX;
  startY = touchobj.pageY;
  cancelSwipe = false;
  swipeStartTime = Date.now();
}
/**
 * Finger moves, move UI to simulate dragging unless swipe is canceled.
 *
 * @private
 * @param {Event} event The touch event.
 */
function handleTouchMove(event) {
  let touchobj = event.changedTouches[0];
  let distX = touchobj.pageX - startX;
  let distY = touchobj.pageY - startY;
  paneContainerDom.style.transition = '';
  // Cancel if swipe takes too long.
  if (!cancelSwipe && Date.now() - swipeStartTime > swipeDuration) {
    cancelSwipe = true;
  }

  if (!cancelSwipe && Math.abs(distX) > 10 &&
      Math.abs(distX) > Math.abs(distY)) {
    paneContainerDom.style.left =
        1.0 / (Math.abs(distX) * dragElasticity + 1) * distX + 'px';
  } else {
    paneContainerDom.style.left = 0;
    if (Math.abs(distX) > 10 && distX < distY) {
      cancelSwipe = true;
    }
  }
}
/**
 * Finger is removed from screen, reset screen position if not a swipe, or
 * handle swipe if it was the end of a valid swipe.
 *
 * @private
 * @param {Event} event The touch event.
 */
function handleTouchEnd(event) {
  fingerDown = false;
  numFingers--;
  let touchobj = event.changedTouches[0];
  paneContainerDom.style.left = 0;
  paneContainerDom.style.transition = 'left 0.1s ease-in';
  let distX = touchobj.pageX - startX;
  let distY = touchobj.pageY - startY;
  elapsedTime = Date.now() - swipeStartTime;
  let swiped = !cancelSwipe && elapsedTime <= swipeDuration &&
      Math.abs(distX) >= swipeThreshold;
  if (swiped) {
    event.preventDefault();
    let swipedRight = distX > 0 && distY < distX;
    handleSwipe(swipedRight);
  }
}

/**
 * Add a listener to a Panes Event.
 *
 * @public
 * @param {string} name Name of event to listen for.
 * @param {paneEventCB} callback Function to fire when event fires.
 */
Panes.addEventListener = function(name, callback) {
  listeners.push({name: name, callback: callback});
};
/**
 * Trigger a Panes Event for all listeners.
 *
 * @private
 * @param {string} name Name of event to fire.
 * @param {*} data Data to send with event.
 */
function triggerEvent(name, data) {
  for (let i = 0; i < listeners.length; i++) {
    if (listeners[i].name == name) {
      listeners[i].callback(data);
    }
  }
}
}(window.Panes = window.Panes || {}));
