
// ++ ALL VARS HERE FOR GLOBAL SCOPE ++

// Stores the user API Key 
var apiKey = 'e4553d760058ca77401a79ef06ac6fe8';



var cityName

// Variable for all individual city data under same search name
var currentCities = []

//  Object variable for relevant weather data on searched city.
var currentCityWeatherData



// Executes function on document.ready to generate buttons from historic searches on open
$(getHistory())



// Variable for previously searched city names from local data
var retrieveCities



// Function for pulling historic search terms from local storage
function getHistory() {


    // Parses lcl stoarge item with name 'cities' and sets that array to variable
    retrieveCities = JSON.parse(localStorage.getItem('cities'))
    console.log(retrieveCities)


    // If that call to LC returns null, set the variable as empty array and end function
    if (retrieveCities === null) {
        retrieveCities = []
        return


        // Otherwise, generate a button for each value inside the array, insert city name and append to history div
    } else {
        for (var j = 0; j < retrieveCities.length; j++) {

            // 
            var splitRetrieve = jQuery.uniqueSort(retrieveCities)

            var historyButton = $('<button>')
            historyButton.text(splitRetrieve[j])
            historyButton.addClass('btn btn-secondary history-button')
            historyButton.attr("type", "button")
            historyButton.css("margin", "7px 10% 7px 0px")
            $('#history').append(historyButton)
        }

    }
}



// Function to set updated history to local storage (on click of search button)
function setHistory() {


    // If getHistory() ran on .ready and returned nothing...
    if (retrieveCities == []) {


        // Set item in local storage with stringified name from search input (first entry)
        localStorage.setItem('cities', JSON.stringify(cityName))


        // Else empty history div to stop repetition of buttons...
    } else {
        $('#history').empty()


        // Push new city to pulled stored cities, and set updated list in local storage...
        retrieveCities.push(cityName)
        localStorage.setItem('cities', JSON.stringify(retrieveCities))


        // And run func again to generate updated buttons 
        getHistory();
    }
}



// Function to pull weather data for given cityName
function searchWeather() {

    // FIRST - GETS COORDINATES OF CITY NAME

    // stores the query URL for converting a city name into coordinates 
    var geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;


    // Variables to store longitude and latitude of city 
    var long
    var lat

    // AJAX call to convert city name to coordinates 
    $.ajax({
        url: geoQuery,
        method: 'get'

        // When request gets reponse...
    }).then(function (response) {


        // If no results are found for this search, alert user
        console.log(response)
        if (response.length == 0) {
            alert("This city can't be found. Try again.")
        }


        // Store lat and long coordingates from data for first search result from API
        lat = response[0].lat
        long = response[0].lon


        // SECOND - USES COORDINATES TO PULL DATA 

        // query URL for calling weather info from coordinates
        var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=" + apiKey;


        // AJAX call to retrieve data 
        $.ajax({
            url: forecastQuery,
            method: 'get'
        }).then(function (response) {
            console.log(response)


            // Sets variable to usable data from response 
            currentCityWeatherData = response.list


            // Executes two functions to display response data on page 
            displayCurrentWeather();
            displayForecast();

        })


    });
}



// Function to display weather for current day
function displayCurrentWeather() {


    // Variables targeting JSON div elements in #today section
    var todayHeader = $('#today-header')
    var todayContent = $('#today-content')


    // Ensures both divs have no children elements
    todayHeader.empty();
    todayContent.empty()

    $('#today').css("display", "block")


    // Splits date / time from response data into array
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


    // Sets vars for three <p> with different data. Appends each to div
    var tempP = $('<p>');
    tempP.text("Temp: " + currentWeather.temp + " °C");
    todayContent.append(tempP)

    var humP = $('<p>');
    humP.text("Humidity: " + currentWeather.humidity);
    todayContent.append(humP)

    var windP = $('<p>');
    windP.text("Windspeed: " + currentWeather.windspeed + " m/s");
    todayContent.append(windP)


    // Adds CSS to give section a border
    $('#today').css("border", "1px solid black")
}



function displayForecast() {

    // Vars tagetting JSON divs in #forecast div
    var forecastHeader = $('#forecast-header');
    var forecastDisplay = $('#forecast-display');


    // Ensures both divs have no children elements
    forecastDisplay.empty();
    forecastHeader.empty();


    // Sets title of forecast section and appends
    var forecastTitle = $('<h3 id="forecast-head">5-Day Forecast</h3>');
    forecastHeader.append(forecastTitle);

    // For 5 iterations...
    for (var i = 0; i < 5; i++) {

        // Update this variable with the next day each loop
        var dayIncrement = moment().add([i + 1], 'days').format("YYYY-MM-DD");
        console.log(dayIncrement);


        // Then loop over all given dates and times in API data variable...
        for (x in currentCityWeatherData) {


            // Split date from given format for comparison 
            var splitDate = (currentCityWeatherData[x].dt_txt).split(" ");

            var setDayWeather;


            // If the data date matches the current incremented day AND the data has a time of noon...
            if (splitDate[0] === dayIncrement && splitDate[1] === "12:00:00") {
                console.log("It's " + splitDate[0]);

                // Temporarily save it to a variable for that day ...
                setDayWeather = currentCityWeatherData[x];

                // And end this loop 
                break;
            }

        }



        // Sets object from the current incremented day data, taken at noon
        var setDayObject = {
            date: splitDate[0],
            icon: setDayWeather.weather[0].icon,
            temp: (setDayWeather.main.temp - 273.15).toFixed(1),
            humidity: setDayWeather.main.humidity,
            windspeed: setDayWeather.wind.speed

        }


        // Var for creating a div tag 
        var forecastCard = $('<div>')


        // Sets new div tag styles and assigns class
        forecastCard.css({ "color": "white", "background-color": "#C9D5B5", "width": "12rem" })
        forecastCard.addClass("card")


        // Creates elements with appropriate text and appends to .card div
        var dateHead = $('<h4 id="date-head">')
        dateHead.text(setDayObject.date)
        forecastCard.append(dateHead)


        var icon = $('<img>')
        // Pulls icon from API using code 
        icon.attr("src", "http://openweathermap.org/img/wn/" + setDayObject.icon + ".png")
        icon.addClass('forecast-icon')
        icon.css("margin-left", "15px")
        forecastCard.append(icon)


        var tempP = $('<p>');
        tempP.text("Temp: " + setDayObject.temp + " °C");
        forecastCard.append(tempP)


        var humP = $('<p>');
        humP.text("Humidity: " + setDayObject.humidity);
        forecastCard.append(humP)


        var windP = $('<p>');
        windP.text("Windspeed: " + setDayObject.windspeed + " m/s");
        forecastCard.append(windP)


        // Appends card to display div 
        $('#forecast-display').append(forecastCard)

    }

    // REPEATS FOR 5 ITERATIONS
}




// Event listener for generating autocomplete - everytime a key is pressed...
$("#search-input").keyup(function (event) {


    // Prevent default behaviour and set cityName as search value 
    event.preventDefault()
    cityName = $(this).val()


    // stores the query URL for converting a city name into coordinates 
    var geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;


    // AJAX call to convert city name to coordinates if typed name length exceeds 2 
    if (cityName.length >= 2) {
        $.ajax({
            url: geoQuery,
            method: 'get'
        }).then(function (response) {

            // Saves returned city results into a local array 
            currentCities = response;


            // Creates tags variable for autocomplete sourcing
            var availableTags = [];


            // For all returned results from search term...
            for (i in currentCities) {

                // create a variable with the name and country code from the data 
                var cityAndCode = currentCities[i].name + ", " + currentCities[i].country;

                // Then push that string to the tags array  
                availableTags.push(cityAndCode)


                // Remove duplicates in the tags array
                availableTags = jQuery.uniqueSort(availableTags);

            }


            // Autocomplete search from available tags array 
            $('#search-input').autocomplete({
                appendTo: ".input-group",
                source: availableTags
            });

        })

    }

});



$('#search-button').on("click", function (event) {


    // Prevent form from being submitted
    event.preventDefault()
    event.stopPropagation()

    // Stores searched city name to a variable 
    cityName = $('#search-input').val();

    // Resets search input box 
    $('#search-input').val('')


    // If nothing is entered, search London 
    if (cityName === '') {
        cityName = 'London, GB'
    }

    // Run setHistory to update local storage and history buttons...
    setHistory()

    // And run this to display forecasts for searched city 
    searchWeather()
})



// On click for history search terms on buttton
$('.history-button').on("click", function () {

    // Set cityName to the text of the clicked button 
    cityName = $(this).text();
    console.log(cityName)

    // Search weather for that text value and display on page 
    searchWeather();

})
