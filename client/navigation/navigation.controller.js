/**
 * Created by kolesnikov-a on 07/02/2017.
 */
sistemaAlertas.controller('navigationCtrl', ['clockService', 'notificationService', 'Session', function(clockService, notificationService, Session){

	this.timer = clockService;
	this.notifications = notificationService;
	this.session = Session;

	this.logOut = () => {
		this.notifications.closeConnection();
		this.session.logOut();
	}

}]);