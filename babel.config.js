/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-27 11:03:33
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-16 18:19:04
 */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};
