// 宅基地管理
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  landName: '', // 地块名称
  plantName: '', // 作物
  plantType: '', // 作物类型
  irrigation: '', // 水利条件
  form: '', // 地块形式
};

const defaultHolder = {
  name: '', // 流转方姓名
  mobile: '', // 流转方手机号
  address: '', // 地址详情
  areaCode: '', // 地址编码
  contractPdfList: [], // 流转合同列表
  identityId: '', // 身份证号
  contractArea: '', // 合同面积
  area: '', // 实测面积
  authenticArea: '', // 确权面积
  dateRange: [],
  startedAt: '', // 流转开始日期
  endedAt: '', // 流转结束日期
  isExpanded: true // 展开收起
};

const defaultLand = {
  name: '', // 地块名称
  code: '', // 地块编码
  area: '', // 地块面积
  form: '', // 地块用途
  farmLandUrl: '', // 地图图片
  irrigation: '', // 水利条件
  boundary: '', // 地块范围
  areaCode: '', // 地址编码
  address: '', // 地址详情
  farmId: '', // 农场id
  form: '', // 组织形式
  holderMobile: '', // 流转方手机号
  holderName: '', // 流转方姓名
  landHolderList: [], // 流转方列表
  createdAt: '',
  updatedAt: '',
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',
  // 2020 12 22 wangshuo add end -- 农场审核 需要填写更新内容
};

const state = {
    searchField: _.cloneDeep(defaultSearchFiled),
    list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
    currentLand: _.cloneDeep(defaultLand)
};

const getters = {
    searchField(state) {
        return state.searchField;
    },
    list(state) {
        return state.list;
    },
    currentLand(state) {
        return state.currentLand;
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
  setCurrentLand(state, payload) {
    let {land} = payload;
    state.currentLand = formatData(land);
  },
  updateCurrentLand(state, payload) {
    let {key, value} = payload;
    _.set(state.currentLand, key, value);
  },
  updateExpandedByKeyIndex(state, payload) {
    let {
      key,
      index
    } = payload;
    state.currentLand[key] = state.currentLand[key].map((item, _index) => {
      if (index === _index) {
        item.isExpanded = !item.isExpanded;
      }
      return item;
    });
  },
  resetCurrentLand(state) {
    state.currentLand = _.cloneDeep(defaultLand);
  },
  // 培训操作
  addHolder(state) {
    state.currentLand.landHolderList.push(_.cloneDeep(defaultHolder));
  },
  deleteHolderByIndex(state, payload) {
    let {index} = payload;
    state.currentLand.landHolderList.splice(index, 1);
  }
}

let isLoading = false;
const actions = {
  async createLand({state}, id) {
      try {
          if (!isLoading) {
              isLoading = true;
              let {currentLand} = state;
              let reqBody = _.cloneDeep(Object.assign({}, serializeData(currentLand), {farmId: id}));
              let res = await service.createLand(reqBody);
              isLoading = false;
              return res;
          }
      } catch (err) {
          isLoading = false;
          console.log(err);
      }
  },
  async updateLandById({state}, {id, farmId}) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentLand} = state;
        let reqBody = Object.assign({}, serializeData(currentLand), {id}, {farmId});
        let res = await service.updateLandById(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async deleteLandById({}, id) { // eslint-disable-line
    try {
      if (!isLoading) {
        isLoading = true;
        let res = await service.deleteLandById(id);
        isLoading = false;
        return res;
      }
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getLandById({commit}, id) {
    try {
      let res = await service.getLandById(id);
      if (res && res.code === 0) {
        commit('setCurrentLand', {land: formatData(res.data)});
      }
      return res;
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async getLandList({state, commit}, id) {
    try {
      let params = Object.assign({}, state.searchField, state.list.pagination, {
        farmId: id,
        pageNum: state.list.pagination.pageNum - 1
      });
      let res = await service.getLandList(params);
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
  let landHolderList = data.landHolderList.map((item) => {
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
    item.isExpanded = true;

    return item;
  });
  return Object.assign({}, data, { landHolderList });
}

function serializeData(data) {
  let landHolderList = data.landHolderList.map((item) => {
    if (_.get(item, 'dateRange.0')) {
      item.startedAt = _.get(item, 'dateRange.0');
    }
    if (_.get(item, 'dateRange.1')) {
      item.endedAt = _.get(item, 'dateRange.1');
    }
    return item;
  });
  return Object.assign({}, data, { landHolderList });
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
