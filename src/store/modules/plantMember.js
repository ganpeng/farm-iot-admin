// 经营人员管理
import _ from 'lodash';
import {
  DEFAULT_LIST,
  DEFAULT_PAGINATION
} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  name: ''
};

const defaultTraining = {
  startDate: '', // 培训开始时间
  endDate: '', // 培训结束时间
  dateRange: [], // 培训时间段
  organizer: '', // 组织者
  type: '', // 培训类型
  url: [], // 培训证明
  isExpanded: true // 展开收起
};

const defaultCertificate = {
  authority: '', // 发证机关
  issueDate: '', // 发证时间
  name: '', // 证书名称
  url: [], // 证书文件地址
  isExpanded: true // 展开收起
};

const defaultPlantMember = {
  name: '', // 姓名
  mobile: '', // 联系方式
  gender: '', // 性别 NONE 保密 MALE 男 FEMALE 女
  identityId: '', // 证件号码
  identityType: 'ID_CARD', // 证件类型
  isPoor: false, // 是否是贫困户
  // duty: '', // 主要分工
  farmId: '', // 农场id
  address: '', // 详细地址
  areaCode: '', // 地址编码
  isFundInvest: false, // 现金出资
  fundAmount: '', // 出资金额
  isLandInvest: false, // 土地出资
  landArea: '', // 出地面积
  trainingList: [], // 参加培训列表
  certificateList: [], // 证书列表
  createdAt: '', // 创建时间
  updatedAt: '', // 更新时间
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',
  // 2020 12 22 wangshuo add end -- 农场审核 需要填写更新内容
};

const state = {
  searchField: _.cloneDeep(defaultSearchFiled),
  list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
  currentPlantMember: _.cloneDeep(defaultPlantMember)
};

const getters = {
  searchField(state) {
    return state.searchField;
  },
  list(state) {
    return state.list;
  },
  currentPlantMember(state) {
    return state.currentPlantMember;
  }
};

const mutations = {
  // 分页
  setList(state, payload) {
    let {
      data,
      pageSize,
      pageNum,
      total
    } = payload;
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
    let {
      key,
      value
    } = payload;
    state.list.pagination[key] = value;
  },
  resetPagination() {
    state.list.pagination = _.cloneDeep(DEFAULT_PAGINATION);
  },
  //  搜索
  updateSearchField(state, payload) {
    let {
      key,
      value
    } = payload;
    state.searchField[key] = value;
  },
  resetSearchField(state) {
    state.searchField = _.cloneDeep(defaultSearchFiled);
  },
  // 当前农场
  setCurrentPlantMember(state, payload) {
    let {
      manageMember
    } = payload;
    state.currentPlantMember = formatData(manageMember);
  },
  updateCurrentPlantMember(state, payload) {
    let {
      key,
      value
    } = payload;
    _.set(state.currentPlantMember, key, value);
  },
  updateExpandedByKeyIndex(state, payload) {
    let {
      key,
      index
    } = payload;
    state.currentPlantMember[key] = state.currentPlantMember[key].map((item, _index) => {
      if (index === _index) {
        item.isExpanded = !item.isExpanded;
      }
      return item;
    });
  },
  resetCurrentPlantMember(state) {
    state.currentPlantMember = _.cloneDeep(defaultPlantMember);
  },
  // 培训操作
  addTraining(state) {
    state.currentPlantMember.trainingList.push(_.cloneDeep(defaultTraining));
  },
  deleteTrainingByIndex(state, payload) {
    let {
      index
    } = payload;
    state.currentPlantMember.trainingList.splice(index, 1);
  },
  // 证书操作
  addCertificate(state) {
    state.currentPlantMember.certificateList.push(_.cloneDeep(defaultCertificate));
  },
  deleteCertificateByIndex(state, payload) {
    let {
      index
    } = payload;
    state.currentPlantMember.certificateList.splice(index, 1);
  }
}

let isLoading = false;
const actions = {
  async createPlantMember({
    state
  }, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {
          currentPlantMember
        } = state;
        let reqBody = _.cloneDeep(Object.assign({}, serializeData(currentPlantMember), {
          farmId: id
        }));
        let res = await service.createPlantMember(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async updatePlantMemberById({
    state
  }, {
    id,
    farmId
  }) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {
          currentPlantMember
        } = state;
        let reqBody = Object.assign({}, serializeData(currentPlantMember), {
          id
        }, {
          farmId
        });
        let res = await service.updatePlantMemberById(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async deletePlantMemberById({}, id) { // eslint-disable-line
    try {
      if (!isLoading) {
        isLoading = true;
        let res = await service.deletePlantMemberById(id);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async getPlantMemberById({
    commit
  }, id) {
    try {
      let res = await service.getPlantMemberById(id);
      if (res && res.code === 0) {
        commit('setCurrentPlantMember', {
          manageMember: formatData(res.data)
        });
      }
      return res;
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async getPlantMemberList({
    state,
    commit
  }, id) {
    try {
      let params = Object.assign({}, state.searchField, state.list.pagination, {
        farmId: id,
        pageNum: state.list.pagination.pageNum - 1
      });
      let res = await service.getPlantMemberList(params);
      if (res && res.code === 0) {
        let {
          list,
          pageNum,
          pageSize,
          total
        } = res.data;
        commit('setList', {
          pageNum: pageNum + 1,
          pageSize,
          total,
          data: list
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

function formatData(data) {
  let trainingList = data.trainingList.map((item) => {
    let dateRange = [];
    if (item.startDate) {
      dateRange.push(item.startDate);
    }
    if (item.endDate) {
      dateRange.push(item.endDate);
    }
    item.dateRange = dateRange;
    item.isExpanded = true;
    return item;
  });

  let certificateList = data.certificateList.map((item) => {
    item.isExpanded = true;
    return item;
  });

  return Object.assign({}, data, {
    trainingList,
    certificateList
  });
}

function serializeData(data) {
  let trainingList = data.trainingList.map((item) => {
    if (_.get(item, 'dateRange.0')) {
      item.startDate = _.get(item, 'dateRange.0');
    }
    if (_.get(item, 'dateRange.1')) {
      item.endDate = _.get(item, 'dateRange.1');
    }
    console.log(_.get(item, 'dateRange.0'));
    return item;
  });
  return Object.assign({}, data, {
    trainingList
  });
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
