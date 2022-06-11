// 经营人员管理
import _ from 'lodash';
import {
  DEFAULT_LIST,
  DEFAULT_PAGINATION
} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  keyword: '',
  subsidyType: '', // 补贴类型
  subsidyStatus: '' // 补贴状态
};

const defaultAccountArrival = {
  amount: '', // 到账金额
  date: '', // 到账日期
  mode: '', // 到账方式
  fileList: [], // 到账证明
  isExpanded: true // 展开收起
};

const defaultUseDetail = {
  amount: '', // 使用金额
  type: '', // 费用类型
  voucherNo: '', // 资金使用凭证号
  date: '', // 费用产生日期
  fileList: [], // 凭证文件
  isExpanded: true // 展开收起
};

const defaultSubsidy = {
  fileNo: '', // 文件编号
  applyManager: '', // 申请负责人
  applicantTel: '', // 申请人电话
  governmentAgent: '', // 政府负责人
  governmentAgentTel: '', // 政府负责人电话
  applyTime: '', // 申请时间
  approveTime: '', // 通过时间
  subsidyMoney: '', // 补贴金额
  subsidyStatus: '', // 补贴状态
  subsidyType: '', // 补贴类型
  accountTotal: '', // 到账总计
  createdAt: '',
  updatedAt: '',
  accountArrival: [],
  useDetail: [],
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',  
};

const state = {
  searchField: _.cloneDeep(defaultSearchFiled),
  list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
  currentSubsidy: _.cloneDeep(defaultSubsidy)
};

const getters = {
  searchField(state) {
    return state.searchField;
  },
  list(state) {
    return state.list;
  },
  currentSubsidy(state) {
    return state.currentSubsidy;
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
  setCurrentSubsidy(state, payload) {
    let {
      subsidy
    } = payload;
    state.currentSubsidy = formatData(subsidy);
  },
  updateCurrentSubsidy(state, payload) {
    let {
      key,
      value
    } = payload;
    _.set(state.currentSubsidy, key, value);
  },
  updateExpandedByKeyIndex(state, payload) {
    let {
      key,
      index
    } = payload;

    state.currentSubsidy[key] = state.currentSubsidy[key].map((item, _index) => {
      if (index === _index) {
        item.isExpanded = !item.isExpanded;
      }
      return item;
    });
  },
  resetCurrentSubsidy(state) {
    state.currentSubsidy = _.cloneDeep(defaultSubsidy);
  },
  // 培训操作
  addAccountArrival(state) {
    state.currentSubsidy.accountArrival.push(_.cloneDeep(defaultAccountArrival));
  },
  deleteAccountArrivalByIndex(state, payload) {
    let {
      index
    } = payload;
    state.currentSubsidy.accountArrival.splice(index, 1);
  },
  // 证书操作
  addUseDetail(state) {
    state.currentSubsidy.useDetail.push(_.cloneDeep(defaultUseDetail));
  },
  deleteUseDetailByIndex(state, payload) {
    let {
      index
    } = payload;
    state.currentSubsidy.useDetail.splice(index, 1);
  }
}

let isLoading = false;
const actions = {
  async createSubsidy({
    state
  }, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {
          currentSubsidy
        } = state;
        let reqBody = _.cloneDeep(Object.assign({}, serializeData(currentSubsidy), {
          farmId: id
        }));
        let res = await service.createSubsidy(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async updateSubsidyById({
    state
  }, {
    id,
    farmId
  }) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {
          currentSubsidy
        } = state;
        let reqBody = Object.assign({}, serializeData(currentSubsidy), {
          id
        }, {
          farmId
        });
        let res = await service.updateSubsidyById(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async deleteSubsidyById({}, id) { // eslint-disable-line
    try {
      if (!isLoading) {
        isLoading = true;
        let res = await service.deleteSubsidyById(id);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async getSubsidyById({
    commit
  }, id) {
    try {
      let res = await service.getSubsidyById(id);
      if (res && res.code === 0) {
        commit('setCurrentSubsidy', {
          subsidy: formatData(res.data)
        });
      }
      return res;
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async getSubsidyList({
    state,
    commit
  }, id) {
    try {
      let params = Object.assign({}, state.searchField, state.list.pagination, {
        farmId: id,
        pageNum: state.list.pagination.pageNum - 1
      });
      let res = await service.getSubsidyList(params);
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
  if (!_.isArray(data.accountArrival)) {
    data.accountArrival = [];
  }
  if (!_.isArray(data.useDetail)) {
    data.useDetail = [];
  }

  data.accountArrival = data.accountArrival.map((item) => {
    item.isExpanded = true;
    return item;
  });

  data.useDetail = data.useDetail.map((item) => {
    item.isExpanded = true;
    return item;
  });

  return Object.assign({}, data);
}

function serializeData(data) {
  let accountTotal = data.accountArrival.reduce((res, curr) => {
    res += parseInt(curr.amount);
    return res;
  }, 0);
  return Object.assign({}, data, {
    accountTotal
  });
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
