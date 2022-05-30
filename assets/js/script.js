//use openweather APIs to retrieve weather data
// https://api.openweathermap.org/data/2.5/weather
// https://api.openweathermap.org/data/2.5/onecall
//my API key: 8f33a44f36ec4ea835cd4cda6d71ac9c
//get UV working


var currentWeatherEl = document.querySelector("#current-weather");
var fivedayWeatherEl = document.querySelector("#fiveday-weather-cards");
var cityInputEl = document.querySelector("#city-input");
var cityFormEl = document.querySelector("#input-form");
var pastSearchEl = document.querySelector("#search-buttons");
var searchArray = [];
var btn;
// var city;
// var coord;


//submit button eventlistener
var submitForm = function(event) {
    event.preventDefault();

    var cityInput = cityInputEl.value.trim();
    var city = cityInput.toLowerCase();
    if (city) {
        getLocationArray(city);
        saveSearch(cityInput);
    } else {
        alert("Enter a city name.");
    }
};
cityFormEl.addEventListener("submit", submitForm);

//function to get geoloc coordinates
var getLocationArray = function(location) {
    var geolocationApi =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        location +
        "&limit=1&appid=be7c6540adf0957dc646903e1ce56c09";
    fetch(geolocationApi)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    getCoordinates(data);
                });
            } else {
                alert("City not found");
            }
        })
};

//get lat/long from array
function getCoordinates(cityArray) {
    for (var i = 0; i < cityArray.length; i++); {
        var latitude = cityArray[0].lat;
        var longitude = cityArray[0].lon;
        getWeather(latitude, longitude);
    }
}

//fetch from onecall
var getWeather = function(latitude, longitude) {
    var weatherApi =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&exclude=minutely,hourly,alerts&units=imperial&appid=be7c6540adf0957dc646903e1ce56c09";
    fetch(weatherApi)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayCurrentWeather(data);
                    displayFivedayWeather(data);
                });
            } else {
                alert("City not found");
            }
        })
};


//display today's weather
var displayCurrentWeather = function(weatherObj) {
    currentWeatherEl.textContent = "";
    var location = cityInputEl.value.trim();
    if (!location) {
        var location = btn.getAttribute("data-search");
    }
    var date = moment().format("MMMM Do YYYY, h:mm:ss a");
    var temp = weatherObj.current.temp;
    var wind = weatherObj.current.wind_speed;
    var humidity = weatherObj.current.humidity;
    var icon = weatherObj.current.weather[0].icon;

    var dateLocationEl = document.createElement("h3");
    dateLocationEl.textContent = location + " - " + date;
    dateLocationEl.className = "location-title";
    currentWeatherEl.appendChild(dateLocationEl);
    cityInputEl.value = "";

    var iconEl = document.createElement("div");
    iconEl.innerHTML =
        "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>";
    currentWeatherEl.appendChild(iconEl);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + Math.floor(temp) + "°F";
    currentWeatherEl.appendChild(tempEl);

    var windEl = document.createElement("p");
    windEl.textContent = "Wind Speed: " + Math.floor(wind) + " MPH";
    currentWeatherEl.appendChild(windEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    currentWeatherEl.appendChild(humidityEl);

    //get UV working
};

//5-day forecast data
var displayFivedayWeather = function(weatherObj) {
    fivedayWeatherEl.textContent = "";
    var dailyArray = weatherObj.daily;
    for (var i = 0; i < 5; i++) {
        var temp = dailyArray[i].temp.day;
        var wind = dailyArray[i].wind_speed;
        var humidity = dailyArray[i].humidity;
        var date = moment(date).add(1, "d");
        var dateFormat = moment(date).format("ddd, MMM DD, YYYY");
        var icon = dailyArray[i].weather[0].icon;

        var divEl = document.createElement("div");
        divEl.classList = "fiveday mx-auto justify-content-left";
        fivedayWeatherEl.appendChild(divEl);

        var dateEl = document.createElement("h3");
        dateEl.className = "fiveday-title";
        dateEl.textContent = dateFormat;
        divEl.appendChild(dateEl);

        var iconEl = document.createElement("div");
        iconEl.innerHTML =
            "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>";
        divEl.appendChild(iconEl);

        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + Math.floor(temp) + " °F";
        divEl.appendChild(tempEl);

        var windEl = document.createElement("p");
        windEl.textContent = "Wind Speed: " + Math.floor(wind) + " MPH";
        divEl.appendChild(windEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + humidity + "%";
        divEl.appendChild(humidityEl);
    }
};

//local storage
function saveSearch(city) {
    if (searchArray.indexOf(city) !== -1) {
        return;
    }
    searchArray.push(city);
    localStorage.setItem("city", JSON.stringify(searchArray));
    getPastSearch();
}

//retrieve from local storage
function initGetSearch() {
    var search = localStorage.getItem("city");
    if (search) {
        searchArray = JSON.parse(search);
    }
    getPastSearch();
}

// past search buttons
function getPastSearch() {
    pastSearchEl.innerHTML = "";
    for (var i = searchArray.length - 1; i >= 0; i--) {
        var pastSearchBtn = document.createElement("button");
        pastSearchBtn.setAttribute("type", "button");
        pastSearchBtn.classList.add("past-btn", "btn-history");
        pastSearchBtn.setAttribute("data-search", searchArray[i]);
        pastSearchBtn.textContent = searchArray[i];
        pastSearchEl.appendChild(pastSearchBtn);
    }
}

// past searches
function searchHistoryClick(event) {
    if (!event.target.matches(".btn-history")) {
        return;
    }
    btn = event.target;
    var location = btn.getAttribute("data-search");
    getLocationArray(location);
}

//past search listener
pastSearchEl.addEventListener("click", searchHistoryClick);