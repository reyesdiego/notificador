/**
 * Created by kolesnikov-a on 03/03/2017.
 */
sistemaAlertas.controller('historyCtrl', ['notificationService', function(notificationService){
	let vm = this;

	vm.notifications = notificationService;

	vm.notifications.watchedSystems.forEach((system) => {
		system.getHistory();
	})
}]);