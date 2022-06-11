<template>
    <div class="plant-manage-container">
      <div class="view_tab">
        <div @click="currentIndex = 0" class="ri_li" :class="{'ri_li-a' : currentIndex == 0}"></div>
        <div @click="currentIndex = 1" class="tu_biao" :class="{'tu_biao-a' : currentIndex == 1}"></div>
      </div>
      <div v-if="currentIndex === 0">
      <div class="my-search-field">
        <div class="field-row">
          <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              :value="searchField.landName"
              placeholder="地块名称"
              @input="inputHandler($event, 'landName')"
            >
            </el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
          <!--
          <div class="search-field-item">
            <label class="search-field-item-label">作物类型</label>
            <el-select
              :value="searchField.plantType"
              filterable
              clearable
              placeholder="全部"
              @input="inputHandler($event, 'plantType')"
            >
              <el-option
                v-for="(item, index) in plantTypeOptions"
                :key="index"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">作物</label>
            <el-select
              :value="searchField.plantName"
              filterable
              clearable
              placeholder="全部"
              @input="inputHandler($event, 'plantName')"
            >
              <el-option
                v-for="(item, index) in plantNameOptions"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          -->
          <div @click="clearSearchField" style="margin-left: 20px;" class="clear-btn">
            <span class="reset-icon">
              <svg-icon class="reset-btn" icon-class="reset_btn"/>
              <svg-icon class="reset-btn-active" icon-class="reset_btn_active"/>
            </span>
              重置
          </div>
          </div>
          <div class="row-right">
          </div>
        </div>
      </div>
      <div class="tabel-field">
        <el-table
          header-row-class-name="common-table-header"
          size="small"
          :row-class-name="tableRowClassName"
          class="my-table-style"
          :data="list.data"
        >
          <el-table-column min-width="100px" label="地块名称">
            <template slot-scope="scope">
              <span @click="showDetailHandler(scope.row)" class="ellipsis two name detail-name">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="280px" label="地址">
            <template slot-scope="scope">{{scope.row.address}}</template>
          </el-table-column>
          <el-table-column min-width="100px" label="地块形式">
            <template slot-scope="scope">{{scope.row.form}}</template>
          </el-table-column>
          <el-table-column min-width="100px" label="水利条件">
            <template slot-scope="scope">{{scope.row.irrigation}}</template>
          </el-table-column>
          <!--
          <el-table-column min-width="100px" label="种植作物">
            <template slot-scope="scope">
              {{scope.row.plant ? scope.row.plant.p1PlantName : ''}}
            </template>
          </el-table-column>
          <el-table-column min-width="100px" label="种植品种">
            <template slot-scope="scope">
              {{scope.row.plant ? scope.row.plant.p1SeedName : ''}}
            </template>
          </el-table-column>
          -->
          <el-table-column min-width="120px" label="地块编码">
            <template slot-scope="scope">{{scope.row.code}}</template>
          </el-table-column>
          <el-table-column min-width="120px" label="面积(公顷)">
            <template slot-scope="scope">{{scope.row.area}}</template>
          </el-table-column>
          <el-table-column width="140px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="gotoPlantingRecordHandler(scope.row)">种植记录</span>
                <span class="btn-text text-danger" @click="getPlantHistoryHandler(scope.row)">历年记录</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handlePaginationChange($event, 'pageSize')"
        @current-change="handlePaginationChange($event, 'pageNum')"
        :current-page="list.pagination.pageNum"
        :page-sizes="[10, 30, 50,100, 200, 500]"
        :page-size="list.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.pagination.total"
      ></el-pagination>
      </div>
      <div v-if="currentIndex === 1" class="calendar">
        <div class="title">
          <div v-for="(item, index) in titleList" :key="index">
            <div v-if="item.type === 'land'" class="farm_title" :title="item.title">{{item.title}}</div>
            <div v-if="item.type === 'cycle'" class="plant_title" :title="item.title">{{item.title}}</div>
            <div v-if="item.type === 'stage'" class="detail_content"></div>
          </div>
        </div>
        <!-- charts_box规定一个固定宽度 其它的都按照这个宽度来定百分比 -->
        <div class="charts_box">
        <div class="flex_box" :style="{width: boxWidth + 'px'}">
          <!-- 月份展示 -->
          <div class="year_mounth">
            <div v-for="n in 12" :key="n">{{`${n}月`}}</div>
          </div>
          <!-- 时间刻度 -->
          <div class="time_line">
            <div v-for="n in 12" :key="n"></div>
          </div>
          <!-- 内容区 -->
          <div class="content">
            <!-- 一条数据 还要分类型处理 整个周期 以及 阶段周期 -->
            <div class="plant_cycle"  v-for="(timeItem, index) in timeList" :key="index">
              <div v-if="timeItem.type === 'land'"></div>
              <template v-if="timeItem.type === 'cycle'">
                <div v-for="(stageItem, index) in timeItem.list" :key="index" :class="['stage' + (index + 1) % 10]" :style="{left: stageItem.left, width: stageItem.width}">
                  {{stageItem.title}}
                </div>
              </template>
              <!-- 一条数据中的详细信息 -->
              <template v-if="timeItem.type === 'stage'">
                <div v-for="(stageItem, index) in timeItem.list" :key="index" @click="showDetail(stageItem)" class="show_detail" :class="['stage' + (stageItem.colorIndex) % 10]" :style="{left: stageItem.left, width: stageItem.width}">
                </div>
              </template>
            </div>
          </div>

        </div>
        </div>
      </div>
      <div class="zoom_area" v-if="currentIndex === 1">
        <div class="btn" :class="{'no_small': zoomNumber === 100, 'small_btn' : zoomNumber > 100}" @click="chartsZoom(0)"></div>
        <div class="zoom_number">{{zoomNumber}}%</div>
        <div class="btn" :class="{'no_big': zoomNumber === 400, 'big_btn' : zoomNumber < 400}" @click="chartsZoom(1)"></div>
      </div>
      <plant-dialog ref="plantDialog"></plant-dialog>
      <fish-dialog ref="fishDialog"></fish-dialog>
      <plant-history-dialog ref="plantHistoryDialog"></plant-history-dialog>
      <land-detail-dialog ref="landDetailDialog"></land-detail-dialog>
      <fish-history-dialog ref="fishHistoryDialog"></fish-history-dialog>
      <farming-record-detail-dialog ref="farmingRecordDetailDialog" :cropActiveIndex="2"></farming-record-detail-dialog>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import PlantDialog from './components/PlantDialog';
import PlantHistoryDialog from './components/PlantHistoryDialog';
import LandDetailDialog from './detail/LandDetailDialog';
import FishDialog from './components/FishDialog';
import FishHistoryDialog from './components/FishHistoryDialog';

import FarmingRecordDetailDialog from './rili/FarmingRecordDetailDialog';

export default {
  name: 'TabContent6',
  components: {PlantDialog, PlantHistoryDialog, LandDetailDialog, FishDialog, FishHistoryDialog, FarmingRecordDetailDialog},
  data() {
    return {
      boxWidth: 1200,
      zoomNumber: 100,
      percentage: 0.2, // 放大的百分比
      currentIndex: 0,
      plantNameOptions: [],
      waterList: ['河流湖泊', '水库坑塘', '沼泽滩涂', '人工鱼塘'],
      titleList: [],
      timeList: [],
      mockData: {}
    };
  },
  computed: {
    ...mapGetters({
      list: "land/list",
      searchField: "land/searchField",
      dict: 'dict/dict',
      dictList: 'dict/dictList'
    }),
    cropTypeOptions() {
      return this.dict.cropType || [];
    },
    fishTypeOptions() {
      return this.dict.waterCultivation || [];
    },
    plantTypeOptions() {
      return _.concat(this.cropTypeOptions, this.fishTypeOptions);
    },
    isWaterForm() {
      return (form) => {
        return _.includes(this.waterList, form);
      };
    }
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyupHandler);
  },
  async created() {
    try {
      this.resetSearchField();
      this.resetPagination();
      let { id } = this.$route.params;
      await this.getLandList(id);
      // 绑定事件
      window.addEventListener('keyup', this.keyupHandler);
    } catch (err) {
      console.log(err);
    }
  },
  mounted() {
    this.computeWidth(true);
  },
  watch: {
    boxWidth() {
      this.timeList = [];
      this.titleList = [];
      this.$nextTick();
      this.computeWidth(false);
    },
  },
  methods: {
    ...mapMutations({
      updateSearchField: "land/updateSearchField",
      updatePagination: "land/updatePagination",
      resetSearchField: "land/resetSearchField",
      resetPagination: "land/resetPagination",
      setCurrentLand: "land/setCurrentLand",
      resetCurrentLand: "land/resetCurrentLand",
      updateCurrentPlant: 'plant/updateCurrentPlant'
    }),
    ...mapActions({
      getLandList: "land/getLandList",
      deleteLandById: "land/deleteLandById",
      getPlantById: "plant/getPlantById",
      getLandById: 'land/getLandById'
    }),
    keyupHandler(e) {
      if (e.keyCode === 13) {
        this.searchHandler();
      }
    },
    inputHandler(value, key) {
      if (key === 'plantType') {
        let {id, name} =  value;
        let plantNameOptions = this.dictList.filter((item) => parseInt(item.parentId) === parseInt(id));
        this.plantNameOptions = plantNameOptions;
        if (!name) {
          this.updateSearchField({ key: 'plantName', value: '' });
        }
        this.updateSearchField({ key, value: name });
      } else {
        this.updateSearchField({ key, value });
      }
      if (key !== 'landName') {
        this.searchHandler();
      }
    },
    searchHandler() {
      let { id } = this.$route.params;
      this.getLandList(id);
    },
    clearSearchField() {
      this.resetSearchField();
      this.plantNameOptions = [];
      this.searchHandler();
    },
    handlePaginationChange(value, key) {
      this.updatePagination({ key, value });
      this.searchHandler();
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    showDetailHandler(land) {
      this.setCurrentLand({land});
      this.$refs.landDetailDialog.show();
    },
    addPlantHandler(land) {
      let {id, code, name, area, form} = land;
      this.updateCurrentPlant({key: 'farmLandId', value: id});
      this.updateCurrentPlant({key: 'farmLandCode', value: code});
      this.updateCurrentPlant({key: 'area', value: area});

      if (this.isWaterForm(form)) {
        this.$refs.fishDialog.show({name, code, id, area, form});
      } else {
        this.$refs.plantDialog.show({name, code, id, area, form});
      }
    },
    async getPlantHistoryHandler(land) {
      try {
        let {id, code, name, area, form} = land;
        this.updateCurrentPlant({key: 'farmLandId', value: id});
        this.updateCurrentPlant({key: 'farmLandCode', value: code});
        this.updateCurrentPlant({key: 'area', value: area});

        if (this.isWaterForm(form)) {
          this.$refs.fishHistoryDialog.show({name, code, id, area});
        } else {
          this.$refs.plantHistoryDialog.show({name, code, id, area});
        }
      } catch (err) {
        console.log(err);
      }
    },
    chartsZoom(num) {
      let size = 1200 * this.percentage;
      if(num === 1 && this.zoomNumber < 400) {
        this.boxWidth += size;
        this.zoomNumber += this.percentage * 100
      } else if(num === 0 && this.zoomNumber > 100) {
        this.boxWidth -= size;
        this.zoomNumber -= this.percentage * 100
      }
    },
    showDetail(detail) {
      console.log(detail);
      const {landId, id} = detail;
      this.getPlantById(landId);
      this.getLandById(landId);
      this.$refs.farmingRecordDetailDialog.show(id, detail);
    },
    async computeWidth(call = false) {
      if(call) {
        const farmId = this.$route.params.id;
        this.mockData = await this.$service.getRecordStatistics(farmId);
      }
      // 这里模拟对数据的处理 要在渲染的时候就把 定位的left 宽度 都计算好 放到 数据结构中 然后渲染
      // 结束日期不包含 开始日期包含
      let cycle = '', dataObj = {};
      for(let key in this.mockData.data) {
        let titleObj = {
          title: key,
          type: 'land'
        };
        this.titleList.push(titleObj);

        let plantObj = this.mockData.data[key];
        let landObj = {type: 'land', list: []};
        this.timeList.push(_.cloneDeep(landObj));

        for(let key in plantObj) {
          let cycleObj = {type: 'cycle', list: []}, stageObj = {type: 'stage', list: []}, cycle = '';
          cycle = '';
          // 标题
          titleObj = {
            title: key,
            type: 'cycle'
          };
          this.titleList.push(titleObj);
          titleObj = {
            title: key,
            type: 'stage'
          };
          this.titleList.push(titleObj);

          // 内容部分
          let cacheObj = {}, colorIndex = 1;
          plantObj[key].reverse().map((item, index, ary)=> {

            if(cycle === "") {
              cacheObj = _.cloneDeep(item);
              cacheObj.title = item.cropCycleName;
              cacheObj.startAt = this.getMonthFirstDay(item.startAt);
              cycle = item.cropCycleName;
              if(index === ary.length - 1) {
                cacheObj.title = item.cropCycleName;
                cacheObj.endAt = this.getMonthLastDay(item.endAt);
                cycleObj.list.push(_.cloneDeep(this.computPosition(cacheObj)));
                cacheObj = {};
              }
            } else if(cycle !== item.cropCycleName) {
              colorIndex++;
              cycleObj.list.push(_.cloneDeep(this.computPosition(cacheObj)));
              let endAt = cacheObj.endAt;
              cacheObj = {};
              cacheObj = _.cloneDeep(item);
              cacheObj.title = item.cropCycleName;
              cacheObj.startAt = endAt;
              cycle = item.cropCycleName;
              if(index === ary.length - 1) {
                cacheObj.title = item.cropCycleName;
                cacheObj.endAt = this.getMonthLastDay(item.endAt);
                cycleObj.list.push(_.cloneDeep(this.computPosition(cacheObj)));
                cacheObj = {};
              }
            } else {
              cacheObj.title = item.cropCycleName;
              cacheObj.endAt = item.endAt;
              if(index === ary.length - 1) {
                cacheObj.endAt = this.getMonthLastDay(item.endAt);
                cycleObj.list.push(_.cloneDeep(this.computPosition(cacheObj)));
                cacheObj = {};
              }
            }
            item.colorIndex = colorIndex;
            stageObj.list.push(this.computPosition(item));
          })
          this.timeList.push(_.cloneDeep(cycleObj));
          this.timeList.push(_.cloneDeep(stageObj));
        }
      }
    },
    gotoPlantingRecordHandler(land) {
      let {id} = land;
      this.$router.push({name: "PlantingRecord", params: {id}});
    },
    getMonthFirstDay(str) {
      let current = new Date(str);
      current.setDate(1);
      current.setHours(0);
      current.setMinutes(0);
      current.setSeconds(0);
      current.setMilliseconds(0);
      return current;
    },
    getMonthLastDay(str) {
      let current = new Date(str);
      let currentMonth = current.getMonth();
      current.setMonth(currentMonth + 1);
      current.setDate(0);
      current.setHours(0);
      current.setMinutes(0);
      current.setSeconds(0);
      current.setMilliseconds(0);
      return current;
    },
    getTomorrow(str) {
      let d = new Date(str), date = d.getDate();
      d.setDate(date + 1);
      return d;
    },
    getDateObject(string) {
      let d = new Date(string), obj = {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate()
      };
      return obj;
    },
    getMinus(s, e) {
      var start_date = new Date(s);
      var end_date = new Date(e);
      var days = (end_date - start_date)/86400000;
      return days;
    },
    getDaysOfMonth(year, month) {
      month = month + 1;
      switch (month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
              return 31;
          case 4:
          case 6:
          case 9:
          case 11:
              return 30;
          case 2:
              return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 29 : 28;
          default:
              return 0;
      }
    },
    computPosition(item) {
      let monthWidth = 1 / 12 * this.boxWidth, startDate = null, endDate = null, dateNum = 0, currentLeft = 0;
      const {startAt, endAt} = item;
      startDate = this.getDateObject(startAt);
      endDate = this.getDateObject(endAt);
      const {year, month, date} = startDate;
      const {year: eYear, month: eMonth, date: eDate} = endDate;
      dateNum = this.getDaysOfMonth(year, month);
      if(date === 1) {
        currentLeft = 0;
      } else {
        currentLeft = date / dateNum * monthWidth;
      }
      item.left = (currentLeft + (month - 1) * monthWidth) / this.boxWidth * 100 + "%";

      // // 根据开始日期 结束日期 计算相差天数 然后计算天数
      let minus = this.getMinus(startAt, endAt);
      // // TODO 这里的计算要细化  应该是月份的天数 除以 monthWidth 一天的宽度  因为每个月天数不一样 一天占的宽度不一样
      item.width = minus / 365 * this.boxWidth + 'px';

      // let mMonth = eMonth - month, mMonthWidth;
      // let startMonthTotal, startMonthNum , startMonthWidth;
      // let endMonthTotal, endMonthNum , endMonthWdith;
      // if(mMonth === 0) {
      //   startMonthWidth = (eDate - date + 1) / dateNum * monthWidth;
      //   mMonthWidth = 0;
      //   endMonthWdith = 0;
      // } else {
      //   mMonthWidth = (mMonth - 1) * monthWidth;
      //   startMonthTotal = this.getDaysOfMonth(year, month), startMonthNum = startMonthTotal - date + 1, startMonthWidth = startMonthNum / startMonthTotal * monthWidth;
      //   endMonthTotal = this.getDaysOfMonth(eYear, eMonth), endMonthNum = eDate, endMonthWdith = endMonthNum / endMonthTotal * monthWidth;
      // }
      // item.width = mMonthWidth + startMonthWidth + endMonthWdith + 'px';

      return item;
    },
  }
}
</script>
<style lang="scss" scoped>
.plant-manage-container {
  padding: 0 20px;

  .view_tab {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 50px;

    div {
      margin-left: 26px;
      width: 22px;
      height: 19px;
      cursor: pointer;
    }

    .tu_biao {
      background: url("../../../assets/img/icon-chart@2x.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .tu_biao-a {
      background: url("../../../assets/img/icon-chart-a@2x.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .ri_li {
      background: url("../../../assets/img/icon-list@2x.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .ri_li-a {
      background: url("../../../assets/img/icon-list-a@2x.png") center center no-repeat;
      background-size: 100% 100%;
    }

  }

  .stage1 {
    background-color: #297CEB;
  }
  .stage2 {
    background-color: #71CACF;
  }
  .stage3 {
    background-color: #7C82FB;
  }
  .stage4 {
    background-color: #23A6F5;
  }
  .stage5 {
    background-color:#98BD72;
  }
  .stage6 {
    background-color: #E2CA7F;
  }
  .stage7 {
    background-color: #2FD2DB;
  }
  .stage8 {
    background-color: #E9C366;
  }
  .stage9 {
    background-color: #E8A437;
  }
  .stage0 {
    background-color: #615CE2;
  }

  .calendar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .title {
      width: 130px;
      margin-top: 40px;
      padding-right: 16px;
      border-right: 2px solid #3E495E;

      div {
        width: 100%;
        height: 28px;
        margin-top: 10px;
        color: #FFFFFF;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      .farm_title {
        display: block;
        width: 100%;
        border-radius: 6px;
        border: 1px solid #466D94;
        padding: 3px;
        color: #8AB9E8;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .plant_title {
        display: block;
        height: 28px;
        line-height: 28px;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .charts_box {
      position: relative;
      width: 1200px;
      overflow-y: hidden;
      overflow-x: scroll;
      .flex_box {
        position: relative;
        height: 100%;

        .time_line {
          height: calc(100% - 40px);
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          div {
            height: 100%;
            width: 8.33333%;
            border-right: 1px dotted #3E495E;
          }
        }
        .content {
          position: absolute;
          left: 0;
          right: 0;
          top: 40px;
          width: 100%;
          height: calc(100% - 40px);

          .plant_cycle {
            width: 100%;
            height: 28px;
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            position: relative;
            div {
              height: 100%;
              position: absolute;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #FFFFFF;
            }
            .show_detail {
              cursor: pointer;
            }
          }
        }
        .year_mounth {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 30px;
          margin-bottom: 10px;

          div {
            width: 8.3%;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }
      }

    }
  }

  .zoom_area {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;

    .btn {
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background-color: red;
      border-radius: 50%;
      cursor: pointer;
    }
    .small_btn {
      background: url('../../../assets/img/icon-can-m@2x.png') center center no-repeat;
      background-size: 100% 100%;
    }
    .big_btn {
      background: url('../../../assets/img/icon-can-a@2x.png') center center no-repeat;
      background-size: 100% 100%;
    }
    .no_small {
      background: url('../../../assets/img/icon-m@2x.png') center center no-repeat;
      background-size: 100% 100%;
    }
    .no_big {
      background: url('../../../assets/img/icon-a@2x.png') center center no-repeat;
      background-size: 100% 100%;
    }

    .zoom_number {
      width: 40px;
      margin: 0 10px;
    }
  }
}
</style>
