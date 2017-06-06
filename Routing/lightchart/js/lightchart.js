main.directive('lightChart', function () {
    return {
        restrict: 'EA',
        //require: '^filRow',
        scope: {
            title: '@',
            id: '@',
            width: '=',
            height: '=',
            plotdata: '='
        },
        templateUrl: '/lightchart/html/lightchart.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            var chartSizeInfo = {
                canvasSizeX: 500,
                canvasSizeY: 300,
                axisXPadding: 40,
                axisYPadding: 40,
                xMax: 500,
                xMin: 0,
                yMax: 300,
                yMin: 0,
                T: 32768
            };
            var chartDrawInfo = {
                fps: 3,
                appendCount: 512 //128,256,512,1024,2048 //slow - fast
            }
            var ctx = {};
            var points = [];
            initialize();

            function initialize() {
                initializeCanvas();
                //transformCoordination();
                //drawAllPlots($scope.plotdata, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, chartSizeInfo.T);
                //$scope.stage.update();
            }
            //#region initialize canvas
            
            function initializeCanvas(canvasID) {
                $timeout(function () {
                $scope.stage = new createjs.Stage('canvas1');
                var circle = new createjs.Shape();
                circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
                circle.x = 100;
                circle.y = 100;
                $scope.stage.addChild(circle);
                $scope.stage.update();

                //ctx = $scope.stage.canvas.getContext('2d');
                //$scope.stage.autoClear = false;
                //$scope.stage.clear();
                //$scope.index = 0;
                //$scope.stage.update();

                //drawAxis()

                ///drawDragSample();
                })

            }

            //#region transform coordination
            
            function transformCoordination () {
                _.each($scope.plotdata, function (n) {
                    points.push({
                        t: n.t,
                        x: chartSizeInfo.axisYPadding + n.x,
                        y: chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding - n.y,
                    })
                });
            }
            //#endregion
            //#region draw axis
            function drawAxis() {
                drawAxisX();
                drawAxisY();
                $scope.stage.update();
            }
            function drawAxisX() {
                var g = new createjs.Graphics();
                g.beginStroke("Black");
                g.moveTo(0, chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding);
                g.lineTo(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding);
                var s = new createjs.Shape(g);
                $scope.stage.addChild(s);
            }
            function drawAxisY() {
                var g = new createjs.Graphics();
                g.beginStroke("Black");
                g.moveTo(chartSizeInfo.axisYPadding, 0);
                g.lineTo(chartSizeInfo.axisYPadding, chartSizeInfo.canvasSizeY);
                var s = new createjs.Shape(g);
                $scope.stage.addChild(s);
            }
            //#endregion
            ////#region draw all plots
            //function drawAllPlots (points, xMax, xMin, yMax, yMin, currentTime) {
            //    _.each(points, function (n, i) {
            //        if (i + 1 < currentTime) {
            //            drawPlot(points, i, i + 1);
            //        }
            //    });
            //}
            ////#endregion

            ////#region draw plot
            //function drawPlot (points, startIndex, endIndex) {
            //    var shape = new createjs.Shape();
            //    shape.graphics.beginFill("Red");
            //    shape.graphics.drawCircle(points[endIndex].x, points[endIndex].y, 1);
            //    $scope.stage.addChild(shape);
            //    //5dragger.addChild(shape);
            //    shape.draw(ctx);



            //    //var shape = new createjs.Shape();
            //    //shape.graphics.beginFill("Red");
            //    //shape.graphics.drawCircle(points[endIndex].x, points[endIndex].y, 1);
            //    //$scope.stage.addChild(shape);
            //    //shape.draw(ctx);

            //    //if (startIndex != 0) {
            //    //    var g = new createjs.Graphics();
            //    //    g.beginStroke("Blue");
            //    //    g.moveTo(points[startIndex - 1].x, points[startIndex - 1].y);
            //    //    g.lineTo(points[endIndex].x, points[endIndex].y);
            //    //    var s = new createjs.Shape(g);
            //    //    $scope.stage.addChild(s);
            //    //    s.draw(ctx);
            //    //    //g.clear();
            //    //    //$scope.stage.cache(0,0,300,300);
            //    //}
            //    //$scope.stage.clear();

            //    $scope.fps = createjs.Ticker.getMeasuredFPS();
            //    $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
            //}
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