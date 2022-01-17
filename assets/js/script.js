// Need 5 day forcast
// Need error if city returns null

//Global variables
var city = "";
var searchedCities = [];
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

//Function to load cities from search history

var searchHistory = function() {
    searchedCities = localStorage.getItem("searchedCities")
    if (searchedCities == null) {
        searchedCities = [];
    } else {
        searchedCities = JSON.parse(searchedCities);
        for (i=0; i < searchedCities.length; i++) {
            var cityBTN = $("<div>").attr("class", "card");
            var cityTEXT = $("<button>").attr("type", "button").attr("value", searchedCities[i]).attr("class", "col-12 font-weight-bold bg-primary card-body searched-city").text(searchedCities[i])

            $("#search-history").append(cityBTN, cityTEXT)

        }
    }
}

// Function to live update city when search is clicked
var updateCity = function() {
    city = $(this).val();
    loadCityData(city);
}

// First thing first grab form input
var cityEntry = function (){
    city = $("#city-entry").val();
    if (city.length == 0) {
        alert("Must enter a city!")
        return false;
    } else {
        loadCityData(city);
    }
}

// API call with city variable and API key. WORKS
var loadCityData = function(city) {
    $("#todays-forcast").empty();
    var CityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    
    fetch(CityURL).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                // Save our city name and longitude and latitude
                cityName = data.name;
                cityLAT = data.coord.lat;
                cityLON = data.coord.lon;
                
                // Update local storage IF city has not been searched before
                var prevSearch = searchedCities.includes(cityName);
                if (!prevSearch) {
                    searchedCities.push(cityName);
                    saveCities();
                    
                    // Add our city to our search history live
                    var cityBTN = $("<div>").attr("class", "card");
                    var cityTEXT = $("<button>").attr("type", "button").attr("value", cityName).attr("class", "col-12 font-weight-bold bg-primary card-body searched-city").text(cityName)

                    $("#search-history").append(cityBTN, cityTEXT)

                }
                
                var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLAT + "&lon=" + cityLON + "&units=imperial&exclude=minutely,hourly&appid=" + APIkey;
                
                fetch(forecastUrl).then(function(response) {
                    response.json().then(function(data) {
                    
                    cityTemp = data.current.temp;
                    cityWind = data.current.wind_speed;
                    cityHumidity = data.current.humidity;
                    cityUV = data.current.uvi;
                    displayWeather();                   
                    })
                 })

                 
            })
        }
    })

    
}

// Function to display current city weather
var displayWeather = function () { 
    
    var currentDate = moment().format("dddd, MMMM Do");
    var mainDiv = $("<div>");
    var header = $("<h2>").text(cityName + " - " + currentDate);
    var temp = $("<p>").text("Temp: " + cityTemp + " F");
    var wind = $("<p>").text("Wind: " + cityWind + " MPH");
    var humidity = $("<p>").text("Humidty: " + cityHumidity + " %");
    
    // Set our UV color warnings
    var UV =  $("<p>").text("UV Index: " + cityUV);
    if (cityUV <= 4) {
        UV.attr("class", "bg-success text-white");
    } else if (cityUV <= 8) {
        UV.attr("class","bg-warning text-black");
    } else {
        UV.attr("class", "bg-danger text-white");
    }
    
    $("#todays-forcast").append(mainDiv, header, temp, wind, humidity, UV); 
          
}

// Load our search history on page load
searchHistory();

// Listener for our search button
$("#searchBtn").on("click", cityEntry)

// Listener for our history buttons being clicked
$(document).on("click", ".searched-city", updateCity)