/**
 * Created by kolesnikov-a on 08/02/2017.
 */
sistemaAlertas.service('validatorService', [function(){

	class validatorService{

		static checkMailList(mailList, task){
			if (mailList.length == 0) {
				return !task.mail.status;
			} else {
				return true;
			}
		}

		static validateEmail(email){
			const re = /^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			return re.test(email.text);
		};

	}

	return validatorService

}]);