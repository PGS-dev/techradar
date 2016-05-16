export class LoginPageController {
  constructor(AuthService, $state) {
    'ngInject';

    this.AuthService = AuthService;
    this.$state = $state;

    this.initForms();
  }

  initForms() {
    var vm = this;

    vm.errors = [];
    vm.loginForm = {
      model: {},
      fields: vm.getLoginFieldsDefinition()
    }
    vm.registerForm = {
      model: {},
      fields: vm.getRegisterFieldsDefinition()
    }
  }

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

  simpleLogin() {
    var vm = this,
      email = this.loginForm.model.email,
      password = this.loginForm.model.password;

    if (!email || !password) {
      return false;
    }

    vm.errors = [];

    return this.AuthService.loginWithPassword(email, password)
      .then(() => vm.$state.go('home'))
      .catch((error) => {vm.errors.push(error)})
  }

  createUser() {
    var vm = this,
      email = this.registerForm.model.email,
      password = this.registerForm.model.password,
      displayName = this.registerForm.model.displayName;

    if (!email || !password) {
      return false;
    }

    vm.errors = [];

    return this.AuthService.createUser(email, password, displayName)
      .then(() => vm.$state.go('home'))
      .catch((error) => {vm.errors.push(error)})
  }

  getLoginFieldsDefinition() {
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

  getRegisterFieldsDefinition() {
    var vm = this;
    return [
      {
        key: 'displayName',
        type: 'input',
        templateOptions: {
          label: 'Your name',
          type: 'text',
          required: true
        }
      },
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
      },
      {
        key: 'passwordConfirmation',
        type: 'input',
        templateOptions: {
          label: 'Confirm password',
          type: 'password',
          required: true
        },
        hideExpression: "!model.password",
        data: {
          fieldToMatch: 'password'
        },
        validators: {
          fieldMatch: {
            expression: function(viewValue, modelValue, fieldScope) {
              var value = modelValue || viewValue;
              // var model = options.data.modelToMatch || fieldScope.model;
              return value && (value === _.result(fieldScope.model, fieldScope.options.data.fieldToMatch));
            },
            message: '"Must match"'
          }
        }
      }
    ]
  }

}
