$(document).ready(function() {

    //variable selectors global
    var submitBtn = $('#submitBtn');
    var clearBtn = $(".clear-btn");
    var searchHis = $(".userSearchHist");
    var weatherToday = $(".weatherToday");
    var fiveDayForecast = $(".weatherForecast");
    var userInput = $("#inputCity");
    var forecastTitle = $(".forecastWords");

    if(localStorage.getItem("history") !== null) {
        var cityI = JSON.parse(localStorage.getItem("history"));
        for(i = 1; i < cityI.length; i++) {
            makeRow(cityI[i]);
        }
    }
   

 

    //API key for open weather
    var APIkey = "424b27cb93fafd7914e312602e3d2a39"

    //on click function
    submitBtn.on("click", function(event){
        event.preventDefault();
        var searchCity = $(userInput).val();
        console.log(searchCity);
        
        //clears the users window afterwards
        if($(userInput).val()) {
            $(userInput).val("");
        }
        //calls the getTodays weather function
        getTodaysWeather(searchCity);

    });

    $(".userSearchHist").on("click", "li", function () {
        getTodaysWeather($(this).text());
    })

    //clears user history and the search rows
    clearBtn.on("click", function() {
        $(".userSearchHist").empty();
        localStorage.clear();
    });


    function getTodaysWeather(searchCity) {

        //api for open weather
        var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchCity +'&appid=' + APIkey;

        //fetch the information
        fetch(weatherUrl)
            .then(function (response) {
                if(response.ok) {

                    //console.log(response);
                    searchHis.push(searchCity);
                    window.localStorage.setItem("history", JSON.stringify(searchHis));
                    
                    makeRow(searchCity);
                    response.json().then(function (data) {
                        //console.log(data);
                        //calls for the data to show make content, get forecast for five day, and UV index
                        makeContentForecast(data);
                        getForecast(searchCity);
                        getUVI(data.coord.lat, data.coord.lon);
                    })
                }
            })

            .catch(function(error) {
                console.log("not able to connect")
            })

            
    }

    //makes the users history row
    function makeRow(text) {
        console.log(searchHis);
        var row = $('<li class="row history-list pl-3 pt-2">').text(text);
        console.log(text);
        console.log($(".history-list").text());
    
        searchHis.append(row);

        
    }

    //make the card, to display todays weather
    function makeContentForecast(data) {

        //empties the card from previous info
        weatherToday.empty();
        //creates the city title and adds date to it
        var info = (data.name + " (" + new Date().toLocaleDateString() + ")");
        //math for converting kelvin to farenheit
        var kelvinFarenheit = Math.floor((data.main.temp -  273.15) *1.8 +32);

        //creates the card, adds the info from the data from the api to the card
        var weatherTitle = $('<h3 class="card-title" id="city">').text(info);
        var weatherCard = $('<article class="card border border-primary">');
        var wind = $('<p class="card-text">').text("Wind Speed: " + data.wind.speed + "MPH");
        var humidity = $('<p class="card-text">').text("Humidity: " + data.main.humidity + "%");
        var temperature= $('<p class="card-text">').text("Temperature: " + kelvinFarenheit.toFixed() +  " °F");
        var card = $('<div class="card-body">');
        var image = $("<img class='img-weather'>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


        //appends it all together to add it to the html
        weatherTitle.append(image);
        card.append(weatherTitle, temperature, humidity, wind);
        weatherCard.append(card);
        weatherToday.append(weatherCard);
    }

    //gets the five day forecast
    function getForecast(searchCity) {
        //forecast url
        var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + APIkey + "&units=imperial";

        //fetch url
        fetch(forecastUrl)
            .then(function (response) {
                if(response.ok) {
                    //console.log(response);
                    response.json().then(function (data) {
                        //console.log(data);
                        forecastTitle.text("5-Day Forecast:");
                        makeForecastContent(data);
                        
                    }) 
                } 
            })
            .catch(function(error) {
                console.log("not able to connect")
            })
    
    }

    //makes the forecast display with the content
    function makeForecastContent(data) {
        //empties prev info
        fiveDayForecast.empty();

        //length of the forecast
        var forecastLength = 5;

        //loops and creates only 5 days
        for(var i = 0; i < forecastLength; i++) {
            
            //create the dates title
            var forIn = i * 8 + 4;
            var forDate = new Date(data.list[forIn].dt * 1000);
            var forDay = forDate.getDate();
            var forMonth = forDate.getMonth() + 1;
            var forYear = forDate.getFullYear();
            var dateTxt = forMonth + "/" + forDay + "/" + forYear;
            
            
            //column with title, img, temp, humidity
            var column = $('<article class="col ml-3 mb-3 bg-primary rounded forecast">');
            
            var cardT = $('<h5 class="forecast-date">').text(dateTxt);

            var newImg = $('<img>').attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"); 
            var tempRound = data.list[i].main.temp_max
            var pt = $('<p class="txt">').text("Temp: " + tempRound.toFixed() + "°F");
            var pH = $('<p class="txt">').text("Humidity: " + data.list[i].main.humidity + "%");

            //appends info together
            column.append(cardT, newImg, pt, pH);

            //appends to html row
            fiveDayForecast.append(column);
            
        }
    }

    //function get UV Index adds badge to the index
    function getUVI(lat, lon) {
        var UVUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + APIkey;

         //fetch url
         fetch(UVUrl)
         .then(function (response) {
             if(response.ok) {
                 //console.log(response);
                 response.json().then(function (data) {
                    $('.uvIndex').empty()

                    //adds uv to body, also filters through and creates badges depending on uv index, then creates message
                    var uv = $('<p class="uvIndex">').text('UV Index: ');
                    var uvinfo = $('<span>').text(data.value);
                    var para = $('<span>').text("");
                    if(data.value < 3) {
                        uvinfo.addClass('badge badge-primary');
                    } else if (data.value < 7) {

                        uvinfo.addClass("badge badge-warning"); 
                        var p = $('<p class="subB badge badge-warning">').text("Don't Forget SubBlock");
                        para.append(p);
                      }
                      else {
                        uvinfo.addClass("badge badge-danger");
                        var p = $('<p class="subB badge badge-danger">').text("High UV Index");
                        para.appen(p);
                      }
            
                    $(".card-body").append(uv.append(uvinfo));
                    $(".card-body").append(para);
                }) 
             } 
         })
         .catch(function(error) {
             console.log("not able to connect")
         })
    }

})  