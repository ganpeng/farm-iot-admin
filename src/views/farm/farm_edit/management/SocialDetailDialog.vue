<template>
  <el-dialog
    title="社会化服务详情"
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
        ref="socialForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基本信息</h4>
            <el-col :span="12">
              <el-form-item label="服务对象" prop="serviceClients">
                <span class="value">{{social.serviceClients}}</span>
              </el-form-item>
              <el-form-item label="服务时间" prop="serviceTime">
                <span class="value">{{social.serviceTime | formatDate('yyyy-MM-DD')}}</span>
              </el-form-item>
              <el-form-item class="img-form-item" label="营收证明" prop="revenueCertificates">
                <file-carousel
                  v-if="social.revenueCertificates.length > 0"
                  :deleteFile="deleteFileHandler" :files="social.revenueCertificates"></file-carousel>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="服务类型" prop="serviceType">
                  <span class="value">{{social.serviceType}}</span>
                </el-form-item>
                <el-form-item label="服务营收(元)" prop="revenue">
                  <span class="value">{{social.revenue}}</span>
                </el-form-item>
            </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {mapGetters} from 'vuex';
import _ from 'lodash';
import FileCarousel from '@/components/FileCarousel';
import constants from '@/util/constants';
export default {
  name: 'SocialDetailDialog',
  components: {FileCarousel},
  data() {
    return {
      visible: false
    };
  },
  computed: {
    ...mapGetters({
      social: "social/currentSocial",
      dict: 'dict/dict'
    })
  },
  methods: {
    show() {
      this.visible = true;
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
        let fileList = _.get(this.social, 'revenueCertificates');
        let _fileList = fileList.filter((item, _index) => index !== _index);
        this.updateCurrentSocial({key: 'revenueCertificates', value: _fileList});
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
