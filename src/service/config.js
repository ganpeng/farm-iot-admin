import axios from 'axios';
import wsCache from '@/util/webStorage';
import {Message, MessageBox} from 'element-ui';
import router from '../router';

// 防止多次弹出登出弹框
let baseMessageAlertCount = 0;

let service = axios.create({
  headers: {}
});

service.defaults.baseURL = `${process.env.VUE_APP_API_ROOT}`;

service.interceptors.request.use(
  config => {
    let token = wsCache.localStorage.get('login') && wsCache.localStorage.get('login').token;
    if (token) {
      config.headers = {
        'x-tianchi-token': token
      }
    }

    config.headers = Object.assign(config.headers, {
      'Accept': 'application/json',
      'x-tianchi-client': '{"role":"ADVISER","version":"v1.1.1","deviceId":"1234fads"}'
    });

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use((response) => {
  response.data.config = response.config;
  if (response.data.code === 0) {
    return response.data;
  } else // 用户未登录，删除本地cookie、storage、store中数据，转到登录页面
  // 异地登录
  if (response && response.data.code === 400) {
    if (baseMessageAlertCount === 0) {
      baseMessageAlertCount++;
      MessageBox.alert('<div>该账号已在其他位置登录，</div><div>如非本人操作，可点击重新登录后修改密码。</div>', '异地登录提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        callback: () => {
          baseMessageAlertCount = 0;
          wsCache.localStorage.set('login', '');
          router.push({name: 'Login'}, function () {
          });
        }
      }).catch(() => {
        baseMessageAlertCount = 0;
      });
    }
    return;
  } else if (response && response.data.code === 401) {  // token过期
    if (baseMessageAlertCount === 0) {
      baseMessageAlertCount++;
      MessageBox.alert('<div>您的登录信息已过期，</div><div>是否重新登录？</div>', '登录提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        callback: () => {
          baseMessageAlertCount = 0;
          wsCache.localStorage.set('login', '');
          router.push({name: 'Login'});
        }
      }).catch(() => {
        baseMessageAlertCount = 0;
      });
    }
    return;
  } else if (response.data.type !== 'application/octet-stream' && response.data.type !== 'application/vnd.ms-excel') {
    Message({
      message: response.data.message,
      type: 'warning'
    });
  }
  return response.data;
}, (err) => {
  console.log('err');
  console.log(err.response);
  if (window.navigator.onLine) {
    Message({
      message: (err.response && err.response.data.message) ? err.response.data.message : '请求出现错误',
      type: 'warning'
    });
  } else {
    Message({
      message: '网络连接失败，请检查您的网络连接情况',
      type: 'error'
    });
  }
  return {config: err.config};
});

export default service;
