/**
 * Created by kolesnikov-a on 08/02/2017.
 */
sistemaAlertas.factory('Incoming', ['$http', '$q', 'API_ENDPOINT', function($http, $q, API_ENDPOINT){

	class Incoming{

		constructor(incomingData){
			if (incomingData){
				angular.extend(this, incomingData);
			} else {
				this.type = 'INFO';
				this.mail = {
					status: false,
					accounts: []
				}
			}
		}

		update(){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINT}/incoming/${this.name}/change`;
			$http.put(inserturl, this).then((response) => {
				if (response.data.status == 'OK'){
					response.data.task = 'update';
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		addNew(){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINT}/incoming`;
			$http.post(inserturl, this).then((response) => {
				if (response.data.status == 'OK'){
					response.data.task = 'new';
					this._id = response.data.data._id;
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		save(){
			if (this._id){
				return this.update();
			} else {
				return this.addNew()
			}
		}

		remove(){
			const deferred = $q.defer();
			const inserturl = `http://${API_ENDPOINT}/incoming`;
			$http.delete(inserturl, {params: {_id: this._id}}).then((response) => {
				if (response.data.status == 'OK'){
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		set mailList(mailList){
			this.mail.accounts = [];
			mailList.forEach((mail) => {
				this.mail.accounts.push(mail.text);
			});
		}

		set groups(groups){
			this.group = [];
			groups.forEach((group) => {
				this.group.push(group.text);
			});
			if (this.group.indexOf('ADMIN') == -1) this.group.push('ADMIN');
		}

	}

	return Incoming;

}]);