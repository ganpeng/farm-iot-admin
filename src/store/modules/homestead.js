// 宅基地管理
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  landName: '' // 地块名称
};

const defaultHolder = {
  name: '', // 流转方姓名
  mobile: '', // 流转方手机号
  areaCode: '', // 地址编码
  contractPdfList: [], // 流转合同列表
  identityId: '', // 身份证号
  dateRange: [],
  startedAt: '', // 流转开始日期
  endedAt: '' // 流转结束日期
};

const defaultHomestead = {
  name: '', // 地块名称
  code: '', // 地块编码
  area: '', // 地块面积
  irrigation: '', // 水利条件
  boundary: '', // 地块范围
  areaCode: '', // 地址编码
  address: '', // 地址详情
  farmId: '', // 农场id
  form: '', // 组织形式
  holderMobile: '', // 流转方手机号
  holderName: '', // 流转方姓名
  homesteadHolderList: [], // 流转方列表
  house: false, // 是否有房屋
  propertyCertificate: false, // 是否有房产证
  idle: false, // 是否闲置
  purpose: '', // 地块用途
  createdAt: '',
  updatedAt: '',
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',
};

const state = {
    searchField: _.cloneDeep(defaultSearchFiled),
    list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
    currentHomestead: _.cloneDeep(defaultHomestead)
};

const getters = {
    searchField(state) {
        return state.searchField;
    },
    list(state) {
        return state.list;
    },
    currentHomestead(state) {
        return state.currentHomestead;
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
  setCurrentHomestead(state, payload) {
    let {homestead} = payload;
    state.currentHomestead = formatData(homestead);
  },
  updateCurrentHomestead(state, payload) {
      let {key, value} = payload;
      _.set(state.currentHomestead, key, value);
  },
  resetCurrentHomestead(state) {
      state.currentHomestead = _.cloneDeep(defaultHomestead);
  },
  // 培训操作
  addHolder(state) {
    state.currentHomestead.homesteadHolderList.push(_.cloneDeep(defaultHolder));
  },
  deleteHolderByIndex(state, payload) {
    let {index} = payload;
    state.currentHomestead.homesteadHolderList.splice(index, 1);
  }
}

let isLoading = false;
const actions = {
  async createHomestead({state}, id) {
      try {
          if (!isLoading) {
              isLoading = true;
              let {currentHomestead} = state;
              let reqBody = _.cloneDeep(Object.assign({}, serializeData(currentHomestead), {farmId: id}));
              let res = await service.createHomestead(reqBody);
              isLoading = false;
              return res;
          }
      } catch (err) {
          isLoading = false;
          console.log(err);
      }
  },
  async updateHomesteadById({state}, {id, farmId}) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentHomestead} = state;
        let reqBody = Object.assign({}, serializeData(currentHomestead), {id}, {farmId});
        let res = await service.updateHomesteadById(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async deleteHomesteadById({}, id) { // eslint-disable-line
    try {
      if (!isLoading) {
        isLoading = true;
        let res = await service.deleteHomesteadById(id);
        isLoading = false;
        return res;
      }
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getHomesteadById({commit}, id) {
    try {
      let res = await service.getHomesteadById(id);
      if (res && res.code === 0) {
          commit('setCurrentHomestead', {homestead: formatData(res.data)});
      }
      return res;
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getHomesteadList({state, commit}, id) {
      try {
        let params = Object.assign({}, state.searchField, state.list.pagination, {
          farmId: id,
          pageNum: state.list.pagination.pageNum - 1
        });
        let res = await service.getHomesteadList(params);
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
  let homesteadHolderList = data.homesteadHolderList.map((item) => {
    let dateRange = [];
    if (item.startedAt) {
      dateRange.push(item.startedAt);
    }
    if (item.endedAt) {
      dateRange.push(item.endedAt);
    }
    if (!_.isArray(item.contractPdfList)) {
      item.contractPdfList = [];
    }
    item.dateRange = dateRange;
    return item;
  });
  return Object.assign({}, data, { homesteadHolderList });
}

function serializeData(data) {
  let homesteadHolderList = data.homesteadHolderList.map((item) => {
    if (_.get(item, 'dateRange.0')) {
      item.startedAt = _.get(item, 'dateRange.0');
    }
    if (_.get(item, 'dateRange.1')) {
      item.endedAt = _.get(item, 'dateRange.1');
    }
    return item;
  });
  return Object.assign({}, data, { homesteadHolderList });
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
