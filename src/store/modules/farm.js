// 物理环境设备
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  keyword: '',
  farmType: '' // 类型
};

const defaultFarm = {
  name: '',  // 农场名称
  address: '', // 地址
  contactName: '', //  联系人名称
  contactTel: '', // 联系人电话
  contactAddr: '', // 联系人地址
  corporationAddr: '', // 法人地址
  corporationId: '', // 法人id
  corporationName: '', // 法人名称
  corporationTel: '', // 法人电话
  creditCode: '', // 统一社会信用代码
  description: '', // 详情
  farmType: '', // 农场类型
  feature: '', // 特色
  fieldArea: '', // 地块面积
  longitude: '', // 经度
  latitude: '', // 纬度
  manageType: '', // 经营项目
  manageTypes: [], // 经营项目多个
  partyOrg: false, // 是否成立党组织
  partyMemberNum: '', // 党组人数
  createdAt: '', // 创建日期
  farmIndexUrl: '', // 农场封面
  farmCertificates: [], // 农场证书
  farmVideoList: [], // 农场视频列表
  farmMarks: [],
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',
  // 2020 12 22 wangshuo add end -- 农场审核 需要填写更新内容
};

const state = {
  searchField: _.cloneDeep(defaultSearchFiled),
  list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
  currentFarm: _.cloneDeep(defaultFarm)
};

const getters = {
  searchField(state) {
      return state.searchField;
  },
  list(state) {
      return state.list;
  },
  currentFarm(state) {
      return state.currentFarm;
  }
};

const mutations = {
  // 分页
  setList(state, payload) {
      let {data, pageSize, pageNum, total} = payload;
      state.list.data = data;
      state.list.pagination.pageSize = pageSize;
      state.list.pagination.pageNum = pageNum;
      state.list.pagination.total = total;
  },
  resetList(state) {
    state.list = _.cloneDeep(Object.assign(DEFAULT_LIST));
  },
  setPagination(state, payload) {
      state.list.pagination.pageSize = payload.pageSize;
      state.list.pagination.pageNum = payload.pageNum;
      state.list.pagination.total = payload.total;
  },
  updatePagination(state, payload) {
      let {key, value} = payload;
      state.list.pagination[key] = value;
  },
  resetPagination() {
      state.list.pagination = _.cloneDeep(DEFAULT_PAGINATION);
  },
  //  搜索
  updateSearchField(state, payload) {
      let {key, value} = payload;
      state.searchField[key] = value;
  },
  resetSearchField(state) {
      state.searchField = _.cloneDeep(defaultSearchFiled);
  },
  // 当前农场
  setCurrentFarm(state, payload) {
      state.currentFarm = formatData(payload.farm);
  },
  updateCurrentFarm(state, payload) {
      let {key, value} = payload;
      _.set(state.currentFarm, key, value);
  },
  resetCurrentFarm(state) {
      state.currentFarm = _.cloneDeep(defaultFarm);
  }
}

let isLoading = false;
const actions = {
  async createFarm({state}) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentFarm} = state;
        let reqBody = _.cloneDeep(currentFarm);
        let res = await service.createFarm(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async updateFarmById({state}, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentFarm} = state;
        let reqBody = Object.assign({}, currentFarm, {id});
        let res = await service.updateFarmById(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async deleteFarmById({}, id) { // eslint-disable-line
      try {
          if (!isLoading) {
              isLoading = true;
              let res = await service.deleteFarmById(id);
              isLoading = false;
              return res;
          }
      } catch (err) {
          isLoading = false;
          console.log(err);
      }
  },
  async getFarmById({commit}, id) {
    try {
      commit('resetCurrentFarm');
      let res = await service.getFarmById(id);
      if (res && res.code === 0) {
        commit('setCurrentFarm', {farm: formatData(res.data)});
      }
      return res;
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getFarmByCheckId({commit}, id) {
    try {
      commit('resetCurrentFarm');
      let res = await service.getFarmByCheckId(id);
      if (res && res.code === 0) {
        commit('setCurrentFarm', {farm: formatData(res.data.approveInfo)});
      }
      return res;
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getFarmList({state, commit}) {
      try {
          let params = Object.assign({}, state.searchField, state.list.pagination, {
              pageNum: state.list.pagination.pageNum - 1
          });

          let res = await service.getFarmList(params);
          if (res && res.code === 0) {
              let {list, pageNum, pageSize, total} = res.data;
              commit('setList', {pageNum: pageNum + 1, pageSize, total, data: list});
          }
      } catch (err) {
          console.log(err);
      }
  },
  async approveFarmEditSubmit({state}, reqBody) {
    try {
      if (!isLoading) {
        isLoading = true;
        let res = await service.approveFarmSubmit(reqBody);
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

    if (!_.isArray(data.farmVideoList)) {
      data.farmVideoList = [];
    }

  return Object.assign({}, {contactAddr: ''}, data);
}

function serializeData(data) {
  return Object.assign({}, data);
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
