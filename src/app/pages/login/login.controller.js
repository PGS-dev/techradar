export class LoginPageController {
  constructor(AuthService, $state) {
    'ngInject';

    this.AuthService = AuthService;
    this.$state = $state;

    this.initForm();
  }

  initForm() {
    this.form = {
      model: {},
      fields: this.getFieldsDefinition()
    }
  }

  // loginAsGuest() {
  //   var vm = this;
  //   this.AuthService.loginAsGuest()
  //     .then(function () {
  //       vm.$state.go('home');
  //     })
  // }

  logout() {
    return this.AuthService.logout();
  }

  facebookLogin() {
    var vm = this;

    return this.AuthService.loginWithFacebook()
      .then(function () {
        vm.$state.go('home');
      })
  }

  onSubmit() {
    return this.simpleLogin();
  }

  simpleLogin() {
    var vm = this,
      email = this.form.model.email,
      password = this.form.model.password;

    if (!email || !password) {
      return false;
    }

    return this.AuthService.loginWithPassword(email, password)
      .then(function () {
        vm.$state.go('home');
      })
  }

  getFieldsDefinition() {
    return [
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          label: 'Email',
          type: 'email',
          required: true
        }
      },
      {
        key: 'password',
        type: 'input',
        templateOptions: {
          label: 'Password',
          type: 'password',
          required: true
        }
      }
    ]
  }

}
