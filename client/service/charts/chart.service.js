/**
 * Created by kolesnikov-a on 13/03/2017.
 */
sistemaAlertas.service('chartLoader', ['$q', function($q){

	let deferred = $q.defer();

	class chartService {

		constructor(chartType, elm, selectFn, readyFn){
			this.type = chartType;

			if (chartType == 'PIE'){
				this.chart = new google.visualization.PieChart(elm);
			} else {
				this.chart = new google.visualization.ColumnChart(elm);
			}

			google.visualization.events.addListener(this.chart, 'select', selectFn);
			google.visualization.events.addListener(this.chart, 'ready', readyFn);

		}

		drawChart(data, options) {
			let chartData = new google.visualization.arrayToDataTable(data);

			this.chart.draw(chartData, options);
		}
	}

	google.charts.load('current', {'packages':['corechart'], 'language': 'es'});
	google.charts.setOnLoadCallback(() => {
		deferred.resolve(chartService);
	});

	return deferred.promise;


}]);