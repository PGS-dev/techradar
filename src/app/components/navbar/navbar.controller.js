export class NavbarController {
  constructor(AuthService, $stateParams) {
    'ngInject';
    this.radarId = $stateParams.radarId;
    this.AuthService = AuthService;
  }
}
