document.getElementById("city").addEventListener("input", function () {
  var city = this.value;
  getWeather(city);
});

async function getWeather(city) {
  try {
    if (!city) {
      city = document.getElementById("city").value;
    }
    console.log("Şəhər adı:", city);

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          q: city,
          appid: "b19e35ea6848d879c5f4a042e0a234bc",
          units: "metric",
        },
      }
    );

    const currentTemperature = response.data.list[0].main.temp;

    document.querySelector(".weather-temp").textContent =
      Math.round(currentTemperature) + "ºC";

    const forecastData = response.data.list;
    const dailyForecast = {};

    forecastData.forEach((data) => {
      const day = new Date(data.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (!dailyForecast[day]) {
        dailyForecast[day] = {
          minTemp: data.main.temp_min,
          maxTemp: data.main.temp_max,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon,
        };
      } else {
        dailyForecast[day].minTemp = Math.min(
          dailyForecast[day].minTemp,
          data.main.temp_min
        );
        dailyForecast[day].maxTemp = Math.max(
          dailyForecast[day].maxTemp,
          data.main.temp_max
        );
      }
    });

    document.querySelector(".date-dayname").textContent =
      new Date().toLocaleDateString("en-US", { weekday: "long" });

    const date = new Date();
    const extractedDateTime = date.toDateString().slice(4, 15);
    document.querySelector(".date-day").textContent = extractedDateTime;

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const currentWeatherData = dailyForecast[today];

    if (currentWeatherData) {
      const weatherIconElement = document.querySelector(".weather-icon");
      weatherIconElement.innerHTML = getWeatherIcon(currentWeatherData.icon);

      document.querySelector(".location").textContent = response.data.city.name;
      document.querySelector(".weather-desc").textContent =
        currentWeatherData.description
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      document.querySelector(".humidity .value").textContent =
        currentWeatherData.humidity + " %";
      document.querySelector(".wind .value").textContent =
        currentWeatherData.windSpeed + " m/s";
    }

    const dayElements = document.querySelectorAll(".day-name");
    const tempElements = document.querySelectorAll(".day-temp");
    const iconElements = document.querySelectorAll(".day-icon");

    Object.keys(dailyForecast).forEach((day, index) => {
      if (dayElements[index] && tempElements[index] && iconElements[index]) {
        const data = dailyForecast[day];
        dayElements[index].textContent = day;
        tempElements[index].textContent = `${Math.round(
          data.minTemp
        )}º / ${Math.round(data.maxTemp)}º`;
        iconElements[index].innerHTML = getWeatherIcon(data.icon);
      }
    });
  } catch (error) {
    console.error("Məlumat alınarkən səhv baş verdi:", error.message);
  }
}

function getWeatherIcon(iconCode) {
  const iconBaseUrl = "https://openweathermap.org/img/wn/";
  const iconSize = "@2x.png";
  return `<img src="${iconBaseUrl}${iconCode}${iconSize}" alt="Weather Icon">`;
}

document.addEventListener("DOMContentLoaded", function () {
  getWeather();
  setInterval(getWeather, 900000);
});
