﻿var main = angular.module("app", []);

main.controller('MyController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.initialize = function()
    {
        $scope.tabClicked('dygraph');
    };

    $scope.tabClicked = function(type)
    {
        initializeData(0,0);
    }

    //#region initialize data

    $scope.dataPoints = [];
    var initializeData = function (dX,dY) {
        var limit = 32768    //increase number of dataPoints by increasing this
        $scope.dataPoints = [];
        for (var i = 0; i < limit; i++)
        {
            $scope.dataPoints.push({
                t: 0.002 * i,
                x: i % 250 - dX,
                y: i  % 150 - dY,
                //y: Math.floor((Math.random() * 10000) + 1) - dY,
            });
        }
    }
 
    //#endregion

}]);