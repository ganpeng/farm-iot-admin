<template>
  <div class="farm-list-container my-content-container">
    <my-bord :bordList="bordList"></my-bord>
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.keyword"
              placeholder="企业名称"
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
              :value="searchField.farmType"
              filterable
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'farmType')"
            >
              <el-option
                v-for="(item, index) in farmTypeOptions"
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
          <!--
          <el-dropdown
            trigger="click"
            :class="['my-dropdown', multipleSelection.length === 0 && 'is-disabled']"
          >
            <span class="el-dropdown-link">
              批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span>批量导出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          -->
          <el-button class="btn-style-two" @click="createFarm">
            <svg-icon icon-class="add_plus"/>
            添加
          </el-button>
          <el-button class="btn-style-two" @click="importFarm">
            <svg-icon icon-class="import"></svg-icon>
            导入
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
        <!-- <el-table-column type="selection" align="center" width="50"></el-table-column> -->
        <el-table-column min-width="120px" label="企业名称">
          <template slot-scope="scope">
            <span
              @click="gotoFarmDetail(scope.row.id)"
              class="ellipsis two detail-name"
            >{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="类型">
          <template slot-scope="scope">{{farmTypeLabel(scope.row.farmType)}}</template>
        </el-table-column>
        <el-table-column min-width="280px" label="地址">
          <template slot-scope="scope">{{scope.row.address}}{{scope.row.detailAddress}}</template>
        </el-table-column>
        <el-table-column prop="sn" min-width="120px" label="地块面积(公顷)">
          <template slot-scope="scope">{{scope.row.area}}</template>
        </el-table-column>
        <el-table-column center min-width="120px" label="常务联系人">
          <template slot-scope="scope">
            <el-popover
              class="my-popover"
              placement="left-start"
              width="180"
              trigger="hover">
              <div class="pop-content">
                <div class="title">{{scope.row.contactName}}</div>
                <div class="date-time">
                  <span class="phone-no">电话：{{scope.row.contactTel}}</span>
                  <span
                    :data-clipboard-text="scope.row.contactTel"
                    @click="copyPhoneNo(scope.row.contactTel)"
                    class="copy-btn">
                    <svg-icon icon-class="copy_icon"/>
                  </span>
                </div>
              </div>
              <span class="contact-name" slot="reference">{{scope.row.contactName}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="成立时间">
          <template slot-scope="scope">{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span class="btn-text" @click="manageFarmHandler(scope.row)">管理</span>
              <span class="btn-text" @click="editFarmHandler(scope.row.id)">编辑</span>
              <!-- <span class="btn-text" @click="bindShopHandler(scope.row)">绑定店铺</span> -->
              <span class="btn-text text-danger" @click="deleteFarmHandler(scope.row.id)">删除</span>
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
    <bind-shop-dialog ref="bindShopDialog"></bind-shop-dialog>
  </div>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from "vuex";
  import _ from "lodash";
  import MyBord from "@/components/MyBord";
  import constants from "@/util/constants";
  import BindShopDialog from './BindShopDialog';
  export default {
    name: "FarmList",
    components: {MyBord, BindShopDialog},
    data() {
      return {
        multipleSelection: [],
        bordList: constants.FARM_BORD_LIST
      };
    },
    computed: {
      ...mapGetters({
        list: "farm/list",
        searchField: "farm/searchField",
        dict: 'dict/dict'
      }),
      farmTypeOptions() {
        return this.dict.farmCategory || [];
      },
      farmTypeLabel() {
        return value => {
          let index = this.farmTypeOptions.findIndex(
            item => item.name === value
          );
          return index >= 0 ? _.get(this.farmTypeOptions, `${index}.name`) : "";
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
        await this.getFarmList();
        this.getFarmCount();
        // 绑定事件
        window.addEventListener('keyup', this.keyupHandler);
      } catch (err) {
        console.log(err);
      }
    },
    methods: {
      ...mapMutations({
        updateSearchField: "farm/updateSearchField",
        updatePagination: "farm/updatePagination",
        resetSearchField: "farm/resetSearchField",
        resetPagination: "farm/resetPagination",
        resetList: "farm/resetList"
      }),
      ...mapActions({
        getFarmList: "farm/getFarmList",
        deleteFarmById: "farm/deleteFarmById"
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
      async copyPhoneNo(phoneNo) {
        try {
          this.$util.clipboardCopy(phoneNo);
          this.$message.success('复制成功');
        } catch (err) {
          console.log(err);
          this.$message.error('复制失败');
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
        this.getFarmList();
      },
      clearSearchField() {
        this.resetSearchField();
        this.searchHandler();
      },
      handlePaginationChange(value, key) {
        this.updatePagination({key, value});
        this.searchHandler();
      },
      createFarm() {
        if (!this.$authority.isHasAuthority('admin:farm:add')) {
          return;
        }
        this.$router.push({name: "FarmCreate"});
      },
      importFarm() {
        if (!this.$authority.isHasAuthority('admin:farm:add')) {
          return;
        }
        this.$router.push({name: "FarmImport"});
      },
      editFarmHandler(id) {
        if (!this.$authority.isHasAuthority('admin:farm:edit')) {
          return;
        }
        this.$router.push({name: "FarmEdit", params: {id}});
      },
      manageFarmHandler(farm) {
        if (!this.$authority.isHasAuthority('admin:farm:manage')) {
          return;
        }
        this.$router.push({name: "FarmManage", params: {id: farm.id}, query: {name: farm.name, mindex: 0}});
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      async deleteFarmHandler(id) {
        try {
          if (!this.$authority.isHasAuthority('admin:farm:delete')) {
            return;
          }
          let confirm = await this.$confirm("你确定要删除农场吗? 农场删除后，关联数据也将删除，请谨慎操作", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          });
          if (confirm) {
            let res = await this.deleteFarmById(id);
            if (res && res.code === 0) {
              this.getFarmList();
            }
          }
        } catch (err) {
          console.log(err);
        }
      },
      gotoFarmDetail(id) {
        if (!this.$authority.isHasAuthority('admin:farm:detail')) {
          return;
        }
        this.$router.push({name: "FarmDetail", params: {id}});
      },
      bindShopHandler(farm) {
        this.$refs.bindShopDialog.show({farmId: farm.id, shopId: farm.shopId});
      }
    }
  };
</script>
<style lang="scss" scoped>
  .farm-list-container {
  }
</style>
