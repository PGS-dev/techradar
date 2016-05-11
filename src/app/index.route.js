export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        header: {
          templateUrl: 'app/components/navbar/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        },
        main: {
          templateUrl: 'app/pages/home/home.html',
          controller: 'HomePageController',
          controllerAs: 'vm'
        }
      }
    })
    .state('createRadar', {
      url: '/create-radar',
      views: {
        header: {
          templateUrl: 'app/components/navbar/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        },
        main: {
          templateUrl: 'app/pages/create-radar/create-radar.html',
          controller: 'CreateRadarPageController',
          controllerAs: 'vm'
        }
      }
    })
    .state('radar', {
      url: '/radar/:radarId',
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
    .state('grid', {
      url: '/grid',
      views: {
        header: {
          templateUrl: 'app/components/navbar/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        },
        main: {
          templateUrl: 'app/pages/grid/grid.html',
          controller: 'GridPageController',
          controllerAs: 'vm'
        }
      }
    })
    .state('technology', {
      url: '/technology/:techName/:techId',
      views: {
        header: {
          templateUrl: 'app/components/navbar/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        },
        main: {
          templateUrl: 'app/pages/technology/technology.html',
          controller: 'TechnologyPageController',
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
