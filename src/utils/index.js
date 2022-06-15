import { constantRouterComponents } from '@/router';
/**
 * 文件大小转换
 * @param {*} time
 * @param {*} cFormat
 */
export function conver(limit) {
  if (!limit) return '';
  let size = '';
  if (limit < 1 * 1024) {
    // 如果小于1KB转化成B
    size = limit.toFixed(2) + 'B';
  } else if (limit < 1 * 1024 * 1024) {
    // 如果小于1MB转化成KB
    size = (limit / 1024).toFixed(2) + 'KB';
  } else if (limit < 1 * 1024 * 1024 * 1024) {
    // 如果小于1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }

  const sizestr = size + '';
  const len = sizestr.indexOf('.');
  const dec = sizestr.substr(len + 1, 2);
  if (dec === '00') {
    // 当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTimeold(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj_new(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}',
  );
}
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
}
/**
 * @param {*} el
 */
export function $(el) {
  console.log(document.querySelector(el));
  return document.querySelector(el);
}

/**
 * 处理url
 */
export function _getHashQueryAll() {
  const queryString = window.location.href.split('?')[1];
  if (queryString) {
    const queryArr = queryString.split('&');
    const queryJson = {};
    for (let i = 0; i < queryArr.length; i++) {
      const name = queryArr[i].split('=')[0];
      const value = queryArr[i].split('=')[1]
        ? decodeURIComponent(queryArr[i].split('=')[1])
        : '';
      queryJson[name] = value;
    }
    return queryJson;
  } else {
    return {};
  }
}
/**
 * 处理url
 */
export function replaceSearchParams(json) {
  const queryJson = _getHashQueryAll();
  Object.assign(queryJson, json);
  return queryJson;
}
/**
 * 权限控制
 */
export function permission({ user, key }) {
  return false;
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ]; }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach(v => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce_new(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 这只是深度复制的一个简单版本
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone_old(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + '';
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}
// -------------
/**
 * 判断变量的类型
 * @param {object} value 变量值
 */
export function checkType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

/**
 * 深拷贝（递归）
 * @param {*} sourceValue 需要拷贝的值
 */
export function deepClone(sourceValue) {
  // 如果传入的数据是简单类型（不是 {} & []），直接返回即可
  if (typeof sourceValue !== 'object') {
    return sourceValue;
  }
  // 判断 传入参数的数据类型(object or array)
  const targetType = checkType(sourceValue);
  // 根据传入参数的数据类型，创建 初始存储结果的变量类型 {} or []
  const result = targetType === 'Object' ? {} : [];
  // 遍历 sourceValue (for...in可以遍历数据和对象)
  // 避免数组内有自定义属性，遍历数组使用 for...of，遍历对象 for...in
  if (targetType === 'Array') {
    // 传入参数是数组时，次数使用的是 for...of 遍历，当然，也可以使用 数组的其他遍历方法
    for (const [key, value] of sourceValue.entries()) {
      const itemType = checkType(value);
      // 如果 value 是 数组 或 对象，则继续遍历
      if (itemType === 'Object' || itemType === 'Array') {
        result[key] = deepClone(value);
      } else {
        // 如果 value 是 基本数据类型 或者 函数，直接赋值即可
        result[key] = value;
      }
    }
  } else {
    // 传入参数是对象时
    for (const key in sourceValue) {
      // 遍历数组时，key 为数组的 下标
      // 遍历对象时，key 为对象的 key
      // hasOwnProperty 只能检验对象自身的属性，不能检验继承属性，也不能检验原型链上的属性
      if (sourceValue.hasOwnProperty(key)) {
        const item = sourceValue[key];
        const itemType = checkType(item);
        // 如果 value 是 数组 或 对象，则继续遍历
        if (itemType === 'Object' || itemType === 'Array') {
          result[key] = deepClone(item);
        } else {
          // 如果 value 是 基本数据类型 或者 函数，直接赋值即可
          result[key] = item;
        }
      }
    }
  }
  // 返回 result 即可
  return result;
}
export function doFlattenArr(menus) {
  const result = [];
  menus.forEach(menu => {
    if (menu.children) {
      result.push.apply(result, doFlattenArr(menu.children));
    } else {
      result.push(menu);
    }
  });
  return result;
}
/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export function urlArr () {
  return {
    loginoutUrl: window._loginoutUrl || '/login',
    portalUrl: window._portalUrl || '/zj/page_portal/portal'
  };
}
/**
 * 根据字段值匹配，改变表单项显示隐藏
 *
 * @param arr 要改变的数组
 * @param prop 字段名
 * @param boolean 赋值
 */
export const findObject = (arr, prop, boolean) => {
  arr.map(item => {
    if (item.props === prop) {
      item.hidden = boolean;
    }
  });
};
/**
 * 根据字段值匹配，改变表单项显示隐藏
 *
 * @param arr 要改变的数组
 * @param prop 要改变的prop对象
 * @param changeProp 要改变的对象中的key
 * @param value 赋值
 */
export const findPropObject = (arr, prop, changeProp, value) => {
  arr.map(item => {
    if (item.props === prop) {
      item[changeProp] = value;
    }
  });
};
/**
 * 完成将 toChineseNum， 可以将数字转换成中文大写的表示，处理到万级别，例如 toChineseNum(12345)，返回 一万二千三百四十五。
 *
 * @param arr 要改变的数组
 * @param prop 要改变的prop对象
 * @param changeProp 要改变的对象中的key
 * @param value 赋值
 */
export const toChineseNum = num => {
  const changeNum = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
  ]; // changeNum[0] = "零"
  const unit = ['', '十', '百', '千', '万'];
  num = parseInt(num);
  const getWan = temp => {
    const strArr = temp
      .toString()
      .split('')
      .reverse();
    let newNum = '';
    for (var i = 0; i < strArr.length; i++) {
      newNum =
               (i == 0 && strArr[i] == 0
                 ? ''
                 : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
                   ? ''
                   : changeNum[strArr[i]] +
                   (strArr[i] == 0 ? unit[0] : unit[i])) + newNum;
    }
    return newNum;
  };
  const overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) noWan = '0' + noWan;
  return overWan
    ? getWan(overWan) + '万' + getWan(noWan)
    : getWan(num);
};
