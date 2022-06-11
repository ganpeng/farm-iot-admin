/**
 * @fileOverview Define the API functions of admin module
 */

import service from '../config';
import qs from 'querystring';
import util from "../../util/extend";

/**
 * 创建管理员
 */
export const createAdmin = ({name, farmId, farmName, gender, mobile, password, roleId, roleName, roleType, avatarUrl}) => {
  return service.post(`/v1/admin`, {
    name,
    farmId,
    farmName,
    gender,
    mobile,
    password,
    roleId,
    roleName,
    roleType,
    avatarUrl
  });
};

/**
 * 编辑
 */
export const updateAdmin = (id, {name, farmId, farmName, gender, mobile, password, roleId, roleName, roleType, avatarUrl}) => {
  return service.put(`/v1/admin/` + id, {
    id,
    name,
    farmId,
    farmName,
    gender,
    mobile,
    password,
    roleId,
    roleName,
    roleType,
    avatarUrl
  });
};

/**
 * 获取管理员列表
 */
export const getAdminList = ({keyword, status, roleId, farmId, pageNum, pageSize}) => {
  const params = {
    keyword,
    status,
    roleId,
    farmId,
    pageNum: pageNum - 1,
    pageSize
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/admin/page?${paramsStr}`);
};

/**
 * 获取详情
 */
export const getAdminDetail = (id) => {
  return service.get(util.format('/v1/admin/{0}', id));
};

/**
 * 更新状态，NORMAL/FORBIDDEN
 */
export const updateAdminStatus = ({id, status}) => {
  return service.patch(util.format('/v1/admin/{0}/status?status=', id) + status);
};

/**
 * 删除
 */
export const removeAdmin = (id) => {
  return service.delete('/v1/admin/' + id);
};

/**
 * 生成随机密码
 */
export const generatePassword = () => {
  return service.get('/v1/admin/generate/password');
};

/**
 * 获取用户统计信息
 */
export const getAdminStatistics = ({farmId}) => {
  return service.get('/v1/admin/statistics?farmId=' + farmId);
};

/**
 * 更新密码
 */
export const updateAdminPassword = ({id, newPassword, password}) => {
  return service.patch(util.format('/v1/admin/{0}', id), {newPassword, password});
};

/**
 * 个人中心更改手机号
 */
export const updateAdminMobile = ({id, mobile, code}) => {
  return service.patch('/v1/admin/mobile', {id, mobile, code});
};


