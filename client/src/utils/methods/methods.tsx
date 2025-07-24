import { t } from "i18next";
import React from "react";

export const handleTimeFormat = (diffInSnds: number): [any, string?] => {
  // if less then a minute
  if (diffInSnds < 60) {
    // return t("time.now");
    return ["now"];
    // if less then an hour (3600s in an hour)
  } else if (diffInSnds < 3600) {
    let time = Math.floor(diffInSnds / 60);
    return [time, t("time.minute")];
    // if less then a day ()
  } else if (diffInSnds < 3600 * 24) {
    let time = Math.floor(diffInSnds / 60 / 60);
    let suffix = time > 1 ? t("time.hours") : t("time.hour");
    return [time, suffix];
    // if less than a week
  } else if (diffInSnds < 3600 * 24 * 7) {
    let day = Math.floor(diffInSnds / 60 / 60 / 24);
    let suffix = day > 1 ? t("time.days") : t("time.day");
    return [day, suffix];
  }
  // if less than a month
  else if (diffInSnds < 3600 * 24 * 7 * 30) {
    let weeks = Math.round(diffInSnds / 60 / 60 / 24 / 7);
    let suffix = weeks > 1 ? t("time.weeks") : t("time.week");
    return [weeks, suffix];
  } else {
    let months = Math.round(diffInSnds / 60 / 60 / 24 / 7 / 4);
    let suffix = months > 1 ? t("time.months") : t("time.month");
    return [months, suffix];
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

// Display date in arab mode
export const dateToArab = (originalDate: string) => {
  const [day, month, year] = originalDate.split("/");
  return `${day}-${month}-${year}`;
};

export const checkAndRequestGeolocation = async (): Promise<any> => {
  try {
    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    if (permission.state === "granted") {
      return true;
    } else if (permission.state === "prompt") {
      return true;
    } else {
      alert(
        t("common.tank.unable_get_geolocation") +
          "\n" +
          t("common.tank.please_verify") +
          "\n" +
          t("common.tank.verify_geolocation_turned_on") +
          "\n" +
          t("common.tank.verify_geolocation_activated")
      );
      // if (navigator.userAgent.includes("Chrome")) {
      //   window.open("chrome://settings/content/location", "_blank");
      //   } else if (navigator.userAgent.includes("Firefox")) {
      //     window.open("about:preferences#privacy", "_blank");
      //   } else if (navigator.userAgent.includes("Opera")) {
      //     window.open("about:preferences#privacy", "_blank");
      // } else {
      //   alert("Please activate geolocation in parameters.");
      // }
    }
  } catch (error) {
    alert(t("common.tank.unable_get_geolocation"));
  }
};

export const checkAndRequestCamera = async (): Promise<any> => {
  try {
    const permission = await navigator.permissions.query({
      name: "camera",
    });

    if (permission.state === "granted") {
      return true;
    } else if (permission.state === "prompt") {
      return true;
    } else {
      alert(
        "❌ Denied camera access \nPlease verify camera is activated on navigator and device parameters"
      );
    }
  } catch (error) {
    alert("Unable to get access to the camera");
  }
};

// determines if the user is within a distance of less than given meters from the tank
export function isUserWithinRadius(
  userLat: number,
  userLng: number,
  tankLat: number,
  tankLng: number,
  radiusMeters: number = 10
): boolean {
  const R = 6371000; // Rayon de la Terre en mètres
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const x = toRad(tankLng - userLng) * Math.cos(toRad((userLat + tankLat) / 2));
  const y = toRad(tankLat - userLat);
  const distance = Math.sqrt(x * x + y * y) * R;

  return distance <= radiusMeters;
}
