<!--编辑传感器-->
<template>
  <div id="sensor-container">
    <div class="content-sub-title">设备信息</div>
    <el-form
      :model="sensorInfo"
      :rules="infoRules"
      status-icon
      ref="sensorInfo-0"
      label-width="160px"
      class="form-block fill-form">
      <el-form-item class="el-form-split-block" label-width="0">
        <el-form-item label="devicename" prop="devicename" label-width="190px">
          {{sensorInfo.deviceName}}
        </el-form-item>
        <el-form-item label="设备类型" prop="type" label-width="190px">
          {{sensorInfo.sensorType}}
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block" label-width="0">
        <el-form-item label="设备名称" prop="name" required label-width="190px">
          <el-input
            v-model="sensorInfo.name"
            size="medium"
            placeholder="设备名称">
          </el-input>
        </el-form-item>
        <el-form-item label="经纬度" prop="latitude" label-width="190px">
          <div class="latitude-block">
            <label>{{sensorInfo.latitude}} {{sensorInfo.longitude}}</label>
            <span v-if="sensorInfo.latitude || sensorInfo.longitude" class="modify-btn"
                  @click="selectMapPositionVisible = true">修改</span>
            <span v-else class="modify-btn" @click="selectMapPositionVisible = true">修改</span>
          </div>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="所属企业" prop="farmName" required label-width="190px">
          <el-autocomplete
            v-model="sensorInfo.farmName"
            value-key="name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入企业"
            @select="handleSelectFarm"
            @change="handlerChangeFarm($event)">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="厂商" prop="sensorVendor" label-width="190px">
          {{sensorInfo.sensorVendor}}
          <!-- <div class="vendor-name">{{}}</div> -->
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item v-if="sensorInfo.sensorType !== '虫情测报灯'" label="预警模型" prop="modelName" label-width="190px">
          <el-autocomplete
            v-model="sensorInfo.modelName"
            value-key="name"
            :fetch-suggestions="querySearchModelAsync"
            placeholder="请输入预警模型"
            @select="handleSelectModel"
            @change="handlerChangeModel($event)">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="所属地块" prop="landCode" required label-width="190px">
          <el-select
            v-model="sensorInfo.landCode"
            size="medium"
            @change="selectLand($event)"
            placeholder="请选择地块地块名称">
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
      :model="sensorInfo"
      :rules="infoRules"
      status-icon
      ref="sensorInfo-1"
      label-width="160px"
      class="form-block fill-form">
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="所属公司" prop="managerCompany" label-width="181px">
          <el-select
            v-model="sensorInfo.managerCompany"
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
            v-model="sensorInfo.manager"
            size="medium"
            placeholder="员工姓名">
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="员工电话" prop="managerPhone" label-width="181px">
          <el-input
            v-model="sensorInfo.managerPhone"
            size="medium"
            placeholder="员工电话">
          </el-input>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!--  数据设置 -->
    <div class="seperator-line"></div>
    <div class="content-sub-title">数据设置</div>
    <div id="data-content">
      <el-form
        :model="sensorInfo"
        :rules="infoRules"
        status-icon
        ref="sensorInfo-2"
        label-width="160px"
        class="form-block fill-form">
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label="上报间隔" prop="intervalValue" required label-width="181px">
            <el-select
              v-model="sensorInfo.intervalValue"
              size="medium"
              placeholder="请选择数据上报间隔时间">
              <el-option
                v-for="item in intervalValueOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <i class="unit">分钟</i>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two edit-bottom-btn" type="primary" @click="operateSensor" :loading="isLoading">保存
      </el-button>
      <el-button class="btn-style-three" @click="toSensorList" plain>返回列表</el-button>
    </div>
    <el-dialog
      title="选择传感器坐标"
      :visible.sync="selectMapPositionVisible"
      :close-on-click-modal=false
      custom-class="normal-dialog"
      top="13vh"
      width="80%">
      <select-map-position
        ref="map"
        :move="true"
        :mapCenter="[sensorInfo.longitude, sensorInfo.latitude]">
      </select-map-position>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetMap" class="modify-btn">取消</el-button>
    <el-button type="primary" @click="confirmPosition" class="create-btn">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import SelectMapPosition from "../SelectMapPosition";


  export default {
    name: 'EditSensor',
    components: {SelectMapPosition},
    data() {
      let checkName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入设备名称'));
        } else {
          callback();
        }
      };
      let checkDeviceName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('设备名称不能为空'));
        } else if (this.$util.trim(value).length > 30) {
          return callback(new Error('设备名称不能超过30字'));
        } else {
          callback();
        }
      };
      let checkLatitude = (rule, value, callback) => {
        if (this.$util.isEmpty(this.sensorInfo.latitude)) {
          callback();
        } else {
          callback();
        }
      };
      let checkFarmName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入企业'));
        } else {
          callback();
        }
      };
      // let checkModelName = (rule, value, callback) => {
      //   if (this.$util.isEmpty(value)) {
      //     return callback(new Error('请输入预警模型'));
      //   } else {
      //     callback();
      //   }
      // };
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
      let checkIntervalValue = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择上报间隔'));
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
        modelListAll: [],
        selectMapPositionVisible: false,
        sensorInfo: {},
        isLoading: false,
        farmOptions: [],
        landOptions: [],
        managerCompanyOptions: [],
        intervalValueOptions: [1, 2, 3, 4, 5],
        infoRules: {
          name: [
            {validator: checkName}
          ],
          deviceName: [
            {validator: checkDeviceName, trigger: 'blur'}
          ],
          latitude: [
            {validator: checkLatitude, trigger: 'change'}
          ],
          farmName: [
            {validator: checkFarmName, trigger: 'change'},
            {validator: checkFarmName, trigger: 'blur'}
          ],
          // modelName: [
          //   {validator: checkModelName, trigger: 'change'},
          //   {validator: checkModelName, trigger: 'blur'}
          // ],
          landCode: [
            {validator: checkLandCode, trigger: 'change'}
          ],
          intervalValue: [
            {validator: checkIntervalValue, trigger: 'change'}
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
        if (!this.sensorInfo.selectedFarm || !this.isFarmName(value)) {
          this.sensorInfo.farmId = '';
          this.sensorInfo.farmName = '';
        }
        this.sensorInfo.selectedFarm = false;
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
      handlerChangeModel(value) {
        if (!this.sensorInfo.selectedModel || !this.isModelName(value)) {
          this.sensorInfo.modelId = '';
          this.sensorInfo.modelName = '';
        }
        this.sensorInfo.selectedModel = false;
      },
      isModelName(modelName) {
        let tag = false;
        this.modelListAll.map(model => {
          if (model.name === modelName) {
            tag = true;
          }
        });
        return tag;
      },
      init() {
        let array = [];
        for (let i = 1; i < 61; i++) {
          array.push(i);
        }
        this.intervalValueOptions = array;
        this.$util.toggleFixedBtnContainer();
        this.$service.getFarmList({pageNum: 0, pageSize: 1000}).then(response => {
          if (response && response.code === 0) {
            this.farmOptions = response.data.list;
          }
        });
        this.$service.getSensorDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            this.sensorInfo = response.data;
            this.getLandList();
          }
        });
        this.$service.getDevOpsCompanyList().then(response => {
          if (response && response.code === 0) {
            this.managerCompanyOptions = response.data;
          }
        });
        this.$service.getFarmList({pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            this.farmListAll = response.data.list;
          }
        });
        this.$service.getModelList({pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            this.modelListAll = response.data.list;
          }
        });
      },
      selectLand(landCode) {
        this.landOptions.map(item => {
          if (item.code === landCode) {
            this.sensorInfo.landName = item.name;
            this.sensorInfo.landId = item.id;
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
        this.sensorInfo.latitude = this.$refs.map.getPosition().lat;
        this.sensorInfo.longitude = this.$refs.map.getPosition().lng;
        this.selectMapPositionVisible = false;
      },
      // 获取农场列表
      querySearchAsync(queryString, cb) {
        this.$service.getFarmList({keyword: queryString, pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            cb(response.data.list);
          }
        });
      },
      // 获取预警模型列表
      querySearchModelAsync(queryString, cb) {
        this.$service.getModelList({keyword: queryString, pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            cb(response.data.list);
          }
        });
      },
      handleSelectFarm(item) {
        this.sensorInfo.farmId = item.id;
        this.sensorInfo.farmName = item.name;
        this.getLandList(true);
      },
      handleSelectModel(item) {
        this.sensorInfo.modelId = item.id;
      },
      getLandList(isReset) {
        if (isReset) {
          this.sensorInfo.landCode = '';
        }
        this.landOptions = [];
        let landOptions = [];
        let homesteadPromise = this.$service.getHomesteadList({
          pageNum: 0,
          pageSize: 1000,
          farmId: this.sensorInfo.farmId
        }).then(response => {
          if (response && response.code === 0) {
            landOptions = landOptions.concat(response.data.list);
          }
        });
        let landPromise = this.$service.getLandList({
          pageNum: 0,
          pageSize: 1000,
          farmId: this.sensorInfo.farmId
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
      // 更新传感器
      operateSensor() {
        Promise.all([this.$refs['sensorInfo-0'].validate(), this.$refs['sensorInfo-1'].validate(), this.$refs['sensorInfo-2'].validate()]).then(res => {
          this.$service.updateSensorInfo(this.sensorInfo).then(response => {
            if (response && response.code === 0) {
              this.$message.success('更新信息成功');
              this.toSensorList();
            }
          })
        }).catch(e => {

        });
      },
      toSensorList() {
        this.$router.push({name: 'SensorList'});
      }
    }
  };
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

  .latitude-block {
    width: 250px;
  }

</style>

<style lang="scss">

  #sensor-container {
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
    .el-form-item__label {
      height: 30px!important;
      line-height: 30px!important;
    }
    .el-form-item__content  {
      height: 30px!important;
    }
  }

</style>

