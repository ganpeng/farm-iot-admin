<!-- 数据统计-设备统计--设备种类统计 -->
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
          @click="exportDeviceDataExcel"
          class="filter-add-btn">
          <svg-icon icon-class="excel_export"></svg-icon>
          导出表格
        </el-button>
      </div>
    </div>
    <div id="chart-block" v-if="chartDisplay">
      <ve-histogram
        ref="chart"
        :data="chartData"
        :extend="chartExtend"
        width="100%"
        :settings="chartSettings"
        :textStyle="textStyle"
        :legend="legend">
      </ve-histogram>
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
        label="总数(套)">
        <template slot-scope="scope">
          <div>{{scope.row.totalNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sensorVendor"
        align="left"
        label="传感器(套)">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.sensorNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="farmName"
        align="left"
        label="球机摄像头(套)">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.domeCameraNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="枪机摄像头(套)">
        <template slot-scope="scope">
          <div>{{scope.row.boxCameraNumber}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import FileSaver from "file-saver";

  export default {
    name: 'land-module',
    data() {
      this.chartSettings = {
        labelMap: {
          'totalNumber': '总数(套)',
          'sensorNumber': '传感器(套)',
          'domeCameraNumber': '球机摄像头(套)',
          'boxCameraNumber': '枪机摄像头(套)'
        },
        stack: {
          '1': ['sensorNumber', 'domeCameraNumber', 'boxCameraNumber'],
          '2': ['totalNumber']
        }
      };
      return {
        chartDisplay: true,
        landMetricDataList: [],
        chartData: {
          columns: ['year', 'totalNumber', 'sensorNumber', 'domeCameraNumber', 'boxCameraNumber'],
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
            name: '套',
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
      this.getDeviceTypeMetricStatistics();
    },
    methods: {
      exportDeviceDataExcel() {
        this.$service.exportDeviceDataExcel().then(response => {
          this.$message.success('正在导出设备种类统计数据，请稍等');
          let aLink = document.createElement('a');
          let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute('download', '设备种类统计数据_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
          aLink.click();
        })
      },
      exportChart() {
        const canvas = this.$refs.chart.$el.getElementsByTagName('canvas')[0];
        canvas.toBlob((blob) => {
          FileSaver.saveAs(
            blob,
            '设备种类统计' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.png'
          )
        })
      },
      getDeviceTypeMetricStatistics() {
        this.$service.getDeviceTypeMetricStatistics().then(response => {
          if (response && response.code === 0) {
            this.landMetricDataList = response.data.deviceStatisticsList;
            this.chartData.rows = response.data.deviceStatisticsList.slice(0).reverse();
            let that = this;
            this.$nextTick(function () {
              this.$refs.chart.echarts.on('legendselectchanged', function (obj) {
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
                that.$refs.chart.echarts.dispatchAction({
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

</style>
