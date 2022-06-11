/**
 * @fileOverview Define the API functions of version module
 */

import service from '../config';
import qs from 'querystring';
import util from "../../util/extend";

/**
 * 创建版本
 */
export const createVersion = ({name, upgradeDesc, clientType, upgradeType, upgradeUrl, versionName}) => {
  return service.post(`/v1/version`, {name, upgradeDesc, clientType, upgradeType, upgradeUrl, versionName});
};

/**
 * 编辑版本
 */
export const updateVersion = ({no, name, upgradeDesc, clientType, upgradeType, upgradeUrl, versionName}) => {
  return service.put(`/v1/version`, {no, name, upgradeDesc, clientType, upgradeType, upgradeUrl, versionName});
};

/**
 * 获取版本数据列表
 */
export const getVersionList = ({keyword, clientType, upgradeType, versionStatus, releasedStart, releasedEnd, pageNum, pageSize}) => {
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

  return service.get(`/v1/version/page?${paramsStr}`);
};

/**
 * 获取版本详情
 */
export const getVersionDetail = (no) => {
  return service.get(util.format('/v1/version/{0}', no));
};

/**
 * 删除版本
 */
export const removeVersion = (no) => {
  return service.delete(util.format('/v1/version/{0}', no));
};

/**
 * 版本撤回或发布
 */
export const updateVersionStatus = ({no, versionStatus}) => {
  const params = {
    no,
    versionStatus
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/version/operate?${paramsStr}`);
};
