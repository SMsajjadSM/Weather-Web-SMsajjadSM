"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};
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
        // console.log(searchFeild.value);
        searchFeild.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = ` <ul class="view-list" data-search-list>
            <li class="view-item">
              <i class="fa fa-map-marker" aria-hidden="true"></i>
              <div>
                <p class="item-title">London</p>
                <p class="label-2 item-subtitle">State of London, GB</p>
              </div>
              <a href="#" class="item-link has-state" data-search-toggler></a>
            </li>
          </ul>`;
        const items = [];
        console.log(location);
        for (const { name, lat, lon, country, state } of location) {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view-item");
          searchItem.innerHTML = `  <i class="fa fa-map-marker" aria-hidden="true"></i>
                <div>
                  <p class="item-title">${name}</p>
                  <p class="label-2 item-subtitle">${state || ""},${country}</p>
                </div>
                <a href="#/weather/lat=${lat}&lon=${lon}"  class="item-link has-state" aria-label =${name} data-search-toggler></a>`;
          searchResult
            .querySelector("[data-search-list]")
            .appendChild(searchItem);
          items.push(searchItem.querySelector("[data-search-toggler ]"));
        }
      });
    }, searchTimeOutDuration);
  }
});
const contianer = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const error404 = document.querySelector("[data-error-content]");
const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);
export const updateWeather = function (lat, lon) {
  loading.style.display = "grid";
  contianer.style.overflowY = "hidden";
  contianer.classList.contains("fade-in") ??
    contianer.classList.remove("fade-in");
  error404.style.display = " none";
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
    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;
    const [{ description, icon }] = weather;
    const card = document.createElement;
    ("div");
    card.classList.add("card", "card-lg", "current-weather-card ");
    card.innerHTML = "";
  });
};
