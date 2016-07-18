import _ from 'lodash';

export class HomePageController {
  constructor(Firebase, FirebaseUrl, $firebaseArray, AuthService) {
    'ngInject';

    var vm = this,
      itemsRef = new Firebase(FirebaseUrl + "/radars");

    this.AuthService = AuthService;

    // Very impressive security
    vm.showPrivate = _.result(AuthService,'currentUser.uid') === "4bc0f5c0-1457-4b35-ad63-780c14636610";

    // download the data into a local object
    vm.radars = $firebaseArray(itemsRef);
  }
}
