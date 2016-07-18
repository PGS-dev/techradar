import _ from 'lodash';

export class RadarPageController {
  constructor(FirebaseUrl, $state, $stateParams, moment, radarData, snapshots, $http, AuthService) {
    'ngInject';
    let vm = this;

    // Check permission to create radar
    vm.isAdmin = AuthService.currentUser.uid === radarData.author;

    // Redirect to first snapshot if not provided
    if (!$stateParams.snapshotId) {
      let firstSnapshot = _.chain(snapshots).first().result('id').value();
      if (!firstSnapshot) {
        // Create snapshot if not found
        return $state.go('admin.snapshot', {
          radarId: $stateParams.radarId,
        })
      }

      // Go to first available snapshot
      return $state.go('radar', {
        radarId: $stateParams.radarId,
        snapshotId: firstSnapshot
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
        // Showing chaged and new blips
        // TODO: Show also blips not changed, but added one snapshot ago
        let changedOldBlips = _.chain(response).result('data.blips').filter('newStatus').map((item)=>{item.status = item.newStatus; return item}).value();
        let newBlips = _.chain(response).result('data.newBlips').value();
        let allBlips = _.union(changedOldBlips, newBlips);
        vm.itemsUpdated(allBlips)
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
