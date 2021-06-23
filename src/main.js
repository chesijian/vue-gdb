// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import { validUtil, cookieUtil } from '@/utils/utils.js'
import {sessionUtil} from './utils/sessionUtil'
import '@/public/css/zzStyle.css'
import '@/public/css/themeStyle.scss'
// import '@/public/js/easy-player-element.min.js'
require('./mock/index')
import store from './store'
import ElementUI from 'element-ui'
import VueBus from 'vue-bus'
import 'element-ui/lib/theme-chalk/index.css';
import '@/public/js/iconfontIndexNav.js';

import VueQuillEditor from 'vue-quill-editor'

import {util} from './utils/api'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'



import FormView from '@/common/form/form-view/form-view'
import FormEdit from '@/common/form/form-edit/form-edit'
import GridTreeTable from '@/common/form/grid-tree-table/grid-tree-table'
// import GridTable from '@/common/form/grid-table/grid-table'
// import SimpleTreeTable from '@/common/form/tree-table/tree-table'
import EditTable from '@/common/form/edit-table/edit-table'
import Tree from '@/common/form/tree/tree'
import TreeTable from 'tree-table-vue'

// import VCharts from 'v-charts'

Vue.component('form-view', FormView);
Vue.component('form-edit', FormEdit);
Vue.component('grid-tree-table', GridTreeTable)
    // Vue.component('grid-table', GridTable);
    // Vue.component('sp-tree-table', SimpleTreeTable);
Vue.component('edit-table', EditTable);
Vue.component('tree', Tree);

import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import VeRing from 'v-charts/lib/ring.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VeMap from 'v-charts/lib/map.common'

Vue.component(VeLine.name, VeLine)
Vue.component(VePie.name, VePie)
Vue.component(VeRing.name, VeRing)
Vue.component(VeHistogram.name, VeHistogram)
Vue.component(VeMap.name, VeMap)
import vmodal from 'vue-js-modal'
Vue.use(vmodal)
Vue.use(VueBus)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.use(TreeTable)
Vue.use(Viewer, {
        defaultOptions: {
            zIndex: 99999,
        }
    })
Vue.prototype.$echarts = echarts
Vue.prototype.util = util
Vue.prototype.validUtil = validUtil
Vue.prototype.cookieUtil = cookieUtil
Vue.prototype.sessionUtil = sessionUtil


Vue.component('remote-script', {
    render: function(createElement) {
        var self = this;
        return createElement('script', {
            attrs: {
                type: 'text/javascript',
                src: this.src
            },
            on: {
                load: function(event) {
                    self.$emit('load', event);
                    //console.info("remote-script=========load===========");
                },
                error: function(event) {
                    self.$emit('error', event);
                    //console.info("remote-script=========error===========");
                },
                readystatechange: function(event) {
                    if (this.readyState == 'complete') {
                        self.$emit('load', event);
                    }
                    //console.info("remote-script=========readystatechange===========");
                }
            }
        });
    },
    props: {
        src: {
            type: String,
            required: true
        }
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
    created() {
        window.vm_app = this
            
    },
    methods: {
        //   testGet() {

        //     this.util.restGet('/api_v1/token', { companyUid: this.sessionUtil.getCompanyUid(), start: 0, pageSize: 50 }, function(res) {
        //         console.info("============测试restful请求，token自动装填===========");
        //         console.info(res);
        //         this.cookieUtil.setSession(res)
        //     });
        // },
    }
})