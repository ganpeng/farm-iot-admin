<template>
  <el-dialog
    title="政府项目详情"
    class="my-dialog detail-dialog"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div class="dialog-body">
      <el-form
        ref="governmentProjectForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基本信息</h4>
            <el-col :span="12">
                <el-form-item label="项目名称" prop="projectName">
                  <span class="value">{{governmentProject.projectName}}</span>
                </el-form-item>
                <el-form-item label="所属部门" prop="belongDepartment">
                  <span class="value">{{governmentProject.belongDepartment}}</span>
                </el-form-item>
                <el-form-item label="负责人电话" prop="managerTel">
                  <span class="value">{{governmentProject.managerTel}}</span>
                </el-form-item>
                <el-form-item label="项目周期" prop="dateRange">
                  <span class="value">{{governmentProject.projectStartedAt | formatDate('yyyy-MM-DD')}} ~ {{governmentProject.projectEndedAt | formatDate('yyyy-MM-DD')}}</span>
                </el-form-item>
                <el-form-item label="项目总额(元)" prop="projectTotal">
                  <span class="value">{{governmentProject.projectTotal}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目级别" prop="projectClass">
                  <span class="value">{{governmentProject.projectClass}}</span>
              </el-form-item>
              <el-form-item label="项目负责人" prop="projectManager">
                  <span class="value">{{governmentProject.projectManager}}</span>
              </el-form-item>
              <el-form-item label="项目阶段" prop="projectStage">
                  <span class="value">{{governmentProject.projectStage}}</span>
              </el-form-item>
              <el-form-item label="政府拨款(元)" prop="appropriation">
                  <span class="value">{{governmentProject.appropriation}}</span>
              </el-form-item>
            </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
            <h4 class="content-sub-title">到账情况
              <span v-if="governmentProject.accountTotal"
              class="acount-total">到账总计: {{governmentProject.accountTotal}}元</span>
            </h4>
            <div class="training-list-container">
              <ul class="training-list">
                <li v-for="(accountArrival, index) in governmentProject.accountArrival"
                  :key="index" class="training-item">
                  <div class="training-item-header">
                    <div class="left">
                      <span class="title">记录{{index + 1}}</span>
                    </div>
                    <div class="right">
                      <span
                        @click="expandHandler('accountArrival', index)"
                        :class="['expand-btn', accountArrival.isExpanded && 'is-expanded']">
                        {{accountArrival.isExpanded ? '收起' : '展开'}}
                        <svg-icon icon-class="array_top"/>
                      </span>
                    </div>
                  </div>
                  <div v-if="accountArrival.isExpanded" class="training-item-content">
                    <el-col :span="12">
                      <el-form-item label="到账金额(元)">
                        <span class="value">{{accountArrival.amount}}</span>
                      </el-form-item>
                      <el-form-item label="到账日期">
                        <span class="value">{{accountArrival.date | formatDate('yyyy-MM-DD')}}</span>
                      </el-form-item>
                      <el-form-item label="到账方式">
                        <span class="value">{{accountArrival.mode}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="img-form-item" label="使用证明">
                        <file-carousel v-if="accountArrival.fileList.length > 0" :hasDelete="false" :deleteFile="deleteFileHandler(index, 'accountArrival')" :files="accountArrival.fileList"></file-carousel>
                      </el-form-item>
                    </el-col>
                  </div>
                </li>
              </ul>
            </div>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
            <h4 class="content-sub-title">使用明细</h4>
            <div class="training-list-container">
              <ul class="training-list">
                <li v-for="(_useDetail, index) in governmentProject.useDetail"
                  :key="index" class="training-item">
                  <div class="training-item-header">
                    <div class="left">
                      <span class="title">记录{{index + 1}}</span>
                    </div>
                    <div class="right">
                      <span
                        @click="expandHandler('useDetail', index)"
                        :class="['expand-btn', _useDetail.isExpanded && 'is-expanded']">
                        {{_useDetail.isExpanded ? '收起' : '展开'}}
                        <svg-icon icon-class="array_top"/>
                      </span>
                    </div>
                  </div>
                  <div v-if="_useDetail.isExpanded" class="training-item-content">
                    <el-col :span="12">
                      <el-form-item label="费用金额(元)">
                        <span class="value">{{_useDetail.amount}}</span>
                      </el-form-item>
                      <el-form-item label="费用类型">
                        <span class="value">{{_useDetail.type}}</span>
                      </el-form-item>
                      <el-form-item label="资金使用凭证号">
                        <span class="value">{{_useDetail.voucherNo}}</span>
                      </el-form-item>
                      <el-form-item label="费用产生时间">
                        <span class="value">{{_useDetail.date | formatDate('yyyy-MM-DD')}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="img-form-item" label="使用证明">
                        <file-carousel v-if="_useDetail.fileList.length > 0" :hasDelete="false" :deleteFile="deleteFileHandler(index, 'useDetail')" :files="_useDetail.fileList"></file-carousel>
                      </el-form-item>
                    </el-col>
                  </div>
                </li>
              </ul>
            </div>
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
import _ from 'lodash';
import FileCarousel from '@/components/FileCarousel';
import constants from '@/util/constants';
import {passEdit, rejectEdit} from "@/util/asyncFun";
export default {
  name: 'GovernmentProjectDetailDialog',
  components: {FileCarousel},
  data() {
    return {
      approveStatus: '',
      visible: false,
      isAdmin: false,
      checkId: '',
    };
  },
  computed: {
    ...mapGetters({
      governmentProject: "governmentProject/currentGovernmentProject",
      dict: 'dict/dict'
    })
  },
  mounted() {
    this.isAdmin = this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' || this.$wsCache.localStorage.get('login').roleType === 'CUSTOM';
  },
  methods: {
    ...mapMutations({
      updateExpandedByKeyIndex: "governmentProject/updateExpandedByKeyIndex"
    }),
    show(approveStatus, checkId) {
      this.visible = true;
      this.approveStatus = approveStatus;
      this.checkId = checkId;
    },
    hide() {
      this.visible = false;
    },
    expandHandler(key, index) {
      this.updateExpandedByKeyIndex({key, index});
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
    deleteFileHandler(index, key) {
      return (_index) => {
        let fileList = _.get(this.governmentProject, `${key}.${index}.fileList`);
        let _fileList = fileList.filter((item, __index) => _index !== __index);
        this.updateCurrentGovernmentProject({key: `${key}.${index}.fileList`, value: _fileList});
      }
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
</style>
