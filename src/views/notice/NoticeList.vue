<template>
  <div class="notice-list-container my-content-container">
    <my-bord :width="270" :bordList="bordList"></my-bord>
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.keyword"
              clearable
              placeholder="标题、编号"
              @input="inputHandler($event, 'keyword')"
            ></el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">类型</label>
            <el-select
              class="big-select"
              :value="searchField.noticeType"
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'noticeType')">
              <el-option
                v-for="(item, index) in noticeTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">状态</label>
            <el-select
              :value="searchField.noticeStatus"
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'noticeStatus')"
            >
              <el-option
                v-for="(item, index) in noticeStatusOptions"
                :key="index"
                :label="item.name"
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
          <el-button class="btn-style-two" @click="createNoticeHandler">
            <svg-icon icon-class="add_plus"/>
            添加
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
        <el-table-column min-width="80px" label="消息编号">
          <template slot-scope="scope">{{scope.row.noticeNo}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="消息标题">
          <template slot-scope="scope">
            <span
              class="ellipsis"
            >{{scope.row.noticeTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px" label="消息类型">
          <template slot-scope="scope">{{noticeTypeName(scope.row.noticeType)}}</template>
        </el-table-column>
        <el-table-column min-width="280px" label="消息详情">
          <template slot-scope="scope">{{scope.row.noticeDetail}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="创建时间">
          <template slot-scope="scope">{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</template>
        </el-table-column>
        <el-table-column min-width="220px" label="有效期">
          <template slot-scope="scope">{{scope.row.effectiveStart | formatDate('yyyy-MM-DD HH:mm:SS')}} ~ {{scope.row.effectiveEnd | formatDate('yyyy-MM-DD HH:mm:SS')}}</template>
        </el-table-column>
        <el-table-column min-width="60px" label="状态">
          <template slot-scope="scope">{{noticeStatusName(scope.row.noticeStatus)}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span v-if="scope.row.noticeStatus === 'TO_EFFECT'" class="btn-text" @click="editNoticeHandler(scope.row)">编辑</span>
              <span v-if="scope.row.noticeStatus === 'EFFECTING'" class="btn-text" @click="withdrawNoticeHandler(scope.row)">撤销</span>
              <span v-if="scope.row.noticeStatus !== 'EFFECTING'" class="btn-text" @click="deleteNoticeHandler(scope.row)">删除</span>
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
  </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import _ from "lodash";
import MyBord from "@/components/MyBord";
import constants from "@/util/constants";
import options from '@/util/options';
export default {
  name: 'CommodityList',
  components: {MyBord},
  data() {
    return {
      multipleSelection: [],
      bordList: constants.COMMODITY_BORD_LIST,
      noticeTypeOptions: options.noticeTypeOptions,
      noticeStatusOptions: options.noticeStatusOptions
    };
  },
  computed: {
    ...mapGetters({
      list: "notice/list",
      searchField: "notice/searchField"
    }),
    noticeTypeName() {
      return (type) => {
        let option = this.noticeTypeOptions.find((option) => option.value === type);
        return _.get(option, 'name');
      };
    },
    noticeStatusName() {
      return (status) => {
        let option = this.noticeStatusOptions.find((option) => option.value === status);
        return _.get(option, 'name');
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
      this.getNoticeStatistics();
      if (!this.$authority.isHasAuthority('admin:notice:page')) {
        return;
      }
      this.getNoticeList();
      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "notice/updateSearchField",
      updatePagination: "notice/updatePagination",
      resetSearchField: "notice/resetSearchField",
      resetPagination: "notice/resetPagination",
      resetList: "notice/resetList"
    }),
    ...mapActions({
      getNoticeList: "notice/getNoticeList",
      deleteNoticeById: "notice/deleteNoticeById"
    }),
    tableRowClassName({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    async getNoticeStatistics() {
      try {
        let res = await this.$service.getNoticeStatistics();
        if (res && res.code === 0) {
          let bordList = [];
          let totalNums = {
            title: '总数',
            count: _.get(res.data, 'totalNums')
          };
          let warningNums = {
            title: '气象播报',
            count: _.get(res.data, 'warningNums')
          };
          let noticeNums = {
            title: '平台公告',
            count: _.get(res.data, 'noticeNums')
          };
          bordList.push(totalNums);
          bordList.push(warningNums);
          bordList.push(noticeNums);
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
      this.updateSearchField({key, value});
      if (key !== 'keyword') {
        this.searchHandler();
      }
    },
    searchHandler() {
      this.updatePagination({key: 'pageNum', value: 1});
      this.getNoticeList();
    },
    clearSearchField() {
      this.resetSearchField();
      this.resetPagination();
      this.searchHandler();
    },
    handlePaginationChange(value, key) {
      this.updatePagination({key, value});
      this.getNoticeList();
    },
    TracingManageHandler(goods) {
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
    createNoticeHandler() {
      if (!this.$authority.isHasAuthority('admin:notice:add')) {
        return;
      }
      this.$router.push({name: "NoticeCreate"});
    },
    editNoticeHandler(notice) {
      if (!this.$authority.isHasAuthority('admin:notice:edit')) {
        return;
      }
      let {id} = notice;
      this.$router.push({name: "NoticeEdit", params: {id}});
    },
    async withdrawNoticeHandler(notice) {
      try {
        if (!this.$authority.isHasAuthority('admin:notice:cancel')) {
          return;
        }
        let confirm = await this.$confirm("你确定要撤销该消息吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let {id} = notice;
          let res = await this.$service.operateNotice({id, noticeStatus: 'WITHDRAW'});
          if (res && res.code === 0) {
            this.searchHandler();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteNoticeHandler(notice) {
      try {
        if (!this.$authority.isHasAuthority('admin:notice:delete')) {
          return;
        }
        let confirm = await this.$confirm("你确定要删除该消息吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let {id} = notice;
          let res = await this.$service.deleteNoticeById(id);
          if (res && res.code === 0) {
            this.searchHandler();
          }
        }
      } catch (err) {
        console.log(err);
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
