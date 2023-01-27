
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

    

    // Splits date from time from response data 
    var splitDate = (currentCityWeatherData.dt_txt).split(" ");

    // Sets current weather object with relevant data from response 
    var currentWeather = {
        cityName: cityName,
        date: splitDate[0],
        icon: currentCityWeatherData.weather[0].icon,
        temp: (currentCityWeatherData.main.temp - 273.15).toFixed(1),
        humidity: currentCityWeatherData.main.humidity,
        windspeed: currentCityWeatherData.wind.speed
    }

    // Logs new object to the console 
    console.log(currentWeather);

    // Creates a h2 with text and date, sets style and appends to parent div
    var newCurrentHeader = $('<h2>')
    newCurrentHeader.text(cityName + " (" + currentWeather.date + ")")
    newCurrentHeader.css({"width": "fit-content", "margin": "none", "display": "inline"})
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

            currentCityWeatherData = response.list[0]

            displayCurrentWeather();
        })

    });
})

