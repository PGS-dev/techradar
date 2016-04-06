export class AdminPageController {
  constructor(Firebase, FirebaseUrl, RadarId, $firebaseArray, AuthService,$state) {
    'ngInject';

    if (!AuthService.isAuthenticated()) {
      $state.go('login');
      return false;
    }


    var itemsRef = new Firebase(FirebaseUrl + RadarId + "/items");

    // download the data into a local object
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
    newItemModel.updated = moment().valueOf();
    this.items.$add(newItemModel);
    this.initForm();
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
    this.addItem(this.adminForm.model);
  }
}
