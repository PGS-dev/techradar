var moment = require('moment');

export class AdminSnapshotPageController {
  constructor(AuthService, $state, $stateParams, DATE_FORMAT, Firebase, FirebaseUrl, $firebaseObject, $firebaseArray, $q, radarData) {
    'ngInject';

    // Check permission to create radar
    this.isAdmin = _.result(AuthService, 'currentUser.uid') === radarData.author || _.result(AuthService, 'currentUser.uid') === radarData.admin;

    if (!AuthService.isAuthenticated()) {
      $state.go('login');
      return false;
    }

    this.DATE_FORMAT = DATE_FORMAT;
    this.Firebase = Firebase;
    this.FirebaseUrl = FirebaseUrl;
    this.$state = $state;
    this.$q = $q;
    this._ =_;
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
    let savingNewTechnologies;
    let updatingTechnologies;
    // TODO: Check uniqness
    snapshotModel.id = _.kebabCase(snapshotModel.title);

    let currentTime = moment();
    let fbRef = new this.Firebase(`${this.FirebaseUrl}snapshots/${radarId}/${snapshotModel.id}`);
    let fbObj = new this.$firebaseObject(fbRef);

    // Update current technologies
    updatingTechnologies = this.updateChangedTechnologies(snapshotModel.blips, snapshotModel.id);

    // Save new technologies
    savingNewTechnologies = this.saveNewTechnologies(snapshotModel.newBlips, snapshotModel.id);

    this.$q.all([updatingTechnologies, savingNewTechnologies])
      .then(() => {
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
      })
  }

  updateChangedTechnologies(items, snapshotId) {
    var vm = this,
      allRequests = this.$q.defer(),
      requests = [],
      request;

    _.forEach(vm.fbTechnologiesArray, function (item, key) {
      if (items[key].newStatus) {
        item.status = items[key].newStatus;
        vm.addHistoryEntry(item, snapshotId);
        request = vm.fbTechnologiesArray.$save(key);
        requests.push(request);
      }
    })

    // Return updated table after all technologies has been added
    this.$q.all(requests)
      .then(function () {
        allRequests.resolve(vm.fbTechnologiesArray);
      })
      .catch(function (error) {
        console.log(error);
      });

    return allRequests.promise;
  }

  saveNewTechnologies(items, snapshotId) {
    var vm = this,
      allRequests = this.$q.defer(),
      requests = [],
      request;

    _.forEach(items, function (item, idx) {
      // Add current state to history
      vm.addHistoryEntry(item, snapshotId);
      request = vm.fbTechnologiesArray.$add(item);
      requests.push(request);

      request.then(function (ref) {
        item.id = ref.key();

      });
    })

    // Return updated table after all technologies has been added
    this.$q.all(requests)
      .then(function () {
        allRequests.resolve(vm.fbTechnologiesArray);
      })
      .catch(function (error) {
        console.log(error);
      });

    return allRequests.promise;
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

  addHistoryEntry(item, snapshotId) {
    item.history = item.history || [];
    item.history.push({
      action: 'CHANGE_STATUS',
      date: moment().valueOf(),
      status: item.status,
      snapshotId: snapshotId
    });
  }

  generateId(name) {
    return _.kebabCase(name);
  }
}
