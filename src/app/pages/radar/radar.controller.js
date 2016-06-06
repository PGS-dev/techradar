export class RadarPageController {
  constructor($scope, Firebase, FirebaseUrl, $stateParams, $firebaseArray, moment) {
    'ngInject';
    let vm = this;

    vm.radarId = $stateParams.radarId;
    vm.radarItems = [];
    vm.timeFilterModel = {
      start: moment().startOf('quarter').toDate(),
      end: moment().endOf('day').toDate()
    }

    vm.itemsRef = new Firebase(FirebaseUrl + "radars/" + $stateParams.radarId + "/items");
    // download the data into a local object
    vm.fbItems = $firebaseArray(vm.itemsRef);
    vm.fbItems.$loaded().then(function (items) {
      vm.itemsUpdated(items)
    })

    $scope.$watch(() => vm.timeFilterModel, (newValue) => {
      vm.filtersUpdated(newValue);
    }, true);
  }

  itemsUpdated(newItems) {
    this.items = newItems;
    this.filterItems();
  }

  filtersUpdated(updatedFilter) {
    this.filterItems();
  }

  filterItems() {
    let vm = this,
      items = _.clone(this.items),
      filteredItems = [];

    _.forEach(items, function (item) {
      let afterStart = false;
      let beforeEnd = false;

      let lastMatchedChange = _.chain(item)
        .result('history')
        .filter(function (change) {
          afterStart = vm.timeFilterModel.start ? change.time >= moment(vm.timeFilterModel.start).valueOf() : true;
          beforeEnd = vm.timeFilterModel.end ? change.time <= moment(vm.timeFilterModel.end).valueOf() : true;
          return  afterStart && beforeEnd;
        })
        .last()
        .value();

      if (!lastMatchedChange) return;

      item.status = lastMatchedChange.status;
      console.info(item.name, item.status, lastMatchedChange.timeString );

      filteredItems.push(item);
    })

    this.radarItems = filteredItems;
  }
}
