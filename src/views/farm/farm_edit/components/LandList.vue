<template>
    <div class="land-list-container">
      <div class="my-search-field">
        <div class="field-row">
          <div class="row-left">
            <div class="search-field-item input-search">
              <el-input
                :value="searchField.landName"
                placeholder="地块名称"
                @input="inputHandler($event, 'landName')"
              >
              </el-input>
              <span @click="searchHandler" class="input-search-btn">
                <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
                <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
              </span>
            </div>
            <div class="search-field-item">
              <label class="search-field-item-label">地块形式</label>
              <el-select
                :value="searchField.form"
                filterable
                clearable
                placeholder="请选择"
                @input="inputHandler($event, 'form')"
              >
                <el-option
                  v-for="(item, index) in formOptions"
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
            <el-button class="btn-style-two contain-svg-icon" @click="createLand">
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
          <el-table-column min-width="100px" label="地块名称">
            <template slot-scope="scope">
              <span @click="showDetailHandler(scope.row)" class="ellipsis two name detail-name">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="280px" label="地址">
            <template slot-scope="scope">{{scope.row.address}}{{scope.row.detailAddress}}</template>
          </el-table-column>
          <el-table-column min-width="100px" label="地块形式">
            <template slot-scope="scope">{{scope.row.form}}</template>
          </el-table-column>
          <el-table-column min-width="100px" label="水利条件">
            <template slot-scope="scope">{{scope.row.irrigation}}</template>
          </el-table-column>
          <el-table-column min-width="120px" label="地块编码">
            <template slot-scope="scope">{{scope.row.code}}</template>
          </el-table-column>
          <el-table-column min-width="120px" label="面积(公顷)">
            <template slot-scope="scope">{{scope.row.area}}</template>
          </el-table-column>
          <el-table-column width="120px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="editLandHandler(scope.row)">编辑</span>
                <span class="btn-text text-danger" @click="deleteLandHandler(scope.row.id)">删除</span>
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
      <land-dialog ref="landDialog"></land-dialog>
      <land-detail-dialog ref="landDetailDialog"></land-detail-dialog>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import LandDialog from './LandDialog';
import LandDetailDialog from '../detail/LandDetailDialog';
export default {
  name: 'LandList',
  components: {LandDialog, LandDetailDialog},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "land/list",
      searchField: "land/searchField",
      dict: 'dict/dict'
    }),
    formOptions() {
      return this.dict.landForm || [];
    },
    // irrigationOptions() {
    //   return this.dict.irrigation || [];
    // },
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyupHandler);
  },
  async created() {
    try {
      this.resetSearchField();
      this.resetPagination();
      let { id } = this.$route.params;
      await this.getLandList(id);

      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "land/updateSearchField",
      updatePagination: "land/updatePagination",
      resetSearchField: "land/resetSearchField",
      resetPagination: "land/resetPagination",
      setCurrentLand: "land/setCurrentLand",
      resetCurrentLand: "land/resetCurrentLand"
    }),
    ...mapActions({
      getLandList: "land/getLandList",
      deleteLandById: "land/deleteLandById"
    }),
    keyupHandler(e) {
      if (e.keyCode === 13) {
        this.searchHandler();
      }
    },
    inputHandler(value, key) {
      this.updateSearchField({ key, value });
      if (key !== 'landName') {
        this.searchHandler();
      }
    },
    searchHandler() {
      let { id } = this.$route.params;
      this.getLandList(id);
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
    async createLand() {
      try {
        this.resetCurrentLand();
        this.$refs.landDialog.show();
      } catch (err) {
        console.log(err);
      }
    },
    showDetailHandler(land) {
      this.setCurrentLand({land});
      this.$refs.landDetailDialog.show();
    },
    editLandHandler(land) {
      let {id} = land;
      this.setCurrentLand({land});
      this.$refs.landDialog.show(id);
    },
    async deleteLandHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.deleteLandById(id);
          if (res && res.code === 0) {
            let {id} = this.$route.params;
            this.getLandList(id);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
