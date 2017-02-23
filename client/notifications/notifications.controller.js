/**
 * Created by kolesnikov-a on 11/11/2016.
 */
sistemaAlertas.controller('notificationsCtrl', ['notificationService',
	function(notificationService){

		this.notifications = notificationService;

	}]);