main.directive('inputFile', function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            fileread: '='
        },
        templateUrl: '/custom/lightchart/html/inputfile.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.callback = function (file) {
                $scope.file = file;
            }
        }],
        link: function (scope, element, attr, tableFilterCtrl) {
        },
    };
});