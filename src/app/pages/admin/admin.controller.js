export class AdminPageController {
  constructor() {
    'ngInject';

    this.adminForm = {
      model: {},
      fields: this.getFieldsDefinition()
    }

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
      }
    ]
  }

  onSubmit() {
    alert('Submit')
  }
}
