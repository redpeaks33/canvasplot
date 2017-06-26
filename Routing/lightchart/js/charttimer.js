main.directive('chartTimer', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            plotdata: '='
        },
        templateUrl: '/lightchart/html/charttimer.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.sample = 333;// Number($scope.plotdata.length);
            $timeout(function () {
                $scope.$apply();
            });
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
            var value = { newValue: 0, oldValue: 0 }
            slider.on("slide", function (e) {
                value.oldValue = e;
            });
            slider.on("slideStart", function (e) {
                dragging = true;
                value.oldValue = e;
            });
            slider.on("slideStop", function (e) {
                value.newValue = e;
                if (dragging) {
                    $rootScope.$broadcast('setCurrentTimeToGraph', e.newValue, e.oldValue);
                }
                dragging = false;
            });
            slider.on("change", function (e) {
                //if (dragging)
                //{
                //    $rootScope.$broadcast('setCurrentTimeToGraph', e.newValue, e.oldValue);
                //}
            });

            $scope.$on('setCurrentTimeToSlider', function (e, value) {
                dragging = false;
                slider.setValue(value);
            })
        }],
        link: function (scope, element, attr, tableFilterCtrl) {
        },
    };
});