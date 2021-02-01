    var userFormEl = $('#user-city');
    var submitBtn = $('#submit');
    var clearBtn = $(".clearBtn");
    var searchHis = $(".userSearchHist");
    var weatherToday = $(".weather");
    var fiveDayForecast = $(".weather5");
    var userInput = $("#inputCity");

    var APIkeyWeather = "424b27cb93fafd7914e312602e3d2a39";

    function getWeather(cityUpdate) {
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + "Seattle" + "&appid=" + APIkeyWeather; 

        fetch(weatherURL)
            .then(function(response){
                console.log(response);
            })
    }
    getWeather();