export class GridPageController {
  constructor(Firebase, FirebaseUrl, RadarId, $firebaseArray, uiGridConstants) {
    'ngInject';

    var itemsRef = new Firebase(FirebaseUrl + RadarId + "/items");
    var vm = this;

    // download the data into a local object
    this.items = $firebaseArray(itemsRef);

    this.items.$loaded().then(function (data) {
      vm.gridOptions = {
        "enableFiltering": true,
        "enableSorting": true,
        "data": data,
        "columnDefs": [
          {
            field: 'domain',
            filter: {
              selectOptions: _.map([...new Set(_.map(data, 'domain'))], function (item) {
                return {label: item, value: item}
              }),
              type: uiGridConstants.filter.SELECT
            }
          },
          {
            field: 'name'
          },
          {
            field: 'area',
            filter: {
              selectOptions: _.map([...new Set(_.map(data, 'area'))], function (item) {
                return {label: item, value: item}
              }),
              type: uiGridConstants.filter.SELECT
            }
          },
          {
            field: 'status',
            filter: {
              selectOptions: _.map([...new Set(_.map(data, 'status'))], function (item) {
                return {label: item, value: item}
              }),
              type: uiGridConstants.filter.SELECT
            }
          },
          {
            field: 'updated',
            cellFilter: 'date:"yyyy-MM-dd"',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="date" ng-model="colFilter.term" style="font-size:12px"/></div>',
            filters: [
              {
                filterName: "greaterThan",
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                filterName: "lessThan",
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }
        ]
      }
    })
  }
}
