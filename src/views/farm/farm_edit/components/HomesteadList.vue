<template>
  <div class="homestead-list-container">
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.landName"
              placeholder="地块名称"
              @input="inputHandler($event, 'landName')"
            ></el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
        </div>
        <div class="row-right">
          <el-button class="btn-style-two contain-svg-icon" @click="createHomestead">
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
        <!--
        <el-table-column min-width="100px" label="持有人">
          <template slot-scope="scope">
            <span @click="showDetailHandler(scope.row)" class="ellipsis two name detail-name">{{scope.row.landName}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" label="联系方式">
          <template slot-scope="scope">{{scope.row.holderMobile}}</template>
        </el-table-column>
        -->
        <el-table-column min-width="100px" label="地块名称">
          <template slot-scope="scope">
            <span @click="showDetailHandler(scope.row)" class="ellipsis two name detail-name">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="60px" label="用途">
          <template slot-scope="scope">{{scope.row.purpose}}</template>
        </el-table-column>
        <el-table-column min-width="280px" label="地址">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="地块编码">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="面积(平米)">
          <template slot-scope="scope">{{scope.row.area}}</template>
        </el-table-column>
        <el-table-column width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span class="btn-text" @click="editHomesteadHandler(scope.row)">编辑</span>
              <span class="btn-text text-danger" @click="deleteHomesteadHandler(scope.row.id)">删除</span>
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
    <homestead-dialog ref="homesteadDialog"></homestead-dialog>
    <homestead-detail-dialog ref="homesteadDetailDialog"></homestead-detail-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import HomesteadDialog from "./HomesteadDialog";
import HomesteadDetailDialog from '../detail/HomesteadDetailDialog';
export default {
  name: "HomesteadList",
  components: { HomesteadDialog, HomesteadDetailDialog},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "homestead/list",
      searchField: "homestead/searchField"
    }),
    farmMachineTypeLabel() {
      return value => {};
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
      await this.getHomesteadList(id);

      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "homestead/updateSearchField",
      updatePagination: "homestead/updatePagination",
      resetSearchField: "homestead/resetSearchField",
      resetPagination: "homestead/resetPagination",
      setCurrentHomestead: "homestead/setCurrentHomestead",
      resetCurrentHomestead: "homestead/resetCurrentHomestead"
    }),
    ...mapActions({
      getHomesteadList: "homestead/getHomesteadList",
      deleteHomesteadById: "homestead/deleteHomesteadById"
    }),
    keyupHandler(e) {
      if (e.keyCode === 13) {
        this.searchHandler();
      }
    },
    inputHandler(value, key) {
      this.updateSearchField({ key, value });
    },
    searchHandler() {
      let { id } = this.$route.params;
      this.getHomesteadList(id);
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
    async createHomestead() {
      try {
        this.resetCurrentHomestead();
        this.$refs.homesteadDialog.show();
      } catch (err) {
        console.log(err);
      }
    },
    showDetailHandler(homestead) {
      this.setCurrentHomestead({homestead});
      this.$refs.homesteadDetailDialog.show();
    },
    editHomesteadHandler(homestead) {
      let { id } = homestead;
      this.setCurrentHomestead({ homestead });
      this.$refs.homesteadDialog.show(id);
    },
    async deleteHomesteadHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.deleteHomesteadById(id);
          if (res && res.code === 0) {
            let { id } = this.$route.params;
            this.getHomesteadList(id);
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
