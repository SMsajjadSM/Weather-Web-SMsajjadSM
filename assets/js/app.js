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
  if (searchFeild.Value) {
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
