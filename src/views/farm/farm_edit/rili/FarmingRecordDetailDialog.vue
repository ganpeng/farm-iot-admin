<template>
  <el-dialog
    title="农事记录"
    class="my-dialog no-footer-border"
    width="50%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-body">
      <div class="plant-protection-detail-container">
        <div class="steps-content">
          <el-form
            :model="farmingRecord"
            status-icon
            ref="p1Form"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <el-col :span="14">
              <el-form-item label="地块">
                <span>{{land.name}}</span>
              </el-form-item>
              <el-form-item label="种植作物">
                <span>{{plantName}}-{{seedName}}</span>
              </el-form-item>
              <el-form-item label="作物周期" prop="cropCycleName">
                <span>{{farmingRecord.cropCycleName}}</span>
              </el-form-item>
              <el-form-item label="农事类型" prop="agriculTypeName">
                <span>{{farmingRecord.agriculTypeName}}</span>
              </el-form-item>
              <el-form-item label="开始时间" prop="startAt">
                <span>{{farmingRecord.startAt | formatDate('yyyy-MM-DD HH:mm')}}</span>
              </el-form-item>
              <el-form-item label="结束时间" prop="endAt">
                <span>{{farmingRecord.endAt | formatDate('yyyy-MM-DD HH:mm')}}</span>
              </el-form-item>
              <el-form-item label="投入品" prop="inputs">
                <span>{{farmingRecord.inputs ? '是' : '否'}}</span>
              </el-form-item>
              <div v-if="farmingRecord.inputs" class="step-content-item">
                <div class="training-list-container">
                  <ul class="training-list">
                    <li
                      v-for="(p2Plant, index) in farmingRecord.p2InputThing"
                      :key="index"
                      class="training-item"
                    >
                      <div class="training-item-header">
                        <div class="left">
                          <span class="title">投入品{{index + 1}}</span>
                        </div>
                        <div class="right">
                          <span class="delete-btn">
                          </span>
                          <span
                            @click="expandHandler(`p2InputThing`, index)"
                            :class="['expand-btn', p2Plant.isExpanded && 'is-expanded']"
                          >
                            {{p2Plant.isExpanded ? '收起' : '展开'}}
                            <svg-icon icon-class="array_top"/>
                          </span>
                        </div>
                      </div>
                      <div v-if="p2Plant.isExpanded" class="training-item-content">
                        <el-col :span="12">
                          <el-form-item
                            label="投入品厂家"
                            :prop="`p2InputThing.${index}.factory`"
                          >
                            <span>{{p2Plant.factory}}</span>
                          </el-form-item>
                          <el-form-item
                            label="投入量(公斤)"
                            :prop="`p2InputThing.${index}.amount`"
                          >
                            <span>{{p2Plant.amount}}</span>
                          </el-form-item>
                          <el-form-item
                            label="投入品类型"
                            :prop="`p2InputThing.${index}.type`"
                          >
                            <span>{{p2Plant.type}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item
                            label="投入品生产批次"
                            :prop="`p2InputThing.${index}.batch`"
                          >
                            <span>{{p2Plant.batch}}</span>
                          </el-form-item>
                          <el-form-item
                            label="投入时间"
                            :prop="`p2InputThing.${index}.date`"
                          >
                            <span>{{p2Plant.date | formatDate('yyyy-MM-DD')}}</span>
                          </el-form-item>
                          <el-form-item
                            v-if="p2Plant.type !== '其它'"
                            label="投入品分类"
                            :prop="`p2InputThing.${index}.class`"
                          >
                            <span>{{p2Plant.class}}</span>
                          </el-form-item>
                        </el-col>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <el-form-item label="产出物" prop="products">
                <span>{{farmingRecord.products ? '是' : '否'}}</span>
              </el-form-item>
              <div v-if="farmingRecord.products" class="step-content-item">
                <div class="training-list-container">
                  <ul class="training-list">
                    <li
                      v-for="(p4Plant, index) in farmingRecord.p4HarvestManage"
                      :key="index"
                      class="training-item"
                    >
                      <div class="training-item-header">
                        <div class="left">
                          <span class="title">采收管理{{index + 1}}</span>
                        </div>
                        <div class="right">
                          <span class="delete-btn">
                          </span>
                          <span
                            @click="expandHandler('p4HarvestManage', index)"
                            :class="['expand-btn', p4Plant.isExpanded && 'is-expanded']"
                          >
                            {{p4Plant.isExpanded ? '收起' : '展开'}}
                            <svg-icon icon-class="array_top"/>
                          </span>
                        </div>
                      </div>
                      <div v-if="p4Plant.isExpanded" class="training-item-content">
                        <el-col :span="12">
                          <el-form-item
                            label="采收面积(公顷)"
                            :prop="`p4HarvestManage.${index}.area`"
                          >
                            <span>{{p4Plant.area}}</span>
                          </el-form-item>
                          <el-form-item
                            label="采收产量(公斤)"
                            :prop="`p4HarvestManage.${index}.amount`"
                          >
                            <span>{{p4Plant.amount}}</span>
                          </el-form-item>
                          <el-form-item
                            label="采收时间"
                            :prop="`p4HarvestManage.${index}.date`"
                          >
                            <span>{{p4Plant.date | formatDate('yyyy-MM-DD')}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item
                            label="采收方式"
                            :prop="`p4HarvestManage.${index}.mode`"
                          >
                            <span>{{p4Plant.mode}}</span>
                          </el-form-item>
                          <el-form-item
                            label="平均亩产(公斤)"
                            :prop="`p4HarvestManage.${index}.averageAmount`"
                          >
                            <span>{{p4Plant.averageAmount}}</span>
                          </el-form-item>
                        </el-col>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item
                class="img-form-item"
                prop="urlList"
                label="添加图片/视频">
                <carousel
                  v-if="farmingRecord.urlList.length > 0"
                  :canDelete="false"
                  :urlList="farmingRecord.urlList"
                ></carousel>
              </el-form-item>
              <el-form-item label="农事描述" prop="farmDes">
                <span>{{farmingRecord.farmDes || '无'}}</span>
              </el-form-item>
              <el-form-item label="摄像头" prop="cameraId">
                <span>{{farmingRecord.cameraName || '无'}}</span>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from 'lodash';
import { mapGetters, mapMutations, mapActions } from "vuex";
import Carousel from './Carousel';
export default {
  name: 'FarmingRecordDialog',
  components: { Carousel },
  props: {
    cropActiveIndex: {
      type: Number,
      default: 0
    },
    getAgriculRecordList: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      plantName: '',
      seedName: '',
      submitDisabled: false,
      visible: false,
      editId: undefined,
      cameraList: [],
      agriculTypeList: [],
      cropCycleList: [],
      farmingRecord: {
        cameraId: '', // 摄像头id
        cameraName: '', // 摄像头名称
        // 农场
        farmId: '', // 农场id
        // 地块
        landCode: '', // 地块编码
        landId: '', // 地块id
        landName: '', // 地块名称
        // 种植plant
        plantId: '', // 种植记录id
        plantName: '', // 种植记录名称
        // 作物
        uuid: '', // 作物下面的uuid
        seedName: '', // 品种名称

        startAt: '', // 开始时间
        endAt: '', // 结束时间
        cropCycleName: '', // 作物周期名称
        agriculTypeName: '', // 农事类型名称
        inputs: '', // 是否有投入品
        products: '', // 是否有产出品
        farmDes: '', // 农事描述
        urlList: [] // 图片视频列表 { fileName: '', fileUrl: '' }
      },
      datePickerOptions: {
        disabledDate(date) {
          let year = new Date().getFullYear();
          let dateTimeOfFirstDay = new Date(`${year}-01-01 00:00:00`).getTime();
          let dateTimeOfLastDay = new Date(`${year}-12-31 23:59:59`).getTime();
          return !(
            date.getTime() >= dateTimeOfFirstDay &&
            date.getTime() <= dateTimeOfLastDay
          );
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      plant: 'plant/currentPlant',
      land: 'land/currentLand',
      dict: "dict/dict",
      dictList: "dict/dictList"
    }),
    getCurrentCropValueByKey() {
      return (key) => {
        return _.get(this.plant, `p1.${this.cropActiveIndex}.${key}`);
      };
    },
    getCameraNameById() {
      return (id) => {
        let camera = this.cameraList.find((camera) => camera.id === id);
        return _.get(camera, `deviceName`);
      };
    },
    isEdit() {
      return this.editId !== undefined && this.editId !== null;
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentPlant: 'plant/updateCurrentPlant'
    }),
    ...mapActions({
      createPlant: "plant/createPlant",
      getPlantById: "plant/getPlantById",
      getAllDictList: 'dict/getAllDictList'
    }),
    show(id, detail) {
      const {plantName, seedName} = detail;
      this.plantName = plantName;
      this.seedName = seedName;
      this.editId = id;
      this.visible = true;
    },
    expandHandler(key, index) {
      let keyData = _.get(this.farmingRecord, key);
      let newData = keyData.map((item, _index) => {
        if (_index === index) {
          item.isExpanded = !item.isExpanded;
        }
        return item;
      });
    },
    hide() {
      this.visible = false;
      this.editId = undefined;
      this.submitDisabled = false;
      this.farmingRecord = {
        cameraId: '', // 摄像头id
        cameraName: '', // 摄像头名称
        // 农场
        farmId: '', // 农场id
        // 地块
        landCode: '', // 地块编码
        landId: '', // 地块id
        landName: '', // 地块名称
        // 种植plant
        plantId: '', // 种植记录id
        plantName: '', // 种植记录名称
        // 作物
        uuid: '', // 作物下面的uuid
        seedName: '', // 品种名称

        startAt: '', // 开始时间
        endAt: '', // 结束时间
        cropCycleName: '', // 作物周期名称
        agriculTypeName: '', // 农事类型名称
        inputs: '', // 是否有投入品
        products: '', // 是否有产出品
        farmDes: '', // 农事描述
        urlList: [] // 图片视频列表 { fileName: '', fileUrl: '' }
      };
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        // this.getAgriculTypeList();
        // this.getCropCycleList();
        // this.getCameraList();
        if (this.isEdit) {
          this.getAgriculRecordDetail();
        }
        this.$refs.p1Form.clearValidate();
      } catch (err) {
        console.log(err);
      }
    },
    getAgriculRecordDetail() {
      this.$service.getAgriculRecordDetail(this.editId, "")
        .then((res) => {
          if (res && res.code === 0) {
            this.farmingRecord = res.data;
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    getAgriculTypeList() {
      let {farmId} = this.plant;
      let plantName = this.getCurrentCropValueByKey('p1PlantName');
      let params = { farmId, plantName, pageNum: 0, pageSize: 10000};
      this.$service.getAgriculTypeList(params)
        .then((res) => {
          if (res && res.code === 0) {
            this.agriculTypeList = _.get(res.data, 'list') || [];
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    getCropCycleList() {
      let {farmId} = this.plant;
      let plantName = this.getCurrentCropValueByKey('p1PlantName');
      let params = { farmId, plantName, pageNum: 0, pageSize: 10000};
      this.$service.getCropCycleList(params)
        .then((res) => {
          if (res && res.code === 0) {
            this.cropCycleList = _.get(res.data, 'list') || [];
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    getCameraList() {
      let {farmId} = this.plant;
      let params = {farmId, pageNum: 0, pageSize: 10000};
      this.$service.getCameraList(params)
        .then((res) => {
          if (res && res.code === 0) {
            this.cameraList = _.get(res.data, `list`) || [];
          }
        }).catch((err) => {
          console.log(err);
        })
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    async cancelHandler() {
      this.hide();
    },
  }
}
</script>
<style lang="scss">
.desc-wrapper {
  &.two {
    width: 53%;
    height: 140px;
    .el-textarea__inner {
      height: 140px;
    }
  }
}
</style>