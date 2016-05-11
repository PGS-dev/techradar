/* global moment:false, _:false, Firebase:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { LoginPageController } from './pages/login/login.controller';
import { AdminPageController } from './pages/admin/admin.controller';
import { RadarPageController } from './pages/radar/radar.controller';
import { GridPageController } from './pages/grid/grid.controller';
import { TechnologyPageController } from './pages/technology/technology.controller';
import { NavbarController } from './components/navbar/navbar.controller';
import { AuthService } from '../app/components/auth/auth.service';
import { RadarDirective } from '../app/components/radar/radar.directive';
import { FullScreenDirective } from '../app/components/fullscreen/fullscreen.directive';

angular.module('techradar', [
  'ui.router',
  'ui.bootstrap',
  'ui.grid',
  'toastr',
  'firebase',
  'formly',
  'formlyBootstrap'
])
  .constant('moment', moment)
  .constant('_', _)
  .constant('Firebase', Firebase)
  .constant('FirebaseApp', 'technology-radar')
  .constant('FirebaseUrl', 'https://technology-radar.firebaseio.com/')
  .constant('RadarId', 'pgs')
  .constant('DATE_FORMAT', 'YYYY-MM-DD HH:mm:SS')

  .config(config)
  .config(routerConfig)

  .run(runBlock)

  .service('AuthService', AuthService)

  .controller('NavbarController', NavbarController)
  .controller('LoginPageController', LoginPageController)
  .controller('AdminPageController', AdminPageController)
  .controller('RadarPageController', RadarPageController)
  .controller('GridPageController', GridPageController)
  .controller('TechnologyPageController', TechnologyPageController)
  .directive('radar', RadarDirective)
  .directive('fullScreen', FullScreenDirective)

