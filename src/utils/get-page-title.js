/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-11-12 09:00:44
 * @LastEditors: lgc
 * @LastEditTime: 2021-11-30 16:26:11
 */
import defaultSettings from '@/settings';

const title = defaultSettings.title || '管理后台';

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
