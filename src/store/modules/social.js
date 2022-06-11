// 经营人员管理
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
    keyword: '',
    year: '', // 年
    serviceType: '', // 服务类型
    serviceClients: '' // 服务对象
};

const defaultSocial = {
  serviceClients: '', // 服务对象
  serviceType: '', // 服务类型
  serviceTime: '', // 服务时间
  revenue: '', // 服务营收
  revenueCertificates: [], // 营收证明
  createdAt: '',
  updatedAt: '',
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',  
};

const state = {
    searchField: _.cloneDeep(defaultSearchFiled),
    list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
    currentSocial: _.cloneDeep(defaultSocial)
};

const getters = {
    searchField(state) {
        return state.searchField;
    },
    list(state) {
        return state.list;
    },
    currentSocial(state) {
        return state.currentSocial;
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
    setCurrentSocial(state, payload) {
      let {social} = payload;
      state.currentSocial = formatData(social);
    },
    updateCurrentSocial(state, payload) {
        let {key, value} = payload;
        _.set(state.currentSocial, key, value);
    },
    resetCurrentSocial(state) {
        state.currentSocial = _.cloneDeep(defaultSocial);
    }
}

let isLoading = false;
const actions = {
    async createSocial({state}, id) {
        try {
            if (!isLoading) {
                isLoading = true;
                let {currentSocial} = state;
                let reqBody = _.cloneDeep(Object.assign({}, serializeData(currentSocial), {farmId: id}));
                let res = await service.createSocial(reqBody);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async updateSocialById({state}, {id, farmId}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let {currentSocial} = state;
                let reqBody = Object.assign({}, serializeData(currentSocial), {id}, {farmId});
                let res = await service.updateSocialById(reqBody);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async deleteSocialById({}, id) { // eslint-disable-line
        try {
            if (!isLoading) {
                isLoading = true;
                let res = await service.deleteSocialById(id);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async getSocialById({commit}, id) {
      try {
        let res = await service.getSocialById(id);
        if (res && res.code === 0) {
          commit('setCurrentSocial', {social: formatData(res.data)});
        }
        return res;
      } catch (err) {
        isLoading = false;
        console.log(err);
      }
    },
    async getSocialList({state, commit}, id) {
        try {
          let params = Object.assign({}, state.searchField, state.list.pagination, {
            farmId: id,
            pageNum: state.list.pagination.pageNum - 1
          });
          let res = await service.getSocialList(params);
          if (res && res.code === 0) {
            let {list, pageNum, pageSize, total} = res.data;
            commit('setList', {pageNum: pageNum + 1, pageSize, total, data: list});
          }
        } catch (err) {
            console.log(err);
        }
    }
};

function formatData(data) {
  return Object.assign({}, data);
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
