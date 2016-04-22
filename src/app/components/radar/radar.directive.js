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
          item.position.y = 10;
          break;
        case 'Assess':
          item.position.y = 20;
          break;
        case 'Trial':
          item.position.y = 30;
          break;
        case 'Hold':
          item.position.y = 40;
          break;
        default:
          item.position.y = 0;
          break;
      }

      switch (item.area) {
        case 'Techniques':
          item.position.x = -20;
          break;
        case 'Platforms':
          item.position.x = 20;
          break;
        case 'Tools':
          item.position.x = -20;
          item.position.y = -item.position.y
          break;
        case 'Languages & Frameworks':
          item.position.x = 20;
          item.position.y = -item.position.y
          break;
        default:
          item.position.x = 0;
          break;
      }
    })

  }
}
