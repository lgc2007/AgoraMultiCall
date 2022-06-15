/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-18 11:07:43
 * @LastEditors: lgc
 * @LastEditTime: 2022-03-16 17:57:14
 */
export default {
  required: type => {
    switch (type) {
      case 'number':
        return {
          type,
          required: false,
          message: '请输入数字值',
          trigger: 'change',
        };
      case 'any':
        return {
          required: true,
          validator: (rule, value, callback) => {
            if (value || value === 0) {
              return callback();
            }
            return callback(new Error('不能为空'));
          },
          trigger: 'change',
        };
      default:
        return {
          type,
          required: true,
          message: '不能为空',
          trigger: 'change',
        };
    }
  },
  /**
   * 英文、数字、下划线
   */
  checkEnglishChar: () => {
    return {
      required: true,
      validator: (rule, value, callback) => {
        if (/^\w+$/.test(value)) {
          callback();
        } else {
          callback(new Error('只允许输入英文、数字、下划线'));
        }
      },
      trigger: 'change',
    };
  },
  checkLength: (min, max) => {
    return {
      validator: (rule, value, callback) => {
        if (value) {
          if (value.length < min || value.length > max) {
            return callback(new Error(`长度在${min}到${max}个字符`));
          }
          callback();
        } else {
          callback();
        }
      },
      trigger: 'change',
    };
  },
  checkPhone: () => {
    return {
      validator: (rule, value, callback) => {
        if (value) {
          if (
            !/^(13[0-9]|14[1456789]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[1589])\d{8}$/.test(
              value,
            )
          ) {
            callback(new Error('请输入正确的手机号'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: 'change',
    };
  },
  /**
   * 中文、英文、下划线、数字，不能包含特殊符号
   * @return {{validator: (function(*, *=, *)), trigger: string}}
   */
  checkName: () => {
    return {
      required: true,
      validator: (rule, value, callback) => {
        if (/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value)) {
          callback();
        } else {
          callback(
            new Error('请输入中文、英文、数字、下划线，不能包含特殊符号哦~'),
          );
        }
      },
      trigger: 'change',
    };
  },
  /**
   * 邮箱
   * @return {{validator: (function(*, *=, *)), trigger: string}}
   */
  checkEmail: () => {
    return {
      required: false,
      validator: (rule, value, callback) => {
        if (value) {
          if (
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              value,
            )
          ) {
            callback();
          } else {
            callback(new Error('请输入正确的邮箱'));
          }
        } else {
          callback();
        }
      },
      trigger: 'change',
    };
  },
};
