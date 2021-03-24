import Vue from 'vue'
import app from './app.vue'
import {router} from './router'
import {store} from './store/store'
import './assets/styles/main.scss'
import './registerServiceWorker'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';

// const Swal = require('sweetalert2')

import moment from 'moment';
moment().format();

export const eventBus = new Vue()




Vue.use(ElementUI, { locale });
// Vue.use(Swal)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')


