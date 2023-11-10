import React from "react";

export const handleTimeFormat = (diffInSnds: number): string => {
  // if less then a minute
  if (diffInSnds < 60) {
    return diffInSnds + "s";
    // if less then an hour
  } else if (diffInSnds < 60 * 60) {
    return Math.floor(diffInSnds / 60) + "min";
    // if less then a day
  } else if (diffInSnds < 3600 * 24) {
    return Math.floor(diffInSnds / 60 / 60) + "hours";
  } else {
    return Math.round(diffInSnds / 60 / 60 / 24) + "days";
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
