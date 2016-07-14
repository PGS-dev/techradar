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
    this.saveRadar(this.form.model);
  }

  onCancel() {
    this.initForm();
  }

  saveRadar(radarModel) {
    let currentTime = this.moment();
    let fbRef = new this.Firebase(`${this.FirebaseUrl}radars/${radarModel.id}`);
    let fbObj = new this.$firebaseObject(fbRef);

    // Prepare model
    radarModel.items = [];
    radarModel.author = this.user.uid;
    radarModel.created = currentTime.valueOf();
    radarModel.createdString = currentTime.format(this.DATE_FORMAT);
    fbObj = angular.extend(fbObj, radarModel);

    // Save model and go to snapshots view
    fbObj.$save()
      .then(() =>
          this.$state.go('admin.snapshot', {radarId: radarModel.id})
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
