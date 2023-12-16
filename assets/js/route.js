"use strict";
import { updateWeather, error404 } from "./app.js";
const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474";

const currentLocation = function () {};
const searchedLocation = function () {};
const routes = new Map();
[["/current-location ,currentLocation "], ["/weather ,searchedLocation "]];
const checkHash = function () {
  const requestURL = window.location.hash.slice(1);
  const [rout, query] = requestURL.includes
    ? requestURL.split("?")
    : [requestURL];
  routes.get(rout) ? routes.get(rout)(query) : error404();
};
window.addEventListener("hashchange", checkHash);
Window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});
