<template>
  <el-dialog
    title="仓储"
    class="my-dialog no-footer-border"
    width="60%"
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
            :model="p6SaveManage"
            :rules="validRules"
            status-icon
            ref="p1Form"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <el-col :span="12">
              <el-form-item label="仓储类型" prop="type">
                <el-select
                  :value="p6SaveManage.type"
                  clearable
                  placeholder="请选择"
                  @change="inputHandler($event, `type`)"
                  @input="inputHandler($event, `type`)"
                >
                  <el-option
                    v-for="(item, index) in p6TypeOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="仓储容量(公斤)" prop="totalAmount">
                <el-input
                  :value="p6SaveManage.totalAmount"
                  @input="inputHandler($event, 'totalAmount')"
                ></el-input>
              </el-form-item>
              <el-form-item label="本次仓储量(公斤)" prop="amount">
                <el-input
                  :value="p6SaveManage.amount"
                  @input="inputHandler($event, 'amount')"
                ></el-input>
              </el-form-item>
              <el-form-item label="入仓时间" prop="date">
                <el-date-picker
                  :value="p6SaveManage.date"
                  type="date"
                  value-format="timestamp"
                  :picker-options="datePickerOptions"
                  @input="inputHandler($event, `date`)"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="仓库地址"
                prop="address"
              >
                <p class="address">{{p6SaveManage.address}}</p>
                <address-select ref="p6AddressSelect"></address-select>
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
import AddressSelect from "@/components/AddressSelect";
export default {
  name: 'SaveDialog',
  components: { AddressSelect },
  data() {
    return {
      submitDisabled: false,
      visible: false,
      editIndex: undefined,
      p6SaveManage: {
        uuid: '', // 前端生成的uuid
        type: '', // 仓储类型
        address: '', // 仓库地址
        totalAmount: '', // 仓库容量
        amount: '', // 本次容量
        date: '', // 入仓时间
        isExpanded: false // 展开收起
      },
      validRules: {
        type: [
          { required: true, message: "该选项不能为空" }
        ],
        totalAmount: [
          { required: true, message: "该选项不能为空" },
          {
            pattern: constants.REG_EXP.positiveInteger2,
            message: "输入的加工量数值格式不对"
          }
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
        ],
        address: [
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
    // p6
    p6TypeOptions() {
      return this.dict.storageType || [];
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
        this.p6SaveManage = _.get(this.plant, `p6SaveManage.${index}`);
      }
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.editIndex = undefined;
      this.submitDisabled = false;
      this.p6SaveManage = {
        type: '', // 仓储类型
        address: '', // 仓库地址
        totalAmount: '', // 仓库容量
        amount: '', // 本次容量
        date: '', // 入仓时间
        isExpanded: false // 展开收起
      };
      this.$refs.p6AddressSelect.reset();
    },
    inputHandler(value, key) {
      _.set(this.p6SaveManage, key, value);
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
    setAddress() {
      let { address, areaCode } = _.get(this.$refs, `p6AddressSelect`).getAddress();
      if (address || areaCode) {
        this.inputHandler(address, `address`);
      }
    },
    async enterHandler() {
      try {
        this.setAddress();
        let valid = await this.$refs.p1Form.validate();
        if (valid) {
          let {id, code, area, farmId, form, name} = this.land;
          if (this.isEdit) {
            let newP6SaveManage = this.plant.p6SaveManage.map((item, index) => {
              if (index === this.editIndex) {
                return this.p6SaveManage;
              } else {
                return item;
              }
            });
            this.updateCurrentPlant({ key: "p6SaveManage", value: newP6SaveManage });
          } else {
            let uuid = uuidv4();
            this.inputHandler(uuid, 'uuid');
            let p6SaveManage = _.cloneDeep(this.plant.p6SaveManage);
            let newP6SaveManage = _.concat(p6SaveManage, [this.p6SaveManage]);
            this.updateCurrentPlant({ key: "p6SaveManage", value: newP6SaveManage });
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