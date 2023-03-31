const is_empty = (x) => {
  return (
    //don't put newline after return
    typeof x == "undefined" ||
    x == null ||
    x == false || //same as: !x
    x.length == 0 ||
    x == 0 || // note this line, you might not need this.
    x == "" ||
    x.replace(/\s/g, "") == "" ||
    !/[^\s]/.test(x) ||
    /^\s*$/.test(x)
  );
};

const is_URL = (str) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  return !!pattern.test(str);
};
export { is_empty, is_URL };
