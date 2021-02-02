$(document).ready(function() {
    var userFormEl = $('#user-city');
    var submitBtn = $('#submitBtn');
    var clearBtn = $(".clear-btn");
    var searchHis = $(".userSearchHist");
    var weatherToday = $(".weatherToday");
    var fiveDayForecast = $(".weatherForecast");
    var userInput = $("#inputCity");
    var forecastTitle = $(".forecastWords");

    var APIkey = "424b27cb93fafd7914e312602e3d2a39"

    submitBtn.on("click", function(){
        var searchCity = $(userInput).val();
        console.log(searchCity);

        if($(userInput).val()) {
            $(userInput).val("");
        }

        getTodaysWeather(searchCity);

    });

   
    function getTodaysWeather(searchCity) {
        var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchCity +'&appid=' + APIkey;

        fetch(weatherUrl)
            .then(function (response) {
                if(response.ok) {
                    console.log(response);
                    searchHis.push(searchCity);
                    window.localStorage.setItem("history", JSON.stringify(searchHis));
                    makeRow(searchCity);
                    response.json().then(function (data) {
                        console.log(data);
                        makeContent(data);
                        getForecast(searchCity);
                    })
                } else {
                    console.log("error")
                }
            })
            .catch(function(error) {
                console.log("not able to connect")
            })

            
    }

    

    function makeRow(text) {
        var row = $('<article class="row history-list pl-3 pt-2">').text(text);
        searchHis.append(row);
    }

    //make the card, display it
    function makeContent(data) {

        //empties the card from previous info
        weatherToday.empty();
        //creates the city title and adds date to it
        var info = (data.name + " (" + new Date().toLocaleDateString() + ")");
        //math for converting kelvin to farenheit
        var kelvinFarenheit = Math.floor((data.main.temp -  273.15) *1.8 +32);

        //creates the card, adds the info from the data to the card
        var weatherTitle = $('<h3 class="card-title" id="city">').text(info);
        var weatherCard = $('<article class="card">');
        var wind = $('<p class="card-text">').text("Wind Speed: " + data.wind.speed + "MPH");
        var humidity = $('<p class="card-text">').text("Humidity: " + data.main.humidity + "%");
        var temperature= $('<p class="card-text">').text("Temperature: " + kelvinFarenheit +  " °F");
        var card = $('<div class="card-body">');
        var image = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        //appends it all together to add it to the html
        weatherTitle.append(image);
        card.append(weatherTitle, temperature, humidity, wind);
        weatherCard.append(card);
        weatherToday.append(weatherCard);

        
    }

    function getForecast(searchCity) {
        var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + APIkey + "&units=imperial";

        fetch(forecastUrl)
            .then(function (response) {
                if(response.ok) {
                    console.log(response);
                    response.json().then(function (data) {
                        console.log(data);
                        forecastTitle.text("5-Day Forecast:");
                        makeForecastContent(data);
                    }) 
                } else {
                    console.log("error")
                }
            })
            .catch(function(error) {
                console.log("not able to connect")
            })
    
    }

    function makeForecastContent(data) {
        fiveDayForecast.empty();
        var forecastLength = 5;
        //loops and creates only 5 days
        for(var i = 0; i < forecastLength; i++) {
            
            var forIn = i * 8 + 4;
            var forDate = new Date(data.list[forIn].dt * 1000);
            console.log(forDate);
            var forDay = forDate.getDate();
            console.log(forDay);
            var forMonth = forDate.getMonth() + 1;
            console.log(forMonth);
            var forYear = forDate.getFullYear();
            console.log(forYear);
            var dateTxt = forMonth + "/" + forDay + "/" + forYear
            console.log(dateTxt);
            
            

            var column = $('<article class="col ml-3 mb-3 bg-primary rounded forecast">');
            
            var cardT = $('<h5 class="forecast-date">').text(dateTxt);

            var newImg = $('<img>').attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"); 

            var ptemp = $('<p class="txt">').text("Temp: " + data.list[i].main.temp_max  + " °F");
            var pHum = $('<p class="txt">').text("Humidity: " + data.list[i].main.humidity + "%");

            
            column.append(cardT, newImg, ptemp, pHum);

            fiveDayForecast.append(column);
            
        }
    }



})  