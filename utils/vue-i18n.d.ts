// vue-i18n.d.ts
import 'vue-i18n';
import { VueI18n } from 'vue-i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: VueI18n['t'];
  }
}
