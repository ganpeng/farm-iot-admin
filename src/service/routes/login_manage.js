/**
 * @fileOverview Define the API functions of login module
 */

import service from '../config';
// import util from '../../util/extend';
import qs from 'querystring';
// import util from "../../util/extend";
// import _ from 'lodash';

/**
 * 登录
 */
export const login = ({captcha, mobile, password}) => {
  return service.post(`/v1/auth/login`, {captcha, mobile, password});
};

/**
 * 获取短信验证码
 */
export const getMobileSmsCode = ({phoneNum, smsType}) => {
  const params = {
    phoneNum,
    smsType
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/sms/msg?${paramsStr}`);
};

/**
 * 登出
 */
export const logout = (adminId) => {
  return service.delete(`/v1/auth/logout?adminId=` + adminId);
};


