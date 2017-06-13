main.directive('chartTimer', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            plotdata: '='
        },
        templateUrl: '/lightchart/html/charttimer.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.length = Number($scope.plotdata.length);
            $scope.start = function () {
                $rootScope.$broadcast('start');
            }
            $scope.reset = function () {
                $rootScope.$broadcast('reset');
            }
            $scope.stop = function () {
                $rootScope.$broadcast('stop');
            }
            $scope.stepforward = function () {
                $rootScope.$broadcast('stepforward');
            }
            $scope.stepback = function () {
                $rootScope.$broadcast('stepback');
            }

            // Without JQuery
            var slider = new Slider('#ex1', {
                formatter: function (value) {
                    return 'Current value: ' + value;
                }
            });

            var dragging = false;   
            $("#ex1").on("slideStart", function (e) {
                dragging = true;
            });
            $("#ex1").on("change", function (e) {
                if (dragging)
                {
                    $rootScope.$broadcast('setCurrentTimeToGraph', e.value.newValue);
                }
            });

            $scope.$on('setCurrentTimeToSlider',function(e,value){
                dragging = false;
                //$("#ex1").slider('setValue', 10000);
                $('#ex1').slider('setValue', value);
                
            })
        }],
        link: function (scope, element, attr, tableFilterCtrl) {
        },
    };
});