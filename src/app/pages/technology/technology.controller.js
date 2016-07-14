export class TechnologyPageController {
  constructor(Firebase, FirebaseUrl, $firebaseObject, moment, _, DATE_FORMAT, $stateParams) {
    'ngInject';

    var itemRef = new Firebase(FirebaseUrl + "technologies/" + $stateParams.radarId + "/" + $stateParams.techId);

    this.moment = moment;
    this._ = _;
    this.DATE_FORMAT = DATE_FORMAT;
    this.item = $firebaseObject(itemRef);
    this.radarId = $stateParams.radarId;
  }
}
