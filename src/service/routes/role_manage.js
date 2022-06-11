/**
 * @fileOverview Define the API functions of role module
 */

import service from '../config';
import qs from 'querystring';
import util from "../../util/extend";

/**
 * 创建
 */
export const createRole = ({roleName, roleDesc, resourceList}) => {
  return service.post(`/v1/sys_role`, {roleName, roleDesc, resourceList});
};

/**
 * 编辑
 */
export const updateRoleInfo = ({id, roleName, roleDesc, resourceList}) => {
  return service.put(`/v1/sys_role/` + id, {roleName, roleDesc, resourceList});
};

/**
 * 获取列表
 */
export const getRoleList = ({keyword, pageNum, pageSize}) => {
  const params = {
    keyword,
    pageNum: pageNum - 1,
    pageSize
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/sys_role/page?${paramsStr}`);
};

/**
 * 获取角色的总数
 */
export const getRoleTotal = () => {
  const params = {
    pageNum: 0,
    pageSize: 10
  };

  let paramsStr = qs.stringify(_.pickBy(params, (item) => {
    return item !== '' && item !== undefined;
  }));

  return service.get(`/v1/sys_role/page?${paramsStr}`);
};

/**
 * 获取详情
 */
export const getRoleDetail = (id) => {
  return service.get(util.format('/v1/sys_role/{0}', id));
};

/**
 * 删除
 */
export const removeRole = (id) => {
  return service.delete('/v1/sys_role/' + id);
};

/**
 * 获取权限列表
 */
export const getRoleTreeResourceList = () => {
  return service.get('/v1/sys_resource');
};

/**
 * 获取角色列表--用于创建用户的数据源
 */
export const getSimpleRoleList = ({isAdmin}) => {
  return service.get('/v1/admin/role/list?isAdmin=' + isAdmin);
};
