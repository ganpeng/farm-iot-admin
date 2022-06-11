<template>
  <el-dialog
    title="农事计划"
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
            :model="farmingPlan"
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
                <span>{{getCurrentCropValueByKey(`p1PlantName`)}}-{{getCurrentCropValueByKey(`p1SeedName`)}}</span>
              </el-form-item>
              <el-form-item label="作物周期" prop="cropCycleName">
                <span>{{farmingPlan.cropCycleName}}</span>
              </el-form-item>
              <el-form-item label="农事类型" prop="agriculTypeName">
                <span>{{farmingPlan.agriculTypeName}}</span>
              </el-form-item>
              <el-form-item label="开始时间" prop="startAt">
                <span>{{farmingPlan.startAt | formatDate('yyyy-MM-DD HH:mm')}}</span>
              </el-form-item>
              <el-form-item label="结束时间" prop="endAt">
                <span>{{farmingPlan.endAt | formatDate('yyyy-MM-DD HH:mm')}}</span>
              </el-form-item>
              <el-form-item label="投入品" prop="inputs">
                <span>{{farmingPlan.inputs ? '是' : '否'}}</span>
              </el-form-item>
              <el-form-item label="产出物" prop="products">
                <span>{{farmingPlan.products ? '是' : '否'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                class="img-form-item"
                prop="urlList"
                label="添加图片/视频">
                <carousel
                  v-if="farmingPlan.urlList.length > 0"
                  :canDelete="false"
                  :deleteFile="deleteFileHandler"
                  :urlList="farmingPlan.urlList"
                ></carousel>
              </el-form-item>
              <el-form-item label="农事描述" prop="farmDes">
                <span>{{farmingPlan.farmDes || '无'}}</span>
              </el-form-item>
              <el-form-item label="摄像头" prop="cameraId">
                <span>{{farmingPlan.cameraName || '无'}}</span>
              </el-form-item>
            </el-col>
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
import _ from 'lodash';
import { mapGetters, mapMutations, mapActions } from "vuex";
import Carousel from '../Carousel';
export default {
  name: 'FarmingPlanDialog',
  components: { Carousel },
  props: {
    cropActiveIndex: {
      type: Number,
      default: 0
    },
    getAgriculPlanList: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      submitDisabled: false,
      visible: false,
      editId: undefined,
      complete: false,
      cameraList: [],
      agriculTypeList: [],
      cropCycleList: [],
      farmingPlan: {
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
      validRules: {
        cropCycleName: [
          { required: true, message: "该选项不能为空" }
        ],
        agriculTypeName: [
          { required: true, message: "该选项不能为空" }
        ],
        startAt: [
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
        urlList: [
          { required: true, message: "该选项不能为空" }
        ],
        farmDes: [
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
    isComplete() {
      return this.isEdit && this.complete;
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
    show(id, complete) {
      this.editId = id;
      if (complete) {
        this.complete = complete;
      }
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.editId = undefined;
      this.submitDisabled = false;
      this.farmingPlan = {
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
    inputHandler(value, key) {
      _.set(this.farmingPlan, key, value);
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.getAgriculTypeList();
        this.getCropCycleList();
        this.getCameraList();
        if (this.isEdit) {
          this.getAgriculPlanDetail();
        }
        this.$refs.p1Form.clearValidate();
      } catch (err) {
        console.log(err);
      }
    },
    getAgriculPlanDetail() {
      let uuid = this.getCurrentCropValueByKey('uuid');
      this.$service.getAgriculPlanDetail(this.editId, uuid)
        .then((res) => {
          if (res && res.code === 0) {
            this.farmingPlan = res.data;
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
      let url = _.get(this.farmingPlan, `urlList`);
      let urlList = url.filter((item, _index) => _index !== index);
      this.inputHandler(urlList, `urlList`);
    },
    fileUploadHandler() {
      return data => {
        let urlList = _.get(this.farmingPlan, `urlList`);
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
      this.farmingPlan.farmId = farmId;
      this.farmingPlan.landId = id;
      this.farmingPlan.landCode = code;
      this.farmingPlan.landName = name;
      this.farmingPlan.plantId = _.get(this.plant, 'id');
      this.farmingPlan.plantName = this.getCurrentCropValueByKey('p1PlantName');
      this.farmingPlan.seedName = this.getCurrentCropValueByKey('p1SeedName');
      this.farmingPlan.uuid = this.getCurrentCropValueByKey('uuid');
      this.farmingPlan.cameraName = this.getCameraNameById(this.farmingPlan.cameraId);
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.p1Form.validate();
        if (valid) {
          if (this.isComplete) {
            this.formatReqBody();
            let res = await this.$service.completeAgriculPlan(this.farmingPlan);
            if (res && res.code === 0) {
              this.$message.success(`提交农事计划完成请求成功`);
              this.cancelHandler();
              this.getAgriculPlanList();
            } else {
              this.$message.error(`提交农事计划完成请求失败`);
              this.submitDisabled = false;
            }
          } else if (this.isEdit) {
            this.formatReqBody();
            let res = await this.$service.updateAgriculPlan(this.farmingPlan);
            if (res && res.code === 0) {
              this.$message.success(`农事计划编辑成功`);
              this.cancelHandler();
              this.getAgriculPlanList();
            } else {
              this.$message.error(`农事计划编辑失败`);
              this.submitDisabled = false;
            }
          } else {
            this.formatReqBody();
            let res = await this.$service.addAgriculPlan(this.farmingPlan);
            if (res && res.code === 0) {
              this.$message.success(`农事计划添加成功`);
              this.cancelHandler();
              this.getAgriculPlanList();
            } else {
              this.$message.error(`农事计划添加失败`);
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
</style>