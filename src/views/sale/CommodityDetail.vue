<template>
  <div class="commodity-detail-container my-content-container">
    <div class="commodity-detail-content-wrapper">
      <div class="left-field">
        <div class="left-top-field">
          <div class="header">
            <div class="svg-icon home-icon6 title-icon1"></div>
            <span class="title">基础信息</span>
            <div v-if="commodity.disabled === 1" class="status status-icon">正常</div>
            <div v-else class="visible status-icon">已删除</div>
            <div class="date">
              创建时间 {{parseInt(commodity.createTime + '000') | formatDate('yyyy-MM-DD')}}
            </div>
          </div>
          <div class="left-top-content">
            <div class="text-info">
              <div class="text-info-item">
                <div class="label">
                  商品ID
                </div>
                <div class="value">
                  {{commodity.goodsId}}
                </div>
              </div>
              <div class="text-info-item">
                <div class="label">
                  商品名称
                </div>
                <div class="value">
                  {{commodity.goodsName}}
                </div>
              </div>
              <div class="text-info-item">
                <div class="label">
                  商品店铺
                </div>
                <div class="value">
                  {{commodity.sellerName}}
                </div>
              </div>
              <div class="text-info-item">
                <div class="label">
                  分类
                </div>
                <div class="value">
                  {{commodity.categoryName}}
                </div>
              </div>
              <div class="text-info-item">
                <div class="label">
                  价格(元)
                </div>
                <div class="value">
                  {{commodity.price}}
                </div>
              </div>
            </div>
            <div class="img-info">
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
        <div class="left-bottom-field">
          <div class="header">
            <div class="svg-icon home-icon6 title-icon3"></div>
            <span class="title">商品溯源码</span>
            <div class="input-search-field">
              <div class="input-search">
                <el-input clearable v-model="batchNo1" placeholder="溯源批号"></el-input>
                <span @click="searchOneHandler" class="input-search-btn">
                  <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
                  <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
                </span>
              </div>
            </div>
          </div>
          <div class="left-bottom-content">
            <el-table
              header-row-class-name="common-table-header"
              header-cell-class-name="header-cell"
              size="small"
              :row-class-name="tableRowClassName"
              class="my-table-style"
              :data="list.data">
              <el-table-column min-width="80px" label="溯源批号">
                <template slot-scope="scope">{{scope.row.batchNo}}</template>
              </el-table-column>
              <el-table-column min-width="60px" label="创建人">
                <template slot-scope="scope">{{scope.row.createdUser}}</template>
              </el-table-column>
              <el-table-column min-width="80px" label="溯源二维码">
                <template slot-scope="scope">
                  <img width="36px" height="36px" :src="scope.row.qrcodeUrl" alt="溯源二维码">
                </template>
              </el-table-column>
              <el-table-column min-width="60px" label="防伪码">
                <template slot-scope="scope">{{scope.row.securityNo}}</template>
              </el-table-column>
              <el-table-column min-width="120px" label="首次查询时间">
                <template slot-scope="scope">{{scope.row.queryedAt | formatDate('yyyy-MM-DD HH:mm:SS')}}</template>
              </el-table-column>
              <el-table-column min-width="120px" label="创建时间">
                <template slot-scope="scope">{{scope.row.createdAt | formatDate('yyyy-MM-DD HH:mm:SS')}}</template>
              </el-table-column>
              <el-table-column min-width="60px" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.activeStatus === 'ACTIVE'">
                    激活
                  </span>
                  <span v-else class="inactive">未激活</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handlePaginationChange($event, 'pageNum')"
              :current-page="list.pagination.pageNum"
              :page-size="6"
              layout="total, prev, pager, next, jumper"
              :total="list.pagination.total"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="right-field">
        <div class="header">
          <div class="svg-icon home-icon6 title-icon2"></div>
          <span class="title">溯源信息</span>
          <div class="input-search-field">
            <div class="input-search">
              <el-input clearable v-model="batchNo2" placeholder="溯源批号"></el-input>
              <span @click="searchTwoHandler" class="input-search-btn">
                <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
                <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
              </span>
            </div>
          </div>
        </div>
        <div class="right-field-content">
          <tracing-info v-if="traceInfo.length > 0" :tracingList="traceInfo"></tracing-info>
          <div v-else class="no-data">
            <svg-icon icon-class="no_data_icon"></svg-icon>
            <div class="text">暂无数据</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two" @click="gotoCommodityEditHandler">溯源管理</el-button>
      <el-button class="btn-style-three" @click="gotoCommodityListHandler">返回列表</el-button>
    </div>
    <preview-single-image ref="previewSingleImage" :url="commodity.big"></preview-single-image>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import PreviewSingleImage from "@/components/PreviewSingleImage";
import TracingInfo from './TracingInfo';
export default {
  name: 'CommodityDetail',
  components: {PreviewSingleImage, TracingInfo},
  data() {
    return {
      batch: '',
      batchNo1: '', // 溯源编号1
      batchNo2: '' // 溯源编号2
    };
  },
  async created() {
    try {
      let { id } = this.$route.params;
      this.resetSearchField();
      this.resetPagination();
      this.updateSearchField({key: 'goodsId', value: id});
      this.updatePagination({key: 'pageSize', value: 6});
      this.resetBatchSearchField();
      this.resetBatchPagination();
      this.updateBatchSearchField({key: 'goodsId', value: id});
      this.getCommodityById(id);
      this.getTracingCodeList();
      this.getBatchList();

      await this.$nextTick();
      this.$util.toggleFixedBtnContainer();
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    ...mapGetters({
      commodity: "commodity/currentCommodity",
      list: "tracingCode/list",
      batchList: "batch/list",
    }),
    traceInfo() {
      let traceInfo = _.get(this.batchList, 'data.0.traceInfo') || [];
      return traceInfo;
    }
  },
  methods: {
    ...mapMutations({
      updateBatchSearchField: "batch/updateSearchField",
      resetBatchSearchField: "batch/resetSearchField",
      resetBatchPagination: "batch/resetPagination",
      updateSearchField: 'tracingCode/updateSearchField',
      updatePagination: 'tracingCode/updatePagination',
      resetSearchField: "tracingCode/resetSearchField",
      resetPagination: "tracingCode/resetPagination"
    }),
    ...mapActions({
      getTracingCodeList: "tracingCode/getTracingCodeList",
      getCommodityById: 'commodity/getCommodityById',
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
      this.updateSearchField({key, value});
      this.searchHandler();
    },
    handlePaginationChange(value, key) {
      this.updatePagination({ key, value });
      this.searchHandler();
    },
    searchOneHandler() {
      this.updateSearchField({key: 'batchNo', value: this.batchNo1});
      this.searchHandler();
    },
    searchTwoHandler() {
      this.updateBatchSearchField({key: 'batchNo', value: this.batchNo2});
      this.getBatchList();
    },
    searchHandler() {
      this.getTracingCodeList();
    },
    gotoCommodityEditHandler() {
      this.$router.push({ name: "CommodityEdit" });
    },
    gotoCommodityListHandler() {
      if (!this.$authority.isHasAuthority('admin:goods:page')) {
        return;
      }
      this.$router.push({ name: "CommodityList" });
    },
    showImage() {
      this.$refs.previewSingleImage.show();
    }
  }
}
</script>
<style lang="scss" scoped>
.commodity-detail-container {
  width: 100%;
  height: 100%;
  .commodity-detail-content-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: calc(100% - 100px);
    .left-field {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      height: 100%;
      margin-right: 20px;
      .left-top-field {
        width: 100%;
        height: 39.5238%;
        border-radius: 4px;
        background-color: #202C41;
        .left-top-content {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100% - 62px);
          padding: 20px 100px;
          .text-info {
            .text-info-item {
              display: flex;
              align-items: center;
              color: #9FA8B8;
              font-size: 14px;
              width: 100%;
              line-height: 14px;
              margin-bottom: 10px;
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
          .img-info {
            display: flex;
            .carousel-title {
              text-align: center;
              font-size: 14px;
              line-height: 14px;
              margin-bottom: 10px;
            }
            .carousel-one {
              margin-right: 24px;
            }
            .cover-image {
              width: 160px;
              height: 160px;
            }
          }
        }
      }
      .left-bottom-field {
        flex: 1;
        width: 100%;
        border-radius: 4px;
        background-color: #202C41;
        margin-top: 20px;
        .left-bottom-content {
          padding: 20px;
        }
      }
    }
    .right-field {
      display: flex;
      flex-direction: column;
      width: 34.82%;
      // height: 100%;
      // min-height: 508px;
      border-radius: 4px;
      background-color: #202C41;
      .right-field-content {
        position: relative;
        max-height: 720px;
        // min-height: 446px;
        width: 100%;
        height: calc(100% - 62px);
        padding: 20px 0;
        overflow: hidden;
        margin: 0 auto;
        overflow-y: scroll;
        .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: absolute;
          // width: 100%;
          // height: 100%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          .svg-icon {
            width: 64px;
            height: 64px;
          }
          .text {
            color: #9FA8B8;
            font-size: 14px;
            margin-top: 20px;
          }
        }
      }
    }
    .header {
      position: relative;
      display: flex;
      align-items: center;
      height: 62px;
      padding: 0 20px;
      border-bottom: 1px solid #3A4763;
      .svg-one {
        width: 32px;
        height: 32px;
      }
      .title {
        color: #F0F0F0;
        font-size: 16px;
        margin: 0 10px 0 18px;
      }
      .status-icon {
        width: 80px;
        height: 32px;
        font-size: 16px;
        line-height: 32px;
        text-align: center;
        background-color: #2A394E;
        border-radius: 4px;
        margin-left: 10px;
        &.status {
          color: #7ED321;
        }
        &.visible {
          color: #FF6E6E;
        }
      }
      .date {
        position: absolute;
        right: 20px;
        top: 50%;
        color: #9FA8B8;
        font-size: 14px;
        transform: translateY(-50%);
      }

    }
    .title-icon1 {
      width: 20px;
      height: 20px;
      background-image: url('../../assets/img/title_icon3.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .title-icon2 {
      width: 16px;
      height: 20px;
      background-image: url('../../assets/img/title_icon2.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .title-icon3 {
      width: 20px;
      height: 20px;
      background-image: url('../../assets/img/title_icon3.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
<style lang="scss">
.el-table {
  .el-table__header {
    .header-cell {
      background: #21304A;
    }
  }
}
.input-search-field {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  .input-search {
    position: relative;
    padding-right: 0;
    .el-input__inner {
      width: 170px;
      height: 26px;
      line-height: 26px;
      border-radius: 2px;
      color: #fff;
      padding-right: 45px;
      &:focus {
        border-color: #2EABFF;
      }
      &:hover {
        color: #6F7480;
        border-color: #0067AC;
      }
    }
    .el-input__suffix {
      margin-right: 20px;
      margin-top: -4px;
      color: #A8ABB3;
    }
    .input-search-btn {
      position: absolute;
      right: 0;
      top: 50%;
      width: 12px;
      height: 12px;
      margin-right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      .svg-icon {
        width: 12px;
        height: 12px;
        margin-right: 0;
      }
      .input-search-btn {
        display: block;
      }
      .input-search-btn-active {
        display: none;
      }
      &:hover {
        .input-search-btn {
          display: none;
        }
        .input-search-btn-active {
          display: block;
        }
      }
    }
  }
}
</style>
