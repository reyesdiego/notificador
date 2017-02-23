/**
 * Created by kolesnikov-a on 13/02/2017.
 */
sistemaAlertas.directive('panelNotification', [function(){

	return {
		restrict:		'E',
		templateUrl:	'notifications/panelNotification.html',
		scope: {
			panelWidth: '=',
			panelHeigth: '=',
			system: '='
		}
	}

}]);