/**
 * Created by kolesnikov-a on 11/11/2016.
 */
let sistemaAlertas = angular.module('sistemaAlertas', [
	'ui.router',
	'ui.bootstrap',
	'btford.socket-io',
	'ngAnimate',
	'ngTagsInput'
]);

sistemaAlertas.constant('SYSTEMS', {
	ADMIN: 'Administración del sistema',
	CTOL: 'Control de Terminales',
	OB2: 'Giro de Buques',
	ALIVE: 'Chequeo Plataformas Online'
});

sistemaAlertas.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
	$urlRouterProvider.otherwise('/login');

	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'login/login.html',
		controller: 'loginCtrl as loginVm'
	}).state('notifications', {
		url: '/notifications',
		templateUrl: 'notifications/notifications.html',
		controller: 'notificationsCtrl as vmNotificaciones',
		requireAuth: true
	}).state('config', {
		url: '/config',
		templateUrl: 'config/config.html',
		controller: 'configCtrl as config',
		requireAuth: true
	}).state('config.outgoing', {
		url: '/outgoings',
		templateUrl: 'config/outgoings/outgoing.html',
		controller: 'outgoingCtrl as vmOutgoings',
		requireAuth: true
	}).state('config.incoming', {
		url: '/incomings',
		templateUrl: 'config/incomings/incoming.html',
		controller: 'incomingCtrl as vmIncomings',
		requireAuth: true
	}).state('history', {
		url: '/history',
		templateUrl: 'history/history.html',
		controller: 'historyCtrl as vmHistory',
		requireAuth: true
	}).state('reports', {
		url: '/reports',
		templateUrl: 'reports/reports.html',
		controller: 'reportsCtrl as vmReports',
		requiereAuth: true
	})

}]);

//Configuración para interceptar respuestas http y tratar errores
sistemaAlertas.config(['$provide', '$httpProvider', function($provide, $httpProvider){

	// register the interceptor as a service
	$provide.factory('myHttpInterceptor', ['$rootScope', '$q',
		function($rootScope, $q) {
			return {
				// optional method
				'request': function(config) {
					// do something on success
					config.headers['Token'] = $rootScope.session.token;
					config.headers['Content-Type'] = 'application/json';
					//config.timeout = 2000;

					return config;
				},
				// optional method
				'requestError': function(rejection) {
					// do something on error

					/*if (canRecover(rejection)) {
					 return responseOrNewPromise
					 }*/
					return $q.reject(rejection);
				},
				// optional method
				'response': function(response) {
					// do something on success
					return response;
				},
				// optional method
				'responseError': function(rejection) {
					//TODO config custom messages for http Error status
					if (rejection.status == 404){ //Not found
						rejection.data = {
							status: 'ERROR',
							message: 'No se ha encontrado la ruta en el servidor.'
						}
					}

					if (rejection.status == -1) rejection.data = { message: 'No se ha podido establecer comunicación con el servidor.', status: 'ERROR' };
					// do something on error
					/*if (canRecover(rejection)) {
					 return responseOrNewPromise
					 }*/
					return $q.reject(rejection);
				}
			};
		}]);

	$httpProvider.interceptors.push('myHttpInterceptor');

}]);


sistemaAlertas.run(['$rootScope', 'Session', '$state',
	function($rootScope, Session, $state){

		$rootScope.session = Session;
		$rootScope.loginScreen = true;

		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromParams) {
			$rootScope.loginScreen = (toState.name == 'login');
		});

		$rootScope.$on('$stateChangeStart',	function(event, toState, toParams, fromState, fromParams, options){
			if (toState.requireAuth && !$rootScope.session.isAuthenticated){
				event.preventDefault();
				$state.transitionTo('login');
			}
		})

	}]);