<template>
  <div class="tab-content-four">
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.keyword"
              placeholder="机械名称"
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
              :value="searchField.machineryType"
              filterable
              clearable
              placeholder="全部"
              @input="inputHandler($event, 'machineryType')"
            >
              <el-option
                v-for="(item, index) in farmMachineTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="row-right">
          <el-button class="btn-style-two contain-svg-icon" @click="createFarmMachine">
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
        <el-table-column min-width="120px" label="机械名称">
          <template slot-scope="scope">
            <span @click="showDetailHandler(scope.row)" class="ellipsis two name detail-name">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="类型">
          <template slot-scope="scope">{{scope.row.machineryType}}</template>
        </el-table-column>
        <el-table-column min-width="180px" label="生产厂家">
          <template slot-scope="scope">{{scope.row.factory}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="品牌">
          <template slot-scope="scope">{{scope.row.brand}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="购入价格(元)">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span class="btn-text" @click="editFarmMachineHandler(scope.row)">编辑</span>
              <span class="btn-text text-danger" @click="deleteFarmMachineHandler(scope.row.id)">删除</span>
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
    <farm-machine-dialog ref="farmMachineDialog"></farm-machine-dialog>
    <farm-machine-detail-dialog ref="farmMachineDetailDialog"></farm-machine-detail-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import FarmMachineDialog from "./components/FarmMachineDialog";
import FarmMachineDetailDialog from './detail/FarmMachineDetailDialog';
import constants from "@/util/constants";
export default {
  name: "TabContent4",
  components: { FarmMachineDialog, FarmMachineDetailDialog },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "farmMachine/list",
      searchField: "farmMachine/searchField",
      dict: "dict/dict"
    }),
    farmMachineTypeOptions() {
      return this.dict.machineryType || [];
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
      await this.getFarmMachineList(id);

      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "farmMachine/updateSearchField",
      updatePagination: "farmMachine/updatePagination",
      resetSearchField: "farmMachine/resetSearchField",
      resetPagination: "farmMachine/resetPagination",
      setCurrentFarmMachine: "farmMachine/setCurrentFarmMachine",
      resetCurrentFarmMachine: "farmMachine/resetCurrentFarmMachine"
    }),
    ...mapActions({
      getFarmMachineList: "farmMachine/getFarmMachineList",
      deleteFarmMachineById: "farmMachine/deleteFarmMachineById"
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
      this.getFarmMachineList(id);
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
    async createFarmMachine() {
      try {
        this.resetCurrentFarmMachine();
        this.$refs.farmMachineDialog.show();
      } catch (err) {
        console.log(err);
      }
    },
    showDetailHandler(farmMachine) {
      this.setCurrentFarmMachine({farmMachine});
      this.$refs.farmMachineDetailDialog.show();
    },
    editFarmMachineHandler(farmMachine) {
      let { id } = farmMachine;
      this.setCurrentFarmMachine({ farmMachine });
      this.$refs.farmMachineDialog.show(id);
    },
    async deleteFarmMachineHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.deleteFarmMachineById(id);
          if (res && res.code === 0) {
            let { id } = this.$route.params;
            this.getFarmMachineList(id);
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
.tab-content-four {
  padding: 0 20px;
}
</style>
