<!-- 数据统计-农场统计--经营统计 -->
<template>
  <div>
    <div id="operate-block">
      <div
        @click="toggleChartVisible"
        :class="{ active: chartDisplay }"
      >
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
        <el-button @click="exportOperateDataExcel" class="filter-add-btn">
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
      :data="operatorStatisticsList"
    >
      <el-table-column width="20px"> </el-table-column>
      <el-table-column
        prop="year"
        align="left"
        width="120px"
        label="年份（年）"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.year }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="totalArea" align="left" label="资金总额(万元)">
        <template slot-scope="scope">
          <div>{{ scope.row.totalAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sensorVendor" align="left" label="政府项目(个)">
        <template slot-scope="scope">
          <div class="table-item">{{ scope.row.governmentProjectNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="farmName" align="left" label="项目拨款(万元)">
        <template slot-scope="scope">
          <div class="table-item">{{ scope.row.appropriationAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="manager" align="left" label="专项补贴(个)">
        <template slot-scope="scope">
          <div>{{ scope.row.subsidyProjectNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="补贴金额(万元)">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{ scope.row.subsidyAmount }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        align="left"
        label="农业社会化服务营收(万元)"
      >
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{ scope.row.revenueAmount }}</div>
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
  name: "OperateModule",
  components: { LabelTag },
  data() {
    return {
      labelList: label.operatorLabelList,
      chartDisplay: true,
      operatorStatisticsList: [],
      yAxis: [
        {
          name: "万元",
          position: "left"
        },
        {
          name: "个",
          position: "right"
        }
      ],
    };
  },
  created() {
    this.$service
      .getOperateMetricStatistics()
      .then((res) => {
        if (res && res.code === 0) {
          let moneyList = ['totalAmount', 'appropriationAmount', 'subsidyAmount', 'revenueAmount'];
          let operatorStatisticsList = res.data || [];
          this.operatorStatisticsList = operatorStatisticsList.map((item) => {
            moneyList.forEach((prop) => {
              _.set(item, prop, this.toWanYuan(_.get(item, prop)));
            });
            return item;
          });
          console.log(this.operatorStatisticsList);
          this.initMyChart(this.operatorStatisticsList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    toWanYuan(num) {
      if (!_.isNumber(num)) {
        return '0.00';
      }
      return (num / 10000).toFixed(2);
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
            yAxisIndex: label.yAxisIndex,
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
    exportOperateDataExcel() {
      this.$service.exportOperateDataExcel().then((response) => {
        this.$message.success("正在导出经营统计数据，请稍等");
        let aLink = document.createElement("a");
        let blob = new Blob([response], { type: "application/vnd.ms-excel" });
        aLink.href = URL.createObjectURL(blob);
        aLink.setAttribute(
          "download",
          "经营统计数据_" +
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
          "经营统计" +
            this.$util.formatDate(new Date(), "yyyy-MM-DD_HH:mm:SS") +
            ".png"
        );
      });
    },
    getOperateMetricStatistics() {
      this.$service.getOperateMetricStatistics().then((response) => {
        if (response && response.code === 0) {
          this.landMetricDataList = response.data;
          this.initCharts(response.data.slice(0).reverse());
        }
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
          this.initMyChart(this.operatorStatisticsList);
        }
      } catch (err) {
        console.log(err);
      }
    },
    labelChangedHandler(labelList) {
      this.labelList = labelList;
      this.initMyChart(this.operatorStatisticsList);
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
</style>
