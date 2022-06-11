<!-- 数据统计-农场统计--种植统计 -->
<template>
  <div id="plant-container">
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
          @click="exportPlantDataExcel"
          class="filter-add-btn">
          <svg-icon icon-class="excel_export"></svg-icon>
          导出表格
        </el-button>
      </div>
    </div>
    <div @keyup.enter="getCameraList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item label="维度">
          <el-select
            class="dimension-select"
            v-model="listQueryParams.dimension"
            @change="selectCropDimension"
            placeholder="全部">
            <el-option
              v-for="item in dimensionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作物类型">
          <el-select
            v-model="listQueryParams.categoryName"
            @change="selectCropCategory"
            placeholder="全部">
            <el-option
              v-for="item in categoryOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作物种类">
          <el-select
            v-model="listQueryParams.typeName"
            @change="selectCropType"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in typeOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
      :data="plantMetricDataList">
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
        v-for="item in metricList"
        align="left"
        :key="item"
        :label="item">
        <template slot-scope="scope">
          <!-- 为了解决metricList变化却不能更新当前item值的问题，应该是element-ui的问题-->
          <div style="height: 100%">
            {{listQueryParams.typeName ? (scope.row[listQueryParams.typeName] &&
            scope.row[listQueryParams.typeName][listQueryParams.dimension]) : scope.row[item] &&
            scope.row[item][listQueryParams.dimension]}}
          </div>
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
      this.chartSettings = {};
      return {
        chartDisplay: true,
        listQueryParams: {
          dimension: 'area',
          categoryName: '粮食作物',
          typeName: ''
        },
        dimensionOptions: [
          {label: '种植面积(公顷)', value: 'area'},
          {label: '产量（吨）', value: 'product'}
        ],
        categoryOptions: [],
        typeOptions: [],
        cameraVendorOptions: [],
        plantMetricDataList: [],
        metricList: [''],
        chartData: {
          columns: [],
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
            if (typeof v.forEach === 'function') {
              v.forEach(i => {
                i.barMaxWidth = 60;
              });
              return v
            }
          },
          color: ['#297CEB', '#7C82FB', '#71CACF', '#23A6F5', '#98BD72', '#E2CA7F'],
          xAxis: {
            axisLabel: {
              interval: 0,
              margin: 12
            }
          },
          yAxis: {
            name: '',
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
      this.getPlantMetricStatistics();
      this.getCropCategoryList();
      this.getPlantMetricChartStatistics();
    },
    methods: {
      exportPlantDataExcel() {
        this.$service.exportPlantDataExcel({
          indicatorType: this.listQueryParams.dimension === 'area' ? 'AREA' : 'YIELD',
          plantType: this.listQueryParams.categoryName,
          plantName: this.listQueryParams.typeName
        }).then(response => {
          this.$message.success('正在导出种植统计数据，请稍等');
          let aLink = document.createElement('a');
          let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute('download', '种植统计数据_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
          aLink.click();
        })
      },
      selectCropDimension() {
        this.getPlantMetricChartStatistics();
      },
      getPlantMetricChartStatistics() {
        this.chartExtend.yAxis.name = this.listQueryParams.dimension === 'area' ? '公顷' : '吨';
        this.$service.getPlantMetricChartStatistics().then(response => {
          if (response && response.code === 0) {
            // 处理种植的数据
            let localResponse = response.data;
            let yearArray = [];
            for (let key in localResponse) {
              yearArray.push(key);
            }
            let metricList = [];
            for (let i = 0; i < localResponse[yearArray[0]].length; i++) {
              metricList.push(localResponse[yearArray[0]][i].plantName);
            }
            this.chartData.columns = ['year'].concat(metricList);
            let list = [];
            for (let key in localResponse) {
              // 定义每个item
              let obj = {year: key};
              for (let m = 0; m < localResponse[key].length; m++) {
                if (this.listQueryParams.dimension === 'area') {
                  obj[localResponse[key][m].plantName] = localResponse[key][m].area;
                } else {
                  obj[localResponse[key][m].plantName] = localResponse[key][m].yield;
                }
              }
              list.push(obj);
            }
            this.chartData.rows = list.slice(0).reverse();
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
      exportChart() {
        const canvas = this.$refs.chart.$el.getElementsByTagName('canvas')[0];
        canvas.toBlob((blob) => {
          FileSaver.saveAs(
            blob,
            '种植统计' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.png'
          )
        })
      },
      selectCropCategory(name) {
        let id = 0;
        this.categoryOptions.map(item => {
          if (item.name === name) {
            id = item.id;
          }
        });
        if (!this.listQueryParams.categoryName) {
          this.listQueryParams.typeName = '';
          this.typeOptions = [];
        } else {
          this.listQueryParams.typeName = '';
          this.getCropTypeListById(id);
        }
        //  更新表格数据
        this.getPlantMetricStatistics();
      },
      selectCropType() {
        //  更新表格数据
        this.getPlantMetricStatistics();
      },
      // 获取作物分类
      getCropCategoryList() {
        this.$service.getCropCategoryList().then(response => {
          if (response && response.code === 0) {
            this.categoryOptions = response.data;
            // 初始化选择'粮食作物'，更新作物种类列表
            this.categoryOptions.map(item => {
              if (item.name === '粮食作物') {
                this.getCropTypeListById(item.id);
              }
            })
          }
        })
      },
      // 获取作物种类
      getCropTypeListById(id) {
        this.$service.getCropTypeListById(id).then(response => {
          if (response && response.code === 0) {
            this.typeOptions = response.data;
          }
        })
      },
      getPlantMetricStatistics() {
        this.$service.getPlantMetricStatistics({
          plantType: this.listQueryParams.categoryName,
          plantName: this.listQueryParams.typeName
        }).then(response => {
          if (response && response.code === 0) {
            // 处理种植的数据
            let localResponse = response.data;
            console.log(localResponse);
            let yearArray = [];
            for (let key in localResponse) {
              yearArray.push(key);
            }
            let metricList = [];
            for (let i = 0; i < localResponse[yearArray[0]].length; i++) {
              metricList.push(localResponse[yearArray[0]][i].plantName);
            }
            let list = [];
            for (let key in localResponse) {
              let obj = {year: key};
              for (let m = 0; m < localResponse[key].length; m++) {
                obj[localResponse[key][m].plantName] = {
                  product: localResponse[key][m].yield,
                  area: localResponse[key][m].area
                }
              }
              list.push(obj);
            }
            this.metricList = metricList;
            this.plantMetricDataList = list.reverse();
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

<style lang="scss">

  #plant-container {
    .el-select {
      &.dimension-select {
        width: 126px !important;
      }
    }
    .filters-container .filter-form .el-form-item {
      margin-right: 40px !important;
    }
    .el-table {
      width: 100% !important;
      background-color: #202C41 !important;
    }
  }

</style>
