var _ = require('lodash');

export class TechnologyPageController {
  constructor(Firebase, FirebaseUrl, $firebaseObject, $firebaseArray, moment, _, DATE_FORMAT, $stateParams, radarData, AuthService) {
    'ngInject';

    // Check permission to create radar
    this.isAdmin = _.result(AuthService,'currentUser.uid') === radarData.author;

    this.itemRef = new Firebase(FirebaseUrl + "technologies/" + $stateParams.radarId + "/" + $stateParams.techId);
    this.snapshotsRef = new Firebase(FirebaseUrl + "snapshots/" + $stateParams.radarId);

    this.moment = moment;
    this._ = _;
    this.DATE_FORMAT = DATE_FORMAT;
    this.item = $firebaseObject(this.itemRef);
    this.snapshots = $firebaseArray(this.snapshotsRef);
    this.radarId = $stateParams.radarId;
  }


  initForm() {
    this.adminFormVisible = true;
    this.adminForm = {
      model: this.item,
      fields: this.getFieldsDefinition()
    }
  }

  onSubmit() {
    var vm = this,
      changedIdx,
      newName = _.clone(vm.adminForm.model.name),
      newArea = _.clone(vm.adminForm.model.area)


    // Save current technology
    vm.adminForm.model.$save();

    // Save also all usage of this technology in snapshots
    //TODO
    _.forEach(vm.snapshots, function (snapshot, snapshotIdx) {
      changedIdx = false;
        // Update usage in newBlips
        if (snapshot.newBlips) {
          _.where(snapshot.newBlips, {id: vm.item.$id})
            .forEach((blip) => {
              blip.area = newArea;
              blip.name = newName;
              changedIdx  = snapshotIdx;
            })

          if (changedIdx >= 0) {
            return vm.snapshots.$save(changedIdx).then(()=>{
              console.info('Saved newBlips changes in ' ,snapshot)
            })
          }

        }

        // Update usage in old blips
        if (snapshot.blips) {
          _.where(snapshot.blips, {id: vm.item.$id})
            .forEach((blip) => {
              blip.area = newArea;
              blip.name = newName;
              changedIdx  = snapshotIdx;
            })

          if (changedIdx >= 0) {
            return vm.snapshots.$save(changedIdx).then(()=>{
              console.info('Saved blips changes in ' ,snapshot)
            })
          }

        }
      }
    )

    this.adminFormVisible = false;
  }

  getFieldsDefinition() {
    return [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name:',
          required: true
        }
      },
      {
        key: 'area',
        type: 'radio',
        defaultValue: 'Techniques',
        templateOptions: {
          label: 'Area:',
          options: [
            {value: 'Techniques', name: 'Techniques'},
            {value: 'Platforms', name: 'Platforms'},
            {value: 'Tools', name: 'Tools'},
            {value: 'Languages & Frameworks', name: 'Languages & Frameworks'}
          ]
        }
      },
      // {
      //   key: 'status',
      //   type: 'radio',
      //   defaultValue: 'Adopt',
      //   templateOptions: {
      //     label: 'Status:',
      //     options: [
      //       {value: 'Adopt', name: 'Adopt'},
      //       {value: 'Trial', name: 'Trial'},
      //       {value: 'Assess', name: 'Assess'},
      //       {value: 'Hold', name: 'Hold'}
      //     ]
      //   }
      // },
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          label: 'Description:'
        }
      }
    ]
  }

}
