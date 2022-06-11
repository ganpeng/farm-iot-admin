<template>
  <el-dialog
    title="农机具详情"
    class="my-dialog detail-dialog"
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
        class="my-form"
        ref="farmMachineForm"
        label-width="140px" @submit.native.prevent>
        <el-row>
          <h4 class="content-sub-title">基本信息</h4>
          <el-col :span="12">
            <el-form-item label="机械名称" prop="name">
              <span class="value">{{farmMachine.name}}</span>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <span class="value">{{farmMachine.brand}}</span>
            </el-form-item>
            <el-form-item label="动力类型" prop="powerType">
              <span class="value">{{farmMachine.powerType}}</span>
            </el-form-item>
            <el-form-item label="设备编号" prop="stbNo">
              <span class="value">{{farmMachine.stbNo}}</span>
            </el-form-item>
            <el-form-item label="购入价格(元)" prop="price">
              <span class="value">{{farmMachine.price}}</span>
            </el-form-item>
            <el-form-item class="img-form-item" label="文件" prop="fileList">
              <file-carousel v-if="farmMachine.fileList.length > 0" :hasDelete="false" :deleteFile="deleteFileHandler" :files="farmMachine.fileList"></file-carousel>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机械类型" prop="machineryType">
              <span class="value">{{farmMachine.machineryType}}</span>
            </el-form-item>
            <el-form-item label="生产厂家" prop="factory">
              <span class="value">{{farmMachine.factory}}</span>
            </el-form-item>
            <el-form-item label="额定功率(千万)" prop="ratedPower">
              <span class="value">{{farmMachine.ratedPower}}</span>
            </el-form-item>
            <el-form-item label="购入日期" prop="buyDate">
              <span class="value">{{farmMachine.buyDate | formatDate('yyyy-MM-DD')}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="approveStatus === 'APPROVING' && isAdmin" class="btn-style-three" @click="rejectEdit">拒绝</el-button>
      <el-button v-if="approveStatus === 'APPROVING' && isAdmin" class="btn-style-two" @click="passEdit">通过</el-button>
      <el-button v-if="approveStatus === 'REJECT'" class="check-status-btn">已拒绝</el-button>
      <el-button class="cancel-btn" @click="cancelHandler">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from "lodash";
import FileCarousel from '@/components/FileCarousel';
import constants from "@/util/constants";
import {passEdit, rejectEdit} from "@/util/asyncFun";
export default {
  name: "FarmMachineDetailDialog",
  components: {FileCarousel},
  data() {
    return {
      approveStatus: '',
      visible: false,
      isAdmin: false,
      checkId: '',
    };
  },
  mounted() {
    this.isAdmin = this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' || this.$wsCache.localStorage.get('login').roleType === 'CUSTOM';
  },
  computed: {
    ...mapGetters({
      farmMachine: "farmMachine/currentFarmMachine",
      dict: 'dict/dict'
    })
  },
  methods: {
    ...mapMutations({
      updateCurrentFarmMachine: "farmMachine/updateCurrentFarmMachine"
    }),
    show(approveStatus, checkId) {
      this.visible = true;
      this.approveStatus = approveStatus;
      this.checkId = checkId;
    },
    hide() {
      this.visible = false;
    },
    async openDialogHandler() {
      try {} catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    cancelHandler() {
      this.hide();
    },
    deleteFileHandler(index) {
      let fileList = this.farmMachine.fileList.filter((item, _index) => index !== _index);
      this.updateCurrentFarmMachine({key: "fileList", value: fileList});
    },
    async passEdit() {
      let result = await passEdit(this.checkId);
      if(result) {
        await this.$parent.getCheckList();
        this.cancelHandler();
      }
    },
    async rejectEdit() {
      let result = await rejectEdit(this.checkId);
      if(result) {
        await this.$parent.getCheckList();
        this.cancelHandler();
      }
    },
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
