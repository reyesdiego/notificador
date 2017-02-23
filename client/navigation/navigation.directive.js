/**
 * Created by kolesnikov-a on 07/02/2017.
 */
sistemaAlertas.directive('navigationBar', [function(){
	return {
		restrict:		'E',
		templateUrl:	'navigation/navigation.bar.html',
		controller: 	'navigationCtrl as vmNavigation'
	}
}]);