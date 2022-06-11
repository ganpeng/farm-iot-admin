// 物理环境设备
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  keyword: '',
  batchNo: '', // 批次
  goodsId: '', // 商品Id
  activeStatus: '', // 状态 ACTIVE INACTIVE
  createdUser: '', // 创建者
  visible: '', // 上下架
  createdStart: '', // 创建开始时间
  createdEnd: '', // 创建结束时间
  createdDateRange: [], // 创建时间区间
  queryedStart: '', // 查询开始时间
  queryedEnd: '', // 查询结束时间
  queryDateRange: [] // 首次查询时间区间
};

const defaultTracingCode = {};

const state = {
  searchField: _.cloneDeep(defaultSearchFiled),
  list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
  currentTracingCode: _.cloneDeep(defaultTracingCode)
};

const getters = {
  searchField(state) {
      return state.searchField;
  },
  list(state) {
      return state.list;
  },
  currentTracingCode(state) {
      return state.currentTracingCode;
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
    if (key === 'createdDateRange') {
      state.searchField.createdStart = _.get(state.searchField, 'createdDateRange.0') || '';
      state.searchField.createdEnd = _.get(state.searchField, 'createdDateRange.1') || '';
    }
    if (key === 'queryDateRange') {
      state.searchField.queryedStart = _.get(state.searchField, 'queryDateRange.0') || '';
      state.searchField.queryedEnd = _.get(state.searchField, 'queryDateRange.1') || '';
    }
  },
  resetSearchField(state) {
      state.searchField = _.cloneDeep(defaultSearchFiled);
  },
  setCurrentTracingCode(state, payload) {
      state.currentTracingCode = formatData(payload.currentTracingCode);
  },
  updateCurrentTracingCode(state, payload) {
      let {key, value} = payload;
      _.set(state.currentTracingCode, key, value);
  },
  resetCurrentTracingCode(state) {
      state.currentTracingCode = _.cloneDeep(defaultTracingCode);
  }
}

let isLoading = false;
const actions = {
  async updateTracingCodeById({state}, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentTracingCode} = state;
        let reqBody = Object.assign({}, currentTracingCode, {id});
        let res = await service.updateTracingCodeById(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async getTracingCodeById({commit}, id) {
    try {
      let res = await service.getTracingCodeById(id);
      if (res && res.code === 0) {
        commit('setCurrentTracingCode', {currentTracingCode: formatData(res.data)});
      }
      return res;
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getTracingCodeList({state, commit}) {
      try {
          let params = Object.assign({}, state.searchField, state.list.pagination, {
              pageNum: state.list.pagination.pageNum - 1
          });

          let res = await service.getTracingCodeList(params);
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

// function serializeData(data) {
//   return Object.assign({}, data);
// }

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
