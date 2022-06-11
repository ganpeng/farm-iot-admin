<!--编辑摄像头-->
<template>
  <div id="camera-container">
    <div class="content-sub-title">设备信息</div>
    <el-form
      :model="cameraInfo"
      :rules="infoRules"
      status-icon
      ref="cameraInfoBasic"
      label-width="160px"
      class="form-block fill-form">
      <el-form-item class="el-form-split-block" label-width="0">
        <el-form-item label="devicename" prop="id" label-width="190px">
          {{cameraInfo.nationalStandardId}}
        </el-form-item>
        <!-- 摄像头类型:cameraType [ 球机==2 | 枪机==1] 子荣20201215根据文档确定 -->
        <el-form-item label="设备类型" prop="type" label-width="190px">
          {{parseInt(cameraInfo.cameraType) === 1 ? '枪机':'球机'}}
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block" label-width="0">
        <el-form-item label="接入类型" prop="id" label-width="190px">
          {{cameraInfo.deviceType === 'CAMERA' ? '摄像头':'平台NVR'}}
        </el-form-item>
        <el-form-item label="streamname" prop="type" label-width="190px">
          <span class="nvr-id">{{cameraInfo.streamName}}</span>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="设备名称" prop="deviceName" required label-width="181px">
          <el-input
            v-model="cameraInfo.deviceName"
            size="medium"
            placeholder="名称">
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block simple-big-margin" label-width="0">
        <el-form-item label="经纬度" prop="latitude" label-width="190px">
          <div class="latitude-block">
            <label>{{cameraInfo.latitude}} {{cameraInfo.longitude}}</label>
            <span class="modify-btn" @click="selectMapPositionVisible = true"
                  v-if="cameraInfo.latitude || cameraInfo.longitude">修改</span>
            <span v-else class="modify-btn" @click="selectMapPositionVisible = true">设置</span>
          </div>
        </el-form-item>
        <el-form-item label="厂商" prop="cameraVendor" label-width="190px">
          <div class="vendor-name">{{cameraInfo.cameraVendor | getCameraVendorName}}</div>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="所属农场" prop="farmName" required label-width="181px">
          <el-autocomplete
            v-model="cameraInfo.farmName"
            value-key="name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入农场"
            @select="handleSelectFarm"
            @change="handlerChangeFarm($event)">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="所属地块" prop="landCode" required label-width="190px">
          <el-select
            v-model="cameraInfo.landCode"
            @change="selectLand($event)"
            size="medium"
            placeholder="请选择所属地块">
            <el-option
              v-for="item in landOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!--  运维负责人 -->
    <div class="seperator-line"></div>
    <div class="content-sub-title">运维负责人</div>
    <el-form
      :model="cameraInfo"
      :rules="infoRules"
      status-icon
      ref="cameraInfo"
      label-width="160px"
      class="form-block fill-form">
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="所属公司" prop="managerCompany" label-width="181px">
          <el-select
            v-model="cameraInfo.managerCompany"
            size="medium"
            placeholder="请选择所属公司">
            <el-option
              v-for="item in managerCompanyOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工姓名" prop="manager" label-width="190px">
          <el-input
            v-model="cameraInfo.manager"
            size="medium"
            placeholder="员工姓名">
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="员工电话" prop="managerPhone" label-width="181px">
          <el-input
            v-model="cameraInfo.managerPhone"
            size="medium"
            placeholder="员工电话">
          </el-input>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!--  PTZ设置 -->
    <div class="seperator-line" v-if="parseInt(cameraInfo.cameraType) === 2"></div>
    <!-- <div class="content-sub-title" v-if="parseInt(cameraInfo.cameraType) === 2">PTZ设置</div>
    <div id="ptz-content" v-if="parseInt(cameraInfo.cameraType) === 2"> -->
    <div class="content-sub-title" v-if="flase">PTZ设置</div>
    <div id="ptz-content" v-if="false">
      <video
        id="my-player"
        class="video-js"
        controls
        autoplay
        preload="auto"
        poster="//vjs.zencdn.net/v/oceans.png"
        data-setup='{}'>
        <source :src="playUrl" type="application/x-mpegURL"></source>
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
      <div class="control-block">
        <div>
          <span @click="moveCameraPosition('PAN_WEST_TILE_NORTH')">
            <svg-icon icon-class="ptz_1_0"></svg-icon>
            <svg-icon icon-class="ptz_1_1"></svg-icon>
          </span>
          <span @click="moveCameraPosition('TILT_NORTH')">
            <svg-icon icon-class="ptz_2_0"></svg-icon>
            <svg-icon icon-class="ptz_2_1"></svg-icon>
          </span>
          <span @click="moveCameraPosition('PAN_EAST_TILE_NORTH')">
            <svg-icon icon-class="ptz_3_0"></svg-icon>
            <svg-icon icon-class="ptz_3_1"></svg-icon>
          </span>
        </div>
        <div>
          <span @click="moveCameraPosition('PAN_WEST')">
            <svg-icon icon-class="ptz_4_0"></svg-icon>
            <svg-icon icon-class="ptz_4_1"></svg-icon>
          </span>
          <span @click="moveCameraPosition('PAN_EAST')">
            <svg-icon icon-class="ptz_5_0"></svg-icon>
            <svg-icon icon-class="ptz_5_1"></svg-icon>
          </span>
        </div>
        <div>
          <span @click="moveCameraPosition('PAN_WEST_TILE_SOUTH')">
            <svg-icon icon-class="ptz_6_0"></svg-icon>
            <svg-icon icon-class="ptz_6_1"></svg-icon>
          </span>
          <span @click="moveCameraPosition('TILT_SOUTH')">
            <svg-icon icon-class="ptz_7_0"></svg-icon>
            <svg-icon icon-class="ptz_7_1"></svg-icon>
          </span>
          <span @click="moveCameraPosition('PAN_EAST_TILE_SOUTH')">
            <svg-icon icon-class="ptz_8_0"></svg-icon>
            <svg-icon icon-class="ptz_8_1"></svg-icon>
          </span>
        </div>
        <label>注：说明：PTZ设置实时生效</label>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two edit-bottom-btn" type="primary" @click="operateCamera" :loading="isLoading">保存
      </el-button>
      <el-button class="btn-style-three" @click="toCameraList" plain>返回列表</el-button>
    </div>
    <el-dialog
      title="选择摄像头坐标"
      :visible.sync="selectMapPositionVisible"
      :close-on-click-modal=false
      custom-class="normal-dialog"
      top="13vh"
      width="80%">
      <select-map-position
        ref="map"
        :move="true"
        :mapCenter="[cameraInfo.longitude, cameraInfo.latitude]">
      </select-map-position>
      <span slot="footer" class="dialog-footer">
                <el-button @click="resetMap" class="modify-btn ">取消</el-button>
                <el-button type="primary" @click="confirmPosition" class="create-btn">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import video from 'video.js'
  import 'video.js/dist/video-js.css'
  import SelectMapPosition from "../SelectMapPosition";


  export default {
    name: 'EditCamera',
    components: {SelectMapPosition},
    data() {
      let checkDeviceName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('设备名称不能为空'));
        } else if (this.$util.trim(value).length > 15) {
          return callback(new Error('设备名称不能超过15个字符'));
        } else {
          callback();
        }
      };
      let checkLatitude = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          callback();
        } else {
          callback();
        }
      };
      let checkFarmName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入农场'));
        } else {
          callback();
        }
      };
      let checkLandCode = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择地块名称'));
        } else {
          callback();
        }
      };
      let checkManagerCompany = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          callback();
        } else {
          callback();
        }
      };
      let checkManager = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          callback();
        } else {
          callback();
        }
      };
      let checkManagerPhone = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          callback();
        } else if (!this.$util.isMobile(value)) {
          return callback(new Error('请填写正确的联系方式'));
        } else {
          callback();
        }
      };
      return {
        farmListAll: [],
        selectMapPositionVisible: false,
        playUrl: 'http://n.video.tianchimedia.net/live/22032300310000000001.m3u8?auth_key=1894352715-0-0-a95de2f894265aa8bd8f311c9eed4cce',
        cameraInfo: {
          type: 1
        },
        isLoading: false,
        farmOptions: [],
        landOptions: [],
        managerCompanyOptions: [],
        infoRules: {
          deviceName: [
            {validator: checkDeviceName, trigger: 'blur'},
            {validator: checkDeviceName, trigger: 'change'}
          ],
          latitude: [
            {validator: checkLatitude, trigger: 'change'}
          ],
          farmName: [
            {validator: checkFarmName, trigger: 'change'},
            {validator: checkFarmName, trigger: 'blur'}
          ],
          landCode: [
            {validator: checkLandCode, trigger: 'change'}
          ],
          managerCompany: [
            {validator: checkManagerCompany, trigger: 'change'}
          ],
          manager: [
            {validator: checkManager, trigger: 'blur'}
          ],
          managerPhone: [
            {validator: checkManagerPhone, trigger: 'change'},
            {validator: checkManagerPhone, trigger: 'blur'}
          ]
        }
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      handlerChangeFarm(value) {
        if (!this.cameraInfo.selectedFarm || !this.isFarmName(value)) {
          this.cameraInfo.farmId = '';
          this.cameraInfo.farmName = '';
        }
        this.cameraInfo.selectedFarm = false;
      },
      isFarmName(farmName) {
        let tag = false;
        this.farmListAll.map(farm => {
          if (farm.name === farmName) {
            tag = true;
          }
        });
        return tag;
      },
      init() {
        this.$util.toggleFixedBtnContainer();
        this.$service.getFarmList({pageNum: 0, pageSize: 1000}).then(response => {
          if (response && response.code === 0) {
            this.farmOptions = response.data.list;
          }
        });
        this.$service.getCameraDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            this.cameraInfo = response.data;
            this.getLandList();
          }
        });
        this.$service.getDevOpsCompanyList().then(response => {
          if (response && response.code === 0) {
            this.managerCompanyOptions = response.data;
          }
        });
        this.initVideo();
        this.$service.getFarmList({pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            this.farmListAll = response.data.list;
          }
        });
      },
      initVideo() {
        let that = this;
        let myPlayer = video('my-player', {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: true,
            //自动播放属性,muted:静音播放
            autoplay: 'muted',
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            video: {url: that.playUrl},
            width: "640px",
            //设置视频播放器的显示高度（以像素为单位）
            height: "320px"
          }, function onPlayerReady() {
            // this.play();
          }
        )
      },
      selectLand(landCode) {
        this.landOptions.map(item => {
          if (item.code === landCode) {
            console.log(item);
            this.cameraInfo.landName = item.name;
            this.cameraInfo.landId = item.id;
          }
        });
      },
      // 放弃修改经纬度
      resetMap() {
        this.$refs.map.resetMap();
        this.selectMapPositionVisible = false;
      },
      // 修改经纬度
      confirmPosition() {
        this.cameraInfo.latitude = this.$refs.map.getPosition().lat;
        this.cameraInfo.longitude = this.$refs.map.getPosition().lng;
        this.selectMapPositionVisible = false;
      },
      querySearchAsync(queryString, cb) {
        this.$service.getFarmList({keyword: queryString, pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            cb(response.data.list);
          }
        });
      },
      handleSelectFarm(item) {
        this.cameraInfo.farmId = item.id;
        this.cameraInfo.farmName = item.name;
        this.getLandList(true);
      },
      moveCameraPosition(position) {
        this.$service.controlCameraPosition({
          // streamName: this.cameraInfo.nationalStandardId,
          streamName: '206295402260234736-cn-qingdao',
          cameraMovement: position
        }).then(response => {
          if (response && response.code === 0) {
            this.$message.success('已调整，请稍后观看效果');
          }
        })
      },
      getLandList(isReset) {
        if (isReset) {
          this.cameraInfo.landCode = '';
        }
        this.landOptions = [];
        let landOptions = [];
        let homesteadPromise = this.$service.getHomesteadList({
          pageNum: 0,
          pageSize: 1000,
          farmId: this.cameraInfo.farmId
        }).then(response => {
          if (response && response.code === 0) {
            landOptions = landOptions.concat(response.data.list);
          }
        });
        let landPromise = this.$service.getLandList({
          pageNum: 0,
          pageSize: 1000,
          farmId: this.cameraInfo.farmId
        }).then(response => {
          if (response && response.code === 0) {
            landOptions = landOptions.concat(response.data.list);
          }
        });
        Promise.all([homesteadPromise, landPromise]).then(() => {
          this.landOptions = landOptions;
        }).catch(e => {

        });
      },
      // 更新摄像头
      operateCamera() {
        if (!this.$authority.isHasAuthority('admin:camera:edit')) {
          return;
        }
        this.$refs['cameraInfoBasic'].validate((valid) => {
          if (valid) {
            this.$service.updateCameraInfo(this.cameraInfo).then(response => {
              if (response && response.code === 0) {
                this.$message.success('更新信息成功');
                this.toCameraList();
              }
            })
          }
        });
      },
      toCameraList() {
        if (!this.$authority.isHasAuthority('admin:camera:page')) {
          return;
        }
        this.$router.push({name: 'CameraList'});
      }
    }
  }
  ;
</script>

<style lang="scss" scoped>


  .content-sub-title {
    margin-top: 30px;
    margin-left: 20px;
  }

  .vendor-name {
    width: 240px;
  }

  .modify-btn {
    margin-left: 20px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(46, 171, 255, 1);
    cursor: pointer;
  }

  .seperator-line {
    margin-left: 20px;
    margin-right: 20px;
    padding-top: 30px;
  }

  #ptz-content {
    margin-left: 20px;
    margin-bottom: 116px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .control-block {
      position: relative;
      margin-left: 120px;
      width: 238px;
      height: 238px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      label {
        position: absolute;
        bottom: -37px;
        left: 42px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }

      div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        span {
          width: 70px;
          height: 70px;
          cursor: pointer;

          &:focus, &:hover {
            .svg-icon {
              width: 70px !important;
              height: 70px !important;

              &:first-child {
                display: none;
              }

              &:last-child {
                display: block;
              }
            }
          }

          .svg-icon {
            width: 70px !important;
            height: 70px !important;

            &:first-child {
              display: block;
            }

            &:last-child {
              display: none;
            }
          }
        }
      }
    }

    video {
      width: 568px;
      height: 320px;
      border-radius: 2px;
    }
  }

  .latitude-block {
    width: 250px;
  }


</style>


<style lang="scss">

  #camera-container {
    .el-form-split-block {
      & > .el-form-item__content {
        display: flex;
        align-items: center;
        flex-direction: row;
        .el-form-item {
          width: 50%;
          .el-input {
            width: 240px;
          }
        }
      }
    }
  }

</style>

