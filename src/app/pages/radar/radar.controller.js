import _ from 'lodash';

export class RadarPageController {
  constructor($state, $stateParams, moment, radarData, snapshots, AuthService, $q) {
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
    this.fetchItems(snapshots, $stateParams.snapshotId)
      .then((items) => {
        this.itemsUpdated(items)
      });
  }

  /**
   * Get items from current and previous one snapshots
   *
   * @param snapshots
   * @param snapshotId
   * @returns {*}
     */
  fetchItems(snapshots, snapshotId) {
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
    prevSnapshot = this.getPreviousSnapshot(snapshotId, snapshots);

    // fetch items for current snapshot
    currentSnapshot = _.find(snapshots, {id: currentSnapshotId});
    currentBlips = this.getNewAndChangedBlips(currentSnapshot, true);

    // fetch items for previous snapshot
    // filter blips with newStatus set
    prevBlips = this.getNewAndChangedBlips(prevSnapshot, false);

    snapshotBlips = _.unionBy(currentBlips, prevBlips, 'id');
    defer.resolve(snapshotBlips);

    return defer.promise;
  }

  /**
   * Action on update items
   *
   * @param newItems
     */
  itemsUpdated(newItems) {
    this.radarItems = newItems;
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

  /**
   * Filter blips added and changed
   *
   * @param snapshot
   * @param flagChanged
     */
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
