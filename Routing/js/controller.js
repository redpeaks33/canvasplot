var main = angular.module("app", []);

main.controller('MyController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.Message = 'Click Button';
    $scope.charts = [];
    var chartSizeInfo = {
        canvasSizeX: 1000,
        canvasSizeY: 600,
        axisXPadding: 40,
        axisYPadding: 40,
        xMax: 1000,
        xMin: 0,
        yMax: 600,
        yMin: 0,
        T: 16384 
    };
    var chartDrawInfo = {
        fps: 3,
        appendCount: 512 //128,256,512,1024,2048 //slow - fast
    }
    $scope.initialize = function()
    {
        $scope.tabClicked('dygraph');
    };

    var ctx = {};
    $scope.tabClicked = function(type)
    {
        initializeCanvas('canvas_id');
        //initializeCanvas('canvas_id2');
        initializeData(0,0);
        transformCoordination();
        

        //static
        //drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);

        //dynamic
        createjs.Ticker.addEventListener("tick", handleTick);
        createjs.Ticker.setFPS(chartDrawInfo.fps);
    }

    //#region initialize canvas
    var initializeCanvas = function (canvasID)
    {
        $scope.stage = new createjs.Stage(canvasID);
        ctx = $scope.stage.canvas.getContext('2d');
        $scope.stage.autoClear = false;
        $scope.stage.clear();
        $scope.index = 0;
        $scope.stage.update();

        drawAxis();
        drawDragSample();
        //$scope.stage.on("stagemousedown", function (evt) {
        //    //alert("the canvas was clicked at " + evt.stageX + "," + evt.stageY);
        //});
        //$scope.stage.on("stagemouseup", function (evt) {
        //    alert("the canvas was clicked at " + evt.stageX + "," + evt.stageY);
        //});
    }
    //#endregion
    var dragger = new createjs.Container();
    var drawDragSample = function () {
        //$scope.stage.mouseMoveOutside = true;

        //var circle = new createjs.Shape();
        //circle.graphics.beginFill("red").drawCircle(0, 0, 50);

        //var label = new createjs.Text("drag me", "bold 14px Arial", "#FFFFFF");
        //label.textAlign = "center";
        //label.y = -7;
        //var maskShape = new createjs.Shape();
        //maskShape.graphics.beginFill('red').drawRect(5, 5, 200, 200); // x, y, width, height
        //dragger.addChild(maskShape);

        //dragger.x = dragger.y = 0;
        ////dragger.addChild(circle, label);
        //$scope.stage.addChild(dragger);

        //dragger.on("pressmove", function (evt) {
        //    //$scope.stage.clear();
        //    // currentTarget will be the container that the event listener was added to:
        //    evt.currentTarget.x = evt.stageX;
        //    evt.currentTarget.y = evt.stageY;
        //    // make sure to redraw the stage to show the change:
        //    //$scope.stage.update();
        //});
        //dragger.on("pressup", function (evt) {
        //    $scope.stage.clear();
        //    dragger.removeAllChildren();
        //    points = [];
        //    initializeDataRandom();
        //    transformCoordination();
        //    drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);

        //});
        var downPosX, downPosY, upPosX, upPosY;
        $scope.stage.on("stagemousedown", function (evt) {
            downPosX = evt.stageX;
            downPosY = evt.stageY;
            //dragger.removeAllChildren();
            //points = [];
            //initializeDataRandom();
            //transformCoordination();
            //drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);
        });
        $scope.stage.on("stagemousemove", function (evt) {
            $scope.x = evt.stageX;
            $scope.y = evt.stageY;
        });
        $scope.stage.on("stagemouseup", function (evt) {
            upPosX = evt.stageX;
            upPosY = evt.stageY;

            let dX = upPosX - downPosX;
            let dY = upPosY - downPosY;

            $scope.stage.clear();
            points = [];
            //drag
            {
                //initializeData(-dX, dY);
                //transformCoordination();
                //drawAllPlots(points, chartSizeInfo.xMax - dX, chartSizeInfo.xMin - dY, chartSizeInfo.yMax + dY, chartSizeInfo.yMin + dY, chartSizeInfo.T);
                //var offset = { x: $scope.stage.x - e.stageX, y: $scope.stage.y - e.stageY };
                // modify logic because of unright  
                $scope.stage.x = evt.stageX + dX;
                $scope.stage.y = evt.stageY + dY;
                $scope.stage.update();
            }

            //zoom
            {
                // modify logic because of unright  
                //$scope.stage.x = $scope.stage.mouseX;
                //$scope.stage.y = $scope.stage.mouseY;
                //$scope.stage.regX = (downPosX + upPosX) / 2;
                //$scope.stage.regY = (downPosY + upPosY) / 2;
                //$scope.stage.scaleX = $scope.stage.scaleX * 1.20;
                //$scope.stage.scaleY = $scope.stage.scaleY * 1.20;
                //$scope.stage.update();
            }
         });
        $scope.stage.update();

    }

    //var drawDragSample = function()
    //{
    //    $scope.stage.mouseMoveOutside = true;

    //    var circle = new createjs.Shape();
    //    circle.graphics.beginFill("red").drawCircle(0, 0, 50);

    //    var label = new createjs.Text("drag me", "bold 14px Arial", "#FFFFFF");
    //    label.textAlign = "center";
    //    label.y = -7;

    //    var dragger = new createjs.Container();
    //    dragger.x = dragger.y = 0;
    //    dragger.addChild(circle, label);
    //    $scope.stage.addChild(dragger);

    //    dragger.on("pressmove", function (evt) {
    //        $scope.stage.clear();
    //        // currentTarget will be the container that the event listener was added to:
    //        evt.currentTarget.x = evt.stageX;
    //        evt.currentTarget.y = evt.stageY;
    //        // make sure to redraw the stage to show the change:
    //        $scope.stage.update();
    //    });

    //    $scope.stage.update();
    //}

    //#region initialize data
    var dataPoints = [];
    var initializeData = function (dX,dY) {
        var limit = chartSizeInfo.T;    //increase number of dataPoints by increasing this
        dataPoints = [];
        for (var i = 0; i < limit; i++)
        {
            dataPoints.push({
                t: 0.002 * i,
                x: i % 500 -dX,
                y: (i / 500) * 6 + 3 -dY, 
            });
        }
    }
    var initializeDataRandom = function () {
        var limit = chartSizeInfo.T;    //increase number of dataPoints by increasing this
        dataPoints = [];
        for (var i = 0; i < limit; i++) {
            dataPoints.push({
                t: 0.002 * i,
                x: Math.floor((Math.random() * 1000) + 1),
                y: Math.floor((Math.random() * 600) + 1),
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
        $scope.stage.clear();
        points = [];
        initializeDataRandom();
        transformCoordination();
        drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);

        //drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index , chartDrawInfo.appendCount);
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
        //5dragger.addChild(shape);
        shape.draw(ctx);



        //var shape = new createjs.Shape();
        //shape.graphics.beginFill("Red");
        //shape.graphics.drawCircle(points[endIndex].x, points[endIndex].y, 1);
        //$scope.stage.addChild(shape);
        //shape.draw(ctx);

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
