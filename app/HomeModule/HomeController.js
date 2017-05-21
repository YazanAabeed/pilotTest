'use strict';

(function (angular) {

    let app = angular.module('pilotTest.home', ['ui.router'])
        .config(['$stateProvider', function($stateProvider) {
            let homeState = {
                url: '/',
                templateUrl: 'HomeModule/home.html',
                controller: 'HomeController',
                name: "home"
            };

            $stateProvider.state('home', homeState);
        }]);

    app.controller('HomeController', ['$scope', function($scope) {}]);

})(angular);