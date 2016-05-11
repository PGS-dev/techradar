export class TechnologyPageController {
  constructor(Firebase, FirebaseUrl, $firebaseObject, moment, _, DATE_FORMAT, $stateParams) {
    'ngInject';

    var itemRef = new Firebase(FirebaseUrl + "radars/" + $stateParams.radarId + "/items/" + $stateParams.techId);

    this.moment = moment;
    this._ = _;
    this.DATE_FORMAT = DATE_FORMAT;
    this.item = $firebaseObject(itemRef);
  }
}
