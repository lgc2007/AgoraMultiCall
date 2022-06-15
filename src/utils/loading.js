import ElementUI from 'element-ui';
import { loadingConfig } from '@/settings'; // 全局的一个基本参数配置

var loading = null;
const loadingShow = () => {
    console.log(loadingConfig)
  loading = ElementUI.Loading.service(loadingConfig);
};

const loadingHide = () => {
  loading.close();
};

const loadingObj = {
  loadingShow,
  loadingHide,
};

export default loadingObj;
