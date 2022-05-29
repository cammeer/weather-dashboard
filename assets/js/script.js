//use openweather APIs to retrieve weather data
// https://api.openweathermap.org/data/2.5/weather
// https://api.openweathermap.org/data/2.5/onecall
//my API key: 8f33a44f36ec4ea835cd4cda6d71ac9c

var currentWeatherEl = document.querySelector("#current-weather");
var futureWeatherEl = document.querySelector("#future-weather-cards");
var cityInputEl = document.querySelector("#city-input");
var cityFormEl = document.querySelector("#input-form");
var recentSearchEl = document.querySelector("#search-buttons");
var clearSearchEl = document.querySelector("#clear-search");
var searchArrary = [];
var btn;

//function that listens for form submit
var submitForm = function(event) {
    event.preventDefault();

    var cityInput = cityInputEl.value.trim();
    var city = cityInput.toLowerCase();
    if (city) {
        getLocationArray(city);
        saveSearch(cityInput);
    } else {
        alert("Enter city to get forecast.");
    }
};
cityFormEl.addEventListener("submit", submitForm);

//create array from city that passes info to next function
var getLocationArray = function(location) {
    var geolocationApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=8f33a44f36ec4ea835cd4cda6d71ac9c";
    fetch(geolocationApi)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    getCoordinates(data);
                });
            } else {
                alert("City not found!");
            }
        })
        .catch(function(error) {
            alert("Connetion error");
        });
};

//function that gets lat/long from the array and passes info to next function
function getCoordinates(cityArray) {
    for (var i = 0; i < cityArray.length; i++); {
        var latitude = cityArray[0].lat;
        var longitude = cityArray[0].lon;
        getWeather(latitude, longitude);
    }
};

//function that fetches the API using the coordinates received and sends to functions to display info
var getWeather = function(latitude, longitude) {
    var WeatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=8f33a44f36ec4ea835cd4cda6d71ac9c";
    fetch(WeatherApi)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayCurrentWeather(data);
                    displayFutureWEather(data);
                });
            } else {
                alert("City not found!");
            }
        })
        .catch(function(error) {
            alert("Connection error");
        });
};

//display current weather information
var displayCurrentWeather = function(weatherObj) {
    currentWeatherEl.textContent = "";
    var location = cityInputEl.value.trim();
    if (!location) {
        var location = btn.getAttribute("data-search");
    }
    var date = moment().format("MMM DD, YYYY");
    var temp = weatherObj.current.temp;
    var wind = weatherObj.current.wind_speed;
    var humidity = weatherObj.current.humidity;
    var icon = weatherObj.current.weather[0].icon;
    var uvIndex = weatherObj.current.uvi;

    var dateLocationEl = document.createElement("h3");
    dateLocationEl.textContent = location + " - " + date;
    dateLocationEl.className = "location-title";
    currentWeatherEl.appendChild(dateLocationEl);
    cityInputEl.value = "";

    var iconEl = document.createElement("div");
    iconEl.innerHTML = "<img src=http://openweathermap.org/img/wn" + icon + "@2x.png>";
    currentWeatherEl.appendChild(iconEl);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + Math.floor(temp) + "°F";
    currentWeatherEl.appendChild(tempEl);

    var windEl = document.createElement("p");
    windEl.textContent = "Wind Speed: " + Math.floor(wind) + " mph";
    currentWeatherEl.appendChild(windEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    currentWeatherEl.appendChild(humidityEl);

    //get UV working

};

//function to display future weather information
var displayFutureWeather = function(weatherObj) {
    futureWeatherEl.textContent = "";
    var dailyArray = weatherObj.daily;

    for (var i = 0; i < 5; i++) {
        var temp = dailyArray[i].temp.day;
        var wind = dailyArray[i].wind_speed;
        var humidity = dailyArray[i].humidity;
        var date = moment(date).add(1, "d");
        var dateFormat = moment(date).format("ddd, MMM DD, YYYY");
        var icon = dailyArray[i].weather[0].icon;

        var divEl = document.createElement("div")
        divEl.classList = "future mx-auto justify-content-center";
        futureWeatherEl.appendChild(divEl);

        var dateEl = document.createElement("h3");
        dateEl.className = "future-title";
        dateEl.textContent = dateFormat;
        divEl.appendChild(dateEl);

        var iconEl = document.createElement("div");
        iconEl.innerHTML = "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png";
        divEl.appendChild(iconEl);

        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + Math.floor(temp) + " °F";
        divEl.appendChild(tempEl);

        var windEl = document.createElement("p");
        windEl.textContent = "Wind Speed: " + Math.floor(wind) + " mph";
        divEl.appendChild(windEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + humidity + "%";
        divEl.appendChild(humidityEl);
    }
};

//save searches to local storage

function saveSearch(city) {
    if (searchArrary.indexOf(city) !== -1) {
        return;
    }

    searchArrary.push(city);
    localStorage.setItem("city", JSON.stringify(searchArrary));
    getRecentSearch();
};

//loop through local storage array and create buttons to the page for the data
function getRecentSearch() {
    recentSearchEl.innerHTML = "";
    for (var i = searchArray.length - 1; i >= 0; i--) {
        var recentSearchBtn = document.createElement("button");
        recentSearchBtn.setAttribute("type", "button");
        recentSearchBtn.classList.add("recent-search-btn", "btn-history");
        recentSearchBtn.setAttribute("data-search", searchArray[i]);
        recentSearchBtn.textContent = searchArrary[i];
        recentSearchEl.appendChild(recentSearchBtn);
    }
};

//function to show weather when recent search button is clicked
function searchHistoryClick(event) {
    if (!e.target.matches(".btn-history")) {
        return;
    }
    btn = event.target;
    var location = btn.getAttribute("data-search");
    getLocationArray(location);
};

//call function to get locak storage on page from the start

initGetSearch();

//function to listen for click on recent search buttons
recentSearchEl.addEventListener("click", searchHistoryClick);