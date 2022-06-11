/**
 * @fileOverview Define the API functions of statistics module
 */

import service from '../config';
import qs from 'querystring';

/**
 * 获取农场统计所有数据
 */
export const getFarmStatistics = () => {
  return service.get(`/v1/statistics/farm?farmId=0&year=` + new Date().getFullYear());
};

/**
 * 获取设备统计所有数据
 */
export const getDeviceStatistics = () => {
  return service.get(`/v1/statistics/device?farmId=0&year=` + new Date().getFullYear());
};

/**
 * 获取种植统计所有数据
 */
export const getPlantStatistics = () => {
  return service.get(`/v1/statistics/planting/type?farmId=0&year=` + new Date().getFullYear());
};

/**
 * 获取地块统计各指标数据
 */
export const getLandMetricStatistics = () => {
  return service.get(`/v1/statistics/land?farmId=0`);
};

/**
 * 获取从业人员统计各指标数据
 */
export const getMemberMetricStatistics = () => {
  return service.get(`/v1/statistics/member?farmId=0`);
};

/**
 * 获取农机具统计各指标数据
 */
export const getMachineMetricStatistics = () => {
  return service.get(`/v1/statistics/machinery?farmId=0`);
};

/**
 * 获取投入品统计各指标数据
 */
export const getInputMetricStatistics = () => {
  return service.get(`/v1/statistics/input?farmId=0`);
};

/**
 * 获取经营统计各指标数据
 */
export const getOperateMetricStatistics = () => {
  return service.get(`/v1/statistics/operating?farmId=0`);
};

/**
 * 获取设备种类统计各指标数据
 */
export const getDeviceTypeMetricStatistics = () => {
  return service.get(`/v1/statistics/device?farmId=0`);
};

/**
 * 获取作物类型
 */
export const getCropCategoryList = () => {
  return service.get(`/v1/dict/list?keyType=cropType`);
};

/**
 * 根据作物类型id获取作物种类
 */
export const getCropTypeListById = (categoryId) => {
  return service.get(`/v1/dict/list?parentId=` + categoryId);
};

/**
 * 获取种植统计各维度数据
 */
export const getPlantMetricStatistics = ({plantType, plantName}) => {
  const params = {
    plantType,
    plantName,
    farmId: 0
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/statistics/planting?${paramsStr}`);
};


/**
 * 获取种植统计各维度数据
 */
export const getPlantMetricChartStatistics = () => {
  return service.get('/v1/statistics/planting/type?farmId=0');
};

/**
 * 导出农场-地块数据
 */
export const exportLandDataExcel = () => {
  return service.get(`/v1/statistics/land/excel?farmId=0`, {
    responseType: 'blob'
  });
};

/**
 * 导出农场-人员数据
 */
export const exportMemberDataExcel = () => {
  return service.get(`/v1/statistics/member/excel?farmId=0`, {
    responseType: 'blob'
  });
};

/**
 * 导出农场-农机具数据
 */
export const exportMachineDataExcel = () => {
  return service.get(`/v1/statistics/machinery/excel?farmId=0`, {
    responseType: 'blob'
  });
};

/**
 * 导出农场-投入品数据
 */
export const exportInputDataExcel = () => {
  return service.get(`/v1/statistics/input/excel?farmId=0`, {
    responseType: 'blob'
  });
};

/**
 * 导出农场-经营数据
 */
export const exportOperateDataExcel = () => {
  return service.get(`/v1/statistics/operating/excel?farmId=0`, {
    responseType: 'blob'
  });
};

/**
 * 导出农场-种植数据
 */
export const exportPlantDataExcel = ({plantType, plantName, indicatorType}) => {
  const params = {
    indicatorType,
    plantType,
    plantName,
    farmId: 0
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/statistics/planting/excel?${paramsStr}`, {
    responseType: 'blob'
  });
};

/**
 * 导出设备-设备分类数据
 */
export const exportDeviceDataExcel = () => {
  return service.get(`/v1/statistics/device/excel?farmId=0`, {
    responseType: 'blob'
  });
};

