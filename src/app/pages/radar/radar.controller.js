export class RadarPageController {
  constructor(Firebase, FirebaseUrl, RadarId, $firebaseArray) {
    'ngInject';

    var itemsRef = new Firebase(FirebaseUrl + RadarId + "/items");

    // download the data into a local object
    this.items = $firebaseArray(itemsRef);
  }
}
