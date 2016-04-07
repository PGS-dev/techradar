export class AuthService {
  constructor(Firebase, FirebaseApp, FirebaseUrl, RadarId, $firebaseObject, $firebaseArray, $firebaseAuth, $q) {
    'ngInject';

    var service = this,
      authRef = new Firebase(FirebaseUrl),
      usersRef = new Firebase(FirebaseUrl + RadarId + "/users");

    this.$q = $q;
    this.Firebase = Firebase;
    this.FirebaseApp = FirebaseApp;
    this.FirebaseUrl = FirebaseUrl;
    this.firebaseAuth = $firebaseAuth(authRef);
    this.$firebaseObject = $firebaseObject;
    this.users = $firebaseObject(usersRef);

    // Restore user session if possible
    this.getCurrentUser();

    // Authorization changes
    this.firebaseAuth.$onAuth(function () {
      service.getCurrentUser();
    })
  }

  getCurrentUser() {
    var service = this;
    var user = localStorage.getItem('firebase:session::' + this.FirebaseApp);
    service.currentUser = user ? angular.fromJson(user) : undefined;
    return service.currentUser;
  }

  loginWithFacebook() {
    var service = this,
        defer = this.$q.defer();
    
    this.firebaseAuth.$authWithOAuthPopup('facebook')
      .then(function (currentUser) {
        // Save curent user user
        service.users[currentUser.uid] = currentUser;
        service.users.$save()

        service.currentUser = currentUser;
        defer.resolve(service.currentUser);
      })
      .catch(function () {
        defer.reject();
      })

    return defer.promise;
  }

  loginAsGuest() {
    var service = this;
    return service.firebaseAuth.$authAnonymously()
      .then(function () {
        return service.getCurrentUser();
      })
  }

  fetchUserData(userId) {
    var ref = new this.Firebase(this.FirebaseUrl + "/users/" + userId);
    return this.$firebaseObject(ref);
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  logout() {
    this.firebaseAuth.$unauth();
    this.getCurrentUser();
  }
}
