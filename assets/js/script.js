// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

//Global variables
var searchedCities = [];
var city = "";
var cityName = "";
var cityLAT = "";
var cityLON = "";
var cityTemp = "";
var cityWind = "";
var cityHumidity = "";
var cityUV = "";

// API key required to pull data
var APIkey = "17bc0545ba51f0b005762c19fec32cf4"

//Function to save search history in local storage
var saveCities = function() {
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
}

// First thing first grab form input
var cityEntry = function (){
    city = $("#city-entry").val();
    loadCityData(city);
}

// API call with city variable and API key. WORKS
var loadCityData = function(city) {
    
    var CityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    
    fetch(CityURL).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                
                // Save our city name and longitude and latitude
                cityName = data.name;
                cityLAT = data.coord.lat;
                cityLON = data.coord.lon;
                
                // Save searched city to local storage
                searchedCities.push(cityName);
                saveCities();
                               
                var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLAT + "&lon=" + cityLON + "&units=imperial&exclude=minutely,hourly&appid=" + APIkey;
                
                fetch(forecastUrl).then(function(response) {
                    response.json().then(function(data) {
                    console.log(data);
                    cityTemp = data.current.temp;
                    cityWind = data.current.wind_speed;
                    cityHumidity = data.current.humidity;
                    cityUV = data.current.uvi;
                    
                    
                    })
                 })
            })
        }
    })
}


$("#searchBtn").on("click", cityEntry)