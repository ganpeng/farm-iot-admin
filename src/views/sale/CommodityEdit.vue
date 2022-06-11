<template>
  <div class="commodity-edit-container my-content-container">
    <div class="basic-info">
      <div class="header">
        <div class="svg-icon home-icon6 title-icon1"></div>
        <span class="title">基础信息</span>
        <div class="status-icon-warpper">
          <div v-if="commodity.disabled === 1" class="status status-icon">正常</div>
          <div v-else class="visible status-icon">已删除</div>
        </div>
      </div>
      <div class="basic-info-content">
        <div class="my-text-info">
          <div class="text-info-item">
            <div class="label">商品ID</div>
            <div class="value">{{commodity.goodsId}}</div>
          </div>
          <div class="text-info-item">
            <div class="label">商品名称</div>
            <div class="value">{{commodity.goodsName}}</div>
          </div>
          <div class="text-info-item">
            <div class="label">商品店铺</div>
            <div class="value">{{commodity.sellerName}}</div>
          </div>
          <div class="text-info-item">
            <div class="label">分类</div>
            <div class="value">{{commodity.categoryName}}</div>
          </div>
          <div class="text-info-item">
            <div class="label">价格(元)</div>
            <div class="value">{{commodity.price}}</div>
          </div>
          <div class="text-info-item">
            <div class="label">企业</div>
            <div class="value">{{commodity.farmName}}</div>
          </div>
        </div>
        <div class="my-img-info">
          <el-image
            class="cover-image"
            fit="cover"
            @click="showImage"
            v-if="commodity.small"
            :src="commodity.small">
          </el-image>
        </div>
      </div>
    </div>
    <div class="batch-table-container">
      <div class="tab-list-container">
        <div class="tab-list">
          <div @click="changeActiveIndexHandler(0)" :class="['tab-item', activeIndex === 0 && 'active']">溯源批次</div>
          <div @click="changeActiveIndexHandler(1)" :class="['tab-item', activeIndex === 1 && 'active']">全程溯源</div>
        </div>
      </div>
      <div class="tab-content-container">
        <div v-if="activeIndex === 0" class="tab-content-item">
          <div class="my-search-field">
            <div class="field-row">
              <div class="row-left">
                <div class="search-field-item input-search">
                  <el-input
                    :value="searchField.batchNo"
                    placeholder="请输入溯源批号"
                    clearable
                    @input="inputHandler($event, 'batchNo')"
                  ></el-input>
                  <span @click="searchHandler" class="input-search-btn">
                    <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
                    <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
                  </span>
                </div>
                <div class="search-field-item">
                  <label class="search-field-item-label">创建时间</label>
                  <el-date-picker
                    class="my-date-range-picker"
                    :value="searchField.dateRange"
                    type="daterange"
                    @input="inputHandler($event, 'dateRange')"
                    value-format="timestamp"
                    :unlink-panels="true"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
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
                <el-button v-if="commodity.disabled === 1" class="btn-style-two" @click="batchCreateHandler">
                  新增批次
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
              :data="list.data">
              <el-table-column min-width="120px" label="溯源批号">
                <template slot-scope="scope">{{scope.row.batchNo}}</template>
              </el-table-column>
              <el-table-column min-width="120px" label="所属地块">
                <template slot-scope="scope">{{scope.row.landName}}</template>
              </el-table-column>
              <el-table-column min-width="120px" label="作物名称">
                <template slot-scope="scope">{{scope.row.plantName}}</template>
              </el-table-column>
              <el-table-column min-width="120px" label="品种">
                <template slot-scope="scope">{{scope.row.seedName}}</template>
              </el-table-column>
              <el-table-column prop="sn" min-width="120px" label="步骤数">
                <template slot-scope="scope">{{scope.row.traceInfo.length}}</template>
              </el-table-column>
              <el-table-column min-width="80px" label="创建时间">
                <template slot-scope="scope">{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</template>
              </el-table-column>
              <el-table-column min-width="120px" label="操作">
                <template slot-scope="scope">
                  <div class="operator-btn-wrapper">
                    <span class="btn-text" @click="batchEditHandler(scope.row)">编辑</span>
                    <span v-if="scope.row.selectedStatus !== 'DEFAULT'" class="btn-text" @click="batchSetDefaultHandler(scope.row.id)">设为默认</span>
                    <span class="btn-text" @click="batchDeleteHandler(scope.row.id)">删除</span>
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
        <div v-if="activeIndex === 1" class="tab-content-item">
          <live-trace :goods="commodity"></live-trace>
        </div>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two" @click="gotoCommodityDetailHandler">详情</el-button>
      <el-button class="btn-style-three" @click="gotoCommodityListHandler">返回列表</el-button>
    </div>
    <tracing-dialog ref="tracingDialog"></tracing-dialog>
    <preview-single-image ref="previewSingleImage" :url="commodity.big"></preview-single-image>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import TracingDialog from "./TracingDialog";
import PreviewSingleImage from "@/components/PreviewSingleImage";
import LiveTrace from './LiveTrace';
export default {
  name: "CommodityEdit",
  components: { PreviewSingleImage, TracingDialog, LiveTrace },
  data() {
    return {
      activeIndex: 0
    };
  },
  async created() {
    try {
      let { id } = this.$route.params;
      this.updateSearchField({key: 'goodsId', value: id});
      this.getBatchList();
      this.getCommodityById(id);
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    ...mapGetters({
      commodity: "commodity/currentCommodity",
      list: "batch/list",
      searchField: "batch/searchField"
    })
  },
  methods: {
    ...mapMutations({
      updateSearchField: "batch/updateSearchField",
      updatePagination: "batch/updatePagination",
      resetSearchField: "batch/resetSearchField",
      resetCurrentBatch: 'batch/resetCurrentBatch',
      setCurrentBatch: 'batch/setCurrentBatch',
      resetPagination: "batch/resetPagination"
    }),
    ...mapActions({
      getCommodityById: 'commodity/getCommodityById',
      deleteBatchById: 'batch/deleteBatchById',
      getBatchList: 'batch/getBatchList'
    }),
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    inputHandler(value, key) {
      this.updateSearchField({ key, value });
      if (key !== 'batchNo') {
        this.searchHandler();
      }
    },
    searchHandler() {
      this.getBatchList();
    },
    clearSearchField() {
      this.resetSearchField();
      let { id } = this.$route.params;
      this.updateSearchField({key: 'goodsId', value: id});
      this.searchHandler();
    },
    handlePaginationChange(value, key) {
      this.updatePagination({ key, value });
      this.searchHandler();
    },
    batchCreateHandler() {
      let {goodsId, goodsName, farmName, farmId} = this.commodity;
      this.resetCurrentBatch();
      this.$refs.tracingDialog.show({goodsId, goodsName, farmName, farmId});
    },
    batchEditHandler(batch) {
      let {goodsId, goodsName, farmName, farmId} = this.commodity;
      this.setCurrentBatch({batch});
      this.$refs.tracingDialog.show({id: batch.id, goodsId, goodsName, farmName, farmId});
    },
    async batchSetDefaultHandler(id) {
      try {
        let promptMessage =
          "确定要设置该溯源批次为默认批次吗？";
        let confirm = await this.$confirm(`${promptMessage}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.$service.setDefaultBatchById(id);
          if (res && res.code === 0) {
            this.getBatchList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async batchDeleteHandler(id) {
      try {
        let promptMessage =
          "记录删除后不可恢复，用户扫码后将查询不到溯源信息，请谨慎操作。 确定删除此条记录？";
        let confirm = await this.$confirm(`${promptMessage}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.deleteBatchById(id)
          if (res && res.code === 0) {
            this.getBatchList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    gotoCommodityDetailHandler() {
      if (!this.$authority.isHasAuthority('admin:goods:detail')) {
        return;
      }
      let { id } = this.$route.params;
      this.$router.push({name: "CommodityDetail", params: {id}});
    },
    gotoCommodityListHandler() {
      if (!this.$authority.isHasAuthority('admin:goods:page')) {
        return;
      }
      this.$router.push({name: "CommodityList"});
    },
    showImage() {
      this.$refs.previewSingleImage.show();
    },
    changeActiveIndexHandler(index) {
      this.activeIndex = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.commodity-edit-container {
  width: 100%;
  height: 100%;
  .basic-info {
    width: 100%;
    // height: 282px;
    border-radius: 4px;
    background-color: #202c41;
    .header {
      position: relative;
      display: flex;
      align-items: center;
      height: 62px;
      padding: 0 20px;
      border-bottom: 1px solid #3a4763;
      .svg-one {
        width: 32px;
        height: 32px;
      }
      .title {
        color: #f0f0f0;
        font-size: 16px;
        margin: 0 10px 0 18px;
      }
      .status-icon-warpper {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        .status-icon {
          display: inline-block;
          width: 80px;
          height: 32px;
          font-size: 16px;
          line-height: 32px;
          text-align: center;
          background-color: #2a394e;
          border-radius: 4px;
          margin-left: 10px;
          &.status {
            color: #7ed321;
          }
          &.visible {
            color: #ff6e6e;
          }
        }
      }
    }
    .title-icon1 {
      width: 20px;
      height: 20px;
      background-image: url("../../assets/img/title_icon3.png");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .basic-info-content {
      display: flex;
      justify-content: center;
      width: 100%;
      height: calc(100% - 62px);
      padding: 20px 140px;
      .my-text-info {
        display: block;
        margin-right: 150px;
        .text-info-item {
          display: flex;
          align-items: center;
          color: #9fa8b8;
          font-size: 14px;
          width: 100%;
          line-height: 14px;
          margin-bottom: 16px;
          .label {
            width: 100px;
            margin-right: 20px;
            text-align: right;
          }
          .value {
            flex: 1;
          }
        }
      }
      .my-img-info {
        display: flex;
        .cover-image {
          width: 160px;
          height: 160px;
        }
      }
    }
  }
  .tab-list-container {
    height: 62px;
    padding: 0 20px;
    margin-top: 20px;
    border-bottom: 1px solid #3a4763;
    background-color: #202c41;
    .tab-list {
      display: flex;
      align-items: center;
      height: 100%;
      .tab-item {
        cursor: pointer;
        font-size: 16px;
        &.active {
          color: $mainColor;
        }
      }
      .tab-item + .tab-item {
        margin-left: 20px;
      }
    }
  }
  .tab-content-container {
    min-height: 400px;
    padding-bottom: 100px;
    .tab-content-item {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
