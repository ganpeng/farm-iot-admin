import {Message} from 'element-ui';
import wsCache from './webStorage';

/**
 * 判断权限模块
 */
let authority = {
  isBigScreenAuth() {
    if (wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN') {
      return true;
    }
    let list = wsCache.localStorage.get('login').resourceList;
    let index = list.findIndex((item) => item.resourceName === `大屏统计`);
    if (index >= 0) {
      return true;
    } else {
      Message.warning('暂无此权限，请联系平台管理员');
      return false;
    }
  },
  isHasAuthority(authorityName, noMessage) {
    if (wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN') {
      return true;
    }
    let list = wsCache.localStorage.get('login').resourceList;
    let tag = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].permission === authorityName) {
        tag = true;
      }
    }
    if (!tag && !noMessage) {
      Message.warning('暂无此权限，请联系平台管理员');
    }
    return tag;
  }
};

export default authority;
