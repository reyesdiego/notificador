/**
 * Created by kolesnikov-a on 15/02/2017.
 */
sistemaAlertas.factory('NotificationRoom', ['Socket', 'Notification', 'SYSTEMS', '$timeout', 'Session', 'dataService', '$http', '$q', 'API_ENDPOINT',
	function(Socket, Notification, SYSTEMS, $timeout, Session, dataService, $http, $q, API_ENDPOINT){

		class NotificationRoom {

			constructor(system){

				this.group = system;
				this.historyData = [];
				this.historyCount = 0;
				this.pagination = {
					current: 1,
					itemsPerPage: 5
				};
				this.loadingHistory = false;
				dataService.getGroups().then((groups) => {
					groups.forEach((group) => {
						if (group._id == system) this.system = group.description;
					});
				}).catch((error) => {
					this.system = SYSTEMS[system];
				});

				this.infoCount = 0;
				this.warningCount = 0;
				this.alertCount = 0;
				this.list = [];

				this.socket = new Socket();

				this.socket.connection.on('connect', () => {

					this.socket.connection.emit('authenticate', {token: Session.token});

					this.socket.connection.emit('room', system);

				});

				this.socket.connection.on('outgoing', (data) => {
					this.setNotification(data);
				});

				this.socket.connection.on('incoming', (data) => {
					this.setNotification(data);
				});

				this.socket.connection.on('disconnect', (error) => {
					let data = {
						system: 'Monitoreo',
						name: 'Sistema de monitoreo',
						description: 'Sistema de monitereo, fallo de conexión.',
						message: {description: 'Se ha perdido la conexión con el sistema de monitoreo. Verificar estado de red.'},
						type: 'ERROR',
						code: 'CONTROL',
						fecha: new Date()
					};
					this.setNotification(data);
				});

				this.socket.connection.on('connect_error', (error) => {
					let data = {
						system: 'Monitoreo',
						name: 'Sistema de monitoreo',
						description: 'Sistema de monitoreo, fallo de conexión.',
						message: {description: 'No se pudo establecer la conexión con el sistema de monitoreo. Verificar estado de red.'},
						type: 'ERROR',
						code: 'CONTROL',
						fecha: new Date()
					};
					this.setNotification(data);
				});

			}

			setNotification(data){
				if (data.type == 'ERROR'){
					this.alertCount++;
				} else if(data.type == 'WARN'){
					this.warningCount++;
				} else {
					this.infoCount++;
				}

				this.list.push(new Notification(data));

			}

			checkNotifications(){
				this.controlPromise = $timeout(() => {
					if (this.list.length > 20){
						this.list.splice(0, this.list.length-20);
					}
					this.checkNotifications()
				}, 5000)
			}

			disconnect(){
				$timeout.cancel(this.controlPromise);
				this.socket.connection.removeAllListeners();
				this.socket.connection.disconnect();
			}

			getHistory(){
				this.loadingHistory = true;
				const page = {
					skip: (this.pagination.current - 1) * this.pagination.itemsPerPage,
					limit: this.pagination.itemsPerPage
				};

				const deferred = $q.defer();
				const inserturl = `http://${API_ENDPOINT}/notifications/${page.skip}/${page.limit}`;

				$http.get(inserturl, {params: {group: this.group}}).then((response) => {
					if (response.data.status == 'OK'){
						this.history = response.data.data;
						this.historyCount = response.data.totalCount;
						deferred.resolve(this.history);
					} else {
						deferred.reject(response.data);
					}
					this.loadingHistory = false;
				}).catch((response) => {
					deferred.reject(response.data);
					this.loadingHistory = false;
				});
				return deferred.promise;
			}

			get totalNotifications(){
				return this.infoCount + this.warningCount + this.alertCount;
			}

			set history(historyArray){
				this.historyData = [];
				let data = {};
				historyArray.forEach((notification) => {
					if (notification.incoming.length > 0){
						data = notification.incoming[0];
						data.control = 'Incoming';
						data.message = data.description;
					} else {
						data = notification.outgoing[0];
						data.control = 'Outgoing';
						data.message = data.res.description;
					}
					data.date = notification.date;
					this.historyData.push(data);
				})
			}

			get history(){
				return this.historyData;
			}

		}

		return NotificationRoom;

	}]);