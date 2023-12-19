"use strict";

const api_key = "8c2afaacf65df1976579f048d2fc4e25";
/** 
@param {string} URL Api url
@param {function} callback callback
*/
export const fetchData = function (URL, callback) {
  fetch(`${URL}&appid=${api_key}`)
    .then((res) => res.json())
    .then((data) => callback(data));
};

export const url = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`;
  },
  foreCast(lat, lon) {
    return `api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
  },
  airPollution(lat, lon) {
    return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}&units=metric`;
  },
  reverseGeo(lat, lon) {
    return `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`;
  },
  geo(query) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
  },
};
// https://api.openweathermap.org/data/2.5/weather?lat=6.6517883&lon=-10.5931565&appid=8c2afaacf65df1976579f048d2fc4e25
// https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=8c2afaacf65df1976579f048d2fc4e25
