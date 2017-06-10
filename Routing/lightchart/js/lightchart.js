﻿main.directive('lightChart', function () {
    return {
        restrict: 'EA',
        replace : true,
        scope: {
            title: '@',
            chartid: '@',
            width: '=',
            height: '=',
            plotdata: '='
        },
        templateUrl: '/lightchart/html/lightchart.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            var chartSizeInfo = {
                canvasSizeX: $scope.width,
                canvasSizeY: $scope.height,
                axisXPadding: 40,
                axisYPadding: 40,
                xMax: $scope.width,
                xMin: 0,
                yMax: $scope.height,
                yMin: 0,
                T: $scope.plotdata.length
            };
            var chartDrawInfo = {
                fps:2   ,
                appendCount: 512 //128,256,512,1024,2048 //slow - fast
            }
            var ctx = {};
            var ctx_back = {};
            var points = [];
            var stageImgData;
            initialize();

            function initialize() {
                $timeout(function () {
                    initializeCanvas();

                    //initializeDataRandom();
                    //transformCoordination();
                    //drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);
                    //$scope.stage.update();

                    //static
                    //drawChart();

                    //dynamic
                    //createjs.Ticker.addEventListener("tick", handleTick);
                    //createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    //createjs.Ticker.setFPS(chartDrawInfo.fps);
                });
            }
            //#region initialize canvas

            function initializeCanvas(canvasID) {
                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                $scope.stage_background = new createjs.Stage('chart_background');
                ctx_back = $scope.stage_background.canvas.getContext('2d');
                
                //drawAxis();
                //handleTick();
                //var circle = new createjs.Shape();
                //circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
                //circle.x = 100;
                //circle.y = 100;
                //$scope.stage.addChild(circle);
                //$scope.stage.update();
                
                //stageImgData = ctx.createImageData(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY);
                //$scope.stage.autoClear = false;
                //$scope.stage.clear();
                //$scope.index = 0;
                //$scope.stage.update();

                ///drawDragSample();
                

            }

            ///////////////////////////////////////////////////////////////////////////////////
            var initializeDataRandom = function () {
                var limit = chartSizeInfo.T;    //increase number of dataPoints by increasing this
                $scope.plotdata = [];
                for (var i = 0; i < limit; i++) {
                    $scope.plotdata.push({
                        t: 0.002 * i,
                        x: Math.floor((Math.random() * 250) + 1),
                        y: Math.floor((Math.random() * 150) + 1),
                    });
                }
            }
            //#region transform coordination
            function convertScaleValue(originalPoints) {
                var convertedPoints = [];
                var maxX = _.max(originalPoints, function (n) { return n.x; }).x;
                var maxY = _.max(originalPoints, function (n) { return n.y; }).y;
                _.each(originalPoints, function (n) {
                    convertedPoints.push({
                        t: n.t,
                        x: ~~(n.x * (chartSizeInfo.canvasSizeX - chartSizeInfo.axisYPadding) / maxX),
                        y: ~~(n.y * (chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding) / maxY),
                        //x: Math.floor((n.x * (chartSizeInfo.canvasSizeX - chartSizeInfo.axisYPadding) / maxX )),
                        //y: Math.floor((n.y * (chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding) / maxY )),
                    })
                });
                return convertedPoints;
            }

            function transformCoordination(originalPoints) {
                var convertedPoints = [];
                _.each(originalPoints, function (n) {
                    convertedPoints.push({
                        t: n.t,
                        x: chartSizeInfo.axisYPadding + n.x,
                        y: chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding - n.y,
                    })
                });
                return  convertedPoints;
            }
            //#endregion
            //#region draw axis
            function drawAxis() {
                drawAxisX();
                drawAxisY();
            }
            function drawAxisX() {
                var g = new createjs.Graphics();
                g.beginStroke("Black");
                g.moveTo(0, chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding);
                g.lineTo(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding);
                var s = new createjs.Shape(g);
                s.draw(ctx_back);
            }
            function drawAxisY() {
                var g = new createjs.Graphics();
                g.beginStroke("Black");
                g.moveTo(chartSizeInfo.axisYPadding, 0);
                g.lineTo(chartSizeInfo.axisYPadding, chartSizeInfo.canvasSizeY);
                var s = new createjs.Shape(g);
                s.draw(ctx_back);
            }
            //#endregion

            var drawChart = function()
            {
                drawWhiteCanvas();
                drawAxis();
                calculatePlot();
                drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);
            }

            var calculatePlot = function()
            {
                points = $scope.plotdata;
                points = convertScaleValue(points)
                points = transformCoordination(points);
            }

            var drawWhiteCanvas = function()
            {
                //create white board
                stageImgData = ctx.createImageData(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY);
                for (var i = 0; i < stageImgData.data.length ; i++) {
                    stageImgData.data[i] = 255;
                };
            }

            var handleTick = function () {
                drawWhiteCanvas();
                drawAxis();
                initializeDataRandom();
                calculatePlot();
                drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);
                //drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index , chartDrawInfo.appendCount);
            }

            ////#region draw all plots
            function drawAllPlots (points, xMax, xMin, yMax, yMin, currentTime) {
                //_.each(points, function (n, i) {
                //    if (i + 1 < currentTime) {
                //        drawPlot(points, i, i + 1);
                //    }
                //});

                //var stageCanvas = document.getElementById("canvas8");
                //ctx = stageCanvas.getContext("2d");

                //plot data
                //points = $scope.plotdata;
                _.each(points, function (n) {
                    var index = (n.x + n.y * chartSizeInfo.canvasSizeX) * 4;
                    stageImgData.data[index + 0] = 255;
                    stageImgData.data[index + 1] = 0;
                    stageImgData.data[index + 2] = 0;
                    stageImgData.data[index + 3] = 255;
                });

                ctx.putImageData(stageImgData, 0, 0)

                $scope.fps = createjs.Ticker.getMeasuredFPS();
                $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
                //$scope.$apply();
            }
            //#endregion

            //#region draw plot
            function drawPlot (points, startIndex, endIndex) {
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
            }
            //#endregion
        }],
        link: function (scope, element, attr, tableFilterCtrl) {
            //initialize();
            //function initialize() {
            //    initializeLayout(element);
            //    //add title.
            //    scope.dropdownLabel = scope.title;

            //    //in case of using title only without filter
            //    if (scope.disable) {
            //        return;
            //    }

            //    //initialize collection
            //    scope.original = tableFilterCtrl.getOriginalCollection();
            //    scope.showing = tableFilterCtrl.getShowingCollection();
            //    scope.distinctItems = createDistinctItems();

            //    //set this column state to parent filter container .
            //    updateParentFilterContainer();
            //}

            //scope.showCheckedItem = function () {
            //    updateParentFilterContainer();
            //};

            //scope.$on('updateFilterInfo', function (event, filterInfoContainer) {
            //    tableFilterCtrl.getFilterInfoContainer()[scope.predicate] = filterInfoContainer[scope.predicate]
            //});
        },
    };
});