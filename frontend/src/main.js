import Vue from 'vue'
import app from './app.vue'
import {router} from './router'
import {store} from './store/store'
import './assets/styles/main.scss'
import './registerServiceWorker'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import moment from 'moment';
moment().format();



Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')


