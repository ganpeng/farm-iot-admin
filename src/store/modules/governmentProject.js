// 经营人员管理
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
    keyword: '',
    projectClass: '', // 级别
    projectStage: '' // 状态
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

const defaultGovernmentProject = {
  projectName: '', //项目名称
  projectClass: '', // 项目级别
  projectManager: '', // 项目负责人
  managerTel: '', // 负责人电话
  projectStage: '', // 项目阶段
  belongDepartment: '', // 所属部门
  projectStartedAt: '', // 项目开始日期
  projectEndedAt: '', // 项目结束日期
  dateRange: [], // 项目时间周期
  projectTotal: '', // 项目总额
  appropriation: '', // 政府拨款
  accountTotal: '', // 到账总计
  createdAt: '',
  updatedAt: '',
  accountArrival: [], // 到账情况
  useDetail: [], // 使用明细
  // 2020 12 22 wangshuo add start -- 农场审核 需要填写更新内容
  updateInfo: '',  
};

const state = {
    searchField: _.cloneDeep(defaultSearchFiled),
    list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
    currentGovernmentProject: _.cloneDeep(defaultGovernmentProject)
};

const getters = {
    searchField(state) {
        return state.searchField;
    },
    list(state) {
        return state.list;
    },
    currentGovernmentProject(state) {
        return state.currentGovernmentProject;
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
    setCurrentGovernmentProject(state, payload) {
      let {governmentProject} = payload;
      state.currentGovernmentProject = formatData(governmentProject);
    },
    updateCurrentGovernmentProject(state, payload) {
        let {key, value} = payload;
        _.set(state.currentGovernmentProject, key, value);
    },
    updateExpandedByKeyIndex(state, payload) {
      let {
        key,
        index
      } = payload;
      state.currentGovernmentProject[key] = state.currentGovernmentProject[key].map((item, _index) => {
        if (index === _index) {
          item.isExpanded = !item.isExpanded;
        }
        return item;
      });
    },
    resetCurrentGovernmentProject(state) {
        state.currentGovernmentProject = _.cloneDeep(defaultGovernmentProject);
    },
    // 到账情况
    addAccountArrival(state) {
      state.currentGovernmentProject.accountArrival.push(_.cloneDeep(defaultAccountArrival));
    },
    deleteAccountArrivalByIndex(state, payload) {
      let {index} = payload;
      state.currentGovernmentProject.accountArrival.splice(index, 1);
    },
    // 使用明细
    addUseDetail(state) {
      state.currentGovernmentProject.useDetail.push(_.cloneDeep(defaultUseDetail));
    },
    deleteUseDetailByIndex(state, payload) {
      let {index} = payload;
      state.currentGovernmentProject.useDetail.splice(index, 1);
    }
}

let isLoading = false;
const actions = {
    async createGovernmentProject({state}, id) {
        try {
            if (!isLoading) {
                isLoading = true;
                let {currentGovernmentProject} = state;
                let reqBody = _.cloneDeep(Object.assign({}, serializeData(currentGovernmentProject), {farmId: id}));
                let res = await service.createGovernmentProject(reqBody);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async updateGovernmentProjectById({state}, {id, farmId}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let {currentGovernmentProject} = state;
                let reqBody = Object.assign({}, serializeData(currentGovernmentProject), {id}, {farmId});
                let res = await service.updateGovernmentProjectById(reqBody);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async deleteGovernmentProjectById({}, id) { // eslint-disable-line
        try {
            if (!isLoading) {
                isLoading = true;
                let res = await service.deleteGovernmentProjectById(id);
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
            console.log(err);
        }
    },
    async getGovernmentProjectById({commit}, id) {
      try {
        let res = await service.getGovernmentProjectById(id);
        if (res && res.code === 0) {
          commit('setCurrentGovernmentProject', {governmentProject: formatData(res.data)});
        }
        return res;
      } catch (err) {
        isLoading = false;
        console.log(err);
      }
    },
    async getGovernmentProjectList({state, commit}, id) {
        try {
          let params = Object.assign({}, state.searchField, state.list.pagination, {
            farmId: id,
            pageNum: state.list.pagination.pageNum - 1
          });
          let res = await service.getGovernmentProjectList(params);
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
  let dateRange = [];
  if (data.projectStartedAt) {
    dateRange.push(data.projectStartedAt);
  }
  if (data.projectEndedAt) {
    dateRange.push(data.projectEndedAt);
  }

  data.dateRange = dateRange;

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
  if (_.get(data, 'dateRange.0')) {
    data.projectStartedAt = _.get(data, 'dateRange.0');
  }
  if (_.get(data, 'dateRange.1')) {
    data.projectEndedAt = _.get(data, 'dateRange.1');
  }

  let accountTotal = data.accountArrival.reduce((res, curr) => {
    res += parseInt(curr.amount);
    return res;
  }, 0);

  return Object.assign({}, data, {accountTotal});
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
