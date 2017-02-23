/**
 * Created by kolesnikov-a on 14/11/2016.
 */
sistemaAlertas.service('clockService', ['$timeout', function($timeout){

	const tickInterval = 1000; //ms

	this.clock = '';

	this.tick = () => {
		this.clock = Date.now();
		$timeout(this.tick, tickInterval);
	};

	$timeout(this.tick, tickInterval);


}]);