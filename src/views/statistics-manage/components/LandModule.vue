<!-- 数据统计-农场统计--地块统计 -->
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
        <el-button @click="exportLandDataExcel" class="filter-add-btn">
          <svg-icon icon-class="excel_export"></svg-icon>
          导出表格
        </el-button>
      </div>
    </div>
    <div id="chart-block" v-if="chartDisplay">
      <div class="label-tag-wrapper">
        <label-tag :labelList="landLabelList" :labelChangedHandler="labelChangedHandler"></label-tag>
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
      :data="landStatisticsList"
    >
          <el-table-column prop="year" align="left" width="100px" label="年份(年)">
            <template slot-scope="scope">
              <div>{{ scope.row.year }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="farmLandArea" align="left" width="100px" label="总面积">
            <template slot-scope="scope">
              <div>{{ scope.row.farmLandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="farmLandArea" align="left" width="100px" label="粮食农田">
            <template slot-scope="scope">
              <div>{{ scope.row.farmLandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="dryLandArea" align="left" width="100px" label="旱田">
            <template slot-scope="scope">
              <div>{{ scope.row.dryLandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="paddyFieldArea" align="left" width="100px" label="水田">
            <template slot-scope="scope">
              <div>{{ scope.row.paddyFieldArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="irrigationLandArea" align="left" width="100px" label="水浇地">
            <template slot-scope="scope">
              <div>{{ scope.row.irrigationLandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="undefined" align="left" width="100px" label="果树林地">
            <template slot-scope="scope">
              <div>{{ scope.row.fruitLandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="orchardArea" align="left" width="100px" label="果园">
            <template slot-scope="scope">
              <div>{{ scope.row.orchardArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="teagardenArea" align="left" width="100px" label="茶园">
            <template slot-scope="scope">
              <div>{{ scope.row.teagardenArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="otherGardenArea" align="left" width="100px" label="其他园地">
            <template slot-scope="scope">
              <div>{{ scope.row.otherGardenArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="arborForestArea" align="left" width="100px" label="乔木林地">
            <template slot-scope="scope">
              <div>{{ scope.row.arborForestArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="bambooArea" align="left" width="100px" label="竹林地">
            <template slot-scope="scope">
              <div>{{ scope.row.bambooArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mangroveArea" align="left" width="100px" label="红树林地">
            <template slot-scope="scope">
              <div>{{ scope.row.mangroveArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="shrubArea" align="left" width="100px" label="灌木林地">
            <template slot-scope="scope">
              <div>{{ scope.row.shrubArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="otherWoodlandArea" align="left" width="100px" label="其他林地">
            <template slot-scope="scope">
              <div>{{ scope.row.otherWoodlandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="plantGreenhouseArea" align="left" width="100px" label="育苗大棚">
            <template slot-scope="scope">
              <div>{{ scope.row.plantGreenhouseArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="facilityAgriculandArea" align="left" width="100px" label="设施农用地">
            <template slot-scope="scope">
              <div>{{ scope.row.facilityAgriculandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="vegetableGreenhouseArea" align="left" width="100px" label="蔬菜大棚">
            <template slot-scope="scope">
              <div>{{ scope.row.vegetableGreenhouseArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="facilityAgriculandArea" align="left" width="100px" label="设施农用地">
            <template slot-scope="scope">
              <div>{{ scope.row.facilityAgriculandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseArea" align="left" width="100px" label="仓储建筑">
            <template slot-scope="scope">
              <div>{{ scope.row.warehouseArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="storageLandArea" align="left" width="100px" label="仓储用地">
            <template slot-scope="scope">
              <div>{{ scope.row.storageLandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ecologicalLandArea" align="left" width="100px" label="生态观光">
            <template slot-scope="scope">
              <div>{{ scope.row.ecologicalLandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="forestRecreationArea" align="left" width="100px" label="森林游憩">
            <template slot-scope="scope">
              <div>{{ scope.row.forestRecreationArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="steppeEcologyArea" align="left" width="100px" label="草原生态">
            <template slot-scope="scope">
              <div>{{ scope.row.steppeEcologyArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="agriculturalEcologyArea" align="left" width="100px" label="农业生态">
            <template slot-scope="scope">
              <div>{{ scope.row.agriculturalEcologyArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="skiingIceTourismArea" align="left" width="140px" label="滑雪（冰）旅游">
            <template slot-scope="scope">
              <div>{{ scope.row.skiingIceTourismArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="otherEcologicalLandArea" align="left" width="100px" label="其他">
            <template slot-scope="scope">
              <div>{{ scope.row.otherEcologicalLandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="riverArea" align="left" width="100px" label="河流湖泊">
            <template slot-scope="scope">
              <div>{{ scope.row.riverArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="riverSurfaceArea" align="left" width="100px" label="河流水面">
            <template slot-scope="scope">
              <div>{{ scope.row.riverSurfaceArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="lakeSurfaceArea" align="left" width="100px" label="湖泊水面">
            <template slot-scope="scope">
              <div>{{ scope.row.lakeSurfaceArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="reservoirArea" align="left" width="100px" label="水库坑塘">
            <template slot-scope="scope">
              <div>{{ scope.row.reservoirArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="reservoirSurfaceArea" align="left" width="100px" label="水库水面">
            <template slot-scope="scope">
              <div>{{ scope.row.reservoirSurfaceArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="pondWaterSurfaceArea" align="left" width="100px" label="坑塘水面">
            <template slot-scope="scope">
              <div>{{ scope.row.pondWaterSurfaceArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="moorArea" align="left" width="100px" label="沼泽滩涂">
            <template slot-scope="scope">
              <div>{{ scope.row.moorArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="marshlandArea" align="left" width="100px" label="沼泽地">
            <template slot-scope="scope">
              <div>{{ scope.row.marshlandArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="coastalBeachArea" align="left" width="100px" label="沿海滩涂">
            <template slot-scope="scope">
              <div>{{ scope.row.coastalBeachArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="inlandBeachArea" align="left" width="100px" label="内陆滩涂">
            <template slot-scope="scope">
              <div>{{ scope.row.inlandBeachArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fishpondArea" align="left" width="100px" label="人工鱼塘">
            <template slot-scope="scope">
              <div>{{ scope.row.fishpondArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ditchArea" align="left" width="100px" label="沟渠">
            <template slot-scope="scope">
              <div>{{ scope.row.ditchArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="hydraulicStructureArea" align="left" width="120px" label="水工建筑用地">
            <template slot-scope="scope">
              <div>{{ scope.row.hydraulicStructureArea }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="otherFishpondArea" align="left" width="100px" label="其他">
            <template slot-scope="scope">
              <div>{{ scope.row.otherFishpondArea }}</div>
            </template>
          </el-table-column>
    </el-table>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import echarts from "echarts";
import _ from "lodash";
import label from "@/util/label";
import LabelTag from "./LabelTag";

export default {
  name: "landModule",
  components: { LabelTag },
  data() {
    return {
      landLabelList: label.landLabelList,
      chartDisplay: true,
      landStatisticsList: [],
      yAxis: [
        {
          name: '公顷',
          position: 'left'
        }
      ]
    };
  },
  created() {
    this.$service
      .getLandMetricStatistics()
      .then((res) => {
        if (res && res.code === 0) {
          this.landStatisticsList = res.data || [];
          this.initLandChart(this.landStatisticsList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    // 重写
    async initLandChart(inputData) {
      try {
        await this.$nextTick();
        let landChartDom = document.querySelector("#my-chart");
        let landChart = echarts.init(landChartDom);
        this.landChart = landChart;
        // 为echarts对象加载数据
        landChart.clear();
        landChart.setOption(this.getLandOption(inputData), true);

        window.addEventListener(
          "resize",
          () => {
            this.landChart.resize();
          },
          false
        );
      } catch (err) {
        console.log(err);
      }
    },
    getLandOption(data) {
      let obj = _.groupBy(data, "year");
      let years = Object.keys(obj);
      let yearData = years.map((year) => {
        let item = _.get(obj, `${year}.0`);
        return item;
      });
      let series = this.landLabelList.filter(label => label.active)
                       .map((label) => {
                        return {
                          name: label.name,
                          data: yearData.map((item) => _.get(item, label.prop) || 0),
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
      return label.mixOption({ year: years, series, yAxis: this.yAxis });
    },
    exportLandDataExcel() {
      this.$service.exportLandDataExcel().then((response) => {
        this.$message.success("正在导出地块统计数据，请稍等");
        let aLink = document.createElement("a");
        let blob = new Blob([response], { type: "application/vnd.ms-excel" });
        aLink.href = URL.createObjectURL(blob);
        aLink.setAttribute(
          "download",
          "地块统计数据_" +
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
          "地块统计" +
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
        this.initLandChart(this.landStatisticsList);
      } catch (err) {
        console.log(err);
      }
    },
    labelChangedHandler(labelList) {
      this.landLabelList = labelList;
      this.initLandChart(this.landStatisticsList);
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
