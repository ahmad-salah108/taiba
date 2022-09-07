require('./bootstrap');
import Vue from 'vue/dist/vue';
// window.Vue = require('vue');

window.Vue=Vue;
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import lang from 'element-ui/lib/locale/lang/ar';
import locale from 'element-ui/lib/locale';
// configure language
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(ElementUI);

locale.use(lang);
import {ToggleButton} from 'vue-js-toggle-button'
Vue.component('ToggleButton', ToggleButton)
import Multiselect from 'vue-multiselect';
Vue.component('multiselect', Multiselect);
require('./admin/index');
require('./agent/index');
require('./customers/index');
require('./driver/index');
require('./trip/index');
require('./trip/form');
require('./agent_trip/index');
require('./agent_trip/form');
require('./vehicle/index');
require('./export/excel');
require('./states/index');
require('./mixins/Export2Excel');
// require('./components/cofeeshops/ratings');

import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);

const app = new Vue({
    el: '#my-app',

    methods:{

        dataFormatter(value){
            return moment(value).format("YYYY-MM-DD hh:mm:s A ");
        },
        dateFormatter(value){
            return moment(value).format("YYYY-MM-DD");
        },

        onlyNumberKey(evt) {

            // Only ASCII charactar in that range allowed
            var ASCIICode = (evt.which) ? evt.which : evt.keyCode
            if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
                return false;
            return true;
        }
    }
});
