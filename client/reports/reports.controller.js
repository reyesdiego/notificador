/**
 * Created by kolesnikov-a on 13/03/2017.
 */
sistemaAlertas.controller('reportsCtrl', [function(){

	let vm = this;

	vm.data = [
		['Task', 'Hours per Day'],
		['Work',     11],
		['Eat',      2],
		['Commute',  2],
		['Watch TV', 2],
		['Sleep',    7]
	];

	vm.options = {
		title: 'My Daily Activities',
		height: 500,
		width: 500,
		//series: {3: {type: 'line'}},
		backgroundColor: {'fill': 'transparent'},
		animation:{
			duration: 1000,
			easing: 'out'
		},
		legend: { position: 'top', maxLines: 3 },
		//bar: { groupWidth: '75%' },
		is3D: true,
		slices: {},
		//isStacked: $scope.chartObject.stacked,
		chartArea: { left: '10%' },
		tooltip: {
			isHtml: false,
			trigger: 'both'
		}
	};

	vm.selectFunc = (selectedRow) => {
		console.log('soy una funcion ejecutada desde el grafico');
		console.log(selectedRow);
	}

}]);