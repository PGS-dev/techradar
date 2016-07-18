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
      url: '/radar/:radarId/:snapshotId',
      views: {
        header: {
          templateUrl: 'app/components/navbar/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        },
        main: {
          templateUrl: 'app/pages/radar/radar.html',
          controller: 'RadarPageController',
          controllerAs: 'vm',
          resolve: {
            snapshots: function(Firebase, FirebaseUrl, $stateParams, $firebaseArray, $q) {
              let defer = $q.defer();
              let fbRef = new Firebase(`${FirebaseUrl}snapshots/${$stateParams.radarId}`);
              let fbQuery = fbRef.orderByChild('created');
              let fbArray = new $firebaseArray(fbQuery);

              fbArray.$loaded(function(data){
                defer.resolve(data.reverse());
              });

              return defer.promise;
            },
            radarData: function (FirebaseUrl, $stateParams, $http) {
              return $http.get(`${FirebaseUrl}radars/${$stateParams.radarId}.json`).then((response)=>response.data);
            }
          }
        }
      }
    })
    .state('grid', {
      url: '/grid/:radarId',
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
      url: '/technology/:radarId/:techName/:techId',
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
    url: '/admin/:radarId',
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
    .state('admin.snapshot', {
      url: '/snapshot/:snapshotId',
      views: {
        'main@': {
          templateUrl: 'app/pages/admin/snapshot/admin-snapshot.html',
          controller: 'AdminSnapshotPageController',
          controllerAs: 'vm',
          resolve: {
            radarData: function (FirebaseUrl, $stateParams, $http) {
              return $http.get(`${FirebaseUrl}radars/${$stateParams.radarId}.json`).then((response)=>response.data);
            }
          }
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
          controllerAs: 'vm'
        }
      }
    })

  $urlRouterProvider.otherwise('/');
}
