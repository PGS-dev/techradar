export class LoginPageController {
  constructor(AuthService, $state) {
    'ngInject';

    this.AuthService = AuthService;
    this.$state = $state;
  }

  loginAsGuest() {
    var vm = this;
    this.AuthService.loginAsGuest()
      .then(function () {
        vm.$state.go('radar');
      })
  }

  logout() {
    return this.AuthService.logout();
  }

  facebookLogin() {
    return this.AuthService.loginWithFacebook();
  }
}
