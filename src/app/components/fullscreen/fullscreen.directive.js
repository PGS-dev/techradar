export function FullScreenDirective($document) {
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
    if ($document.isFullScreen || $document.mozIsFullScreen || $document.webkitIsFullScreen) {
      disableFullscreen();
    } else {
      enableFullScreen();
    }
  }

  function enableFullScreen() {
    var element = $document.documentElement;
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
    if($document.exitFullscreen) {
      $document.exitFullscreen();
    } else if($document.mozCancelFullScreen) {
      $document.mozCancelFullScreen();
    } else if($document.webkitExitFullscreen) {
      $document.webkitExitFullscreen();
    }
  }
}
