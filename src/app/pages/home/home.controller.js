export class HomePageController {
  constructor(Firebase, FirebaseUrl, $firebaseArray, AuthService) {
    'ngInject';

    var vm = this,
      itemsRef = new Firebase(FirebaseUrl + "/radars");

    this.AuthService = AuthService;

    vm.showPrivate = AuthService.currentUser.uid === "4bc0f5c0-1457-4b35-ad63-780c14636610";

    // download the data into a local object
    vm.radars = $firebaseArray(itemsRef);
  }
}
