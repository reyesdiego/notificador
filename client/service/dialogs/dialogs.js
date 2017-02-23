/**
 * Created by kolesnikov-a on 26/04/2016.
 */
sistemaAlertas.service('dialogsService', ['$uibModal', function($uibModal){

    return {
        error: function(title, message){
            return $uibModal.open({
                controller: 'dialogsCtrl',
                templateUrl: './service/dialogs/error.html',
                resolve: {
                    title: function(){
                        return title;
                    },
                    message: function(){
                        return message;
                    }
                }
            })
        },
        notify: function(title, message){
            return $uibModal.open({
                controller: 'dialogsCtrl',
                templateUrl: './service/dialogs/notify.html',
                resolve: {
                    title: function(){
                        return title
                    },
                    message: function(){
                        return message
                    }
                }
            })
        },
        confirm: function(title, message) {
            return $uibModal.open({
                controller: 'dialogsCtrl',
                templateUrl: './service/dialogs/confirm.html',
                resolve: {
                    title: function () {
                        return title
                    },
                    message: function () {
                        return message
                    }
                }
            })
        }
    }

}]);

sistemaAlertas.controller('dialogsCtrl', ['$scope', '$uibModalInstance', 'title', 'message', function($scope, $uibModalInstance, title, message){

    $scope.modalData = {
        title: title,
        message: message
    };

    //console.log($scope.modalData);

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);