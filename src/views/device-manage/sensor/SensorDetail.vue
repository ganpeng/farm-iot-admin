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
            <div class="toggle-block" v-if="sensorInfo.sensorType === '水产养殖传感器'">
              <span @click="toggleLamp(1)" class="label-btn">开灯</span>
              <span @click="toggleLamp(0)" class="label-btn margin_right_20">关灯</span>
              <span @click="toggleBrush(1)" class="label-btn">开启雨刷</span>
              <span @click="toggleBrush(0)" class="label-btn margin_right_20">关闭雨刷</span>
            </div>
            <label v-if="sensorInfo.deviceStatus === 'ONLINE'"><i class="online">•</i>在线</label>
            <label v-if="sensorInfo.deviceStatus === 'OFFLINE'"><i class="offline">•</i>离线</label>
            <label v-if="sensorInfo.deviceStatus === 'UNACTIVE'"><i class="UNACTIVE">•</i>未激活</label>
            <label><i :class="{'active':sensorInfo.receive}">•</i>{{sensorInfo.receive ? '接收' : '拒收'}}</label>
          </div>
        </div>
        <div class="content">
          <div class="block">
            <div>
              <span>devicename</span>
              <label>{{sensorInfo.deviceName}}</label>
            </div>
            <div>
              <span>设备名称</span>
              <label>{{sensorInfo.name}}</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>设备类型</span>
              <label>{{sensorInfo.sensorType}}</label>
            </div>
            <div>
              <span>经纬度</span>
              <label v-if="sensorInfo.latitude || sensorInfo.longitude">
                E{{sensorInfo.longitude}}
                N{{sensorInfo.latitude}}
              </label>
              <i @click="selectMapPositionVisible = true" v-if="sensorInfo.latitude || sensorInfo.longitude">查看</i>
              <label v-else>未设置</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>厂商</span>
              <label>{{sensorInfo.sensorVendor}}</label>
            </div>
            <div>
              <span>所属企业</span>
              <label>{{sensorInfo.farmName}}</label>
            </div>
          </div>
          <div class="block">
            <div v-if="sensorInfo.sensorType !== '虫情测报灯'">
              <span>预警模型</span>
              <label>{{sensorInfo.modelName || '未设置'}}</label>
            </div>
            <div>
              <span>所属地块</span>
              <label>{{sensorInfo.landName || '未设置'}}</label>
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
            <label>{{sensorInfo.managerCompany || '未设置'}}</label>
          </div>
          <div>
            <span>员工姓名</span>
            <label>{{sensorInfo.manager || '未设置'}}</label>
          </div>
          <div>
            <span>员工电话</span>
            <label>{{sensorInfo.managerPhone || '未设置'}}</label>
          </div>
        </div>
      </div>
    </div>
    <!--  数据信息 -->
    <div id="data-info-block">
      <div class="header">
        <div class="title">
          <svg-icon icon-class="data_info"></svg-icon>
          <label>数据信息</label>
        </div>
        <div class="time">上报间隔：{{sensorInfo.intervalValue || '--'}}分钟</div>
      </div>
      <div v-if="sensorInfo.sensorType !== '虫情测报灯'">
      <div class="select-tab-block">
        <div v-for="item in filterDimensionTable" :key="item.rowName">
          <label>{{item.rowName}}:</label>
          <span @click="selectAllDimensionRow(item)"
                :class="{'active':dimensionAllObj[item.rowName]}" class="all">
            全部
          </span>
          <span :value="dimensionItem.value"
                :class="{'active':dimensionObj[dimensionItem.value]}"
                v-for="dimensionItem in item.dimensionList"
                @click="selectDimension(dimensionItem.value)"
                :key="dimensionItem.value">
            {{dimensionItem.name}}
          </span>
        </div>
      </div>
      <div class="chart-header">
        <label class="chart-title">监测数据趋势图</label>
        <el-radio-group v-model="currentDate" size="small" @change="selectDataTime">
          <el-radio-button label="1">日</el-radio-button>
          <el-radio-button label="7">7日</el-radio-button>
          <el-radio-button label="30">30日</el-radio-button>
          <el-radio-button label="180">6个月</el-radio-button>
          <el-radio-button label="365">1年</el-radio-button>
        </el-radio-group>
      </div>
      <div id="chart-block">
        <div class="line-chart-block" id="main"
             :class="{'block-none':(dimensionList.length !== 0 && sensorDimensionData.length !== 0)}">
        </div>
        <div id="empty-block" v-show="dimensionList.length === 0 || sensorDimensionData.length === 0">
          <svg-icon icon-class="empty_notice"></svg-icon>
          <label v-show="dimensionList.length === 0">请选择数据指标</label>
          <label v-show="sensorDimensionData.length === 0">暂无数据</label>
        </div>
      </div>
      </div>
      <div v-else>
        <div class="content-header">
          <!-- <div class="switch-btn-block">
            <div class="time">上报间隔：{{sensorInfo.intervalValue || '--'}}分钟</div>
          </div> -->
          <div class="filters-container">
            <div class="filter-form">
              <el-date-picker
                v-model="createRangeTime"
                @change="getCameraScreenshotList(true)"
                :default-time="['00:00:00', '23:59:59']"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div id="screenshot-block">
            <div class="empty-block screenshot-empty" v-show="imageList.length === 0">
              <svg-icon icon-class="empty_notice"></svg-icon>
              <label>暂无数据</label>
            </div>
            <div class="view-block" v-show="imageList.length !== 0">
              <img :src="imageList[currentScreenshotIndex] && imageList[currentScreenshotIndex].value">
              <div class="download image-download">
                <a :href="imageList[currentScreenshotIndex] && imageList[currentScreenshotIndex].value">
                  <svg-icon icon-class="download_resource_default"></svg-icon>
                  <svg-icon icon-class="download_resource_active"></svg-icon>
                </a>
              </div>
              <div class="image-index">{{currentScreenshotIndex + 1}}/{{imageList.length}} {{`共 ${imageTotal} 张`}}</div>
              <div class="download-all-image">
                <div class="download-button" @click="downloadAllCameraScreenshots">全部下载</div>
                <el-tooltip class="download-max" effect="dark" content="截图每15分钟生成一张，单次最多支持下载7天的数据。" placement="right">
                  <el-button class="icon-button">
                    i
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div class="image-slide-block" v-show="imageList.length !== 0">
              <div class="device-pre" @click="clickScreenshotPreButton">
                <svg-icon icon-class="device_pre"></svg-icon>
                <svg-icon icon-class="device_pre_active"></svg-icon>
              </div>
              <carousel
                @navigation-click="pageSlideDown"
                :per-page="5"
                :navigationEnabled="true"
                :paginationEnabled="false">
                <slide v-for="(item, index) in imageList" :key="item.timestamp">
                  <img :src="item.value" :class="{'active':currentScreenshotIndex === index}"
                       @click="selectImage(index)">
                  <div class="download">
                    <a :href="item.value">
                      <svg-icon icon-class="download_resource_default"></svg-icon>
                      <svg-icon icon-class="download_resource_active"></svg-icon>
                    </a>
                  </div>
                  <label>{{item.timestamp | formatDate('yyyy/MM/DD-HH:mm')}}.jpg</label>
                </slide>
              </carousel>
              <div class="device-next" @click="clickScreenshotNextButton">
                <svg-icon icon-class="device_next"></svg-icon>
                <svg-icon icon-class="device_next_active"></svg-icon>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two edit-bottom-btn" type="primary" @click="editSensor"
                 v-if="$route.params.status === 'normal'">编辑
      </el-button>
      <el-button class="btn-style-three" @click="toSensorList" plain>返回列表</el-button>
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
        :mapCenter="[sensorInfo.longitude, sensorInfo.latitude]"
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
  import {Carousel, Slide} from 'vue-carousel';
  import JSZip from 'jszip';
  import FileSaver from "file-saver";
  import _ from 'lodash';

  let echarts = require('echarts');

const dimensionObjOne = {
    'DQSD': false,
    'DQWD': false,
    'FS': false,
    'FX': false,
    'GZD': false,
    'GZZFS': false,
    'JYL': false,
    'QY': false,
    'SCCS': false,
    'SPH': true,
    'SWD': true,
    'RJY': true,
    'TRWD': false,
    'TRXDSD': false
  };

  const dimensionObjTwo = {
    'DQSD': true,
    'DQWD': true,
    'FS': false,
    'FX': false,
    'GZD': false,
    'GZZFS': false,
    'JYL': false,
    'QY': false,
    'SCCS': false,
    'SPH': false,
    'SZWD': false,
    'RJY': false,
    'TRWD': false,
    'TRXDSD': false
  };

  export default {
    name: "SensorDetail",
    components: {
      SelectMapPosition,
      Carousel,
      Slide
    },
    data() {
      return {
        dimensionAllObj: {
          '气象环境': false,
          '土壤': false,
          '虫情': false,
          '水质': false
        },
        dimensionTable: [{
          rowName: '气象环境', dimensionList: [
            {name: '空气温度', value: 'DQWD'},
            {name: '空气湿度', value: 'DQSD'},
            {name: '光照度', value: 'GZD'},
            {name: '光照总辐射', value: 'GZZFS'},
            {name: '降雨量', value: 'JYL'},
            {name: '气压', value: 'QY'},
            {name: '风速', value: 'FS'},
            {name: '风向', value: 'FX'}
          ]
        }, {
          rowName: '土壤', dimensionList: [
            {name: '土壤温度', value: 'TRWD'},
            {name: '土壤湿度', value: 'TRXDSD'}
          ]
        }, {
          rowName: '虫情', dimensionList: [
            {name: '捕虫量', value: 'SCCS'}
          ]
        }, {
          rowName: '水质', dimensionList: [
            {name: '温度', value: 'SZWD'},
            {name: 'PH值', value: 'SPH'},
          ]
        }],
        // 数据维度对象
        dimensionObj: {
          'DQSD': true,
          'DQWD': true,
          'FS': false,
          'FX': false,
          'GZD': false,
          'GZZFS': false,
          'JYL': false,
          'QY': false,
          'SCCS': false,
          'SPH': false,
          'SZWD': false,
          'RJY': false,
          'TRWD': false,
          'TRXDSD': false
        },
        lineChartOptions: {
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        currentDate: '1',
        sensorInfo: {},
        sensorDimensionData: [],
        selectMapPositionVisible: false,
        option: {},
        myChart: {},
        //展示维度设置列表
        dimensionList: [],
        // 所有维度设置列表
        dimensionAllList: [
          {name: '空气温度(℃)', key: 'DQWD', lineColor: '#52B5E4'},
          {name: '空气湿度(%)', key: 'DQSD', lineColor: '#4796FF', min: 0.2},
          {name: '光照度(klux)', key: 'GZD', lineColor: '#E3C97B'},
          {name: '光照总辐射(µmol/(m2▪s))', key: 'GZZFS', lineColor: '#E15C5C'},
          {name: '降雨量(mm/min)', key: 'JYL', lineColor: '#86E3E9'},
          {name: '气压(kPa)', key: 'QY', lineColor: '#5563E6', min: 800},
          {name: '风速(m/s)', key: 'FS', lineColor: '#BA69CB'},
          {name: '风向(°)', key: 'FX', lineColor: '#86CE9C'},
          {name: '土壤温度(℃)', key: 'TRWD', lineColor: '#1B8FD5', min: 10},
          {name: '土壤湿度(%)', key: 'TRXDSD', lineColor: '#DC8361'},
          {name: '捕虫数(个)', key: 'SCCS', lineColor: '#7C82FB'},
          {name: '水质温度(℃)', key: 'SZWD', lineColor: '#4796FF'},
          {name: '水质温度(℃)', key: 'SWD', lineColor: '#4796FF'},
          {name: '溶解氧(μmol/L)', key: 'RJY', lineColor: 'green'},
          {name: 'PH值', key: 'SPH', lineColor: '#AACE86'}],
        imageList: [],
        createRangeTime: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
        currentScreenshotIndex: 0,
        screenshotPageNum: 0,
        imageTotal: 0,
      }
    },
    mounted() {
      this.init();
    },
    computed: {
      filterDimensionTable() {
        let dimensionTable = "", sensorType = this.sensorInfo.sensorType;
        if(sensorType === '耕地种植传感器') {
          dimensionTable = this.dimensionTable
        } else if(sensorType === '水产养殖传感器') {
          dimensionTable = [{
            rowName: '水质',
            dimensionList: [
              {name: '温度', value: 'SWD'},
              {name: 'PH值', value: 'SPH'},
              {name: '溶解氧', value: 'RJY'}
            ]
          }]
        } else if(sensorType === '气象传感器') {
          dimensionTable = [{
            rowName: '气象环境',
            dimensionList: [
              {name: '空气温度', value: 'DQWD'},
              {name: '空气湿度', value: 'DQSD'},
              {name: '光照度', value: 'GZD'},
              {name: '降雨量', value: 'JYL'},
              {name: '气压', value: 'QY'},
              {name: '风速', value: 'FS'},
              {name: '风向', value: 'FX'}
            ]
          }]
        }
        return dimensionTable;
      }
    },
    methods: {
      // 设置展示维度
      setDisplayDimensionList() {
        let array = [];
        for (let key in this.dimensionObj) {
          if (this.dimensionObj[key]) {
            for (let i = 0; i < this.dimensionAllList.length; i++) {
              if (this.dimensionAllList[i]['key'] === key) {
                array.push(this.dimensionAllList[i]);
              }
            }
          }
        }
        this.dimensionList = array;
        this.getSensorDimensionData(true);
      },
      // 选择维度
      selectDimension(dimensionKey) {
        if (!this.dimensionObj[dimensionKey]) {
          let count = 0;
          for (let key in this.dimensionObj) {
            if (this.dimensionObj[key]) {
              count++;
            }
          }
          if (count === 8) {
            this.$message.warning('最多可选8个');
            return;
          }
        }
        this.dimensionObj[dimensionKey] = !this.dimensionObj[dimensionKey];
        this.setDimensionAllStatus();
      },
      setDimensionAllStatus() {
        if(this.sensorInfo.sensorType==='气象传感器') {
          if (this.dimensionObj['DQWD'] && this.dimensionObj['DQSD'] && this.dimensionObj['GZD'] && this.dimensionObj['JYL'] && this.dimensionObj['FS'] && this.dimensionObj['FX'] && this.dimensionObj['QY']) {
            this.dimensionAllObj['气象环境'] = true;
          } else {
            this.dimensionAllObj['气象环境'] = false;
          }
        } else if(this.sensorInfo.sensorType==='耕地种植传感器') {
          if (this.dimensionObj['DQWD'] && this.dimensionObj['DQSD'] && this.dimensionObj['GZD'] && this.dimensionObj['GZZFS'] && this.dimensionObj['JYL'] && this.dimensionObj['FS'] && this.dimensionObj['FX'] && this.dimensionObj['QY']) {
            this.dimensionAllObj['气象环境'] = true;
          } else {
            this.dimensionAllObj['气象环境'] = false;
          }
        }
        if (this.dimensionObj['TRWD'] && this.dimensionObj['TRXDSD']) {
          this.dimensionAllObj['土壤'] = true;
        } else {
          this.dimensionAllObj['土壤'] = false;
        }
        if (this.dimensionObj['SCCS']) {
          this.dimensionAllObj['虫情'] = true;
        } else {
          this.dimensionAllObj['虫情'] = false;
        }
        // 添加判断 两中形式都选中 【全部】
        if ((this.dimensionObj['SWD'] && this.dimensionObj['SPH'] && this.dimensionObj['RJY']) || (this.dimensionObj['SZWD'] && this.dimensionObj['SPH'])) {
          this.dimensionAllObj['水质'] = true;
        } else {
          this.dimensionAllObj['水质'] = false;
        }
        this.setDisplayDimensionList();
      },
      // 选择维度的'全部'
      selectAllDimensionRow(dimensionRow) {
        if (!this.dimensionAllObj[dimensionRow.rowName]) {
          let obj = JSON.parse(JSON.stringify(this.dimensionObj));
          for (let i = 0; i < dimensionRow.dimensionList.length; i++) {
            obj[dimensionRow.dimensionList[i].value] = true;
          }
          let count = 0;
          for (let key in obj) {
            if (obj[key]) {
              count++;
            }
          }
          if (count > 8) {
            this.$message.warning('最多可选8个');
            return;
          }
        }
        for (let i = 0; i < dimensionRow.dimensionList.length; i++) {
          this.dimensionObj[dimensionRow.dimensionList[i].value] = !this.dimensionAllObj[dimensionRow.rowName];
        }
        this.dimensionAllObj[dimensionRow.rowName] = !this.dimensionAllObj[dimensionRow.rowName];
        this.setDisplayDimensionList();
      },
      initCharts(legendData, dateList, yAxis, series, update) {
        console.log('initCharts');
        if (!update) {
          this.myChart = echarts.init(document.getElementById('main'));
        }
        // 设置显示的条目的颜色列表
        let colors = [];
        for (let i = 0; i < this.dimensionList.length; i++) {
          colors.push(this.dimensionList[i].lineColor);
        }
        // colors = ['#52B5E4', '#9068FC', '#E3C97B', '#E15C5C', '#86E3E9', '#5563E6', '#BA69CB', '#1B8FD5', '#DC8361', '#7C82FB', '#4796FF', '#AACE86'];
        this.option = {
          color: colors,
          tooltip: {
            trigger: 'axis',
            formatter: function(params, ticket, callback) {
              let result = '', time = '', direction="";
              params.map(item => {
                const {marker, seriesName, value, axisValue} = item;
                if(seriesName.includes("风向")) {
                    if(value > 22.5 && value <= 67.5) {
                      direction = '东北风';
                    } else if(value > 67.5 && value <= 112.5 ) {
                      direction = '东风';
                    } else if(value > 112.5 && value <= 157.5 ) {
                      direction = '东南风';
                    } else if(value > 157.5 && value <= 202.5 ) {
                      direction = '南风';
                    } else if(value > 202.5 && value <= 247.5 ) {
                      direction = '西南风';
                    } else if(value > 247.5 && value <= 292.5 ) {
                      direction = '西风';
                    } else if(value > 292.5 && value <= 337.5 ) {
                      direction = '西北风';
                    } else if((value > 337.5 && value <= 360) || (value > 0 && value <= 22.5)) {
                      direction = '北风';
                    }
                } else {
                  direction = "";
                }
                time = axisValue + "<br/>";
                result += marker + seriesName + " : " + value + " " + direction + "<br/>";
              })
              return time + result;
            },
          },
          grid: {
            left: 440
          },
          toolbox: {
            feature: {
              dataView: {
                show: false,
                readOnly: false
              },
              restore: {
                show: false
              },
              saveAsImage: {
                show: false
              }
            }
          },
          legend: {
            data: legendData,
            textStyle: {
              color: 'rgba(46, 171, 255, 1)',
            },
            inactiveColor: 'gray'
          },
          xAxis: [{
            type: 'category',
            axisTick: {
              alignWithLabel: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#3E495E',
                width: 2
              }
            },
            data: dateList
          }],
          yAxis: yAxis,
          series: series,
          textStyle: {
            color: 'rgba(159,168,184,1)',
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 30
          }
        };
        // 为echarts对象加载数据
        if (typeof this.myChart.setOption === 'function') {
          this.myChart.setOption(this.option, true);
        }
      },
      init() {
        this.$util.toggleFixedBtnContainer();
        this.$service.getSensorDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {

            this.sensorInfo = response.data; // 传感器详情 上部分内容
            if(this.sensorInfo.sensorType === "水产养殖传感器") {
              // 水产养殖 三种维度
              this.dimensionObj = _.cloneDeep(dimensionObjOne);
              this.dimensionAllObj['水质'] = true; // 水产默认全部选中
            } else {
              // 耕地 更多维度
              this.dimensionObj = _.cloneDeep(dimensionObjTwo);
            }
            // 虫情测报灯
            if(this.sensorInfo.sensorType === '虫情测报灯') {
              this.getCameraScreenshotList(true);
            } else {
              this.setDisplayDimensionList();
              this.getSensorDimensionData(false);
            }
          }
        });
      },
      // 获取虫情情报灯截图
      getCameraScreenshotList(isReset = false) {
        if (isReset) {
          this.screenshotPageNum = 0;
        } else {
          this.screenshotPageNum++
        }
        let params = {
          pageNum: this.screenshotPageNum,
          pageSize: 10,
          deviceName: this.sensorInfo.deviceName,
          startedAt: this.createRangeTime[0],
          endedAt: this.createRangeTime[1],
        }
        this.$service.getWormCameraList(params).then(res => {
          if (res && res.code === 0) {
            this.imageTotal = res.data.total;
            if (isReset) {
              this.imageList = res.data.list;
              this.currentScreenshotIndex = 0;
            } else {
              this.imageList = this.imageList.concat(res.data.list);
            }
          }
        })
      },
      downloadAllCameraScreenshots() {
        this.$service.getWormCameraList({
          pageNum: 0,
          pageSize: 10000,
          deviceName: this.sensorInfo.deviceName,
          startedAt: this.createRangeTime[0],
          endedAt: this.createRangeTime[1],
        }).then(response => {
          if (response && response.code === 0) {
            this.$message.success('正在下载,请稍后');
            this.allImageList = response.data.list;
            // 限制下载数量672张
            if (this.allImageList.length > 672) {
              this.$message.warning('单次最多支持7天的数据下载，请重新选择')
            } else {
              this.zipDownloadFile();
            }
          }
        });
      },
      zipDownloadFile() {
        let that = this;
        //*****创建实例，zip是对象实例
        let zip = new JSZip();
        let file_name = 'pic.zip';
        let len = function (arr) {
          let l = 0;
          for (let key in arr) {
            l++;
          }
          return l;
        };
        for (let i = 0; i < this.allImageList.length; i++) {
          //对每一个图片链接获取base64的数据，并使用回调函数处理
          this.getBase64Image(that.allImageList[i], function (dataURL) {
            let imageTitle = that.allImageList[i].value.toString().split('.jpg')[0].split('/')[4];
            //对获取的图片base64数据进行处理
            let img_arr = dataURL.split(',');
            zip.file(imageTitle + '.jpg', img_arr[1], {base64: true});//根据base64数据在压缩包中生成jpg数据
            let ziplength = len(zip.files);
            if (ziplength == that.allImageList.length) {//当所有图片都已经生成打包并保存zip
              zip.generateAsync({type: "blob"}).then(function (content) {
                FileSaver.saveAs(content, file_name);
              });
            }
          });

        }
      },
      getBase64Image(images, callback) {
        let img = new Image();
        let canvas = document.createElement("canvas");
        img.setAttribute('crossorigin', 'anonymous');
        img.onload = function () {
          canvas.getContext("2d").drawImage(img, 0, 0, 640, 320);
          let dataURL = canvas.toDataURL();//使用canvas获取图片的base64数据
          callback ? callback(dataURL) : null; //调用回调函数
        };
        img.src = images.value;
      },
      clickScreenshotPreButton() {
        this.$el.querySelector('#screenshot-block .VueCarousel-navigation-prev').click();
      },
      pageSlideDown(e) {
        console.log(e);
        if (e === 'forward') {
          this.getCameraScreenshotList();
        }
      },
      clickScreenshotNextButton() {
        this.$el.querySelector('#screenshot-block .VueCarousel-navigation-next').click();
      },
      selectImage(index) {
        this.currentScreenshotIndex = index;
      },
      getSensorDimensionData(update) {
        this.$service.getSensorDimensionData({
          deviceName: this.sensorInfo.deviceName,
          days: this.currentDate
        }).then(response => {
          if (response && response.code === 0) {
            this.sensorDimensionData = response.data;
            let dateList = [];
            // 折线图date数据
            if (this.sensorDimensionData[0]) {
              dateList = this.sensorDimensionData[0].orderDps.map(obj => {
                return this.$util.formatDate(new Date(obj.timestamp), 'yyyy-MM-DD\nHH:mm:SS');
              });
            }
            // 折线图每个维度的Y轴数据列表
            let dimensionList = this.dimensionList;
            let sensorDataObj = {};
            this.sensorDimensionData.forEach(el => {
              sensorDataObj[el.metric] = el.orderDps;
            });
            // 三个数据
            let series = [];
            let yAxis = [];
            let legendData = [];
            for (let i = 0; i < dimensionList.length; i++) {
              let data = [];
              if (sensorDataObj[dimensionList[i].key.toLowerCase()]) {
                data = sensorDataObj[dimensionList[i].key.toLowerCase()].map(item => {
                  return parseFloat(item.value);
                });
              } else {
                data = [];
              }
              series.push({name: dimensionList[i].name, type: 'line', yAxisIndex: i, data});
              yAxis.push({
                type: 'value',
                name: dimensionList[i].name.replace(/\(.*?\)/, '').replace(/\)/, ''),
                position: 'left',
                nameLocation: 'start',
                offset: 45 * (i + 1),
                nameRotate: 30,
                min: dimensionList[i].min,
                axisLine: {
                  lineStyle: {
                    color: dimensionList[i].lineColor
                  }
                },
                nameTextStyle: {
                  color: dimensionList[i].lineColor,
                  fontWeight: 400,
                  fontSize: 12
                },
                axisLabel: {
                  formatter: '{value}',
                  color: dimensionList[i].lineColor,
                  fontWeight: 400,
                  fontSize: 12
                }
              });
              legendData.push(dimensionList[i].name);
            }
            console.log('this.initCharts');
            this.initCharts(legendData, dateList, yAxis, series, update);
          }
        });
      },
      selectDataTime() {
        this.getSensorDimensionData();
      },
      editSensor() {
        if (!this.$authority.isHasAuthority('admin:sensor:edit')) {
          return;
        }
        this.$router.push({
          name: 'EditSensor',
          params: {id: this.$route.params.id}
        });
      },
      toSensorList() {
        if (!this.$authority.isHasAuthority('admin:sensor:page')) {
          return;
        }
        this.$router.go(-1);
      },
      toggleLamp(openStatus) {
        let {id, deviceName} = this.sensorInfo;
        this.$service.sensorToggleLamp({id, deviceName, openStatus })
          .then((res) => {
            if (res && res.code === 0) {
              if (openStatus === 1) {
                this.$message.success('传感器灯已打开');
              } else {
                this.$message.success('传感器灯已关闭');
              }
            }
          }).catch((err) => {
            console.log(err);
          });
      },
      toggleBrush(cleanStatus) {
        let {id, deviceName} = this.sensorInfo;
        this.$service.sensorToggleBrush({id, deviceName, cleanStatus})
          .then((res) => {
            if (res && res.code === 0) {
              if (cleanStatus === 1) {
                this.$message.success('传感器雨刷已打开');
              } else {
                this.$message.success('传感器雨刷已关闭');
              }
            }
          }).catch((err) => {
            console.log(err);
          });
      }
    }
  }
</script>

<style lang="scss">

  #sensor-detail-container {
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

    #screenshot-block {
      padding-top: 40px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      .image-slide-block, .video-slide-block {
        display: flex;
        align-items: center;
        margin-top: 40px;
        width: 1124px;
        /* 轮播导航 */
        .device-pre {
          margin-right: 20px;
          width: 42px;
          height: 42px;
          cursor: pointer;
          &:hover {
            .svg-icon-device_pre {
              display: none;
            }
            .svg-icon-device_pre_active {
              display: block;
            }
          }
          .svg-icon {
            width: 42px;
            height: 42px;
          }
          .svg-icon-device_pre {
            display: block;
          }
          .svg-icon-device_pre_active {
            display: none;
          }
        }

        .device-next {
          margin-left: 20px;
          width: 42px;
          height: 42px;
          cursor: pointer;
          &:hover {
            .svg-icon-device_next {
              display: none;
            }
            .svg-icon-device_next_active {
              display: block;
            }
          }
          .svg-icon {
            width: 42px;
            height: 42px;
          }
          .svg-icon-device_next {
            display: block;
          }
          .svg-icon-device_next_active {
            display: none;
          }
        }

        .VueCarousel {
          width: 900px;

          .VueCarousel-navigation-prev, .VueCarousel-navigation-next {
            visibility: hidden;
          }
        }

        .VueCarousel-slide {
          padding: 0 10px;
          display: flex;
          flex-direction: column;
          position: relative;
          height: 120px;

          img, video {
            width: 160px;
            height: 90px;
            cursor: pointer;
            border: 2px solid transparent;

            &:hover, &.active {
              border: 2px solid white;
            }
          }

          label {
            margin-top: 10px;
            text-align: left;
            font-size: 14px;
            font-weight: 400;
            color: rgba(159, 168, 184, 1);
          }

          .download {
            position: absolute;
            cursor: pointer;
            bottom: 40px;
            right: 40px;

            a {
              display: block;
              width: 17px;
              height: 15px;
            }

            &:hover, &:focus {
              .svg-icon {
                &.svg-icon-download_resource_default {
                  display: none;
                }

                &.svg-icon-download_resource_active {
                  display: block;
                }
              }
            }

            .svg-icon {
              width: 17px;
              height: 15px;

              &.svg-icon-download_resource_default {
                display: block;
              }

              &.svg-icon-download_resource_active {
                display: none;
              }
            }
          }
        }
      }
      .empty-block {
        position: relative;
        margin-top: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &.screenshot-empty {
          width: 568px;
          height: 320px;
          background: rgba(41, 53, 74, 1);
          border-radius: 2px;
        }
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

      .view-block {
        display: flex;
        justify-content: center;
        position: relative;
        width: 858px;

        img, video {
          width: 568px;
          height: 320px;
          border-radius: 2px;
        }

        .image-index, .video-index {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
        }

        .download-all {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0;
          bottom: 0;
          width: 78px;
          height: 30px;
          border-radius: 15px;
          border: 1px solid rgba(46, 171, 255, 1);
          font-size: 14px;
          font-weight: 400;
          color: rgba(46, 171, 255, 1);
          cursor: pointer;

          &.video-section {
            bottom: 71px;
            width: 100px;
          }

          &:hover {
            border: none;
            color: rgba(255, 255, 255, 1);
            background: rgba(15, 112, 243, 1);
          }
        }
      .download-all-image {
        position: absolute;
        right: 0;
        bottom: 50px;
        display: flex;
        height: 26px;
        justify-content: flex-end;
        align-items: center;

        .download-button {
          width: 78px;
          height: 30px;
          border-radius: 15px;
          border: 1px solid rgba(46, 171, 255, 1);
          font-size: 14px;
          font-weight: 400;
          color: rgba(46, 171, 255, 1);
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 8px;

          &:hover {
            border: none;
            color: rgba(255, 255, 255, 1);
            background: rgba(15, 112, 243, 1);
          }
        }
        .download-max {
          min-width: 10px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 20px;
          font-weight: 600;
          color: #202C41;
          background-color: #667288;
          border: none;
        }
      }

        .download-notice {
          position: absolute;
          cursor: pointer;
          bottom: 0px;
          right: 0px;
          width: 109px;
          height: 51px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
          line-height: 17px;
        }

        .download {
          position: absolute;
          cursor: pointer;
          bottom: 70px;
          right: 170px;
          &.image-download {
            bottom: 20px;
          }

          &:hover, &:focus {
            .svg-icon {
              &.svg-icon-download_resource_default {
                display: none;
              }

              &.svg-icon-download_resource_active {
                display: block;
              }
            }
          }

          .svg-icon {
            width: 33px;
            height: 30px;

            &.svg-icon-download_resource_default {
              display: block;
            }

            &.svg-icon-download_resource_active {
              display: none;
            }
          }
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

    .select-tab-block {
      margin-top: 33px;
      margin-bottom: 72px;

      div {
        margin-bottom: 14px;
        height: 26px;
        display: flex;
        align-items: center;

        label {
          margin-right: 25px;
          text-align: right;
          width: 144px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
        }

        span {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 35px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
          height: 26px;
          padding: 0 5px;
          cursor: pointer;

          &.all {
            color: #f0f0f0;
          }

          &:nth-child(3), &:nth-child(4) {
            width: 66px;
          }

          &.active {
            background: rgba(38, 146, 255, 1);
            border-radius: 4px;
            color: white;
          }
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
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

    .content-header {
      display: flex;
      justify-content: flex-end;
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
          &:first-child {
            span {
              width: 143px;
            }

            label {
              width: 200px;
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

</style>
