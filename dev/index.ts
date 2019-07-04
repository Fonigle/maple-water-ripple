import Vue from 'vue';

import MapleWaterRipple from '@/index';
Vue.directive('ripple', MapleWaterRipple);

import App from './app.vue';

const vm = new Vue({
    el: '#app',
    render: h => h(App)
})