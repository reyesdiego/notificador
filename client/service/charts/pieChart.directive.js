/**
 * Created by kolesnikov-a on 13/03/2017.
 */
sistemaAlertas.directive('pieChart', ['chartLoader', function(chartLoader){
	return {
		restrict: 'E',
		scope: {
			data: '=',
			options: '=',
			click: '&'
		},
		link: function (scope, elm) {
			let selectedItem = undefined;
			chartLoader.then((chartService) => {

				scope.readyFn = () => {
					chartCtrl.chart.setSelection(selectedItem);
				};

				scope.selectFn = () => {
					selectedItem = chartCtrl.chart.getSelection();

					const rowNumber = parseInt(selectedItem[0].row);

					if(selectedSlice != -1){    // If we have a selection, unexplode it
						scope.options.slices[selectedSlice] = {offset:'0'};
					}
					if(selectedSlice == rowNumber){ // If this is already selected, unselect it
						selectedSlice = -1;
					} else {  // else explode it
						scope.options.slices[rowNumber] = {offset:'.2'};
						selectedSlice = rowNumber;
						//selectItem = true;
					}

					chartCtrl.drawChart(scope.data, scope.options);

					scope.click({selectedRow: selectedItem[0]});

				};

				let chartCtrl = new chartService('PIE', elm[0], scope.selectFn, scope.readyFn);
				let selectedSlice = -1;

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