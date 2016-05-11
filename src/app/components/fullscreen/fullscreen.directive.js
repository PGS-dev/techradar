/* global document */

export function FullScreenDirective() {
  'ngInject';

  let directive = {
    restrict: 'A',
    link: linkFunction
  };

  return directive;

  function linkFunction(scope, element) {
    element.on('click', onClick)
  }

  function onClick() {
    var doc = document;
    if (doc.isFullScreen || doc.mozIsFullScreen || doc.webkitIsFullScreen) {
      disableFullscreen();
    } else {
      enableFullScreen();
    }
  }

  function enableFullScreen() {
    var doc = document,
        element = doc.documentElement;

    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function disableFullscreen() {
    var doc = document;
    if(doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if(doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if(doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
  }
}
