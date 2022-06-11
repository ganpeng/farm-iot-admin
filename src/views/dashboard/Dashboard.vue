<template>
  <div class="home-container my-content-container">
    <div class="top-field">
      <div class="my-bord-status-two">
        <div class="status-item">
          <div class="left">
            <div class="line"></div>
            <div class="item_con">
              <p class="name-one">企业总数(个)</p>
            </div>
          </div>
          <div class="count">{{farmData.totalFarmNum}}</div>
          <div class="status-item-cion">
            <svg-icon icon-class="dashbord_bord_icon1"></svg-icon>
          </div>
        </div>
        <div class="status-item">
          <div class="left">
            <div class="line"></div>
            <div class="item_con">
              <p class="name-one">设备总数(个)</p>
            </div>
          </div>
          <div class="count">{{deviceData.totalNumber}}</div>
          <div class="status-item-cion">
            <svg-icon icon-class="dashbord_bord_icon2"></svg-icon>
          </div>
        </div>
        <div class="status-item">
          <div class="left">
            <div class="line"></div>
            <div class="item_con">
              <p class="name-one">销售总额(万元)</p>
            </div>
          </div>
          <div class="count">110</div>
          <div class="status-item-cion">
            <svg-icon icon-class="dashbord_bord_icon3"></svg-icon>
          </div>
        </div>
        <div class="status-item">
          <div class="left">
            <div class="line"></div>
            <div class="item_con">
              <p class="name-one">基站总数(个)</p>
            </div>
          </div>
          <div class="count">24</div>
          <div class="status-item-cion">
            <svg-icon icon-class="dashbord_bord_icon4"></svg-icon>
          </div>
        </div>
        <div class="status-item">
          <div class="left">
            <div class="line"></div>
            <div class="item_con">
              <p class="name-one">运输车辆(辆)</p>
            </div>
          </div>
          <div class="count">24</div>
          <div class="status-item-cion">
            <svg-icon icon-class="dashbord_bord_icon5"></svg-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="middle-field">
      <div class="header">
        <div @click="gotoPage(6)" class="header-left">
          <svg-icon class-name="svg-one" icon-class="home_icon5"/>
          <span class="title">预警趋势</span>
          <svg-icon class-name="arrow" icon-class="home_icon8"/>
        </div>
        <div class="header-right">
          <ul class="time-list">
            <li
              @click="changeTime(index)"
              v-for="(item, index) in times"
              :key="index"
              :class="['time-item', item.active && 'active']"
            >{{item.title}}</li>
          </ul>
        </div>
      </div>
      <div class="middle-content">
        <ve-line height="280px" :legend-visible="false" :extend="chartExtend" :data="lineData"></ve-line>
        <ul class="legen-list">
          <li class="legen-item">
            <span class="icon"></span>
            <span class="text">传感器数据预警</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom-field">
      <div class="bottom-left bottom-item">
        <div @click="gotoPage(1)" class="header">
          <!-- <svg-icon class-name="svg-one home-icon1" icon-class="home_icon6"/> -->
          <div class="svg-icon home-icon1 dashbord-icon1"></div>
          <span class="title">企业管理</span>
          <svg-icon class-name="arrow" icon-class="home_icon8"/>
        </div>
        <div class="bottom-left-content bottom-item-content">
          <div class="title-field">
            <p class="title">
              企业总数
              <i>(个)</i>
            </p>
            <p class="count">{{farmData.totalFarmNum}}</p>
          </div>
          <div class="legen-field">
            <ul class="legen-list legen-list-one">
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">农民专业合作社</span>
                <span class="text2">{{farmData.cooperativeFarmNum}}</span>
                <span
                  class="text3"
                >{{percent(farmData.cooperativeFarmNum / farmData.totalFarmNum)}}%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">国有企业</span>
                <span class="text2">{{farmData.nationalFarmNum}}</span>
                <span class="text3">{{percent(farmData.nationalFarmNum / farmData.totalFarmNum)}}%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">个体企业</span>
                <span class="text2">{{farmData.personalFarmNum}}</span>
                <span class="text3">{{percent(farmData.personalFarmNum / farmData.totalFarmNum)}}%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">其他</span>
                <span class="text2">{{farmData.otherFarmNum}}</span>
                <span class="text3">{{percent(farmData.otherFarmNum / farmData.totalFarmNum)}}%</span>
              </li>
            </ul>
          </div>
          <div class="echarts-field">
            <ve-pie
              width="260px"
              height="260px"
              :legend-visible="false"
              :settings="chartSettings"
              :extend="peiExtend"
              :data="farmChartData"
            ></ve-pie>
          </div>
        </div>
      </div>
      <div class="bottom-right bottom-item">
        <div @click="gotoPage(2)" class="header">
          <div class="svg-icon home-icon2 dashbord-icon2"></div>
          <!-- <svg-icon class-name="svg-one home-icon2" icon-class="home_icon7"/> -->
          <span class="title">设备管理</span>
          <svg-icon class-name="arrow" icon-class="home_icon8"/>
        </div>
        <div class="bottom-right-content bottom-item-content">
          <div class="title-field">
            <p class="title">
              设备总数
              <i>(个)</i>
            </p>
            <p class="count">{{deviceData.totalNumber}}</p>
          </div>
          <div class="legen-field">
            <ul class="legen-list legen-list-two">
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">传感器</span>
                <span class="text2">{{deviceData.sensorNumber}}</span>
                <span class="text3">{{percent(deviceData.sensorNumberPercent)}}%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">球机摄像头</span>
                <span class="text2">{{deviceData.domeCameraNumber}}</span>
                <span class="text3">{{percent(deviceData.domeCameraNumberPercent)}}%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">枪机摄像头</span>
                <span class="text2">{{deviceData.boxCameraNumber}}</span>
                <span class="text3">{{percent(deviceData.boxCameraNumberPercent)}}%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">NVR</span>
                <span class="text2">{{deviceData.nvrNumber}}</span>
                <span class="text3">{{percent(deviceData.nvrNumberPercent)}}%</span>
              </li>
            </ul>
          </div>
          <div class="echarts-field">
            <ve-pie
              width="260px"
              height="260px"
              :legend-visible="false"
              :settings="chartSettings"
              :extend="peiExtend"
              :data="deviceChartData"
            ></ve-pie>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-field">
      <div class="bottom-left bottom-item">
        <div @click="gotoPage(3)" class="header">
          <div class="svg-icon home-icon3 dashbord-icon3"></div>
          <!-- <svg-icon class-name="svg-one home-icon3" icon-class="home_icon11"/> -->
          <span class="title">销售管理</span>
          <svg-icon class-name="arrow" icon-class="home_icon8"/>
        </div>
        <div class="bottom-left-content bottom-item-content">
          <div class="title-field">
            <p class="title">
              销售总额
              <i>(万元)</i>
            </p>
            <p class="count">34224</p>
          </div>
          <div class="legen-field">
            <ul class="legen-list legen-list-three">
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">自营电商</span>
                <span class="text2">4</span>
                <span class="text3">17%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">合作电商</span>
                <span class="text2">19</span>
                <span class="text3">79%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">线下渠道</span>
                <span class="text2">1</span>
                <span class="text3">4%</span>
              </li>
            </ul>
          </div>
          <div class="echarts-field">
            <ve-pie
              width="260px"
              height="260px"
              :legend-visible="false"
              :settings="chartSettings"
              :extend="peiExtend"
              :data="chartData6"
            ></ve-pie>
          </div>
        </div>
      </div>
      <div class="bottom-right bottom-item">
        <div @click="gotoPage(4)" class="header">
          <!-- <svg-icon class-name="svg-one home-icon4" icon-class="home_icon10"/> -->
          <div class="svg-icon home-icon4 dashbord-icon4"></div>
          <span class="title">5G网络</span>
          <svg-icon class-name="arrow" icon-class="home_icon8"/>
        </div>
        <div class="bottom-right-content bottom-item-content">
          <div class="title-field">
            <p class="title">
              基站总数
              <i>(个)</i>
            </p>
            <p class="count">24</p>
          </div>
          <div class="legen-field">
            <ul class="legen-list">
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">宏基站</span>
                <span class="text2">4</span>
                <span class="text3">17%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">微基站</span>
                <span class="text2">20</span>
                <span class="text3">83%</span>
              </li>
            </ul>
          </div>
          <div class="echarts-field">
            <ve-pie
              width="260px"
              height="260px"
              :legend-visible="false"
              :settings="chartSettings"
              :extend="peiExtend"
              :data="chartData4"
            ></ve-pie>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-field">
      <div class="bottom-left bottom-item">
        <div @click="gotoPage(5)" class="header">
          <div class="svg-icon home-icon5 dashbord-icon5"></div>
          <!-- <svg-icon class-name="svg-one home-icon5" icon-class="home_icon12"/> -->
          <span class="title">仓储物流</span>
          <svg-icon class-name="arrow" icon-class="home_icon8"/>
        </div>
        <div class="bottom-left-content bottom-item-content">
          <div class="title-field">
            <p class="title">
              车辆总数
              <i>(辆)</i>
            </p>
            <p class="count">600</p>
          </div>
          <div class="legen-field">
            <ul class="legen-list">
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">小型卡车</span>
                <span class="text2">100</span>
                <span class="text3">15%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">中型卡车</span>
                <span class="text2">100</span>
                <span class="text3">15%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">重型卡车</span>
                <span class="text2">50</span>
                <span class="text3">10%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">厢式货车</span>
                <span class="text2">200</span>
                <span class="text3">31%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">电动三轮车</span>
                <span class="text2">150</span>
                <span class="text3">29%</span>
              </li>
            </ul>
          </div>
          <div class="echarts-field">
            <ve-pie
              width="260px"
              height="260px"
              :legend-visible="false"
              :settings="chartSettings"
              :extend="peiExtend"
              :data="chartData5"
            ></ve-pie>
          </div>
        </div>
      </div>
      <div class="bottom-right bottom-item">
        <div @click="gotoPage(6)" class="header">
          <div class="svg-icon home-icon6 dashbord-icon6"></div>
          <!-- <svg-icon class-name="svg-one home-icon6" icon-class="home_icon13"/> -->
          <span class="title">数据洞察</span>
          <svg-icon class-name="arrow" icon-class="home_icon8"/>
        </div>
        <div class="bottom-right-content bottom-item-content">
          <div class="title-field">
            <p class="title">
              当日预警
              <i>(个)</i>
            </p>
            <p class="count">{{warnData.total}}</p>
          </div>
          <div class="legen-field">
            <ul class="legen-list">
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">设备预警</span>
                <span class="text2">{{warnData.deviceErrorTotal}}</span>
                <span class="text3">{{percent(warnData.deviceErrorTotal / warnDataTotal)}}%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">模型预警</span>
                <span class="text2">{{warnData.modelWarnTotal}}</span>
                <span class="text3">{{percent(warnData.modelWarnTotal / warnDataTotal)}}%</span>
              </li>
              <!--
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">气象播报</span>
                <span class="text2">{{noticeData.warningNums}}</span>
                <span class="text3">{{percent(noticeData.warningNums / warnDataTotal)}}%</span>
              </li>
              <li class="legen-item">
                <span class="icon"></span>
                <span class="text1">平台公告</span>
                <span class="text2">{{noticeData.noticeNums}}</span>
                <span class="text3">{{percent(noticeData.noticeNums / warnDataTotal)}}%</span>
              </li>
              -->
            </ul>
          </div>
          <div class="echarts-field">
            <ve-pie
              width="260px"
              height="260px"
              :legend-visible="false"
              :settings="chartSettings"
              :extend="peiExtend"
              :data="warnChartData"
            ></ve-pie>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="name">吉林省智慧农业管理系统</p>
      <p class="copyright">2020 © 吉林省智慧农业管理系统 版权所有</p>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  name: "Dashboard",
  data() {
    this.chartSettings = {
      label: {
        show: false
      },
      labelLine: {
        show: false
      }
    };
    this.peiExtend = {
      color: ["#73C5D2", "#17A0D2", "#1A86DE", "#0062C4", "#68B8FD"],
      "series.0.center": ["50%", "50%"],
      "series.0.radius": ["0", "80%"]
    };
    this.chartExtend = {
      color: ["#DD5567", "#FCB268", "#E3C97B", "#85B8FC", "#B8E986", "#BA69CB"],
      grid: {
        top: 40,
        bottom: 12
      },
      series: {
        type: "line"
      },
      "xAxis.0.axisLabel": { color: "#667799" },
      "yAxis.0.axisLabel": { color: "#667799" },
      "yAxis.0.splitLine": {
        lineStyle: {
          color: "#3E495E"
        }
      }
    };
    return {
      farmData: {},
      deviceData: {},
      lineData: {},
      farmChartData: {},
      deviceChartData: {},
      warnData: {},
      warnChartData: {},
      noticeData: {},
      warnDataTotal: 1,
      chartData4: {
        columns: ["类型", "值"],
        rows: [{ 类型: "宏基站", 值: 4 }, { 类型: "微基站", 值: 20 }]
      },
      chartData5: {
        columns: ["类型", "值"],
        rows: [
          { 类型: "小型卡车", 值: 100 },
          { 类型: "中型卡车", 值: 100 },
          { 类型: "重型卡车", 值: 50 },
          { 类型: "厢式货车", 值: 200 },
          { 类型: "电动三轮车", 值: 150 }
        ]
      },
      chartData6: {
        columns: ["类型", "值"],
        rows: [
          { 类型: "自营电商", 值: 4 },
          { 类型: "合作电商", 值: 19 },
          { 类型: "线下渠道", 值: 1 }
        ]
      },
      times: [
        {
          title: "24小时",
          active: true
        },
        {
          title: "近7天",
          active: false
        },
        {
          title: "近15天",
          active: false
        }
      ]
    };
  },
  async created() {
    try {
      await this.$nextTick();
      let year = new Date().getFullYear();
      this.lineData = await this.generatorWarnStatisticsByDays(1);
      let res = await this.$service.getDeviceStatistics({ farmId: 0, year });
      let res2 = await this.$service.getFarmCount();
      let res3 = await this.$service.getWarnStatistics({ days: 1 });
      let res4 = await this.$service.getNoticeStatistics();

      if (res && res.code === 0) {
        this.deviceData = _.get(res.data, "deviceStatisticsList.0");
        this.deviceChartData = {
          columns: ["类型", "值"],
          rows: [
            { 类型: "传感器", 值: _.get(this.deviceData, "sensorNumber") },
            {
              类型: "球机摄像头",
              值: _.get(this.deviceData, "domeCameraNumber")
            },
            {
              类型: "枪机摄像头",
              值: _.get(this.deviceData, "boxCameraNumber")
            },
            {
              类型: "NVR",
              值: _.get(this.deviceData, "nvrNumber")
            }
          ]
        };
      }
      if (res2 && res2.code === 0) {
        this.farmData = _.get(res2.data, "0");
        this.farmChartData = {
          columns: ["类型", "数值"],
          rows: [
            {
              类型: "农民专业合作社",
              数值: _.get(this.farmData, "cooperativeFarmNum")
            },
            { 类型: "国有企业", 数值: _.get(this.farmData, "nationalFarmNum") },
            { 类型: "个体企业", 数值: _.get(this.farmData, "personalFarmNum") },
            { 类型: "其他", 数值: _.get(this.farmData, "otherFarmNum") }
          ]
        };
      }
      if (res3 && res3.code === 0 && res4 && res4.code === 0) {
        this.warnData = res3.data;
        this.noticeData = res4.data;
        this.warnDataTotal = (_.get(this.warnData, 'total') || 0) + (_.get(this.noticeData, 'totalNums') || 0);
        this.warnChartData = {
          columns: ["类型", "数值"],
          rows: [
            {
              类型: "设备预警",
              数值: _.get(this.warnData, "deviceErrorTotal")
            },
            { 类型: "模型预警",
              数值: _.get(this.warnData, "modelWarnTotal")
            }
            // { 类型: "气象播报",
            //   数值: _.get(this.noticeData, "warningNums")
            // },
            // { 类型: "平台公告",
            //   数值: _.get(this.noticeData, "noticeNums")
            // }
          ]
        };
      }
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    percent() {
      return value => {
        if (!value) {
          return 0;
        } else {
          return (value * 100).toFixed(2);
        }
      };
    }
  },
  methods: {
    getDate(AddDayCount) {
      let dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      m = m <= 9 ? "0" + m : m;
      d = d <= 9 ? "0" + d : d;
      return y + "/" + m + "/" + d;
    },
    get7DaysNearByToday() {
      let dateList = [];
      for (let i = 0; i < 7; i++) {
        dateList.push(this.getDate(0 - i));
      }
      return _.reverse(dateList);
    },
    get15DaysNearByToday() {
      let dateList = [];
      for (let i = 0; i < 15; i++) {
        dateList.push(this.getDate(0 - i));
      }
      return _.reverse(dateList);
    },
    get24HoursByToday() {
      let dateList = [];
      for (let i = 0; i < 12; i++) {
        let date = "";
        if (i * 2 < 9) {
          date += "0" + i * 2 + ":00";
        } else {
          date += "" + i * 2 + ":00";
        }
        dateList.push(date);
      }
      return dateList;
    },
    randomFrom(lowerValue, upperValue) {
      return Math.floor(
        Math.random() * (upperValue - lowerValue + 1) + lowerValue
      );
    },
    async changeTime(index) {
      try {
        this.times = this.times.map((item, _index) => {
          if (index === _index) {
            item.active = true;
          } else {
            item.active = false;
          }
          return item;
        });
        if (index === 0) {
          this.lineData = await this.generatorWarnStatisticsByDays(1);
        } else if (index === 1) {
          this.lineData = await this.generatorWarnStatisticsByDays(7);
        } else {
          this.lineData = await this.generatorWarnStatisticsByDays(15);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async generatorWarnStatisticsByDays(days) {
      try {
        let res = await this.$service.getWarnStatisticsByDays(days);
        if (res && res.code === 0) {
          let rows = res.data.map(item => {
            let key = _.get(_.keys(item), "0");
            let value = _.get(_.values(item), "0");
            return {
              date: key,
              模型预警: value
            };
          });
          let chartData = {
            columns: ["date", "模型预警"],
            rows
          };
          return chartData;
        }
      } catch (err) {
        console.log(err);
      }
    },
    gotoPage(index) {
      let routeName = "";
      switch (index) {
        case 1:
          routeName = "FarmList";
          break;
        case 2:
          routeName = "SensorList";
          break;
        case 3:
          routeName = "";
          break;
        case 4:
          routeName = "";
          break;
        case 5:
          routeName = "";
          break;
        case 6:
          routeName = "WarningList";
          break;
      }
      if (routeName) {
        this.$router.push({ name: routeName });
      } else {
        this.$message.error("努力建设中，敬请期待");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  .top-field {
    height: 80px;
    .my-bord-status-two {
      display: flex;
      width: 100%;
      .status-item + .status-item {
        margin-left: 10px;
      }
      .status-item {
        position: relative;
        background-color: #202c41;
        flex: 1;
        height: 80px;
        padding: 20px;
        border-radius: 10px;
        overflow: hidden;
        color: #bdbec2;
        &.total {
          background-position: 100% 100%;
          background-size: 78px 78px;
        }
        .left {
          display: flex;
        }
        .line {
          width: 2px;
          height: 20px;
          background-color: #f86549;
        }
        .status-item-cion {
          position: absolute;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          // bottom: 10px;
        }
        &:nth-of-type(1) {
          .svg-icon {
            width: 75px;
            height: 60px;
          }
        }
        &:nth-of-type(2) {
          .svg-icon {
            width: 69px;
            height: 54px;
          }
        }
        &:nth-of-type(3) {
          .svg-icon {
            width: 67px;
            height: 61px;
          }
        }
        &:nth-of-type(4) {
          .svg-icon {
            width: 51px;
            height: 66px;
          }
        }
        &:nth-of-type(5) {
          .svg-icon {
            width: 69px;
            height: 49px;
          }
        }
        .item_con {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          margin-left: 10px;
          .name-one {
            font-size: 16px;
            line-height: 16px;
            color: rgba(99, 116, 151, 1);
          }
          .name-two {
            font-size: 16px;
            line-height: 16px;
            color: rgba(57, 65, 84, 1);
          }
        }
        .count {
          position: absolute;
          right: 10px;
          bottom: 10px;
          font-size: 32px;
          font-weight: 400;
          color: #8ab9e8;
          z-index: 10;
        }
      }
    }
  }
  .middle-field {
    position: relative;
    background-color: #202c41;
    height: 352px;
    border-radius: 10px;
    margin-top: 20px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 20px;
      border-bottom: 1px solid #3a4763;
      cursor: pointer;
      .header-left {
        display: flex;
        align-items: center;
        .svg-one {
          width: 19px;
          height: 20px;
        }
        .title {
          color: #f0f0f0;
          font-size: 16px;
          margin: 0 10px 0 18px;
        }
        .arrow {
          position: relative;
          width: 11px;
          height: 12px;
        }
        &:hover {
          .arrow {
            animation: 1s entranceSlideRight;
          }
        }
      }
      .header-right {
        .time-list {
          display: flex;
          border-radius: 4px;
          .time-item {
            width: 60px;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            color: #9fa8b8;
            text-align: center;
            border: 1px solid #3e495e;
            cursor: pointer;
            &.active {
              color: #2eabff;
              border-color: #2eabff;
            }
          }
          .time-item:first-child {
            border-radius: 4px 0px 0px 4px;
          }
          .time-item:last-child {
            border-radius: 0px 4px 4px 0px;
          }
        }
      }
    }
    .middle-content {
      position: relative;
      padding: 0 230px 0 80px;
    }
    .legen-list {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: absolute;
      top: 60px;
      right: 32px;
      .legen-item {
        display: flex;
        align-items: center;
        .icon {
          width: 10px;
          height: 10px;
          margin-right: 10px;
        }
        .text {
          font-size: 12px;
          color: #667799;
        }
        &:nth-of-type(1) {
          .icon {
            background-color: #dd5567;
          }
        }
        &:nth-of-type(2) {
          .icon {
            background-color: #fcb268;
          }
        }
        &:nth-of-type(3) {
          .icon {
            background-color: #e3c97b;
          }
        }
        &:nth-of-type(4) {
          .icon {
            background-color: #85b8fc;
          }
        }
        &:nth-of-type(5) {
          .icon {
            background-color: #b8e986;
          }
        }
        &:nth-of-type(6) {
          .icon {
            background-color: #ba69cb;
          }
        }
      }
    }
  }
  .bottom-field {
    display: flex;
    height: 332px;
    margin-top: 20px;
    .bottom-left {
      margin-right: 20px;
    }
    .bottom-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      border-radius: 10px;
      background-color: #202c41;
      .header {
        display: flex;
        align-items: center;
        height: 48px;
        padding: 0 20px;
        border-bottom: 1px solid #3a4763;
        cursor: pointer;
        .svg-one {
          width: 32px;
          height: 32px;
        }
        .title {
          color: #f0f0f0;
          font-size: 16px;
          margin: 0 10px 0 18px;
        }
        .arrow {
          position: relative;
          width: 11px;
          height: 12px;
        }
        &:hover {
          .arrow {
            animation: 1s entranceSlideRight;
          }
        }
      }

      .bottom-item-content {
        position: relative;
        flex: 1;
        height: 282px;
        .title-field {
          margin-left: 60px;
          margin-top: 40px;
          .title {
            font-size: 16px;
            color: #9fa8b8;
          }
          .count {
            font-size: 38px;
            color: #8ab9e8;
            i {
              font-size: 16px;
            }
          }
        }
        .legen-field {
          margin-left: 60px;
          margin-top: 20px;
          .legen-list {
            display: flex;
            flex-direction: column;
            .legen-item {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #667799;
              .text1 {
                margin-left: 10px;
              }
              .text2 {
                margin: 0 10px 0 10px;
              }
              .icon {
                width: 9px;
                height: 9px;
              }
              &:nth-of-type(1) {
                .icon {
                  background-color: #73c5d2;
                }
              }
              &:nth-of-type(2) {
                .icon {
                  background-color: #17a0d2;
                }
              }
              &:nth-of-type(3) {
                .icon {
                  background-color: #1a86de;
                }
              }
              &:nth-of-type(4) {
                .icon {
                  background-color: #0062c4;
                }
              }
              &:nth-of-type(5) {
                .icon {
                  background-color: #68b8fd;
                }
              }
            }
            &.legen-list-one {
              .legen-item {
                .text1 {
                  width: 86px;
                }
                .text2 {
                  width: 20px;
                }
              }
            }
            &.legen-list-three {
              .text2 {
                width: 20px;
              }
            }
          }
        }
        .echarts-field {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          right: 60px;
          top: 80px;
          width: 140px;
          height: 140px;
        }
        &.bottom-right-content {
          .legen-list {
            .legen-item {
              &:nth-of-type(1) {
                .icon {
                  background-color: #73c5d2;
                }
              }
              &:nth-of-type(2) {
                .icon {
                  background-color: #17a0d2;
                }
              }
              &:nth-of-type(3) {
                .icon {
                  background-color: #1a86de;
                }
              }
              &:nth-of-type(4) {
                .icon {
                  background-color: #0062c4;
                }
              }
              &:nth-of-type(5) {
                .icon {
                  background-color: #68b8fd;
                }
              }
              .text1 {
                width: 66px;
              }
              .text2 {
                width: 30px;
              }
            }
          }
        }
      }
    }
    .header {
      .svg-icon {
        &.home-icon1 {
          width: 25px;
          height: 20px;
        }
        &.home-icon2 {
          width: 23px;
          height: 18px;
        }
        &.home-icon3 {
          width: 23px;
          height: 21px;
        }
        &.home-icon4 {
          width: 17px;
          height: 22px;
        }
        &.home-icon5 {
          width: 23px;
          height: 17px;
        }
        &.home-icon6 {
          width: 24px;
          height: 19px;
        }
      }
    }
  }
  .footer {
    height: 106px;
    border-top: 1px solid #252d3f;
    margin-top: 20px;
    padding-top: 12px;
    text-align: right;
    .name {
      font-size: 18;
      color: rgba(62, 73, 94, 1);
      line-height: 24px;
    }
    .copyright {
      font-size: 12px;
      line-height: 16px;
      color: rgba(62, 73, 94, 1);
    }
  }

  /****
    首页的icon
  ****/
  .dashbord-icon1 {
    background-image: url("../../assets/img/dashbord-icon1.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .dashbord-icon2 {
    background-image: url("../../assets/img/dashbord-icon2.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .dashbord-icon3 {
    background-image: url("../../assets/img/dashbord-icon3.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .dashbord-icon4 {
    background-image: url("../../assets/img/dashbord-icon4.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .dashbord-icon5 {
    background-image: url("../../assets/img/dashbord-icon5.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .dashbord-icon6 {
    background-image: url("../../assets/img/dashbord-icon6.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
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
