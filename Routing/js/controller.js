var main = angular.module("app", ['ui.bootstrap-slider']);

main.controller('MyController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.initialize = function()
    {
        //initializeData(0, 0);
        initializeDataRandom(0, 0);
        $scope.tabClicked('tab1');
    };

    $scope.tabClicked = function(type)
    {

        if (type == 'tab1')
        {
            $scope.tab1 = true;
            $scope.tab2 = false;
        }
        else if (type == 'tab2')
        {
            $scope.tab1 = false;
            $scope.tab2 = true;
        }
        //ClearCanvas
        //Load CurrentTime
       
    }

    //#region initialize data

    $scope.dataPoints = [];
    var initializeData = function (dX,dY) {
        var limit = 32786    //increase number of dataPoints by increasing this
        $scope.dataPoints = [];
        for (var i = 0; i < limit; i++)
        {
            $scope.dataPoints.push({
                t: 0.002 * i,
                x: i % 10000 - dY,
                //y: i * 0.00001  - dY,
                y: Math.floor((Math.random() * 10000) + 1) - dY,
            });
        }
    }
    var initializeDataRandom = function (dX, dY) {
        var limit = 32786;    //increase number of dataPoints by increasing this
        $scope.dataPoints = [];
        for (var i = 0; i < limit; i++) {
            $scope.dataPoints.push({
                t: 0.002 * i,
                x: Math.floor((Math.random() * 250) + 1),
                y: Math.floor((Math.random() * 150) + 1),
            });
        }
    }
 
    //#endregion

}]);
