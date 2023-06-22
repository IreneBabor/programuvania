let apiKey = "3e015e851c010d0cdccdf84fc8873d05";
let apiURL =
  "https://api.openweathermap.org/data/2.5/weather?q={cityName}&appid={apiKey}&units=metric";
let currentDate = new Date();

let date = currentDate.getDate();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let dayOfWeek = days[currentDate.getDay()];
let hour = currentDate.getHours().toString().padStart(2, "0");
let minute = currentDate.getMinutes().toString().padStart(2, "0");
let current_date = `${dayOfWeek}, ${hour}:${minute}`;

document.getElementById("insert-date").textContent = current_date;

function insertCity(cityName) {
  document.getElementById("city-input1").textContent = cityName;
}

function searchCity(event) {
  event.preventDefault();
  let inputField = document.getElementById("insert-city");
  let cityName = inputField.value;
  if (cityName === "") {
    document.getElementById("city-input1").textContent = "Insert your city";
    return;
  }
  insertCity(cityName);
  axios
    .get(apiURL.replace("{cityName}", cityName).replace("{apiKey}", apiKey))
    .then((response) => {
      showTemperature(response);
      showDetails(response);
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
    });
}

function searchCurrentCity(event) {
  event.preventDefault();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      const currentLocationURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      axios
        .get(currentLocationURL)
        .then((response) => {
          const cityName = response.data.name;
          insertCity(cityName);
          showTemperature(response);
          showDetails(response);
        })
        .catch((error) => {
          console.log("Error fetching weather data:", error);
        });
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}
function showTemperature(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}&deg;C`;
}
function showDetails(response) {
  console.log(response.data);
  let details = response.data.weather[0].description;
  let detailsElement = document.querySelector("#details");
  detailsElement.textContent = details;
}

let clickMeButton = document.querySelector("#special-button");
clickMeButton.addEventListener("click", searchCity);
let currentButton = document.querySelector("#special-button-current");
currentButton.addEventListener("click", searchCurrentCity);
