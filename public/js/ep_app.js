(function(){              
    
    var app = angular.module('mainApp',['ui.bootstrap','ui.router', 'ui-notification'])

    app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode(true); //remove # from url
        $urlRouterProvider.otherwise('/');  //go to default url
        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'templates/home.html',
                controller: 'homeCntrl',
                access: {
                    requiredLogin: false
                },

            })
    }]);

    app.controller('homeCntrl', ["$scope", "$rootScope", "$stateParams", "mainFact", "notify", "$window", "$state", "$stateParams", "$sce", "$q","$filter", function($scope, $rootScope, $stateParams, mainFact, notify, $window, $state,$stateParams, $sce, $q, $filter){
        
        $scope.getOrders = function() {
            
            mainFact.postProcess('/api/getOrders').then(function (data) { 
                $scope.updateOrder(data)
            })

        }

        $scope.updateOrder = function(data) {

            if(data.status) {
                $scope.order = data.data
            }
            notify.notify(data.status, data.message)

        }

        $scope.orderCreated = function(id, quantity) {
            mainFact.postProcess('/api/orderCreated', {id: id, quantity: quantity}).then(function (data) {
                
                notify.notify(data.status, data.message)
                
            })
        }

        $scope.downloadReport = function() {

            $scope.isDownload = true
            var x = document.getElementById('report')
            console.log(x)
            html2canvas(x, {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500,
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("report"+Date()+".pdf", function(){$scope.isDownload = false});
                }
            });
            

        }
        
        
        var socket = io.connect({
            path: "/realtime",
        });
        $scope.loadSocket = function(){
            console.log('socket loaded')
            socket.on('status', function (response) {
                console.log(response)
                $scope.updateOrder(response)                
            });
        }
        $scope.loadSocket()
    }])  


    app.directive('navigationBar', ["$rootScope", function($rootScope){
        return{
            restrict: 'E',
            transclude:true,
            templateUrl: '/templates/navigation.html',
        }
    }])

    
    app.factory('mainFact', ["$http", "$q", function ($http, $q) {
        var postProcess = function(url,query){
            var d = $q.defer();
            $http.post(url, query).success(function(data){
                d.resolve(data);
            })
            return d.promise;
        };  
        return { postProcess: postProcess}  
    }]);

    app.factory('notify', ["Notification", function (Notification) {
        var notify = function (status, msg) {
            if (status == 1)
                Notification.success(msg);
            else
            if (status == 2)
                Notification.info(msg);
            else
                Notification.error(msg);
        };
        return {
            notify: notify
        };
    }]);

})();
