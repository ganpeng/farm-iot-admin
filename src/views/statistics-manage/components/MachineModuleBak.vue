<!-- 数据统计-农场统计--农机具统计 -->
<template>
  <div>
    <div id="operate-block">
      <div @click="chartDisplay = !chartDisplay" :class="{'active':chartDisplay}">
        <svg-icon icon-class="chart_display_default"></svg-icon>
        <svg-icon icon-class="chart_display_active"></svg-icon>
      </div>
      <div>
        <el-button
          v-if="chartDisplay"
          class="filter-add-btn"
          @click="exportChart">
          <svg-icon icon-class="image_export"></svg-icon>
          导出图片
        </el-button>
        <el-button
          @click="exportMachineDataExcel"
          class="filter-add-btn">
          <svg-icon icon-class="excel_export"></svg-icon>
          导出表格
        </el-button>
      </div>
    </div>
    <div id="chart-block" v-show="chartDisplay">
      <div id="main"></div>
    </div>
    <!-- 指标表格 -->
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="landMetricDataList">
      <el-table-column
        width="20px">
      </el-table-column>
      <el-table-column
        prop="year"
        align="left"
        width="120px"
        label="年份(年)">
        <template slot-scope="scope">
          <div>{{scope.row.year}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalArea"
        align="left"
        label="总量(台)">
        <template slot-scope="scope">
          <div>{{scope.row.totalNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sensorVendor"
        align="left"
        label="总动力(万千瓦)">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.totalMilKilowatts}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="种植机械(台)">
        <template slot-scope="scope">
          <div>{{scope.row.plantingMachineryNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="加工机械(台)">
        <template slot-scope="scope">
          <div>{{scope.row.processMachineryNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="运输机械(台)">
        <template slot-scope="scope">
          <div>{{scope.row.transportMachineryNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="其他机械(台)">
        <template slot-scope="scope">
          <div>{{scope.row.otherUseMachineryNumber}}</div>
        </template>
      </el-table-column>
      <!-- 动力 -->
      <el-table-column
        align="left"
        label="柴油(万千瓦)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.dieselMachineryMilKilowatts}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="汽油(万千瓦)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.gasolineMachineryMilKilowatts}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="电动(万千瓦)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.electricMachineryMilKilowatts}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="水利(万千瓦)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.hydraulicMachineryMilKilowatts}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="风力(万千瓦)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.windMachineryMilKilowatts}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="煤炭(万千瓦)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.coalMachineryMilKilowatts}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="太阳能(万千瓦)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.solarMachineryMilKilowatts}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="其他动力(万千瓦)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.otherPowerMachineryMilKilowatts}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import FileSaver from "file-saver";

  let echarts = require('echarts');

  export default {
    name: 'land-module',
    data() {
      this.chartSettings = {
        labelMap: {
          'totalNumber': '总量(台)',
          'totalMilKilowatts': '总动力(万千瓦)',
          'plantingMachineryNumber': '种植机械(台)',
          'processMachineryNumber': '加工机械(台)',
          'transportMachineryNumber': '运输机械(台)',
          'otherUseMachineryNumber': '其他机械(台)',
          'dieselMachineryMilKilowatts': '柴油(万千瓦)',
          'gasolineMachineryMilKilowatts': '汽油(万千瓦)',
          'electricMachineryMilKilowatts': '电动(万千瓦)',
          'hydraulicMachineryMilKilowatts': '水利(万千瓦)',
          'windMachineryMilKilowatts': '风力(万千瓦)',
          'coalMachineryMilKilowatts': '煤炭(万千瓦)',
          'solarMachineryMilKilowatts': '太阳能(万千瓦)',
          'otherPowerMachineryMilKilowatts': '其他动力(万千瓦)'
        },
        stack: {
          '1': ['plantingMachineryNumber', 'processMachineryNumber', 'transportMachineryNumber', 'otherUseMachineryNumber'],
          '2': ['dieselMachineryMilKilowatts', 'gasolineMachineryMilKilowatts', 'electricMachineryMilKilowatts', 'hydraulicMachineryMilKilowatts', 'windMachineryMilKilowatts', 'coalMachineryMilKilowatts', 'solarMachineryMilKilowatts', 'otherPowerMachineryMilKilowatts'],
          '3': ['totalNumber'],
          '4': ['totalMilKilowatts']
        }
      };
      return {
        chartDisplay: true,
        landMetricDataList: [],
        chartData: {
          columns: ['year', 'totalNumber', 'totalMilKilowatts', 'plantingMachineryNumber', 'processMachineryNumber', 'transportMachineryNumber', 'otherUseMachineryNumber',
            'dieselMachineryMilKilowatts', 'gasolineMachineryMilKilowatts', 'electricMachineryMilKilowatts', 'hydraulicMachineryMilKilowatts', 'windMachineryMilKilowatts',
            'coalMachineryMilKilowatts', 'solarMachineryMilKilowatts', 'otherPowerMachineryMilKilowatts'],
          rows: []
        },
        textStyle: {
          color: 'rgba(159,168,184,1)'
        },
        legend: {
          show: true,
          textStyle: {
            color: 'rgba(46, 171, 255, 1)',
          },
          inactiveColor: 'gray'
        },
        chartExtend: {
          series(v) {
            v.forEach(i => {
              i.barMaxWidth = 60;
            });
            return v
          },
          color: ['#297CEB', '#7C82FB', '#71CACF', '#23A6F5', '#98BD72', '#E2CA7F'],
          xAxis: {
            axisLabel: {
              interval: 0,
              margin: 12
            }
          },
          yAxis: {
            name: '台',
            position: 'left',
            nameLocation: 'start',
            splitLine: {
              lineStyle: {
                color: '#3D485D',
                type: 'dotted'
              }
            }
          }
        },
      }
    },
    mounted() {
      this.getMachineMetricStatistics();
    },
    methods: {
      initCharts(responseDataList) {
        let xAxisData = [];
        responseDataList.map(item => {
          xAxisData.push(item.year);
        });
        let legendData = ['总量(台)', '总动力(万千瓦)', '种植机械(台)', '加工机械(台)', '运输机械(台)', '其他机械(台)',
          '柴油(万千瓦)', '汽油(万千瓦)', '电动(万千瓦)', '水利(万千瓦)', '风力(万千瓦)', '煤炭(万千瓦)', '太阳能(万千瓦)', '其他动力(万千瓦)'];
        let labelMap = {
          'totalNumber': '总量(台)',
          'totalMilKilowatts': '总动力(万千瓦)',
          'plantingMachineryNumber': '种植机械(台)',
          'processMachineryNumber': '加工机械(台)',
          'transportMachineryNumber': '运输机械(台)',
          'otherUseMachineryNumber': '其他机械(台)',
          'dieselMachineryMilKilowatts': '柴油(万千瓦)',
          'gasolineMachineryMilKilowatts': '汽油(万千瓦)',
          'electricMachineryMilKilowatts': '电动(万千瓦)',
          'hydraulicMachineryMilKilowatts': '水利(万千瓦)',
          'windMachineryMilKilowatts': '风力(万千瓦)',
          'coalMachineryMilKilowatts': '煤炭(万千瓦)',
          'solarMachineryMilKilowatts': '太阳能(万千瓦)',
          'otherPowerMachineryMilKilowatts': '其他动力(万千瓦)'
        };
        let attributeObj = {};
        for (let key in labelMap) {
          attributeObj[labelMap[key]] = key;
        }
        let series = [];
        legendData.map(item => {
          let data = [];
          responseDataList.map(responseItem => {
            data.push(responseItem[attributeObj[item]]);
          });
          // 设置堆叠
          let stack = 1;
          let yAxisIndex = 0;
          if (item === '总量(台)' || item === '种植机械(台)' || item === '加工机械(台)' || item === '运输机械(台)' || item === '其他机械(台)') {
            yAxisIndex = 1;
          }
          if (item === '种植机械(台)' || item === '加工机械(台)' || item === '运输机械(台)' || item === '其他机械(台)') {
            stack = 2;
          }
          if (item === '总量(台)') {
            stack = 3;
          }
          if (item === '总动力(万千瓦)') {
            stack = 4;
          }
          series.push({
            name: item,
            type: 'bar',
            stack: stack,
            yAxisIndex: yAxisIndex,
            data: data,
            barMaxWidth: 60
          })
        });
        this.myChart = echarts.init(document.getElementById('main'));
        let colors = ['#297CEB', '#7C82FB', '#71CACF', '#23A6F5', '#98BD72', '#E2CA7F'];
        this.option = {
          color: colors,
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: legendData,
            textStyle: {
              color: 'rgba(159,168,184,1)'
            }
          },
          textStyle: {
            color: 'rgba(159,168,184,1)'
          },
          xAxis: [{
            axisLabel: {
              interval: 0,
              margin: 12
            },
            data: xAxisData
          }],
          grid: {
            left: 40,
            right: 40
          },
          yAxis: [{
            type: 'value',
            name: '万千瓦',
            min: 0,
            position: 'left',
            axisLine: {
              show: false
            },
            nameLocation: 'start',
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                color: '#3D485D',
                type: 'dotted'
              }
            }
          }, {
            type: 'value',
            name: '台',
            min: 0,
            position: 'right',
            axisLine: {
              show: false
            },
            nameLocation: 'start',
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                color: '#3D485D',
                type: 'dotted'
              }
            }
          }],
          series: series
        };
        this.myChart.setOption(this.option);
        let that = this;
        this.$nextTick(function () {
          this.myChart.on('legendselectchanged', function (obj) {
            let selected = obj.selected;
            // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
            // 使得 无 selected 对象
            if (selected != undefined && isAllUnSelected(selected)) {
              triggerAction('legendSelect', selected);
            }
          });
          let triggerAction = function (action, selected) {
            let legend = [];
            for (name in selected) {
              if (selected.hasOwnProperty(name)) {
                legend.push({name: name});
              }
            }
            that.myChart.dispatchAction({
              type: action,
              batch: legend
            });
          };
          let isAllUnSelected = function (selected) {
            let selectedCount = 0;
            for (name in selected) {
              if (!selected.hasOwnProperty(name)) {
                continue;
              }
              // 所有 selected Object 里面 true 代表 selected， false 代表 unselected
              if (selected[name] == true) {
                ++selectedCount;
              }
            }
            return selectedCount == 0;
          };
        })
      },
      exportMachineDataExcel() {
        this.$service.exportMachineDataExcel().then(response => {
          this.$message.success('正在导出农机具统计数据，请稍等');
          let aLink = document.createElement('a');
          let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute('download', '农机具统计数据_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
          aLink.click();
        })
      },
      exportLandDataExcel() {
        this.$service.exportLandDataExcel().then(response => {
          if (response.type === 'application/octet-stream' || response.type === 'application/vnd.ms-excel') {
            this.$message.success('正在导出地块统计数据，请稍等');
            let aLink = document.createElement('a');
            let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
            aLink.href = URL.createObjectURL(blob);
            aLink.setAttribute('download', '地块统计数据_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
            aLink.click();
          } else {
            this.$message.warning('导出数据失败,请稍后重试');
          }
        })
      },
      exportChart() {
        const canvas = this.$el.getElementsByTagName('canvas')[0];
        canvas.toBlob((blob) => {
          FileSaver.saveAs(
            blob,
            '农机具统计' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.png'
          )
        })
      },
      getMachineMetricStatistics() {
        this.$service.getMachineMetricStatistics().then(response => {
          if (response && response.code === 0) {
            this.landMetricDataList = response.data;
            this.initCharts(response.data.slice(0).reverse());
          }
        })
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'odd-row';
        } else if (rowIndex % 2 === 0) {
          return 'even-row';
        }
        return '';
      }
    }
  }
</script>

<style scoped lang="scss">

  #operate-block {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    height: 60px;
    background: rgba(32, 44, 65, 1);
    border-radius: 4px;
    div:first-child {
      margin-left: 20px;
      cursor: pointer;
      &:hover, &.active {
        .svg-icon {
          &:first-child {
            display: none;
          }
          &:last-child {
            display: block;
          }
        }
      }
      .svg-icon {
        width: 28px;
        height: 23px;
        &:first-child {
          display: block;
        }
        &:last-child {
          display: none;
        }
      }
    }
    div:last-child {
      padding-right: 20px;
    }
    .el-button {
      margin-left: 10px;
      width: 80px;
    }
  }

  #chart-block {
    margin-bottom: 10px;
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;
  }

  #main {
    height: 420px;
    width: 100%;
  }

</style>
