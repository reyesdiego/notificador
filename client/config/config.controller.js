/**
 * Created by kolesnikov-a on 07/02/2017.
 */
sistemaAlertas.controller('configCtrl', ['clockService', function(clockService){
	let vm = this;

	vm.timer = clockService;

}]);