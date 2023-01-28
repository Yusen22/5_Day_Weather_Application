
// Stores the user API Key 
var apiKey = 'e4553d760058ca77401a79ef06ac6fe8';


// Variables to store coordinates of searched city 




var cityName

var currentCities = []

var currentCityWeatherData


// stores the URL to call the 5 Day forecast API for seached city  


function displayCurrentWeather() {



    var todayHeader = $('#today-header')
    var todayContent = $('#today-content')

    todayHeader.empty();
    todayContent.empty()



    // Splits date from time from response data 
    var splitDate = (currentCityWeatherData[0].dt_txt).split(" ");

    // Sets current weather object with relevant data from response 
    var currentWeather = {
        cityName: cityName,
        date: splitDate[0],
        icon: currentCityWeatherData[0].weather[0].icon,
        temp: (currentCityWeatherData[0].main.temp - 273.15).toFixed(1),
        humidity: currentCityWeatherData[0].main.humidity,
        windspeed: currentCityWeatherData[0].wind.speed
    }

    // Logs new object to the console 
    console.log(currentWeather);

    // Creates a h2 with text and date, sets style and appends to parent div
    var newCurrentHeader = $('<h2>')
    newCurrentHeader.text(cityName + " (" + currentWeather.date + ")")
    newCurrentHeader.css({ "width": "fit-content", "margin": "none", "display": "inline" })
    todayHeader.append(newCurrentHeader)

    // Adds image with icon of current weather and appends to header div 
    var icon = $('<img>')
    icon.attr("src", "http://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png")
    icon.css("margin-left", "15px")
    todayHeader.append(icon)

    var tempP = $('<p>');
    tempP.text("Temp: " + currentWeather.temp + " °C");
    todayContent.append(tempP)

    var humP = $('<p>');
    humP.text("Humidity: " + currentWeather.humidity);
    todayContent.append(humP)

    var windP = $('<p>');
    windP.text("Windspeed: " + currentWeather.windspeed + " m/s");
    todayContent.append(windP)


    $('#today').css("border", "1px solid black")
}

function displayForecast() {

    var forecast = $('#forecast')

    forecast.empty()

    var forecastHead = $('<h3 id="forecast-head">5-Day Forecast</h3>')
    forecast.append(forecastHead)

    var forecastCard = $('<div>')



    for (var i = 0; i < 5; i++) {

        var dayIncrement = moment().add([i + 1], 'days').format("YYYY-MM-DD")
        console.log(dayIncrement)

        for (x in currentCityWeatherData) {

            var splitDate = (currentCityWeatherData[x].dt_txt).split(" ")

            var setDayWeather

            if (splitDate[0] === dayIncrement) {
                console.log("It's " + splitDate[0])
                setDayWeather = currentCityWeatherData[x]

                break
            }

        }

        console.log(setDayWeather)

        var setDayObject = {
            date: splitDate[0],
            icon: setDayWeather.weather.icon,
            temp: (setDayWeather.main.temp - 273.15).toFixed(1),
            humidity: setDayWeather.main.humidity,
            windspeed: setDayWeather.wind.speed

        }

        forecastCard.css({ "color": "white", "background-color": "obsidian" , "width": "18rem" })
        forecastCard.addClass("card")

        var dateHead = $('<h4 id="date-head">')
        dateHead.text(setDayObject.date)
        forecastCard.append(dateHead)

        // var icon = $('<img>')
        // icon.attr("src", "http://openweathermap.org/img/wn/" + setDayObject.icon + ".png")
        // icon.css("margin-left", "15px")
        // forecastCard.append(icon)

        var tempP = $('<p>');
        tempP.text("Temp: " + setDayObject.temp + " °C");
        forecastCard.append(tempP)

        var humP = $('<p>');
        humP.text("Humidity: " + setDayObject.humidity);
        forecastCard.append(humP)

        var windP = $('<p>');
        windP.text("Windspeed: " + setDayObject.windspeed + " m/s");
        forecastCard.append(windP)

        $('#forecast-display').append(forecastCard)

    }

}


$("#search-input").keyup(function (event) {

    event.preventDefault()
    cityName = $(this).val()

    // stores the query URL for converting a city name into coordinates 
    var geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;

    // AJAX call to convert city name to coordinates 
    if (cityName.length >= 3) {
        $.ajax({
            url: geoQuery,
            method: 'get'
        }).then(function (response) {

            // Saves current city object into a local array 
            currentCities = response;
            var availableTags = [];


            for (i in currentCities) {
                var cityAndCode = currentCities[i].name + ", " + currentCities[i].country;

                // Create an array with all cities and their country code 
                availableTags.push(cityAndCode)

                availableTags = jQuery.uniqueSort(availableTags);


            }

            $('#search-input').autocomplete({
                appendTo: ".input-group",
                source: availableTags
            });

        })

    }

});



$('#search-button').on("click", function (event) {

    // Prevents form from being submitted
    event.preventDefault()



    // stores searched city name to a variable 
    cityName = $('#search-input').val();
    if (cityName === '') {
        cityName = 'London, GB'
    }

    // stores the query URL for converting a city name into coordinates 
    var geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;

    var long
    var lat

    // AJAX call to convert city name to coordinates 
    $.ajax({
        url: geoQuery,
        method: 'get'
    }).then(function (response) {

        // Validates the presence of a result 
        console.log(response)
        if (response.length == 0) {
            alert("This city can't be found. Try again.")
        }


        lat = response[0].lat
        long = response[0].lon

        var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=" + apiKey;

        $.ajax({
            url: forecastQuery,
            method: 'get'
        }).then(function (response) {
            console.log(response)

            currentCityWeatherData = response.list

            displayCurrentWeather();
            displayForecast();
        })

    });
})

