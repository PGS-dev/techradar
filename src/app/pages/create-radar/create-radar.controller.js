export class CreateRadarPageController {
  constructor(Firebase, FirebaseUrl, $firebaseObject, moment, DATE_FORMAT, AuthService, $state) {
    'ngInject';

    var vm = this,
      itemsRef = new Firebase(FirebaseUrl + "/radars");

    this.$state = $state;
    this.moment = moment;
    this._ = _;
    this.DATE_FORMAT = DATE_FORMAT;
    this.user = AuthService.getCurrentUser();
    // download the data into a local object
    this.items = $firebaseObject(itemsRef);

    this.initForm();

  }

  initForm() {
    this.form = {
      model: {},
      fields: this.getFieldsDefinition()
    }
  }

  onSubmit() {
    this.addItem(this.form.model);
  }

  onCancel() {
    this.initForm();
  }

  addItem(newItemModel) {
    var currentTime = this.moment();

    newItemModel.created = currentTime.valueOf();
    newItemModel.createdString = currentTime.format(this.DATE_FORMAT);

    this.items[newItemModel.id] = newItemModel;
    this.items.$save()
      .then(() =>
          this.$state.go('radar', {radarId: newItemModel.id})
        ,(error) =>
          console.warn('Error', error)
      )


  }

  getFieldsDefinition() {
    return [
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          label: 'Unique id:',
          required: true,
          pattern: '^[A-Za-z0-9_-]+$' //TODO: Add uniqness check
        }
      },
      {
        key: 'title',
        type: 'input',
        templateOptions: {
          label: 'Title',
          required: true
        }
      },
      {
        key: 'isPublic',
        type: 'radio',
        defaultValue: true,
        templateOptions: {
          label: 'Share this radar with others?',
          options: [
            {value: true, name: 'Yes, other users can see this radar on the home page'},
            {value: false, name: 'No, only users with link can see the radar'},
          ]
        }
      }
    ]
  }

}
