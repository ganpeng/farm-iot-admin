// 物理环境设备
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
    keyword: '',
    machineryType: '' // 类型
};

const defaultFarmMachine = {
  name: '', // 机械名称
  price: '', // 机械价格
  brand: '', // 品牌
  factory: '', // 生产厂家
  buyDate: '', // 购入日期
  farmId: '', // 农场id
  machineryType: '', // 机械类型
  powerType: '', // 动力类型
  ratedPower: '', // 额定功率
  stbNo: '', // 设备编号
  fileList: [], // 文件列表
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',
};

const state = {
    searchField: _.cloneDeep(defaultSearchFiled),
    list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
    currentFarmMachine: _.cloneDeep(defaultFarmMachine)
};

const getters = {
    searchField(state) {
        return state.searchField;
    },
    list(state) {
        return state.list;
    },
    currentFarmMachine(state) {
        return state.currentFarmMachine;
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
    setCurrentFarmMachine(state, payload) {
        state.currentFarmMachine = formatData(payload.farmMachine);
    },
    updateCurrentFarmMachine(state, payload) {
        let {key, value} = payload;
        _.set(state.currentFarmMachine, key, value);
    },
    resetCurrentFarmMachine(state) {
        state.currentFarmMachine = _.cloneDeep(defaultFarmMachine);
    }
}

let isLoading = false;
const actions = {
    async createFarmMachine({state}, id) {
        try {
            if (!isLoading) {
                isLoading = true;
                let {currentFarmMachine} = state;
                let reqBody = _.cloneDeep(Object.assign({}, currentFarmMachine, {farmId: id}));
                let res = await service.createFarmMachine(reqBody);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async updateFarmMachineById({state}, id) {
        try {
            if (!isLoading) {
                isLoading = true;
                let {currentFarmMachine} = state;
                let reqBody = Object.assign({}, currentFarmMachine, {id});
                let res = await service.updateFarmMachineById(reqBody);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async deleteFarmMachineById({}, id) { // eslint-disable-line
        try {
            if (!isLoading) {
                isLoading = true;
                let res = await service.deleteFarmMachineById(id);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async getFarmMachineById({commit}, id) {
      try {
        let res = await service.getFarmMachineById(id);
        if (res && res.code === 0) {
            commit('setCurrentFarmMachine', {farmMachine: formatData(res.data)});
        }
        return res;
      } catch (err) {
          isLoading = false;
          console.log(err);
      }
    },
    async getFarmMachineList({state, commit}, id) {
        try {
          let params = Object.assign({}, state.searchField, state.list.pagination, {
            farmId: id,
            pageNum: state.list.pagination.pageNum - 1
          });
          let res = await service.getFarmMachineList(params);
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
  if (!_.isArray(data.fileList)) {
    data.fileList = [];
  }
  return _.cloneDeep(data);
}

function serializeData() {
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
