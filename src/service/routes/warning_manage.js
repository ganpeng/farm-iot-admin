/**
 * @fileOverview Define the API functions of warning module
 */

import service from '../config';
import qs from 'querystring';

/**
 * 获取预警数据列表
 */
export const getWarningList = ({keyword, status, warnType, modelId, pageNum, pageSize}) => {
  const params = {
    keyword,
    status,
    warnType,
    modelId,
    pageNum: pageNum - 1,
    pageSize
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/warn/page?${paramsStr}`);
};

/**
 * 获取预警总量数据
 */
export const getWarningData = () => {
  return service.get(`/v1/warn/warnStatistics`);
};
