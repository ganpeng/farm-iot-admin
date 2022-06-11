<template>
  <el-dialog
    title="种植人员详情"
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
        ref="plantMemberForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基础信息</h4>
            <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <span class="value">{{plantMember.name}}</span>
                </el-form-item>
                <el-form-item label="身份证号" prop="identityId">
                  <span class="value">{{plantMember.identityId}}</span>
                </el-form-item>
                <el-form-item label="贫困户" prop="isPoor">
                  <span class="value">{{plantMember.isPoor ? '是' : '否'}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="联系电话" prop="mobile">
                  <span class="value">{{plantMember.mobile}}</span>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <span class="value">{{plantMember.gender === 'MALE' ? '男' : '女'}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="住址" prop="address">
                <p class="address">{{plantMember.address}}</p>
              </el-form-item>
            </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">参加培训</h4>
          <div class="training-list-container">
            <ul class="training-list">
              <li v-for="(training, index) in plantMember.trainingList"
                :key="index" class="training-item">
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
                    <el-form-item label="培训类型">
                      <span class="value">{{training.type}}</span>
                    </el-form-item>
                    <el-form-item label="组织者">
                      <span class="value">{{training.organizer}}</span>
                    </el-form-item>
                    <el-form-item label="培训时段">
                      <span class="value">{{training.startDate | formatDate('yyyy-MM-DD')}} ~ {{training.endDate | formatDate('yyyy-MM-DD')}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item class="img-form-item" label="培训证明">
                        <file-carousel
                          v-if="training.url.length > 0"
                          :deleteFile="deleteFileHandler(index, 'trainingList')" :hasDelete="false" :files="training.url"></file-carousel>
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
              <li v-for="(certificate, index) in plantMember.certificateList"
                :key="index" class="training-item">
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
                    <el-form-item label="证书名称">
                      <span class="value">{{certificate.name}}</span>
                    </el-form-item>
                    <el-form-item label="发证机关">
                      <span class="value">{{certificate.authority}}</span>
                    </el-form-item>
                    <el-form-item label="发证时间">
                      <span class="value">{{certificate.issueDate | formatDate('yyyy-MM-DD')}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="img-form-item" label="证书图片">
                      <file-carousel
                        v-if="certificate.url.length > 0"
                        :deleteFile="deleteFileHandler(index, 'certificateList')" :hasDelete="false" :files="certificate.url"></file-carousel>
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
  name: 'PlantMemberDetailDialog',
  components: {FileCarousel},
  data() {
    return {
      approveStatus: '',
      visible: false,
      id: '',
      isAdmin: false,
      checkId: '',
    };
  },
  mounted() {
    this.isAdmin = this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' || this.$wsCache.localStorage.get('login').roleType === 'CUSTOM';
  },
  computed: {
    ...mapGetters({
      plantMember: "plantMember/currentPlantMember",
      dict: 'dict/dict'
    })
  },
  methods: {
    ...mapMutations({
      updateExpandedByKeyIndex: "plantMember/updateExpandedByKeyIndex"
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
    expandHandler(key, index) {
      this.updateExpandedByKeyIndex({key, index});
    },
    deleteFileHandler() {},
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
