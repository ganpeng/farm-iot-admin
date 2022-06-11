<template>
  <div class="tracing-code-list-container my-content-container">
    <my-bord :width="270" :bordList="bordList"></my-bord>
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.keyword"
              placeholder="企业/商品/批号/创建人"
              @input="inputHandler($event, 'keyword')"
            ></el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">状态</label>
            <el-select
              :value="searchField.activeStatus"
              filterable
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'activeStatus')"
            >
              <el-option
                v-for="(item, index) in activeStatusOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">创建时间</label>
            <el-date-picker
              class="my-date-range-picker my-data-time-range"
              :value="searchField.createdDateRange"
              type="datetimerange"
              @input="inputHandler($event, 'createdDateRange')"
              value-format="timestamp"
              :unlink-panels="true"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">首次查询时间</label>
            <el-date-picker
              class="my-date-range-picker my-data-time-range"
              :value="searchField.queryDateRange"
              type="datetimerange"
              @input="inputHandler($event, 'queryDateRange')"
              value-format="timestamp"
              :unlink-panels="true"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>          
          <!--
          <div class="search-field-item">
            <label class="search-field-item-label">创建人</label>
            <el-select
              :value="searchField.createdUser"
              filterable
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'createdUser')">
              <el-option
                v-for="(item, index) in createdUserOptions"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          -->
          <div @click="clearSearchField" class="clear-btn">
            <span class="reset-icon">
              <svg-icon class="reset-btn" icon-class="reset_btn"/>
              <svg-icon class="reset-btn-active" icon-class="reset_btn_active"/>
            </span>
            重置
          </div>
          <!-- <span
              @click="toggleSearchField"
              :class="['toggle-dropdown', 'el-dropdown-link', searchFieldVisible && 'active']">
              {{searchFieldVisible ? '收起筛选' : '展开筛选'}}
              <i v-if="searchFieldVisible" class="active el-icon-arrow-up el-icon--right my-arrow-icon"></i>
              <i v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
          </span> -->
        </div>
        <div class="row-right">
          <el-button class="btn-style-two" style="width: 80px;" @click="createTracingCode">
            <!-- <svg-icon icon-class="add_plus"/>溯源码 -->
            生成溯源码
          </el-button>
        </div>
      </div>
      <!-- <div v-if="searchFieldVisible" class="field-row">
        <div class="row-left">
          <div class="search-field-item">
            <label class="search-field-item-label">创建时间</label>
            <el-date-picker
              class="my-date-range-picker"
              :value="searchField.createdDateRange"
              type="daterange"
              @input="inputHandler($event, 'createdDateRange')"
              value-format="timestamp"
              :unlink-panels="true"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">首次查询时间</label>
            <el-date-picker
              class="my-date-range-picker"
              :value="searchField.queryDateRange"
              type="daterange"
              @input="inputHandler($event, 'queryDateRange')"
              value-format="timestamp"
              :unlink-panels="true"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
      </div> -->
    </div>
    <div class="tabel-field">
      <el-table
        header-row-class-name="common-table-header"
        size="small"
        :row-class-name="tableRowClassName"
        class="my-table-style"
        :data="list.data"
      >
        <el-table-column min-width="120px" label="生产企业">
          <template slot-scope="scope">
            <span>{{scope.row.factoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="280px" label="商品名称">
          <template slot-scope="scope">{{scope.row.goodsName}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="商品ID">
          <template slot-scope="scope">{{scope.row.goodsId}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="溯源批号">
          <template slot-scope="scope">{{scope.row.batchNo}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="溯源二维码">
          <template slot-scope="scope">
            <img width="36px" height="44px" :src="scope.row.qrcodeUrl" alt="溯源二维码">
          </template>
        </el-table-column>
        <el-table-column min-width="80px" label="防伪码">
          <template slot-scope="scope">{{scope.row.securityNo}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="创建人">
          <template slot-scope="scope">{{scope.row.createdUser}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="创建时间">
          <template slot-scope="scope">{{scope.row.createdAt | formatDate('yyyy-MM-DD HH:mm:SS')}}</template>
        </el-table-column>
        <el-table-column min-width="140px" label="首次查询时间">
          <template slot-scope="scope">{{scope.row.queryedAt | formatDate('yyyy-MM-DD HH:mm:SS')}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="查询次数">
          <template slot-scope="scope">{{scope.row.queryedNum}}</template>
        </el-table-column>
        <el-table-column min-width="70px" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.activeStatus === 'ACTIVE'">
              激活
            </span>
            <span v-else class="inactive">未激活</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
            <el-popover
              class="my-popover"
              placement="left-start"
              width="100"
              trigger="click">
              <div class="pop-content">
                <div class="qrcode-title">图片仅供参考</div>
                <div class="image-container">
                  <div class="logo-image">
                  </div>
                  <div class="qrcode-img">
                    <img width="100px" height="124px;" :src="scope.row.qrcodeUrl" alt="溯源二维码">
                  </div>
                </div>
              </div>
              <span class="contact-name" slot="reference">预览</span>
            </el-popover>
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
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import MyBord from "@/components/MyBord";
import constants from "@/util/constants";
export default {
  name: "TracingCodeList",
  components: { MyBord },
  data() {
    return {
      //  toggle搜索区域
      searchFieldVisible: false,
      multipleSelection: [],
      createdUserOptions: [],
      activeStatusOptions: [
        {
          label: '激活',
          value: 'ACTIVE'
        },
        {
          label: '未激活',
          value: 'INACTIVE'
        }
      ],
      bordList: constants.TRACING_CODE_BORD_LIST
    };
  },
  computed: {
    ...mapGetters({
      list: "tracingCode/list",
      searchField: "tracingCode/searchField"
    })
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.keyupHandler);
  },
  async created() {
    try {
      this.resetSearchField();
      this.resetPagination();
      this.getTracingStatistic();
      // this.getMyUserList();
      await this.getTracingCodeList();
      // 绑定事件
      window.addEventListener("keyup", this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateSearchField: "tracingCode/updateSearchField",
      updatePagination: "tracingCode/updatePagination",
      resetSearchField: "tracingCode/resetSearchField",
      resetPagination: "tracingCode/resetPagination"
    }),
    ...mapActions({
      getTracingCodeList: "tracingCode/getTracingCodeList"
    }),
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    async getTracingStatistic() {
      try {
        let res = await this.$service.getTracingStatistic();
        if (res && res.code === 0) {
          let bordList = [];
          let countNumTotal= {
            title: "总数",
            count: _.get(res.data, "0.countNumTotal")
          };
          let activeNum = {
            title: "已激活",
            count: _.get(res.data, "0.activeNum")
          };
          let inactiveNum = {
            title: "未激活",
            count: _.get(res.data, "0.inactiveNum")
          };
          bordList.push(countNumTotal);
          bordList.push(activeNum);
          bordList.push(inactiveNum);
          this.bordList = bordList;
        }
      } catch (err) {
        console.log(err);
      }
    },
    toggleSearchField() {
        this.searchFieldVisible = !this.searchFieldVisible;
    },
    keyupHandler(e) {
      if (e.keyCode === 13) {
        this.searchHandler();
      }
    },
    inputHandler(value, key) {
      this.updateSearchField({ key, value });
      if (key !== "keyword") {
        this.searchHandler();
      }
    },
    searchHandler() {
      this.getTracingCodeList();
    },
    clearSearchField() {
      this.resetSearchField();
      this.searchHandler();
    },
    handlePaginationChange(value, key) {
      this.updatePagination({ key, value });
      this.searchHandler();
    },
    createTracingCode() {
      if (!this.$authority.isHasAuthority('admin:trace:qrcode:add')) {
        return;
      }
      this.$router.push({ name: "TracingCodeCreate" });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getMyUserList() {
      this.$service.getMyUserList({pageNum: 0, pageSize: 1000})
        .then((res) => {
          if (res && res.code === 0) {
            this.createdUserOptions = _.get(res.data, 'list') || [];
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    async deleteFarmHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
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
      this.$router.push({ name: "FarmDetail", params: { id } });
    }
  }
};
</script>
<style lang="scss">
.el-popover {
  .qrcode-title {
    color: #F0F0F0;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
  }
  .image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    .logo-image {
      width: 92px;
      height: 24px;
      background-image: url('../../assets/img/tracing_code_list_logo.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center center;
      margin: 10px 0;
    }
  }
}
</style>
