<!-- 数据统计 -->
<template>
  <div id="statistics-container">
    <div id="tab-list-block">
      <label :class="{'active':currentIndex === 0}" @click="currentIndex = 0">农场统计</label>
      <label :class="{'active':currentIndex === 1}" @click="currentIndex =1">设备统计</label>
      <label>销售统计</label>
      <label>5G网络</label>
      <label>仓储物流</label>
    </div>
    <!-- 农场统计 -->
    <div class="card-data-block" v-if="currentIndex === 0">
      <div class="row-block">
        <!-- 地块统计 -->
        <div class="card-item-block">
          <div class="header">
            <div @click="toPage('FarmStatistics', 0)">
              <svg-icon icon-class="data_land"></svg-icon>
              <label>用地统计</label>
              <div class="entrance-block">
                <svg-icon icon-class="arrow_right"></svg-icon>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="info-block">
              <label class="chart-title">地块总面积(公顷)</label>
              <span class="info-amount">{{landStatisticsObj.totalArea}}</span>
              <div class="legend-block-wrapper">
                <div class="legend-block">
                  <div class="tag">
                    <i class="tag_icon1"></i>
                    <i class="tag_icon2"></i>
                    <i class="tag_icon3"></i>
                    <i class="tag_icon4"></i>
                    <i class="tag_icon5"></i>
                    <i class="tag_icon6"></i>
                  </div>
                  <div class="name">
                    <label>粮食农田</label>
                    <label>果树林地</label>
                    <label>育苗大棚</label>
                    <label>仓储建筑</label>
                    <label>生态观光</label>
                    <label>河流湖泊</label>
                  </div>
                  <div class="number">
                    <small>{{landStatisticsObj.farmLandArea}}</small>
                    <small>{{landStatisticsObj.fruitLandArea}}</small>
                    <small>{{landStatisticsObj.plantGreenhouseArea}}</small>
                    <small>{{landStatisticsObj.warehouseArea}}</small>
                    <small>{{landStatisticsObj.ecologicalLandArea}}</small>
                    <small>{{landStatisticsObj.riverArea}}</small>
                  </div>
                  <div class="percent">
                    <span>{{landStatisticsObj.farmLandAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.fruitLandAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.plantGreenhouseAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.warehouseAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.ecologicalLandAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.riverAreaPercent | getPercent}}</span>
                  </div>
                </div>
                <div class="legend-block">
                  <div class="tag">
                    <i class="tag_icon7"></i>
                    <i class="tag_icon8"></i>
                    <i class="tag_icon9"></i>
                    <i class="tag_icon10"></i>
                    <i class="tag_icon11"></i>
                  </div>
                  <div class="name">
                    <label>水库坑塘</label>
                    <label>蔬菜大棚</label>
                    <label>沼泽滩涂</label>
                    <label>人工鱼塘</label>
                    <label>宅基地</label>
                  </div>
                  <div class="number">
                    <small>{{landStatisticsObj.reservoirArea}}</small>
                    <small>{{landStatisticsObj.vegetableGreenhouseArea}}</small>
                    <small>{{landStatisticsObj.moorArea}}</small>
                    <small>{{landStatisticsObj.fishpondArea}}</small>
                    <small>{{landStatisticsObj.homesteadArea}}</small>
                  </div>
                  <div class="percent">
                    <span>{{landStatisticsObj.reservoirAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.vegetableGreenhouseAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.moorAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.fishpondAreaPercent | getPercent}}</span>
                    <span>{{landStatisticsObj.homesteadPercent | getPercent}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-block">
              <ve-ring
                width="200px"
                height="200px"
                :legend-visible="false"
                :data="landChartData"
                :extend="chartExtend"
                :settings="chartSettings">
              </ve-ring>
            </div>
          </div>
        </div>
        <!-- 从业人员 -->
        <div class="card-item-block">
          <div class="header">
            <div @click="toPage('FarmStatistics', 1)">
              <svg-icon icon-class="data_member"></svg-icon>
              <label>从业人员</label>
              <div class="entrance-block">
                <svg-icon icon-class="arrow_right"></svg-icon>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="info-block">
              <label class="chart-title">从业人员总计(人)</label>
              <span class="info-amount">{{memberStatisticsObj.totalNumber}}</span>
              <div class="legend-block-wrapper">
                <div class="legend-block">
                  <div class="tag">
                    <i class="tag_icon1"></i>
                    <i class="tag_icon2"></i>
                  </div>
                  <div class="name">
                    <label>经营人员</label>
                    <label>种植人员</label>
                  </div>
                  <div class="number">
                    <small>{{memberStatisticsObj.manageMemberNumber}}</small>
                    <small>{{memberStatisticsObj.plantMemberNumber}}</small>
                  </div>
                  <div class="percent">
                    <span>{{memberStatisticsObj.manageMemberNumberPercent | getPercent}}</span>
                    <span>{{memberStatisticsObj.plantMemberNumberPercent | getPercent}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-block">
              <ve-ring
                width="200px"
                height="200px"
                :legend-visible="false"
                :data="memberChartData"
                :extend="chartExtend"
                :settings="chartSettings">
              </ve-ring>
            </div>
          </div>
        </div>
      </div>
      <div class="row-block">
        <!-- 农机具 -->
        <div class="card-item-block">
          <div class="header">
            <div @click="toPage('FarmStatistics', 2)">
              <svg-icon icon-class="data_machine"></svg-icon>
              <label>农机具统计</label>
              <div class="entrance-block">
                <svg-icon icon-class="arrow_right"></svg-icon>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="info-block">
              <label class="chart-title">农机具总量(台)</label>
              <span class="info-amount">{{machineStatisticsObj.totalNumber}}</span>
              <div class="legend-block-wrapper">
                <div class="legend-block">
                  <div class="tag">
                    <i class="tag_icon1"></i>
                    <i class="tag_icon2"></i>
                    <i class="tag_icon3"></i>
                    <i class="tag_icon4"></i>
                    <i class="tag_icon5"></i>
                  </div>
                  <div class="name">
                    <label>耕作机器</label>
                    <label>运输机器</label>
                    <label>加工机器</label>
                    <label>水产养殖机械</label>
                    <label>其他机器</label>
                  </div>
                  <div class="number">
                    <small>{{machineStatisticsObj.plantingMachineryNumber}}</small>
                    <small>{{machineStatisticsObj.transportMachineryNumber}}</small>
                    <small>{{machineStatisticsObj.processMachineryNumber}}</small>
                    <small>{{machineStatisticsObj.aquicultureMachineryNumber}}</small>
                    <small>{{machineStatisticsObj.otherUseMachineryNumber}}</small>
                  </div>
                  <div class="percent">
                    <span>{{machineStatisticsObj.plantingMachineryNumberPercent | getPercent}}</span>
                    <span>{{machineStatisticsObj.transportMachineryNumberPercent | getPercent}}</span>
                    <span>{{machineStatisticsObj.processMachineryNumberPercent | getPercent}}</span>
                    <span>{{machineStatisticsObj.aquicultureMachineryNumberPercent | getPercent}}</span>
                    <span>{{machineStatisticsObj.otherUseMachineryNumberPercent | getPercent}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-block">
              <ve-ring
                width="200px"
                height="200px"
                :legend-visible="false"
                :data="machineChartData"
                :extend="chartExtend"
                :settings="chartSettings">
              </ve-ring>
            </div>
          </div>
        </div>
        <!-- 种植统计 -->
        <div class="card-item-block">
          <div class="header">
            <div @click="toPage('FarmStatistics', 3)">
              <svg-icon icon-class="data_plant"></svg-icon>
              <label>产量统计</label>
              <div class="entrance-block">
                <svg-icon icon-class="arrow_right"></svg-icon>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="info-block">
              <label class="chart-title">总产量(吨)</label>
              <span class="info-amount">{{plantStatisticsObj.totalYield}}</span>
              <div class="legend-block-wrapper">
                <div class="legend-block">
                  <div class="tag">
                    <i class="tag_icon1"></i>
                    <i class="tag_icon2"></i>
                    <i class="tag_icon3"></i>
                    <i class="tag_icon4"></i>
                    <i class="tag_icon5"></i>
                  </div>
                  <div class="name">
                    <label>水稻</label>
                    <label>大豆</label>
                    <label>玉米</label>
                    <label>其他粮食</label>
                    <label>其他作物</label>
                  </div>
                  <div class="number">
                    <small>{{plantStatisticsObj.riceYield}}</small>
                    <small>{{plantStatisticsObj.soyaYield}}</small>
                    <small>{{plantStatisticsObj.cornYield}}</small>
                    <small>{{plantStatisticsObj.otherGrainYield}}</small>
                    <small>{{plantStatisticsObj.otherCropYield}}</small>
                  </div>
                  <div class="percent">
                    <span>{{plantStatisticsObj.riceYieldPercent | getPercent}}</span>
                    <span>{{plantStatisticsObj.soyaYieldPercent | getPercent}}</span>
                    <span>{{plantStatisticsObj.cornYieldPercent | getPercent}}</span>
                    <span>{{plantStatisticsObj.otherGrainYieldPercent | getPercent}}</span>
                    <span>{{plantStatisticsObj.otherCropYieldPercent | getPercent}}</span>
                  </div>
                </div>
                <div class="legend-block">
                  <div class="tag">
                    <i class="tag_icon6"></i>
                    <i class="tag_icon7"></i>
                    <i class="tag_icon8"></i>
                    <i class="tag_icon9"></i>
                  </div>
                  <div class="name">
                    <label>淡水鱼类</label>
                    <label>淡水甲壳类</label>
                    <label>淡水其他</label>
                    <label>其他水产</label>
                  </div>
                  <div class="number">
                    <small>{{plantStatisticsObj.freshWaterFishYield}}</small>
                    <small>{{plantStatisticsObj.freshWaterShellYield}}</small>
                    <small>{{plantStatisticsObj.freshWaterOtherYield}}</small>
                    <small>{{plantStatisticsObj.otherWaterYield}}</small>
                  </div>
                  <div class="percent">
                    <span>{{plantStatisticsObj.freshWaterFishYieldPercent | getPercent}}</span>
                    <span>{{plantStatisticsObj.freshWaterShellYieldPercent | getPercent}}</span>
                    <span>{{plantStatisticsObj.freshWaterOtherYieldPercent | getPercent}}</span>
                    <span>{{plantStatisticsObj.otherWaterYieldPercent | getPercent}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-block">
              <ve-ring
                width="200px"
                height="200px"
                :legend-visible="false"
                :data="plantChartData"
                :extend="chartExtend"
                :settings="chartSettings">
              </ve-ring>
            </div>
          </div>
        </div>
      </div>
      <div class="row-block">
        <!-- 投入品 -->
        <div class="card-item-block">
          <div class="header">
            <div @click="toPage('FarmStatistics', 4)">
              <svg-icon icon-class="data_input"></svg-icon>
              <label>投入品统计</label>
              <div class="entrance-block">
                <svg-icon icon-class="arrow_right"></svg-icon>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="info-block">
              <label class="chart-title">本年度总计(吨)</label>
              <span class="info-amount">{{inputStatisticsObj.totalAmount}}</span>
              <div class="legend-block-wrapper">
                <div class="legend-block">
                  <div class="tag">
                    <i class="tag_icon1"></i>
                    <i class="tag_icon2"></i>
                    <i class="tag_icon3"></i>
                    <i class="tag_icon4"></i>
                    <i class="tag_icon5"></i>
                    <i class="tag_icon6"></i>
                  </div>
                  <div class="name">
                    <label>有机肥</label>
                    <label>无机肥</label>
                    <label>农药</label>
                    <label>饲料</label>
                    <label>鱼药</label>
                    <label>其他</label>
                  </div>
                  <div class="number">
                    <small>{{inputStatisticsObj.organicFertilizerAmount}}</small>
                    <small>{{inputStatisticsObj.inorganicFertilizerAmount}}</small>
                    <small>{{inputStatisticsObj.pesticideAmount}}</small>
                    <small>{{inputStatisticsObj.forageAmount}}</small>
                    <small>{{inputStatisticsObj.fisheryMedicinesAmount}}</small>
                    <small>{{inputStatisticsObj.otherAmount}}</small>
                  </div>
                  <div class="percent">
                    <span>{{inputStatisticsObj.organicFertilizerAmountPercent | getPercent}}</span>
                    <span>{{inputStatisticsObj.inorganicFertilizerAmountPercent | getPercent}}</span>
                    <span>{{inputStatisticsObj.pesticideAmountPercent | getPercent}}</span>
                    <span>{{inputStatisticsObj.forageAmountPercent | getPercent}}</span>
                    <span>{{inputStatisticsObj.fisheryMedicinesAmountPercent | getPercent}}</span>
                    <span>{{inputStatisticsObj.otherAmountPercent | getPercent}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-block">
              <ve-ring
                width="200px"
                height="200px"
                :legend-visible="false"
                :data="inputChartData"
                :extend="chartExtend"
                :settings="chartSettings">
              </ve-ring>
            </div>
          </div>
        </div>
        <!-- 经营统计 -->
        <div class="card-item-block">
          <div class="header">
            <div @click="toPage('FarmStatistics', 5)">
              <svg-icon icon-class="data_operate"></svg-icon>
              <label>经营统计</label>
              <div class="entrance-block">
                <svg-icon icon-class="arrow_right"></svg-icon>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="info-block">
              <label class="chart-title">金额总计(万元)</label>
              <span class="info-amount">{{operateStatisticsObj.totalAmount | toWanYuan}}</span>
              <div class="legend-block-wrapper">
                <div class="legend-block">
                  <div class="tag">
                    <i class="tag_icon1"></i>
                    <i class="tag_icon2"></i>
                    <i class="tag_icon3"></i>
                  </div>
                  <div class="name">
                    <label>政府项目</label>
                    <label>政府补贴</label>
                    <label>农业社会化服务补贴</label>
                  </div>
                  <div class="number">
                    <small>{{operateStatisticsObj.appropriationAmount | toWanYuan}}</small>
                    <small>{{operateStatisticsObj.subsidyAmount | toWanYuan}}</small>
                    <small>{{operateStatisticsObj.revenueAmount | toWanYuan}}</small>
                  </div>
                  <div class="percent">
                    <span>{{operateStatisticsObj.appropriationAmountPercent | getPercent}}</span>
                    <span>{{operateStatisticsObj.subsidyAmountPercent | getPercent}}</span>
                    <span>{{operateStatisticsObj.revenueAmountPercent | getPercent}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-block">
              <ve-ring
                width="200px"
                height="200px"
                :legend-visible="false"
                :data="operateChartData"
                :extend="chartExtend"
                :settings="chartSettings">
              </ve-ring>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 设备统计 -->
    <div class="card-data-block" v-if="currentIndex === 1">
      <!-- 设备种类 -->
      <div class="row-block">
        <div class="card-item-block">
          <div class="header">
            <div @click="toPage('DeviceStatistics', 0)">
              <svg-icon icon-class="data_device"></svg-icon>
              <label>设备种类统计</label>
              <div class="entrance-block">
                <svg-icon icon-class="arrow_right"></svg-icon>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="info-block">
              <label class="chart-title">设备总量(个)</label>
              <span class="info-amount">{{deviceStatisticsObj.totalNumber}}</span>
              <div class="legend-block-wrapper">
                <div class="legend-block">
                  <div class="tag">
                      <i class="tag_icon1"></i>
                      <i class="tag_icon2"></i>
                      <i class="tag_icon3"></i>
                      <i class="tag_icon4"></i>
                  </div>
                  <div class="name">
                    <label>传感器</label>
                    <label>球机摄像头</label>
                    <label>枪机摄像头</label>
                    <label>NVR设备</label>
                  </div>
                  <div class="number">
                    <small>{{deviceStatisticsObj.sensorNumber}}</small>
                    <small>{{deviceStatisticsObj.domeCameraNumber}}</small>
                    <small>{{deviceStatisticsObj.boxCameraNumber}}</small>
                    <small>{{deviceStatisticsObj.nvrNumber}}</small>
                  </div>
                  <div class="percent">
                    <span>{{deviceStatisticsObj.sensorNumberPercent | getPercent}}</span>
                    <span>{{deviceStatisticsObj.domeCameraNumberPercent | getPercent}}</span>
                    <span>{{deviceStatisticsObj.boxCameraNumberPercent | getPercent}}</span>
                    <span>{{deviceStatisticsObj.nvrNumberPercent | getPercent}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-block">
              <ve-ring
                width="200px"
                height="200px"
                :legend-visible="false"
                :data="deviceChartData"
                :extend="chartExtend"
                :settings="chartSettings">
              </ve-ring>
            </div>
          </div>
        </div>
        <!-- 占位位置 -->
        <div class="card-item-block device-item-block">
          <div class="header">
            <div @click="toPage('DeviceStatistics', 0)">
              <svg-icon icon-class="data_device"></svg-icon>
              <label>设备种类统计</label>
              <div class="entrance-block">
                <svg-icon icon-class="arrow_right"></svg-icon>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="info-block">
              <label class="chart-title">设备总量(个)</label>
              <span class="info-amount">{{deviceStatisticsObj.totalNumber}}</span>
              <div class="legend-block">
                <div class="tag">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <div class="name">
                  <label>传感器</label>
                  <label>球机摄像头</label>
                  <label>枪机摄像头</label>
                </div>
                <div class="number">
                  <small>{{deviceStatisticsObj.sensorNumber}}</small>
                  <small>{{deviceStatisticsObj.domeCameraNumber}}</small>
                  <small>{{deviceStatisticsObj.boxCameraNumber}}</small>
                </div>
                <div class="percent">
                  <span>{{deviceStatisticsObj.sensorNumberPercent | getPercent}}</span>
                  <span>{{deviceStatisticsObj.domeCameraNumberPercent | getPercent}}</span>
                  <span>{{deviceStatisticsObj.boxCameraNumberPercent | getPercent}}</span>
                </div>
              </div>
            </div>
            <div class="chart-block">
              <ve-ring
                width="200px"
                height="200px"
                :legend-visible="false"
                :data="deviceChartData"
                :extend="chartExtend"
                :settings="chartSettings">
              </ve-ring>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import label from "@/util/label";
  export default {
    name: 'statistics-display',
    data() {
      // 图表统一设置
      this.chartExtend = {
        color: label.colors,
        series: {
          type: 'pie',
          label: {
            show: false
          },
          radius: [25, '85%'],
          center: ['50%', '50%']
        }
      };
      this.chartSettings = {
        labelMap: {
          type: '类别',
          amount: '数据'
        },
        dimension: ['type'],
        metrics: ['amount']
      };
      return {
        landStatisticsObj: {},
        landChartData: {
          columns: ['type', 'amount'],
          rows: []
        },
        memberStatisticsObj: {},
        memberChartData: {
          columns: ['type', 'amount'],
          rows: []
        },
        machineStatisticsObj: {},
        machineChartData: {
          columns: ['type', 'amount'],
          rows: []
        },
        inputStatisticsObj: {},
        inputChartData: {
          columns: ['type', 'amount'],
          rows: []
        },
        operateStatisticsObj: {},
        operateChartData: {
          columns: ['type', 'amount'],
          rows: []
        },
        deviceStatisticsObj: {},
        deviceChartData: {
          columns: ['type', 'amount'],
          rows: []
        },
        plantingTotal: 0,
        plantStatisticsObj: {},
        plantChartData: {
          columns: ['type', 'amount'],
          rows: []
        },
        currentIndex: 0,
        currentYear: new Date().getFullYear()
      }
    },
    filters: {
      toWanYuan(num) {
        if (!_.isNumber(num)) {
          return '0.00';
        }
        return (num / 10000).toFixed(2);
      },
      getPercent(number) {
        if (number === undefined || number === null || number === 'NaN') {
          return '0.00%';
        }

        function accMul(arg1, arg2) {
          let m = 0, s1 = arg1.toString(),
            s2 = arg2.toString();
          try {
            m += s1.split(".")[1].length
          } catch (e) {
          }
          try {
            m += s2.split(".")[1].length
          } catch (e) {
          }
          return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        }

        return accMul(number, 100).toFixed(2) + '%';
      }
    },
    mounted() {
      this.getFarmStatistics();
      // this.getPlantStatistics();
      this.getStatisticsPlant();
      this.getDeviceStatistics();
    },
    methods: {
      getFarmStatistics() {
        this.$service.getFarmStatistics().then(response => {
          if (response && response.code === 0) {
            // 地块统计
            this.landStatisticsObj = response.data.landStatisticsList[0];
            this.landChartData.rows = [
              {type: '粮食农田', amount: this.landStatisticsObj.farmLandArea},
              {type: '果树林地', amount: this.landStatisticsObj.fruitLandArea},
              {type: '育苗大棚', amount: this.landStatisticsObj.plantGreenhouseArea},
              {type: '仓储建筑', amount: this.landStatisticsObj.warehouseArea},
              {type: '生态观光', amount: this.landStatisticsObj.ecologicalLandArea},
              {type: '河流湖泊', amount: this.landStatisticsObj.riverArea},
              {type: '水库坑塘', amount: this.landStatisticsObj.reservoirArea},
              {type: '蔬菜大棚', amount: this.landStatisticsObj.vegetableGreenhouseArea},
              {type: '沼泽滩涂', amount: this.landStatisticsObj.moorArea},
              {type: '人工鱼塘', amount: this.landStatisticsObj.fishpondArea},
               {type: '宅基地', amount: this.landStatisticsObj.homesteadArea}
            ];
            // 地块统计
            this.memberStatisticsObj = response.data.memberStatisticsList[0];
            this.memberChartData.rows = [
              {type: '经营人员', amount: this.memberStatisticsObj.manageMemberNumber},
              {type: '种植人员', amount: this.memberStatisticsObj.plantMemberNumber}];
            // 农机具
            this.machineStatisticsObj = response.data.machineryStatisticsList[0];
            this.machineChartData.rows = [
              {type: '耕作机器', amount: this.machineStatisticsObj.plantingMachineryNumber},
              {type: '运输机器', amount: this.machineStatisticsObj.transportMachineryNumber},
              {type: '加工机器', amount: this.machineStatisticsObj.processMachineryNumber},
              {type: '水产养殖机械', amount: this.machineStatisticsObj.aquicultureMachineryNumber},
              {type: '其他机器', amount: this.machineStatisticsObj.otherUseMachineryNumber}];
            // 投入品
            this.inputStatisticsObj = response.data.inputStatisticsList[0];
            this.inputChartData.rows = [
              {type: '有机肥', amount: this.inputStatisticsObj.organicFertilizerAmount},
              {type: '无机肥', amount: this.inputStatisticsObj.inorganicFertilizerAmount},
              {type: '农药', amount: this.inputStatisticsObj.pesticideAmount},
              {type: '饲料', amount: this.inputStatisticsObj.forageAmount},
              {type: '鱼药', amount: this.inputStatisticsObj.fisheryMedicinesAmount},
              {type: '其他', amount: this.inputStatisticsObj.otherAmount}];
            // 经营统计
            this.operateStatisticsObj = response.data.operatingStatisticsList[0];
            this.operateChartData.rows = [
              {type: '政府项目', amount: this.operateStatisticsObj.appropriationAmount},
              {type: '政府补贴', amount: this.operateStatisticsObj.subsidyAmount},
              {type: '农业社会化服务补贴', amount: this.operateStatisticsObj.revenueAmount}];
          }
        })
      },
      getDeviceStatistics() {
        this.$service.getDeviceStatistics().then(response => {
          if (response && response.code === 0) {
            // 设备种类统计
            this.deviceStatisticsObj = response.data.deviceStatisticsList[0];
            this.deviceChartData.rows = [
              {type: '传感器', amount: this.deviceStatisticsObj.sensorNumber},
              {type: '球机摄像头', amount: this.deviceStatisticsObj.domeCameraNumber},
              {type: '枪机摄像头', amount: this.deviceStatisticsObj.boxCameraNumber},
              {type: 'NVR设备', amount: this.deviceStatisticsObj.nvrNumber}
            ];
          }
        })
      },
      getStatisticsPlant() {
        this.$service.getStatisticsPlant({farmId: 0, year: this.currentYear})
          .then((res) => {
            if (res && res.code === 0) {
              this.plantStatisticsObj = _.get(res.data, '0');
              this.plantChartData.rows = [
                {type: '水稻', amount: this.plantStatisticsObj.riceYield},
                {type: '大豆', amount: this.plantStatisticsObj.soyaYield},
                {type: '玉米', amount: this.plantStatisticsObj.cornYield},
                {type: '其他粮食', amount: this.plantStatisticsObj.otherGrainYield},
                {type: '其他作物', amount: this.plantStatisticsObj.otherCropYield},
                {type: '淡水鱼类', amount: this.plantStatisticsObj.freshWaterFishYield},
                {type: '淡水甲壳类', amount: this.plantStatisticsObj.freshWaterShellYield},
                {type: '淡水其他', amount: this.plantStatisticsObj.freshWaterOtherYield},
                {type: '其他水产', amount: this.plantStatisticsObj.otherWaterYield}
              ];
            }
          }).catch((err) => {
            console.log(err);
          });
      },
      getPlantStatistics() {
        this.$service.getPlantStatistics().then(response => {
          if (response && response.code === 0) {
            // 种植统计
            let list = response.data[new Date().getFullYear()].reverse();
            this.plantStatisticsList = list;
            this.plantingTotal = 0;
            list.map(item => {
              item.type = item.plantName;
              item.amount = item.area;
              this.plantingTotal = this.plantingTotal + item.area;
            });
            // 去掉'经济林作物'
            this.plantChartData.rows = list;
          }
        })
      },
      toPage(pageName, index) {
        this.$router.push({name: pageName, query: {index: index}});
      }
    }
  }
</script>

<style scoped lang="scss">
  #statistics-container {
  }
  .card-data-block {
    padding-left: 18px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    .row-block {
      display: flex;
      align-items: center;
      flex-direction: row;
      &.empty-placeholder {
        visibility: hidden;
      }
    }
  }

  .card-item-block {
    margin-right: 20px;
    margin-top: 20px;
    flex-grow: 1;
    flex-shrink: 0;
    width: 552px;
    height: 333px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;
    &.device-item-block {
      visibility: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      height: 62px;
      border-bottom: 1px solid rgba(62, 73, 94, 1);
      > div {
        display: flex;
        align-items: center;
        &:hover {
          .svg-icon {
            animation: 1s entranceSlideRight;
            fill: white;
          }
        }
      }
      label {
        font-size: 16px;
        font-weight: 500;
        color: rgba(240, 240, 240, 1);
        cursor: pointer;
      }
      div {
        cursor: pointer;
      }
      .entrance-block {
        cursor: pointer;
        .svg-icon {
          position: relative;
        }
      }
      .svg-icon {
        &:first-child {
          margin: 0 20px;
          width: 19px;
          height: 19px;
        }
        &.svg-icon-arrow_right {
          margin-left: 10px;
          width: 12px;
          height: 13px;
        }
      }
    }
    .content {
      display: flex;
      justify-content: space-between;
      padding: 30px 30px 0 60px;
      .chart-block {
        height: 200px;
        width: 200px;
      }
      .info-block {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        flex-grow: 0;
        width: 274px;
        .chart-title {
          font-size: 16px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
        }
        .info-amount {
          margin-top: 5px;
          margin-bottom: 8px;
          font-size: 38px;
          font-weight: 400;
          color: rgba(138, 185, 232, 1);
        }
        .legend-block-wrapper {
          display: flex;
          .legend-block {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            margin-right: 20px;
            div.tag {
              margin-right: 4px;
              display: flex;
              align-items: left;
              flex-direction: column;

            }
            div.name {
              margin-right: 20px;
              display: flex;
              align-items: left;
              flex-direction: column;
              label {
                margin-bottom: 2px;
                min-width: 66px;
                height: 17px;
                font-size: 12px;
                font-weight: 400;
                color: rgba(102, 119, 153, 1);
              }
            }
            div.number {
              margin-right: 20px;
              display: flex;
              align-items: left;
              flex-direction: column;
              small {
                margin-bottom: 2px;
                min-width: 33px;
                font-size: 12px;
                font-weight: 400;
                color: rgba(102, 119, 153, 1);
              }
            }
            div.percent {
              display: flex;
              align-items: left;
              flex-direction: column;
              span {
                margin-bottom: 2px;
                min-width: 33px;
                font-size: 12px;
                font-weight: 400;
                color: rgba(102, 119, 153, 1);
              }
            }
          }
          i {
            margin: 3px 6px 7px 0;
            width: 9px;
            height: 9px;
            &.tag_icon1 {
              background: #297CEB;
            }
            &.tag_icon2 {
              background: #7C82FB;
            }
            &.tag_icon3 {
              background: #71CACF;
            }
            &.tag_icon4 {
              background: #23A6F5;
            }
            &.tag_icon5 {
              background: #98BD72;
            }
            &.tag_icon6 {
              background: #E2CA7F;
            }
            &.tag_icon7 {
              background: #2FD2DB;
            }
            &.tag_icon8 {
              background: #E9C366;
            }
            &.tag_icon9 {
              background: #D9647E;
            }
            &.tag_icon10 {
              background: #DF7C57;
            }
            &.tag_icon11 {
              background: #884CDE;
            }
            &.tag_icon12 {
              background: #8B0000;
            }
            &.tag_icon13 {
              background: #C08EF2;
            }
            &.tag_icon14 {
              background: #69D073;
            }
          }
        }
      }
    }
  }

  #tab-list-block {
    padding-left: 18px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: rgba(15, 22, 35, 1);
    label {
      margin-right: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 110px;
      height: 40px;
      background: rgba(42, 57, 78, 1);
      border-radius: 4px;
      font-size: 18px;
      font-weight: 400;
      color: rgba(159, 168, 184, 1);
      cursor: pointer;
      &:hover {
        color: #FFFFFF;
        background: #2A394E;
      }
      &.active {
        background: rgba(15, 112, 243, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  @keyframes entranceSlideRight {
    0% {
      right: 0;
    }
    50% {
      right: -4px;
    }
    100% {
      right: 0;
    }
  }

</style>
