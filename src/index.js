import "./styles.css";
import WaterPourSVG from "./res/weather-pouring.svg";
import LocationSVG from "./res/map-marker-outline.svg";
import WindySVG from "./res/weather-windy.svg";
import HumiditySV from "./res/water-percent.svg";

import getSevenDayForcast from "./weather";

const inpSearchForCity = document.getElementById("search-city");
const imgWind = document.querySelector(".wind > img");
const spanWind = document.querySelector(".wind > span > span:nth-child(2)");
const imgHumidity = document.querySelector(".humidity > img");
const spanHumidity = document.querySelector(".humidity > span > span:nth-child(2)");
const imgRainChance = document.querySelector(".rain-chance > img");
const spanRainChance = document.querySelector(".rain-chance > span > span:nth-child(2)");

const imgLocationIcon = document.querySelector(".location-details > img");
const divLocationName = document.querySelector(".location-name");
const imgWeatherState = document.querySelector(".icon-and-temp > img");
const spanTemparatureC = document.querySelector(".icon-and-temp > span");
const divWeatherState = document.querySelector(".weather-state");
const divDate = document.querySelector(".date");
const divForecastCards = document.querySelector(".forecasts-cards");

function createForecastCard(forecast) {
    const btnCard = document.createElement("button");
    btnCard.setAttribute("class", "forecast-card");

    const divDay = document.createElement("div");
    divDay.setAttribute("class", "day");
    divDay.textContent = forecast.day;

    const imgWeather = document.createElement("img");
    imgWeather.src = forecast.conditionPng;

    const divTemp = document.createElement("div");
    divTemp.textContent = forecast.maxtemp_c + "℃";

    btnCard.append(divDay, imgWeather, divTemp);

    return btnCard;
}

function setAsCurrentDisplayForecast(forecastToDisplay, location) {
    divLocationName.textContent = `${location.name}, ${location.country}`;
    imgWeatherState.src = forecastToDisplay.conditionPng;

    spanTemparatureC.textContent = forecastToDisplay.maxtemp_c + "℃";

    divWeatherState.textContent = forecastToDisplay.conditionName;
    divDate.textContent = forecastToDisplay.date;

    spanWind.textContent = forecastToDisplay.maxwind_kph + "kph";
    spanHumidity.textContent = forecastToDisplay.avghumidity + "%";
    spanRainChance.textContent = forecastToDisplay.rainChance + "%";
}

window.addEventListener("load", async (event) => {
    const initialForecast = await getSevenDayForcast("auto:ip");
    loadDomRenderablesForForecast(initialForecast);
    setAsCurrentDisplayForecast(initialForecast.forecasts[0], initialForecast.location);
});

/* 
getSevenDayForcast("auto:ip")
    .then((result) => console.log(result))
    .catch(err => console.log(err)) */

function loadDomRenderablesForForecast(forecast) {
    setAsCurrentDisplayForecast(forecast.forecasts[0], forecast.location);

    while (divForecastCards.firstChild) {
        divForecastCards.firstChild.remove();
    }

    forecast.forecasts.forEach(forecastEntry => {
        const btn = createForecastCard(forecastEntry);
        btn.addEventListener("click", () => {
            // yikes
            for (let child = divForecastCards.firstChild; child; child = child.nextSibling) {
                child.classList.remove("selected");
            }

            btn.classList.add("selected");
            setAsCurrentDisplayForecast(forecastEntry, forecast.location);
        });

        divForecastCards.appendChild(btn);
    });

    divForecastCards.firstChild.classList.add("selected");
}

inpSearchForCity.addEventListener("input", async () => {
    try {
        const forecast = await getSevenDayForcast(inpSearchForCity.value);
        loadDomRenderablesForForecast(forecast);
    } catch (err) {
        // DO NOTHING and use cached 
    }
});

imgLocationIcon.src = LocationSVG;
imgWind.src = WindySVG;
imgHumidity.src = HumiditySV;
imgRainChance.src = WaterPourSVG;