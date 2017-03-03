/**
 * Created by kolesnikov-a on 03/03/2017.
 */

sistemaAlertas.factory('historyFactory', ['$http', '$q', 'API_ENDPOINT', function($http, $q, API_ENDPOINT){

	class historyFactory {

		getHistory(page){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINT}/notifications/${page.skip}/${page.limit}`;
			$http.get(inserturl).then((response) => {
				if (response.data.status == 'OK'){
					deferred.resolve(response.data.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

	}

	return new historyFactory();

}]);
