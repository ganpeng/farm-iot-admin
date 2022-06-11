<template>
  <div class="tracing-source-list-container my-content-container">
    <my-bord :bordList="bordList"></my-bord>
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.keyword"
              clearable
              placeholder="商品名称"
              @input="inputHandler($event, 'keyword')"
            ></el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">分类</label>
            <el-select
              class="big-select"
              :value="searchField.categoryName"
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'categoryId')">
              <el-option
                v-for="(item, index) in categoryOptions"
                :key="index"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">上下架</label>
            <el-select
              class="big-select"
              :value="searchField.marketEnable"
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'marketEnable')">
              <el-option
                v-for="(item, index) in marketEnableOption"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">状态</label>
            <el-select
              :value="searchField.disabled"
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'disabled')"
            >
              <el-option
                v-for="(item, index) in disabledOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div @click="clearSearchField" class="clear-btn">
            <span class="reset-icon">
              <svg-icon class="reset-btn" icon-class="reset_btn"/>
              <svg-icon class="reset-btn-active" icon-class="reset_btn_active"/>
            </span>
            重置
          </div>
        </div>
        <div class="row-right">
          <el-button
            :class="['btn-style-two', multipleSelection.length === 0 && 'is-disabled']"
            @click="bindFarmHandler">
            <!-- <svg-icon icon-class="add_plus"/> -->
            绑定农场
          </el-button>
        </div>
      </div>
    </div>
    <div class="tabel-field">
      <el-table
        header-row-class-name="common-table-header"
        size="small"
        :row-class-name="tableRowClassName"
        class="my-table-style"
        @selection-change="handleSelectionChange"
        :data="list.data">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column min-width="220px" label="商品名称">
          <template slot-scope="scope">
            <span
              @click="gotoCommodityDetailHandler(scope.row.goodsId)"
              class="ellipsis two detail-name"
            >{{scope.row.goodsName}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="商品ID">
          <template slot-scope="scope">{{scope.row.goodsId}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="分类">
          <template slot-scope="scope">{{scope.row.categoryName}}</template>
        </el-table-column>
        <el-table-column min-width="70px" label="价格(元)">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="店铺名称">
          <template slot-scope="scope">{{scope.row.sellerName}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="所属农场">
          <template slot-scope="scope">{{scope.row.farmName || '/'}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="上下架">
          <template slot-scope="scope">{{scope.row.marketEnable === 0 ? '下架' : '上架'}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="创建时间">
          <template slot-scope="scope">{{filterDate(scope.row.createTime) | formatDate('yyyy-MM-DD')}}</template>
        </el-table-column>
        <el-table-column min-width="60px" label="状态">
          <template slot-scope="scope">{{scope.row.disabled === 1 ? '正常' : '已删除'}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span :class="['btn-text', !scope.row.farmId && 'disabled']" @click="TracingManageHandler(scope.row, scope.$index)">溯源管理</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handlePaginationChange($event, 'pageSize')"
      @current-change="handlePaginationChange($event, 'pageNum')"
      :current-page="list.pagination.pageNum"
      :page-sizes="[10, 20, 50,100, 200, 500]"
      :page-size="list.pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.pagination.total"
    ></el-pagination>
    <bind-farm-dialog ref="bindFarmDialog"></bind-farm-dialog>
  </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import _ from "lodash";
import MyBord from "@/components/MyBord";
import constants from "@/util/constants";
import BindFarmDialog from './BindFarmDialog';
export default {
  name: 'CommodityList',
  components: {MyBord, BindFarmDialog},
  data() {
    return {
      categoryOptions: [],
      multipleSelection: [],
      disabledOptions: [
        {
          label: '正常',
          value: 1
        },
        {
          label: '已删除',
          value: 0
        }
      ],
      bordList: [],
      marketEnableOption: constants.MARKET_ENABLE,
    };
  },
  computed: {
    ...mapGetters({
      list: "commodity/list",
      searchField: "commodity/searchField"
    }),
    filterDate() {
      return (date) => {
        return parseInt(`${date}000`);
        // return _.isNumber(date) ? date * 1000 : date;
      };
    }
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyupHandler);
  },
  async created() {
    try {
      this.resetSearchField();
      this.resetList();
      this.getCommodityList();
      this.getCommodityCategory();
      this.getGoodsTypes();
      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "commodity/updateSearchField",
      updatePagination: "commodity/updatePagination",
      resetSearchField: "commodity/resetSearchField",
      resetPagination: "commodity/resetPagination",
      resetList: "commodity/resetList",
    }),
    ...mapActions({
      getCommodityList: "commodity/getCommodityList",
      deleteFarmById: "commodity/deleteFarmById"
    }),
    tableRowClassName({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    async getFarmCount() {
      try {
        let res = await this.$service.getFarmCount();
        if (res && res.code === 0) {
          let bordList = [];
          let totalFarm = {
            title: '总数',
            count: _.get(res.data, '0.totalFarmNum')
          };
          let cooperativeFarm = {
            title: '农民专业合作社',
            count: _.get(res.data, '0.cooperativeFarmNum')
          };
          let nationalFarm = {
            title: '国有企业',
            count: _.get(res.data, '0.nationalFarmNum')
          };
          let personalFarm = {
            title: '个体企业',
            count: _.get(res.data, '0.personalFarmNum')
          };
          let otherFarmNum = {
            title: '其它',
            count: _.get(res.data, '0.otherFarmNum')
          };
          bordList.push(totalFarm);
          bordList.push(cooperativeFarm);
          bordList.push(nationalFarm);
          bordList.push(personalFarm);
          bordList.push(otherFarmNum);
          this.bordList = bordList;
        }
      } catch (err) {
        console.log(err);
      }
    },
    keyupHandler(e) {
      if (e.keyCode === 13) {
        this.searchHandler();
      }
    },
    inputHandler(value, key) {
      if (key === 'categoryId') {
        let {categoryId, categoryPath, name} = value;
        this.updateSearchField({key: 'categoryId', value: categoryId});
        this.updateSearchField({key: 'categoryPath', value: categoryPath});
        this.updateSearchField({key: 'categoryName', value: name});

        this.searchHandler();
      } else {
        this.updateSearchField({key, value});
        if (key !== 'keyword') {
          this.searchHandler();
        }
      }
    },
    searchHandler() {
      if (this.searchField.keyword) {
        this.updatePagination({key: 'pageNum', value: 1});
      }
      this.getCommodityList();
    },
    clearSearchField() {
      this.resetSearchField();
      this.resetPagination();
      this.searchHandler();
    },
    handlePaginationChange(value, key) {
      this.updatePagination({key, value});
      this.searchHandler();
    },
    getCommodityCategory() {
      this.$service.getCommodityCategory()
        .then((res) => {
          this.categoryOptions = res.data || [];
        }).catch((err) => {
          console.log(err);
        });
    },
    getGoodsTypes() {
      this.$service.getGoodsTypes().then(res => {
        let data = res.data,
        list = [];
        for(let key in data) {
          let obj = {};
          obj.title = key;
          obj.count = data[key];
          if(key !== '总数') {
            list.push(obj);
          } else {
            list.unshift(obj);
          }
        }
        this.bordList = list;
      }).catch((err) => {
          console.log(err);
        });
    },
    TracingManageHandler(goods, index) {
      if (!this.$authority.isHasAuthority('admin:trace:add')) {
        return;
      }
      let {farmId, goodsId} = goods
      if (farmId) {
        this.$router.push({name: "CommodityEdit", params: {id: goodsId}});
      } else {
        this.$message.error('该店铺未关联农场，请前往农场列表绑定');
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    gotoCommodityDetailHandler(id) {
      if (!this.$authority.isHasAuthority('admin:goods:detail')) {
        return;
      }
      this.$router.push({name: "CommodityDetail", params: {id}});
    },
    // 绑定农场
    bindFarmHandler() {
      if (this.multipleSelection.length > 0) {
        this.$refs.bindFarmDialog.show(this.multipleSelection);
      }
    }
  }
};
</script>
<style lang="scss">
.big-select {
  width: 150px;
  .el-input__inner {
    width: 150px!important;
  }
}

.tracing-source-list-container {
  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    color: #DAEDFF;
    background-color: #2692FF;
    opacity: 0.8;
  }
}
</style>
