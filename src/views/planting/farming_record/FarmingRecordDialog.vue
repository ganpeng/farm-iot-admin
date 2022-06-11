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
            :rules="validRules"
            status-icon
            ref="p1Form"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <el-col :span="24">
              <el-form-item label="地块">
                <span>{{land.name}}</span>
              </el-form-item>
              <el-form-item label="种植作物">
                <span>{{getCurrentCropValueByKey(`p1PlantName`)}}-{{getCurrentCropValueByKey(`p1SeedName`)}}</span>
              </el-form-item>
              <el-form-item label="作物周期" prop="cropCycleId">
                <el-select
                  :value="farmingRecord.cropCycleId"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, `cropCycleId`)"
                >
                  <el-option
                    v-for="(item, index) in cropCycleList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <span class="add-btn" @click="addCropCycle">新增</span>
              </el-form-item>
              <el-form-item label="农事类型" prop="agriculTypeId">
                <el-select
                  :value="farmingRecord.agriculTypeId"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, `agriculTypeId`)"
                >
                  <el-option
                    v-for="(item, index) in agriculTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <span class="add-btn" @click="addAgriculType">新增</span>
              </el-form-item>
              <el-form-item label="时间" prop="dateRange">
                <el-date-picker
                  :value="farmingRecord.dateRange"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  @input="inputHandler($event, `dateRange`)"
                ></el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="结束时间" prop="endAt">
                <el-date-picker
                  :value="farmingRecord.endAt"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  :picker-options="datePickerOptions"
                  @input="inputHandler($event, `endAt`)"
                ></el-date-picker>
              </el-form-item> -->
              <el-form-item label="投入品" prop="inputs">
                <el-radio
                  @input="inputHandler(true, 'inputs')"
                  :value="farmingRecord.inputs"
                  :label="true"
                >是</el-radio>
                <el-radio
                  @input="inputHandler(false, 'inputs')"
                  :value="farmingRecord.inputs"
                  :label="false"
                >否</el-radio>
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
                          <span @click="deleteItemHandler(`p2InputThing`, index)" class="delete-btn">
                            删除
                            <svg-icon icon-class="item_delete_icon"/>
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
                            :rules="requiredRules"
                          >
                            <el-input
                              :value="p2Plant.factory"
                              @input="inputHandler($event, `p2InputThing.${index}.factory`)"
                            ></el-input>
                          </el-form-item>
                          <el-form-item
                            label="投入量(公斤)"
                            :prop="`p2InputThing.${index}.amount`"
                            :rules="AreaRules"
                          >
                            <el-input
                              :value="p2Plant.amount"
                              @input="inputHandler($event, `p2InputThing.${index}.amount`)"
                            ></el-input>
                          </el-form-item>
                          <el-form-item
                            label="投入品类型"
                            :prop="`p2InputThing.${index}.type`"
                            :rules="requiredRules"
                          >
                            <el-select
                              :value="p2Plant.type"
                              clearable
                              placeholder="请选择"
                              @change="p2InputThingTypeChangeHandler($event, index)"
                              @input="inputHandler($event, `p2InputThing.${index}.type`, index)"
                            >
                              <el-option
                                v-for="(item, _index) in p2TypeOptions"
                                :key="_index + uniqId"
                                :label="item.name"
                                :value="item.name"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item
                            label="投入品生产批次"
                            :prop="`p2InputThing.${index}.batch`"
                            :rules="requiredRules"
                          >
                            <el-input
                              :value="p2Plant.batch"
                              @input="inputHandler($event, `p2InputThing.${index}.batch`)"
                            ></el-input>
                          </el-form-item>
                          <el-form-item
                            v-if="p2Plant.type !== '其它'"
                            label="投入品分类"
                            :prop="`p2InputThing.${index}.class`"
                            :rules="requiredRules"
                          >
                            <el-select
                              :value="p2Plant.class"
                              clearable
                              placeholder="请选择"
                              @input="inputHandler($event, `p2InputThing.${index}.class`)"
                            >
                              <el-option
                                v-for="(item, _index) in p2Plant.classOptions"
                                :key="_index + uniqId"
                                :label="item.name"
                                :value="item.name"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </div>
                    </li>
                  </ul>
                  <div class="add-btn-container">
                    <span @click="addP2InputThingHandler" class="add-btn">
                      <svg-icon icon-class="add_plus"/>添加条目
                    </span>
                  </div>
                </div>
              </div>
              <el-form-item label="产出物" prop="products">
                <el-radio
                  @input="inputHandler(true, 'products')"
                  :value="farmingRecord.products"
                  :label="true"
                >是</el-radio>
                <el-radio
                  @input="inputHandler(false, 'products')"
                  :value="farmingRecord.products"
                  :label="false"
                >否</el-radio>
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
                          <span @click="deleteItemHandler('p4HarvestManage', index)" class="delete-btn">
                            删除
                            <svg-icon icon-class="item_delete_icon"/>
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
                            :rules="AreaRules"
                          >
                            <el-input
                              :value="p4Plant.area"
                              @input="inputHandler($event, `p4HarvestManage.${index}.area`)"
                            ></el-input>
                          </el-form-item>
                          <el-form-item
                            label="采收产量(公斤)"
                            :prop="`p4HarvestManage.${index}.amount`"
                            :rules="AreaRules"
                          >
                            <el-input
                              :value="p4Plant.amount"
                              @input="inputHandler($event, `p4HarvestManage.${index}.amount`)"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item
                            label="采收方式"
                            :prop="`p4HarvestManage.${index}.mode`"
                            :rules="requiredRules"
                          >
                            <el-select
                              :value="p4Plant.mode"
                              clearable
                              placeholder="请选择"
                              @input="inputHandler($event, `p4HarvestManage.${index}.mode`)"
                            >
                              <el-option
                                v-for="(item, _index) in p4TypeOptions"
                                :key="_index + uniqId"
                                :label="item.name"
                                :value="item.name"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item
                            label="平均亩产(公斤)"
                            :prop="`p4HarvestManage.${index}.averageAmount`"
                            :rules="AreaRules"
                          >
                            <el-input
                              :value="p4Plant.averageAmount"
                              @input="inputHandler($event, `p4HarvestManage.${index}.averageAmount`)"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </div>
                    </li>
                  </ul>
                  <div class="add-btn-container">
                    <span @click="addp4HarvestManageHandler()" class="add-btn">
                      <svg-icon icon-class="add_plus"/>添加条目
                    </span>
                  </div>
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
                  :deleteFile="deleteFileHandler"
                  :urlList="farmingRecord.urlList"
                ></carousel>
                <uploader
                  v-if="farmingRecord.urlList.length < 9"
                  :id="`p7FileUploader`"
                  type="all"
                  :uploadSuccessHandler="fileUploadHandler()"
                ></uploader>
              </el-form-item>
              <el-form-item label="农事描述" prop="farmDes">
                <div class="desc-wrapper two">
                  <el-input
                    :value="farmingRecord.farmDes"
                    :maxlength="300"
                    type="textarea"
                    @input="inputHandler($event, 'farmDes')"
                  ></el-input>
                  <span class="desc-prompt">已输入{{farmingRecord.farmDes.length}}/300字</span>
                </div>
              </el-form-item>
              <el-form-item label="摄像头" prop="cameraId">
                <el-select
                  :value="farmingRecord.cameraId"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, `cameraId`)"
                >
                  <el-option
                    v-for="(item, index) in cameraList"
                    :key="index"
                    :label="item.deviceName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">取 消</el-button>
      <el-button :disabled="submitDisabled" class="enter-btn" @click="enterHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { mapGetters, mapMutations, mapActions } from "vuex";
import Uploader from "@/components/Uploader";
import Carousel from '../Carousel';
import constants from "@/util/constants";
import ImagePreview from '@/components/ImagePreview';
export default {
  name: 'FarmingRecordDialog',
  components: { Uploader, Carousel, ImagePreview },
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

        p2InputThing: [], // 投入品
        p4HarvestManage: [], // 产出品

        dateRange: [],
        startAt: '', // 开始时间
        endAt: '', // 结束时间
        cropCycleId: '', // 作物周期id
        agriculTypeId: '', // 农事类型id
        cropCycleName: '', // 作物周期名称
        agriculTypeName: '', // 农事类型名称
        inputs: '', // 是否有投入品
        products: '', // 是否有产出品
        farmDes: '', // 农事描述
        urlList: [] // 图片视频列表 { fileName: '', fileUrl: '' }
      },
      requiredRules: [
        { required: true, message: "该选项不能为空" }
      ],
      AreaRules: [
        { required: true, message: "该选项不能为空" },
        {
          pattern: constants.REG_EXP.positiveInteger2,
          message: "输入的数值格式不对"
        }
      ],
      validRules: {
        cropCycleId: [
          { required: true, message: "该选项不能为空" }
        ],
        agriculTypeId: [
          { required: true, message: "该选项不能为空" }
        ],
        startAt: [
          { required: true, message: "该选项不能为空" }
        ],
        dateRange: [
          { required: true, message: "该选项不能为空" }
        ],
        endAt: [
          { required: true, message: "该选项不能为空" }
        ],
        inputs: [
          { required: true, message: "该选项不能为空" }
        ],
        products: [
          { required: true, message: "该选项不能为空" }
        ],
        farmDes: [
          { required: true, message: "该选项不能为空" }
        ],
        urlList: [
          { required: true, message: "该选项不能为空" }
        ],
        date: [
          { required: true, message: "该选项不能为空" }
        ]
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
    // p2
    p2TypeOptions() {
      return this.dict.inputType || [];
    },
    // p4
    p4TypeOptions() {
      return this.dict.harvestType || [];
    },
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
    },
    uniqId() {
      return _.uniqueId("option_key");
    },
    getCropCycleName() {
      return (id) => {
        let cropCycle = this.cropCycleList.find((item) => item.id === id);
        return _.get(cropCycle, 'name') || '';
      };
    },
    getAgriculTypeName() {
      return (id) => {
        let agriculType = this.agriculTypeList.find((item) => item.id === id);
        return _.get(agriculType, 'name') || '';
      };
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
    show(id) {
      this.editId = id;
      this.visible = true;
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

        p2InputThing: [], // 投入品
        p4HarvestManage: [], // 产出品

        dateRange: [],
        startAt: '', // 开始时间
        endAt: '', // 结束时间
        cropCycleId: '', // 作物周期id
        agriculTypeId: '', // 农事类型id
        cropCycleName: '', // 作物周期名称
        agriculTypeName: '', // 农事类型名称
        inputs: '', // 是否有投入品
        products: '', // 是否有产出品
        farmDes: '', // 农事描述
        urlList: [] // 图片视频列表 { fileName: '', fileUrl: '' }
      };
    },
    inputHandler(value, key) {
      _.set(this.farmingRecord, key, value);
      if (key === 'inputs') {
        if (value) {
          let p2InputThing = _.get(this.farmingRecord, `p2InputThing`) || [];
          if (p2InputThing.length === 0) {
            this.addP2InputThingHandler();
          }
        } else {
          _.set(this.farmingRecord, `p2InputThing`, []);
        }
      }
      if (key === 'products') {
        if (value) {
          let p4HarvestManage = _.get(this.farmingRecord, `p4HarvestManage`) || [];
          if (p4HarvestManage.length === 0) {
            this.addp4HarvestManageHandler();
          }
        } else {
          _.set(this.farmingRecord, `p4HarvestManage`, []);
        }
      }

      if (key === `dateRange`) {
        let startAt = _.get(value, `0`) || '';
        let endAt = _.get(value, `1`) || '';
        _.set(this.farmingRecord, `startAt`, startAt);
        _.set(this.farmingRecord, `endAt`, endAt);
      }
    },
    p2InputThingTypeChangeHandler(value, index) {
      let p2Type = this.p2TypeOptions.find(item => item.name === value);
      let options = this.dictList.filter(
        item => parseInt(item.parentId) === _.get(p2Type, "id")
      );
      this.inputHandler(options, `p2InputThing.${index}.classOptions`);
    },
    getDefaultP2InputThing() {
      return {
        uuid: uuidv4(),
        type: '', // 类型
        class: '', // 分类
        factory: '', // 厂家
        batch: '', // 生产批次
        amount: '', // 投入量
        classOptions: [], // 分类选项
        isExpanded: true // 展开收起
      };
    },
    getDefaultP4HarvestManage() {
      return {
        uuid: uuidv4(),
        area: '', // 采收面积
        mode: '', // 采收方式
        amount: '', // 采收产量
        averageAmount: '', // 平均亩产
        isExpanded: true // 展开收起
      };
    },
    addP2InputThingHandler() {
      let p2InputThing = _.cloneDeep(this.farmingRecord.p2InputThing);
      let newData = _.concat([this.getDefaultP2InputThing()], p2InputThing);
      this.inputHandler(newData, `p2InputThing`);
    },
    addp4HarvestManageHandler() {
      let p4HarvestManage = _.cloneDeep(this.farmingRecord.p4HarvestManage);
      let newData = _.concat([this.getDefaultP4HarvestManage()], p4HarvestManage);
      this.inputHandler(newData, `p4HarvestManage`);
    },
    deleteItemHandler(key, index) {
      let keyData = _.get(this.farmingRecord, key);
      let newData = keyData.filter((item, _index) => _index !== index);
      this.inputHandler(newData, key);
    },
    expandHandler(key, index) {
      let keyData = _.get(this.farmingRecord, key);
      let newData = keyData.map((item, _index) => {
        if (_index === index) {
          item.isExpanded = !item.isExpanded;
        }
        return item;
      });
      this.inputHandler(newData, key);
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.getAgriculTypeList();
        this.getCropCycleList();
        this.getCameraList();
        if (this.isEdit) {
          this.getAgriculRecordDetail();
        }
        this.$refs.p1Form.clearValidate();
      } catch (err) {
        console.log(err);
      }
    },
    getAgriculRecordDetail() {
      let uuid = this.getCurrentCropValueByKey('uuid');
      this.$service.getAgriculRecordDetail(this.editId, uuid)
        .then((res) => {
          if (res && res.code === 0) {
            if (res.data !== null) {
              let {startAt, endAt, inputs, products} = res.data;
              let farmingRecord = _.assign({}, res.data, {
                dateRange: [startAt || '', endAt || '']
              });
              this.farmingRecord = farmingRecord;
              this.inputHandler(inputs, `inputs`);
              this.inputHandler(products, `products`);
            }
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
    deleteFileHandler(index) {
      let url = _.get(this.farmingRecord, `urlList`);
      let urlList = url.filter((item, _index) => _index !== index);
      this.inputHandler(urlList, `urlList`);
    },
    fileUploadHandler() {
      return data => {
        let urlList = _.get(this.farmingRecord, `urlList`);
        let newUrlList = _.chain(urlList)
          .concat(data)
          .uniqBy("fileUrl")
          .value();
        this.inputHandler(newUrlList, `urlList`);
      };
    },
    async addAgriculType() {
      try {
        let prompt = await this.$prompt(`请输入新农事类型`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputPlaceholder: '最多20个字符',
          inputValidator: value => {
            if (value.length > 20) {
              return `不能超过20个字符`;
            }
            let index = this.agriculTypeList.findIndex(
              item => item.name === value
            );
            if (index >= 0) {
              return `新的农事类型${value}已经存在`;
            } else {
              return true;
            }
          },
          inputErrorMessage: `不能为空`
        });
        if (prompt.action === "confirm") {
          let {farmId} = this.plant;
          let plantName = this.getCurrentCropValueByKey('p1PlantName');
          let reqBody = {
            farmId,
            plantName,
            name: prompt.value
          };
          let res = await this.$service.addAgriculType(reqBody);
          if (res && res.code === 0) {
            this.$message.success(`新增农事类型成功`);
            this.getAgriculTypeList();
          } else {
            this.$message.error(`新增农事类型失败`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async addCropCycle() {
      try {
        let prompt = await this.$prompt(`请输入农事周期`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputPlaceholder: '最多20个字符',
          inputValidator: value => {
            if (value.length > 20) {
              return `不能超过20个字符`;
            }
            let index = this.cropCycleList.findIndex(
              item => item.name === value
            );
            if (index >= 0) {
              return `${value}已经存在`;
            } else {
              return true;
            }
          },
          inputErrorMessage: `不能为空`
        });
        if (prompt.action === "confirm") {
          let {farmId} = this.plant;
          let plantName = this.getCurrentCropValueByKey('p1PlantName');
          let reqBody = {
            farmId,
            plantName,
            name: prompt.value
          };
          let res = await this.$service.addCropCycle(reqBody);
          if (res && res.code === 0) {
            this.$message.success(`新增农事周期成功`);
            this.getCropCycleList();
          } else {
            this.$message.error(`新增农事周期失败`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    formatReqBody() {
      let {id, code, farmId, name} = this.land;
      let {cropCycleId, agriculTypeId} = this.farmingRecord;
      let cropCycleName = this.getCropCycleName(cropCycleId);
      let agriculTypeName = this.getAgriculTypeName(agriculTypeId);
      this.farmingRecord.cropCycleName = cropCycleName;
      this.farmingRecord.agriculTypeName = agriculTypeName;
      this.farmingRecord.farmId = farmId;
      this.farmingRecord.landId = id;
      this.farmingRecord.landCode = code;
      this.farmingRecord.landName = name;
      this.farmingRecord.plantId = _.get(this.plant, 'id');
      this.farmingRecord.plantName = this.getCurrentCropValueByKey('p1PlantName');
      this.farmingRecord.seedName = this.getCurrentCropValueByKey('p1SeedName');
      this.farmingRecord.uuid = this.getCurrentCropValueByKey('uuid');
      this.farmingRecord.cameraName = this.getCameraNameById(this.farmingRecord.cameraId);
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.p1Form.validate();
        if (valid) {
          if (this.isEdit) {
            this.formatReqBody();
            let res = await this.$service.updateAgriculRecord(this.farmingRecord);
            if (res && res.code === 0) {
              this.$message.success(`农事记录编辑成功`);
              this.cancelHandler();
              this.getAgriculRecordList();
            } else {
              this.$message.error(`农事记录编辑失败`);
              this.submitDisabled = false;
            }
          } else {
            this.formatReqBody();
            let res = await this.$service.addAgriculRecord(this.farmingRecord);
            if (res && res.code === 0) {
              this.$message.success(`农事记录添加成功`);
              this.cancelHandler();
              this.getAgriculRecordList();
            } else {
              this.$message.error(`农事记录添加失败`);
              this.submitDisabled = false;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
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
.el-input__prefix {
  display: none!important;
}
</style>