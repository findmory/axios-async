## Usage

### Install the library

```js
npm install findmory/async-axios
```

### Import it into your app

```js
import axiosPlus from 'async-axios`
```

### Setup Config object

```java
let config = {

  /* url is mandatory */
  url: <string>,

  /* if no method, default is 'get' */
  method: <'get', 'post', etc>,

  /* data body for 'post', 'put', etc */
  data: {},

  /* timeout in milleseconds */
  timeout: <number>,

  /* retry delay in milleseconds */
  retryDelay: <number>,

  /* retry type.  one of;
    'static' (retryDelay = retryDelay)
    'linear' (retryDelay = # retries * retryDelay)
    'exponential (retryDelay = ((Math.pow(2, config.currentRetryAttempt) - 1) / 2) * 1000;)'
  */
  retryType: <string>,

  /* number of times to retry (-1: forever, 0: none)
  */
  retries: <integer>,

  /* callback to run during retry*/
  retryCallback: <function>

}
```

### Make the request

```
let resp = axiosPlus(config); // returns resp or `false`
```
