/**
 * Created by kolesnikov-a on 13/02/2017.
 */
sistemaAlertas.controller('loginCtrl', ['Session', '$state', 'dialogsService', 'notificationService', function(Session, $state, dialogsService, notificationService){

	let vm = this;

	vm.session = Session;

	if (vm.session.isAuthenticated) $state.transitionTo('notifications');

	vm.login = () => {
		vm.session.login().then(() => {
			notificationService.init();
			$state.transitionTo('notifications');
		}).catch((error) => {
			dialogsService.error('Monitoreo', `Se ha producido un error al intentar iniciar sesión. \n${error.data.message}`);
		});
	}

}]);