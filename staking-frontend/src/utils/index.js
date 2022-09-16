import { ethers } from 'ethers';

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

  