var moment = require('moment');

export class AdminSnapshotPageController {
  constructor(AuthService, $state, $stateParams, DATE_FORMAT, Firebase, FirebaseUrl, $firebaseObject, $firebaseArray) {
    'ngInject';

    if (!AuthService.isAuthenticated()) {
      $state.go('login');
      return false;
    }

    this.DATE_FORMAT = DATE_FORMAT;
    this.Firebase = Firebase;
    this.FirebaseUrl = FirebaseUrl;
    this.$state = $state;
    this.$firebaseObject = $firebaseObject;
    this.radarId = $stateParams.radarId;
    this.snapshotId = $stateParams.snapshotId;
    this.fbTechnologiesRef = new Firebase(`${FirebaseUrl}technologies/${this.radarId}`);
    this.fbTechnologiesArray = new $firebaseArray(this.fbTechnologiesRef);
    this.fields = {
      title: '',
      description: '',
      blips: [],
      newBlips: []
    }

    this.loadAllTechnologies();
  }

  loadAllTechnologies() {
    this.fbTechnologiesArray.$loaded((data)=> {

      this.fields.blips = _.map(data, (item) => {
        return {
          id: item.$id,
          name: item.name,
          area: item.area,
          status: item.status
        }
      })
    })
  }

  onSubmit() {
    // New snapshot
    if (!this.snapshotId) {
      this.saveSnapshot(this.radarId, this.fields)
    }

    // TODO: Edit snapshot
    if (this.snapshotId) {
      // this.RadarService.updateSnapshot(this.radarId, this.snapshotId, this.fields.title, this.fields.description, this.fields.blips)
    }
  }

  onCancel() {
    this.fields = {};
  }

  saveSnapshot(radarId, snapshotModel) {
    // TODO: Check uniqness
    snapshotModel.id = _.kebabCase(snapshotModel.title);

    let currentTime = moment();
    let fbRef = new this.Firebase(`${this.FirebaseUrl}snapshots/${radarId}/${snapshotModel.id}`);
    let fbObj = new this.$firebaseObject(fbRef);

    // Update current technologies
    this.updateChangedTechnologies(snapshotModel.blips);

    // Save new technologies
    this.saveNewTechnologies(snapshotModel.newBlips);

    // Prepare model
    snapshotModel.created = currentTime.valueOf();
    snapshotModel.createdString = currentTime.format(this.DATE_FORMAT);
    fbObj = angular.extend(fbObj, snapshotModel);

    // Save model and go to snapshots view
    fbObj.$save()
      .then(() =>
          this.$state.go('radar', {radarId: radarId, snapshotId: snapshotModel.id})
        , (error) =>
          console.warn('Error', error)
      )
  }

  updateChangedTechnologies(items) {
    var vm = this;

    _.forEach(vm.fbTechnologiesArray, function(item, key){
      if(items[key].newStatus) {
        item.status = items[key].newStatus;
        vm.addHistoryEntry(item);
        vm.fbTechnologiesArray.$save(key)
      }
    })

  }

  saveNewTechnologies(items) {
    var vm = this;
    _.forEach(items, function (item) {
      vm.fbTechnologiesArray.$add(item);
      // Add current state to history
      vm.addHistoryEntry(item);
    })
  }

  newTechnology() {
    let defaultBlip = {
      area: 'Techniques',
      status: 'Adopt'
    };
    this.fields.newBlips.push(defaultBlip);
  }

  cancelNewTechnology(idx) {
    this.fields.newBlips.splice(idx, 1);
  }

  addHistoryEntry(item) {
    item.history = item.history || [];
    item.history.push({
      action: 'CHANGE_STATUS',
      date: moment().valueOf(),
      status: item.status
    });
  }
}
