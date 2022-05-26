//use openweather APIs to retrieve weather data

// https://api.openweathermap.org/data/2.5/weather
// https://api.openweathermap.org/data/2.5/onecall

//my API key: 8f33a44f36ec4ea835cd4cda6d71ac9c

// https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&appid=8f33a44f36ec4ea835cd4cda6d71ac9c



//working query: https://api.openweathermap.org/data/2.5/onecall?lat=28.99968&lon=-82.5163776&exclude=minutely&appid=8f33a44f36ec4ea835cd4cda6d71ac9c


// Example of API call:
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=8f33a44f36ec4ea835cd4cda6d71ac9c

//get calls returning data that you can use (use network tab)

//get it all working in one fuction and then split it out

var userFormEl = document.querySelector("#user-form");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityInputEl = document.querySelector("#city");
var cityContainerEl = document.querySelector("#repos-container");
var citySearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var location = cityInputEl.value.split(", ");

    if (location) {
        getCity(location);

        // clear old content
        cityContainerEl.textContent = "";
        cityInputEl.value = "";
    } else {
        alert("Please enter a city, state.");
    }
};

var buttonClickHandler = function(event) {
    // get the language attribute from the clicked element
    var language = event.target.getAttribute("data-language");

    if (language) {
        getFeaturedRepos(language);

        // clear old content
        cityContainerEl.textContent = "";
    }
};



var getCity = function(location) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=\"" + location[0] + "," + location[1] + "\"&appid=8f33a44f36ec4ea835cd4cda6d71ac9c";
    console.log(apiUrl)
        // make a get request to url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displayWeather(data, location);
                });
            } else {
                alert('Error: City not found.');
            }
        })
        .catch(function(error) {
            alert("Unable to connect: " + error);
        });
};

var getFeaturedRepos = function(language) {
    // format the github api url
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data.items, language);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

var displayWeather = function(data, city) {
    // check if api returned any repos
    if (city.length === 0) {
        cityContainerEl.textContent = "No city found.";
        return;
    }

    citySearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < 5; i++) {
        // format repo name
        var dayWeather = city[i].owner.login + "/" + city[i].name;

        // create a link for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        cityContainerEl.appendChild(repoEl);
    }
};

// add event listeners to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);
cityButtonsEl.addEventListener("click", buttonClickHandler);