<template>
  <div class="list-container">
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.keyword"
              placeholder="补贴文件编号"
              @input="inputHandler($event, 'keyword')"
            >
            </el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">类型</label>
            <el-select
              :value="searchField.subsidyType"
              filterable
              clearable
              placeholder="全部"
              @input="inputHandler($event, 'subsidyType')"
            >
              <el-option
                v-for="(item, index) in subsidyTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">状态</label>
            <el-select
              :value="searchField.subsidyStatus"
              filterable
              clearable
              placeholder="全部"
              @input="inputHandler($event, 'subsidyStatus')"
            >
              <el-option
                v-for="(item, index) in subsidyStatusOptions"
                :key="index"
                :label="item.name"
                :value="item.name"
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
          <el-button class="btn-style-two contain-svg-icon" @click="createSubsidy">
            <svg-icon icon-class="add_plus"/>添加
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
        :data="list.data"
      >
        <el-table-column min-width="120px" label="补贴文件编号">
          <template slot-scope="scope">
            <span @click="showDetailHandler(scope.row)" class="ellipsis two name detail-name">{{scope.row.fileNo}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140px" label="补贴类型">
          <template slot-scope="scope">{{scope.row.subsidyType}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="申请时间">
          <template slot-scope="scope">{{scope.row.applyTime | formatDate('yyyy-MM-DD')}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="通过时间">
          <template slot-scope="scope">{{scope.row.approveTime | formatDate('yyyy-MM-DD')}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="补贴总额(元)">
          <template slot-scope="scope">{{scope.row.subsidyMoney}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="到账金额(元)">
          <template slot-scope="scope">{{scope.row.accountTotal}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="申请负责人">
          <template slot-scope="scope">{{scope.row.applyManager}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="申请人电话">
          <template slot-scope="scope">{{scope.row.applicantTel}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="政府负责人">
          <template slot-scope="scope">{{scope.row.governmentAgent}}</template>
        </el-table-column>
        <el-table-column min-width="140px" label="政府负责人电话">
          <template slot-scope="scope">{{scope.row.governmentAgentTel}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="状态">
          <template slot-scope="scope">{{scope.row.subsidyStatus}}</template>
        </el-table-column>
        <el-table-column width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span class="btn-text" @click="editSubsidyHandler(scope.row)">编辑</span>
              <span class="btn-text text-danger" @click="deleteSubsidyHandler(scope.row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handlePaginationChange($event, 'pageSize')"
      @current-change="handlePaginationChange($event, 'pageNum')"
      :current-page="list.pagination.pageNum"
      :page-sizes="[10, 30, 50,100, 200, 500]"
      :page-size="list.pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.pagination.total"
    ></el-pagination>
    <subsidy-dialog ref="subsidDialog"></subsidy-dialog>
    <subsidy-detail-dialog ref="subsidDetailDialog"></subsidy-detail-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import SubsidyDialog from "./SubsidyDialog";
import SubsidyDetailDialog from './SubsidyDetailDialog';
export default {
  name: "SubsidyList",
  components: {SubsidyDialog, SubsidyDetailDialog},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "subsidy/list",
      searchField: "subsidy/searchField",
      dict: 'dict/dict'
    }),
    subsidyTypeOptions() {
      return this.dict.subsidyType || [];
    },
    subsidyStatusOptions() {
      return this.dict.approveType || [];
    },
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyupHandler);
  },
  async created() {
    try {
      this.resetSearchField();
      this.resetPagination();
      let { id } = this.$route.params;
      await this.getSubsidyList(id);
      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "subsidy/updateSearchField",
      updatePagination: "subsidy/updatePagination",
      resetSearchField: "subsidy/resetSearchField",
      resetPagination: "subsidy/resetPagination",
      setCurrentSubsidy: "subsidy/setCurrentSubsidy",
      resetCurrentSubsidy: "subsidy/resetCurrentSubsidy"
    }),
    ...mapActions({
      getSubsidyList: "subsidy/getSubsidyList",
      deleteSubsidyById: "subsidy/deleteSubsidyById"
    }),
    keyupHandler(e) {
      if (e.keyCode === 13) {
        this.searchHandler();
      }
    },
    inputHandler(value, key) {
      this.updateSearchField({ key, value });
      if (key !== 'keyword') {
        this.searchHandler();
      }
    },
    searchHandler() {
      let { id } = this.$route.params;
      this.getSubsidyList(id);
    },
    clearSearchField() {
      this.resetSearchField();
      this.searchHandler();
    },
    handlePaginationChange(value, key) {
      this.updatePagination({ key, value });
      this.searchHandler();
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    async createSubsidy() {
      try {
        this.resetCurrentSubsidy();
        this.$refs.subsidDialog.show();
      } catch (err) {
        console.log(err);
      }
    },
    showDetailHandler(subsidy) {
      this.setCurrentSubsidy({subsidy});
      this.$refs.subsidDetailDialog.show();
    },
    editSubsidyHandler(subsidy) {
      let {id} = subsidy;
      this.setCurrentSubsidy({subsidy});
      this.$refs.subsidDialog.show(id);
    },
    async deleteSubsidyHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.deleteSubsidyById(id);
          if (res && res.code === 0) {
            let {id} = this.$route.params;
            this.getSubsidyList(id);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
