angular.module('stocks.controllers', [])

.controller('AppCtrl',['$scope', function($scope) {

  
}])

.controller('MyStokcsCtrl', ['$scope','myStocksArrayService',function($scope,myStocksArrayService) {
  $scope.myStokcsArray = myStocksArrayService;
  console.log(myStocksArrayService);
}])

.controller('StockCtrl', ['$scope','$stateParams','$window','$ionicPopup','followStockService','stockDataService','dateService','notesService',
function($scope, $stateParams,$window,$ionicPopup,followStockService,stockDataService,dateService,notesService) {

  $scope.ticker =  $stateParams.stockTicker ;
  $scope.stockNotes = [];
  $scope.chartView = 1;

//  $scope.oneYearAgoDate = dateService.oneYearAgoDate();
//  $scope.todayDate = dateService.currentDate();
  $scope.following = followStockService.checkFollowing($scope.ticker);
  console.log(dateService.currentDate());
  console.log(dateService.oneYearAgoDate());

  $scope.$on('$ionicView.afterEnter', function () {
    getPriceData();
     $scope.stockNotes = notesService.getNotes($scope.ticker);

  });
  $scope.chartViewFunc = function (n) {
    $scope.chartView = n;
  };
  $scope.toggleFollow = function() {
     if($scope.following) {
       followStockService.unfollow($scope.ticker);
       $scope.following = false;
     }
     else {
       followStockService.follow($scope.ticker);
       $scope.following = true;
     }
   };
  $scope.addNote = function() {
      $scope.note = {title: 'Note', body: '', date: $scope.todayDate, ticker: $scope.ticker};

      var note = $ionicPopup.show({
        template: '<input type="text" ng-model="note.title" id="stock-note-title"><textarea type="text" ng-model="note.body" id="stock-note-body"></textarea>',
        title: 'New Note for ' + $scope.ticker,
        scope: $scope,
        buttons: [
          {
            text: 'Cancel',
            onTap: function(e) {
              return;
            }
           },
          {
            text: '<b>Save</b>',
            type: 'button-balanced',
            onTap: function(e) {
              notesService.addNote($scope.ticker, $scope.note);
            }
          }
        ]
      });

      note.then(function(res) {
        $scope.stockNotes = notesService.getNotes($scope.ticker);
      });
    };

    $scope.openNote = function(index, title, body) {
    $scope.note = {title: title, body: body, date: $scope.todayDate, ticker: $scope.ticker};

    var note = $ionicPopup.show({
      template: '<input type="text" ng-model="note.title" id="stock-note-title"><textarea type="text" ng-model="note.body" id="stock-note-body"></textarea>',
      title: $scope.note.title,
      scope: $scope,
      buttons: [
        {
          text: 'Delete',
          type: 'button-assertive button-small',
          onTap: function(e) {
            notesService.deleteNote($scope.ticker, index);
          }
        },
        {
          text: 'Cancel',
          type: 'button-small',
          onTap: function(e) {
            return;
          }
         },
        {
          text: '<b>Save</b>',
          type: 'button-balanced button-small',
          onTap: function(e) {
            notesService.deleteNote($scope.ticker, index);
            notesService.addNote($scope.ticker, $scope.note);
          }
        }
      ]
    });

    note.then(function(res) {
      $scope.stockNotes = notesService.getNotes($scope.ticker);
    });
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

}])
;
