<template>
  <el-dialog
    title="农机具信息"
    class="my-dialog"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-body">
      <el-form
        :model="farmMachine"
        class="my-form"
        ref="farmMachineForm"
        :rules="validRules"
        label-width="140px" @submit.native.prevent>
        <el-row>
          <h4 class="content-sub-title">基本信息</h4>
          <el-col :span="12">
            <el-form-item label="机械名称" prop="name">
              <el-input :value="farmMachine.name" @input="inputHandler($event, 'name')"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-input :value="farmMachine.brand" @input="inputHandler($event, 'brand')"></el-input>
            </el-form-item>
            <el-form-item label="动力类型" prop="powerType">
              <el-select
                :value="farmMachine.powerType"
                clearable
                placeholder="请选择"
                @input="inputHandler($event, 'powerType')"
              >
                <el-option
                  v-for="item in powerTypeOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备编号" prop="stbNo">
              <el-input :value="farmMachine.stbNo" @input="inputHandler($event, 'stbNo')"></el-input>
            </el-form-item>
            <el-form-item label="购入价格(元)" prop="price">
              <el-input
                type="number"
                :value="farmMachine.price"
                @input="inputHandler($event, 'price')"></el-input>
            </el-form-item>
            <el-form-item class="img-form-item" label="文件" prop="fileList">
              <file-carousel v-if="farmMachine.fileList.length > 0" :deleteFile="deleteFileHandler" :files="farmMachine.fileList"></file-carousel>
              <uploader v-if="farmMachine.fileList.length < 5" :uploadSuccessHandler="fileUploadHandler"></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机械类型" prop="machineryType">
              <el-select
                :value="farmMachine.machineryType"
                clearable
                placeholder="请选择"
                @input="inputHandler($event, 'machineryType')"
              >
                <el-option
                  v-for="item in farmMachineTypeOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产厂家" prop="factory">
              <el-input :value="farmMachine.factory" @input="inputHandler($event, 'factory')"></el-input>
            </el-form-item>
            <el-form-item label="额定功率(千瓦)" prop="ratedPower">
              <el-input type="number" :value="farmMachine.ratedPower" @input="inputHandler($event, 'ratedPower')"></el-input>
            </el-form-item>
            <el-form-item label="购入日期" prop="buyDate">
              <el-date-picker
                :value="farmMachine.buyDate"
                type="date"
                prefix-icon="''"
                @input="inputHandler($event, 'buyDate')"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">取 消</el-button>
      <el-button :disabled="submitDisabled" class="enter-btn" @click="enterHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from "lodash";
import Uploader from '@/components/Uploader';
import FileCarousel from '@/components/FileCarousel';
import constants from "@/util/constants";
import {inputFarmEditContent} from "@/util/asyncFun";
export default {
  name: "FarmMachineDialog",
  components: {FileCarousel, Uploader},
  data() {
    let checkRatedPower = (rule, value, callback) => {
      if (!_.isEmpty(value)) {
        if (!constants.REG_EXP.positiveInteger6.test(value)) {
          callback(new Error('请输入正确的额定功率'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      submitDisabled: false,
      visible: false,
      id: '',
      validRules: {
        name: [{required: true, message: "请输入名称"}],
        price: [
          {required: true, message: "请输入价格"},
          {pattern: constants.REG_EXP.positiveNumber, message: '请输入正确的金额'}
        ],
        // brand: [{required: true, message: "请输入品牌"}],
        // stbNo: [{required: true, message: "请输入设备编号"}],
        ratedPower: [
          { validator: checkRatedPower }
          // {required: true, message: "请输入额定功率"},
          // {pattern: constants.REG_EXP.positiveInteger2, message: '请输入正确的额定功率'}
        ],
        // factory: [{required: true, message: "请输入生产厂家"}],
        buyDate: [{required: true, message: "请输入购入日期"}],
        machineryType: [{required: true, message: "请选择类型"}],
        powerType: [{required: true, message: "请选择动力类型"}]
      }
    };
  },
  computed: {
    ...mapGetters({
      farmMachine: "farmMachine/currentFarmMachine",
      dict: 'dict/dict'
    }),
    farmMachineTypeOptions() {
      return this.dict.machineryType || [];
    },
    powerTypeOptions() {
      return this.dict.powerType || [];
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentFarmMachine: "farmMachine/updateCurrentFarmMachine"
    }),
    ...mapActions({
      createFarmMachine: 'farmMachine/createFarmMachine',
      updateFarmMachineById: 'farmMachine/updateFarmMachineById',
      getFarmMachineList: 'farmMachine/getFarmMachineList'
    }),
    show(id) {
      this.visible = true;
      this.id = id;
    },
    hide() {
      this.id = '';
      this.visible = false;
    },
    inputHandler(value, key) {
      this.updateCurrentFarmMachine({key, value});
    },
    // 农场主角色 填写更新内容 wangshuo
    editContent(value) {
      this.updateCurrentFarmMachine({key: 'updateInfo', value})
    },    
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.$refs.farmMachineForm.clearValidate();
      } catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    cancelHandler() {
      this.hide();
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.farmMachineForm.validate();
        if (valid) {
          let {id} = this.$route.params;
          this.submitDisabled = true;
          // 农场主权限 需要填写更新内容 wangshuo
          if(this.$wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || this.$wsCache.localStorage.get('login').roleType === 'FARM_OWNER') {
            let isEdit = await inputFarmEditContent(this.editContent);
            if(!isEdit) {
              this.submitDisabled = false;
              return;
            }
          } 
          if (this.id) {           
            let res = await this.updateFarmMachineById(this.id);
            if (res && res.code === 0) {
              await this.getFarmMachineList(id)
              this.cancelHandler();
            } else {
              this.submitDisabled = false;
            }
          } else {
            let res = await this.createFarmMachine(id);
            if (res && res.code === 0) {
              await this.getFarmMachineList(id);
              this.cancelHandler();
            } else {
              this.submitDisabled = false;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    deleteFileHandler(index) {
      let fileList = this.farmMachine.fileList.filter((item, _index) => index !== _index);
      this.updateCurrentFarmMachine({key: "fileList", value: fileList});
    },
    fileUploadHandler(data) {
      let fileList = _.chain(this.farmMachine.fileList)
                      .concat(data)
                      .uniqBy('fileUrl')
                      .value();
      this.updateCurrentFarmMachine({key: "fileList", value: fileList});
    }
  }
};
</script>
<style lang="scss" scoped>
.min-input {
  width: 140px !important;
}
.file-list {
  display: flex;
  .file-item {
    width: 300px;
    height: 300px;
    border-radius: 4px;
    img {
      width: 300px;
    }
  }
  .file-item + .file-item {
    margin-left: 10px;
  }
}
</style>
