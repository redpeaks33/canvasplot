﻿main.directive('lightChart', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            title: '@',
            chartid: '@',
            chartsubid: '@',
            backgroundid: '@',
            backgroundsubid: '@',
            width: '=',
            height: '=',
            dx: '=',
            dy: '=',
            plotdata: '=',
            plotdatasub: '='
        },
        templateUrl: '/lightchart/html/lightchart.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            var chartSizeInfo = {
                canvasSizeX: $scope.width,
                canvasSizeY: $scope.height,
                axisXPadding: $scope.dx,
                axisYPadding: $scope.dy,
                xMax: $scope.width,
                xMin: 0,
                yMax: $scope.height,
                yMin: 0,
                T: $scope.plotdata.length
            };
            var chartDrawInfo = {
                fps: 2,
                appendCount: 1024 //128,256,512,1024,2048 //slow - fast
            }
            var ctx = {};
            var ctx_back = {};
            var ctx_sub = {};
            var ctx_back_sub = {};

            var points = [];
            var stageImgData;
            $scope.index = 0;

            initialize();

            function initialize() {
                //$timeout -> Execute after html tag canvas is loaded.
                $timeout(function () {
                    initializeCanvas();

                    //static
                    drawExecuteAllPlots();

                    //dynamic
                    createjs.Ticker.addEventListener("tick", handleTick);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    //createjs.Ticker.setFPS(chartDrawInfo.fps);
                });
            }

            //#region initialize canvas
            function initializeCanvas(canvasID) {
                //context for plot main data
                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                //context for axis for main data
                $scope.stage_background = new createjs.Stage($scope.backgroundid);
                ctx_back = $scope.stage_background.canvas.getContext('2d');

                drawWhiteCanvas();
                drawAxis();
                calculatePlot();

                //Sub Contents
                drawSubContents();
            }
            //#endregion

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
                    })
                });
                return convertedPoints;
            }

            //canvas nominal (0,0) exists a most upper-left point.
            //transform nominal based on customized axis.
            function transformCoordination(originalPoints) {
                var convertedPoints = [];
                _.each(originalPoints, function (n) {
                    convertedPoints.push({
                        t: n.t,
                        x: chartSizeInfo.axisYPadding + n.x,
                        y: chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding - n.y,
                    })
                });
                return convertedPoints;
            }
            var calculatePlot = function () {
                points = $scope.plotdata;
                points = convertScaleValue(points)
                points = transformCoordination(points);
            }
            //#endregion

            //#region draw chart
            var handleTick = function () {
                if (execute) {
                    drawExecute();
                }
            }

            function drawExecute() {
                drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index, chartDrawInfo.appendCount);
            }

            function drawExecuteAllPlots() {
                $scope.index = 0;
                drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index, chartSizeInfo.T);
            }

            function drawExecuteBySlider(newValue, oldValue) {
                $scope.index = oldValue;
                drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, oldValue, newValue);
            }

            //#region draw append plots
            var drawAppendPlots = function (points, xMax, xMin, yMax, yMin, currentIndex, appendCount) {
                //step forward or step back
                $scope.index = reverse ? currentIndex - appendCount : currentIndex + appendCount

                if ($scope.index >= 0 && $scope.index <= chartSizeInfo.T) {
                    drawAllPlots(points, xMax, xMin, yMax, yMin, currentIndex, appendCount);
                }
                else {
                    $scope.index = 0;
                    drawWhiteCanvas();
                }

                //if (!changeslider) {
                $rootScope.$broadcast('setCurrentTimeToSlider', $scope.index);
                //}
            }
            //#endregion

            var px = [0, 0, 0, 0, 0, 1, 2, -1, -2];
            var py = [0, 1, 2, -1, -2, 0, 0, 0, 0];
            //var px = [0, 0, 0, 0, 0, 1, 1,1, -1,-1,-1, 2,-2];
            //var py = [0, 1, 2, -1, -2, 0,1,-1, 0,1,-1,0,0];
            //#region draw all plots
            function drawAllPlots(points, xMax, xMin, yMax, yMin, currentIndex, appendCount) {
                //plot data
                _.each(points, function (n, i) {
                    if (currentIndex <= i && i < currentIndex + appendCount) {
                        //plot + or clear + on canvas.
                        for (var p = 0; p < px.length; p++) {
                            //do not draw if value is out of canvas size 
                            if ((n.x + px[p]) < chartSizeInfo.canvasSizeX)
                            {
                                if (reverse) {
                                    clearImagePlot(stageImgData, ((n.x + px[p]) + (n.y + py[p]) * chartSizeInfo.canvasSizeX) * 4);
                                }
                                else {
                                    setImagePlot(stageImgData, ((n.x + px[p]) + (n.y + py[p]) * chartSizeInfo.canvasSizeX) * 4);
                                }
                            }

                        }
                    }
                });

                ctx.putImageData(stageImgData, 0, 0)

                $scope.fps = createjs.Ticker.getMeasuredFPS();
                $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
                $scope.$apply();
            }

           
            function setImagePlot(image, index) {
                image.data[index + 0] = 255;
                image.data[index + 1] = 0;
                image.data[index + 2] = 0;
                image.data[index + 3] = 255;
            }

            function clearImagePlot(image, index) {
                image.data[index + 0] = 255;
                image.data[index + 1] = 255;
                image.data[index + 2] = 255;
                image.data[index + 3] = 255;
            }
            //#endregion

            //#endregion

            //#region timer event
            var execute = false;
            var reverse = false;
            $scope.$on('start', function (e) {
                execute = true;
            });
            $scope.$on('reset', function (e) {
                $scope.index = 0;
                execute = false;
                drawWhiteCanvas();
            });

            $scope.$on('stop', function (e) {
                execute = false;
            });

            $scope.$on('stepforward', function (e) {
                execute = false;
                reverse = false;
                drawExecute();
            });

            $scope.$on('stepback', function (e) {
                execute = false;
                reverse = true;
                drawExecute();
            });
            //#region event
            var changeslider = false;
            $scope.$on('setCurrentTimeToGraph', function (e, newValue, oldValue) {
                changeslider = true;
                drawExecuteBySlider(newValue, oldValue);
            })
            //#endregion
            //#endregion
            //#endregion

            //#region draw axis
            function drawAxis() {
                let g = new createjs.Graphics();

                drawAxisX(g);
                drawAxisY(g);

                var s = new createjs.Shape(g);
                s.draw(ctx_back);
            }

            function drawAxisX(g) {
                let xBase = chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding;
                let span = 60;
                let axisCount = xBase / span;
                let startX = 0;
                for (let i = 0; i < axisCount; i++) {
                    if (i == 0)
                    {
                        //base axis
                        g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
                    }
                    else {
                        //sub axis
                        g.s("Gray").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness
                        startX = chartSizeInfo.axisXPadding;
                    }
                    g.mt(startX, xBase - i * span);
                    g.lt(chartSizeInfo.canvasSizeX, xBase - i * span);
                }
            }

            function drawAxisY(g) {
                let base = chartSizeInfo.axisYPadding;
                let span = 60;
                let axisCount = chartSizeInfo.canvasSizeX / span;
                let endP = 0;
                for (let i = 0; i < axisCount; i++) {
                    if (i == 0)
                    {
                        //base axis
                        g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
                        endP = chartSizeInfo.canvasSizeY;
                    }
                    else {
                        //sub axis
                        g.s("Gray").setStrokeDash([4,2], 0).setStrokeStyle(1); //color dot thickness
                        endP = chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding;
                    }
                    g.mt(base + i * span, 0);
                    g.lt(base + i * span, endP);
                }
            }
            //#endregion

            //#region draw white canvas
            var drawWhiteCanvas = function () {
                stageImgData = ctx.createImageData(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY);
                //stageImgData = ctx_sub.createImageData(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY);
            }
            //#endregion

            function drawSubContents() {
                let g = new createjs.Graphics();

                g.s("Blue").setStrokeDash([4,2], 0).setStrokeStyle(1); //color dot thickness
                g.drawCircle(chartSizeInfo.canvasSizeX / 2, chartSizeInfo.canvasSizeY/2, 200);
               

                var s = new createjs.Shape(g);
                s.draw(ctx_back);

                /////////////////////////////////////////////
                g = new createjs.Graphics();

                g.s("Green").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness
                g.drawCircle(chartSizeInfo.canvasSizeX / 2, chartSizeInfo.canvasSizeY/2 + 300, 200);

                s = new createjs.Shape(g);
                s.draw(ctx_back);
            }
        }],
    };
});