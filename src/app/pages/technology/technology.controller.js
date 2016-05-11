export class TechnologyPageController {
  constructor(Firebase, FirebaseUrl, RadarId, $firebaseObject, moment, _, DATE_FORMAT, $stateParams) {
    'ngInject';

    var itemRef = new Firebase(FirebaseUrl + RadarId + "/items/" + $stateParams.techId);

    this.moment = moment;
    this._ = _;
    this.DATE_FORMAT = DATE_FORMAT;
    this.item = $firebaseObject(itemRef);
  }
}
