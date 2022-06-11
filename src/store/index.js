import Vue from 'vue';
import Vuex from 'vuex';

import farm from './modules/farm';
import farmMachine from './modules/farmMachine';
import manageMember from './modules/manageMember';
import plantMember from './modules/plantMember';
import homestead from './modules/homestead';
import land from './modules/land';
import governmentProject from './modules/governmentProject';
import subsidy from './modules/subsidy';
import social from './modules/social';
import plant from './modules/plant';
import dict from './modules/dict';
import commodity from './modules/commodity';
import tracingCode from './modules/tracingCode';
import batch from './modules/batch';
import notice from './modules/notice';
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    farm,
    farmMachine,
    manageMember,
    plantMember,
    homestead,
    land,
    governmentProject,
    subsidy,
    social,
    plant,
    dict,
    commodity,
    tracingCode,
    batch,
    notice
  }
});

export default store
