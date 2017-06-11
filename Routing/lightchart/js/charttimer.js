main.directive('chartTimer', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            plotdata: '='
        },
        templateUrl: '/lightchart/html/charttimer.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.plotdata.length;

            initialize();

            function initialize() {
                $timeout(function () {
                });
            }

            $scope.start = function()
            {
                $rootScope.$broadcast('start');
            }
            $scope.reset = function ()
            {
                $rootScope.$broadcast('reset');
            }
            $scope.stop = function()
            {
                $rootScope.$broadcast('stop');
            }
            $scope.stepforward = function ()
            {
                $rootScope.$broadcast('stepforward');
            }
            $scope.stepback = function ()
            {
                $rootScope.$broadcast('stepback');
            }
        }],
        link: function (scope, element, attr, tableFilterCtrl) {
        },
    };
});