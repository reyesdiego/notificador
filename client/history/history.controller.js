/**
 * Created by kolesnikov-a on 03/03/2017.
 */
sistemaAlertas.controller('historyCtrl', ['Session', 'notificationService', function(Session, notificationService){
	let vm = this;

	vm.user = Session;
	vm.notifications = notificationService;
	vm.notificationsHistory = [];
	vm.pagination = {
		current: 1,
		itemsPerPage: 15
	};

	vm.groupSelected = 'ADMIN';

	vm.getHistory = () => {
		const page = {
			skip: (vm.pagination.current - 1) * vm.pagination.itemsPerPage,
			limit: vm.pagination.itemsPerPage
		};
		vm.notifications.getGroupHistory(vm.groupSelected, page).then((data) => {
			vm.notificationsHistory = data;
			console.log(data);
		});
	};

	vm.notifications.watchedSystems.forEach((system) => {
		system.getHistory();
	})
}]);