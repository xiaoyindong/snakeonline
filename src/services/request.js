
import { Toast } from 'antd-mobile';
import axios from 'axios';
import Cookies from 'js-cookie';
import urlparams from '@utils/urlparams';

import { baseURL } from './config';

const TOKENKEY = 'x-weimai-token';
let TOKENVALUE = Cookies.get(TOKENKEY) || '93299a57-8647-426c-9203-3e33a0452e6c';
if (urlparams.domain) {
  TOKENVALUE = Cookies.get('x-open-token');
}
/** http defaults */
axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(config => {
  Toast.loading('加载中...', 0);
  if (TOKENVALUE) {
    config.headers[TOKENKEY] = TOKENVALUE;
  }
  return config;
});

axios.interceptors.response.use(
  response => {
    Toast.hide();
    const { code, message } = response.data;
    // 代表登录即将过期，重设置
    if (response.headers[TOKENKEY]) {
      TOKENVALUE = response.headers[TOKENKEY];
      Cookies.set(TOKENKEY, TOKENVALUE, {
        expires: 30,
      });
    }
    // 登录已过期发送全局消息
    if (code === 40400) {
      return response.data;
    }
    // 接口返回code不为0提示错误信息
    if (code !== 0) {
      Toast.fail(message);
      return response.data;
    }
    return response.data || {};
  },
  () => {
    return {};
  }
);

const request = (url, options) => {
  options.timeout = options.timeout || 30000;
  return axios({ url, ...options });
}

request.get = (url, options) => {
  options.method = 'GET';
  options.params = options.params || {};
  if (!Object.keys(options.params).length) {
    options.params._t = Date.now();
  }
  return request(url, options);
};

request.post = (url, options) => {
  options.method = 'POST';
  return request(url, options);
};

export default request;