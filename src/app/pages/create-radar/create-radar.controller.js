export class CreateRadarPageController {
  constructor(Firebase, FirebaseUrl, $firebaseObject, moment, DATE_FORMAT, AuthService, $state) {
    'ngInject';

    this.user = AuthService.getCurrentUser();
    if (!this.user) {
      $state.go('login');
      return;
    }
    this.$state = $state;
    this.moment = moment;
    this._ = _;
    this.DATE_FORMAT = DATE_FORMAT;
    this.Firebase = Firebase;
    this.FirebaseUrl = FirebaseUrl;
    this.$firebaseObject = $firebaseObject;

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

    this.newItem = this.getItemObject(newItemModel.id)

    newItemModel.items = [];
    newItemModel.author = this.user.uid;
    newItemModel.created = currentTime.valueOf();
    newItemModel.createdString = currentTime.format(this.DATE_FORMAT);
    this.newItem = angular.extend(this.newItem, newItemModel);

    this.newItem.$save()
      .then(() =>
          this.$state.go('radar', {radarId: newItemModel.id})
        ,(error) =>
          console.warn('Error', error)
      )
  }

  getItemObject(itemId) {
    this.itemRef = new this.Firebase(this.FirebaseUrl + "radars/" + itemId);
    return new this.$firebaseObject(this.itemRef);
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
