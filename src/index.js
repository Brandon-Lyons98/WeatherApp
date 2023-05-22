const form = document.querySelector('form');
const submitBtn = document.getElementById('submit-btn');
const error = document.querySelector('.error');
submitBtn.addEventListener('click', handleSubmit);
const tempSelect = document.getElementById('temp-select');
const temperature = document.getElementById('temperature');
tempSelect.addEventListener('click', () => {
  if (tempSelect.checked) {
    temperature.textContent = 'Celsius';
  } else {
    temperature.textContent = 'Farrenheit';
  }
});

function handleSubmit(e) {
  e.preventDefault();
  fetchWeather();
}

async function getWeather(location) {
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=bfa176006194473f990163526230405&q=${location}`, {mode: 'cors'});
  if (response.status === 400) {
    error.style.display = 'block';
  } else {
    error.style.display = 'none';
    const weatherData = await response.json();
    console.log(weatherData);
    const newData = processData(weatherData);
    displayData(newData);
    reset();
  }
}

function processData(weatherData) {
  const locationWeather = {
    condition: weatherData.current.condition.text,
    feelsLike: {
      f: weatherData.current.feelslike_f,
      c: weatherData.current.feelslike_c
    },
    temp: {
      f: weatherData.current.temp_f,
      c: weatherData.current.temp_c,
    },
    humidity: weatherData.current.humidity,
    uv: weatherData.current.uv,
    windDir: weatherData.current.wind_dir,
    windSpeed: {
      kph: weatherData.current.wind_kph,
      mph: weatherData.current.wind_mph,
    },
    location: `${weatherData.location.name.toUpperCase()}, ${weatherData.location.region.toUpperCase()} - ${weatherData.location.country.toUpperCase()}`,
  };
  return locationWeather;
}

function displayData(newData) {
  document.querySelector('.condition').textContent = `Weather condition: ${newData.condition}`;
  document.querySelector('.city-name').textContent = newData.location;
  if (tempSelect.checked) {
    document.querySelector('.degrees').textContent = `Current temperature: ${newData.temp.c} Celsius`;
    document.querySelector('.feels-like').textContent = `Feels like: ${newData.feelsLike.c} Celsius`;
    document.querySelector('.wind-speed').textContent = `Wind speed: ${newData.windSpeed.kph} kph`;
  } else {
    document.querySelector('.degrees').textContent = `Current temperature: ${newData.temp.f} Fahrenheit`;
    document.querySelector('.feels-like').textContent = `Feels like: ${newData.feelsLike.f} Fahrenheit`;
    document.querySelector('.wind-speed').textContent = `Wind speed: ${newData.windSpeed.mph} mph`;
  }
  document.querySelector('.wind-direction').textContent = `Wind direction: ${newData.windDir}`;
  document.querySelector('.humidity').textContent = `${newData.humidity}% humidity`;
}

function reset() {
  form.reset();
}

function fetchWeather() {
  const input = document.getElementById('city');
  const userLocation = input.value;
  getWeather(userLocation);
}