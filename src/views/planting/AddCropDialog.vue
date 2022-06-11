<template>
  <el-dialog
    title="作物"
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
            :model="p1"
            :rules="validRules"
            status-icon
            ref="p1Form"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <el-col :span="12">
              <el-form-item label="作物分类" prop="p1PlantType">
                <el-select
                  :value="p1.p1PlantType"
                  clearable
                  placeholder="请选择"
                  @change="p1PlantTypeChangeHandler($event)"
                  @input="inputHandler($event, `p1PlantType`)"
                >
                  <el-option
                    v-for="(item, index) in plantTypeOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="作物名称" prop="p1PlantName">
                <el-select
                  :value="p1.p1PlantName"
                  clearable
                  placeholder="请选择"
                  @change="p1PlantNameChangeHandler($event)"
                  @input="inputHandler($event, `p1PlantName`)"
                >
                  <el-option
                    v-for="(item, _index) in p1.p1PlantNameOptions"
                    :key="_index + uniqId"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品种" prop="p1SeedName">
                <el-select
                  :value="p1.p1SeedName"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, `p1SeedName`)"
                >
                  <el-option
                    v-for="(item, _index) in p1.p1SeedNameOptions"
                    :key="_index + uniqId"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="作物面积" prop="p1PlantArea">
                <el-input
                  :value="p1.p1PlantArea"
                  @input="inputHandler($event, 'p1PlantArea')"
                ></el-input>
              </el-form-item>
              <el-form-item label="种子批号" prop="p1SeedBatchNo">
                <el-input
                  :value="p1.p1SeedBatchNo"
                  @input="inputHandler($event, 'p1SeedBatchNo')"
                ></el-input>
              </el-form-item>
              <el-form-item label="种子公司名称" prop="p1SeedCompanyName">
                <el-input
                  :value="p1.p1SeedCompanyName"
                  @input="inputHandler($event, 'p1SeedCompanyName')"
                ></el-input>
              </el-form-item>
              <el-form-item label="育苗时间" prop="dateRange">
                <el-date-picker
                  :value="p1.dateRange"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  @input="inputHandler($event, `dateRange`)"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="种植时间" prop="p1PlantDate">
                <el-date-picker
                  :value="p1.p1PlantDate"
                  type="date"
                  value-format="timestamp"
                  @input="inputHandler($event, `p1PlantDate`)"
                ></el-date-picker>
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
import constants from "@/util/constants";
export default {
  name: "AddCropDialog",
  data() {
    return {
      submitDisabled: false,
      visible: false,
      editIndex: undefined,
      p1: {
        uuid: '', // 前端生成的uuid
        p1PlantName: '', // 作物名称
        p1PlantType: '', // 作物分类
        p1SeedName: '', // 作物品种
        p1PlantArea: '', // 作物面积
        dateRange: [], // 时间区间
        p1FishCount: '', // 鱼的条数
        p1PlantNameOptions: [], // 作物名称下拉选项
        p1SeedNameOptions: [], // 品种下拉选项
        p1PlantDate: '', // 种植时间
        p1PlantedStart: '', // 育苗开始时间
        p1PlantedEnd: '', // 育苗结束时间
        p1SeedBatchNo: '', // 种子批号
        p1SeedCompanyName: '', // 种子公司名称
        isExpanded: false // 展开收起
      },
      validRules: {
        p1PlantType: [
          { required: true, message: "该选项不能为空" }
        ],
        p1PlantName: [
          { required: true, message: "该选项不能为空" }
        ],
        p1SeedName: [
          { required: true, message: "该选项不能为空" }
        ],
        p1PlantDate: [
          { required: true, message: "该选项不能为空" }
        ],
        p1PlantArea: [
          { required: true, message: "该输入作物面积" },
          {
            pattern: constants.REG_EXP.positiveInteger2,
            message: "输入的面积数值格式不对"
          }
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
    // p1
    plantTypeOptions() {
      return this.dict.cropType || [];
    },
    uniqId() {
      return _.uniqueId("option_key");
    },
    isEdit() {
      return this.editIndex !== undefined && this.editIndex !== null;
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentPlant: 'plant/updateCurrentPlant'
    }),
    ...mapActions({
      createPlant: "plant/createPlant",
      getPlantById: "plant/getPlantById"
    }),
    show(index) {
      this.editIndex = index;
      if (this.isEdit) {
        this.p1 = _.get(this.plant, `p1.${index}`);
      }
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.editIndex = undefined;
      this.submitDisabled = false;
      this.p1 = {
        p1PlantName: '', // 作物名称
        p1PlantType: '', // 作物分类
        p1SeedName: '', // 作物品种
        p1PlantArea: '', // 作物面积
        dateRange: [], // 时间区间
        p1FishCount: '', // 鱼的条数
        p1PlantNameOptions: [], // 作物名称下拉选项
        p1SeedNameOptions: [], // 品种下拉选项
        p1PlantDate: '', // 种植时间
        p1PlantedStart: '', // 育苗开始时间
        p1PlantedEnd: '', // 育苗结束时间
        p1SeedBatchNo: '', // 种子批号
        p1SeedCompanyName: '' // 种子公司名称
      };
    },
    inputHandler(value, key) {
      _.set(this.p1, key, value);
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        console.log(this.land);
        this.$refs.p1Form.clearValidate();
      } catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    async cancelHandler() {
      this.hide();
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.p1Form.validate();
        if (valid) {
          let {id, code, area, farmId, form, name} = this.land;
          if (this.isEdit) {
            let newData = this.plant.p1.map((item, index) => {
              if (index === this.editIndex) {
                return this.p1;
              } else {
                return item;
              }
            });
            this.updateCurrentPlant({ key: "p1", value: newData });
          } else {
            let uuid = uuidv4();
            this.inputHandler(uuid, 'uuid');
            let p1 = _.cloneDeep(this.plant.p1);
            let newData = _.concat(p1, [this.p1]);
            this.updateCurrentPlant({ key: "p1", value: newData });
          }
          this.updateCurrentPlant({ key: "farmLandId", value: id });
          this.updateCurrentPlant({ key: "farmLandCode", value: code });
          this.updateCurrentPlant({ key: "area", value: area });
          this.updateCurrentPlant({ key: "form", value: form });
          this.updateCurrentPlant({ key: "landName", value: name });
          let res = await this.createPlant(farmId);
          if (res && res.code === 0) {
            this.cancelHandler();
            this.$message.success(`记录添加成功`);
            this.getPlantById(id);
          } else {
            this.submitDisabled = false;
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    p1PlantTypeChangeHandler(value) {
      let p1PlantType = this.plantTypeOptions.find(item => item.name === value);
      let options = this.dictList.filter(
        item => parseInt(item.parentId) === _.get(p1PlantType, "id")
      );
      // 先清除字段的值
      this.inputHandler('', `p1SeedName`);
      this.inputHandler('', `p1PlantName`);
      // 再清除下拉选项
      this.inputHandler(options, `p1PlantNameOptions`);
      this.inputHandler([], `p1SeedNameOptions`);
    },
    p1PlantNameChangeHandler(value) {
      let plantNameOptions = _.get(this.p1, `p1PlantNameOptions`);
      let plantName = plantNameOptions.find(item => item.name === value);
      let options = this.dictList.filter(
        item => parseInt(item.parentId) === _.get(plantName, "id")
      );
      // 先清除字段的值
      this.inputHandler('', `p1SeedName`);
      this.inputHandler(options, `p1SeedNameOptions`);
    }
  }
};
</script>
<style lang="scss" scoped>
.plant-protection-detail-container {}
</style>
