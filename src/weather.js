import { format } from "date-fns";

const weatherApiKey = "9fda3227bccb46ac9a2103152242504";

function getDataFromForcastDay(forcastDay) {
    const { maxtemp_c, maxwind_kph, avghumidity } = forcastDay.day;
    console.log(forcastDay.day);
    const { text: conditionName, icon: conditionPng } = forcastDay.day.condition;
    return {
        maxtemp_c, maxwind_kph, avghumidity,
        conditionName, conditionPng: "https://" + conditionPng.slice(2),
        date: format(forcastDay.date, "EEEE, MMMM dd"),
        day: format(forcastDay.date, "EEEE"),
        rainChance: forcastDay.day.daily_chance_of_rain,
        precipitationMM: forcastDay.day.totalprecip_mm
    };
}

async function getForcastFromApi(place) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${place}&days=7&aqi=no&alerts=no`, { mode: "cors" });
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(`Failed to query forecast. Error: ${response.status}.`);
    }
}

export default async function getSevenDayForcast(place) {
    const forecastFromApi = await getForcastFromApi(place);
    console.log(forecastFromApi);
    const result = { 
        location: {
            name: forecastFromApi.location.name,
            region: forecastFromApi.location.region,
            country: forecastFromApi.location.country,
            localtime: format(forecastFromApi.location.localtime, "EEEE, MMMM dd")
        },
        forecasts: new Array(forecastFromApi.forecast.forecastday.length)
    }
    
    forecastFromApi.forecast.forecastday.forEach((forecast, idx) => {
        result.forecasts[idx] = getDataFromForcastDay(forecast);
    });

    return(result);
}