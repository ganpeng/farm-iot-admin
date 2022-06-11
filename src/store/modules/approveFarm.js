/* 
农场审核 再次编辑时提交
*/
// 物理环境设备
import _ from 'lodash';
import service from '@/service';

const defaultFarm = {
  approveDesc: '',  // 更新内容
  approveInfo: '', // 提交的审核信息
  approveStatus: '', //  状态
  approveUser: '', //  审核人
  farmId: '', //  农场ID
  farmName: '', //  农场名称
  farmName: '', //  农场名称
  id: '', // id
  modelId: '', // 模型ID
  modelName: '', // 模块
  reasonDesc: '', // 原因描述
  requestMethod: '', // 提交方式
  submitDate: '', // 提交时间
  submitUser: '', // 提交人
  url: '', // 链接
};

const state = {
  approveFarm: _.cloneDeep(defaultFarm)
};

const getters = {
  currentApproveFarm(state) {
    return state.approveFarm;
  }
};

const mutations = {
  // 当前农场
  setCurrentFarm(state, payload) {
      state.approveFarm = formatData(payload.farm);
  },
  updateCurrentApproveFarm(state, payload) {
      let {key, value} = payload;
      _.set(state.approveFarm, key, value);
  },
  resetCurrentFarm(state) {
      state.approveFarm = _.cloneDeep(defaultFarm);
  }
}

let isLoading = false;
const actions = {
  async updateManageMemberById({ state }, { id, farmId }) {
    try {
      if (!isLoading) {
        isLoading = true;
        let { approveFarm } = state;
        let reqBody = Object.assign({}, serializeData(approveFarm), { id }, { farmId });
        let res = await service.saveCheckRecord(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
};

function formatData(data) {
    if (!_.isArray(data.farmCertificates)) {
      data.farmCertificates = [];
    }

    if (!_.isArray(data.farmMarks)) {
      data.farmMarks = [];
    }
  return Object.assign({}, {contactAddr: ''}, data);
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
