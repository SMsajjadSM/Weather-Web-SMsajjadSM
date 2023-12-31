"use strict";
import { updateWeather, error404 } from "./app.js";
const defaultLocation = "lat=36.2974945&lon=59.6059232";

const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;
      updateWeather(`lat = ${latitude}`, `lon = ${longitude}`);
    },
    (err) => {
      window.location.hash = defaultLocation;
    }
  );
};
/**
 *
 * @param {string} query
 * @returns
 */
export const searchedLocation = (query) => updateWeather(...query.split("&"));

// searchedLocation(ss);
const routes = new Map([
  ["#/current-location ", currentLocation],
  ["#/weather ", searchedLocation],
]);
const checkHash = function () {
  const requestURL = window.location.hash.slice(1);
  const [rout, query] = requestURL.includes
    ? requestURL.split("?")
    : [requestURL];
  routes.get(rout) ? routes.get(rout)(query) : error404();
};
window.addEventListener("hashchange", checkHash);
window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
  searchedLocation(defaultLocation);
});
