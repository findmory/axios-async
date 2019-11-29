const delay = require("delay");
const axios = require("axios");

module.exports = async config => {
  // destructure config
  let {
    url,
    method,
    data,
    timeout,
    retryDelay,
    retryingCallback,
    retryType,
    retries
  } = config;

  // url is required.  do something if we don't have it
  config = {
    url: url,
    method: method || "get",
    data: data || null,
    timeout: timeout || 3000,
    retryDelay: retryDelay || 200,
    retryingCallback: retryingCallback || null,
    retryType: retryType || "static",
    retries: retries || 0
  };

  let retryLooper = true;
  let retryCount = 0;
  let retryDelayCalc = config.retryDelay;
  let resp;
  do {
    resp = await _axiosAsync(config);
    if (!resp) {
      // are we out of retries?
      
      if (retryCount >= config.retries && config.retries !== -1) {
        retryLooper = false;
        continue;
      }
      retryCount++;
      config.retryingCallback ? config.retryingCallback() : null;

      switch (retryType) {
        case "exponential":
          retryDelayCalc = ((Math.pow(2, retryCount) - 1) / 2) * 1000;
          break;
        case "linear":
          retryDelayCalc = retryCount * config.retryDelay;
          break;
        default:
          retryDelayCalc = config.retryDelay;
          break;
      }

    
      console.log(`delaying for ${retryDelayCalc}`);
      await delay(retryDelayCalc);
      retryLooper = true;
      
    } else {
      retryLooper = false;
    }
  } while (retryLooper);
  return resp;
};

_axiosAsync = async config => {
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
    // console.log(err.response.status);
    // console.log(err.response.data);

    // even though certain errors are caught we can consider them success
    if (
      err.response &&
      err.response.status >= 400 &&
      err.response.status <= 500
    ) {
      return err.response;
    }
    return false;
  }
};
