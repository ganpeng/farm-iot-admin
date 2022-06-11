<!-- 数据统计-农场统计--投入品统计 -->
<template>
  <div>
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
        <el-button @click="exportInputDataExcel" class="filter-add-btn">
          <svg-icon icon-class="excel_export"></svg-icon>
          导出表格
        </el-button>
      </div>
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
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="inputStatisticsList"
    >
      <el-table-column width="20px"> </el-table-column>
      <el-table-column prop="year" align="left" width="120px" label="年份(年)">
        <template slot-scope="scope">
          <div>{{ scope.row.year }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="totalArea" align="left" label="总量(吨)">
        <template slot-scope="scope">
          <div>{{ scope.row.totalAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sensorVendor" align="left" label="有机肥(吨)">
        <template slot-scope="scope">
          <div class="table-item">{{ scope.row.organicFertilizerAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="farmName" align="left" label="无机肥(吨)">
        <template slot-scope="scope">
          <div class="table-item">
            {{ scope.row.inorganicFertilizerAmount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="manager" align="left" label="农药(吨)">
        <template slot-scope="scope">
          <div>{{ scope.row.pesticideAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="manager" align="left" label="饲料(吨)">
        <template slot-scope="scope">
          <div>{{ scope.row.forageAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="manager" align="left" label="鱼药(吨)">
        <template slot-scope="scope">
          <div>{{ scope.row.fisheryMedicinesAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="其他(吨)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{ scope.row.otherAmount }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import label from "@/util/label";
import LabelTag from "./LabelTag";
let echarts = require("echarts");
export default {
  name: "InputModule",
  components: { LabelTag },
  data() {
    return {
      labelList: label.inputLabelList,
      chartDisplay: true,
      inputStatisticsList: [],
      yAxis: [
        {
          name: "吨",
          position: "left"
        }
      ]
    };
  },
  created() {
    this.$service
      .getInputMetricStatistics()
      .then((res) => {
        if (res && res.code === 0) {
          this.inputStatisticsList = res.data || [];
          this.initMyChart(this.inputStatisticsList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
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
      let obj = _.groupBy(data, "year");
      let years = Object.keys(obj);
      let yearData = years.map((year) => {
        let item = _.get(obj, `${year}.0`);
        return item;
      });
      let series = this.labelList
        .filter((label) => label.active)
        .map((label) => {
          return {
            name: label.name,
            data: yearData.map((item) => _.get(item, label.prop) || 0),
            type: "bar",
            stack: label.stack,
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
        unit: "人",
        yAxis: this.yAxis,
      });
    },
    exportInputDataExcel() {
      this.$service.exportInputDataExcel().then((response) => {
        this.$message.success("正在导出投入品统计数据，请稍等");
        let aLink = document.createElement("a");
        let blob = new Blob([response], { type: "application/vnd.ms-excel" });
        aLink.href = URL.createObjectURL(blob);
        aLink.setAttribute(
          "download",
          "投入品统计数据_" +
            this.$util.formatDate(new Date(), "yyyy-MM-DD_HH:mm:SS") +
            ".xlsx"
        );
        aLink.click();
      });
    },
    exportChart() {
      const canvas = document.getElementsByTagName("canvas")[0];
      canvas.toBlob((blob) => {
        FileSaver.saveAs(
          blob,
          "投入品统计" +
            this.$util.formatDate(new Date(), "yyyy-MM-DD_HH:mm:SS") +
            ".png"
        );
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "odd-row";
      } else if (rowIndex % 2 === 0) {
        return "even-row";
      }
      return "";
    },
    async toggleChartVisible() {
      try {
        this.chartDisplay = !this.chartDisplay;
        if (this.chartDisplay) {
          this.initMyChart(this.inputStatisticsList);
        }
      } catch (err) {
        console.log(err);
      }
    },
    labelChangedHandler(labelList) {
      this.labelList = labelList;
      this.initMyChart(this.inputStatisticsList);
    }
  }
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
// 统计图表样式
#chart-block {
  position: relative;
  margin-bottom: 10px;
  padding-top: 20px;
  background: rgba(32, 44, 65, 1);
  border-radius: 10px;
  .label-tag-wrapper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    background: rgba(32, 44, 65, 1);
    z-index: 1000;
  }
  .charts-wrapper {
    width: 100%;
    #my-chart {
      width: 100%;
      height: 400px;
    }
  }
}
</style>
