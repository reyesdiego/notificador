/**
 * Created by kolesnikov-a on 17/02/2017.
 */
sistemaAlertas.service('dataService', ['$http', '$q', 'API_ENDPOINT', '$filter', function($http, $q, API_ENDPOINT, $filter){

	class dataService {

		constructor(){
			this.groupsData = [];
		}

		getGroups(){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINT}/groups`;

			if (this.groupsData.length == 0){
				$http.get(inserturl).then((response) => {
					if (response.data.status == 'OK'){
						this.groupsData = response.data.data;
						deferred.resolve(response.data.data);
					} else {
						deferred.reject(response.data);
					}
				}).catch((response) => {
					deferred.reject(response.data);
				});
			} else {
				deferred.resolve(this.groupsData);
			}

			return deferred.promise;
		}

		getGroupsList(query){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINT}/groups`;

			let groupsArray = [];

			if (this.groupsData.length == 0){
				$http.get(inserturl).then((response) => {
					if (response.data.status == 'OK'){
						this.groupsData = response.data.data;
						this.groupsData.forEach((group) => {
							groupsArray.push({text: group._id})
						});
						deferred.resolve($filter('filter')(groupsArray, query));
					} else {
						deferred.reject(response.data);
					}
				}).catch((response) => {
					deferred.reject(response.data);
				});
			} else {
				this.groupsData.forEach((group) => {
					groupsArray.push({text: group._id})
				});
				deferred.resolve($filter('filter')(groupsArray, query));
			}

			return deferred.promise;
		}

	}

	return new dataService();

}]);