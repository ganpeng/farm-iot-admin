// 物理环境设备
import _ from 'lodash';
import {DEFAULT_LIST, DEFAULT_PAGINATION} from '@/util/constants';
import service from '@/service';

const defaultSearchFiled = {
  keyword: '',
  categoryId: '', // 分类
  categoryPath: '', // 分类相关
  categoryName: '', // 分类名
  disabled: '', // 是否已删除 1正常, 0已删除
  marketEnable: '', // 上下架 0 下架； 1上架
};

const defaultCommodity = {
  goodsId: '', // 商品Id
  goodsName: '', // 商品名称
  goodsVideo: '', // 商品视频
  price: '', // 价格
  intro: '', // 商品描述
  categoryId: '', // 分类id
  categoryName: '', // 分类名称
  disabled: '', // 是否被删除
  sellerId: '', // 店铺id
  sellerName: '', // 店铺名称
  thumbnail: '', // 商品icon
  samll: '', // 商品小图
  big: '', // 商品大图
  original: '', // 原始图
  createTime: '', // 创建时间
  marketEnable: '', //
  mobileIntro: '', //
  tracingList: _.times(3, () => {
    return _.cloneDeep(defaultTracing)
  }) // 溯源信息
};

const defaultTracing = {
  name: '',
  date: '',
  imageUrl: '',
  videoUrl: '',
  detailList: []
};

const state = {
  searchField: _.cloneDeep(defaultSearchFiled),
  list: _.cloneDeep(Object.assign(DEFAULT_LIST)),
  currentCommodity: _.cloneDeep(defaultCommodity),
};

const getters = {
  searchField(state) {
      return state.searchField;
  },
  list(state) {
      return state.list;
  },
  currentCommodity(state) {
      return state.currentCommodity;
  },
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
  setCurrentCommodity(state, payload) {
      state.currentCommodity = formatData(payload.currentCommodity);
  },
  updateCurrentCommodity(state, payload) {
      let {key, value} = payload;
      _.set(state.currentCommodity, key, value);
  },
  resetCurrentCommodity(state) {
      state.currentCommodity = _.cloneDeep(defaultCommodity);
  },
  // 溯源列表增删
  updateExpandedByKeyIndex(state, payload) {
    let {
      key,
      index
    } = payload;
    state.currentCommodity[key] = state.currentCommodity[key].map((item, _index) => {
      if (index === _index) {
        item.isExpanded = !item.isExpanded;
      }
      return item;
    });
  },
  // 培训操作
  addTracing(state) {
    state.currentCommodity.tracingList.push(_.cloneDeep(defaultTracing));
  },
  deleteTracingByIndex(state, payload) {
    let {index} = payload;
    state.currentCommodity.tracingList.splice(index, 1);
  },
  setListIndex(state, payload) {
    const {index} = payload;
    state.listIndex = index;
  }
}

let isLoading = false;
const actions = {
  async updateCommodityById({state}, id) {
    try {
      if (!isLoading) {
        isLoading = true;
        let {currentCommodity} = state;
        let reqBody = Object.assign({}, currentCommodity, {id});
        let res = await service.updateCommodityById(reqBody);
        isLoading = false;
        return res;
      }
    } catch (err) {
      isLoading = false;
      console.log(err);
    }
  },
  async deleteCommodityById({}, id) { // eslint-disable-line
      try {
          if (!isLoading) {
              isLoading = true;
              let res = await service.deleteCommodityById(id);
              isLoading = false;
              return res;
          }
      } catch (err) {
          isLoading = false;
          console.log(err);
      }
  },
  async getCommodityById({commit}, id) {
    try {
      let res = await service.getCommodityById(id);
      if (res && res.code === 0) {
        commit('setCurrentCommodity', {currentCommodity: formatData(res.data)});
      }
      return res;
    } catch (err) {
        isLoading = false;
        console.log(err);
    }
  },
  async getCommodityList({state, commit}) {
      try {
          let params = Object.assign({}, state.searchField, state.list.pagination, {
              pageNum: state.list.pagination.pageNum - 1
          });

          let res = await service.getCommodityList(params);
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
