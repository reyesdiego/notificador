/**
 * Created by kolesnikov-a on 01/02/2017.
 */
sistemaAlertas.factory('configFactory', ['$http', '$q', 'API_ENDPOINT', 'Outgoing', 'Incoming', function($http, $q, API_ENDPOINT, Outgoing, Incoming){

	class configFactory {

		buildOutgoings(outgoingsData){
			let outgoingsArray = [];
			for (let outgoing of outgoingsData){
				outgoingsArray.push(new Outgoing(outgoing));
			}
			return outgoingsArray;
		}

		buildIncomings(incomingsData){
			let incomingsArray = [];
			for (let incoming of incomingsData){
				incomingsArray.push(new Incoming(incoming));
			}
			return incomingsArray;
		}

		getOutgoings(){
			const deferred = $q.defer();
			const uri = `http://${API_ENDPOINT}/outgoings`;
			$http.get(uri).then((response) => {
				if (response.data.status == 'OK'){
					deferred.resolve(this.buildOutgoings(response.data.data));
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		getIncomings(){
			const deferred = $q.defer();
			const uri = `http://${API_ENDPOINT}/incomings`;
			$http.get(uri).then((response) => {
				if (response.data.status == 'OK'){
					deferred.resolve(this.buildIncomings(response.data.data));
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

	}

	return new configFactory();

}]);