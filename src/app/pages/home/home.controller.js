export class HomePageController {
  constructor(Firebase, FirebaseUrl, $firebaseArray, AuthService) {
    'ngInject';

    var vm = this,
      itemsRef = new Firebase(FirebaseUrl + "/radars");

    this.AuthService = AuthService;

    // download the data into a local object
    vm.radars = $firebaseArray(itemsRef);
  }
}
