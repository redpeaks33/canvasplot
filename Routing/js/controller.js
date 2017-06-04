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
    var chartDrawInfo = {
        fps: 3,
        appendCount: 1024 //128,256,512,1024,2048 //slow - fast
    }
    $scope.initialize = function()
    {
        $scope.tabClicked('dygraph');
    };

    var ctx = {};
    $scope.tabClicked = function(type)
    {
        initializeCanvas();
        initializeData();
        transformCoordination();
        

        //static
        //drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);

        //dynamic
        //createjs.Ticker.addEventListener("tick", $scope.stage);
        //createjs.Ticker.timingMode = createjs.Ticker.RAF;

        createjs.Ticker.addEventListener("tick", handleTick);
        createjs.Ticker.setFPS(chartDrawInfo.fps);
        
    }
    //#region initialize canvas
    var initializeCanvas = function()
    {
        $scope.stage = new createjs.Stage('canvas_id');
        ctx = $scope.stage.canvas.getContext('2d');
        $scope.stage.autoClear = false;
        $scope.stage.clear();
        $scope.index = 0;
        $scope.stage.update();

        drawAxis();
    }
    //#endregion

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
        $scope.stage.update();
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

    //#region tick method
    $scope.index = 0;
    var handleTick = function () {
        drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index , chartDrawInfo.appendCount);
    }
    //#endregion

    //#region draw all plots
    var drawAllPlots = function (points, xMax, xMin, yMax, yMin, currentTime)
    {
        _.each(points, function (n, i) {
            if(i+1 < currentTime)
            {
                drawPlot(points, i, i+1);
            }
        });
    }
    //#endregion

    //#region draw append plots
    var drawAppendPlots = function (points, xMax, xMin, yMax, yMin, currentTime, appendCount) {
        _.each(points, function (n, i) {
            if (i <= currentTime && i < chartSizeInfo.T - 1) {
                drawPlot(points, i, i + 1);
            }
        });
        $scope.index += appendCount;
        if ($scope.index > chartSizeInfo.T)
        {
            initializeCanvas();
        }
        $scope.$apply();
    }
    //#endregion
    
    //#region draw plot
    var drawPlot = function (points,startIndex,endIndex)
    {
        var shape = new createjs.Shape();
        shape.graphics.beginFill("Red");
        shape.graphics.drawCircle(points[endIndex].x, points[endIndex].y, 1);
        $scope.stage.addChild(shape);
        shape.draw(ctx);

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
        //$scope.stage.clear();

        $scope.fps = createjs.Ticker.getMeasuredFPS();
        $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
    }
    //#endregion
}]);
