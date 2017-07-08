main.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('chart2', {
          url: '/chart2',
          templateUrl: '/html/chart2.html'
      })
      .state('chart4', {
          url: 'chart4',
          templateUrl: '/html/chart4.html'
      })
      .state('chart8', {
          url: '/chart8',
          templateUrl: '/html/chart8.html'
      })
      .state('chart3D', {
          url: '/chart3D',
          templateUrl: '/html/chart3D.html'
      })
}]);