<template>
  <div class="farm-detail-container my-content-container">
    <div class="detail-content">
      <div class="top-field">
        <div class="top-left-field">
          <div class="header">
            <div class="title">
              <svg-icon class="default_svg" icon-class="basic_info"/>
              <span class="title-text">基础信息</span>
            </div>
            <div class="date">成立于 {{farm.createdAt | formatDate('yyyy-MM-DD')}}</div>
          </div>
          <div class="top-left-content">
            <div class="left-info">
              <div class="info-item">
                <div class="label">农场名称</div>
                <div class="value">
                  {{farm.name}}
                </div>
              </div>
              <div class="info-item">
                <div class="label">信用代码</div>
                <div class="value">
                  {{farm.creditCode}}
                  <span
                    v-if="farm.partyMemberNum"
                    class="party-member"
                  >{{farm.partyMemberNum}}名党员</span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">经营项目</div>
                <div class="value">{{manageTypesLabel}}</div>
              </div>
              <div class="info-item">
                <div class="label">经营地址</div>
                <div class="value">{{farm.address}}</div>
              </div>
              <div class="info-item">
                <div class="label">农场坐标</div>
                <div class="value">
                  <span>E {{farm.longitude}}, N {{farm.latitude}}</span>
                  <span @click="showMyMap" class="show-btn">查看</span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">农场简介</div>
                <div class="value">{{farm.description}}</div>
              </div>
            </div>
            <div class="right-info">
              <span class="one">{{farm.farmType}}</span>
              <ul class="tag-list">
                <li
                  v-for="(mark, index) in farm.farmMarks"
                  :key="index"
                  class="tag-item"
                >{{mark.name}}</li>
              </ul>
              <div class="cover-image-container">
                <my-carousel theme="no-default" :fileList="imageList" id="farm_carousel" :canDelete="false" :width="280" :height="210"></my-carousel>
              </div>
            </div>
          </div>
        </div>
        <div class="top-right-field">
          <div class="header">
            <div class="title">
              <svg-icon class="default_svg" icon-class="contact_us"/>
              <span class="title-text">联系人</span>
            </div>
          </div>
          <div class="top-right-content">
            <div class="info-item-container">
              <div class="contact-title">法人</div>
              <div class="info-item">
                <div class="label">姓名</div>
                <div class="value">{{farm.corporationName}}</div>
              </div>
              <div class="info-item">
                <div class="label">联系电话</div>
                <div class="value">{{farm.corporationTel}}</div>
              </div>
              <div class="info-item">
                <div class="label">身份证</div>
                <div class="value">{{farm.corporationId}}</div>
              </div>
              <div class="info-item">
                <div class="label">住址</div>
                <div class="value">{{farm.corporationAddr}}</div>
              </div>
            </div>
            <div class="info-item-container">
              <div class="contact-title">常务联系人</div>
              <div class="info-item">
                <div class="label">姓名</div>
                <div class="value">{{farm.contactName}}</div>
              </div>
              <div class="info-item">
                <div class="label">联系电话</div>
                <div class="value">{{farm.contactTel}}</div>
              </div>
              <div class="info-item">
                <div class="label">住址</div>
                <div class="value">{{farm.contactAddr}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button v-if="approveStatus === 'APPROVING' && isAdmin" class="btn-style-three" @click="rejectEdit">拒绝</el-button>
      <el-button v-if="approveStatus === 'APPROVING' && isAdmin" class="btn-style-two" @click="passEdit">通过</el-button>      
      <el-button v-if="approveStatus === 'REJECT'" class="check-status-btn reject-status-btn">已拒绝</el-button>
      <el-button class="btn-style-three" @click="gotoFarmList">返回列表</el-button>
    </div>
    <map-display-dialog :lnglat="lnglat" ref="mapDisplayDialog"></map-display-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import MapDisplayDialog from "./MapDisplayDialog";
import MyCarousel from '@/components/MyCarousel';
import {passEdit, rejectEdit} from "@/util/asyncFun";
export default {
  name: "CheckFarmDetail",
  components: {MapDisplayDialog, MyCarousel},
  data() {
    return {
      approveStatus: "", // 审核状态 approveStatus === "APPROVING" ? "待审核" : "已拒绝" 已同意的无法在审核列表中体现
      lnglat: [],
      isAdmin: false,
    };
  },
  mounted() {
    this.isAdmin = this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' || this.$wsCache.localStorage.get('login').roleType === 'CUSTOM';
    const {baseInfo, id, approveStatus, checkId} = this.$route.params;
    this.approveStatus = approveStatus;
    this.checkId = checkId;
    if(localStorage.getItem('checkFarmInfo')) {
      let cacheInfo = JSON.parse(localStorage.getItem('checkFarmInfo'));
      // 这里判断是担心直接关闭浏览器导致没有清空缓存 导致 显示错误信息
      if(Number(cacheInfo.id) === Number(this.$route.path.split('/')[3])) {
        // 如果ID对应的上 就显示缓存信息 -- 这里处理的是 刷新页面的情况
        this.setCurrentFarm({farm: cacheInfo});
        this.approveStatus = localStorage.getItem('approveStatus');
      } else { 
        // ID对应不上 更新缓存
        localStorage.setItem('checkFarmInfo', JSON.stringify(this.$route.params.baseInfo));
        localStorage.setItem('approveStatus', approveStatus);
        this.setCurrentFarm({farm: this.$route.params.baseInfo});
      }
    } else {
      // 没有缓存的情况
      localStorage.setItem("checkFarmInfo", JSON.stringify(this.$route.params.baseInfo));
      localStorage.setItem('approveStatus', approveStatus);
      this.setCurrentFarm({farm: this.$route.params.baseInfo});
    }
  },
  beforeDestroy() {
    // 这里只有正常的销毁才走这里 直接关闭浏览器不会走这一步
    localStorage.removeItem('checkFarmInfo');
    localStorage.removeItem('approveStatus');
  },
  computed: {
    ...mapGetters({
      farm: "farm/currentFarm"
    }),
    manageTypesLabel() {
      return this.farm.manageTypes.map(item => item.name).join(", ");
    },
    imageList() {
      let fileUrls = this.farm.farmCertificates.map(item => item.fileUrl);
      fileUrls.unshift(this.farm.farmIndexUrl);
      return fileUrls;
    }
  },
  methods: {
    ...mapMutations({
      setCurrentFarm: "farm/setCurrentFarm"
    }),
    gotoFarmList() {
      this.$router.push({ name: "FarmCheckList" });
    },
    showMyMap() {
      let {longitude, latitude} = this.farm;
      if (longitude && latitude) {
        this.lnglat = [longitude, latitude];
      }
      this.$refs.mapDisplayDialog.show();
    },
    // 拒绝审核
    async rejectEdit() {
      let result = await rejectEdit(this.checkId);
      result && this.gotoFarmList();
    },
    // 通过审核
    async passEdit() {
      let result = await passEdit(this.checkId);
      result && this.gotoFarmList();
    },  
  }
};
</script>
<style lang="scss" scoped>
.farm-detail-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  .detail-content {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 52px;
      padding: 0 20px;
      border-bottom: 1px solid #3e495e;
      .title {
        .svg-icon {
          width: 20px;
          height: 20px;
        }
        .title-text {
          font-size: 16px;
          font-weight: 500;
          color: #f0f0f0;
          margin-left: 10px;
          .unit {
            font-size: 14px;
          }
        }
      }
      .date {
        font-size: 12px;
        font-weight: 400;
        color: #9fa8b8;
      }
    }
    .top-field {
      display: flex;
      justify-content: space-between;
      height: 426px;
      margin-bottom: 1.776%;
      .top-left-field {
        flex: 1;
        background: #202c41;
        border-radius: 10px;
        .top-left-content {
          display: flex;
          padding: 20px;
          .left-info {
            flex: 1;
            .info-item {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              .label {
                font-size: 12px;
                font-weight: 400;
                color: #f0f0f0;
                margin-right: 20px;
                white-space: nowrap;
              }
              .value {
                flex: 1;
                font-size: 12px;
                font-weight: 400;
                color: #9fa8b8;
                word-break: break-word;
                .party-member {
                  display: inline-block;
                  height: 26px;
                  line-height: 26px;
                  padding: 0 10px;
                  background: rgba(42, 57, 78, 1);
                  border-radius: 4px;
                  text-align: center;
                  margin-left: 20px;
                }
              }
              .show-btn {
                color: #2eabff;
                font-size: 12px;
                cursor: pointer;
                margin-left: 10px;
              }
              &:last-child {
                align-items: flex-start;
              }
            }
          }
          .right-info {
            width: 280px;
            margin-left: 30px;
            .one {
              display: inline-block;
              font-size: 14px;
              font-weight: 400;
              color: #fff;
              height: 26px;
              line-height: 26px;
              padding: 0 15px;
              border-radius: 4px;
              background-color: #2c9cf5;
              margin-bottom: 10px;
            }
            .tag-list {
              display: flex;
              flex-wrap: wrap;
              .tag-item {
                height: 26px;
                line-height: 26px;
                padding: 0 10px;
                border-radius: 4px;
                border: 1px solid #3e495e;
                font-size: 12px;
                font-weight: 400;
                color: #9fa8b8;
                margin-bottom: 10px;
                margin-right: 10px;
              }
            }
            .cover-image-container {
              width: 280px;
              height: 210px;
            }
          }
        }
      }
      .top-right-field {
        width: 32.149%;
        margin-left: 1.776%;
        background: #202c41;
        border-radius: 10px;
        .top-right-content {
          padding: 20px;
          .info-item-container {
            &:first-child {
              border-bottom: 1px solid #3e495e;
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            .contact-title {
              font-size: 14px;
              font-weight: 400;
              color: #fff;
              margin-bottom: 14px;
            }
            .info-item {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              .label {
                width: 60px;
                font-size: 12px;
                font-weight: 400;
                color: #f0f0f0;
                margin-right: 20px;
                white-space: nowrap;
                text-align: right;
              }
              .value {
                flex: 1;
                font-size: 12px;
                font-weight: 400;
                color: #9fa8b8;
              }
            }
          }
        }
      }
    }
    .bottom-field {
      .farm-item-list {
        display: flex;
        flex-wrap: wrap;
        .farm-item {
          display: flex;
          flex-direction: column;
          width: 32.149%;
          height: 196px;
          background: #202c41;
          margin-bottom: 1.776%;
          margin-left: 1.776%;
          .farm-item-content {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex: 1;
            .item-info {
              text-align: center;
              .label {
                font-size: 16px;
                color: #9fa8b8;
                margin-bottom: 20px;
              }
              .value {
                font-size: 32px;
                line-height: 32px;
                color: #8ab9e8;
              }
            }
          }
        }
        .farm-item:nth-of-type(3n + 1) {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
