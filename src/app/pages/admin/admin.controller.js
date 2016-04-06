export class AdminPageController {
  constructor(Firebase, FirebaseUrl, RadarId, $firebaseArray, AuthService, $state, moment) {
    'ngInject';

    if (!AuthService.isAuthenticated()) {
      $state.go('login');
      return false;
    }


    var itemsRef = new Firebase(FirebaseUrl + RadarId + "/items");

    // download the data into a local object
    this.moment = moment;
    this.items = $firebaseArray(itemsRef);
    this.initForm();
  }

  initForm() {
    this.adminForm = {
      model: {},
      fields: this.getFieldsDefinition()
    }
  }

  addItem(newItemModel) {
    newItemModel.updated = this.moment().valueOf();
    this.items.$add(newItemModel);
    this.initForm();
  }

  updateItem(updatedModel, idx) {
    this.items[idx].name = updatedModel.name;
    this.items[idx].area = updatedModel.area;
    this.items[idx].domain = updatedModel.domain;
    this.items[idx].status = updatedModel.status;
    this.items[idx].updated = this.moment().valueOf();

    this.items.$save(this.items[idx]);
  }

  removeItem(index) {
    this.items.$remove(index, 1);
  }

  getFieldsDefinition() {
    return [
      {
        key: 'domain',
        type: 'select',
        defaultValue: 'Frontend',
        templateOptions: {
          label: 'Domain:',
          options: [
            {value: 'Frontend', name: 'Frontend'},
            {value: 'Backend', name: 'Backend'},
            {value: 'QA', name: 'QA'},
            {value: 'Design & UX', name: 'Design & UX'}
          ]
        }
      },
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
      this.updateItem(this.adminForm.model, this.editedIdx);
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

  editItemForm(index) {
    this.initForm();
    this.editedIdx = index;
    this.adminForm.model = angular.copy(this.items[index]);
    this.adminFormVisible = true;
  }
}
