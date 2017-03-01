/**
 * Created by kolesnikov-a on 14/11/2016.
 */
sistemaAlertas.service('notificationService', ['Socket', 'API_ENDPOINT', '$timeout', 'Session', 'Notification', 'NotificationRoom', function(Socket, API_ENDPOINT, $timeout, Session, Notification, NotificationRoom){

	class notificationService {

		constructor(){
			this.lastControl = null;
			this.socket = null;

			this.watchedSystems = [];

			if (Session.isAuthenticated) this.init();
		}

		init(){
			this.lastControl = null;
			this.watchedSystems = [];

			this.socket = new Socket(API_ENDPOINT, 'notificaciones:');

			Session.tasks.forEach((task) => {
				let room = new NotificationRoom(task);
				this.watchedSystems.push(room);
				room.checkNotifications();
			});

			let totalSystems = Session.tasks.length;
			let widthPanel = 4;

			this.panelHeigth = 'half-screen';
			if (totalSystems < 4){
				widthPanel = 12 / totalSystems;
				this.panelHeigth = 'full-screen';
			} else if (totalSystems == 4){
				widthPanel = 6;
			}

			this.panelWidth = `col-xs-${widthPanel}`;

			this.socket.connection.on('connect', () => {

				this.lastControl = new Notification({
					system: 'Monitoreo',
					name: 'Monitoreo - conexión establecida',
					type: 'INFO',
					fecha: new Date()
				});

				this.socket.connection.on('isAlive', (data) => {
					this.lastControl = new Notification(data);
				});

			});

			this.socket.connection.on('connect_error', () => {
				this.lastControl = new Notification({
					name: 'Fallo de conexión con el servidor',
					fecha: new Date(),
					status: 'ERROR'
				})
			});

			this.socket.connection.on('reconnect_attempt', () => {
				this.lastControl = new Notification({
					name: 'Intentando reconectar...',
					fecha: new Date(),
					status: 'INFO'
				});
			});


		};

		closeConnection(){
			$timeout.cancel(this.controlPromise);
			this.watchedSystems.forEach((system) => {
				system.disconnect();
			});
			this.socket.connection.disconnect();
		};

		get infoCount(){
			let total = 0;
			this.watchedSystems.forEach((system) => {
				total+= system.infoCount;
			});
			return total;
		}

		get warningCount(){
			let total = 0;
			this.watchedSystems.forEach((system) => {
				total+= system.warningCount;
			});
			return total;
		}

		get alertCount(){
			let total = 0;
			this.watchedSystems.forEach((system) => {
				total+= system.alertCount;
			});
			return total;
		}

	}

	return new notificationService();

}]);