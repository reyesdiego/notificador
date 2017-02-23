/**
 * Created by kolesnikov-a on 11/11/2016.
 */
sistemaAlertas.factory('Socket', ['socketFactory', 'API_ENDPOINT', function(socketFactory, API_ENDPOINT) {

	class Socket {
		constructor(){
			let ioSocket = io.connect(API_ENDPOINT, { transports: ['polling', 'websocket', 'xhr-polling']});
			this.socket = socketFactory({ioSocket: ioSocket});
		}

		emit(event, data){
			this.socket.emit(event, data);
		}

		get connection(){
			return this.socket;
		}
	}

	return Socket;

}]);