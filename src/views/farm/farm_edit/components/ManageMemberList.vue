<template>
  <div class="management-list-container">
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.name"
              placeholder="成员名称"
              @input="inputHandler($event, 'name')">
            </el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
        </div>
        <div class="row-right">
          <el-button class="btn-style-two contain-svg-icon" @click="createManagement">
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
        <el-table-column min-width="100px" label="姓名">
          <template slot-scope="scope">
            <span @click="showDetailHandler(scope.row)" class="ellipsis two name detail-name">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="280px" label="地址">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="联系电话">
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="培训时长(天)">
          <template slot-scope="scope">{{scope.row.trainingDays}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="专业证书(个)">
          <template slot-scope="scope">{{scope.row.certificateList.length}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="出资金额(元)">
          <template slot-scope="scope">{{scope.row.fundAmount}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="出地面积(公顷)">
          <template slot-scope="scope">{{scope.row.landArea}}</template>
        </el-table-column>
        <el-table-column width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span class="btn-text" @click="editManagementHandler(scope.row)">编辑</span>
              <span class="btn-text text-danger" @click="deleteManagementHandler(scope.row.id)">删除</span>
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
    <manage-member-dialog ref="manageMemberDialog"></manage-member-dialog>
    <manage-member-detail-dialog ref="manageMemberDetailDialog"></manage-member-detail-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import ManageMemberDialog from "./ManageMemberDialog";
import ManageMemberDetailDialog from '../detail/ManageMemberDetailDialog';
export default {
  name: "ManageMemberList",
  components: { ManageMemberDialog, ManageMemberDetailDialog },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "manageMember/list",
      searchField: "manageMember/searchField"
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
      await this.getManageMemberList(id);

      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "manageMember/updateSearchField",
      updatePagination: "manageMember/updatePagination",
      resetSearchField: "manageMember/resetSearchField",
      resetPagination: "manageMember/resetPagination",
      setCurrentManageMember: "manageMember/setCurrentManageMember",
      resetCurrentManageMember: "manageMember/resetCurrentManageMember"
    }),
    ...mapActions({
      getManageMemberList: "manageMember/getManageMemberList",
      deleteManageMemberById: "manageMember/deleteManageMemberById"
    }),
    keyupHandler(e) {
      if (e.keyCode === 13) {
        this.searchHandler();
      }
    },
    inputHandler(value, key) {
      this.updateSearchField({ key, value });
      if (key !== 'name') {
        this.searchHandler();
      }
    },
    searchHandler() {
      let { id } = this.$route.params;
      this.getManageMemberList(id);
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
    async createManagement() {
      try {
        this.resetCurrentManageMember();
        this.$refs.manageMemberDialog.show();
      } catch (err) {
        console.log(err);
      }
    },
    showDetailHandler(manageMember) {
      this.setCurrentManageMember({manageMember});
      this.$refs.manageMemberDetailDialog.show();
    },
    editManagementHandler(manageMember) {
      let {id} = manageMember;
      this.setCurrentManageMember({manageMember});
      this.$refs.manageMemberDialog.show(id);
    },
    async deleteManagementHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.deleteManageMemberById(id);
          if (res && res.code === 0) {
            let {id} = this.$route.params;
            this.getManageMemberList(id);
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
