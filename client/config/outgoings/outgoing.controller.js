/**
 * Created by kolesnikov-a on 01/02/2017.
 */
sistemaAlertas.controller('outgoingCtrl', ['configFactory', 'Outgoing', 'dialogsService', 'validatorService', 'dataService', function(configFactory, Outgoing, dialogsService, validatorService, dataService){

	const vm = this;

	function getOutgoings(){
		configFactory.getOutgoings().then((data) => {
			vm.outgoings = data;
		}).catch((error) => {
			//console.log(error);
		});
	}

	vm.validator = validatorService;
	vm.editOutgoing = new Outgoing();

	vm.outgoings = [];

	vm.loadGroups = (query) => {
		return dataService.getGroupsList(query);
	};

	vm.resetSchedule = () => {
		vm.schedule = {
			second: {
				value: '',
				min: 1
			},
			minute: {
				value: '',
				min: 0
			},
			hour: {
				value: '',
				min: 0
			},
			day: {
				value: ''
			},
			month: {
				value: ''
			},
			repeat: 0
		};
	};

	vm.groupsList = [];
	vm.emailList = [];
	vm.headersList = [];
	vm.fieldsList = [];

	vm.daysOfWeek = [
		{ day: "D", repeat: false, value: 0 },
		{ day: "L", repeat: false, value: 1 },
		{ day: "M", repeat: false, value: 2 },
		{ day: "M", repeat: false, value: 3 },
		{ day: "J", repeat: false, value: 4 },
		{ day: "V", repeat: false, value: 5 },
		{ day: "S", repeat: false, value: 6 }
	];

	vm.addHeader = () => {
		vm.headersList.push({name: '', value: ''});
	};

	vm.removeHeader = (index) => {
		vm.headersList.splice(index, 1)
	};

	vm.setSchedule = () => {
		switch (vm.schedule.repeat){
			case 0:
				vm.schedule.second.min = 1;
				vm.schedule.minute.value = '';
				vm.schedule.hour.value = '';
				vm.schedule.day.value = '';
				vm.schedule.month.value = '';
				break;
			case 1:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 1;
				vm.schedule.hour.value = '';
				vm.schedule.day.value = '';
				vm.schedule.month.value = '';
				break;
			case 2:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 0;
				vm.schedule.hour.min = 1;
				vm.schedule.day.value = '';
				vm.schedule.month.value = '';
				break;
			case 3:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 0;
				vm.schedule.hour.min = 0;
				vm.schedule.month.value = '';
				break;
			case 4:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 0;
				vm.schedule.hour.min = 0;
				break;
			case 5:
				vm.schedule.second.min = 0;
				vm.schedule.minute.min = 0;
				vm.schedule.hour.min = 0;
				vm.schedule.month.value = vm.schedule.month.value || 1;
				vm.schedule.day.value = vm.schedule.day.value || 1;
				vm.schedule.hour.value = vm.schedule.hour.value || 0;
				vm.schedule.minute.value = vm.schedule.minute.value || 0;
				vm.schedule.second.value = vm.schedule.second.value || 0;
				vm.daysOfWeek.forEach((day) => {
					day.repeat = false;
				})
		}
	};

	vm.setOutgoing = (outgoing) => {
		vm.editOutgoing = outgoing;
		vm.daysOfWeek.forEach((day) => {
			day.repeat = (vm.editOutgoing.cron.dayOfWeek.indexOf(day.value) != -1);
		});
		vm.emailList = [];
		vm.editOutgoing.mail.accounts.forEach((account) => {
			vm.emailList.push({ text: account });
		});
		vm.groupsList = [];
		vm.editOutgoing.group.forEach((group) => {
			vm.groupsList.push({ text: group});
		});
		vm.fieldsList = [];
		vm.editOutgoing.res.config.description.forEach((field) => {
			vm.fieldsList.push({text: field});
		});
		vm.headersList = [];
		for (var property in vm.editOutgoing.req.headers) {
			if (vm.editOutgoing.req.headers.hasOwnProperty(property)) {
				vm.headersList.push({
					name: property,
					value: vm.editOutgoing.req.headers[property]
				})
			}
		}
		vm.resetSchedule();
		if (angular.isDefined(vm.editOutgoing.cron.second)){
			vm.schedule.second.value = vm.editOutgoing.cron.second;
			vm.schedule.repeat = 0;
		}
		if (angular.isDefined(vm.editOutgoing.cron.minute)){
			vm.schedule.minute.value = vm.editOutgoing.cron.minute;
			vm.schedule.repeat = 1;
		}
		if (angular.isDefined(vm.editOutgoing.cron.hour)){
			vm.schedule.hour.value = vm.editOutgoing.cron.hour;
			vm.schedule.repeat = 2;
		}
		if (angular.isDefined(vm.editOutgoing.cron.day)){
			vm.schedule.day.value = vm.editOutgoing.cron.day;
			vm.schedule.repeat = 3;
		}
		if (angular.isDefined(vm.editOutgoing.cron.month)){
			vm.schedule.month.value = vm.editOutgoing.cron.month;
			vm.schedule.repeat = 4;
		}
		vm.setSchedule();
	};

	vm.resetForm = () => {
		vm.editOutgoing = new Outgoing();
		vm.resetSchedule();
		vm.daysOfWeek.forEach((day) => {
			day.repeat = false;
		});
		vm.emailList = [];
		vm.headersList = [];
		vm.groupsList = [];
		vm.fieldsList = [];
	};


	vm.deleteOutgoing = () => {
		const question = dialogsService.confirm('Monitoreo', `¿Desea eliminar la tarea ${vm.editOutgoing.name}?`);
		question.result.then(() => {
			vm.editOutgoing.remove().then((data) => {
				getOutgoings();
				vm.resetForm();
			}).catch((error) => {
				dialogsService.error('Monitoreo', `Se produjo un error al borrar la tarea. ${error.data}`);
			});
		})
	};

	vm.saveOutgoing = () => {
		let daysRepeat = 0;
		vm.daysOfWeek.forEach((day) => {
			if (day.repeat) daysRepeat++;
		});

		if (vm.validator.checkMailList(vm.emailList, vm.editOutgoing)){
			if (vm.schedule.repeat <= 4 && daysRepeat > 0){
				vm.editOutgoing.schedule = vm.schedule;
				vm.editOutgoing.daysOfWeek = vm.daysOfWeek;
				vm.editOutgoing.mailList = vm.emailList;
				vm.editOutgoing.groups = vm.groupsList;
				vm.editOutgoing.headers = vm.headersList;
				vm.editOutgoing.configFields = vm.fieldsList;
				vm.editOutgoing.save().then((data) => {
					dialogsService.notify('Monitoreo', `Los cambios en la tarea ${vm.editOutgoing.name} se han guardado correctamente`);
					if (data.task == 'new'){
						vm.outgoings.push(vm.editOutgoing);
					}
					vm.resetForm();
				}).catch((error) => {
					console.log(error);
					dialogsService.error('Monitoreo', `Se produjo un error al intentar guardar los cambios. ${error}`);
				});
			} else {
				dialogsService.notify('Monitoreo', 'Debe especificar qué días de la semana debe ejecutarse la tarea.');
			}
		} else {
			dialogsService.notify('Monitoreo', 'Al activar el envío de mails, se debe especificar al menos una dirección válida donde enviarlo');
		}

	};

	vm.resetSchedule();
	getOutgoings();

}]);


sistemaAlertas.directive('convertToNumber', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function(val) {
				return val != null ? parseInt(val, 10) : null;
			});
			ngModel.$formatters.push(function(val) {
				return val != null ? '' + val : null;
			});
		}
	};
});