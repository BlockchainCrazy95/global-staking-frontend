import { ethers } from 'ethers';
import { NotificationManager } from "react-notifications";

export const ellipseAddress = (addr) => {
    return addr.substr(0, 6) + "..." + addr.substr(-4);
}

export const displayEther = (price) => {
    return ethers.utils.formatEther(price);
}

export const displayUnits = (price, number) => {
    return ethers.utils.formatUnits(price, number);
}

export const displayFixed = (value, fixed, number = 9) => {
    return Number(displayUnits(value, number)).toFixed(fixed);
}

export const displayFixedNumber = (value, fixed = 0) => {
    return Number(value).toFixed(fixed);
}

export const showNotification = (message, type = "error") => {
    switch(type) {
    case "info":
        NotificationManager.info(message);
        break;
    case "success":
        NotificationManager.success(message);
        break;
    case "warning":
        NotificationManager.warning(message);
        break;
    case "error":
        NotificationManager.error(message);
        break;
    }
}

export function prettifySeconds_(seconds, resolution = "") {
    if ((seconds !== 0 && !seconds) || seconds < 0) {
      return "";
    }
  
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds - d * 3600 * 24 - h * 3600 - m * 60;
  
    if (resolution === "day") {
      return d + (d == 1 ? " day" : " days");
    }
  
    const dDisplay = d > 0 ? d + " d : " : "";
    const hDisplay = h > 0 ? h + " h : " : "";
    const mDisplay = m > 0 ? m + " m : " : "";
    const sDisplay = s >= 0 ? s + " s" : "";
  
    let result = dDisplay + hDisplay + mDisplay + sDisplay;
    // if (mDisplay === "") {
    //   result = result.slice(0, result.length - 2);
    // }
    return result;
  }

export function prettyVestingPeriod2(currentTime) {
    if (currentTime === 0) {
      return "";
    }
  
    let _currentTime = Math.floor(currentTime);
    // console.log("Lockup Period of time: ", currentTime.toString());
    // console.log("Current time: ", (new Date()).getTime() / 1000);
  
    const seconds = (_currentTime - Math.floor((new Date()).getTime() / 1000));
    if (seconds < 0) {
      return "Fully Vested";
    }
  
    return prettifySeconds_(seconds);
  }