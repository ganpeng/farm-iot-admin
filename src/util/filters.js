/**
 * @fileOverview Define global filters of Vue
 */

import Vue from 'vue';
import _ from 'lodash';
import util from './extend';

/**
 * The Object of filters.
 * @type {Object.<Function>}
 * @const
 */
const FILTERS = {
  formatDate(milliseconds, format) {
    milliseconds = _.toNumber(milliseconds);
    return milliseconds ? util.formatDate(new Date(milliseconds), format) : '';
  },
  // 转化对象数组中的某一个属性为字符
  jsonJoin(array, attr) {
    if (!array) return;
    let str = '';
    for (let i = 0; i < array.length; i++) {
      str = str + ',' + array[i][attr];
    }
    return str.slice(1);
  },
  imageUrl(uri) {
    // let baseUri = window.localStorage.getItem('imageBaseUri');
    // return baseUri + uri;
    return uri;
  },
  getCameraVendorName(tag) {
    return {'HAIKANG': '海康', 'DAHUA': '大华', 'HUAWEI': '华为', 'TIANDIWEIYE': '天地伟业'}[tag]
  },
  getSensorVendorName(tag) {
    return {'FLX': '飞利信'}[tag]
  },
  // 转化秒数为正常时间
  fromSecondsToTime(seconds) {
    return util.fromSecondsToTime(seconds);
  },
  padEmpty(value) {
    return value === '' || value === undefined || value === null ? '------' : value;
  },
  convertFileSize(size) {
    return util.convertFileSize(size);
  },
// 金额转换
  changeMoney(num) {
    const regexp = /(?:\.0*|(\.\d+?)0+)$/;
    if (num > 1000000) {
      num = JSON.stringify(num).slice(0, JSON.stringify(num).length - 4) / 100;
      return num + '万';
    } else {
      num = (num / 100).toFixed(2);
      num = num.replace(regexp, '$1');
      return num;
    }
  },
  pageSizes() {
    return [5, 10, 20, 50, 100, 200, 500];
  },
  // 传感器类型
  deviceType(str) {
    switch(str) {
      case 'PLANT':
        return '耕地种植';
        break;
      case 'FISHERY':
        return '水产养殖';
        break;
      case 'METEOROLOGY':
        return '气象传感器';
        break;
      default:
        return '/';
        break;
    }
  },

  checkStatus(status) {
    switch (status) {
      case "DELETE":
        return "已删除";
        break;
      case "APPROVING":
        return "待审核";
        break;
      case "REJECT":
        return "已拒绝";
        break;
      case "WITHDRAW":
        return "已撤回";
        break;
      case "APPROVED":
        return "已同意";
        break;
    }
  },
  toWanYuan(num) {
    if (!_.isNumber(parseFloat(num))) {
      return '0.00';
    }
    return (num / 10000).toFixed(2);
  }
};

/**
 * Register global filters in Vue.
 */
for (let filter in FILTERS) {
  Vue.filter(filter, FILTERS[filter]);
}

export default Vue;
