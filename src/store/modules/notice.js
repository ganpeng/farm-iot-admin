// 物理环境设备
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  keyword: '',
  noticeType: '', // WARNING NOTICE
  noticeStatus: '' // TO_EFFECT EFFECTING EXPIRED WITHDRAW DELETE
};

const defaultNotice = {
  effectiveEnd: '',
  effectiveStart: '',
  effectiveRange: [], // 有效期
  noticeDetail: '', // 消息详情
  noticeTitle: '', // 消息标题
  noticeType: '' // 消息类型
};

const state = {
  searchField: _.cloneDeep(defaultSearchFiled),
  list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
  currentNotice: _.cloneDeep(defaultNotice)
};

const getters = {
  searchField(state) {
      return state.searchField;
  },
  list(state) {
      return state.list;
  },
  currentNotice(state) {
      return state.currentNotice;
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
  setCurrentNotice(state, payload) {
      state.currentNotice = formatData(payload.currentNotice);
  },
  updateCurrentNotice(state, payload) {
      let {key, value} = payload;
      _.set(state.currentNotice, key, value);
  },
  resetCurrentNotice(state) {
      state.currentNotice = _.cloneDeep(defaultNotice);
  }
}

let isLoading = false;
const actions = {
  async createNotice({state}) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentNotice} = state;
        let reqBody = serializeData(currentNotice);
        let res = await service.createNotice(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async updateNoticeById({state}, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentNotice} = state;
        let reqBody = Object.assign({}, serializeData(currentNotice), {id});
        let res = await service.updateNotice(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async deleteNoticeById({}, id) { // eslint-disable-line
      try {
          if (!isLoading) {
              isLoading = true;
              let res = await service.deleteNoticeById(id);
              isLoading = false;
              return res;
          }
      } catch (err) {
          isLoading = false;
          console.log(err);
      }
  },
  async getNoticeById({commit}, id) {
    try {
      let res = await service.getNoticeById(id);
      if (res && res.code === 0) {
        commit('setCurrentNotice', {currentNotice: formatData(res.data)});
      }
      return res;
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getNoticeList({state, commit}) {
      try {
          let params = Object.assign({}, state.searchField, state.list.pagination, {
              pageNum: state.list.pagination.pageNum - 1
          });

          let res = await service.getNoticeList(params);
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
  let effectiveRange = [];
  if (data.effectiveStart) {
    effectiveRange.push(data.effectiveStart);
  }
  if (data.effectiveEnd) {
    effectiveRange.push(data.effectiveEnd);
  }
  return Object.assign({}, data, {effectiveRange});
}

function serializeData(data) {
  return Object.assign({}, data, {
    effectiveStart: _.get(data, 'effectiveRange.0') || '',
    effectiveEnd: _.get(data, 'effectiveRange.1') || ''
  });
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
