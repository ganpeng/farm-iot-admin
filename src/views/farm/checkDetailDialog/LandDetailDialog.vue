<template>
  <el-dialog
    title="耕地详情"
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
        ref="landForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基本信息</h4>
            <el-col :span="12">
                <el-form-item label="地块编码">
                  <span class="value" v-if="land.code">{{land.code}}</span>
                  <span v-else class="no-value">创建后自动生成</span>
                </el-form-item>
                <el-form-item label="面积(公顷)" prop="area">
                  <span class="value">{{land.area}}</span>
                </el-form-item>
                <el-form-item label="地块形式" prop="form">
                  <span class="value">{{land.form}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="地块名称" prop="name">
                  <span class="value">{{land.name}}</span>
                </el-form-item>
                <el-form-item label="水利条件" prop="irrigation">
                  <span class="value">{{land.irrigation}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址" prop="address">
                <p class="address">{{land.address}}</p>
              </el-form-item>
            </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
            <h4 class="content-sub-title">地块流转方</h4>
            <div class="training-list-container">
              <ul class="training-list">
                <li v-for="(holder, index) in land.landHolderList"
                  :key="index" class="training-item">
                  <div class="training-item-header">
                    <div class="left">
                      <span class="title">流转方{{index + 1}}</span>
                    </div>
                    <div class="right">
                      <span
                        @click="expandHandler('landHolderList', index)"
                        :class="['expand-btn', holder.isExpanded && 'is-expanded']">
                        {{holder.isExpanded ? '收起' : '展开'}}
                        <svg-icon icon-class="array_top"/>
                      </span>
                    </div>
                  </div>
                  <div v-if="holder.isExpanded" class="training-item-content">
                    <el-col :span="12">
                      <el-form-item label="姓名">
                        <span class="value">{{holder.name}}</span>
                      </el-form-item>
                      <el-form-item label="身份证">
                        <span class="value">{{holder.identityId}}</span>
                      </el-form-item>
                      <el-form-item label="联系电话">
                        <span class="value">{{holder.mobile}}</span>
                      </el-form-item>
                      <el-form-item label="合同面积(公顷)">
                        <span class="value">{{holder.contractArea}}</span>
                      </el-form-item>
                      <el-form-item label="流转期限">
                        <span class="value">{{holder.startedAt | formatDate('yyyy-MM-DD')}} ~ {{holder.endedAt | formatDate('yyyy-MM-DD')}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实测面积(公顷)">
                        <span class="value">{{holder.area}}</span>
                      </el-form-item>
                      <el-form-item label="确权面积(公顷)">
                        <span class="value">{{holder.authenticArea}}</span>
                      </el-form-item>
                      <el-form-item class="img-form-item" label="流转合同">
                        <file-carousel
                          v-if="holder.contractPdfList.length > 0"
                          :deleteFile="deleteFileHandler(index)" :hasDelete="false" :files="holder.contractPdfList"></file-carousel>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="地块地址">
                        <p class="address">{{holder.address}}</p>
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
  name: 'LandDetailDialog',
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
  computed: {
    ...mapGetters({
      land: "land/currentLand",
      dict: 'dict/dict'
    })
  },
  mounted() {
    this.isAdmin = this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' || this.$wsCache.localStorage.get('login').roleType === 'CUSTOM';
  },
  methods: {
    ...mapMutations({
      updateExpandedByKeyIndex: 'land/updateExpandedByKeyIndex'
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
.no-value {
  font-size: 14px;
  color: #5F697C;
}
</style>
