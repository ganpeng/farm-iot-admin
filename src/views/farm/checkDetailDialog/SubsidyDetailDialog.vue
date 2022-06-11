<template>
  <el-dialog
    title="专项补贴详情"
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
        ref="subsidyForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基本信息</h4>
            <el-col :span="12">
              <el-form-item label="补贴类型" prop="subsidyType">
                <span class="value">{{subsidy.subsidyType}}</span>
              </el-form-item>
              <el-form-item label="申请负责人" prop="applyManager">
                <span class="value">{{subsidy.applyManager}}</span>
              </el-form-item>
              <el-form-item label="政府负责人" prop="governmentAgent">
                <span class="value">{{subsidy.governmentAgent}}</span>
              </el-form-item>
              <el-form-item label="申请时间" prop="applyTime">
                <span class="value">{{subsidy.applyTime | formatDate('yyyy-MM-DD')}}</span>
              </el-form-item>
              <el-form-item label="补贴状态" prop="subsidyStatus">
                <span class="value">{{subsidy.subsidyStatus}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="文件编号" prop="fileNo">
                  <span class="value">{{subsidy.fileNo}}</span>
                </el-form-item>
                <el-form-item label="申请人电话" prop="applicantTel">
                  <span class="value">{{subsidy.applicantTel}}</span>
                </el-form-item>
                <el-form-item label="政府负责人电话" prop="governmentAgentTel">
                  <span class="value">{{subsidy.governmentAgentTel}}</span>
                </el-form-item>
                <el-form-item label="通过时间" prop="approveTime">
                  <span class="value">{{subsidy.approveTime | formatDate('yyyy-MM-DD')}}</span>
                </el-form-item>
                <el-form-item label="补贴金额(元)" prop="subsidyMoney">
                  <span class="value">{{subsidy.subsidyMoney}}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
            <h4 class="content-sub-title">到账情况
              <span v-if="subsidy.accountTotal"
              class="acount-total">到账总计: {{subsidy.accountTotal}}元</span>
            </h4>
            <div class="training-list-container">
              <ul class="training-list">
                <li v-for="(accountArrival, index) in subsidy.accountArrival"
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
                      <el-form-item class="img-form-item" label="到账证明">
                        <file-carousel
                          v-if="accountArrival.fileList.length > 0"
                          :deleteFile="deleteFileHandler(index, 'accountArrival')"
                          :files="accountArrival.fileList" :hasDelete="false"></file-carousel>
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
                <li v-for="(_useDetail, index) in subsidy.useDetail"
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
                      <el-form-item class="img-form-item" label="到账证明">
                        <file-carousel
                          v-if="_useDetail.fileList.length > 0"
                          :deleteFile="deleteFileHandler(index, 'useDetail')" :hasDelete="false" :files="_useDetail.fileList"></file-carousel>
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
  name: 'SubsidyDialog',
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
      subsidy: "subsidy/currentSubsidy",
      dict: 'dict/dict'
    })
  },
  mounted() {
    this.isAdmin = this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' || this.$wsCache.localStorage.get('login').roleType === 'CUSTOM';
  },
  methods: {
    ...mapMutations({
      updateExpandedByKeyIndex: "subsidy/updateExpandedByKeyIndex"
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
        let fileList = _.get(this.subsidy, `${key}.${index}.fileList`);
        let _fileList = fileList.filter((item, __index) => _index !== __index);
        this.updateCurrentSubsidy({key: `${key}.${index}.fileList`, value: _fileList});
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
