import en_US from '@/assets/img/en_US.png';
import hy_AM from '@/assets/img/hy_AM.png';
import ru_RU from '@/assets/img/ru_RU.png';
import zh_CN from '@/assets/img/zh_CN.png';

const languageIconMap = { 'en_US': en_US, 'hy_AM': hy_AM, 'ru_RU': ru_RU, 'zh_CN': zh_CN };

export function getLanguageIconMap() {
  return languageIconMap;
}
