<!-- 数据统计-农场统计--经营统计 -->
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
          @click="exportOperateDataExcel"
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
        label="年份（年）">
        <template slot-scope="scope">
          <div>{{scope.row.year}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalArea"
        align="left"
        label="资金总额(万元)">
        <template slot-scope="scope">
          <div>{{scope.row.totalAmount}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sensorVendor"
        align="left"
        label="政府项目(个)">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.governmentProjectNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="farmName"
        align="left"
        label="项目拨款(万元)">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.appropriationAmount}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="专项补贴(个)">
        <template slot-scope="scope">
          <div>{{scope.row.subsidyProjectNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="补贴金额(万元)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.subsidyAmount}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        align="left"
        label="农业社会化服务营收(万元)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.revenueAmount}}</div>
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
      return {
        chartDisplay: true,
        landMetricDataList: [],
        myChart: null,
        option: null
      }
    },
    mounted() {
      this.getOperateMetricStatistics();
    },
    methods: {
      initCharts(responseDataList) {
        let xAxisData = [];
        responseDataList.map(item => {
          xAxisData.push(item.year);
        });
        let legendData = ['资金总额(万元)', '项目拨款(万元)', '补贴金额(万元)', '农业社会化服务营收(万元)', '政府项目(个)', '专项补贴(个)'];
        let labelMap = {
          'totalAmount': '资金总额(万元)',
          'governmentProjectNumber': '政府项目(个)',
          'appropriationAmount': '项目拨款(万元)',
          'subsidyProjectNumber': '专项补贴(个)',
          'subsidyAmount': '补贴金额(万元)',
          'revenueAmount': '农业社会化服务营收(万元)'
        };
        let attributeObj = {};
        for (let key in labelMap) {
          attributeObj[labelMap[key]] = key;
        }
        console.log(attributeObj);
        let series = [];
        legendData.map(item => {
          let data = [];
          responseDataList.map(responseItem => {
            data.push(responseItem[attributeObj[item]]);
          });
          // 设置堆叠
          let stack = 1;
          let yAxisIndex = 0;
          if (item === '政府项目(个)' || item === '专项补贴(个)') {
            stack = 2;
            yAxisIndex = 1;
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
          grid: {
            left: 35,
            right: 35
          },
          xAxis: [{
            axisLabel: {
              interval: 0,
              margin: 12
            },
            data: xAxisData
          }],
          yAxis: [{
            type: 'value',
            name: '万元',
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
            name: '个',
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
      exportOperateDataExcel() {
        this.$service.exportOperateDataExcel().then(response => {
          this.$message.success('正在导出经营统计数据，请稍等');
          let aLink = document.createElement('a');
          let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute('download', '经营统计数据_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
          aLink.click();
        })
      },
      exportChart() {
        const canvas = this.$el.getElementsByTagName('canvas')[0];
        canvas.toBlob((blob) => {
          FileSaver.saveAs(
            blob,
            '经营统计' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.png'
          )
        })
      },
      getOperateMetricStatistics() {
        this.$service.getOperateMetricStatistics().then(response => {
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
