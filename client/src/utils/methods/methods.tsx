import React from "react";

export const handleTimeFormat = (diffInSnds: number): string => {
  // if less then a minute
  if (diffInSnds < 60) {
    return "now";
    // if less then an hour (3600s in an hour)
  } else if (diffInSnds < 3600) {
    return Math.floor(diffInSnds / 60) + "min";
    // if less then a day ()
  } else if (diffInSnds < 3600 * 24) {
    return Math.floor(diffInSnds / 60 / 60) + "hours";
    // if less than a week
  } else if (diffInSnds < 3600 * 24 * 7) {
    return Math.floor(diffInSnds / 60 / 60 / 24) + "days";
  }
  // if less than a month
  else if (diffInSnds < 3600 * 24 * 7 * 30) {
    let weeks = Math.round(diffInSnds / 60 / 60 / 24 / 7);
    return weeks > 1 ? weeks + "weeks" : weeks + "week";
  } else {
    let months = Math.round(diffInSnds / 60 / 60 / 24 / 7 / 4);
    return months > 1 ? months + "months" : months + "month";
  }
};

// This method returns the difference in seconds between now and the last post time
export const getDiffTime = (postTime: number) => {
  let now = new Date().getTime();
  // Difference time in seconds
  let diffTime = Math.floor((now - postTime) / 1000);
  return diffTime;
  // handleTimeFormat(diffTime);
};
