<!--摄像头信息表单组件-->
<template>
  <div id="camera-container">
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
        v-for="(cameraInfo, index) in  cameraInfoList"
        :key="index"
        :model="cameraInfo"
        :rules="infoRulesList[0]"
        :ref="'cameraInfo-' + index"
        label-width="80px"
        class="form-block fill-form">
        <el-form-item>
          <div class="farm-item-block">
            <div class="farm-tag">农场{{index + 1}}</div>
            <div class="operate-block">
              <div class="remove-btn-block" v-if="cameraInfoList.length !== 1" @click="removeFarmItem(index)">
                删除
                <svg-icon icon-class="remove_image_default"></svg-icon>
                <svg-icon icon-class="remove_image_hover"></svg-icon>
              </div>
              <div class="farm-expand-btn" :class="{'active':cameraInfo.expandTag}" @click="switchFarmContent(index)">
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
        <el-form-item class="el-form-split-block big-margin" label-width="0" v-if="cameraInfo.expandTag">
          <el-form-item label="农场" prop="farmName" required label-width="188px">
            <el-autocomplete
              v-model="cameraInfo.farmName"
              value-key="name"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入农场"
              @select="handleSelectFarm($event, index)"
              @change="handlerChangeFarm($event, index)">
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="厂商" prop="cameraVendor" required label-width="188px">
            <el-select
              v-model="cameraInfo.cameraVendor"
              size="medium"
              placeholder="请选择厂商">
              <el-option
                v-for="item in cameraVendorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0" v-if="cameraInfo.expandTag">
          <el-form-item label="枪机数量" prop="boxNumber" required label-width="188px">
            <el-input
              class="number-input"
              v-model="cameraInfo.boxNumber"
              size="medium"
              placeholder="数量">
            </el-input>
            <i class="unit">套</i>
          </el-form-item>
          <el-form-item label="球机数量" prop="domeNumber" required label-width="165px">
            <el-input
              class="number-input"
              v-model="cameraInfo.domeNumber"
              size="medium"
              placeholder="数量">
            </el-input>
            <i class="unit">套</i>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0" v-if="cameraInfo.expandTag">
          <el-form-item label="全景数量" prop="overallNumber" required label-width="188px">
            <el-input
              class="number-input"
              v-model="cameraInfo.overallNumber"
              size="medium"
              placeholder="数量">
            </el-input>
            <i class="unit">套</i>
          </el-form-item>
          <el-form-item label="接入类型" label-width="165px">
            <div class="plant-num-container">
              <span class="plant-num">{{deviceType}}</span>
            </div>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0" v-if="cameraInfo.expandTag">
          <el-form-item v-if="cameraInfo.deviceType === 'NVR'" label="平台数量" required label-width="188px">
            <div class="plant-num-container">
              <span class="plant-num">{{plantNum(index)}}</span>
              <i class="el-icon-question">
                <div class="prompt-info">输入枪机或球机数量后，随机分配NVR设备。一个NVR仅配套一个摄像头设备</div>
              </i>
            </div>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-item-btn"
         @click="addCamera">
      <svg-icon icon-class="add_item_normal"></svg-icon>
      <svg-icon icon-class="add_item_active"></svg-icon>
      添加条目
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two preview-btn" type="primary" @click="previewCamera" :loading="isLoading">预览并新建
      </el-button>
    </div>
    <el-dialog
      title="预览信息"
      :visible.sync="previewVisible"
      :close-on-click-modal=false
      custom-class="normal-dialog"
      :before-close="beforeClose"
      top="13vh"
      width="80%">
      <preview-camera
        v-if="previewVisible"
        :cameraInfoList="cameraInfoList"
        :previewedCameraList="previewedCameraList">
      </preview-camera>
      <span slot="footer" class="dialog-footer">
                <el-button @click="reModifyInfo" class="modify-btn">修改信息</el-button>
                <el-button type="primary" @click="confirmCreateCamera" class="create-btn" :loading="isPreviewLoading">确认创建</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>

  import PreviewCamera from "./components/PreviewCamera";
  import axios from 'axios'
  import _ from 'lodash';
  import constants from "@/util/constants";
  export default {
    name: 'CreateCamera',
    components: {PreviewCamera},
    data() {
      let checkFarmName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入农场'));
        } else {
          callback();
        }
      };
      let checkCameraVendor = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择厂商'));
        } else {
          callback();
        }
      };
      let checkBoxNumber = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请填写枪机数量'));
        } else if (!/^\d+$/.test(value)) {
          return callback(new Error('请正确填写枪机数量'));
        } else {
          callback();
        }
      };
      let checkDomeNumber = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请填写球机数量'));
        } else if (!/^\d+$/.test(value)) {
          return callback(new Error('请正确填写球机数量'));
        } else {
          callback();
        }
      };
      let checkVrNumber = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请填写全景摄像头数量'));
        } else if (!/^\d+$/.test(value)) {
          return callback(new Error('请正确填写全景摄像头数量'));
        } else {
          callback();
        }
      };
      return {
        cameraInfoList: [{
          farmName: '',
          cameraVendor: '',
          deviceType: '', // 接入类型
          boxNumber: '',
          domeNumber: '',
          overallNumber: '', // 全景
          expandTag: true
        }],
        previewedCameraList: [],
        isLoading: false,
        isPreviewLoading: false,
        farmOptions: [],
        cameraTypeOptions: constants.CAMERA_TYPE_OPTIONS,
        cameraVendorOptions: [{
          value: 'HAIKANG',
          label: '海康'
        }, {
          value: 'DAHUA',
          label: '大华'
        }, {
          value: 'HUAWEI',
          label: '华为'
        }, {
          value: 'TIANDIWEIYE',
          label: '天地伟业'
        }],
        checkFarmName: checkFarmName,
        checkCameraVendor: checkCameraVendor,
        checkBoxNumber: checkBoxNumber,
        checkDomeNumber: checkDomeNumber,
        infoRulesList: [{
          farmName: [
            {validator: checkFarmName, trigger: 'change'},
            {validator: checkFarmName, trigger: 'blur'}
          ],
          cameraVendor: [
            {validator: checkCameraVendor, trigger: 'change'}
          ],
          boxNumber: [
            {validator: checkBoxNumber, trigger: 'blur'},
            {validator: checkBoxNumber, trigger: 'change'},
          ],
          domeNumber: [
            {validator: checkDomeNumber, trigger: 'blur'},
            {validator: checkDomeNumber, trigger: 'change'},
          ],
          overallNumber: [
            {validator: checkVrNumber, trigger: 'blur'},
            {validator: checkVrNumber, trigger: 'change'},
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
      plantNum() {
        return (index) => {
          let boxNumber = _.get(this.cameraInfoList, `${index}.boxNumber`);
          let domeNumber = _.get(this.cameraInfoList, `${index}.domeNumber`);
          let overallNumber = _.get(this.cameraInfoList, `${index}.overallNumber`);
          if (_.isNumber(parseInt(boxNumber)) && _.isNumber(parseInt(domeNumber)) && _.isNumber(parseInt(overallNumber))) {
            let num = parseInt(boxNumber) + parseInt(domeNumber) + parseInt(overallNumber);
            return _.isNaN(num) ? 0 : num;
          } else {
            return 0;
          }
        };
      },
      deviceType() {
        let {type} = this.$route.query;
        switch (type) {
          case 'NVR':
              return '平台NVR';
          case 'CAMERA':
              return '摄像头';
          default:
              return '';
        }
      }
    },
    methods: {
      handlerChangeFarm(value, index) {
        if (!this.cameraInfoList[index].selectedFarm || !this.isFarmName(value)) {
          this.cameraInfoList[index].farmId = '';
          this.cameraInfoList[index].farmName = '';
        }
        this.cameraInfoList[index].selectedFarm = false;
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
        let {type} = this.$route.query;
        this.cameraInfoList = this.cameraInfoList.map((item) => {
          item.deviceType = type;
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
        this.cameraInfoList[index].farmId = item.id;
        this.cameraInfoList[index].areaCode = item.areaCode;
        this.cameraInfoList[index].address = item.address;
      },
      switchFarmContent(index) {
        this.cameraInfoList[index].expandTag = !this.cameraInfoList[index].expandTag;
      },
      removeFarmItem(index) {
        this.cameraInfoList.splice(index, 1);
        this.infoRulesList.splice(index, 1);
      },
      addCamera() {
        this.validateForm().then((resolve, reject) => {
          if (resolve) {
            // 添加之前验证表单
            this.cameraInfoList.push({
              farmName: '',
              cameraVendor: '',
              boxNumber: '',
              domeNumber: '',
              expandTag: true
            });
            this.infoRulesList.push({
              farmName: [
                {validator: this.checkFarmName, trigger: 'change'},
                {validator: this.checkFarmName, trigger: 'blur'}
              ],
              cameraVendor: [
                {validator: this.checkCameraVendor, trigger: 'change'}
              ],
              boxNumber: [
                {validator: this.checkBoxNumber, trigger: 'blur'}
              ],
              domeNumber: [
                {validator: this.checkDomeNumber, trigger: 'blur'}
              ],
              overallNumber: [
                {validator: this.checkVrNumber, trigger: 'blur'}
              ]
            });
          }
        }).catch((e) => {
          this.$message.warning('请处理当前表单问题之后再进行添加操作');
        });
      },
      validateForm() {
        let validateFuncList = [];
        for (let i = 0; i < this.cameraInfoList.length; i++) {
          validateFuncList.push(this.$refs['cameraInfo-' + i][0].validate());
        }
        return Promise.all(validateFuncList);
      },
      previewCamera() {
        this.validateForm().then((resolve, reject) => {
          if (resolve) {
            // 预览列表
            let {type} = this.$route.query;
            this.$service.previewCameraList(this.cameraInfoList, type).then(response => {
              if (response && response.code === 0) {
                this.previewedCameraList = response.data;
                this.previewVisible = true;
              } else {
                this.$message.warning(response.message);
              }
            });
          }
        }).catch((e) => {
        });
      },
      // 确认创建
      confirmCreateCamera() {
        this.isPreviewLoading = true;
        this.$service.createCameraList(this.previewedCameraList).then(response => {
            if (response.type === 'application/octet-stream') {
              this.$message.success('正在导出创建的设备，请稍等');
              let aLink = document.createElement('a');
              let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
              aLink.href = URL.createObjectURL(blob);
              aLink.setAttribute('download', '摄像头设备信息_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
              aLink.click();
              this.toCameraList();
            } else {
              this.isPreviewLoading = false;
            }
          }
        ).catch(e => {
          this.isPreviewLoading = false;
        });
      },
      download(blobUrl) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = '<文件名>';
        a.href = blobUrl;
        a.click();
        document.body.removeChild(a);
      },
      toCameraList() {
        if (!this.$authority.isHasAuthority('admin:camera:page')) {
          return;
        }
        this.$router.push({name: 'CameraList'});
      }
    }
  };
</script>

<style lang="scss" scoped>

  #camera-container {
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

  .add-item-btn {
    margin-top: 40px;
    margin-left: 100px;
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
          color: #2EABFF;
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
        color: #2EABFF;
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
