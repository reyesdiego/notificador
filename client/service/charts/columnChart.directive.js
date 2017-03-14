/**
 * Created by kolesnikov-a on 14/03/2017.
 */
sistemaAlertas.directive('columnChart', ['chartLoader', function(chartLoader){
	return {
		restrict: 'E',
		scope: {
			data: '=',
			options: '=',
			click: '&'
		},
		link: function (scope, elm) {
			chartLoader.then((chartService) => {

				scope.readyFn = () => {
					console.log('chart ready');
				};

				scope.selectFn = () => {
					let selectedItem = chartCtrl.chart.getSelection()[0];
					scope.click({selectedRow: selectedItem});
				};

				let chartCtrl = new chartService('COLUMN', elm[0], scope.selectFn, scope.readyFn);

				if (scope.data.length > 1){
					chartCtrl.drawChart(scope.data, scope.options);
				}

				scope.$watch('data', () => {
					if (scope.data.length > 1){
						chartCtrl.drawChart(scope.data, scope.options);
					}
				}, true);

			})
		}
	}
}]);