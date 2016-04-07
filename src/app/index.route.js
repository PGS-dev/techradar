export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('radar', {
      url: '/',
      views: {
        header: {
          templateUrl: 'app/components/navbar/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        },
        main: {
          templateUrl: 'app/pages/radar/radar.html',
          controller: 'RadarPageController',
          controllerAs: 'vm'
        }
      }
    })
    .state('admin', {
      url: '/admin',
      views: {
        header: {
          templateUrl: 'app/components/navbar/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        },
        main: {
          templateUrl: 'app/pages/admin/admin.html',
          controller: 'AdminPageController',
          controllerAs: 'vm'
        }
      }
    })
    .state('login', {
      url: '/login',
      views: {
        header: {
          templateUrl: 'app/components/navbar/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        },
        main: {
          templateUrl: 'app/pages/login/login.html',
          controller: 'LoginPageController',
          controllerAs: 'login'
        }
      }
    })

  $urlRouterProvider.otherwise('/');
}
