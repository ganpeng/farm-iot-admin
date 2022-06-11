import Vue from 'vue'
import * as ElementUI from 'element-ui';
import VCharts from 'v-charts';

//  导入elementUI的css样式
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.scss';

//  获取service
import store from '@/store'
import router from '@/router';
import service from '@/service';
import wsCache from '@/util/webStorage';
import util from '@/util/extend';
import authority from '@/util/authority';
import '@/util/filters';

import App from './App.vue'
// 按需引入echarts
import VeLine from 'v-charts/lib/line.common'
import NoData from '@/components/NoData';

Vue.component(VeLine.name, VeLine)
Vue.component('no-data', NoData);

// 全局指令
Vue.directive('dragscroll', {
  inserted: function(el) {
    el.onmousedown = (ev) => {
      const disX = ev.clientX;
      // const disY = ev.clientY;
      const originalScrollLeft = el.scrollLeft;
      // const originalScrollTop = el.scrollTop;
      const originalScrollBehavior = el.style['scroll-behavior'];
      const originalPointerEvents = el.style['pointer-events'];
      el.style['scroll-behavior'] = 'auto';
      // 鼠标移动事件是监听的整个document，这样可以使鼠标能够在元素外部移动的时候也能实现拖动
      document.onmousemove = (ev) => {
        ev.preventDefault();
        const distanceX = ev.clientX - disX;
        // const distanceY = ev.clientY - disY;
        el.scrollTo(originalScrollLeft - distanceX, 0);
        // el.scrollTo(originalScrollLeft - distanceX, originalScrollTop - distanceY);
        // 由于我们的图片本身有点击效果，所以需要在鼠标拖动的时候将点击事件屏蔽掉
        el.style['pointer-events'] = 'none';
      }
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        el.style['scroll-behavior'] = originalScrollBehavior;
        el.style['pointer-events'] = originalPointerEvents;
      }
    }
  }
});


//  初始化svg组件
import './icons';


Vue.config.productionTip = false;
Vue.prototype.$service = service;
Vue.prototype.$wsCache = wsCache;
Vue.prototype.$util = util;
Vue.prototype.$authority = authority;

Vue.use(ElementUI);
Vue.use(VCharts);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
