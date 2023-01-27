
// Stores the user API Key 
var apiKey = 'e4553d760058ca77401a79ef06ac6fe8';


// Variables to store coordinates of searched city 
var coordinates = {
    long: 'x',
    lat: 'y'
};



var cityName

var currentCities = []



// stores the URL to call the 5 Day forecast API for seached city  
var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates.lat + "&lon=" + coordinates.long + "&appid=" + apiKey;





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


            // If there are more than one city with this name...

            for (i in currentCities) {
                var cityAndCode = currentCities[i].name + ", " + currentCities[i].country;
                // Create an array with all cities and their country code 
                availableTags.push(cityAndCode)

                
            }

            $('#search-input').autocomplete({
                source: availableTags
            });

            $('.ui-menu-item').css({"border": "1px solid black", "padding": "20px"})

            coordinates.long = response.lon;
            coordinates.lat = response.lat;




        })

    }


});


$('#search-button').on("click", function () {

    // stores searched city name to a variable 
    cityName = $('#search-input').val();
})

