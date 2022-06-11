
// 宅基地管理
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
    keyword: ''
};

const defaultP1 = {
  p1PlantDate: '', // 种植时间
  p1PlantName: '', // 作物名称
  p1PlantType: '', // 作物分类
  p1PlantedStart: '', // 育苗开始时间
  p1PlantedEnd: '', // 育苗结束时间
  dateRange: [], // 时间区间
  p1SeedBatchNo: '', // 种子批号
  p1SeedCompanyName: '', // 种子公司名称
  p1SeedName: '', // 作物品种
  p1FishCount: '', // 鱼的条数
  p1PlantNameOptions: [], // 作物名称下拉选项
  p1SeedNameOptions: [], // 品种下拉选项
  isExpanded: true // 展开收起
};

const defaultP2 = {
  type: '', // 类型
  class: '', // 分类
  factory: '', // 厂家
  batch: '', // 生产批次
  amount: '', // 投入量
  date: '', // 投入时间
  classOptions: [], // 分类选项
  isExpanded: true // 展开收起
};

const defaultP3 = {
  type: '', // 田间管理类型
  date: '', // 管理时间
  isExpanded: true // 展开收起
};

const defaultP4 = {
  area: '', // 采收面积
  mode: '', // 采收方式
  amount: '', // 采收产量
  averageAmount: '', // 平均亩产
  date: '', // 采收时间
  isExpanded: true // 展开收起
};

const defaultP5 = {
  party: '', // 加工方
  name: '', // 加工方名称
  no: '', // 加工厂商证件号
  batch: '', // 加工批次
  amount: '', // 加工量
  date: '', // 加工时间
  isExpanded: true // 展开收起
};

const defaultP6 = {
  type: '', // 仓储类型
  address: '', // 仓库地址
  totalAmount: '', // 仓库容量
  amount: '', // 本次容量
  date: '', // 入仓时间
  isExpanded: true // 展开收起
};

const defaultP7 = {
  org: '', // 检测机构
  date: '', // 检测时间
  user: '', // 送检人
  project: '', // 检测项目
  tester: '', // 检测员
  mobile: '', // 检测员电话
  fileList: [], // 检测报告
  isExpanded: true // 展开收起
};

const defaultP8 = {
  type: '', // 受灾类型
  date: '', // 受灾时间
  area: '', // 受灾面积
  reduce: '', // 预计减产
  lose: '', // 损失
  fileList: [], // 受灾图片
  isExpanded: true // 展开收起
};

const defaultP9 = {
  source: '', // 农机具来源
  type: '', // 农机具类型
  name: '', // 农机具名称
  date: '', // 使用时间
  area: '', // 做用面积
  isExpanded: true // 展开收起
};

const defaultPlant = {
  farmId: '', // 农场Id
  farmLandCode: '', // 地块编号
  farmLandId: '', // 地块Id
  area: '',// 地块面积
  p1PlantDate: '', // 种植时间
  p1PlantName: '', // 作物名称
  p1PlantType: '', // 作物分类
  p1PlantClass: '', // 作物品种
  p1PlantedStart: '', // 育苗开始时间
  p1PlantedEnd: '', // 育苗结束时间
  dateRange: [], // 时间区间
  p1SeedBatchNo: '', // 种子批号
  p1SeedCompanyName: '', // 种子公司名称
  p1SeedName: '', // 种子名称
  p1: [], // 第一步
  p2InputThing: [],
  p3FieldManage: [],
  p4HarvestManage: [],
  p5ProcessManage: [],
  p6SaveManage: [],
  p7CheckManage: [],
  p8DisasterInfo: [],
  p9MachineryUse: [],
  updatedAt: '',
  createdAt: '',
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',
  form: '', // 区分种植管理中地块类型： 水产 土地
  landName: '', // 地块名称
};

const state = {
    searchField: _.cloneDeep(defaultSearchFiled),
    list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
    currentPlant: _.cloneDeep(defaultPlant)
};

const getters = {
    searchField(state) {
        return state.searchField;
    },
    list(state) {
        return state.list;
    },
    currentPlant(state) {
        return state.currentPlant;
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
  setCurrentPlant(state, payload) {
    let {land} = payload;
    state.currentPlant = formatData(land);
  },
  updateCurrentPlant(state, payload) {
    let {key, value, index} = payload;
    _.set(state.currentPlant, key, value);
    if (/^p2InputThing\.[\d]\.type$/.test(key)) {
      _.set(state.currentPlant, `p2InputThing.${index}.class`, '');
    }
  },
  updateExpandedByKeyIndex(state, payload) {
    let {
      key,
      index
    } = payload;
    state.currentPlant[key] = state.currentPlant[key].map((item, _index) => {
      if (index === _index) {
        item.isExpanded = !item.isExpanded;
      }
      return item;
    });
  },
  resetCurrentPlant(state) {
    state.currentPlant = _.cloneDeep(defaultPlant);
  },
  // P1
  addP1(state) {
    state.currentPlant.p1.push(_.cloneDeep(defaultP1));
  },
  deleteP1ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p1.splice(index, 1);
  },
  // P2
  addP2(state) {
    state.currentPlant.p2InputThing.push(_.cloneDeep(defaultP2));
  },
  deleteP2ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p2InputThing.splice(index, 1);
  },
  // P3
  addP3(state) {
    state.currentPlant.p3FieldManage.push(_.cloneDeep(defaultP3));
  },
  deleteP3ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p3FieldManage.splice(index, 1);
  },
  // P4
  addP4(state) {
    state.currentPlant.p4HarvestManage.push(_.cloneDeep(defaultP4));
  },
  deleteP4ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p4HarvestManage.splice(index, 1);
  },
  // P5
  addP5(state) {
    state.currentPlant.p5ProcessManage.push(_.cloneDeep(defaultP5));
  },
  deleteP5ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p5ProcessManage.splice(index, 1);
  },
  // P6
  addP6(state) {
    state.currentPlant.p6SaveManage.push(_.cloneDeep(defaultP6));
  },
  deleteP6ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p6SaveManage.splice(index, 1);
  },
  // P7
  addP7(state) {
    state.currentPlant.p7CheckManage.push(_.cloneDeep(defaultP7));
  },
  deleteP7ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p7CheckManage.splice(index, 1);
  },
  // P8
  addP8(state) {
    state.currentPlant.p8DisasterInfo.push(_.cloneDeep(defaultP8));
  },
  deleteP8ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p8DisasterInfo.splice(index, 1);
  },
  // P9
  addP9(state) {
    state.currentPlant.p9MachineryUse.push(_.cloneDeep(defaultP9));
  },
  deleteP9ByIndex(state, payload) {
    let {index} = payload;
    state.currentPlant.p9MachineryUse.splice(index, 1);
  }
}

let isLoading = false;
const actions = {
  async createPlant({state}, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentPlant} = state;
        let reqBody = _.cloneDeep(Object.assign({}, serializeData(currentPlant), {farmId: id}));
        let res = await service.createPlant(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async getPlantById({commit}, id) {
    try {
      let res = await service.getPlantById(id);
      if (res && res.code === 0) {
        commit('setCurrentPlant', {land: formatData(res.data)});
      }
      return res;
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async getPlantHistory({commit, rootState}, params) {
    try {
      let res = await service.getPlantHistory(params);
      if (res && res.code === 0) {
        if (res.data) {
          commit('setCurrentPlant', {land: formatData(res.data, rootState)});
        } else {
          commit('resetCurrentPlant');
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  async deletePlant({state}, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentPlant} = state;
        let reqBody = _.cloneDeep(Object.assign({}, serializeData(currentPlant), {farmId: id}));
        let res = await service.deletePlant(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  }
};

function formatData(data) {
  if (data === null) {
    return _.cloneDeep(defaultPlant);
  }

  let dateRange = [];
  if (data.p1PlantedStart) {
    dateRange.push(data.p1PlantedStart);
  }
  if (data.p1PlantedEnd) {
    dateRange.push(data.p1PlantedEnd);
  }

  data.dateRange = dateRange;

  if (!_.isArray(data.p1)) {
    data.p1 = [];
  }
  if (!_.isArray(data.p2InputThing)) {
    data.p2InputThing = [];
  }
  if (!_.isArray(data.p3FieldManage)) {
    data.p3FieldManage = [];
  }
  if (!_.isArray(data.p4HarvestManage)) {
    data.p4HarvestManage = [];
  }
  if (!_.isArray(data.p5ProcessManage)) {
    data.p5ProcessManage = [];
  }
  if (!_.isArray(data.p6SaveManage)) {
    data.p6SaveManage = [];
  }
  if (!_.isArray(data.p7CheckManage)) {
    data.p7CheckManage = [];
  }
  if (!_.isArray(data.p8DisasterInfo)) {
    data.p8DisasterInfo = [];
  }
  if (!_.isArray(data.p9MachineryUse)) {
    data.p9MachineryUse = [];
  }

  let keyList = ['p1', 'p2InputThing', 'p3FieldManage', 'p4HarvestManage', 'p5ProcessManage',
                'p6SaveManage', 'p7CheckManage', 'p8DisasterInfo', 'p9MachineryUse'];
  keyList.forEach((key) => {
    data[key] = data[key].map((item) => {
      if (key === 'p1') {
        if (item.dateRange === undefined || item.dateRange === null) {
          item.dateRange = [];
        }
      }
      item.isExpanded = true;
      return item;
    })
  });

  return Object.assign({}, data);
}

function serializeData(data) {
  if (_.get(data, 'dateRange.0')) {
    data.p1PlantedStart = _.get(data, 'dateRange.0');
  }
  if (_.get(data, 'dateRange.1')) {
    data.p1PlantedEnd = _.get(data, 'dateRange.1');
  }

  let keyList = ['p1', 'p2InputThing', 'p3FieldManage', 'p4HarvestManage', 'p5ProcessManage',
                'p6SaveManage', 'p7CheckManage', 'p8DisasterInfo', 'p9MachineryUse'];
  keyList.forEach((key) => {
    data[key] = data[key].map((item) => {
      if (!item.uuid) {
        item.uuid = uuidv4();
      }
      return item;
    })
  });

  return Object.assign({}, data);
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
