main.directive('lightChart', function () {
    return {
        restrict: 'EA',
        replace : true,
        scope: {
            title: '@',
            chartid: '@',
            backgroundid: '@',
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
                appendCount: 4096 //128,256,512,1024,2048 //slow - fast
            }
            var ctx = {};
            var ctx_back = {};
            var points = [];
            var stageImgData;
            initialize();
            $scope.index = 0;
            function initialize() {
                
                $timeout(function () {
                    initializeCanvas();
                    
                     //static
                    //drawChart();

                    //dynamic
                    createjs.Ticker.addEventListener("tick", handleTick);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    //createjs.Ticker.setFPS(chartDrawInfo.fps);
                });
            }

            //#region initialize canvas
            function initializeCanvas(canvasID) {
                initializeDataRandom();

                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                $scope.stage_background = new createjs.Stage($scope.backgroundid);
                ctx_back = $scope.stage_background.canvas.getContext('2d');

                drawWhiteCanvas();

                //var element = document.getElementById('chart_background');

                var element = document.getElementById($scope.backgroundid);
                //var element = document.getElementById($scope.chartid);
                element.addEventListener("mouseup", function (evt) {
                    alert("the canvas was clicked at " + evt.pageX + "," + evt.pageY);
                });
                element.addEventListener("mousedown", function (evt) {
                    var imgData = ctx.getImageData(0, 0, chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY);
                    ctx.scale(3, 3);
                    ctx.putImageData(imgData, 100, 190);
                    //alert("the canvas was clicked at " + evt.pageX + "," + evt.pageY);
                });
            }

            var initializeDataRandom = function () {
                var limit = chartSizeInfo.T;    //increase number of dataPoints by increasing this
                $scope.plotdata = [];
                for (var i = 0; i < limit; i++) {
                    $scope.plotdata.push({
                        t: 0.002 * i,
                        x: Math.floor((Math.random() * 250) + 1),
                        y: Math.floor((Math.random() * 150) + 1),
                    //    x: Math.random() * (Math.floor((Math.random() * 2) + 1) % 2 == 0 ? -1 : 1),//Math.floor((Math.random() * 250) + 1),
                    //    y: Math.random() * (Math.floor((Math.random() * 2) + 1) % 2 == 0 ? -1 : 1),//Math.floor((Math.random() * 150) + 1),
                    });
                }
            }
            //#endregion

            //#region transform coordination
            function convertScaleValue(originalPoints) {
                var convertedPoints = [];
                var maxX = _.max(originalPoints, function (n) { return n.x; }).x;
                var maxY = _.max(originalPoints, function (n) { return n.y; }).y;
                //maxX = (maxX + 2) * 1000;
                //maxY = (maxY + 2) * 1000;
                _.each(originalPoints, function (n) {
                    //n.x = (n.x + 2) * 1000;
                    //n.y = (n.y + 2) * 1000;
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

            //#region draw chart 
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
                ctx.putImageData(stageImgData, 0, 0)
            }


            var handleTick = function () {
                if (execute) {
                    drawExecute();
                }
            }

            function drawExecute() {
                
                drawAxis();
                //initializeDataRandom();
                calculatePlot();
                //drawAllPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);
                drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index, chartDrawInfo.appendCount);
            }

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

            //#region draw append plots
            var drawAppendPlots = function (points, xMax, xMin, yMax, yMin, currentTime, appendCount) {
                //step forward or step back
                $scope.index = reverse ? $scope.index - appendCount : $scope.index + appendCount

                if ($scope.index >= 0 && $scope.index < chartSizeInfo.T) {
                    drawAllPlots(points, xMax, xMin, yMax, yMin, $scope.index);
                }
                else {
                    $scope.index = 0;
                    drawWhiteCanvas();
                }

                //if ($scope.index > chartSizeInfo.T) {
                //    initializeCanvas();
                //}
            }
            //#endregion
            var px = [0, 0, 0, 0, 0, 1, 2, -1, -2];
            var py = [0, 1, 2, -1, -2, 0, 0, 0, 0];
            //#region draw all plots
            function drawAllPlots(points, xMax, xMin, yMax, yMin, currentTime) {
                //plot data
                _.each(points, function (n, i) {

                    for (var p = 0; p< px.length; p++)
                    {
                        if (i <= currentTime) {
                            setImageData(stageImgData, ((n.x + px[p]) + (n.y + py[p]) * chartSizeInfo.canvasSizeX) * 4);
                        }
                    }
                });

                ctx.putImageData(stageImgData, 0, 0)

                $scope.fps = createjs.Ticker.getMeasuredFPS();
                $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
                $scope.$apply();
            }
            function setImageData(stageImgData,index) {
                stageImgData.data[index + 0] = 255;
                stageImgData.data[index + 1] = 0;
                stageImgData.data[index + 2] = 0;
                stageImgData.data[index + 3] = 255;
            }
            //#endregion
            //#endregion

            //#region event

            var execute = false;
            var reverse = false;
            $scope.$on('start',function(e){
                execute = true;
            });
            $scope.$on('reset', function (e) {
                $scope.index = 0;
                execute = false;
                drawExecute();
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
            //#endregion
            //#endregion
        }],
        link: function (scope, element, attr, tableFilterCtrl) {
        },
    };
});