<!-- 数据统计-农场统计--种植统计 -->
<template>
  <div id="plant-container">
    <div id="operate-block">
      <div @click="toggleChartVisible" :class="{ active: chartDisplay }">
        <svg-icon icon-class="chart_display_default"></svg-icon>
        <svg-icon icon-class="chart_display_active"></svg-icon>
      </div>
      <div>
        <el-button
          v-if="chartDisplay"
          class="filter-add-btn"
          @click="exportChart"
        >
          <svg-icon icon-class="image_export"></svg-icon>
          导出图片
        </el-button>
        <el-button @click="exportPlantDataExcel" class="filter-add-btn">
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
            @change="selectDimensionHandler"
            placeholder="全部"
          >
            <el-option
              v-for="item in dimensionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            class="type-select"
            v-model="listQueryParams.statisticsType"
            @change="selectStatisticsTypeHandler"
            placeholder="全部"
          >
            <el-option
              v-for="item in statisticsTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作物类型">
          <el-select
            v-model="listQueryParams.categoryName"
            @change="selectCategoryHandler"
            placeholder="全部"
          >
            <el-option
              v-for="(item, index) in categoryOptions"
              :key="`category_${index}`"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作物种类">
          <el-select
            v-model="listQueryParams.typeName"
            @change="selectTypeHandler"
            clearable
            placeholder="全部"
          >
            <el-option
              v-for="(item, index) in typeOptions"
              :key="`type_${index}`"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div id="chart-block" v-if="chartDisplay">
      <div class="label-tag-wrapper">
        <label-tag
          :labelList="labelList"
          :labelChangedHandler="labelChangedHandler"
        ></label-tag>
      </div>
      <div class="charts-wrapper">
        <div id="my-chart"></div>
      </div>
    </div>
    <!-- 指标表格 -->
    <ul class="table-list">
      <li v-for="(innerList, index) in tableLabelList" :key="`label_${index}`" class="table-item">
        <div v-for="(inner, _index) in innerList" :key="`inner_${_index}`" class="inner-container">
          <div class="label">{{inner.label}}</div>
        </div>
      </li>
      <li v-for="(innerList, index) in tableList" :key="index" class="table-item">
        <div v-for="(inner, _index) in innerList" :key="`inner_${_index}`" class="inner-container">
          <div class="value">{{inner.value}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import FileSaver from "file-saver";
import label from "@/util/label";
import LabelTag from "./LabelTag";
let echarts = require("echarts");
export default {
  name: "PlantModule",
  components: { LabelTag },
  data() {
    this.chartSettings = {};
    return {
      chartDisplay: true,
      labelList: [],
      myChart: null,
      plantStatisticsData: {},
      listQueryParams: {
        dimension: "area",
        statisticsType: "PLANT_TYPE",
        categoryName: "粮食作物",
        typeName: ""
      },
      statisticsTypeOptions: [
        {
          name: "种植",
          value: "PLANT_TYPE",
        },
        {
          name: "水产",
          value: "WATER_TYPE",
        },
      ],
      dimensionOptions: [
        { label: "种植养殖", value: "area" },
        { label: "产量(吨)", value: "product" },
      ],
      typeOptions: [],
      tableList: []
    };
  },
  async created() {
    try {
      await this.getAllDictList();
      this.selectDimensionHandler();
      await this.$nextTick();
      this.getplantingMultide();
      this.getTypeOptions();
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    ...mapGetters({
      dict: "dict/dict",
      dictList: "dict/dictList",
    }),
    // 水产作物种类
    waterCultivationOptions() {
      return this.dict.waterCultivation || [];
    },
    // 种植作物种类
    cropTypeOptions() {
      return this.dict.cropType || [];
    },
    // 作物种类
    categoryOptions() {
      let { statisticsType } = this.listQueryParams;
      return statisticsType === "PLANT_TYPE"
        ? this.cropTypeOptions
        : this.waterCultivationOptions;
    },
    yAxis() {
      let name = "";
      let { dimension, statisticsType } = this.listQueryParams;
      if (dimension === "area") {
        if (statisticsType === "PLANT_TYPE") {
          name = "公顷";
        } else {
          name = "条";
        }
      } else {
        name = "吨";
      }
      return [
        {
          name,
          position: "left",
        },
      ];
    },
    tableLabelList() {
      return _.take(this.tableList);
    }
  },
  methods: {
    ...mapActions({
      getAllDictList: 'dict/getAllDictList'
    }),
    getTypeOptions() {
      let category = this.categoryOptions.find(
        (item) => item.name === this.listQueryParams.categoryName
      );
      let options = this.dictList.filter(
        (item) => parseInt(item.parentId) === _.get(category, "id")
      );
      this.typeOptions = options;
    },
    // 重写
    async initMyChart(inputData) {
      try {
        await this.$nextTick();
        let myChartDom = document.querySelector("#my-chart");
        let myChart = echarts.init(myChartDom);
        this.myChart = myChart;
        // 为echarts对象加载数据
        myChart.clear();
        myChart.setOption(this.getMyChartOption(inputData), true);
        window.addEventListener(
          "resize",
          () => {
            this.myChart.resize();
          },
          false
        );
      } catch (err) {
        console.log(err);
      }
    },
    getMyChartOption(data) {
      let years = Object.keys(data);
      let yearData = years.map((year) => {
        let item = _.get(data, `${year}`);
        return item;
      });
      let { dimension } = this.listQueryParams;
      let propKey = dimension === 'area' ? 'area' : 'yield';
      let series = this.labelList
        .filter((label) => label.active)
        .map((label) => {
          return {
            name: label.name,
            data: yearData.map((item) => {
              let obj = item.find((_item) => _item.plantName === label.name);
              return _.get(obj, propKey) || 0;
            }),
            type: "bar",
            barWidth: "5%",
            itemStyle: {
              normal: {
                color: function () {
                  //柱状图不同颜色实现
                  return label.color;
                },
              },
            },
          };
        });
      return label.mixOption({
        year: years,
        series,
        yAxis: this.yAxis
      });
    },
    // 种植维度
    getMyPlantStatistics() {
      this.$service
        .getMyPlantStatistics({
          farmId: 0,
          statisticsType: this.listQueryParams.statisticsType
        })
        .then((res) => {
          if (res && res.code === 0) {
            console.log('种植:=======');
            console.log(res.data);
            this.plantStatisticsData = res.data;
            this.labelList = this.serializeLabelList(res.data);
            this.initMyChart(this.plantStatisticsData)
            console.log('种植:=======');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatData(data) {
      let keys = _.keys(data);
      return keys.reduce((res, key) => {
        let item = _.get(data, key);
        let innerKeys = _.keys(item);
        res[key] = innerKeys.map((itemKey) => {
          return {
            plantName: itemKey,
            area: item[itemKey] || 0
          };
        });
        return res;
      }, {});
    },
    getFishingCategoryCount() {
      this.$service.getFishingCategoryCount()
        .then((res) => {
          if (res && res.code === 0) {
            console.log('鱼的条数:===========');
            let data = this.formatData(res.data);
            this.plantStatisticsData = data
            this.labelList = this.serializeLabelList(data);
            console.log(this.labelList);
            this.initMyChart(this.plantStatisticsData)
            console.log('鱼的条数:===========');
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    // 作物分类
    getplantingMultide() {
      let { dimension, categoryName, typeName } = this.listQueryParams;
      this.$service
        .getplantingMultide({
          farmId: 0,
          plantType: categoryName,
          plantName: typeName
        })
        .then((res) => {
          if (res && res.code === 0) {
            let tableList = _.chain(res.data)
                        .keys()
                        .reverse()
                        .reduce((result, curr) => {
                          let first = {label: '年份(年)', value: curr};
                          let last = _.chain(res.data)
                                      .get(curr)
                                      .map((item) => {
                                        let value = dimension === 'area' ? item.area : item.yield;
                                        return {
                                          label: item.plantName,
                                          value
                                        };
                                      })
                                      .value();
                          result.push([first, ...last]);
                          return result;
                        }, [])
                        .value();
            console.log(tableList);
            this.tableList = tableList;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFishingTableData() {
      let { categoryName, typeName } = this.listQueryParams;
      this.$service
        .getFishingTableData({
          // farmId: 0,
          plantType: categoryName,
          plantName: typeName
        })
        .then((res) => {
          if (res && res.code === 0) {
            console.log(res.data);
            let tableList = _.chain(res.data)
                        .keys()
                        .reverse()
                        .reduce((result, curr) => {
                          let first = {label: '年份(年)', value: curr};
                          let last = _.chain(res.data)
                                      .get(curr)
                                      .keys()
                                      .map((label) => {
                                        return {
                                          label,
                                          value: _.get(res.data, `${curr}.${label}`)
                                        };
                                      })
                                      .value();
                          result.push([first, ...last]);
                          return result;
                        }, [])
                        .value();
            this.tableList = tableList;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    exportPlantDataExcel() {
      this.$service
        .exportPlantDataExcel({
          indicatorType:
            this.listQueryParams.dimension === "area" ? "AREA" : "YIELD",
          plantType: this.listQueryParams.categoryName,
          plantName: this.listQueryParams.typeName,
        })
        .then((response) => {
          this.$message.success("正在导出种植统计数据，请稍等");
          let aLink = document.createElement("a");
          let blob = new Blob([response], { type: "application/vnd.ms-excel" });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute(
            "download",
            "种植统计数据_" +
              this.$util.formatDate(new Date(), "yyyy-MM-DD_HH:mm:SS") +
              ".xlsx"
          );
          aLink.click();
        });
    },
    selectDimensionHandler() {
      let { dimension, statisticsType } = this.listQueryParams;
      if (dimension === 'area' && statisticsType === 'WATER_TYPE') {
        this.getFishingCategoryCount();
        this.getFishingTableData();
      } else {
        this.getMyPlantStatistics();
        this.getplantingMultide();
      }
    },
    selectCategoryHandler() {
      let {dimension, statisticsType } = this.listQueryParams;
      this.listQueryParams.typeName = "";
      this.getTypeOptions();
      if (dimension === 'area' && statisticsType === 'WATER_TYPE') {
        this.getFishingTableData();
      } else {
        this.getplantingMultide();
      }
    },
    selectTypeHandler() {
      let { dimension, statisticsType } = this.listQueryParams;
      if (dimension === 'area' && statisticsType === 'WATER_TYPE') {
        this.getFishingTableData();
      } else {
        this.getplantingMultide();
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "odd-row";
      } else if (rowIndex % 2 === 0) {
        return "even-row";
      }
      return "";
    },
    selectStatisticsTypeHandler() {
      let { statisticsType } = this.listQueryParams;
      let categoryName = _.get(this.categoryOptions, `0.name`);
      this.listQueryParams.categoryName = categoryName;
      this.listQueryParams.typeName = "";
      this.getTypeOptions();
      this.selectDimensionHandler();
      if (statisticsType === 'PLANT_TYPE') {
        this.getplantingMultide();
      } else {
        this.getFishingTableData();
      }
    },
    async toggleChartVisible() {
      try {
        this.chartDisplay = !this.chartDisplay;
        if (this.chartDisplay) {
          this.initMyChart(this.plantStatisticsData);
        }
      } catch (err) {
        console.log(err);
      }
    },
    labelChangedHandler(labelList) {
      this.labelList = labelList;
      this.initMyChart(this.plantStatisticsData);
    },
    serializeLabelList(data) {
      let labelList = [];
      let years = Object.keys(data);
      let yearData = years.map((year) => {
        let item = _.get(data, `${year}`);
        return item;
      });
      if (yearData.length > 0) {
        labelList = _.get(yearData, '0').map((item, index) => {
          return {
            name: item.plantName,
            active: true,
            color: label.colors[index]
          };
        });
      }
      return labelList;
    },
    exportChart() {
      const canvas = document.getElementsByTagName("canvas")[0];
      canvas.toBlob((blob) => {
        FileSaver.saveAs(
          blob,
          "种植统计" +
            this.$util.formatDate(new Date(), "yyyy-MM-DD_HH:mm:SS") +
            ".png"
        );
      });
    },
  },
};
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
    &:hover,
    &.active {
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
.table-list {
  .table-item {
    display: flex;
    align-items: center;
    height: 52px;
    padding: 0 35px;
    .inner-container {
      flex: 1;
      .label {
        color: #9fa8b8;
      }
      .value {
        color: #F0F0F0;
      }
    }
    &:nth-child(odd) {
      background-color: #202C41;
    }
    &:nth-child(even) {
      background-color: #212f46;
    }
  }
}


</style>

<style lang="scss">
#plant-container {
  .el-select {
    &.dimension-select {
      width: 136px !important;
    }
  }
  .filters-container .filter-form .el-form-item {
    margin-right: 40px !important;
  }
  .el-table {
    width: 100% !important;
    background-color: #202c41 !important;
  }
}
</style>
