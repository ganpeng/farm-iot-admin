<template>
  <div class="list-container">
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.keyword"
              placeholder="服务类型"
              @input="inputHandler($event, 'keyword')"
            >
            </el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">年份</label>
            <el-date-picker
              :value="searchField.year"
              @input="inputHandler($event, 'year')"
              type="year"
              value-format="yyyy">
            </el-date-picker>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">服务类型</label>
            <el-select
              :value="searchField.serviceType"
              filterable
              clearable
              placeholder="全部"
              @input="inputHandler($event, 'serviceType')"
            >
              <el-option
                v-for="(item, index) in serviceTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">服务对象</label>
            <el-select
              :value="searchField.serviceClients"
              filterable
              clearable
              placeholder="全部"
              @input="inputHandler($event, 'serviceClients')"
            >
              <el-option
                v-for="(item, index) in serviceClientsOptions"
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
          <el-button class="btn-style-two contain-svg-icon" @click="createSocial">
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
        <el-table-column min-width="100px" label="服务对象">
          <template slot-scope="scope">
            <span @click="showDetailHandler(scope.row)" class="ellipsis two name detail-name">{{scope.row.serviceClients}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" label="服务类型">
          <template slot-scope="scope">{{scope.row.serviceType}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="服务营收(元)">
          <template slot-scope="scope">{{scope.row.revenue}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="服务时间">
          <template slot-scope="scope">{{scope.row.serviceTime | formatDate('yyyy-MM-DD')}}</template>
        </el-table-column>
        <el-table-column width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span class="btn-text" @click="editSocialHandler(scope.row)">编辑</span>
              <span class="btn-text text-danger" @click="deleteSocialHandler(scope.row.id)">删除</span>
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
    <social-dialog ref="socialDialog"></social-dialog>
    <social-detail-dialog ref="socialDetailDialog"></social-detail-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import SocialDialog from "./SocialDialog";
import SocialDetailDialog from './SocialDetailDialog';
export default {
  name: "SocialList",
  components: { SocialDialog, SocialDetailDialog },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "social/list",
      searchField: "social/searchField",
      dict: 'dict/dict'
    }),
    serviceClientsOptions() {
      return this.dict.serviceClient || [];
    },
    serviceTypeOptions() {
      return this.dict.serviceType || [];
    }
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyupHandler);
  },
  async created() {
    try {
      this.resetSearchField();
      this.resetPagination();
      let { id } = this.$route.params;
      await this.getSocialList(id);
      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "social/updateSearchField",
      updatePagination: "social/updatePagination",
      resetSearchField: "social/resetSearchField",
      resetPagination: "social/resetPagination",
      setCurrentSocial: "social/setCurrentSocial",
      resetCurrentSocial: "social/resetCurrentSocial"
    }),
    ...mapActions({
      getSocialList: "social/getSocialList",
      deleteSocialById: "social/deleteSocialById"
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
      this.getSocialList(id);
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
    async createSocial() {
      try {
        this.resetCurrentSocial();
        this.$refs.socialDialog.show();
      } catch (err) {
        console.log(err);
      }
    },
    showDetailHandler(social) {
      this.setCurrentSocial({social});
      this.$refs.socialDetailDialog.show();
    },
    editSocialHandler(social) {
      let {id} = social;
      this.setCurrentSocial({social});
      this.$refs.socialDialog.show(id);
    },
    async deleteSocialHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.deleteSocialById(id);
          if (res && res.code === 0) {
            let {id} = this.$route.params;
            this.getSocialList(id);
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
