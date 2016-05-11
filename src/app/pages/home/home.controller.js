export class HomePageController {
  constructor(Firebase, FirebaseUrl, $firebaseArray) {
    'ngInject';

    var vm = this,
      itemsRef = new Firebase(FirebaseUrl + "/radars");

    // download the data into a local object
    vm.radars = $firebaseArray(itemsRef);
  }
}
