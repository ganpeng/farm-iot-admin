// 物理环境设备
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  keyword: '',
  batchNo: '', // 批号
  goodsId: '', // 商品Id
  startedAt: '', // 开始时间
  endedAt: '', // 结束时间
  dateRange: []
};

const defaultTracing = {
  name: '', // 步骤名称
  date: '', // 步骤时间
  imageUrl: [], // 图片
  videoUrl: '', // 视频
  detailList: [],
  moreInfo: '', // 其他说明
  isExpanded: true
};

const defaultBatch = {
  date: '', // 批次时间
  batchNo: '', // 批次号码
  goodsId: '', // 商品id
  goodsName: '', // 商品名称
  updateInfo: '', // 更新信息
  // wangshuo add 2021/05/10 start
  // 溯源相关升级-批次要和作物挂钩 查询农事记录
  farmName: '', // 农场名称
  farmId: '', // 农场Id 
  landName: '', // 地块名称
  landId: '', // 地块id
  plantName: '', // 作物名称
  // plantId: '', // 作物id 
  seedName: '', // 品种名称
  year: '', // 年份
  // wangshuo add 2021/05/10 end
  traceInfo: _.times(3, () => {
    return _.assign({}, defaultTracing);
  }) // 溯源信息
};

const defaultDetailData = {
  title: '',
  content: ''
};

const state = {
  searchField: _.cloneDeep(defaultSearchFiled),
  list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
  currentBatch: _.cloneDeep(defaultBatch)
};

const getters = {
  searchField(state) {
      return state.searchField;
  },
  list(state) {
      return state.list;
  },
  currentBatch(state) {
      return state.currentBatch;
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
  resetList() {
      state.list = _.cloneDeep(Object.assign(DEFAULT_LIST));
  },
  //  搜索
  updateSearchField(state, payload) {
      let {key, value} = payload;
      state.searchField[key] = value;
      if (key === 'dateRange') {
        state.searchField.startedAt = _.get(state.searchField, 'dateRange.0') || '';
        state.searchField.endedAt = _.get(state.searchField, 'dateRange.1') || '';
      }
  },
  resetSearchField(state) {
      state.searchField = _.cloneDeep(defaultSearchFiled);
  },
  setCurrentBatch(state, payload) {
      state.currentBatch = formatData(payload.batch);
  },
  updateCurrentBatch(state, payload) {
      let {key, value} = payload;
      _.set(state.currentBatch, key, value);
  },
  resetCurrentBatch(state) {
      state.currentBatch = _.cloneDeep(defaultBatch);
  },
  // 溯源列表增删
  updateExpandedByKeyIndex(state, payload) {
    let {
      key,
      index
    } = payload;
    state.currentBatch[key] = state.currentBatch[key].map((item, _index) => {
      if (index === _index) {
        item.isExpanded = !item.isExpanded;
      }
      return item;
    });
  },
  // 溯源步骤
  addTracing(state) {
    state.currentBatch.traceInfo.push(_.cloneDeep(defaultTracing));
  },
  deleteTracingByIndex(state, payload) {
    let {index} = payload;
    state.currentBatch.traceInfo.splice(index, 1);
  },
  // 详细数据
  addDetailDataItem(state, payload) {
    let {index} = payload;
    let traceInfo = state.currentBatch.traceInfo.map((item, _index) => {
      if (index === _index) {
        item.detailList =  _.concat(item.detailList, _.cloneDeep(defaultDetailData));
      }
      return item;
    });
    state.currentBatch.traceInfo = traceInfo;
  },
  deleteDetailDataItemByIndex(state, payload) {
    let { index, _index } = payload;
    state.currentBatch.traceInfo = state.currentBatch.traceInfo.map((item, i) => {
      if (i === index) {
        item.detailList = item.detailList.filter((_item, j) => j !== _index);
      }
      return item;
    });
  }
}

let isLoading = false;
const actions = {
  async createBatch({state}) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentBatch} = state;
        let reqBody = Object.assign({}, currentBatch);
        let res = await service.createBatch(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async updateBatchById({state}, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentBatch} = state;
        let reqBody = Object.assign({}, currentBatch, {id});
        let res = await service.updateBatchById(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async deleteBatchById({}, id) { // eslint-disable-line
      try {
          if (!isLoading) {
              isLoading = true;
              let res = await service.deleteBatchById(id);
              isLoading = false;
              return res;
          }
      } catch (err) {
          isLoading = false;
          console.log(err);
      }
  },
  async getBatchById({commit}, id) {
    try {
      let res = await service.getBatchById(id);
      if (res && res.code === 0) {
        commit('setCurrentBatch', {currentBatch: formatData(res.data)});
      }
      return res;
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getBatchList({state, commit}) {
      try {
          let params = Object.assign({}, state.searchField, state.list.pagination, {
              pageNum: state.list.pagination.pageNum - 1
          });

          let res = await service.getBatchList(params);
          if (res && res.code === 0) {
              let {list, pageNum, pageSize, total} = res.data;
              commit('setList', {pageNum: pageNum + 1, pageSize, total, data: list});
          }
      } catch (err) {
          console.log(err);
      }
  },
  async approveTraceSubmit({state}, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentBatch} = state;
        let reqBody = Object.assign({}, {approveInfo: currentBatch}, {id}, {updateInfo: currentBatch.updateInfo });
        let res = await service.approveTraceSubmit(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
};

function formatData(data) {
  if (!_.isArray(data.traceInfo)) {
    data.traceInfo = [];
  }
  data.traceInfo = data.traceInfo.map((trace) => {
    if (!_.isArray(trace.imageUrl)) {
      if (trace.imageUrl) {
        trace.imageUrl = [trace.imageUrl];
      } else {
        trace.imageUrl = [];
      }
    }

    // if (!_.isArray(trace.videoUrl)) {
    //   if (trace.videoUrl) {
    //     trace.videoUrl = [trace.videoUrl];
    //   } else {
    //     trace.videoUrl = [];
    //   }
    // }
    return trace;
  });

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
