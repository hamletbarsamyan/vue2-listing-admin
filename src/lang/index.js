import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Cookies from 'js-cookie';
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';// element-ui lang
import elementHyLocale from 'element-ui/lib/locale/lang/hy-AM';// element-ui lang
import elementRuLocale from 'element-ui/lib/locale/lang/ru-RU';// element-ui lang
import enLocale from './en-US';
import zhLocale from './zh-CN';
import hyLocale from './hy-AM';
import ruLocale from './ru-RU';

Vue.use(VueI18n);

const messages = {
  'en-US': {
    ...enLocale,
    ...elementEnLocale
  },
  'zh-CN': {
    ...zhLocale,
    ...elementZhLocale
  },
  'hy-AM': {
    ...hyLocale,
    ...elementHyLocale
  },
  'ru-RU': {
    ...ruLocale,
    ...elementRuLocale
  }
};

const i18n = new VueI18n({
  // set locale
  // options: en or zh
  locale: Cookies.get('language') || 'en-US',
  // set locale messages
  messages
});

export default i18n;
