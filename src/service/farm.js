import qs from 'querystring';
import _ from 'lodash';
import service from './config';

// 通用接口
export const getDistrict = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
      return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/district?${paramsStr}`);
};

// 农场基本信息
export const createFarm = (reqBody) => {
  return service.post(`/v1/farm`, reqBody);
};

export const updateFarmById = (reqBody) => {
  return service.put(`/v1/farm`, reqBody);
};

export const deleteFarmById = (id) => {
  return service.delete(`/v1/farm/${id}`);
};

export const getFarmById = (id) => {
  return service.get(`/v1/farm/${id}`);
};

export const getFarmList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
      return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/farm/list?${paramsStr}`);
};

export const getStatistic = (id) => {
  return service.get(`/v1/farm/statistic?farmId=${id}&year=${new Date().getFullYear()}`);
};

export const getFarmCount = () => {
  return service.get(`/v1/farm/count`);
};
// 获取农场审核数量信息
export const getCheckInfo = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.post(`/v1/approve/statistic?${paramsStr}`);
};
// 获取农场审核列表
export const getCheckList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/approve/farm/page?${paramsStr}`);
};
// 审核接口
export const farmOperate = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.post(`/v1/approve/farm/operate?${paramsStr}`);
}
// 删除拒绝的审核记录
export const approveDelete = (id) => {
  return service.delete(`/v1/approve/farm/delete/${id}`);
}
// 撤回审核
export const approveCancel = (id) => {
  return service.get(`/v1/approve/farm/withdraw/${id}`);
}
// 保存 再次编辑拒绝的审核记录
export const saveCheckRecord = () => {
  return service.post();
}

// 绑定店铺
export const bindShop = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
      return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/farm/bindShop?${paramsStr}`);
}
// 商品绑定农场
export const goodsListBindFarm = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
      return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/goods/bindFarmByGoods?${paramsStr}`);
};

// 农场农机具
export const createFarmMachine = (reqBody) => {
  return service.post(`/v1/machinery/add`, reqBody);
};

export const updateFarmMachineById = (reqBody) => {
  return service.put(`/v1/machinery/edit`, reqBody);
};

export const deleteFarmMachineById = (id) => {
  return service.delete(`/v1/machinery/${id}`);
};

export const getFarmMachineList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/machinery/list?${paramsStr}`);
};

export const getFarmMachineById = (id) => {
  return service.get(`/v1/machinery/${id}`);
};

// 经营人员
export const createManageMember = (reqBody) => {
  return service.post(`/v1/manage_member/add`, reqBody);
};

export const updateManageMemberById = (reqBody) => {
  return service.put(`/v1/manage_member/edit`, reqBody);
};

export const deleteManageMemberById = (id) => {
  return service.delete(`/v1/manage_member/${id}`);
};

export const getManageMemberList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/manage_member/list?${paramsStr}`);
};

export const getManageMemberById = (id) => {
  return service.get(`/v1/manage_member/${id}`);
};

// 种植人员
export const createPlantMember = (reqBody) => {
  return service.post(`/v1/plant_member/add`, reqBody);
};

export const updatePlantMemberById = (reqBody) => {
  return service.put(`/v1/plant_member/edit`, reqBody);
};

export const deletePlantMemberById = (id) => {
  return service.delete(`/v1/plant_member/${id}`);
};

export const getPlantMemberList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/plant_member/list?${paramsStr}`);
};

export const getPlantMemberById = (id) => {
  return service.get(`/v1/plant_member/${id}`);
};

// 宅基地
export const createHomestead = (reqBody) => {
  return service.post(`/v1/homestead`, reqBody);
};

export const updateHomesteadById = (reqBody) => {
  return service.put(`/v1/homestead`, reqBody);
};

export const deleteHomesteadById = (id) => {
  return service.delete(`/v1/homestead/${id}`);
};

export const getHomesteadList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/homestead/page?${paramsStr}`);
};

export const getHomesteadById = (id) => {
  return service.get(`/v1/homestead/${id}`);
};

// 耕地
export const createLand = (reqBody) => {
  return service.post(`/v1/land`, reqBody);
};

export const updateLandById = (reqBody) => {
  return service.put(`/v1/land`, reqBody);
};

export const deleteLandById = (id) => {
  return service.delete(`/v1/land/${id}`);
};

export const getLandList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/land/page?${paramsStr}`);
};

export const getLandById = (id) => {
  return service.get(`/v1/land/${id}`);
};

// 政府项目
export const createGovernmentProject = (reqBody) => {
  return service.post(`/v1/government-project`, reqBody);
};

export const updateGovernmentProjectById = (reqBody) => {
  return service.put(`/v1/government-project`, reqBody);
};

export const deleteGovernmentProjectById = (id) => {
  return service.delete(`/v1/government-project/${id}`);
};

export const getGovernmentProjectList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/government-project/list?${paramsStr}`);
};

export const getGovernmentProjectById = (id) => {
  return service.get(`/v1/government-project/${id}`);
};

// 专项补贴
export const createSubsidy = (reqBody) => {
  return service.post(`/v1/subsidy`, reqBody);
};

export const updateSubsidyById = (reqBody) => {
  return service.put(`/v1/subsidy`, reqBody);
};

export const deleteSubsidyById = (id) => {
  return service.delete(`/v1/subsidy/${id}`);
};

export const getSubsidyList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/subsidy/list?${paramsStr}`);
};

export const getSubsidyById = (id) => {
  return service.get(`/v1/subsidy/${id}`);
};

// 农业社会化服务
export const createSocial = (reqBody) => {
  return service.post(`/v1/social`, reqBody);
};

export const updateSocialById = (reqBody) => {
  return service.put(`/v1/social`, reqBody);
};

export const deleteSocialById = (id) => {
  return service.delete(`/v1/social/${id}`);
};

export const getSocialList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/social/list?${paramsStr}`);
};

// 种植管理
export const createPlant = (reqBody) => {
  return service.post(`/v1/plant`, reqBody);
};

export const getPlantById = (id) => {
  return service.get(`/v1/plant?farmLandId=${id}`);
};

export const getPlantHistory = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/plant/history?${paramsStr}`);
};
// 删除种植作物时候调用
export const deletePlant = (reqBody) => {
  return service.put(`/v1/plant/deletePlant`, reqBody);
};

// 字典接口
export const getDictByKey = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/dict/list?${paramsStr}`);
};

export const getDictList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/dict/listDict?${paramsStr}`);
};

export const getAllDictList = () => {
  return service.get(`/v1/dict/all`);
};

export const postDict = (reqBody) => {
  return service.post(`/v1/dict/add`, reqBody);
};

// 首页物环设备统计
export const getDeviceStatistics = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/statistics/device?${paramsStr}`);
}

// 预警统计
export const getWarnStatistics = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/warn/warnStatistics?${paramsStr}`);
};

export const getWarnStatisticsByDays = (days) => {
  return service.get(`/v1/warn/statistics?days=${days}`);
};

// 商品相关
export const updateCommodityById = () => {};
export const deleteCommodityById = () => {};
export const getCommodityById = (id) => {
  // return service.get(`/v1/goods/${id}`);
  return service.get(`/v1/goods/getGoodsDetailByShop?goodsId=${id}`);
};
export const getCommodityList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/goods/pageByShop?${paramsStr}`);
};
// 获取商品分类
export const getCommodityCategory = () => {
  return service.get(`/v1/category/categoryList`);
};

// 获取商品类型数据
export const getGoodsTypes = () => {
  return service.get(`/v1/goods/goodsClassifiStatistics`);
};

// 批次相关
// 新增溯源批次
export const createBatch = (reqBody) => {
  return service.post(`/v1/trace`, reqBody);
};
// 编辑溯源批次信息
export const updateBatchById = (reqBody) => {
  return service.put(`/v1/trace`, reqBody);
};
// 删除溯源批次
export const deleteBatchById = (id) => {
  return service.delete(`/v1/trace?id=${id}`);
};
// 设置默认批次
export const setDefaultBatchById = (id) => {
  return service.put(`/v1/trace/select?id=${id}`);
};
export const getBatchById = () => {};
// 查询溯源批次列表
export const getBatchList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/trace/traceInfo/page?${paramsStr}`);
};
//  溯源码列表
export const getTracingCodeList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/trace/page?${paramsStr}`);
};
// 溯源统计
export const getTracingStatistic = () => {
  return service.get(`/v1/trace/statistic`);
};
// 批量生产溯源码
export const createTracingQrcode = (reqBody) => {
  return service.post(`/v1/trace/qrcode`, reqBody, {
    responseType: 'blob'
  });
};
// export const createTracingQrcode = (params) => {
//   let paramsStr = qs.stringify(_.pickBy(params, (item) => {
//     return item !== '' && item !== undefined;
//   }));
//   return service.get(`/v1/trace/qrcode?${paramsStr}`, {
//     responseType: 'blob'
//   });
// };

// 店铺列表
export const getShopList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/shop/pageByShop?${paramsStr}`);
  // return service.get(`/v1/shop/page?${paramsStr}`);
};

// 用户列表
export const getMyUserList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/admin/page?${paramsStr}`);
};

// 通知预警
export const createNotice = (reqBody) => {
  return service.post(`/v1/notice`, reqBody);
};
export const updateNotice = (reqBody) => {
  return service.put(`/v1/notice`, reqBody);
};
export const operateNotice = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.patch(`/v1/notice/operate?${paramsStr}`);
};
export const getNoticeList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/notice/page?${paramsStr}`);
};
export const deleteNoticeById = (id) => {
  return service.delete(`/v1/notice/${id}`);
};
export const getNoticeById = (id) => {
  return service.get(`/v1/notice/${id}`);
};
export const getNoticeStatistics = () => {
  return service.get(`/v1/notice/statistics`);
};

// 传感器开关灯
export const sensorToggleLamp = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/sensor/open?${paramsStr}`);
};
// 传感器开关雨刷
export const sensorToggleBrush = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/sensor/clean?${paramsStr}`);
};
// 获取溯源码审核列表
export const getTraceCodeCheckList = (params) =>{
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/approve/trace/page?${paramsStr}`);
}

// 溯源 - 审核接口 同意/拒绝
export const approveTraceOperate = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.post(`/v1/approve/trace/operate?${paramsStr}`);
}
// 溯源 - 删除拒绝的审核记录
export const approveTraceDelete = (id) => {
  return service.delete(`/v1/approve/trace/delete/${id}`);
}
// 溯源 - 撤回审核
export const approveTraceWithdraw = (id) => {
  return service.get(`/v1/approve/trace/withdraw/${id}`);
}

export const approveTraceSubmit = (reqBody) => {
  return service.post(`/v1/approve/trace/submit`, reqBody);
}

export const approveFarmSubmit = (reqBody) => {
  return service.post(`/v1/approve/farm/submit`, reqBody);
}
// 根据农场审核ID查询信息
export const getFarmByCheckId = (id) => {
  return service.get(`/v1/approve/farm/detail/${id}`);
};

// 种植统计相关接口
// 产量
export const getProdStatistics = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/statistics/planting/overViewMultide?${paramsStr}`);
};
// 种植维度
export const getMyPlantStatistics = (params) => {
  // statisticsType: WATER PLANT
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/statistics/planting/typeMultide?${paramsStr}`);
};
// 鱼的条数
export const getFishingCategoryCount = () => {
  return service.get(`/v1/statistics/planting/fishingCategory`);
};
// 作物类型
export const getplantingMultide = (params) => {
  // statisticsType: WATER PLANT
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/statistics/plantingMultide?${paramsStr}`);
};
// 产量统计接口
export const getStatisticsPlant = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/statistics/planting/overViewMultide?${paramsStr}`);
};

// 获取水产表格的条数
export const getFishingTableData = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/statistics/planting/fishingCategoryCount?${paramsStr}`);
};

// 控制设备相关接口
/**
 * 获取控制设备列表
 */
export const getControllerList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/controller/page?${paramsStr}`);
};
/**
 * 预览控制设备列表
 */
export const previewControllerList = (controllerList) => {
  return service.post('/v1/controller/preview', controllerList);
};
/**
 * 新建传感器列表
 */
export const createControllerList = (controllerList) => {
  return service.post(`/v1/controller/list`, controllerList, {
    responseType: 'blob'
  });
};
/**
 * 获取传感器详情
 */
export const getControllerDetail = (id) => {
  return service.get(`/v1/controller/${id}`);
};
/**
 * 修改传感器信息
 */
export const updateControllerInfo = (reqBody) => {
  return service.patch('/v1/controller', reqBody);
};

/**
 * 重启传感器
 */
export const resetController = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/controller/reboot?${paramsStr}`);
};

/**
 * 接收、拒收传感器
 */
export const updateControllerReceive = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/controller/setReceiveStatus?${paramsStr}`);
};

/**
 *  获取传感器各个维度数据
 */
export const getControllerDimensionData = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/controller?${paramsStr}`);
};

/**
 *  获取所有控制设备数据
 */
export const getAllControllerData = () => {
  return service.get(`/v1/controller/deviceStatistics`);
};
/**
 * 删除传感器
 */
export const removeController = (id) => {
  return service.delete(`/v1/controller?id=${id}`);
};
/**
 * 获取控制设备数据列表，包含删除数据
 */
export const getDataControllerList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/controller/datamanage/page?${paramsStr}`);
};
/**
 * 获取控制设备实时数据
 */
export const getControllerRealTimeData = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/controller/realTimeData?${paramsStr}`);
};
/**
 * 获取农场下控制设备列表
 */
export const getControllerListByFarmId = (id) => {
  return service.get(`/v1/controller/farmPage?farmId=${id}`);
};

/**
 * 获取控制设备最后数据
 */
export const getControllerLastData = (deviceName) => {
  return service.get(`/v1/controller/lastData?deviceName=${deviceName}`);
}

export const getControllerRun = (obj) => {
  let {id, deviceName, commandList} = obj;
  return service.post(`/v1/controller/run?id=${id}&deviceName=${deviceName}`, commandList);
};

// 种植管理 农事记录 图表形式 接口
export const getRecordStatistics = (id) => {
  return service.get(`/v1/agriculRecord/griculRecordStatistics?farmId=${id}`);
}
// 种植计划相关接口
/**
 * 农事类型列表
 */
export const getAgriculTypeList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/agriculType/list?${paramsStr}`);
};

/**
 * 新增农事类型
 */
export const addAgriculType = (reqBody) => {
  return service.post(`/v1/agriculType`, reqBody);
};

/**
 * 作物周期列表
 */
export const getCropCycleList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/cropCycle/list?${paramsStr}`);
};

/**
 * 新增作物周期
 */
export const addCropCycle = (reqBody) => {
  return service.post(`/v1/cropCycle`, reqBody);
};

/**
 * 新增农事计划
 */
export const addAgriculPlan = (reqBody) => {
  return service.post(`/v1/agriculPlan`, reqBody);
};

/**
 * 完成农事计划
 */
export const completeAgriculPlan = (reqBody) => {
  return service.put(`/v1/agriculPlan/completeAgriculPlan`, reqBody);
};

/**
 * 获取农事计划列表
 */
export const getAgriculPlanList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/agriculPlan/list?${paramsStr}`);
};

/**
 * 更新农事计划
 */
export const updateAgriculPlan = (reqBody) => {
  return service.put(`/v1/agriculPlan/updateAgriculPlan`, reqBody);
};

/**
 * 获取农事计划详情
 */
export const getAgriculPlanDetail = (id, uuid) => {
  return service.get(`/v1/agriculPlan/getAgriculPlanDetail?id=${id}&uuid=${uuid}`);
};

// 农事记录相关

/**
 * 新增农事记录
 */
export const addAgriculRecord = (reqBody) => {
  return service.post(`/v1/agriculRecord`, reqBody);
};

/**
 * 编辑农事记录
 */
export const updateAgriculRecord = (reqBody) => {
  return service.put(`/v1/agriculRecord/updateAgriculRecord`, reqBody);
};

/**
 * 获取农事记录列表
 */
export const getAgriculRecordList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/agriculRecord/list?${paramsStr}`);
};

/**
 * 获取农事记录详情
 */
export const getAgriculRecordDetail = (id, uuid) => {
  return service.get(`/v1/agriculRecord/getAgriculRecordDetail?id=${id}&uuid=${uuid}`);
};

/**
 * 获取作物列表
 */
export const getAgriculRecordPlantNameList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/agriculRecord/plantNamelist?${paramsStr}`);
}

// 获取农场摄像头的列表
export const getCameraListByFarmId = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/camera/page?${paramsStr}`);
};

// 获取摄像头的回看视频
export const getCameraRecordList = (params) => {
  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));
  return service.get(`/v1/record/record/page?${paramsStr}`);
};
