<template>
  <el-dialog
    title="经营人员详情"
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
        ref="manageMemberForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent
      >
        <el-row>
          <h4 class="content-sub-title">基础信息</h4>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <span class="value">{{manageMember.name}}</span>
            </el-form-item>
            <el-form-item label="身份证号" prop="identityId">
              <span class="value">{{manageMember.identityId}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile">
              <span class="value">{{manageMember.mobile}}</span>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <span class="value">{{manageMember.gender === 'MALE' ? '男' : '女'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="住址" prop="address">
              <p class="address">{{manageMember.address}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">出资信息</h4>
          <el-row>
            <el-col :span="12">
              <el-form-item label="现金出资" prop="isFundInvest">
                <span class="value">{{manageMember.isFundInvest ? '是' : '否'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="manageMember.isFundInvest" label="现金出资金额(元)" prop="fundAmount">
                <span class="value">{{manageMember.fundAmount}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="土地出资" prop="isLandInvest">
                <span class="value">{{manageMember.isLandInvest ? '是' : '否'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="manageMember.isLandInvest" label="出地面积(公顷)" prop="landArea">
                <span class="value">{{manageMember.landArea}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">参加培训</h4>
          <div class="training-list-container">
            <ul class="training-list">
              <li
                v-for="(training, index) in manageMember.trainingList"
                :key="index"
                class="training-item"
              >
                <div class="training-item-header">
                  <div class="left">
                    <span class="title">培训{{index + 1}}</span>
                  </div>
                  <div class="right">
                    <span
                      @click="expandHandler('trainingList', index)"
                      :class="['expand-btn', training.isExpanded && 'is-expanded']">
                      {{training.isExpanded ? '收起' : '展开'}}
                      <svg-icon icon-class="array_top"/>
                    </span>
                  </div>
                </div>
                <div v-if="training.isExpanded" class="training-item-content">
                  <el-col :span="12">
                    <el-form-item
                      label="培训类型"
                    >
                      <span class="value">{{training.type}}</span>
                    </el-form-item>
                    <el-form-item
                      label="组织者"
                    >
                      <span class="value">{{training.organizer}}</span>
                    </el-form-item>
                    <el-form-item
                      label="培训时段"
                    >
                      <span class="value">{{training.startDate | formatDate('yyyy-MM-DD')}} ~ {{training.endDate | formatDate('yyyy-MM-DD')}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      class="img-form-item"
                      label="培训证明"
                    >
                      <file-carousel
                        v-if="training.url.length > 0"
                        :hasDelete="false"
                        :deleteFile="deleteFileHandler(index, 'trainingList')"
                        :files="training.url"
                      ></file-carousel>
                    </el-form-item>
                  </el-col>
                </div>
              </li>
            </ul>
          </div>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">所获证书</h4>
          <div class="training-list-container">
            <ul class="training-list">
              <li
                v-for="(certificate, index) in manageMember.certificateList"
                :key="index"
                class="training-item"
              >
                <div class="training-item-header">
                  <div class="left">
                    <span class="title">证书{{index + 1}}</span>
                  </div>
                  <div class="right">
                    <span
                      @click="expandHandler('certificateList', index)"
                      :class="['expand-btn', certificate.isExpanded && 'is-expanded']">
                      {{certificate.isExpanded ? '收起' : '展开'}}
                      <svg-icon icon-class="array_top"/>
                    </span>
                  </div>
                </div>
                <div v-if="certificate.isExpanded" class="training-item-content">
                  <el-col :span="12">
                    <el-form-item
                      label="证书名称"
                    >
                      <span class="value">{{certificate.name}}</span>
                    </el-form-item>
                    <el-form-item
                      label="发证机关"
                    >
                      <span class="value">{{certificate.authority}}</span>
                    </el-form-item>
                    <el-form-item
                      label="发证时间"
                    >
                      <span class="value">{{certificate.issueDate | formatDate('yyyy-MM-DD')}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      class="img-form-item"
                      label="证书图片"
                    >
                      <file-carousel
                        v-if="certificate.url.length > 0"
                        :hasDelete="false"
                        :deleteFile="deleteFileHandler(index, 'certificateList')"
                        :files="certificate.url"
                      ></file-carousel>
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
import { mapGetters, mapMutations } from "vuex";
import FileCarousel from "@/components/FileCarousel";
import {passEdit, rejectEdit} from "@/util/asyncFun";
import _ from "lodash";
export default {
  name: "ManageMemberDetailDialog",
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
      manageMember: "manageMember/currentManageMember",
      dict: 'dict/dict'
    })
  },
  methods: {
    ...mapMutations({
      updateExpandedByKeyIndex: 'manageMember/updateExpandedByKeyIndex'
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
      try {
        console.log(this.manageMember);
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
    expandHandler(key, index) {
      this.updateExpandedByKeyIndex({key, index});
    },
    deleteFileHandler(index) {
      console.log(index);
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
