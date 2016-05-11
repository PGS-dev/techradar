export function RadarDirective(_) {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/radar/radar.html',
    scope: {
      items: '=',
      radarId: '=',
      stateOnClick: '='
    },
    link: linkFunction
  };

  return directive;

  function linkFunction(scope) {
    var vm = {}
    scope.vm = vm;

    vm.viewItems = [];
    vm.loader = true;

    scope.items.$loaded().then(function (items) {
      vm.loader = false;
      vm.viewItems = _.clone(items, true);
      onItemsLoaded(vm.viewItems, scope);
    })
  }

  function onItemsLoaded(items, scope) {
    scope.counter = items.length;
    var idx = 1;
    angular.forEach(items, function (item) {
      item.position = {};
      item.idx = idx++;

      switch (item.status) {
        case 'Adopt':
          item.position.radius = 1;
          break;
        case 'Trial':
          item.position.radius = 2;
          break;
        case 'Assess':
          item.position.radius = 3;
          break;
        case 'Hold':
          item.position.radius = 4;
          break;
        default:
          break;
      }

      // Center radio
      item.position.radius *= 12.5;
      item.position.radius -= 12.5/2;

      // Randomize radio
      item.position.radius = item.position.radius + _.random(-5, 5);

      switch (item.area) {
        case 'Tools':
          item.position.angle = 0;
          break;
        case 'Techniques':
          item.position.angle = 90;
          break;
        case 'Platforms':
          item.position.angle = 180;
          break;
        case 'Languages & Frameworks':
          item.position.angle = 270;
          break;
        default:
          break;
      }

      // Center angle
      item.position.angle += 45;

      // Randomize angle
      item.position.angle = item.position.angle + _.random(-35, 35)

      // Convert polar to cartesian
      item.position.x =  item.position.radius * Math.cos(Math.PI / 180 * item.position.angle);
      item.position.y = item.position.radius * Math.sin(Math.PI / 180 * item.position.angle);
    })
  }
}
