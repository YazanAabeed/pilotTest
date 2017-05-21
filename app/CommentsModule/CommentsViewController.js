'use strict';

(function (angular) {

    let app = angular.module('pilotTest.comments', ['ui.router'])
        .config(['$stateProvider', function ($stateProvider) {
            let commentsState = {
                url: '/comments',
                templateUrl: 'CommentsModule/commentsView.html',
                controller: 'CommentsViewController',
                name: "comments"
            };

            $stateProvider.state('comments', commentsState);
        }]);

    app.controller('CommentsViewController', ['$scope', '$http', '$mdDialog', function ($scope, $http, $mdDialog) {
        $scope.comments = [];
        $scope.loading = true;

        $scope.searchData = false;
        $scope.searchBy = "";

        $scope.searchCommentBy = function (comment) {

            comment = comment || {};

            if (!$scope.searchData) {
                let id = (comment.id || "") + "";
                return id.indexOf($scope.searchBy) > -1;
            } else {
                let email = comment.email || "";
                return email.indexOf($scope.searchBy) > -1;
            }
        };

        $scope.deleteItem = function (ev, comment) {
            comment = comment || {};

            let confirm = $mdDialog.confirm()
                .title('Would you like to delete this comment?')
                .textContent('All of the content for this comment will removed.')
                .ariaLabel('comment')
                .targetEvent(ev)
                .ok('OK!')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                $scope.comments.forEach(function (commentIn, index) {
                    if (commentIn.id === comment.id) {
                        $scope.comments.splice(index, 1);
                        return;
                    }
                });
            }, function () {
            });
        };

        $scope.addNewItem = function (ev) {
            $mdDialog.show({
                locals: {resolvedData: {}},
                controller: 'DialogController',
                templateUrl: 'CommentsModule/addEditCommentsModal.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true,
                parent: angular.element(document.body)
            }).then(function (comment, id) {
                comment = comment || {};

                if (id) {
                    $scope.comments.forEach(function (commentIn, index) {
                        if (commentIn.id === comment.id) {
                            angular.extend(commentIn, comment);
                            return;
                        }
                    });
                } else {
                    comment.id = $scope.comments[$scope.comments.length - 1].id + 1;
                    $scope.comments.push(comment);
                }


            }, function () {
            });
        };

        $scope.editItem = function (ev, comment) {
            $mdDialog.show({
                locals: {resolvedData: angular.copy(comment)},
                controller: 'DialogController',
                templateUrl: 'CommentsModule/addEditCommentsModal.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: false,
                parent: angular.element(document.body)
            }).then(function (comment) {
                comment = comment || {};

                if (comment.id) {
                    $scope.comments.forEach(function (commentIn) {
                        if (commentIn.id === comment.id) {
                            angular.extend(commentIn, comment);
                            return;
                        }
                    });
                } else {
                    comment.id = $scope.comments[$scope.comments.length - 1].id + 1;
                    $scope.comments.push(comment);
                }
            }, function () {
            });
        };

        $http({
            method: 'GET',
            url: 'http://jsonplaceholder.typicode.com/comments'
        }).then(function successCallback(response) {
            $scope.comments = response.data;
            $scope.loading = false;

            safeDigest($scope);
        }, function errorCallback(response) {
            $scope.loading = false;
            safeDigest($scope);
        });
    }]);

    app.controller('DialogController', ['$scope', '$mdDialog', 'resolvedData', function ($scope, $mdDialog, resolvedData) {

        $scope.comment = resolvedData || {};

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.submitForm = function () {

            if ($scope.comment.name && $scope.comment.email && $scope.comment.body) {
                $mdDialog.hide($scope.comment);
            }
        };
    }
    ]);
})(angular);