<template>
  <div id="sensor-detail-container">
    <div id="block-container">
      <!-- 基本信息 -->
      <div id="basic-info-block">
        <div class="header">
          <div class="title">
            <svg-icon icon-class="device_info"></svg-icon>
            设备信息
          </div>
          <div class="status-block">
            <label v-if="controllerInfo.deviceStatus === 'ONLINE'"><i class="online">•</i>在线</label>
            <label v-if="controllerInfo.deviceStatus === 'OFFLINE'"><i class="offline">•</i>离线</label>
            <label v-if="controllerInfo.deviceStatus === 'UNACTIVE'"><i class="UNACTIVE">•</i>未激活</label>
            <label><i :class="{'active':controllerInfo.receive}">•</i>{{controllerInfo.receive ? '接收' : '拒收'}}</label>
          </div>
        </div>
        <div class="content">
          <div class="block">
            <div>
              <span>devicename</span>
              <label>{{controllerInfo.deviceName}}</label>
            </div>
            <div>
              <span>设备名称</span>
              <label>{{controllerInfo.name}}</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>设备类型</span>
              <label>{{controllerInfo.controllerType}}</label>
            </div>
            <div>
              <span>经纬度</span>
              <label v-if="controllerInfo.latitude || controllerInfo.longitude">
                E{{controllerInfo.longitude}}
                N{{controllerInfo.latitude}}
              </label>
              <i @click="selectMapPositionVisible = true" v-if="controllerInfo.latitude || controllerInfo.longitude">查看</i>
              <label v-else>未设置</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>厂商</span>
              <label>{{controllerInfo.controllerVendor}}</label>
            </div>
            <div>
              <span>所属企业</span>
              <label>{{controllerInfo.farmName}}</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>预警模型</span>
              <label>{{controllerInfo.modelName || '未设置'}}</label>
            </div>
            <div>
              <span>所属地块</span>
              <label>{{controllerInfo.landName || '未设置'}}</label>
            </div>
          </div>
        </div>
      </div>
      <!-- 运维信息 -->
      <div id="manager-info-block">
        <div class="header">
          <svg-icon icon-class="manager_info"></svg-icon>
          <label>运维负责人</label>
        </div>
        <div class="content">
          <div>
            <span>所属公司</span>
            <label>{{controllerInfo.managerCompany || '未设置'}}</label>
          </div>
          <div>
            <span>员工姓名</span>
            <label>{{controllerInfo.manager || '未设置'}}</label>
          </div>
          <div>
            <span>员工电话</span>
            <label>{{controllerInfo.managerPhone || '未设置'}}</label>
          </div>
        </div>
      </div>
    </div>
    <!--  数据信息 -->
    <div id="data-info-block">
      <div class="header">
        <div class="title">
          <svg-icon icon-class="data_info"></svg-icon>
          <label>设备控制</label>
          <span v-if="controllerLastData.length > 0" class="current-mode">当前模式: {{currentModeLabel}}</span>
          <span v-if="controllerLastData.length > 0" class="pressure">水压: {{controllerDataByProp(`Pressure`)}}KP</span>
        </div>
      </div>
      <div v-if="controllerLastData.length > 0" class="select-tab-block">
        <ul class="controller-tab-list">
          <li @click="modeChangeHandler(0)" :class="['controller-tab-item', controllerTabActiveIndex === 0 && 'active']">手动模式</li>
          <li @click="modeChangeHandler(1)" :class="['controller-tab-item', controllerTabActiveIndex === 1 && 'active']">自动模式</li>
          <li @click="modeChangeHandler(2)" :class="['controller-tab-item', controllerTabActiveIndex === 2 && 'active']">定时模式</li>
        </ul>
        <div class="controller-tab-content">
          <p class="controller-tip">{{controllerTip}}</p>
          <el-form
            status-icon
            ref="controllerForm"
            label-width="140px"
            @submit.native.prevent
            class="my-form">
              <div v-if="controllerTabActiveIndex === 0" class="controller-tab-content-item">
                <el-col :span="12">
                  <ul class="dcfkg-list">
                    <li v-for="index in 10" :key="index" class="dcfkg-item">
                      <span class="title"><i :class="[ controllerDataByProp(`Dcfkg${padZero(index)}`) === '1' ? 'online' : 'offline']">•</i>电磁阀{{padZero(index)}} &nbsp;</span>
                      <el-switch
                        :value="controllerDataByProp(`Dcfkg${padZero(index)}`)"
                        @change="dcfkgChangeHandler(controllerDataByProp(`Dcfkg${padZero(index)}`), `Dcfkg${padZero(index)}`)"
                        active-value="1"
                        inactive-value="0">
                      </el-switch>
                    </li>
                  </ul>
                  <div class="ben-wrapper">
                    <div class="ben">
                      <span class="title"><i :class="[ controllerDataByProp(`SubmersiblePump`) === '1' ? 'online' : 'offline']">•</i>潜水泵 &nbsp;</span>
                      <el-switch
                        :value="controllerDataByProp(`SubmersiblePump`)"
                        @change="dcfkgChangeHandler(controllerDataByProp(`SubmersiblePump`), `SubmersiblePump`)"
                        active-value="1"
                        inactive-value="0">
                      </el-switch>
                    </div>
                    <div class="ben">
                      <span class="title"><i :class="[ controllerDataByProp(`SubmersiblePump2`) === '1' ? 'online' : 'offline']">•</i>潜水泵2 &nbsp;</span>
                      <el-switch
                        :value="controllerDataByProp(`SubmersiblePump2`)"
                        @change="dcfkgChangeHandler(controllerDataByProp(`SubmersiblePump2`), `SubmersiblePump2`)"
                        active-value="1"
                        inactive-value="0">
                      </el-switch>
                    </div>
                  </div>
                  <div class="ben">
                    <span class="title"><i :class="[ controllerDataByProp(`PipelinePump`) === '1' ? 'online' : 'offline']">•</i>管道泵 &nbsp;</span>
                    <el-switch
                      :value="controllerDataByProp(`PipelinePump`)"
                      @change="dcfkgChangeHandler(controllerDataByProp(`PipelinePump`), `PipelinePump`)"
                      active-value="1"
                      inactive-value="0">
                    </el-switch>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="img-wrapper">
                    <div class="img"></div>
                  </div>
                </el-col>
              </div>
              <div v-if="controllerTabActiveIndex === 1" class="controller-tab-content-item">
                <el-col :span="12">
                  <el-form-item
                    label="轮灌间隔" required>
                    <el-input
                      :value="controllerDataByProp('RotIrrItva')"
                      @input="inputHandler($event, 'RotIrrItva')"
                    ></el-input>
                    <span>&nbsp;(秒)</span>
                    <span class="tip">2次轮灌的时间间隔为轮灌间隔</span>
                    <div class="error-message">{{errorMessage['RotIrrItva']}}</div>
                  </el-form-item>
                  <el-form-item label="轮灌次数" required>
                    <el-input
                      :value="controllerDataByProp('RotIrrCount')"
                      @input="inputHandler($event, 'RotIrrCount')"
                    ></el-input>
                    <span class="tip">10个电磁阀门轮流开启1圈为轮灌1次</span>
                    <div class="error-message">{{errorMessage['RotIrrCount']}}</div>
                  </el-form-item>
                  <el-form-item label="单个阀门运行时间" required>
                    <el-input
                      :value="controllerDataByProp('SingleValveRunTime')"
                      @input="inputHandler($event, 'SingleValveRunTime')"
                    ></el-input>
                    <span>&nbsp;(秒)</span>
                    <span class="tip">1个电磁阀门运行时长</span>
                    <div class="error-message">{{errorMessage['SingleValveRunTime']}}</div>
                  </el-form-item>
                </el-col>
              </div>
              <div v-if="controllerTabActiveIndex === 2" class="controller-tab-content-item">
                <el-col :span="12">
                  <el-form-item label="轮灌间隔" required>
                    <el-input
                      :value="controllerDataByProp('RotIrrItva')"
                      @input="inputHandler($event, 'RotIrrItva')"
                    ></el-input>
                    <span>&nbsp;(秒)</span>
                    <span class="tip">2次轮灌的时间间隔为轮灌间隔</span>
                    <div class="error-message">{{errorMessage['RotIrrItva']}}</div>
                  </el-form-item>
                  <el-form-item label="轮灌次数" required>
                    <el-input
                      :value="controllerDataByProp('RotIrrCount')"
                      @input="inputHandler($event, 'RotIrrCount')"
                    ></el-input>
                    <span class="tip">10个电磁阀门轮流开启1圈为轮灌1次</span>
                    <div class="error-message">{{errorMessage['RotIrrCount']}}</div>
                  </el-form-item>
                  <el-form-item label="单个阀门运行时间" required>
                    <el-input
                      :value="controllerDataByProp('SingleValveRunTime')"
                      @input="inputHandler($event, 'SingleValveRunTime')"
                    ></el-input>
                    <span>&nbsp;(秒)</span>
                    <span class="tip">1个电磁阀门运行时长</span>
                    <div class="error-message">{{errorMessage['SingleValveRunTime']}}</div>
                  </el-form-item>
                  <el-form-item label="定时运行间隔" required>
                    <el-input
                      :value="controllerDataByProp('IntervalDays')"
                      @input="inputHandler($event, 'IntervalDays')"
                    ></el-input>
                    <span>&nbsp;(天)</span>
                    <span class="tip">每次间隔指定天数后的定时时间点根据设定的轮灌间隔，轮灌次数，单个阀门运行时间执行</span>
                    <div class="error-message">{{errorMessage['IntervalDays']}}</div>
                  </el-form-item>
                  <el-form-item label="定时开始时间" required>
                    <el-time-picker
                      :value="timing"
                      format='HH:mm'
                      value-format="HH:mm"
                      prefix-icon=""
                      @input="timeChangeHandler($event)"
                    >
                    </el-time-picker>
                    <span class="tip">在此时间开始运行</span>
                    <div class="error-message">{{errorMessage['timing']}}</div>
                  </el-form-item>
                  <el-form-item label="定时结束日期" required>
                    <el-date-picker
                      :value="end"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      @input="endChangeHandler($event)"
                    ></el-date-picker>
                    <span class="tip">在结束日期0点结束运行</span>
                    <div class="error-message">{{errorMessage['end']}}</div>
                  </el-form-item>
                </el-col>
              </div>
          </el-form>
        </div>
        <el-button class="btn-style-two edit-bottom-btn" type="primary" @click="commitController">
          执行
        </el-button>
      </div>
      <div id="empty-block" v-else>
        <svg-icon icon-class="empty_notice"></svg-icon>
        <label >暂无数据</label>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two edit-bottom-btn" type="primary" @click="editController"
                 v-if="$route.params.status === 'normal'">编辑
      </el-button>
      <el-button class="btn-style-three" @click="toControllerList" plain>返回列表</el-button>
    </div>
    <el-dialog
      title="查看传感器坐标"
      :visible.sync="selectMapPositionVisible"
      :close-on-click-modal=false
      custom-class="normal-dialog"
      top="13vh"
      width="80%">
      <select-map-position
        ref="map"
        :move="false"
        :mapCenter="[controllerInfo.longitude, controllerInfo.latitude]"
        v-if="selectMapPositionVisible">
      </select-map-position>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectMapPositionVisible = false" class="modify-btn">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import SelectMapPosition from "../SelectMapPosition";
  import _ from 'lodash';
  let keyList = [
    {
      prop: 'RotIrrItva',
      label: '轮灌间隔'
    },
    {
      prop: 'RotIrrCount',
      label: '轮灌次数'
    },
    {
      prop: 'SingleValveRunTime',
      label: '单个阀门运行时间（秒）'
    },
    {
      prop: 'IntervalDays',
      label: '定时运行间隔天数'
    },
    {
      prop: 'TimingHour',
      label: '定时运行-时'
    },
    {
      prop: 'TimingMinute',
      label: '定时运行-分'
    },
    {
      prop: 'EndYear',
      label: '结束-年'
    },
    {
      prop: 'EndMonth',
      label: '结束-月'
    },
    {
      prop: 'EndDay',
      label: '结束-日'
    },
    {
      prop: 'Dcfkg01',
      label: '电磁阀01'
    },
    {
      prop: 'Dcfkg02',
      label: '电磁阀02'
    },
    {
      prop: 'Dcfkg03',
      label: '电磁阀03'
    },
    {
      prop: 'Dcfkg04',
      label: '电磁阀04'
    },
    {
      prop: 'Dcfkg05',
      label: '电磁阀05'
    },
    {
      prop: 'Dcfkg06',
      label: '电磁阀06'
    },
    {
      prop: 'Dcfkg07',
      label: '电磁阀07'
    },
    {
      prop: 'Dcfkg08',
      label: '电磁阀08'
    },
    {
      prop: 'Dcfkg09',
      label: '电磁阀09'
    },
    {
      prop: 'Dcfkg10',
      label: '电磁阀10'
    },
    {
      prop: 'SubmersiblePump',
      label: '潜水泵'
    },
    {
      prop: 'PipelinePump',
      label: '管道泵'
    },
    {
      prop: 'Manual',
      label: '手动轮灌'
    },
    {
      prop: 'Automatic',
      label: '自动轮灌'
    }
  ]
  export default {
    name: "ControlDetail",
    components: {
      SelectMapPosition
    },
    data() {
      return {
        timing: '',
        end: '',
        controllerInfo: {},
        controllerLastData: [],
        controllerLastDataMap: {},
        currentMode: '',
        selectMapPositionVisible: false,
        errorMessage: {}
      }
    },
    mounted() {
      this.init();
    },
    computed: {
      controllerDataByProp() {
        return (prop) => {
          let obj = this.controllerLastData.find((item) => item.metric === prop);
          return _.get(obj, 'value');
        };
      },
      controllerTabActiveIndex() {
          let activeIndex = ''
          let automatic = this.controllerLastData.find((item) => item.metric === 'Automatic');
          let manual = this.controllerLastData.find((item) => item.metric === 'Manual');
          let automaticValue = _.get(automatic, 'value');
          let manualValue = _.get(manual, 'value');
          if (parseInt(automaticValue) === 0 && parseInt(manualValue) === 1) {
            activeIndex = 1;
          } else if (parseInt(automaticValue) === 1 && parseInt(manualValue) === 0) {
            activeIndex = 2;
          } else {
            activeIndex = 0;
          }
          return activeIndex;
      },
      controllerTip() {
        let tip = '';
        switch (this.controllerTabActiveIndex) {
          case 0:
            tip = '手动模式下，需要手动开启或关闭每个电磁阀，潜水泵和管道泵';
            break;
          case 1:
            tip = '自动模式下，可自动控制全部电磁阀，潜水泵和管道泵进行轮灌';
            break;
          case 2:
            tip = '定时模式下，可定时自动控制全部电磁阀，潜水泵和管道泵进行轮灌';
            break;
          default:
            tip = '';
        }
        return tip;
      },
      changedModeLabel() {
        let label = '';
        switch (this.controllerTabActiveIndex) {
          case 0:
            label = '手动模式';
            break;
          case 1:
            label = '自动模式';
            break;
          case 2:
            label = '定时模式';
            break;
          default:
            label = '';
        }
        return label;
      },
      currentModeLabel() {
        let label = '';
        switch (this.currentMode) {
          case 0:
            label = '手动模式';
            break;
          case 1:
            label = '自动模式';
            break;
          case 2:
            label = '定时模式';
            break;
          default:
            label = '';
        }
        return label;
      }
    },
    methods: {
      // 选择维度的'全部'
      init() {
        this.$util.toggleFixedBtnContainer();
        this.$service.getControllerDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            this.controllerInfo = response.data; // 控制设备详情 上部分内容
            let {deviceName} = this.controllerInfo;
            if (deviceName) {
              this.getControllerLastData(deviceName);
            }
          }
        });
      },
      getControllerLastData(deviceName) {
        this.$service.getControllerLastData(deviceName)
          .then((res) => {
            if (res && res.code === 0) {
              this.controllerLastData = res.data || [];
              this.currentMode = this.controllerTabActiveIndex;
              this.controllerLastData.forEach((item, index) => {
                let key = item.metric;
                _.set(this.controllerLastDataMap, key, index);
              });
              this.formatData();
            }
          }).catch((err) => {
            console.log(err);
          });
      },
      formatData() {
        let timeHour = _.get(this.controllerLastData.find((item) => item.metric === 'TimingHour'), 'value');
        let timeMinute = _.get(this.controllerLastData.find((item) => item.metric === 'TimingMinute'), 'value');
        let endYear = _.get(this.controllerLastData.find((item) => item.metric === 'EndYear'), 'value');
        let endMonth = _.get(this.controllerLastData.find((item) => item.metric === 'EndMonth'), 'value');
        let endDay = _.get(this.controllerLastData.find((item) => item.metric === 'EndDay'), 'value');
        this.timing = timeHour && timeMinute ?  `${timeHour}:${timeMinute}` : '';
        this.end = endYear && endMonth && endDay ?  `${endYear}-${endMonth}-${endDay}` : '';
      },
      dcfkgChangeHandler(value, key) {
        _.set(this.errorMessage, key, '');
        this.controllerLastData = this.controllerLastData.map((item) => {
          if (item.metric === key) {
            if (value === '0') {
              item.value = '1';
            } else {
              item.value = '0';
            }
          }
          return item;
        });
      },
      inputHandler(value, key) {
        _.set(this.errorMessage, key, '');
        this.controllerLastData = this.controllerLastData.map((item) => {
          if (item.metric === key) {
            item.value = value;
          }
          return item;
        });
      },
      timeChangeHandler(value) {
        _.set(this.errorMessage, 'timing', '');
        this.timing = value;
        let time = _.split(value, ':');
        this.controllerLastData = this.controllerLastData.map((item) => {
          if (item.metric === 'TimingHour') {
            item.value = _.get(time, '0');
          }
          if (item.metric === 'TimingMinute') {
            item.value = _.get(time, '1');
          }
          return item;
        });
      },
      endChangeHandler(value) {
        _.set(this.errorMessage, 'end', '');
        this.end = value;
        let date = _.split(value, '-');
        this.controllerLastData = this.controllerLastData.map((item) => {
          if (item.metric === 'EndYear') {
            item.value = _.get(date, '0');
          }
          if (item.metric === 'EndMonth') {
            item.value = _.get(date, '1');
          }
          if (item.metric === 'EndDay') {
            item.value = _.get(date, '2');
          }
          return item;
        });
      },
      modeChangeHandler(activeIndex) {
        if (activeIndex === 0) {
          this.controllerLastData = this.controllerLastData.map((item) => {
            if (item.metric === 'Automatic') {
              item.value = '0';
            }
            if (item.metric === 'Manual') {
              item.value = '0';
            }
            return item;
          });
        } else if (activeIndex === 1) {
          this.controllerLastData = this.controllerLastData.map((item) => {
            if (item.metric === 'Automatic') {
              item.value = '0';
            }
            if (item.metric === 'Manual') {
              item.value = '1';
            }
            return item;
          });
        } else {
          this.controllerLastData = this.controllerLastData.map((item) => {
            if (item.metric === 'Automatic') {
              item.value = '1';
            }
            if (item.metric === 'Manual') {
              item.value = '0';
            }
            return item;
          });
        }
      },
      padZero(index) {
        if (index > 0 && index < 10) {
          return `0${index}`;
        } else {
          return index;
        }
      },
      validator() {
        let errorMessage = {};
        if (this.controllerTabActiveIndex === 1) {
          let errorPropList = ['RotIrrItva', 'RotIrrCount', 'SingleValveRunTime'];
          errorPropList.map((item) => {
            let value = _.get(this.controllerLastData, `${_.get(this.controllerLastDataMap, item)}.value`);
            if (value === '' || value === undefined || value === null) {
              _.set(errorMessage, item, '该项不能为空');
            } else if (!(/^[+]{0,1}(\d+)$/.test(value))) {
              _.set(errorMessage, item, '请输入正整数');
            }
          });
        }

        if (this.controllerTabActiveIndex === 2) {
          let errorPropList = ['RotIrrItva', 'RotIrrCount', 'SingleValveRunTime', 'IntervalDays'];
          errorPropList.map((item) => {
            let value = _.get(this.controllerLastData, `${_.get(this.controllerLastDataMap, item)}.value`);
            if (value === '' || value === undefined || value === null) {
              _.set(errorMessage, item, '该项不能为空');
            } else if (!(/^[+]{0,1}(\d+)$/.test(value))) {
              _.set(errorMessage, item, '请输入正整数');
            }
          });
          if (this.timing === '' || this.timing === undefined || this.timing === null) {
              _.set(errorMessage, 'timing', '该项不能为空');
          }
          if (this.end === '' || this.timing === undefined || this.timing === null) {
              _.set(errorMessage, 'end', '该项不能为空');
          }
        }
        return errorMessage;
      },
      async commitController() {
        try {
          let {id} = this.$route.params;
          let errorMessage = this.validator();
          if (_.keys(errorMessage).length > 0) {
            this.errorMessage = _.assign({}, errorMessage);
            return false;
          }

          let reqBody = [];
          if (this.controllerTabActiveIndex === 0) {
            let filterList = ['Dcfkg01', 'Dcfkg02', 'Dcfkg03', 'Dcfkg04', 'Dcfkg05', 'Dcfkg06', 'Dcfkg07', 'Dcfkg08', 'Dcfkg09', 'Dcfkg10', 'SubmersiblePump', 'SubmersiblePump2', 'PipelinePump', 'Manual', 'Automatic'];
            reqBody = this.controllerLastData.filter((item) => {
              let index = filterList.findIndex((_item) => _item === item.metric);
              if (index >= 0) {
                return item;
              }
            });
          } else if (this.controllerTabActiveIndex === 1) {
            let filterList = ['RotIrrItva', 'RotIrrCount', 'SingleValveRunTime', 'Manual', 'Automatic'];
            reqBody = this.controllerLastData.filter((item) => {
              let index = filterList.findIndex((_item) => _item === item.metric);
              if (index >= 0) {
                return item;
              }
            });
          } else {
            let filterList = ['RotIrrItva', 'RotIrrCount', 'SingleValveRunTime', 'IntervalDays', 'TimingHour', 'TimingMinute', 'EndYear', 'EndMonth', 'EndDay', 'Manual', 'Automatic'];
            let timingSplit = this.timing.split(':');
            let endSplit = this.end.split('-');
            reqBody = this.controllerLastData.filter((item) => {
              let index = filterList.findIndex((_item) => _item === item.metric);
              if (index >= 0) {
                return item;
              }
            }).map((item) => {
              if (item.metric === 'TimingHour') {
                item.value = timingSplit[0];
              }
              if (item.metric === 'TimingMinute') {
                item.value = timingSplit[1];
              }
              if (item.metric === 'EndYear') {
                item.value = endSplit[0];
              }
              if (item.metric === 'EndMonth') {
                item.value = endSplit[1];
              }
              if (item.metric === 'EndDay') {
                item.value = endSplit[2];
              }
              return item;
            });
          }
          let commandList = reqBody.map((item) => {
            return {
              name: item.metric,
              value: item.value
            };
          });
          let confirm = await this.$confirm(`执行后将关闭[${this.currentModeLabel}], 并切换到[${this.changedModeLabel}], 是否确定执行?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          if (confirm) {
            let {deviceName} = this.controllerInfo;
            let res = await this.$service.getControllerRun({id, deviceName, commandList});
            if (res && res.code === 0) {
              this.$message.success('控制设备命令发送成功');
            }
          }
        } catch (err) {
          console.log(err);
        }
      },
      editController() {
        if (!this.$authority.isHasAuthority('admin:sensor:edit')) {
          return;
        }
        this.$router.push({
          name: 'EditControl',
          params: {id: this.$route.params.id}
        });
      },
      toControllerList() {
        if (!this.$authority.isHasAuthority('admin:sensor:page')) {
          return;
        }
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss">

  #sensor-detail-container {
    padding-bottom: 100px;
    .el-radio-button--small {
      &.is-active {
        .el-radio-button__inner {
          border: 1px solid rgba(46, 171, 255, 1);
          color: #2EABFF;
        }
      }

      .el-radio-button__inner {
        font-size: 12px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
        border: 1px solid rgba(62, 73, 94, 1);
        padding: 6px 0;
        width: 50px;
        background-color: transparent;
      }
    }
  }
</style>

<style scoped lang="scss">

  #main {
    padding-bottom: 100px;
    height: 500px;
    width: 100%;
    opacity: 0;
    &.block-none {
      opacity: 1;
    }
  }

  #sensor-detail-container {
    margin: 20px;
  }

  .line-chart-block {
    padding-bottom: 100px;
  }

  #chart-block {
    position: relative;
    #empty-block {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .svg-icon {
        width: 64px;
        height: 64px;
      }

      label {
        margin-top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }
    }
  }

  .label-btn {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 72px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid #2EABFF;
    font-size: 14px;
    font-weight: 400;
    color: #2EABFF;
    margin-right: 10px;
  }
  .margin_right_20 {
    margin-right: 20px;;
  }

  #block-container {
    display: flex;
    flex-direction: row;
  }

  /* 数据信息 */
  #data-info-block {
    margin-top: 20px;
    height: 800px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;

    .chart-header {
      padding-bottom: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(62, 73, 94, 1);

      .chart-title {
        padding-left: 20px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }
    }
    #empty-block {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .svg-icon {
        width: 64px;
        height: 64px;
      }

      label {
        margin-top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }
    }
    .select-tab-block {
      position: relative;
      margin-top: 33px;
      margin-bottom: 72px;
      margin-left: 40px;

    }

    .header {
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 62px;
      border-bottom: 1px solid rgba(62, 73, 94, 1);

      .time {
        font-size: 14px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .svg-icon {
          height: 15px;
          width: 20px;
        }

        label {
          margin-left: 10px;
          font-size: 16px;
          font-weight: 500;
          color: rgba(240, 240, 240, 1);
        }
      }
    }
  }

  /* 运维信息 */
  #manager-info-block {
    flex-grow: 1;
    margin-left: 20px;
    width: 404px;
    height: 203px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;

    .content {
      height: 140px;
      padding: 30px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      div {
        display: flex;
        align-items: center;

        span {
          margin-right: 20px;
          margin-left: 85px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
        }

        label {
          font-size: 14px;
          font-weight: 400;
          color: rgba(168, 171, 179, 1);
        }
      }

    }

    .header {
      display: flex;
      align-items: center;
      height: 62px;
      border-bottom: 1px solid rgba(62, 73, 94, 1);

      .svg-icon {
        margin-left: 20px;
        margin-right: 12px;
        height: 18px;
        width: 18px;
      }

      label {
        font-size: 16px;
        font-weight: 500;
        color: rgba(240, 240, 240, 1);
      }
    }
  }

  /*   基本信息 */
  #basic-info-block {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 700px;
    height: 203px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;

    .content {
      height: 140px;
      padding: 18px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .block {
        display: flex;
        align-items: center;

        div {
          display: flex;
          align-items: center;

          &:last-child {
            span {
              width: 60px;
            }

            label {
              width: auto;
            }
          }

          span {
            margin-right: 20px;
            text-align: right;
            width: 143px;
          }

          label {
            width: 200px;
          }

          i {
            margin-left: 20px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 400;
            color: rgba(46, 171, 255, 1);
          }
        }
      }
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 62px;
      border-bottom: 1px solid rgba(62, 73, 94, 1);

      .title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        color: rgba(240, 240, 240, 1);

        .svg-icon {
          margin-left: 20px;
          margin-right: 12px;
          height: 18px;
          width: 18px;
        }
      }

      .status-block {
        display: flex;
        align-items: center;
        .toggle-block {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
        label {
          margin-right: 20px;
          display: flex;
          align-items: center;
          width: 80px;
          height: 32px;
          background: rgba(42, 57, 78, 1);
          border-radius: 4px;
          justify-content: center;

          i {
            margin-right: 4px;
            font-size: 14px;
            color: #EF9545;

            &.active {
              color: #4BB5FF;
            }

            &.offline {
              color: #F35151;
            }

            &.online {
              color: #7ED321;
            }

            &.UNACTIVE {
              color: #5E6B82;
            }
          }
        }
      }
    }

  }

.controller-tab-list {
  display: flex;
  .controller-tab-item {
    width: 100px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #999;
    cursor: pointer;
    &.active {
      color: #fff;
      background-color: #2EABFF;
      border-color: #2EABFF;
    }
  }
  .controller-tab-item + .controller-tab-item {
    margin-left: 20px;
  }
}

.controller-tab-content-item {
  width: 100%;
  min-height: 300px;
  .dcfkg-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .dcfkg-item {
      width: 20%;
      margin: 10px 0;
    }
  }
  .ben {
    margin: 20px 0;
  }
  .ben-wrapper {
    display: flex;
    .ben {
      width: 20%;
    }
  }
  .img-wrapper {
    .img {
      width: 100%;
      height: 400px;
      background-image: url('../../../assets/img/controller_img.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
  }
  .error-message {
    font-size: 12px;
    line-height: 12px;
    margin-top: 8px;
    color: #F35151;
  }
  i {
    &.offline {
      color: #F35151;
    }
    &.online {
      color: #7ED321;
    }
  }
}
.controller-tip {
  margin: 10px 0;
  font-size: 12px;
}
.my-form {
  .el-input {
    width: 120px;
  }
  .tip {
    margin-left: 20px;
    font-size: 12px;
  }
}
.current-mode,
.pressure {
  margin-left: 20px;
  font-size: 14px;
}
</style>
<style lang="scss">
.controller-tab-content-item {
  .el-input__prefix {
    display: none;
  }
}
</style>