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




        //createjs.Ticker.addEventListener("tick", handleTick(stage));
        //stage.update();


        //// 円を作成します
        //$scope.shape = new createjs.Shape();
        //$scope.shape.graphics.beginFill("DarkRed").drawCircle(0, 0, 100); //半径100pxの円を描画
        //$scope.shape.y = 150; // Y座標300の位置に配置
        //stage.addChild($scope.shape); // 表示リストに追加



    }

    //function handleTick() {
    //    // アニメーション
    //    $scope.shape.x += 2;
    //}
    var initializeData = function () {
        var limit = 20000;    //increase number of dataPoints by increasing this
        var y = 0;
        $scope.dataPoints = [];
        for (var i = 0; i < limit/2; i++) {
            $scope.dataPoints.push({
                x: i,
                y: i*i/1000 
            });
        }
        for (var i = limit / 2; i < limit; i++) {
            $scope.dataPoints.push({
                x: i,
                y: i * i / 100
            });
        }



        //for(var i = 0;i< $scope.dataPoints.length;i++) {
        //    var shape = new createjs.Shape();
        //    shape.graphics.beginFill("Blue");
        //    shape.graphics.drawCircle($scope.dataPoints[i].x, $scope.dataPoints[i].y, 1);
        //    stage.addChild(shape);
        //    if (i != 0)
        //    {
        //        var g = new createjs.Graphics();
        //        g.beginStroke("Red");
        //        g.moveTo($scope.dataPoints[i - 1].x, $scope.dataPoints[i - 1].y);
        //        g.lineTo($scope.dataPoints[i].x, $scope.dataPoints[i].y);
        //        var s = new createjs.Shape(g);
        //        stage.addChild(s);
        //    }
            
        //};

    }

    var index = 0;
    var handleTick = function() {
        // アニメーション
        //shape.x += 2;

        var shape = new createjs.Shape();
        shape.graphics.beginFill("Blue");
        shape.graphics.drawCircle($scope.dataPoints[index].x, $scope.dataPoints[index].y, 1);
        $scope.stage.addChild(shape);
        if (index != 0) {
            var g = new createjs.Graphics();
            g.beginStroke("Red");
            g.moveTo($scope.dataPoints[index - 1].x, $scope.dataPoints[index - 1].y);
            g.lineTo($scope.dataPoints[index].x, $scope.dataPoints[index].y);
            var s = new createjs.Shape(g);
            $scope.stage.addChild(s);
        }
        index++;

        // Stageの描画を更新します
        //stage.update();
    }
 
}]);
