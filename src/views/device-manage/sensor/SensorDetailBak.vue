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
              <span>设备类型</span>
              <label>传感器</label>
            </div>
            <div>
              <span>所属农场</span>
              <label>{{sensorInfo.farmName}}</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>厂商</span>
              <label>{{sensorInfo.sensorVendor}}</label>
            </div>
            <div>
              <span>所属地块</span>
              <label>{{sensorInfo.landName || '未设置'}}</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>预警模型</span>
              <label>{{sensorInfo.modelName || '未设置'}}</label>
            </div>
            <div></div>
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
      <div class="select-tab-block">
        <div v-for="item in dimensionTable" :key="item.rowName">
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

  let echarts = require('echarts');

  export default {
    name: "SensorDetail",
    components: {
      SelectMapPosition
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
          'TRWD': false,
          'TRXDSD': false,
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
          {name: 'PH值', key: 'SPH', lineColor: '#AACE86'}]
      }
    },
    mounted() {
      this.init();
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
        if (this.dimensionObj['DQWD'] && this.dimensionObj['DQSD'] && this.dimensionObj['GZD'] && this.dimensionObj['GZZFS'] && this.dimensionObj['JYL'] && this.dimensionObj['FS'] && this.dimensionObj['FX'] && this.dimensionObj['QY']) {
          this.dimensionAllObj['气象环境'] = true;
        } else {
          this.dimensionAllObj['气象环境'] = false;
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
        if (this.dimensionObj['SZWD'] && this.dimensionObj['SPH']) {
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
            trigger: 'axis'
          },
          grid: {
            left: '380'
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
            this.sensorInfo = response.data;
            this.setDisplayDimensionList();
            this.getSensorDimensionData(false);
          }
        });
      },
      getSensorDimensionData(update) {
        this.$service.getSensorDimensionData({
          // deviceName: this.$route.params.id,
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
