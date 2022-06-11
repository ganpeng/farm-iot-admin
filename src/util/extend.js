import store from 'store';
import _ from 'lodash';
// import 'babel-polyfill';
import constants from './regx_constants.js';
import {Message, MessageBox} from 'element-ui';

let timer = null;

function strNumSize(tempNum) {
  let stringNum = tempNum.toString();
  let index = stringNum.indexOf(".");
  let newNum = stringNum;
  if (index != -1) {
    newNum = stringNum.substring(0, index);
  }
  return newNum.length;
}

function unitConvert(num) {
  let moneyUnits = ["元", "万元", "亿元", "万亿"];
  let dividend = 10000;
  let curentNum = num;
  //转换数字
  let curentUnit = moneyUnits[0];
  //转换单位
  for (let i = 0; i < 4; i++) {
    curentUnit = moneyUnits[i];
    if (strNumSize(curentNum) < 5) {
      break;
    }
    curentNum = curentNum / dividend;
  }
  let m = {
    num: 0,
    unit: ""
  };
  m.num = curentNum.toFixed(2);
  m.unit = curentUnit;
  return m;
}

/**
 * 扩展公共方法的工具类模块，使用ES6 module
 * @type {{trim: ((value))}}
 */
let util = {
  /**
   *remove white space
   * @param value
   * @return {String}
   */
  trim(value) {
    return value.toString().replace(/(^\s*) | (\s*$)/g, '');
  },
  /**
   *format string
   * @param {String} str  The base string
   * @param {...args} ...args The arguments which amount is not defined
   * @return {String} The final spelled string
   */
  format(str, ...args) {
    return str.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  },
  /**
   *Judge string is or not empty
   * @param {String} str  The base string
   * @return {Boolean} Is or not empty
   */
  isEmpty(str) {
    return str === null || str === undefined || constants.RegExpConstants.EMPTY.test(this.trim(str));
  },
  /**
   *Judge string is or not an email address
   * @param {String} str  The base string
   * @return {Boolean} Is or not an email address
   */
  isEmail(str) {
    return constants.RegExpConstants.EMAIL.test(this.trim(str));
  },
  /**
   *Judge string is or not a mobile number
   * @param {String} str  The base string
   * @return {Boolean} Is or not a mobile number
   */
  isMobile(str) {
    return constants.RegExpConstants.MOBILE.test(this.trim(str));
  },
  /**
   *Judge string is or not a telephone number
   * @param {String} str  The base string
   * @return {Boolean} Is or not a telephone number
   */
  isTelephone(str) {
    return constants.RegExpConstants.TELEPHONE.test(this.trim(str));
  },
  /**
   *Judge string is or not a right password in h5-admin project
   * @param {String} str  The base string as a password
   * @return {Boolean} Is or not a right password
   */
  isPassword(str) {
    return constants.RegExpConstants.PASSWORD.test(this.trim(str));
  },
  /**
   *Judge string is or not a right multicast IP address
   * @param {String} str  The base string as a multicast IP address
   * @return {Boolean} Is or not a right multicast IP address
   */
  isMulticastIPAddress(str) {
    return constants.RegExpConstants.MULTIPLE_IP_ADDRESS.test(this.trim(str));
  },
  /**
   * Judge string is or not a right IP address
   * @param {String} str  The base string as a IP address
   * @return {Boolean} Is or not a right IP address
   */
  isIPAddress(str) {
    return constants.RegExpConstants.IP_ADDRESS.test(this.trim(str));
  },
  /**
   *Judge string is or not a right IP port
   * @param {String} str  The base string as a Ip port
   * @return {Boolean} Is or not a right IP port
   */
  isPort(str) {
    return constants.RegExpConstants.IP_PORT.test(this.trim(str));
  },
  /**
   *Judge string is or not a web site address
   * @param {String} str  The base string as a Ip port
   * @return {Boolean} Is or not a right web site address
   */
  isWebSiteAddress(str) {
    return constants.RegExpConstants.WEB_SITE_ADDRESS.test(this.trim(str));
  },
  /**
   *Judge string is or not a channel no
   * @param {String} str  The base string as a channel no
   * @return {Boolean} Is or not a right channel no
   */
  isChannelNo(str) {
    return constants.RegExpConstants.CHANNEL_NO.test(this.trim(str)) && parseInt(this.trim(str)) !== 0;
  },
  /**
   *Judge string is or not a channel ts id
   * @param {String} str  The base string as a channel ts id
   * @return {Boolean} Is or not a right channel ts id
   */
  isChannelTsId(str) {
    return constants.RegExpConstants.CHANNEL_TS_ID.test(this.trim(str)) && parseInt(this.trim(str)) !== 0;
  },
  /**
   *Judge string is or not a channel service id
   * @param {String} str  The base string as a channel service id
   * @return {Boolean} Is or not a right channel service id
   */
  isChannelServiceId(str) {
    return constants.RegExpConstants.CHANNEL_SERVICE_ID.test(this.trim(str)) && parseInt(this.trim(str)) !== 0;
  },
  /**
   *Judge string is or not a national id
   * @param {String} str  The base string as a national id
   * @return {Boolean} Is or not a right channel national id
   */
  isNationalId(str) {
    return constants.RegExpConstants.NATIONAL_ID.test(this.trim(str)) && parseInt(this.trim(str)) !== 0;
  },
  /**
   * Format the date with specified format
   * @param {Date} date  The base string
   * @param {String} format  supported format options: yyyy: full year, MM: month, DD: date, HH: hours, mm: minutes, SS: seconds
   * @return {String} formated string
   **/
  formatDate(date, format) {
    if (format) {
      // handle yyyy
      format = format.replace(/yyyy/g, date.getFullYear());
    }
    if (format) {
      // handle MM
      format = format.replace(/MM/g, this.fillNumberBit(date.getMonth() + 1));
    }
    if (format) {
      // handle DD
      format = format.replace(/DD/g, this.fillNumberBit(date.getDate()));
    }
    if (format) {
      // handle HH
      format = format.replace(/HH/g, this.fillNumberBit(date.getHours()));
    }
    if (format) {
      // handle mm
      format = format.replace(/mm/g, this.fillNumberBit(date.getMinutes()));
    }
    if (format) {
      // handle SS
      format = format.replace(/SS/g, this.fillNumberBit(date.getSeconds()));
    }
    return format;
  },
  // 数字4变为04
  fillNumberBit(number) {
    return (parseInt(number) / 100).toFixed(2).toString().replace('0.', '');
  },
  fromSecondsToTime(seconds) {
    if (!seconds) {
      return '0秒';
    }
    let time = parseInt(seconds) + '秒';
    if (parseInt(seconds) > 60) {
      let second = parseInt(seconds) % 60;
      let min = parseInt(seconds / 60);
      time = min + '分' + second + '秒';
      if (min > 60) {
        min = parseInt(seconds / 60) % 60;
        let hour = parseInt(parseInt(seconds / 60) / 60);
        time = hour + '小时' + min + '分' + second + '秒';
        if (hour > 24) {
          hour = parseInt(parseInt(seconds / 60) / 60) % 24;
          let day = parseInt(parseInt(parseInt(seconds / 60) / 60) / 24);
          time = day + '天' + hour + '小时' + min + '分' + second + '秒';
        }
      }
    }
    return time;
  },
  getUploadHeaders(token) {
    let cookie = document.cookie;
    return {
      'Accept': 'application/json',
      'x-tianchi-client': '{"role":"ADVISER","version":"v1.1.1","deviceId":"1234fads"}',
      'x-tianchi-token': token,
      'x-tianchi-cookie': cookie
    };
  },
  getRandomUrl(uri, count) {
    let servers = store.get('servers') || [];
    let totalServers = servers.reduce((res, curr) => {
      let times = curr.weight;
      let currServers = [];
      for (let i = 0; i < times; i++) {
        currServers.push(`${curr.ip}:${curr.port}`);
      }
      return res.concat(currServers);
    }, []);

    if (count) {
      let index = count % totalServers.length;
      return `http://${totalServers[index]}${uri}`;
    } else {
      return `http://${_.sample(totalServers)}${uri}`;
    }
  },
  showNetworkErrorMessage() {
    if (window.navigator.onLine) {
      Message({
        message: '服务器连接失败，请稍后重试',
        type: 'error'
      });
    } else {
      Message({
        message: '网络连接失败，请检查您的网络连接情况',
        type: 'error'
      });
    }
  },
  toggleFixedBtnContainer() {
    let content = document.querySelector('.content');
    let fixedBtnContainer = document.querySelector('.fixed-btn-container');
    let isBottom = content.scrollHeight - content.scrollTop === content.clientHeight;
    if (fixedBtnContainer) {
      if (isBottom) {
        fixedBtnContainer.style.background = 'transparent';
        fixedBtnContainer.style.boxShadow = 'none';
      } else {
        fixedBtnContainer.style.background = '#293550';
        fixedBtnContainer.style.boxShadow = 'none';
      }
    }
  },
  cutStr(str, len) {
    let charLength = 0;
    if (!str) {
      return '';
    }
    for (let i = 0; i < str.length; i++) {
      let sonStr = str.charAt(i);
      encodeURI(sonStr).length > 2 ? charLength += 1 : charLength += 0.5;
      if (charLength >= len) {
        let subLen = charLength === len ? i + 1 : i;
        return `${str.substr(0, subLen)}...`;
      }
    }
    return str;
  },
  convertFileSize(size) {
    let kb = 1024;
    let mb = kb * 1024;
    let gb = mb * 1024;
    if (!size) {
      return '';
    }
    if (size >= gb) {
      return Math.round(size / gb) + 'Gb';
    } else if (size >= mb) {
      let f = size / mb;
      return Math.round(f) + 'Mb';
    } else if (size >= kb) {
      let f = size / kb;
      return Math.round(f) + 'Kb';
    } else {
      return size + 'Byte';
    }
  },
  //  银行家舍入法（四舍六入五取偶）
  bankersRounding(value, length) {
    let carry = 0; // 存放进位标志
    let num, multiple; // num为原浮点数放大multiple倍后的数，multiple为10的length次方
    let str = value + ''; // 将调用该方法的数字转为字符串
    let dot = str.indexOf('.'); // 找到小数点的位置
    if (str.substr(dot + length + 1, 1) >= 5) {
      carry = 1; // 找到要进行舍入的数的位置，手动判断是否大于等于5，满足条件进位标志置为1
    }
    multiple = Math.pow(10, length); // 设置浮点数要扩大的倍数
    num = Math.floor(value * multiple) + carry; // 去掉舍入位后的所有数，然后加上我们的手动进位数
    let result = num / multiple + ''; // 将进位后的整数再缩小为原浮点数
    // 处理进位后无小数
    dot = result.indexOf('.');
    if (dot < 0) {
      result += '.';
      dot = result.indexOf('.');
    }
    // 处理多次进位
    let len = result.length - (dot + 1);
    if (len < length) {
      for (let i = 0; i < length - len; i++) {
        result += 0;
      }
    }
    return result;
  },
  unitConvert,
  clipboardCopy (text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text).catch(function (err) {
        throw (err !== undefined ? err : new DOMException('The request is not allowed', 'NotAllowedError'));
      });
    }
    let span = document.createElement('span');
    span.textContent = text;
    span.style.whiteSpace = 'pre';
    document.body.appendChild(span);
    let selection = window.getSelection();
    let range = window.document.createRange();
    selection.removeAllRanges();
    range.selectNode(span);
    selection.addRange(range);
    let success = false;
    try {
      success = window.document.execCommand('copy');
    } catch (err) {
      console.log('error', err);
    }
    selection.removeAllRanges();
    window.document.body.removeChild(span);
    return success
      ? Promise.resolve()
      : Promise.reject(new DOMException('The request is not allowed', 'NotAllowedError'));
  },
};



export default util;
