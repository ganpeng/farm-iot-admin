<template>
  <el-dialog
    title="农机具使用"
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
            :model="p9MachineryUse"
            :rules="validRules"
            status-icon
            ref="p1Form"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <el-col :span="12">
              <el-form-item label="农机具来源" prop="source">
                <el-select
                  :value="p9MachineryUse.source"
                  clearable
                  placeholder="请选择"
                  @change="inputHandler($event, `source`)"
                  @input="inputHandler($event, `source`)"
                >
                  <el-option
                    v-for="(item, index) in p9SourceOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="p9MachineryUse.source === '自有'" label="农机具名称" prop="name">
                <el-select
                  :value="p9MachineryUse.name"
                  clearable
                  placeholder="请选择"
                  @change="inputHandler($event, `name`)"
                  @input="inputHandler($event, `name`)"
                >
                  <el-option
                    v-for="(item, index) in p9MachinerUseNameOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else label="农机具名称" prop="name">
                <el-input
                  :value="p9MachineryUse.name"
                  @input="inputHandler($event, 'name')"
                ></el-input>
              </el-form-item>
              <el-form-item label="作业面积(公顷)" prop="area">
                <el-input
                  :value="p9MachineryUse.area"
                  @input="inputHandler($event, 'area')"
                ></el-input>
              </el-form-item>
              <el-form-item label="农机具类型" prop="type">
                <el-select
                  :value="p9MachineryUse.type"
                  clearable
                  placeholder="请选择"
                  @change="inputHandler($event, `type`)"
                  @input="inputHandler($event, `type`)"
                >
                  <el-option
                    v-for="(item, index) in farmMachineTypeOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="使用时间" prop="date">
                <el-date-picker
                  :value="p9MachineryUse.date"
                  type="date"
                  value-format="timestamp"
                  :picker-options="datePickerOptions"
                  @input="inputHandler($event, `date`)"
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
  name: 'MachineryDialog',
  data() {
    return {
      submitDisabled: false,
      visible: false,
      editIndex: undefined,
      p9SourceOptions: constants.P9_SOURCE_OPTIONS,
      p9MachinerUseNameOptions: [],
      p9MachineryUse: {
        uuid: '', // 前端生成的uuid
        source: '', // 农机具来源
        type: '', // 农机具类型
        name: '', // 农机具名称
        date: '', // 使用时间
        area: '', // 做用面积
        isExpanded: false // 展开收起
      },
      validRules: {
        source: [
          { required: true, message: "该选项不能为空" }
        ],
        type: [
          { required: true, message: "该选项不能为空" }
        ],
        name: [
          { required: true, message: "该选项不能为空" }
        ],
        area: [
          { required: true, message: "该选项不能为空" },
          {
            pattern: constants.REG_EXP.positiveInteger2,
            message: "请输入正确的数值"
          }
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
    // p9
    farmMachineTypeOptions() {
      return this.dict.machineryType || [];
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
        this.p9MachineryUse = _.get(this.plant, `p9MachineryUse.${index}`);
      }
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.editIndex = undefined;
      this.submitDisabled = false;
      this.p9MachinerUseNameOptions = [];
      this.p9MachineryUse = {
        source: '', // 农机具来源
        type: '', // 农机具类型
        name: '', // 农机具名称
        date: '', // 使用时间
        area: '', // 做用面积
        isExpanded: false // 展开收起
      };
    },
    inputHandler(value, key) {
      _.set(this.p9MachineryUse, key, value);
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.getFarmMachineList();
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
    async getFarmMachineList() {
      try {
        let { id } = this.$route.params;
        let res = await this.$service.getFarmMachineList({ farmId: id });
        if (res && res.code === 0) {
          this.p9MachinerUseNameOptions = _.get(res.data, `list`) || [];
        }
      } catch (err) {
        console.log(err);
      }
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.p1Form.validate();
        if (valid) {
          let {id, code, area, farmId, form, name} = this.land;
          if (this.isEdit) {
            let newData = this.plant.p9MachineryUse.map((item, index) => {
              if (index === this.editIndex) {
                return this.p9MachineryUse;
              } else {
                return item;
              }
            });
            this.updateCurrentPlant({ key: "p9MachineryUse", value: newData });
          } else {
            let uuid = uuidv4();
            this.inputHandler(uuid, 'uuid');
            let p9MachineryUse = _.cloneDeep(this.plant.p9MachineryUse);
            let newData = _.concat(p9MachineryUse, [this.p9MachineryUse]);
            this.updateCurrentPlant({ key: "p9MachineryUse", value: newData });
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
    }
  }
}
</script>