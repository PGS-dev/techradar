export class AuthService {
  constructor(Firebase, FirebaseApp, FirebaseUrl, $firebaseObject, $firebaseAuth, $q, _, moment) {
    'ngInject';

    var service = this,
      authRef = new Firebase(FirebaseUrl);

    this.$q = $q;
    this._ = _;
    this.moment = moment;
    this.Firebase = Firebase;
    this.$firebaseObject = $firebaseObject;
    this.FirebaseApp = FirebaseApp;
    this.FirebaseUrl = FirebaseUrl;
    this.firebaseAuth = $firebaseAuth(authRef);
    this.userRef = null; // build reference when get user uid

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
        service.userObj = service.getUserObject(currentUser.uid);
        service.userObj.uid = service._.result(currentUser, 'uid');
        service.userObj.displayName = service._.result(currentUser, 'facebook.displayName');
        service.userObj.avatar = service._.result(currentUser, 'facebook.profileImageURL');
        service.userObj.cachedUserProfile = service._.result(currentUser, 'facebook.cachedUserProfile');

        service.userObj.$save().then(() => {
          service.currentUser = currentUser;
          defer.resolve(service.currentUser);
        }, (error) => defer.reject(error))

      })
      .catch((error) => defer.reject(error));

    return defer.promise;
  }

  loginWithPassword(email, password) {
    var service = this,
      defer = this.$q.defer();

    this.firebaseAuth.$authWithPassword({
      email: email,
      password: password
    })
      .then(function (currentUser) {
        // Save currnt user data
        service.userObj = service.getUserObject(currentUser.uid);
        service.userObj.email = email;
        service.userObj.avatar = service._.result(currentUser, 'password.profileImageURL');
        service.userObj.lastLogin = service.moment().valueOf();

        service.userObj.$save().then(() => {
          service.currentUser = currentUser;
          defer.resolve(service.currentUser);
        }, (error) => defer.reject(error))

      })
      .catch((error) => defer.reject(error))

    return defer.promise;
  }

  createUser(email, password, displayName) {
    var service = this,
      defer = this.$q.defer();

    if (!email || !password)
      return;

    this.firebaseAuth.$createUser({
      email: email,
      password: password
    })
      .then(function (currentUser) {
        // Save created user
        service.userObj = service.getUserObject(currentUser.uid);
        service.userObj.email = email;
        service.userObj.displayName = displayName;
        service.userObj.created = service.moment().valueOf();

        service.userObj.$save()
          .then(() => service.loginWithPassword(email, password))
      })
      .catch((error) => defer.reject(error))

    return defer.promise;
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  logout() {
    this.userRef = undefined;
    this.firebaseAuth.$unauth();
    this.getCurrentUser();
  }

  getUserObject(userId) {
    this.userRef = new this.Firebase(this.FirebaseUrl + "users/" + userId);
    return new this.$firebaseObject(this.userRef);
  }
}
