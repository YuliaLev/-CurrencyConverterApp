var app = angular.module('myApp');

app.controller('mainController', function ($scope, mainService) {
    $scope.flag_greenLabelWeek = false;
    $scope.flag_greenLabelMonth = false;

     function getExchangeRates() {
        mainService.getAllTodayExchangeRates().success(function (data) {
            $scope.allTodayExchangeRatesArr = data;
            $scope.allTodayExchangeRatesArr.forEach(function (item, i) {
                if(item.Cur_ID === 299){
                    $scope.allTodayExchangeRatesArr.splice(i,1);
                }
            });
            $scope.showStat();
            $scope.allTodayExchangeRatesArr.unshift({"Cur_ID":1,"Date":"2017-06-27T00:00:00","Cur_Abbreviation":"BYN","Cur_Scale":1,"Cur_Name":"Белорусский рубль","Cur_OfficialRate":1});
            console.log('OK')
        }).error(function () {
            console.log('Error')
        });
    }

    function isNumeric(num) {
        return !isNaN(parseFloat(num)) && isFinite(num) && (num > 0);
    }

    $scope.result = function () {
        var cur_ScaleID1, cur_ScaleID2, cur_OfficialRateID1, cur_OfficialRateID2;
        if ($scope.selectedCurID1 === undefined){
            $scope.selectedCurID1 = "145";
        }
        if ($scope.selectedCurID2 === undefined){
            $scope.selectedCurID2 = "1";
        }
        if(isNumeric($scope.value)) {
            $scope.allTodayExchangeRatesArr.forEach(function (item) {
                if(item.Cur_ID === +$scope.selectedCurID1){
                    cur_OfficialRateID1 = item.Cur_OfficialRate;
                    cur_ScaleID1 = item.Cur_Scale;
                }
                if(item.Cur_ID === +$scope.selectedCurID2){
                    cur_OfficialRateID2 = item.Cur_OfficialRate;
                    cur_ScaleID2 = item.Cur_Scale;
                }
            });
            $scope.resultValue = cur_OfficialRateID1 / cur_OfficialRateID2 * (cur_ScaleID2 / cur_ScaleID1) * $scope.value;
            $scope.resultValue = Math.round($scope.resultValue*100)/100;
            return $scope.resultValue;
        }
    };

    $scope.changeCur = function () {
        var valueToChange = $scope.selectedCurID1;
        $scope.selectedCurID1 = $scope.selectedCurID2;
        $scope.selectedCurID2 = valueToChange;
    };

    function getDateFormat(date) {
        return date.getFullYear() + '-' + (+date.getMonth() + 1) +'-' + date.getDate();
    }

    $scope.getWeekAgoDate = function () {
        var weekAgoDate = new Date((new Date - 86400 * 1000 * 7));
        $scope.flag_greenLabelWeek = true;
        $scope.flag_greenLabelMonth = false;
        return getDateFormat(weekAgoDate);
    };

    $scope.getMonthAgoDate = function () {
        var monthAgoDate = new Date((new Date - 86400 * 1000 * 30));
        $scope.flag_greenLabelWeek = false;
        $scope.flag_greenLabelMonth = true;
        return getDateFormat(monthAgoDate);
    };

    $scope.showStat = function (fromDate) {
        if($scope.chart){
            updateChart();
        }
        if(fromDate===undefined){
            $scope.startDate = $scope.getWeekAgoDate();
            $scope.flag_greenLabelWeek = true;
            $scope.flag_greenLabelMonth = false;
        } else {
            $scope.startDate = fromDate;
        }
        var todayDate = new Date();
        var todayDateEnd = getDateFormat(todayDate);
        var urlStat ='http://www.nbrb.by/API/ExRates/Rates/Dynamics/' + $scope.selectedCurChart + "?startDate=" + $scope.startDate + "&endDate=" + todayDateEnd;
        $scope.curLabels =[];
        $scope.curData =[];
        if($scope.selectedCurChart) {
            $scope.allTodayExchangeRatesArr.forEach(function (item) {
                if (item.Cur_ID === +$scope.selectedCurChart) {
                    $scope.curMainLabel = item.Cur_Abbreviation;
                }
            });
        }
        mainService.getExchangeRatesStat(urlStat).success(function (data) {
            $scope.exchangeRatesStatArr = data;
            $scope.exchangeRatesStatArr.forEach(function (item) {
                var dateFormat = item.Date.slice(8,10) + "." + item.Date.slice(5,7) + "." + item.Date.slice(0,4);
                $scope.curLabels.push(dateFormat);
                $scope.curData.push(item.Cur_OfficialRate);
            });
            console.log('OK STAT');
            showChart();
        }).error(function () {
            console.log('Error STAT')
        });

    };


    function showChart() {
       $scope.chart =  new Chart(document.getElementById("line-chart"), {
            type: 'line',
            data: {
                labels: $scope.curLabels,
                datasets: [{
                    data: $scope.curData,
                    label: $scope.curMainLabel,
                    borderColor: "#00af00",
                    fill: true
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Статистика изменения курсов валют'
                }
            }
        });
    }

    function updateChart() {
        $scope.chart.data.labels = [];
        $scope.chart.data.datasets = [];
    }

    window.onload = function(){
        if ($scope.selectedCurChart=== undefined){
            $scope.selectedCurChart = "145";
        }
        getExchangeRates();
    };

});