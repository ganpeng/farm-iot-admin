/**
 * @fileOverview Define the API functions of version module
 */

import service from '../config';
import qs from 'querystring';
import util from "../../util/extend";

// 小吉数据APP版本管理相关接口
/**
 * 创建版本
 */
export const createAppVersion = ({name, upgradeDesc, clientType, upgradeType, upgradeUrl, versionName, versionNo}) => {
  return service.post(`/v1/xjClientVersion`, {name, upgradeDesc, clientType, upgradeType, upgradeUrl, versionName, versionNo});
};

/**
 * 编辑版本
 */
export const updateAppVersion = ({no, name, upgradeDesc, clientType, upgradeType, upgradeUrl, versionName, versionNo}) => {
  return service.put(`/v1/xjClientVersion`, {no, name, upgradeDesc, clientType, upgradeType, upgradeUrl, versionName, versionNo});
};

/**
 * 获取版本数据列表
 */
export const getAppVersionList = ({keyword, clientType, upgradeType, versionStatus, releasedStart, releasedEnd, pageNum, pageSize}) => {
  const params = {
    keyword,
    clientType,
    upgradeType,
    versionStatus,
    releasedStart,
    releasedEnd,
    pageNum: pageNum - 1,
    pageSize
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/xjClientVersion/page?${paramsStr}`);
};

/**
 * 获取版本详情
 */
export const getAppVersionDetail = (no) => {
  return service.get(util.format('/v1/xjClientVersion/{0}', no));
};

/**
 * 删除版本
 */
export const removeAppVersion = (no) => {
  return service.delete(util.format('/v1/xjClientVersion/{0}', no));
};

/**
 * 版本撤回或发布
 */
export const updateAppVersionStatus = ({no, versionStatus}) => {
  const params = {
    no,
    versionStatus
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/xjClientVersion/operate?${paramsStr}`);
};
