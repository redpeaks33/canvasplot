var main = angular.module("app", []);

main.controller('MyController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.Message = 'Click Button';
    $scope.charts = [];

    $scope.initialize = function()
    {
        $scope.tabClicked('dygraph');
    }
    $scope.tabClicked = function(type)
    {
        $scope.stage = new createjs.Stage('canvas_id');
        initializeData();
        createjs.Ticker.addEventListener("tick", $scope.stage);
        createjs.Ticker.addEventListener("tick", handleTick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;

    
        $scope.stage2 = new createjs.Stage('canvas_id2');
        drawStaticGraph();
    }

    var initializeData = function () {
        var limit = 32768;    //increase number of dataPoints by increasing this
        $scope.dataPoints = [];
        for (var i = 0; i < limit; i++)
        {
            $scope.dataPoints.push({
                t: 0.002 * i,
                x: Math.floor((Math.random() * 100) + 1),
                y: Math.floor((Math.random() * 200) + 1), 
            });
        }
    }

    var drawStaticGraph = function()
    {
        var shape = new createjs.Shape();
        shape.graphics.beginFill("Green");
        _.each($scope.dataPoints, function (n) {
            shape.graphics.drawCircle(n.x, n.y, 1);
            $scope.stage2.addChild(shape);
        });
        $scope.stage2.update();
    }

    $scope.index = 0;
    var handleTick = function() {
        var shape = new createjs.Shape();
        shape.graphics.beginFill("Blue");
        shape.graphics.drawCircle($scope.dataPoints[$scope.index].x, $scope.dataPoints[$scope.index].y, 1);
        $scope.stage.addChild(shape);
        if ($scope.index != 0) {
            var g = new createjs.Graphics();
            g.beginStroke("Red");
            g.moveTo($scope.dataPoints[$scope.index - 1].x, $scope.dataPoints[$scope.index - 1].y);
            g.lineTo($scope.dataPoints[$scope.index].x, $scope.dataPoints[$scope.index].y);
            var s = new createjs.Shape(g);
            $scope.stage.addChild(s);
        }
        $scope.index++;
        $scope.$apply('index');
    }
 
}]);
