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
                <div class="value">{{farm.address}}{{farm.detailAddress}}</div>
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
      <div class="bottom-field">
        <ul class="farm-item-list">
          <li class="farm-item">
            <div class="header">
              <div class="title">
                <svg-icon icon-class="成员-icon"/>
                <span class="title-text">
                  成员
                  <i class="unit">(人)</i>
                </span>
              </div>
            </div>
            <div class="farm-item-content">
              <div class="item-info">
                <div class="label">总数</div>
                <div class="value">{{statistic.members}}</div>
              </div>
              <div class="item-info">
                <div class="label">经营人员</div>
                <div class="value">{{statistic.manageMembers}}</div>
              </div>
              <div class="item-info">
                <div class="label">种植人员</div>
                <div class="value">{{statistic.plantMembers}}</div>
              </div>
            </div>
          </li>
          <li class="farm-item">
            <div class="header">
              <div class="title">
                <svg-icon icon-class="土地-icon"/>
                <span class="title-text">
                  土地
                  <i class="unit">(公顷)</i>
                </span>
              </div>
            </div>
            <div class="farm-item-content">
              <div class="item-info">
                <div class="label">总数</div>
                <div class="value">{{statistic.landTotal}}</div>
              </div>
              <div class="item-info">
                <div class="label">耕地</div>
                <div class="value">{{statistic.farmland}}</div>
              </div>
              <div class="item-info">
                <div class="label">水产</div>
                <div class="value">{{statistic.waterArea}}</div>
              </div>
              <div class="item-info">
                <div class="label">其他</div>
                <div class="value">{{statistic.otherLand}}</div>
              </div>
            </div>
          </li>
          <li class="farm-item">
            <div class="header">
              <div class="title">
                <svg-icon icon-class="农机-icon"/>
                <span class="title-text">
                  农机
                  <i class="unit">(组)</i>
                </span>
              </div>
            </div>
            <div class="farm-item-content">
              <div class="item-info">
                <div class="label">总数</div>
                <div class="value">{{statistic.totalMachineryNumber}}</div>
              </div>
              <div class="item-info">
                <div class="label">种植</div>
                <div class="value">{{statistic.plantingMachineryNumber}}</div>
              </div>
              <div class="item-info">
                <div class="label">加工</div>
                <div class="value">{{statistic.processMachineryNumber}}</div>
              </div>
              <div class="item-info">
                <div class="label">运输</div>
                <div class="value">{{statistic.transportMachineryNumber}}</div>
              </div>
              <div class="item-info">
                <div class="label">水产</div>
                <div class="value">{{statistic.aqMaNumber}}</div>
              </div>
              <div class="item-info">
                <div class="label">其它</div>
                <div class="value">{{statistic.otherUseMachineryNumber}}</div>
              </div>
            </div>
          </li>
          <li class="farm-item">
            <div class="header">
              <div class="title">
                <svg-icon icon-class="种植-icon"/>
                <span class="title-text">
                  产量
                  <i class="unit">(吨)</i>
                </span>
              </div>
            </div>
            <div class="farm-item-content">
              <div class="item-info">
                <div class="label">总产量</div>
                <div class="value">{{statistic.totalOutput}}</div>
              </div>
              <div class="item-info">
                <div class="label">水稻</div>
                <div class="value">{{statistic.riceAmount}}</div>
              </div>
              <div class="item-info">
                <div class="label">淡水鱼</div>
                <div class="value">{{statistic.freshwaterFishAmount}}</div>
              </div>
              <div class="item-info">
                <div class="label">其它</div>
                <div class="value">{{statistic.otherAmount}}</div>
              </div>
            </div>
          </li>
          <li class="farm-item">
            <div class="header">
              <div class="title">
                <svg-icon icon-class="经营-icon"/>
                <span class="title-text">
                  经营
                  <i class="unit">(万元)</i>
                </span>
              </div>
            </div>
            <div class="farm-item-content">
              <div class="item-info">
                <div class="label">项目拨款</div>
                <div class="value">{{statistic.governProject | toWanYuan}}</div>
              </div>
              <div class="item-info">
                <div class="label">专项补贴</div>
                <div class="value">{{statistic.subsidy | toWanYuan}}</div>
              </div>
              <div class="item-info">
                <div class="label">农业社会化服务</div>
                <div class="value">{{statistic.socialService | toWanYuan}}</div>
              </div>
            </div>
          </li>
          <li class="farm-item">
            <div class="header">
              <div class="title">
                <svg-icon icon-class="物联网-icon"/>
                <span class="title-text">
                  物联网
                  <i class="unit">(套)</i>
                </span>
              </div>
            </div>
            <div class="farm-item-content">
              <div class="item-info">
                <div class="label">传感器</div>
                <div class="value">{{statistic.sensorNumber}}</div>
              </div>
              <div class="item-info">
                <div class="label">球机</div>
                <div class="value">{{statistic.domeCameraNumber}}</div>
              </div>
              <div class="item-info">
                <div class="label">枪机</div>
                <div class="value">{{statistic.boxCameraNumber}}</div>
              </div>
              <div class="item-info">
                <div class="label">NVR设备</div>
                <div class="value">{{statistic.nvrNumber}}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two" type="primary" @click="gotoFarmManageHandler">管理农场</el-button>
      <el-button class="btn-style-three" @click="gotoFarmList">返回列表</el-button>
    </div>
    <map-display-dialog :lnglat="lnglat" ref="mapDisplayDialog"></map-display-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import MapDisplayDialog from "./MapDisplayDialog";
import MyCarousel from '@/components/MyCarousel';
export default {
  name: "FarmDetail",
  components: {MapDisplayDialog, MyCarousel},
  data() {
    return {
      lnglat: [],
      statistic: {
        // 成员
        members: 0, // 总数
        manageMembers: 0, // 管理人员总数
        plantMembers: 0, // 种植人员总数
        // 土地
        landTotal: 0, // 总数
        farmland: 0, // 耕地
        homestead: 0, // 宅基地
        // 农机
        machineryTotal: 0, // 总数
        plantMachineryNum: 0, // 种植
        processMachineryNum: 0, // 加工
        transportMachineryNum: 0, // 运输
        otherMachinery: 0, // 其它
        // 种植
        plantArea: 0, // 种植面积
        rice: 0, // 水稻
        otherPlants: 0, // 其它
        // 经营
        governProject: 0, // 政府项目
        subsidy: 0, // 专项补贴
        socialService: 0, // 农业社会化服务
        // 物联网
        sensor: 0, // 传感器
        domeCamera: 0, // 球机摄像头
        boxCamera: 0 // 枪机摄像头
      }
    };
  },
  async created() {
    try {
      let { id } = this.$route.params;
      await this.getFarmById(id);
      let res = await this.$service.getStatistic(id);
      if (res && res.code === 0) {
        this.statistic = res.data;
      }
      await this.$nextTick();
      this.$util.toggleFixedBtnContainer();
    } catch (err) {
      console.log(err);
    }
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
    ...mapActions({
      getFarmById: "farm/getFarmById"
    }),
    gotoFarmManageHandler() {
      if (!this.$authority.isHasAuthority('admin:farm:manage')) {
        return;
      }

      let { id } = this.$route.params;
      this.$router.push({
        name: "FarmManage",
        params: { id },
        query: { name: this.farm.name }
      });
    },
    gotoFarmList() {
      this.$router.push({ name: "FarmList" });
    },
    showMyMap() {
      let {longitude, latitude} = this.farm;
      if (longitude && latitude) {
        this.lnglat = [longitude, latitude];
      }
      this.$refs.mapDisplayDialog.show();
    }
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
