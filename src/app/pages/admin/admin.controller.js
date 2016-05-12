export class AdminPageController {
  constructor(Firebase, FirebaseUrl, $firebaseArray, AuthService, $state, $stateParams, moment, _, DATE_FORMAT) {
    'ngInject';

    if (!AuthService.isAuthenticated()) {
      $state.go('login');
      return false;
    }
    var itemsRef = new Firebase(FirebaseUrl + "radars/" +  $stateParams.radarId + "/items");

    this.moment = moment;
    this._ = _;
    this.DATE_FORMAT = DATE_FORMAT;
    this.user = AuthService.getCurrentUser();
    this.items = $firebaseArray(itemsRef);
    this.radarId = $stateParams.radarId;
    this.initForm();
  }

  initForm() {
    this.adminForm = {
      model: {},
      fields: this.getFieldsDefinition()
    }
  }

  addItem(newItemModel) {
    var currentTime = this.moment();

    newItemModel.history = [];
    newItemModel.history.push({
      status: newItemModel.status,
      time: currentTime.valueOf(),
      timeString: currentTime.format(this.DATE_FORMAT),
      user: this.user.uid
    });
    newItemModel.updated = currentTime.valueOf();
    newItemModel.updatedString = currentTime.format(this.DATE_FORMAT);

    this.items.$add(newItemModel);
    this.initForm();
  }

  updateItem(updatedModel, idx) {
    var currentTime = this.moment();

    if (!this._.isArray(updatedModel.history)) {
      updatedModel.history = [];
    }
    updatedModel.history.push({
      status: updatedModel.status,
      time: currentTime.valueOf(),
      timeString: currentTime.format(this.DATE_FORMAT),
      user: this.user.uid
    });

    this.items[idx].name = updatedModel.name;
    this.items[idx].area = updatedModel.area;
    this.items[idx].domain = updatedModel.domain;
    this.items[idx].description = updatedModel.description || '';
    this.items[idx].status = updatedModel.status;
    this.items[idx].updated = currentTime.valueOf();
    this.items[idx].updatedString = currentTime.format(this.DATE_FORMAT);
    this.items[idx].history = updatedModel.history;

    this.items.$save(this.items[idx]);
  }

  removeItem(id) {
    this.items.$remove(_.findIndex(this.items, {'$id': id}), 1);
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
      {
        key: 'status',
        type: 'radio',
        defaultValue: 'Adopt',
        templateOptions: {
          label: 'Status:',
          options: [
            {value: 'Adopt', name: 'Adopt'},
            {value: 'Trial', name: 'Trial'},
            {value: 'Assess', name: 'Assess'},
            {value: 'Hold', name: 'Hold'}
          ]
        }
      },
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          label: 'Description:'
        }
      }
    ]
  }

  onSubmit() {
    // Edit
    if (this.adminForm.model.$id) {
      this.updateItem(this.adminForm.model, _.findIndex(this.items, {'$id': this.adminForm.model.$id}));
    } else {
      // Create new
      this.addItem(this.adminForm.model);
    }
    this.adminFormVisible = false;
  }

  onCancel() {
    this.initForm();
    this.adminFormVisible = false;
  }

  addItemForm() {
    this.initForm();
    this.adminFormVisible = true;
  }

  editItemForm(id) {
    this.initForm();
    this.adminForm.model = angular.copy(_.find(this.items, {'$id': id}));
    this.adminFormVisible = true;
  }
}
