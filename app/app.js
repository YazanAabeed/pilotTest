'use strict';

function safeDigest(scope) {
    scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
}

(function (angular) {

    let app = angular.module('pilotTest', [
        'ngMaterial',
        'ngAnimate',
        'ui.router',
        'pilotTest.home',
        'ngMessages',
        'pilotTest.comments'
    ]).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$mdIconProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $mdIconProvider) {
        // For any unmatched url, redirect to /state1
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");

        $mdIconProvider.fontSet('md', 'material-icons');
    }]).run(["$rootScope", "$state", function ($rootScope, $state) {
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                $state.current = toState;
            }
        )
    }]);

    app.controller("HeaderController", ["$scope", "$state", function ($scope, $state) {
        $scope.currentNavItem = $state.current.name;
    }]);

})(angular);