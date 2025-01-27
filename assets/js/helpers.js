/***********************************************
 * Helpers
 ***********************************************/
'use strict';
/**
 * Initialize main helper object
 */

var VLTJS = {
  window: jQuery(window),
  windowHeight: jQuery(window).height(),
  document: jQuery(document),
  html: jQuery('html'),
  body: jQuery('body'),
  is_safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  is_firefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
  is_chrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
  is_ie10: navigator.appVersion.indexOf('MSIE 10') !== -1
};
/**
 * Detects whether user is viewing site from a mobile device
 */

VLTJS.isMobile = {
  Android: function Android() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function Opera() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function Windows() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function any() {
    return VLTJS.isMobile.Android() || VLTJS.isMobile.BlackBerry() || VLTJS.isMobile.iOS() || VLTJS.isMobile.Opera() || VLTJS.isMobile.Windows();
  }
};
/**
 * Debounce resize
 */

var resizeArr = [];
var resizeTimeout;
VLTJS.window.on('load resize orientationchange', function (e) {
  if (resizeArr.length) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      for (var i = 0; i < resizeArr.length; i++) {
        resizeArr[i](e);
      }
    }, 250);
  }
});

VLTJS.debounceResize = function (callback) {
  if (typeof callback === 'function') {
    resizeArr.push(callback);
  } else {
    window.dispatchEvent(new Event('resize'));
  }
};
/**
 * Throttle scroll
 */


var throttleArr = [];
var didScroll;
var delta = 5;
var lastScrollTop = 0;
VLTJS.window.on('load resize scroll orientationchange', function () {
  if (throttleArr.length) {
    didScroll = true;
  }
});

function hasScrolled() {
  var scrollTop = VLTJS.window.scrollTop(),
    windowHeight = VLTJS.window.height(),
    documentHeight = VLTJS.document.height(),
    scrollState = ''; // Make sure they scroll more than delta

  if (Math.abs(lastScrollTop - scrollTop) <= delta) {
    return;
  }

  if (scrollTop > lastScrollTop) {
    scrollState = 'down';
  } else if (scrollTop < lastScrollTop) {
    scrollState = 'up';
  } else {
    scrollState = 'none';
  }

  if (scrollTop === 0) {
    scrollState = 'start';
  } else if (scrollTop >= documentHeight - windowHeight) {
    scrollState = 'end';
  }

  for (var i in throttleArr) {
    if (typeof throttleArr[i] === 'function') {
      throttleArr[i](scrollState, scrollTop, lastScrollTop, VLTJS.window);
    }
  }

  lastScrollTop = scrollTop;
}

setInterval(function () {
  if (didScroll) {
    didScroll = false;
    window.requestAnimationFrame(hasScrolled);
  }
}, 250);

VLTJS.throttleScroll = function (callback) {
  if (typeof callback === 'function') {
    throttleArr.push(callback);
  }
};