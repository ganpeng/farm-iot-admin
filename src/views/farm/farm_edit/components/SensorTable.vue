<!-- 物联网数据---传感器表格组件 -->
<template>
  <div id="sensor-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="sensorList">
      <el-table-column
        width="20px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="deviceName"
        align="left"
        width="200px"
        label="devicename">
        <template slot-scope="scope">
          <div class="cell-id" @click="toDetailPage(scope.row)">{{scope.row.deviceName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sensorVendor"
        align="left"
        label="厂商名称">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.sensorVendor}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="farmName"
        align="left"
        label="地块">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.landName || '/'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="负责人">
        <template slot-scope="scope">
          <el-popover class="my-popover" placement="left-start" width="180" trigger="hover"
                      v-if="scope.row.manager">
            <div class="pop-content table-manage-block">
              <div>姓名：{{scope.row.manager}}</div>
              <div>电话：{{scope.row.managerPhone}}
                <label class="svg-block copy-btn"
                       :data-clipboard-text="scope.row.managerPhone"
                       @click="copyPhoneNo(scope.row.managerPhone)">
                  <svg-icon icon-class="copy"></svg-icon>
                </label>
              </div>
            </div>
            <span class="cell-manager" slot="reference">{{scope.row.manager || '/'}}</span>
          </el-popover>
          <span v-else class="cell-manager" slot="reference">{{scope.row.manager || '/'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="接入时间">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.createdAt | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        align="left"
        label="最后上报">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.updatedAt | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        prop="deviceStatus"
        width="95px"
        label="在线状态">
        <template slot-scope="scope">
          <div class="online-status" v-if="scope.row.deviceStatus === 'ONLINE'">
            {{scope.row.deviceStatus | getDeviceStatusName}}
          </div>
          <div class="offline-status" v-if="scope.row.deviceStatus === 'OFFLINE'">
            {{scope.row.deviceStatus | getDeviceStatusName}}
          </div>
          <div class="unstaged-status" v-if="scope.row.deviceStatus === 'UNACTIVE'">
            {{scope.row.deviceStatus | getDeviceStatusName}}
          </div>
          <!--删除状态 -->
          <div class="delete-status" v-if="scope.row.deviceStatus === 'DELETED'">
            {{scope.row.deviceStatus | getDeviceStatusName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="left" label="操作">
        <template slot-scope="scope">
          <!-- 物联网数据下载 -->
          <div class="operator-btn-wrapper">
            <span class="btn-text" @click="downloadSensor(scope.row)">数据下载</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据下载弹窗 -->
    <el-dialog
      title="数据下载"
      :visible.sync="downloadVisible"
      :close-on-click-modal=false
      :before-close="beforeClose"
      custom-class="normal-dialog download-dialog"
      top="13vh"
      width="70%">
      <el-form
        :model="sensorInfo"
        :rules="infoRules"
        status-icon
        ref="sensorInfoBasic"
        label-width="160px"
        class="form-block fill-form">
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label=时间范围 prop="createRangeTime" label-width="160px" required>
            <el-date-picker
              v-model="sensorInfo.createRangeTime"
              @change="selectCreateRangeTime"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label="选择指标" prop="dataDimensionList" label-width="160px" required>
            <multiple-separate-select
              v-if="downloadVisible"
              ref="metricSelect"
              :options="options"
              v-on:validateFormItem="validateFormItem"
              :metricAllList="metricAllList">
            </multiple-separate-select>
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="modify-btn" @click="cancelDataExport">取消</el-button>
        <el-button type="primary"
                   class="create-btn"
                   @click="exportSensorData"
                   :loading="isPreviewLoading">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import MultipleSeparateSelect from './MultipleSeparateSelect';
  export default {
    name: 'SensorTable',
    components: {
      MultipleSeparateSelect
    },
    props: {
      sensorList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      let checkCreateRangeTime = (rule, value, callback) => {
        if (this.sensorInfo.createRangeTime.length === 0) {
          return callback(new Error('请选择时间范围'));
        } else {
          callback();
        }
      };
      let checkDataDimensionList = (rule, value, callback) => {
        this.sensorInfo.dataDimensionList = this.$refs['metricSelect'].getSelectedMetric();
        if (this.$refs['metricSelect'].getSelectedMetric().length === 0) {
          return callback(new Error('请选择指标'));
        } else {
          callback();
        }
      };
      return {
        currentSensor: {},
        createRangeTime: [],
        infoRules: {
          createRangeTime: [
            {validator: checkCreateRangeTime, trigger: 'blur'},
            {validator: checkCreateRangeTime, trigger: 'change'}
          ],
          dataDimensionList: [
            {validator: checkDataDimensionList, trigger: 'blur'},
            {validator: checkDataDimensionList, trigger: 'change'}
          ]
        },
        sensorInfo: {
          dataDimensionList: '',
          deviceName: '',
          landName: '',
          startDate: '',
          endDate: '',
          createRangeTime: []
        },
        isPreviewLoading: false,
        downloadVisible: false,
        options: [],
        metricAllList: []
      };
    },
    filters: {
      getDeviceStatusName(tag) {
        return {'ONLINE': '在线', 'OFFLINE': '离线', 'UNACTIVE': '未激活', 'LOCKED': '锁定', 'DELETED': '已删除'}[tag]
      }
    },
    mounted() {
      this.getMetricList();
    },
    computed: {
      ...mapGetters({
        dict: "dict/dict",
      })
    },
    methods: {
      exportSensorData() {
        this.sensorInfo.dataDimensionList = this.$refs['metricSelect'].getSelectedMetric();
        this.$refs['sensorInfoBasic'].validate((valid) => {
          if (valid) {
            this.isPreviewLoading = true;
            this.$service.exportSensorDataExcel(this.sensorInfo).then(response => {
              if (response.type === 'application/octet-stream' || response.type === 'application/vnd.ms-excel') {
                this.$message.success('正在导出数据，请稍等');
                let aLink = document.createElement('a');
                let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
                aLink.href = URL.createObjectURL(blob);
                aLink.setAttribute('download', this.$route.query.name + (this.sensorInfo.landName || '') + '起止' + this.$util.formatDate(new Date(this.sensorInfo.startDate), 'yyyy-MM-DD') + '-' + this.$util.formatDate(new Date(this.sensorInfo.endDate), 'yyyy-MM-DD') + '传感器数据下载' + this.$util.formatDate(new Date(), 'yyyy-MM-DD') + '.xlsx');
                aLink.click();
                this.isPreviewLoading = false;
                this.cancelDataExport();
              } else {
                this.isPreviewLoading = false;
                this.$message.warning('数据下载失败，请稍后再试');
              }
            }).catch(e => {
              this.isPreviewLoading = false;
            })
          } else {
            return false;
          }
        });
      },
      validateFormItem() {
        this.$refs['sensorInfoBasic'].validateField('dataDimensionList');
      },
      cancelDataExport() {
        this.sensorInfo.startDate = '';
        this.sensorInfo.endDate = '';
        this.sensorInfo.dataDimensionList = '';
        this.sensorInfo.deviceName = '';
        this.sensorInfo.createRangeTime = [];
        if (this.$refs['sensorInfoBasic']) {
          this.$refs['sensorInfoBasic'].resetFields();
        }
        this.downloadVisible = false;
      },
      selectCreateRangeTime() {
        if (this.sensorInfo.createRangeTime && this.sensorInfo.createRangeTime.length === 2) {
          this.sensorInfo.startDate = this.sensorInfo.createRangeTime[0];
          this.sensorInfo.endDate = this.sensorInfo.createRangeTime[1];
        } else {
          this.sensorInfo.startDate = '';
          this.sensorInfo.endDate = '';
        }
      },
      getMetricList() {
        this.$service.getMetricList().then(response => {
          if (response && response.code === 0) {
            this.metricAllList = response.data;
            // 处理数据
            let obj = {};
            for (let i = 0; i < response.data.length; i++) {
              if (obj[response.data[i].description]) {
                obj[response.data[i].description].push(response.data[i]);
              } else {
                obj[response.data[i].description] = [response.data[i]];
              }
            }
            let options = [];
            for (let key in obj) {
              options.push({label: key.toString(), options: obj[key]});
            }
            this.options = options;
          }
        })
      },
      beforeClose(doneCallback) {
        if (!this.isPreviewLoading) {
          doneCallback();
        }
      },
      toDetailPage(item) {
        this.$router.push({
          name: 'SensorDetail',
          params: {id: item.id, status: 'data'}
        });
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'odd-row';
        } else if (rowIndex % 2 === 0) {
          return 'even-row';
        }
        return '';
      },
      copyPhoneNo(phoneNo) {
        try {
          this.$util.clipboardCopy(phoneNo);
          this.$message.success('复制成功');
        } catch (err) {
          this.$message.error('复制失败');
        }
      },
      // 数据下载
      downloadSensor(item) {
        this.currentSensor = item;
        this.sensorInfo.deviceName = item.deviceName;
        this.downloadVisible = true;
        if (this.$refs['sensorInfoBasic']) {
          this.$refs['sensorInfoBasic'].resetFields();
        }
        this.sensorTypeChange(item.sensorType);
      },
      // 修改设备类型
      sensorTypeChange(sensorTypeName) {
        let sensorType = sensorTypeName === '水产养殖传感器' ? 'FISHERY' : 'PLANT';
        const typeList = this.dict.sensorType;
        let typeObj = typeList.find(item => item.name === sensorType)
        this.modelMetricList = [{
          metric: '',
          max: '',
          min: ''
        }];
        this.$service.getSensorTypeChildren(typeObj.id).then(res => {
          if (res && res.code === 0) {
              this.formatSensorChildren(res.data);
            } else {
              this.$message.warning(response.message);
            }
        });
      },
      // 处理设备类型的子类型
      formatSensorChildren(data) {
        // 处理数据
        let obj = {};
        for (let i = 0; i < data.length; i++) {
          if (obj[data[i].description]) {
            obj[data[i].description].push(data[i]);
          } else {
            obj[data[i].description] = [data[i]];
          }
        }
        let options = [];
        for (let key in obj) {
          options.push({label: key.toString(), options: obj[key]});
        }
        this.options = options;
      }
    }
  };
</script>

<style lang="scss" scoped>

  .operator-btn-wrapper {
    justify-content: flex-start;
  }

  .cell-id {
    font-size: 12px;
    font-weight: 400;
    color: rgba(46, 171, 255, 1);
    cursor: pointer;
    &:hover {
      color: rgba(136, 195, 255, 1);
    }
  }

  .table-item {
    &:hover {
      color: #f0f0f0;
    }
  }

  .cell-manager {
    font-size: 12px;
    font-weight: 400;
    color: rgba(138, 185, 232, 1);
    cursor: pointer;
  }

  .time-block {
    width: 75px;
    text-align: center;
  }

  /* 设备状态 */
  .online-status {
    color: rgba(126, 211, 33, 1);
  }

  .offline-status {
    color: rgba(255, 110, 110, 1);
  }

  .unstaged-status {
    color: rgba(155, 155, 155, 1);
  }

  .delete-status {
    color: rgba(155, 155, 155, 1);
  }

  .table-manage-block {
    div {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: rgba(168, 171, 179, 1);
      &:first-child {
        margin-top: 4px;
        margin-bottom: 6px;
      }
      .svg-block {
        display: flex;
        align-items: center;
        margin-left: 8px;
        height: 10px;
        width: 10px;
        cursor: pointer;
        .svg-icon {
          height: 10px !important;
          width: 10px !important;
        }
      }
    }
  }

</style>

<style lang="scss">

  #sensor-table-container {
    .el-date-editor .el-icon-date, .el-range-editor .el-icon-date {
      display: block;
    }
    .el-date-editor .el-range-input {
      margin-left: 10px;
    }
  }
</style>
