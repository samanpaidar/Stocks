angular.module('stocks.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MyStokcsCtrl', ['$scope',function($scope) {
  $scope.myStokcsArray = [
    {ticker:'AAPL'},
    {ticker:'GPRO'},
    {ticker:'FB'},
    {ticker:'NFLX'},
    {ticker:'TSLA'},
    {ticker:'INTC'},
    {ticker:'MSFT'},
    {ticker:'GE'},
    {ticker:'BAC'},
    {ticker:'C'},
    {ticker:'T'}
  ];
}])

.controller('StockCtrl', ['$scope','$stateParams','stockDataService','dateService',
function($scope, $stateParams,stockDataService,dateService) {

  $scope.ticker =  $stateParams.stockTicker ;
  $scope.chartView = 4;

  console.log(dateService.currentDate());
  console.log(dateService.oneYearAgoDate());

  $scope.$on('$ionicView.afterEnter', function () {
    getPriceData();
    //getDetailsData();
  });
  $scope.chartViewFunc = function (n) {
    $scope.chartView = n;
  };
  function getPriceData() {
    var promise = stockDataService.getPriceData($scope.ticker);
    promise.then(function (data) {
      console.log(data);
      $scope.stockPriceData = data;
      if(data.chg_percent >= 0 && data !== null) {
          $scope.reactiveColor = {'background-color': '#33cd5f', 'border-color': 'rgba(255,255,255,.3)'};
        }
        else if(data.chg_percent < 0 && data !== null) {
          $scope.reactiveColor = {'background-color' : '#ef473a', 'border-color': 'rgba(0,0,0,.2)'};
        }
    });
  }
/*  function getDetailsData() {
    var promise = stockDataService.getDetailsData($scope.ticker);
    promise.then(function (data) {
      console.log(data);
      $scope.stockDetailsData = data;
    });
  }*/


}]);
