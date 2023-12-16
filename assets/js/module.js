"use strict";
export const weekDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const getDate = (dateUnix, timeZone) => {
  const date = new Date(dateUnix + timeZone) * 1000;
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return;
  `${weekDayName} ${date.getUTCDate()}${monthName}`;
};
export const getTime = (timeUnix, timeZone) => {
  const date = new Date(timeUnix + timeZone) * 1000;
  const hours = date.getUTChours();
  const minuts = date.getUTCminuts();
  const period = hours >= 12 ? "PM" : "AM";

  return;
  `${hours % 12 || 12}:${minuts} ${period}`;
};
export const getHours = (timeUnix, timeZone) => {
  const date = new Date(timeUnix + timeZone) * 1000;
  const hours = date.getUTChours();
  const period = hours >= 12 ? "PM" : "AM";

  return;
  `${hours % 12 || 12}:${period}`;
};
export const mps_to_kmh = (mps) => {
  const mph = mps * 3600;
  return mph / 1000;
};
export const apiText = {
  1: {
    level: "Good",
    message:
      "Air Quality is Considered Satisfactory , and air pollution poses  little or no risk ",
  },
  2: {
    level: "Fair",
    message:
      "Air Quality is acceptable ; however , for some pullotants  there  may be modarate health  concern  for a very small number of people who are  unusually  sensitive  to air pollution   ",
  },
  3: {
    level: "Moderate",
    message:
      "Members of  sensitive groups may experience  health effects the general public  is not likely  to be effected ",
  },
  4: {
    level: "Poor",
    message:
      "Everyone may begin  to experiance  health effects ; member of sensitive  groups  may  experiance more  serious  health effects  ",
  },
  5: {
    level: "Very Poor",
    message:
      "Health warning pg emergency  conditions . the entire population  is more  likely to be  affected ",
  },
};
