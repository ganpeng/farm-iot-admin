<template>
  <el-dialog
    title="加工"
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
            :model="p5ProcessManage"
            :rules="validRules"
            status-icon
            ref="p1Form"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <el-col :span="12">
              <el-form-item label="加工方" prop="party">
                <el-select
                  :value="p5ProcessManage.party"
                  clearable
                  placeholder="请选择"
                  @change="inputHandler($event, `party`)"
                  @input="inputHandler($event, `party`)"
                >
                  <el-option
                    v-for="(item, index) in p5PartyOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="加工方批次" prop="batch">
                <el-input
                  :value="p5ProcessManage.batch"
                  @input="inputHandler($event, 'batch')"
                ></el-input>
              </el-form-item>
              <el-form-item label="加工量(公斤)" prop="amount">
                <el-input
                  :value="p5ProcessManage.amount"
                  @input="inputHandler($event, 'amount')"
                ></el-input>
              </el-form-item>
              <el-form-item label="加工时间" prop="date">
                <el-date-picker
                  :value="p5ProcessManage.date"
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
  name: 'ProcessingDialog',
  data() {
    return {
      submitDisabled: false,
      visible: false,
      editIndex: undefined,
      p5ProcessManage: {
        uuid: '', // 前端生成的uuid
        party: '', // 加工方
        name: '', // 加工方名称
        no: '', // 加工厂商证件号
        batch: '', // 加工批次
        amount: '', // 加工量
        date: '', // 加工时间
        isExpanded: false // 展开收起
      },
      validRules: {
        party: [
          { required: true, message: "该选项不能为空" }
        ],
        batch: [
          { required: true, message: "该选项不能为空" }
        ],
        amount: [
          { required: true, message: "该选项不能为空" },
          {
            pattern: constants.REG_EXP.positiveInteger2,
            message: "输入的加工量数值格式不对"
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
    // p5
    p5PartyOptions() {
      return this.dict.processingParty || [];
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
        this.p5ProcessManage = _.get(this.plant, `p5ProcessManage.${index}`);
      }
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.editIndex = undefined;
      this.submitDisabled = false;
      this.p5ProcessManage = {
        party: '', // 加工方
        name: '', // 加工方名称
        no: '', // 加工厂商证件号
        batch: '', // 加工批次
        amount: '', // 加工量
        date: '', // 加工时间
        isExpanded: false // 展开收起
      };
    },
    inputHandler(value, key) {
      _.set(this.p5ProcessManage, key, value);
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
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
            let newData = this.plant.p5ProcessManage.map((item, index) => {
              if (index === this.editIndex) {
                return this.p5ProcessManage;
              } else {
                return item;
              }
            });
            this.updateCurrentPlant({ key: "p5ProcessManage", value: newData });
          } else {
            let uuid = uuidv4();
            this.inputHandler(uuid, 'uuid');
            let p5ProcessManage = _.cloneDeep(this.plant.p5ProcessManage);
            let newData = _.concat(p5ProcessManage, [this.p5ProcessManage]);
            this.updateCurrentPlant({ key: "p5ProcessManage", value: newData });
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