angular.module('stocks.services', [])


.factory('encodeURIService', function() {
  return {
    encode: function(string) {
      console.log(string+'hej');
      return encodeURIComponent(string).replace(/\"/g, "%22").replace(/\ /g, "%20").replace(/[!'()]/g, escape);
    }
  };
})


.factory('dateService',function ( $filter ) {
  var currentDate = function () {
    var d = new Date();
    var date = $filter('date')(d,'yyyy-MM-dd');
    return date;
  };
  var oneYearAgoDate = function () {
    var d = new Date(new Date().setDate(new Date().getDate()- 365));
    var date = $filter('date')(d,'yyyy-MM-dd');
    return date;
  };
  return{
    currentDate : currentDate,
    oneYearAgoDate : oneYearAgoDate
  };
})

.factory('stockDetailsCacheService', function(CacheFactory) {

   var stockDetailsCache;

   if(!CacheFactory.get('stockDetailsCache')) {
     stockDetailsCache = CacheFactory('stockDetailsCache', {
       maxAge: 60 * 1000,
       deleteOnExpire: 'aggressive',
       storageMode: 'localStorage'
     });
   }
   else {
    stockDetailsCache = CacheFactory.get('stockDetailsCache');
   }

   return stockDetailsCache;
 })

 .factory('notesCacheService', function(CacheFactory) {

  var notesCache;

  if(!CacheFactory.get('notesCache')) {
    notesCache = CacheFactory('notesCache', {
      storageMode: 'localStorage'
    });
  }
  else {
    notesCache = CacheFactory.get('notesCache');
  }

  return notesCache;
})

.factory('fillMyStocksCacheService', function(CacheFactory) {
  var myStocksCashe;
  if(!CacheFactory.get('myStocksCache')) {
  myStocksCache = CacheFactory('myStocksCache', {
    storageMode: 'localStorage'
  });
}
else {
  myStocksCache = CacheFactory.get('myStocksCache');
}
var fillMyStocksCache = function() {

  var myStocksArray = [
    {ticker: "AAPL"},
    {ticker: "GPRO"},
    {ticker: "FB"},
    {ticker: "NFLX"},
    {ticker: "TSLA"},
    {ticker: "BRK-A"},
    {ticker: "INTC"},
    {ticker: "MSFT"},
    {ticker: "GE"},
    {ticker: "BAC"},
    {ticker: "C"},
    {ticker: "T"}
  ];

  myStocksCache.put('myStocks', myStocksArray);
};

return {
  fillMyStocksCache: fillMyStocksCache
};

})
.factory('myStocksCacheService', function(CacheFactory) {

  var myStocksCache = CacheFactory.get('myStocksCache');

  return myStocksCache;
})
.factory('myStocksArrayService', function(fillMyStocksCacheService, myStocksCacheService) {

  if(!myStocksCacheService.info('myStocks')) {
    fillMyStocksCacheService.fillMyStocksCache();
  }

  var myStocks = myStocksCacheService.get('myStocks');

  return myStocks;
})
.factory('followStockService', function(myStocksArrayService,myStocksCacheService ) {

  return {

    follow: function(ticker) {
      var stockToAdd = {"ticker": ticker};

      myStocksArrayService.push(stockToAdd);
      myStocksCacheService.put('myStocks', myStocksArrayService);

    },

    unfollow: function(ticker) {

      for (var i = 0; i < myStocksArrayService.length; i++) {
        if(myStocksArrayService[i].ticker == ticker) {

          myStocksArrayService.splice(i, 1);
          myStocksCacheService.remove('myStocks');
          myStocksCacheService.put('myStocks', myStocksArrayService);

          break;
        }
      }
    },

    checkFollowing: function(ticker) {
      for (var i = 0; i < myStocksArrayService.length; i++) {
        if(myStocksArrayService[i].ticker == ticker) {
          return true;
        }
      }

      return false;

    }
  };
})

.factory('stockDataService', function ($q, $http, encodeURIService) {

  var getPriceData = function(ticker) {

   var deferred = $q.defer(),
   url = "http://finance.yahoo.com/webservice/v1/symbols/" + ticker + "/quote?format=json&view=detail";

   $http.get(url)
     .success(function(json) {
       var jsonData = json.list.resources[0].resource.fields;
       deferred.resolve(jsonData);
     })
     .error(function(error) {
       console.log("Price data error: " + error);
       deferred.reject();
     });

   return deferred.promise;
 };

 return {
   getPriceData: getPriceData
 };
})

.factory('notesService', function(notesCacheService) {

  return {

    getNotes: function(ticker) {
      return notesCacheService.get(ticker);
    },

    addNote: function(ticker, note) {

      var stockNotes = [];

      if(notesCacheService.get(ticker)) {
        stockNotes = notesCacheService.get(ticker);
        stockNotes.push(note);
      }
      else {
        stockNotes.push(note);
      }

      notesCacheService.put(ticker, stockNotes);
    },

    deleteNote: function(ticker, index) {

      var stockNotes = [];

      stockNotes = notesCacheService.get(ticker);
      stockNotes.splice(index, 1);
      notesCacheService.put(ticker, stockNotes);
    }
  };
})

;


/*.service('modalService', function($ionicModal) {
  this.openModal = function (id) {
    var _this = this;
    if (id==1) {
      $ionicModal.fromTemplateUrl('templates/search.html', {
        scope: null,
        controller: 'searchCtrl'
      }).then(function(modal) {
        _this.modal = modal;
        _this.modal.show();
      });
    }
    else if (id==2) {
      $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
          }).then(function(modal) {
            $scope.modal = modal;
          });
    }
    else if (id==3) {
      $ionicModal.fromTemplateUrl('templates/login.html', {
             scope: $scope
           }).then(function(modal) {
             $scope.modal = modal;
           });
    }

  };
  this.closeModal = function () {
    var _this = this;
    if(!_this.modal) return;
    _this.modal.hide();
    _this.modal.remove();
  };
})*/
