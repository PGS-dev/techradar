export function RadarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/radar/radar.html',
    scope: {
      items: '='
    },
    link: linkFunction
  };

  return directive;

  function linkFunction(scope) {
    scope.items.$loaded().then(function (items) {
      onItemsLoaded(items, scope)
    })
  }

  function onItemsLoaded(items, scope) {
    scope.counter = items.length;
    angular.forEach(items, function (item) {
      item.position = {};

      switch (item.status) {
        case 'Adopt':
          item.position.r = 1;
          break;
        case 'Trial':
          item.position.r = 2;
          break;
        case 'Assess':
          item.position.r = 3;
          break;
        case 'Hold':
          item.position.r = 4;
          break;
        default:
          break;
      }

      // Center radio
      item.position.r = (item.position.r * 12.5) - 7 ;

      // Randomize radio
      item.position.r = item.position.r + _.random(-5, 5);

      switch (item.area) {
        case 'Tools':
          item.position.q = 0;
          break;
        case 'Techniques':
          item.position.q = 90;
          break;
        case 'Platforms':
          item.position.q = 180;
          break;
        case 'Languages & Frameworks':
          item.position.q = 270;
          break;
        default:
          break;
      }

      // Center angle
      item.position.q += 45;

      // Randomize angle
      item.position.q = item.position.q + _.random(-35, 35);

      // Convert polar to cartesian
      item.position.x =  Math.floor(item.position.r * Math.cos(item.position.q));
      item.position.y = Math.floor(item.position.r * Math.sin(item.position.q));
    })
  }
}
