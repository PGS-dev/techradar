import _ from 'lodash';

export class RadarPageController {
  constructor(FirebaseUrl, $state, $stateParams, moment, snapshots, $http) {
    'ngInject';
    let vm = this;

    // Redirect to first snapshot if not provided
    if (!$stateParams.snapshotId) {
      return $state.go('radar', {
        radarId: $stateParams.radarId,
        snapshotId: _.chain(snapshots).first().result('id').value()
      })
    }

    vm.radarId = $stateParams.radarId;
    vm.snapshotId = $stateParams.snapshotId;
    vm.snapshots = snapshots;
    vm.radarItems = [];
    vm.timeFilterModel = {
      isActive: false,
      start: moment().startOf('quarter').toDate(),
      end: moment().endOf('day').toDate()
    }

    // Fetch radar items (blips) for specific snapshots
    this.fetchItems($http, FirebaseUrl, $stateParams)
      .then((response) => {
        vm.itemsUpdated(_.chain(response)
          .result('data.newBlips')
          // .map((item, key)=>
          //   _.assign(item, {id: key})
          // )
          .value())
      });
  }

  fetchItems($http, FirebaseUrl, $stateParams) {
    return $http.get(`${FirebaseUrl}snapshots/${$stateParams.radarId}/${$stateParams.snapshotId}.json`)
  }

  itemsUpdated(newItems) {
    this.items = newItems;
    this.filterItems();
  }

  filterItems() {
    let vm = this,
      items = _.clone(this.items),
      filteredItems = [];

    if (!vm.timeFilterModel.isActive) {
      return this.radarItems = items;
    }

    _.forEach(items, function (item) {
      let afterStart = false;
      let beforeEnd = false;

      let lastMatchedChange = _.chain(item)
        .result('history')
        .filter(function (change) {
          afterStart = vm.timeFilterModel.start ? change.time >= moment(vm.timeFilterModel.start).valueOf() : true;
          beforeEnd = vm.timeFilterModel.end ? change.time <= moment(vm.timeFilterModel.end).valueOf() : true;
          return afterStart && beforeEnd;
        })
        .last()
        .value();

      if (!lastMatchedChange) return;

      item.status = lastMatchedChange.status;
      console.info(item.name, item.status, lastMatchedChange.timeString);

      filteredItems.push(item);
    })

    this.radarItems = filteredItems;
  }
}
