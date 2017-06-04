var main = angular.module("app", []);

main.controller('MyController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.Message = 'Click Button';
    $scope.charts = [];

    var chartSizeInfo = {
        canvasSizeX: 500,
        canvasSizeY: 300,
        axisXPadding: 40,
        axisYPadding: 40,
        xMax: 500,
        xMin: 0,
        yMax: 300,
        yMin: 0,
        T: 16384
    };
    var chartFPSInfo = {
        fps: 3,
        appendCount:16
    }
    $scope.initialize = function()
    {
        $scope.tabClicked('dygraph');
    };

    var ctx = {};
    $scope.tabClicked = function(type)
    {
        $scope.stage = new createjs.Stage('canvas_id');
        ctx = $scope.stage.canvas.getContext('2d');

        initializeData();
        transformCoordination();
        drawAxis();

        //static
        //drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);

        //createjs.Ticker.addEventListener("tick", $scope.stage);
        createjs.Ticker.addEventListener("tick", handleTick);
        createjs.Ticker.setFPS(3);
        //createjs.Ticker.timingMode = createjs.Ticker.RAF;
        
    }

    //#region initialize data
    var dataPoints = [];
    var initializeData = function () {
        var limit = chartSizeInfo.T;    //increase number of dataPoints by increasing this
        dataPoints = [];
        for (var i = 0; i < limit; i++)
        {
            dataPoints.push({
                t: 0.002 * i,
                x: i % 500,
                y: (i / 500) * 3 + 3, 
            });
        }
    }
    var initializeDataRandom = function () {
        var limit = chartSizeInfo.T;    //increase number of dataPoints by increasing this
        dataPoints = [];
        for (var i = 0; i < limit; i++) {
            dataPoints.push({
                t: 0.002 * i,
                x: Math.floor((Math.random() * 500) + 1),
                y: Math.floor((Math.random() * 300) + 1),
            });
        }
    }
    //#endregion

    //#region transform coordination
    var points = [];
    var transformCoordination = function ()
    {
        _.each(dataPoints, function (n) {
            points.push({
                t:n.t,
                x:chartSizeInfo.axisYPadding + n.x,
                y:chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding - n.y,
            })
        });
    }
    //#endregion

    //#region draw axis
    var drawAxis = function()
    {
        drawAxisX();
        drawAxisY();
        var g = new createjs.Graphics();
        g.beginStroke("Black");
        g.moveTo(0,chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding);
        g.lineTo(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding);
        var s = new createjs.Shape(g);
        $scope.stage.addChild(s);
    }
    var drawAxisX = function()
    {
        var g = new createjs.Graphics();
        g.beginStroke("Black");
        g.moveTo(0,chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding);
        g.lineTo(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding);
        var s = new createjs.Shape(g);
        $scope.stage.addChild(s);
    }

    var drawAxisY = function()
    {
        var g = new createjs.Graphics();
        g.beginStroke("Black");
        g.moveTo(chartSizeInfo.axisYPadding, 0);
        g.lineTo(chartSizeInfo.axisYPadding, chartSizeInfo.canvasSizeY);
        var s = new createjs.Shape(g);
        $scope.stage.addChild(s);
    }
    //#endregion

    //var handleTick = function () {
    //    //var appendCount = 50;
    //    initializeDataRandom();
    //    points = [];
    //    transformCoordination();;
    //    $scope.stage.removeAllChildren();
        
    //    drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);

    //    //if ($scope.index % appendCount == 0) {
    //    //    $scope.stage.update();
    //    //}
    //}

    $scope.index = 0;
    var handleTick = function () {
        var appendCount = chartSizeInfo.T / 512; //4 - 256 //fast - slow
        drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index , appendCount);

        if ($scope.index % appendCount == 0)
        {
            //createCache();
            //$scope.stage.update();
        }
    }


    var drawAllPlots = function (points, xMax, xMin, yMax, yMin, currentTime)
    {
        _.each(points, function (n, i) {
            if(i+1 < currentTime)
            {
                drawPlot(points, i, i+1);
            }
        });
        //$scope.stage.update();
    }

    var drawAppendPlots = function (points, xMax, xMin, yMax, yMin, currentTime,appendCount) {
        _.each(points, function (n, i) {
            if (i <= currentTime && i < chartSizeInfo.T  - 1) {
                drawPlot(points, i, i + 1);
            }
        });
        $scope.index += appendCount;
        $scope.$apply();
        //$scope.stage.update();
    }
    
    var drawPlot = function (points,startIndex,endIndex)
    {
        var shape = new createjs.Shape();
        shape.graphics.beginFill("Green");
        shape.graphics.drawCircle(points[endIndex].x, points[endIndex].y, 1);
        $scope.stage.addChild(shape);
        shape.draw(ctx);
        //shape.graphics.clear();

        //createCache();
        //var rec = shape.getBounds();
        //shape.cache(rec.x, rec.y, rec.width, rec.height);
        //if (startIndex != 0) {
        //    var g = new createjs.Graphics();
        //    g.beginStroke("Blue");
        //    g.moveTo(points[startIndex - 1].x, points[startIndex - 1].y);
        //    g.lineTo(points[endIndex].x, points[endIndex].y);
        //    var s = new createjs.Shape(g);
        //    $scope.stage.addChild(s);
        //    s.draw(ctx);
        //    //g.clear();
        //    //$scope.stage.cache(0,0,300,300);
        //}

        $scope.fps = createjs.Ticker.getMeasuredFPS();
        $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
    }

    var createCache = function()
    {
        var l = $scope.stage.getNumChildren() - 1;
        for (var i = 0; i < l; i++) {
            var shape = $scope.stage.getChildAt(i);
            var radius = 10;
            if (true) {
                shape.cache(-radius, -radius, radius * 2, radius * 2);
            }
            //else {
            //    shape.uncache();
            //}
        }
    }

}]);
//$scope.index = 0;
//var handleTick = function () {
//    $scope.$apply('index');
//    if ($scope.index < points.length)
//    {
//        var shape = new createjs.Shape();
//        shape.graphics.beginFill("Blue");
//        shape.graphics.drawCircle(points[$scope.index].x, points[$scope.index].y, 1);
//        $scope.stage.addChild(shape);
//        if ($scope.index != 0) {
//            var g = new createjs.Graphics();
//            g.beginStroke("Red");
//            g.moveTo(points[$scope.index - 1].x, points[$scope.index - 1].y);
//            g.lineTo(points[$scope.index].x, points[$scope.index].y);
//            var s = new createjs.Shape(g);
//            $scope.stage.addChild(s);
//        }
//        $scope.index++;
//    }
//}

//var drawPlot = function (points, startIndex, endIndex) {
//    //var shape = new createjs.Shape();
//    //shape.graphics.beginFill("Green");
//    //shape.graphics.drawCircle(points[endIndex].x, points[endIndex].y, 1);
//    //$scope.stage.addChild(shape);
//    //shape.draw(ctx);

//    if (startIndex != 0) {
//        var g = new createjs.Graphics();
//        g.beginStroke("Red");
//        g.moveTo(points[startIndex - 1].x, points[startIndex - 1].y);
//        g.lineTo(points[endIndex].x, points[endIndex].y);
//        var s = new createjs.Shape(g);
//        $scope.stage.addChild(s);
//        s.draw(ctx);
//        //g.clear();
//    }
//    $scope.fps = createjs.Ticker.getMeasuredFPS();
//    $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
//}