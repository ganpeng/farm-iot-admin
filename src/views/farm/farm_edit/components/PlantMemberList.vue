<template>
  <div class="grower-list-container">
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.name"
              placeholder="成员名称"
              @input="inputHandler($event, 'name')"
            >
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
        <el-table-column min-width="120px" label="贫困户">
          <template slot-scope="scope">{{scope.row.isPoor ? '是' : '否'}}</template>
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
    <plant-member-dialog ref="plantMemberDialog"></plant-member-dialog>
    <plant-member-detail-dialog ref="plantMemberDetailDialog"></plant-member-detail-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import PlantMemberDialog from './PlantMemberDialog';
import PlantMemberDetailDialog from '../detail/PlantMemberDetailDialog';
import constants from '@/util/constants';
export default {
  name: 'PlantMemberList',
  components: {PlantMemberDialog, PlantMemberDetailDialog},
  data() {
      return {};
  },
  computed: {
    ...mapGetters({
      list: "plantMember/list",
      searchField: "plantMember/searchField"
    }),
    dutyLabel() {
      return (value) => {
        let index = constants.DUTY_OPTIONS.findIndex((item) => item.value === value);
        return index >= 0 ? _.get(constants.DUTY_OPTIONS, `${index}.label`) : '';
      };
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
      await this.getPlantMemberList(id);

      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "plantMember/updateSearchField",
      updatePagination: "plantMember/updatePagination",
      resetSearchField: "plantMember/resetSearchField",
      resetPagination: "plantMember/resetPagination",
      setCurrentPlantMember: "plantMember/setCurrentPlantMember",
      resetCurrentPlantMember: "plantMember/resetCurrentPlantMember"
    }),
    ...mapActions({
      getPlantMemberList: "plantMember/getPlantMemberList",
      deletePlantMemberById: "plantMember/deletePlantMemberById"
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
      this.getPlantMemberList(id);
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
        this.resetCurrentPlantMember();
        this.$refs.plantMemberDialog.show();
      } catch (err) {
        console.log(err);
      }
    },
    showDetailHandler(manageMember) {
      this.setCurrentPlantMember({manageMember});
      this.$refs.plantMemberDetailDialog.show();
    },
    editManagementHandler(manageMember) {
      let {id} = manageMember;
      this.setCurrentPlantMember({manageMember});
      this.$refs.plantMemberDialog.show(id);
    },
    async deleteManagementHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.deletePlantMemberById(id);
          if (res && res.code === 0) {
            let {id} = this.$route.params;
            this.getPlantMemberList(id);
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
