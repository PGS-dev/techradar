export class NavbarController {
  constructor(AuthService, $stateParams, FirebaseUrl, Firebase, $firebaseObject) {
    'ngInject';

    this.Firebase = Firebase;
    this.FirebaseUrl = FirebaseUrl;
    this.$firebaseObject = $firebaseObject;
    this.radarId = $stateParams.radarId;
    this.AuthService = AuthService;

    this.currentRadar = this.getItemObject(this.radarId)
  }

  getItemObject(itemId) {
    this.itemRef = new this.Firebase(this.FirebaseUrl + "radars/" + itemId);
    return new this.$firebaseObject(this.itemRef);
  }
}
