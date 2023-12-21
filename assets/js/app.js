"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";
import { searchedLocation } from "./route.js";
const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};
// ---toggle search in mobile---
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);
// ---searching---
const searchFeild = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");
let searchTimeOut = null;
const searchTimeOutDuration = 500;
searchFeild.addEventListener("input", function () {
  searchTimeOut ?? clearTimeout(searchTimeOut);

  if (!searchFeild.value) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchFeild.classList.remove("searching");
  } else {
    searchFeild.classList.add("searching");
  }
  if (searchFeild.value) {
    searchTimeOut = setTimeout(() => {
      fetchData(url.geo(searchFeild.value), function (location) {
        searchFeild.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = ` <ul class="view-list" data-search-list></ul>`;
        const items = [];
        for (const { name, lat, lon, country, state } of location) {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view-item");
          searchItem.innerHTML = `  <i class="fa fa-map-marker" aria-hidden="true"></i>
                <div>
                  <p class="item-title">${name}</p>
                  <p class="label-2 item-subtitle">${state || ""},${country}</p>
                </div>
                <a href="#/weather/lat=${lat}&lon=${lon}"  class="item-link has-state" aria-label=${name} data-search-toggler></a>`;
          searchResult
            .querySelector("[data-search-list]")
            .appendChild(searchItem);
          items.push(searchItem.querySelector("[data-search-toggler ]"));
        }
        addEventOnElements(items, "click", function () {
          toggleSearch();
          searchResult.classList.remove("active");
          const ss = String(items[0].hash).slice(10);
          searchedLocation(ss);
        });
      });
    }, searchTimeOutDuration);
  }
});

// ---dtaloading---
const contianer = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const error404Content = document.querySelector("[data-error-content]");
const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);
export const updateWeather = function (lat, lon) {
  console.log("ok");
  // loading.style.display = "grid";
  contianer.style.overflowY = "hidden";
  contianer.classList.remove("fade-in");
  error404Content.style.display = " none";
  const currentWeatherSection = document.querySelector(
    "[data-current-weather]"
  );
  const highlighSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const foreCastSection = document.querySelector("[data-5-day-forecast]");
  currentWeatherSection.innerHTML = "";
  highlighSection.innerHTML = "";
  hourlySection.innerHTML = "";
  foreCastSection.innerHTML = "";
  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

  // ---get data weather ---
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    console.log(currentWeather);
    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;
    const [{ description, icon }] = weather;
    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");
    card.innerHTML = `<h2 class="title-2 card-title">Now</h2>
              <div class="weapper">
                <p class="heading">${parseInt(temp)}℃</p>
                <img
                  src="./assets/icons/${icon}.svg "
                  alt="${description}"
                  width="84"
                  height="84"
                  class="weather-icon svg-icon-sun-first"
                />
              </div>
              <p class="body-3">${description}</p>
              <ul class="meta-list">
                <li class="meta-item">
                  <i class="fa fa-calendar" aria-hidden="true"></i>

                  <p class="title-3 meta-text">${module.getDate(
                    dateUnix,
                    timezone
                  )}</p>
                </li>
                <li class="meta-item">
                  <i class="fa fa-map-marker" aria-hidden="true"></i>

                  <p class="title-3 meta-text" data-location></p>
                </li>
              </ul>`;
    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector("[data-location]").innerHTML = `${name} , ${country}`;
    });
    currentWeatherSection.appendChild(card);
    // ---airPollution---
    fetchData(url.airPollution(lat, lon), function (airPollution) {
      console.log(airPollution);
      const [
        {
          main: { aqi },
          components: { no2, o3, so2, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");
      card.innerHTML = `         <h2 class="title-2" id="highlights-label">Todays Highlights</h2>
              <div class="highlights-list">
                <div class="card card-sm highlights-card one">
                  <h3 class="title-3">Air Quality Index</h3>
                  <div class="wrapper">
                    <img
                      class="svg svg-icon-wind-speed"
                      src="./assets/icons/wind-speed.svg"
                      alt=""
                    />
                    <ul class="card-list">
                      <li class="card-item">
                        <p class="title-1">${pm2_5.toPrecision(3)}</p>
                        <p class="label-1">PM <sub>2.5</sub></p>
                      </li>
                      <li class="card-item">
                        <p class="title-1">${so2.toPrecision(3)}</p>
                        <p class="label-1">SO<sub>2</sub></p>
                      </li>
                      <li class="card-item">
                        <p class="title-1">${no2.toPrecision(3)}</p>
                        <p class="label-1">NO <sub>2</sub></p>
                      </li>
                      <li class="card-item">
                        <p class="title-1">${o3.toPrecision(3)}</p>
                        <p class="label-1">O <sub>3</sub></p>
                      </li>
                    </ul>
                  </div>
                  <span class="badge aqi-${aqi} label-${aqi}" title="${
        module.apiText[aqi].message
      }"
                    >${module.apiText[aqi].level}</span
                  >
                </div>
                <div class="card card-sm highlights-card two">
                  <h3 class="title-3">Sunrise & Sunset</h3>
                  <div class="card-list">
                    <div class="card-item" style="display:flex ">
                      <img
                        class="svg svg-icon-sun"
                        src="./assets/icons/sunrise.svg"
                        alt=""
                      />
                      <div>
                        <p class="label-1">Sunrise</p>
                        <p class="title-1">${module.getTime(
                          sunriseUnixUTC,
                          timezone
                        )}</p>
                      </div>
                    </div>
                    <div class="card-item">
                      <img
                        class="svg svg-icon-sunset"
                        src="./assets/icons/sunset.svg"
                        alt=""
                      />
                      <div>
                        <p class="label-1">Sunset</p>
                        <p class="title-1">${module.getTime(
                          sunsetUnixUTC,
                          timezone
                        )}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card card-sm highlights-card">
                  <h3 class="title-3">Humidity</h3>
                  <div class="wrapper">
                    <img
                      class="svg svg-icon-humidity"
                      src="./assets/icons/humidity.svg"
                      alt=""
                    />

                    <p class="title-1">${humidity}<sub>%</sub></p>
                  </div>
                </div>
                <div class="card card-sm highlights-card">
                  <h3 class="title-3">Pressure</h3>
                  <div class="wrapper">
                    <img
                      class="svg svg-icon-pressure"
                      src="./assets/icons/03d.svg"
                      alt=""
                    />

                    <p class="title-1">${pressure}<sub>hPa</sub></p>
                  </div>
                </div>
                <div class="card card-sm highlights-card">
                  <h3 class="title-3">Visibility</h3>
                  <div class="wrapper">
                    <img
                      class="svg svg-icon-visibility"
                      src="./assets/icons/visibility.svg"
                      alt=""
                    />
                    <p class="title-1">${visibility / 1000}<sub>KM</sub></p>
                  </div>
                </div>
                <div class="card card-sm highlights-card">
                  <h3 class="title-3">Feels Like</h3>
                  <div class="wrapper">
                    <img
                      class="svg svg-icon-visibility"
                      src="./assets/icons/pressure.svg"
                      alt=""
                    />
                    <p class="title-1">${parseInt(feels_like)}℃</p>
                  </div>
                </div>
              </div>`;
      highlighSection.appendChild(card);
    });
    // ---24h forecast ---
    fetchData(url.foreCast(lat, lon), function (foreCast) {
      console.log(foreCast);
      const {
        list: forecastList,
        city: { timezone },
      } = foreCast;
      hourlySection.innerHTML = ` <h2 class="title-2 label-ss">Today at</h2>
            <div class="slider-container">
              <ul class="slider-list" data-temp>
          
              
              </ul>
              <ul class="slider-list" data-wind>
             
              </ul>
            </div>`;
      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;
        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;
        const [{ icon, description }] = weather;
        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");
        tempLi.innerHTML = ` <div class="card card-sm slider-card">
                    <p class="body-3">${module.getHours(
                      dateTimeUnix,
                      timezone
                    )}</p>
                    <img
                      src="./assets/icons/${icon}.svg"
                      alt="${description}"
                      width="48"
                      height="48"
                      loading="lazy"
                      class="weather-icon svg svg-all"
                      title="${description}"
                    />
                    <p class="body-3">${parseInt(temp)}℃</p>
                  </div>`;
        hourlySection.querySelector("[data-temp]").appendChild(tempLi);
        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");
        windLi.innerHTML = ` <div class="card card-sm slider-card">
                    <p class="body-3">${module.getHours(
                      dateTimeUnix,
                      timezone
                    )}</p>
                    <img
                      src="./assets/images/weather_icons/direction.png"
                      width="48"
                      height="48"
                      loading="lazy"
                      class="weather-icon svg svg-all"
                      alt=""
                      style="transform:rotate(${windDirection - 180}deg)"
                    />
                    <p class="body-3">${parseInt(
                      module.mps_to_kmh(windSpeed)
                    )} KM</p>
                  </div>`;
        hourlySection.querySelector("[data-wind]").appendChild(windLi);
      }
      // ---24forecast section---
      foreCastSection.innerHTML = ` <h2 class="title-2 label-ss" id="forecast-label">
              5 Days forecast
            </h2>
            <div class="card card-lg forecast-card">
              <ul data-forecast-list>
                
              </ul>
            </div>`;
      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt,
        } = forecastList[i];
        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);
        const li = document.createElement("li");
        li.classList.add("card-item");
        li.innerHTML = `<div class="icon-wrapper">
                    <img
                      class="svg svg-icon-5"
                      src="./assets/icons/${icon}.svg"
                      alt="${description}"
                      title="${description}"
                    />
                    <span class="span"><p class="title-2">${parseInt(
                      temp_max
                    )}℃</p></span>
                  </div>
                  <p class="label-1">${date.getDate()}${
          module.monthNames[date.getUTCMonth()]
        }</p>
                  <p class="label-1 label-1-ss">${
                    module.weekDayNames[date.getUTCDay()]
                  }</p>`;
        foreCastSection.querySelector("[data-forecast-list]").appendChild(li);
      }
      loading.style.display = "none";
      contianer.style.overflowY = "overlay";
      contianer.classList.add("fade-in");
    });
  });
};
export const error404 = () => {};
