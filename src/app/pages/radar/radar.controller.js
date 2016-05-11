export class RadarPageController {
  constructor(Firebase, FirebaseUrl, $stateParams, $firebaseArray) {
    'ngInject';

    var itemsRef = new Firebase(FirebaseUrl + "radars/" + $stateParams.radarId + "/items");

    this.radarId = $stateParams.radarId;

    // download the data into a local object
    this.items = $firebaseArray(itemsRef);
  }
}
