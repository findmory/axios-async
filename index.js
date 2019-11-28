const delay = require("delay");
const axios = require("axios");

module.exports = async config => {
  // destructure config
  let { url, method, data, timeout, retryDelay, retryingCallback } = config;

  // set defaults

  // url is required.  do something if we don't have it
  config = {
    url: url,
    method: !method ? "get" : method,
    data: !data ? null : data,
    timeout: !timeout ? 3000 : timeout,
    retryDelay: !retryDelay ? 200 : retryDelay,
    retryingCallback: !retryingCallback ? () => {} : retryingCallback
  };

  console.log(config);

  let retryLooper = true;
  let resp;
  do {
    resp = await _axiosAsync(config);
    if (!resp) {
      retryingCallback();
      console.log("delaying for", retryDelay);
      await delay(retryDelay);
      retryLooper = true;
    } else {
      retryLooper = false;
    }
  } while (retryLooper);
  return resp;
};

_axiosAsync = async config => {
  console.log("starting axios");
  let _config = {};
  _config.url = config.url;
  _config.method = config.method;
  _config.timeout = config.timeout;
  if (config.data) {
    _config.data = config.data;
  }
  try {
    let resp = await axios(_config);
    return resp;
  } catch (err) {
    console.log("handling the error");
    return false;
  }
};
