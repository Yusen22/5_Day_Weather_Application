
// Stores the user API Key 
var apiKey = 'e4553d760058ca77401a79ef06ac6fe8';


// Variables to store coordinates of searched city 
var coordinates = {
    long: 'x',
    lat: 'y'
};


// stores searched city name to a variable 
var cityName = "london";


// stores the URL to call the 5 Day forecast API for seached city  
var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates.lat + "&lon=" + coordinates.long + "&appid=" + apiKey;


// stores the query URL for converting a city name into coordinates 
var geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;





$.ajax({
    url: geoQuery,
    method: 'get'
}).then(function (response) {
    console.log(response);
})
