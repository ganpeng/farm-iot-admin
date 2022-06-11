<template>
  <el-dialog
    :title="title"
    class="my-dialog no-footer-border"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-body">
      <el-date-picker
        :clearable="false"
        @change="yearChangeHandler"
        :picker-options="datePickerOptions"
        class="year-select"
        type="year"
        v-model="year"
        value-format="yyyy"></el-date-picker>
      <div class="plant-protection-detail-container">
        <div class="steps">
          <ul class="step-list">
            <li
              v-for="(step, index) in stepList"
              :key="index"
              @click="toggleActive(index)"
              :class="['step-item', step.active && 'active']"
            >
              <span class="count">
                <svg-icon v-if="step.active" :icon-class="`plant_icon${index + 1}_active`"/>
                <svg-icon v-else :icon-class="`plant_icon${index + 1}`"/>
              </span>
              <span class="title">{{step.title}}</span>
            </li>
          </ul>
        </div>
        <div class="seperator-line"></div>
        <div class="steps-content">
          <el-form
            :model="plant"
            status-icon
            ref="plantForm"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <div v-show="activeIndex === 0" class="step-content-item">
              <div v-if="plant.p1.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p1Plant, index) in plant.p1"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">作物信息{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p2Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="作物分类">
                          <span>{{p1Plant.p1PlantType}}</span>
                        </el-form-item>
                        <el-form-item label="品种">
                          <span>{{p1Plant.p1SeedName}}</span>
                        </el-form-item>
                        <el-form-item label="水产批号">
                          <span>{{p1Plant.p1SeedBatchNo}}</span>
                        </el-form-item>
                        <el-form-item label="育苗时间">
                          <span>{{p1Plant.dateRange[0] | formatDate('yyyy-MM-DD')}}</span>
                          ~
                          <span>{{p1Plant.dateRange[1] | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item label="作物名称">
                          <span>{{p1Plant.p1PlantName}}</span>
                        </el-form-item>
                        <el-form-item label="种子公司名称">
                          <span>{{p1Plant.p1SeedCompanyName}}</span>
                        </el-form-item>
                        <el-form-item label="种植时间">
                          <span>{{p1Plant.p1PlantDate | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
            <div v-show="activeIndex === 1" class="step-content-item">
              <div v-if="plant.p2InputThing.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p2Plant, index) in plant.p2InputThing"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">投入品{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p2Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="投入品厂家">
                          <span>{{p2Plant.factory}}</span>
                        </el-form-item>
                        <el-form-item label="投入量(公斤)">
                          <span>{{p2Plant.amount}}</span>
                        </el-form-item>
                        <el-form-item label="投入品类型">
                          <span>{{p2Plant.type}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item label="投入品生产批次">
                          <span>{{p2Plant.batch}}</span>
                        </el-form-item>
                        <el-form-item label="投入时间">
                          <span>{{p2Plant.date | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                        <el-form-item
                          v-if="p2Plant.type !== '其它'"
                          label="投入品分类">
                          <span>{{p2Plant.class}}</span>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
            <div v-show="activeIndex === 2" class="step-content-item">
              <div v-if="plant.p3FieldManage.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p3Plant, index) in plant.p3FieldManage"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">田间管理{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p3Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="管理类型">
                          <span>{{p3Plant.type}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item label="投入时间">
                          <span>{{p3Plant.date | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
            <div v-show="activeIndex === 3" class="step-content-item">
              <div v-if="plant.p4HarvestManage.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p4Plant, index) in plant.p4HarvestManage"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">采收管理{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p4Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="采收面积(公顷)">
                          <span>{{p4Plant.area}}</span>
                        </el-form-item>
                        <el-form-item label="采收产量(公斤)">
                          <span>{{p4Plant.amount}}</span>
                        </el-form-item>
                        <el-form-item label="投入时间">
                          <span>{{p4Plant.date | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item label="采收方式">
                          <span>{{p4Plant.mode}}</span>
                        </el-form-item>
                        <el-form-item label="平均亩产(公斤)">
                          <span>{{p4Plant.averageAmount}}</span>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
            <div v-show="activeIndex === 4" class="step-content-item">
              <div v-if="plant.p5ProcessManage.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p5Plant, index) in plant.p5ProcessManage"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">加工管理{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p5Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="加工方">
                          <span>{{p5Plant.party}}</span>
                        </el-form-item>
                        <el-form-item
                          v-if="p5Plant.party === '其它加工厂商'"
                          label="加工厂商证件号">
                          <span>{{p5Plant.no}}</span>
                        </el-form-item>
                        <el-form-item label="加工时间">
                          <span>{{p5Plant.date | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item
                          v-if="p5Plant.party === '其它加工厂商'"
                          label="加工方名称">
                          <span>{{p5Plant.name}}</span>
                        </el-form-item>
                        <el-form-item label="加工方批次">
                          <span>{{p5Plant.batch}}</span>
                        </el-form-item>
                        <el-form-item label="加工量(公斤)">
                          <span>{{p5Plant.amount}}</span>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
            <div v-show="activeIndex === 5" class="step-content-item">
              <div v-if="plant.p6SaveManage.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p6Plant, index) in plant.p6SaveManage"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">仓储类型{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p6Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="仓储类型">
                          <span>{{p6Plant.type}}</span>
                        </el-form-item>
                        <el-form-item label="仓储容量(公斤)">
                          <span>{{p6Plant.totalAmount}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item label="本次仓储量(公斤)">
                          <span>{{p6Plant.amount}}</span>
                        </el-form-item>
                        <el-form-item label="入仓时间">
                          <span>{{p6Plant.date | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="仓库地址">
                          <p class="address">{{p6Plant.address}}</p>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
            <div v-show="activeIndex === 6" class="step-content-item">
              <div v-if="plant.p7CheckManage.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p7Plant, index) in plant.p7CheckManage"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">检测信息{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p7Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="检测机构">
                          <span>{{p7Plant.org}}</span>
                        </el-form-item>
                        <el-form-item label="送检人">
                          <span>{{p7Plant.user}}</span>
                        </el-form-item>
                        <el-form-item label="检测员">
                          <span>{{p7Plant.tester}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item label="检测时间">
                          <span>{{p7Plant.date | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                        <el-form-item label="检测项目">
                          <span>{{p7Plant.project}}</span>
                        </el-form-item>
                        <el-form-item label="检测员电话">
                          <span>{{p7Plant.mobile}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item class="img-form-item" label="检测报告">
                          <file-carousel v-if="p7Plant.fileList.length > 0" :files="p7Plant.fileList"></file-carousel>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
            <div v-show="activeIndex === 7" class="step-content-item">
              <div v-if="plant.p8DisasterInfo.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p8Plant, index) in plant.p8DisasterInfo"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">受灾信息{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p8Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="受灾类型">
                          <span>{{p8Plant.type}}</span>
                        </el-form-item>
                        <el-form-item label="受灾面积">
                          <span>{{p8Plant.area}}</span>
                        </el-form-item>
                        <el-form-item label="预计损失">
                          <span>{{p8Plant.lose}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item label="受灾时间">
                          <span>{{p8Plant.date | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                        <el-form-item label="预计减产(公斤)">
                          <span>{{p8Plant.reduce}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item class="img-form-item" label="检测报告">
                          <file-carousel v-if="p8Plant.fileList.length > 0" :files="p8Plant.fileList"></file-carousel>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
            <div v-show="activeIndex === 8" class="step-content-item">
              <div v-if="plant.p9MachineryUse.length > 0" class="training-list-container">
                <ul class="training-list">
                  <li v-for="(p9Plant, index) in plant.p9MachineryUse"
                    :key="index" class="training-item">
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">农机具使用{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <!-- <span :class="['expand-btn', p9Plant.isExpanded && 'is-expanded']">
                          收起
                          <svg-icon icon-class="array_top"/>
                        </span> -->
                      </div>
                    </div>
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="农机具来源">
                          <span>{{p9Plant.source}}</span>
                        </el-form-item>
                        <el-form-item label="农机具名称">
                          <span>{{p9Plant.name}}</span>
                        </el-form-item>
                        <el-form-item label="作业面积(公顷)">
                          <span>{{p9Plant.area}}</span>
                        </el-form-item>
                     </el-col>
                      <el-col :span="12">
                        <el-form-item label="农机具类型">
                          <span>{{p9Plant.type}}</span>
                        </el-form-item>
                        <el-form-item label="使用时间">
                          <span>{{p9Plant.date | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import FileCarousel from '@/components/FileCarousel';
import constants from '@/util/constants';
export default {
  name: "PlantHistoryDialog",
  components: {FileCarousel},
  data() {
    return {
      visible: false,
      farmLandName: '',
      farmLandId: '',
      year: '',
      stepList: constants.STEP_LIST,
      datePickerOptions: {
        disabledDate(date) {
          let today = new Date().getTime();
          return date.getTime() >= today;
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      plant: 'plant/currentPlant'
    }),
    activeIndex() {
      let index = this.stepList.findIndex(item => item.active);
      return index;
    },
    title() {
      return `历史记录：${this.farmLandName}`;
    }
  },
  methods: {
    ...mapMutations({
      resetCurrentPlant: 'plant/resetCurrentPlant'
    }),
    ...mapActions({
      getPlantHistory: 'plant/getPlantHistory'
    }),
    show({name, id}) {
      this.visible = true;
      this.farmLandName = name;
      this.farmLandId = id;
    },
    hide() {
      this.visible = false;
      this.farmLandName = '';
      this.farmLandId = '';
    },
    async openDialogHandler() {
      try {
        await this.$nextTick();
        this.stepList = _.cloneDeep(constants.STEP_LIST);
        let year = new Date().getFullYear();
        this.year = year + '';
        await this.getPlantHistory({farmLandId: this.farmLandId, year: this.year});
        this.$refs.plantForm.clearValidate();
      } catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    cancelHandler() {
      this.hide();
      this.resetCurrentPlant();
    },
    async yearChangeHandler() {
      try {
        await this.getPlantHistory({farmLandId: this.farmLandId, year: this.year});
      } catch (err) {
        console.log(err);
      }
    },
    toggleActive(active) {
      this.stepList = this.stepList.map((item, index) => {
        if (index === active) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.year-select {
  position: absolute;
  top: 10px;
  right: 100px;
  width: 80px;
  height: 30px;
  line-height: 30px;
}

.plant-protection-detail-container {
  .steps {
    width: 100%;
    margin-top: 50px;
    margin-bottom: 30px;
    .step-list {
      display: flex;
      .step-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        font-weight: 400;
        cursor: pointer;
        .count {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-bottom: 10px;
          .svg-icon {
            width: 50px;
            height: 50px;
          }
        }
        .title {
          font-size: 14px;
          color: #A8ABB3;
        }
        &.active {
          .title {
            color: #F0F0F0;
          }
        }
      }
    }
  }
  .steps-content {
    margin-top: 50px;
  }
}
</style>
<style lang="scss">
.el-input__inner {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
}
.el-date-picker {
  .el-picker-panel__body {
    .el-date-picker__header {
      .el-date-picker__header-label {
        color: #fff;
      }
    }
  }
  .el-year-table {
    td {
      .cell {
        color: #fff;
      }
      &.disabled {
        .cell {
          background-color: transparent;
          color: #777;
        }
      }
    }
  }
}
</style>
