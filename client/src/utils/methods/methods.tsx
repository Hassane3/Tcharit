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

export const calculateDateDifference = (dateStr: string) => {
  const today: any = new Date(); // Get today's date

  // Split the French date (DD/MM/YYYY) into day, month, and year
  const [day, month, year] = dateStr.split("/");

  // Create a valid date string in the format YYYY-MM-DD
  const formattedDate = `${year}-${month}-${day}`;

  // Convert the formatted date string to a Date object
  const givenDate: any = new Date(formattedDate);

  // Calculate the time difference in milliseconds
  const timeDifference = today - givenDate;

  // Convert time difference to days
  const diffInDays = Math.floor(timeDifference / (1000 * 3600 * 24));

  return diffInDays;
};
