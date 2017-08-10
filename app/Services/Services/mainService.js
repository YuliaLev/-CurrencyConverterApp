var app = angular.module('myApp');

app.service('mainService', function ($http) {
    this.getAllTodayExchangeRates = function () {
        return $http.get('http://www.nbrb.by/API/ExRates/Rates?Periodicity=0')
    };
    this.getExchangeRatesStat = function (url) {
        return $http.get(url)
    }
});