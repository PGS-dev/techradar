import _ from 'lodash';

export class RadarPageController {
  constructor(FirebaseUrl, $state, $stateParams, moment, radarData, snapshots, $http, AuthService, $q) {
    'ngInject';
    let vm = this;

    this.$q = $q;

    // Check permission to create radar
    vm.isAdmin = _.result(AuthService, 'currentUser.uid') === radarData.author;

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
    this.fetchItems($http, FirebaseUrl, $stateParams.radarId, $stateParams.snapshotId)
      .then((items) => {
        // Showing chaged and new blips
        /*        // TODO: Show also blips not changed, but added one snapshot ago
         let changedOldBlips = _.chain(response).result('data.blips').filter('newStatus').map((item)=> {
         item.status = item.newStatus;
         return item
         }).value();
         let newBlips = _.chain(response).result('data.newBlips').value();
         let allBlips = _.union(changedOldBlips, newBlips);*/
        vm.itemsUpdated(items)
      });
  }

  fetchItems($http, FirebaseUrl, radarId, snapshotId) {
    let defer = this.$q.defer(),
      currentSnapshotId,
      currentSnapshot,
      prevSnapshot,
      prevBlips,
      currentBlips,
      snapshotBlips;

    // get index of current snapshot
    currentSnapshotId = snapshotId;

    // get previous snapshot
    prevSnapshot = this.getPreviousSnapshot(snapshotId, this.snapshots);

    // fetch items for current snapshot
    currentSnapshot = _.find(this.snapshots, {id: currentSnapshotId});
    currentBlips = this.getNewAndChangedBlips(currentSnapshot, true);

    // fetch items for previous snapshot
    // filter blips with newStatus set
    prevBlips = this.getNewAndChangedBlips(prevSnapshot, false);

    snapshotBlips = _.union(currentBlips, prevBlips);
    // debugger
    defer.resolve(snapshotBlips);

    // return $http.get(`${FirebaseUrl}snapshots/${radarId}/${snapshotId}.json`)
    return defer.promise;
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

  /**
   * Returns the previous snapshot
   *
   * @param snapshotId
   * @param snapshots Spanshots sorted from newest first
   * @returns {*}
   */
  getPreviousSnapshot(snapshotId, snapshots) {
    let currentIdx,
      prevIdx;

    currentIdx = _.findIndex(snapshots, (snapshot)=> {
      return snapshot.id === snapshotId;
    })

    prevIdx = currentIdx + 1;

    return prevIdx < snapshots.length ? snapshots[prevIdx] : undefined;
  }

  getNewAndChangedBlips(snapshot, flagChanged) {
    let newBlips,
      changedBlips;

    // flag as old for proper icon
    if (flagChanged) {
      newBlips = _.map(_.result(snapshot, 'newBlips'), (item)=> {
        item.isNew = true;
        return item;
      });
    } else {
      newBlips = _.result(snapshot, 'newBlips')
    }


    changedBlips = _.filter(_.result(snapshot, 'blips'), (item) => !!item.newStatus)
    changedBlips = _.map(changedBlips, function (item) {
      // flag as old for proper icon
      if (flagChanged) {
        item.isChanged = true;
      }

      item.status = item.newStatus;
      return item;
    });

    return _.union(changedBlips, newBlips);
  }


}
