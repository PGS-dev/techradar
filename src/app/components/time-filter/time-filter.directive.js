export function TimeFilterDirective(_) {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/time-filter/time-filter.html',
    scope: {
      start: '=',
      end: '=',
    },
    link: linkFunction
  };

  return directive;

  function linkFunction(scope) {
    let vm = {},
      today = moment().endOf('day').toDate();
    scope.vm = vm;
    vm.presetChange = presetChange;
    vm.presetsOptions = getPresets();

    // Set default
    vm.preset = _.clone(vm.presetsOptions[2]);

    function presetChange(newValue) {
      scope.start = _.clone(vm.preset.start);
      scope.end = _.clone(vm.preset.end);
    }

    function getPresets() {
      return [
        {
          value: '0|week',
          start: moment().startOf('week').toDate(),
          end: today,
          label: 'This Week'
        },
        {
          value: '0|month',
          start: moment().startOf('month').toDate(),
          end: today,
          label: 'This month'
        },
        {
          value: '0|quarter',
          start: moment().startOf('quarter').toDate(),
          end: today,
          label: 'This quarter'
        },
        {
          value: '0|year',
          start: moment().startOf('year').toDate(),
          end: today,
          label: 'This year'
        },
        {
          value: '-1|week',
          start: moment().startOf('week').add(-1, 'week').toDate(),
          end: moment().startOf('week').toDate(),
          label: 'Last week'
        },
        {
          value: '-1|month',
          start: moment().startOf('month').add(-1, 'month').toDate(),
          end: moment().startOf('month').toDate(),
          label: 'Last month'
        },
        {
          value: '-1|quarter',
          start: moment().startOf('quarter').add(-1, 'quarter').toDate(),
          end: moment().startOf('quarter').toDate(),
          label: 'Last quarter'
        },
        {
          value: '-1|year',
          start: moment().startOf('year').add(-1, 'year').toDate(),
          end: moment().startOf('year').toDate(),
          label: 'Last year'
        }
      ]
    }
  }


}
