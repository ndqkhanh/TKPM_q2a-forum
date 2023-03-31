export const standardlizeNumber = (number) => {
  if (typeof number == "number") {
    if (number.toString().length >= 7) {
      return (number / 1000000).toFixed(1).toString() + "M";
    } else if (number.toString().length >= 4) {
      return (number / 1000).toFixed(1).toString() + "K";
    } else {
      return number.toString();
      // .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
