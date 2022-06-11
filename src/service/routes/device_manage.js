/**
 * @fileOverview Define the API functions of device module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 获取摄像头列表
 */
export const getCameraList = ({monitorRecordStatus, farmId, keyword, cameraType, cameraVendor, deviceStatus, pullable, snapshotStatus, startedTime, endedTime, pageNum, pageSize, deviceType}) => {
  const params = {
    farmId,
    pageNum: pageNum - 1,
    pageSize,
    keyword,
    cameraType,
    cameraVendor,
    deviceStatus,
    pullable,
    snapshotStatus,
    deviceType,
    monitorRecordStatus,
    startedTime: startedTime ? new Date(startedTime).getTime() : '',
    endedTime: endedTime ? new Date(endedTime).getTime() : ''
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/camera/page?${paramsStr}`);
};

/**
 * 根据farmId获取地块列表
 */
export const getLandListByFarmId = (farmId) => {
  const params = {
    pageNum: 0,
    pageSize: 1000,
    farmId,
    LandType: 'FARMLAND'
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/farm/land/page?${paramsStr}`);
};

/**
 * 预览摄像头列表
 */
export const previewCameraList = (cameraList, type) => {
  return service.post(`/v1/camera/preview?deviceType=${type}`, cameraList);
};

/**
 * 新建摄像头列表
 */
export const createCameraList = (cameraList) => {
  return service.post('/v1/camera/list', cameraList, {
    responseType: 'blob'
  });
};


/**
 * 修改摄像头信息
 */
export const updateCameraInfo = ({deviceId, deviceName, latitude, longitude, farmId, farmName, landId, landName, landCode, managerCompany, manager, managerPhone}) => {
  return service.put(util.format('/v1/camera/{0}', deviceId), {
    deviceId,
    deviceName,
    latitude,
    longitude,
    farmId,
    farmName,
    landId,
    landCode,
    landName,
    managerCompany,
    manager,
    managerPhone
  });
};

/**
 * 获取摄像头详情
 */
export const getCameraDetail = (id) => {
  return service.get(util.format('/v1/camera/{0}', id));
};

/**
 * 获取运维所属公司列表
 */
export const getDevOpsCompanyList = () => {
  return service.get('/v1/dict/list?keyType=branch');
};

/**
 * 删除摄像头
 */
export const removeCamera = (id) => {
  return service.delete(util.format('/v1/camera/{0}', id));
};

/**
 * 摄像头的接收和拒收
 */
export const setCameraPullable = ({deviceId, streamId, isPull}) => {
  const params = {
    deviceId,
    streamId,
    isPull,
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/camera/stream?${paramsStr}`);
};

/**
 * 摄像头的截图功能打开和关闭
 */
export const setCameraSnapshotStatus = ({streamId, snapshotStatus}) => {
  const params = {
    streamId,
    snapshotStatus
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/camera/snapshot?${paramsStr}`);
};

/**
 * PTZ控制摄像头
 */
export const controlCameraPosition = ({deviceId, cameraMovement}) => {
  const params = {
    deviceId,
    cameraMovement
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/camera?${paramsStr}`);
};

/**
 * 获取摄像头截图列表
 */
export const getCameraScreenshotList = ({streamName, startedAt, endedAt, pageNum, pageSize}) => {
  const params = {
    streamName,
    startedAt,
    endedAt,
    pageNum,
    pageSize
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/monitor/camera/page?${paramsStr}`, {
    baseURL: ''
  });
};

/**
 * 获取摄像头延时摄影列表
 */
export const getCameraVideoList = ({streamName}) => {
  const params = {
    streamName
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/monitor/timelapse/page?${paramsStr}`, {
    baseURL: ''
  });
};


/**
 * 下载全部摄像头截图列表
 * 暂时不用，前端下载
 */
export const downloadAllCameraScreenshots = ({streamName, startedAt, endedAt}) => {
  const params = {
    streamName,
    startedAt,
    endedAt
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/monitor/download?${paramsStr}`, '', {
    baseURL: ''
  });
};

/**
 * 获取传感器列表
 */
export const getSensorList = ({keyword, sensorVendor, sensorType, deviceStatus, receive, startedTime, endedTime, pageNum, pageSize}) => {
  const params = {
    pageNum: pageNum - 1,
    pageSize,
    keyword,
    sensorVendor,
    sensorType,
    deviceStatus,
    receive: (receive === '' || receive === undefined) ? '' : Number(receive),
    startedTime: startedTime ? new Date(startedTime).getTime() : '',
    endedTime: endedTime ? new Date(endedTime).getTime() : ''
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/sensor/page?${paramsStr}`);
};

/**
 * 预览传感器列表
 */
export const previewSensorList = (sensorList) => {
  return service.post('/v1/sensor/preview', sensorList);
};


/**
 * 新建传感器列表
 */
export const createSensorList = (sensorList) => {
  return service.post('/v1/sensor/list', sensorList, {
    responseType: 'blob'
  });
};

/**
 * 获取传感器详情
 */
export const getSensorDetail = (id) => {
  return service.get(util.format('/v1/sensor/{0}', id));
};


/**
 * 修改传感器信息
 */
export const updateSensorInfo = ({id, modelId, modelName, intervalValue, latitude, longitude, farmId, landId, farmName, landCode, landName, managerCompany, manager, managerPhone, name}) => {
  return service.patch('/v1/sensor', {
    id,
    modelId,
    modelName,
    intervalValue,
    latitude,
    longitude,
    farmId,
    farmName,
    landId,
    landCode,
    landName,
    managerCompany,
    manager,
    managerPhone,
    name
  });
};

/**
 * 重启传感器
 */
export const resetSensor = ({id, deviceName}) => {
  const params = {
    id,
    deviceName
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/sensor/reboot?${paramsStr}`);
};

/**
 * 接收、拒收传感器
 */
export const updateDeviceReceive = ({id, deviceName, receive}) => {
  const params = {
    id,
    deviceName,
    receive
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/sensor/setReceiveStatus?${paramsStr}`);
};

/**
 *  获取传感器各个维度数据
 */
export const getSensorDimensionData = ({deviceName, days}) => {
  const params = {
    deviceName,
    days
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/sensor?${paramsStr}`);
};

/**
 *  摄像头生成延时摄影
 */
export const createCameraCurrentMonthVideo = ({streamName}) => {
  const params = {
    streamName
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/monitor/timelapse?${paramsStr}`, '', {
    baseURL: ''
  });
};

/**
 *  获取监控回放视频
 */
export const getPlayBackList = ({streamId, startTime, endTime, pageNum, pageSize}) => {
 const params = {
  streamId,
  startTime,
  endTime,
  pageNum,
  pageSize,
 }

 let paramsStr = qs.stringify(_.pickBy(params, (item) => {
  return item !== '' && item !== undefined;
 }));

 return service.get(`/v1/record/record/page?${paramsStr}`)
};

/**
 *  获取所有设备数据
 */
export const getAllDeviceData = () => {
  return service.get(`/v1/sensor/deviceStatistics`);
};


/**
 * 删除传感器
 */
export const removeSensor = (id) => {
  return service.delete('/v1/sensor?id=' + id);
};


/**
 * 获取传感器数据列表，包含删除数据
 */
export const getDataSensorList = ({deviceName, farmId, landCode, deviceStatus, pageNum, pageSize}) => {
  const params = {
    pageNum: pageNum - 1,
    pageSize,
    deviceName,
    farmId,
    landCode,
    deviceStatus,
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/sensor/datamanage/page?${paramsStr}`);
};

/**
 *  获取指标列表，温度、湿度等
 */
export const getMetricList = () => {
  return service.get(`/v1/dict/list?keyType=metric`);
};

/**
 * 导出传感器数据
 */
export const exportSensorDataExcel = ({startDate, endDate, deviceName, dataDimensionList}) => {
  const params = {
    startDate: startDate ? new Date(startDate).getTime() : '',
    endDate: endDate ? new Date(endDate).getTime() : '',
    deviceName,
    dataDimensionList
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/monitor/sensor/export?${paramsStr}`, {
    baseURL: '',
    responseType: 'blob'
  });
};


/**
 * 获取摄像头数据列表，包含删除数据
 */
export const getDataCameraList = ({deviceId, type, farmId, landCode, deviceStatus, pageNum, pageSize}) => {
  const params = {
    pageNum: pageNum - 1,
    pageSize,
    deviceId,
    type,
    farmId,
    landCode,
    deviceStatus,
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/camera/datamange/page?${paramsStr}`);
};

/**
 * 获取虫情截图
 */
export const getWormCameraList = ({deviceName = 'test_insect_sensor', startedAt, endedAt, pageNum, pageSize}) => {
  const params = {
    pageNum: pageNum,
    pageSize,
    deviceName,
    startedAt,
    endedAt
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/sensor/camera/page?${paramsStr}`);
};

/**
 * 摄像头录制
 */
 export const setCameraRecordStatus = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.post(`/v1/camera/monitorRecord?${paramsStr}`);
};
