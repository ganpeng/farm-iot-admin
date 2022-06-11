/**
 * @fileOverview Define the API functions of model module
 */

import service from '../config';
// import util from '../../util/extend';
import qs from 'querystring';
import util from "../../util/extend";
// import _ from 'lodash';

/**
 * 创建模型
 */
export const createModel = ({name, description, metrics, sensorType}) => {
  return service.post(`/v1/model`, {name, description, metrics, sensorType});
};

/**
 * 编辑模型
 */
export const updateModel = ({id, name, description, metrics, sensorType}) => {
  return service.patch(`/v1/model`, {id, name, description, metrics, sensorType});
};

/**
 * 获取模型数据列表
 */
export const getModelList = ({keyword, metric, pageNum, pageSize, sensorType}) => {
  const params = {
    keyword,
    metric,
    pageNum: pageNum - 1,
    pageSize,
    sensorType
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/model/page?${paramsStr}`);
};

/**
 * 获取模型详情
 */
export const getModelDetail = (id) => {
  return service.get(util.format('/v1/model/{0}', id));
};

/**
 * 删除模型
 */
export const removeModel = (id) => {
  return service.delete('/v1/model?id=' + id);
};

/**
 * 模型的总数
 */
export const getModelFixedTotal = () => {
  return service.get('/v1/model/count');
};

// 获取设备类型的子类型
export const getSensorTypeChildren = (id) => {
  return service.get('/v1/dict/list?parentId=' + id);
}

// wangshuo add 2021.4.14 start
// 新增功能 种植模型相关接口
// 新增种植模型
export const addPlantModel = ({plantName, farmId}) => {
  return service.post('/v1/plantModel', {plantName, farmId});
}
export const getPlantModelList = (id) => {
  return service.get('/v1/plantModel/list?farmId=' + id);
}
// 添加作物周期
export const addPlantCycle = ({farmId, name, plantName, sortId}) => {
  return service.post('/v1/cropCycle', {farmId, name, plantName, sortId});
}
// 编辑作物周期
export const editPlantCycle = ({farmId, name, plantName, sortId, id}) => {
  return service.put('/v1/cropCycle', {farmId, name, plantName, sortId, id});
}
// 删除作物周期
export const deletePlantCycle = (id) => {
  return service.put('/v1/cropCycle/updateStatusById?id=' + id);
}
// 查询作物周期列表
export const getPlantCycleList = ({farmId, pageNum, pageSize, plantName}) => {
  const params = {
    farmId,
    pageNum,
    pageSize,
    plantName
  };
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/cropCycle/list?${paramsStr}`);
}

// 添加农事类型
export const addFarmType = ({plantName, farmId, name, sortId}) => {
  return service.post('/v1/agriculType', {plantName, farmId, name, sortId});
}

// 编辑农事类型
export const editFarmType = ({farmId, name, plantName, sortId, id}) => {
  return service.put('/v1/agriculType', {farmId, name, plantName, sortId, id});
}

// 删除农事类型
export const deleteFarmType = (id) => {
  return service.put('/v1/agriculType/updateStatusById?id=' + id);
}
// 查询农事类型列表
export const getFarmTypeList = ({farmId, pageNum, pageSize, plantName}) => {
  const params = {
    farmId,
    pageNum,
    pageSize,
    plantName
  };
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/agriculType/list?${paramsStr}`);
}
// wangshuo add 2021.4.14 end
