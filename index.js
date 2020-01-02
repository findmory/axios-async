const delay = require("delay");
const axios = require("axios");

module.exports = async config => {
  // url is required.  do something if we don't have it
  
  let requiredParms = {
    url: config.url,
    method: config.method || "get",
    timeout: config.timeout || 3000,
    retryDelay: config.retryDelay || 200,
    retryType: config.retryType || "static",
  };

  let _config = {...config, ...requiredParms};

  let retryLooper = true;
  let retryCount = 0;
  let retryDelayCalc = _config.retryDelay;
  let resp;
  do {
    resp = await _axiosAsync(_config);
    if (!resp) {
      retryCount++;
      _config.retryingCallback ? _config.retryingCallback() : null;

      switch (_config.retryType) {
        case "exponential":
          retryDelayCalc = ((Math.pow(2, retryCount) - 1) / 2) * 1000;
          break;
        case "linear":
          retryDelayCalc = retryCount * _config.retryDelay;
          break;
        default:
          retryDelayCalc = _config.retryDelay;
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
  try {
    let resp = await axios(config);
    return resp;
  } catch (err) {
    console.log("handling the error");
    return false;
  }
};
