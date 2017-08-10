var app = angular.module('myApp');

app.directive('showTimeDirective', function ($interval) {
    var days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    var months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    return {
        link: function (scope, elements, attrs) {
            $interval(function () {
                var date = new Date();
                var hours = date.getHours();
                if (hours < 10){
                    hours = "0" + hours;
                }
                var minutes = date.getMinutes();
                if (minutes < 10){
                    minutes = "0" + minutes;
                }
                var seconds = date.getSeconds();
                if (seconds < 10){
                    seconds = "0" + seconds;
                }
                scope.time = hours + ":" + minutes + ":" + seconds;
                scope.todayDate = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
            }, 1000);
        },
        template: "<div id='timeSection'><div class='time'>{{time}}</div><div class='todayDate'>{{todayDate}}</div></div>"
    }
});
