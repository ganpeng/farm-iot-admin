<!--传感器信息表单组件-->
<template>
  <div id="sensor-container">
    <div id="steps-block">
      <div class="step-item">
        <div>1</div>
        <label>填写信息</label>
      </div>
      <span></span>
      <div class="step-item">
        <div>2</div>
        <label>信息预览</label>
      </div>
      <span></span>
      <div class="step-item">
        <div>3</div>
        <label>创建并下载</label>
      </div>
    </div>
    <div class="content-sub-title">基本信息</div>
    <div id="form-list-block">
      <el-form
        v-for="(sensorInfo, index) in  sensorInfoList"
        :key="index"
        :model="sensorInfo"
        :rules="infoRulesList[0]"
        :ref="'sensorInfo-' + index"
        label-width="80px"
        class="form-block fill-form">
        <el-form-item>
          <div class="farm-item-block">
            <div class="farm-tag">企业{{index + 1}}</div>
            <div class="operate-block">
              <div class="remove-btn-block" v-if="sensorInfoList.length !== 1" @click="removeFarmItem(index)">
                删除
                <svg-icon icon-class="remove_image_default"></svg-icon>
                <svg-icon icon-class="remove_image_hover"></svg-icon>
              </div>
              <div class="farm-expand-btn" :class="{'active':sensorInfo.expandTag}" @click="switchFarmContent(index)">
                <label>收起
                  <i class="el-icon-arrow-up"></i>
                </label>
                <label>展开
                  <i class="el-icon-arrow-down"></i>
                </label>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0" v-if="sensorInfo.expandTag">
          <el-form-item label="企业" prop="farmName" required label-width="158px">
            <el-autocomplete
              v-model="sensorInfo.farmName"
              value-key="name"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入企业"
              @select="handleSelectFarm($event, index)"
              @change="handlerChangeFarm($event, index)">
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="设备数量" prop="sensorNumber" required label-width="188px">
            <el-input
              class="number-input"
              v-model="sensorInfo.sensorNumber"
              size="medium"
              placeholder="数量">
            </el-input>
            <i class="unit">套</i>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0" v-if="sensorInfo.expandTag">
          <el-form-item label="厂商" prop="sensorVendor" required label-width="158px">
            <el-select
              v-model="sensorInfo.sensorVendor"
              size="medium"
              placeholder="请选择厂商">
              <el-option
                v-for="item in sensorVendorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" label-width="188px">
            <div class="plant-num-container">
              <span class="plant-num">{{sensorInfo.sensorType}}</span>
            </div>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-item-btn"
         @click="addSensor">
      <svg-icon icon-class="add_item_normal"></svg-icon>
      <svg-icon icon-class="add_item_active"></svg-icon>
      添加条目
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two preview-btn" type="primary" @click="previewSensor" :loading="isLoading">预览并新建
      </el-button>
    </div>
    <el-dialog
      title="预览信息"
      :visible.sync="previewVisible"
      :close-on-click-modal=false
      :before-close="beforeClose"
      custom-class="normal-dialog"
      top="13vh"
      width="80%">
      <preview-sensor
        v-if="previewVisible"
        :sensorInfoList="sensorInfoList"
        :previewedSensorList="previewedSensorList">
      </preview-sensor>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reModifyInfo" class="modify-btn">修改信息</el-button>
        <el-button type="primary"
                   @click="confirmCreateSensor"
                   class="create-btn"
                   :loading="isPreviewLoading">
          确认创建
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import PreviewSensor from "./components/PreviewSensor";
  import constants from "@/util/constants";
  export default {
    name: 'CreateSensor',
    components: {PreviewSensor},
    data() {
      let checkFarmName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入企业'));
        } else {
          callback();
        }
      };
      let checkSensorVendor = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择厂商'));
        } else {
          callback();
        }
      };
      let checkSensorType = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择设备类型'));
        } else {
          callback();
        }
      };
      let checkSensorNumber = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请填写传感器数量'));
        } else if (!/^\d+$/.test(value)) {
          return callback(new Error('请正确填写传感器数量'));
        } else {
          callback();
        }
      };
      return {
        sensorInfoList: [{
          farmName: '',
          sensorVendor: '',
          sensorNumber: '',
          sensorType: '',
          expandTag: true
        }],
        previewedSensorList: [],
        isLoading: false,
        isPreviewLoading: false,
        farmOptions: [],
        checkFarmName: checkFarmName,
        checkSensorVendor: checkSensorVendor,
        checkSensorNumber: checkSensorNumber,
        infoRulesList: [{
          farmName: [
            {validator: checkFarmName, trigger: 'change'},
            {validator: checkFarmName, trigger: 'blur'}
          ],
          sensorVendor: [
            {validator: checkSensorVendor, trigger: 'change'}
          ],
          sensorType: [
            {validator: checkSensorType, trigger: 'change'}
          ],
          sensorNumber: [
            {validator: checkSensorNumber, trigger: 'blur'},
            {validator: checkSensorNumber, trigger: 'change'}
          ]
        }],
        previewVisible: false,
        farmListAll: []
      };
    },
    mounted() {
      this.init();
    },
    computed: {
      sensorVendorOptions() {
        let {sensorType} = this.$route.query;
        if (sensorType === '水产养殖传感器') {
          return [{ value: '罗博飞', label: '罗博飞' }];
        } else if(sensorType === '耕地种植传感器') {
          return [{ value: '飞利信', label: '飞利信' }];
        } else if(sensorType === '气象传感器' || sensorType === '虫情测报灯') {
          return [{ value: '欧柯奇', label: '欧柯奇' }];
        }
      }
    },
    methods: {
      handlerChangeFarm(value, index) {
        if (!this.sensorInfoList[index].selectedFarm || !this.isFarmName(value)) {
          this.sensorInfoList[index].farmId = '';
          this.sensorInfoList[index].farmName = '';
        }
        this.sensorInfoList[index].selectedFarm = false;
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
        let {sensorType} = this.$route.query;
        this.sensorInfoList = this.sensorInfoList.map((item) => {
          item.sensorType = sensorType;
          return item;
        });
        this.$util.toggleFixedBtnContainer();
        this.$service.getFarmList({pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            this.farmListAll = response.data.list;
          }
        });
      },
      reModifyInfo() {
        if (!this.isPreviewLoading) {
          this.previewVisible = false;
        }
      },
      beforeClose(doneCallback) {
        if (!this.isPreviewLoading) {
          doneCallback();
        }
      },
      querySearchAsync(queryString, cb) {
        this.$service.getFarmList({keyword: queryString, pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            cb(response.data.list);
          }
        });
      },
      handleSelectFarm(item, index) {
        this.sensorInfoList[index].farmId = item.id;
        this.sensorInfoList[index].areaCode = item.areaCode;
        this.sensorInfoList[index].address = item.address;
        this.sensorInfoList[index].selectedFarm = true;
      },
      switchFarmContent(index) {
        this.sensorInfoList[index].expandTag = !this.sensorInfoList[index].expandTag;
      },
      removeFarmItem(index) {
        this.sensorInfoList.splice(index, 1);
        this.infoRulesList.splice(index, 1);
      },
      addSensor() {
        this.validateForm().then((resolve, reject) => {
          if (resolve) {
            // 添加之前验证表单
            let {sensorType} = this.$route.query;
            this.sensorInfoList.push({
              farmName: '',
              sensorVendor: '',
              sensorNumber: '',
              sensorType,
              expandTag: true
            });
            this.infoRulesList.push({
              farmName: [
                {validator: this.checkFarmName, trigger: 'change'},
                {validator: this.checkFarmName, trigger: 'blur'}
              ],
              sensorVendor: [
                {validator: this.checkSensorVendor, trigger: 'change'}
              ],
              sensorNumber: [
                {validator: this.checkSensorNumber, trigger: 'blur'}
              ]
            });
          }
        }).catch((e) => {
          this.$message.warning('请处理当前表单问题之后再进行添加操作');
        });
      },
      validateForm() {
        let validateFuncList = [];
        for (let i = 0; i < this.sensorInfoList.length; i++) {
          validateFuncList.push(this.$refs['sensorInfo-' + i][0].validate());
        }
        return Promise.all(validateFuncList);
      },
      previewSensor() {
        this.validateForm().then((resolve, reject) => {
          if (resolve) {
            // 预览列表
            this.$service.previewSensorList(this.sensorInfoList).then(response => {
              if (response && response.code === 0) {
                this.previewedSensorList = response.data;
                this.previewVisible = true;
              }
            });
          }
        }).catch((e) => {
        });
      },
      // 确认创建
      confirmCreateSensor() {
        this.isPreviewLoading = true;
        this.$service.createSensorList(this.previewedSensorList).then(response => {
          if (response.type === 'application/octet-stream' || response.type === 'application/vnd.ms-excel') {
            this.$message.success('正在导出创建的设备，请稍等');
            let aLink = document.createElement('a');
            let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
            aLink.href = URL.createObjectURL(blob);
            aLink.setAttribute('download', '传感器设备信息_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
            aLink.click();
            this.toSensorList();
          } else {
            this.isPreviewLoading = false;
          }
        }).catch(e => {
          this.isPreviewLoading = false;
        })
      },
      toSensorList() {
        this.$router.push({name: 'SensorList'});
      }
    }
  };
</script>

<style lang="scss" scoped>

  #sensor-container {
    padding: 20px;
  }

  #form-list-block {
    .form-block {
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(62, 73, 94, 1);

      &:last-child {
        border: none;
      }
    }
  }

  .farm-item-block {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .farm-tag {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid rgba(70, 109, 148, 1);
      font-size: 14px;
      font-weight: 400;
      color: rgba(138, 185, 232, 1);
    }

    .operate-block {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .remove-btn-block {
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 400;
      color: rgba(220, 74, 81, 1);
      cursor: pointer;

      &:hover {
        color: rgba(164, 32, 39, 1);

        .svg-icon {
          &:last-child {
            display: block;
          }

          &:first-child {
            display: none;
          }
        }
      }

      .svg-icon {
        margin-left: 1px;
        width: 11px;
        height: 11px;

        &:last-child {
          display: none;
        }
      }
    }

    /*  展开按钮 */
    .farm-expand-btn {
      cursor: pointer;
      &.active {
        label {
          color: rgba(46, 171, 255, 1);
          &:hover {
            color: #88C3FF;
          }
          &:first-child {
            display: block;
          }

          &:last-child {
            display: none;
          }
        }
      }

      label {
        font-size: 12px;
        font-weight: 400;
        color: rgba(46, 171, 255, 1);
        cursor: pointer;
        &:hover {
          color: #88C3FF;
        }

        &:first-child {
          display: none;
        }
      }
    }
  }

  /* 步骤 */
  #steps-block {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;

    span {
      margin: 25px 4px 0px 4px;
      align-self: flex-start;
      width: 250px;
      height: 2px;
      background: rgba(99, 116, 151, 1);
      border-radius: 1px;
    }

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 80px;

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background: rgba(99, 116, 151, 1);
        border-radius: 50%;
      }

      label {
        margin-top: 12px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(163, 208, 253, 1);
      }
    }
  }

  .fill-form {
    padding-bottom: 30px;
  }

</style>
