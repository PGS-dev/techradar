var _ = require('lodash');
var moment = require('moment');

export class GridPageController {
  constructor(FirebaseUrl, $stateParams, uiGridConstants, $http, DATE_FORMAT) {
    'ngInject';

    var vm = this,
      request = new $http({
        method: 'get',
        url: `${FirebaseUrl}technologies/${$stateParams.radarId}.json`
      });

    vm.radarId = $stateParams.radarId;

    request.then(function (response) {
      vm.items = _.map(response.data, (item, key)=> {
        return {
          id: key,
          name: item.name,
          area: item.area,
          status: item.status,
          lastChange: moment(_.chain(item.history).last().result('date').value()).format('YYYY-MM-DD HH:mm'),
          snapshotId: _.chain(item.history).last().result('snapshotId').value(),
        }
      })
    })
  }
}
