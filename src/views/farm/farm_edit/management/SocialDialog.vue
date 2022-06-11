<template>
  <el-dialog
    title="项目信息"
    class="my-dialog"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div class="dialog-body">
      <el-form
        :model="social"
        :rules="validRules"
        ref="socialForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基本信息</h4>
            <el-col :span="12">
              <el-form-item label="服务对象" prop="serviceClients">
                <el-select
                  :value="social.serviceClients"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, 'serviceClients')">
                  <el-option
                    v-for="item in serviceClientsOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="服务时间" prop="serviceTime">
                <el-date-picker
                  :value="social.serviceTime"
                  type="date"
                  @input="inputHandler($event, 'serviceTime')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="img-form-item" label="营收证明"
                prop="revenueCertificates"
              >
                <file-carousel
                  v-if="social.revenueCertificates.length > 0"
                  :deleteFile="deleteFileHandler" :files="social.revenueCertificates"></file-carousel>
                <uploader v-if="social.revenueCertificates.length < 5" :uploadSuccessHandler="fileUploadHandler"></uploader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="服务类型" prop="serviceType">
                  <el-select
                    :value="social.serviceType"
                    clearable
                    placeholder="请选择"
                    @input="inputHandler($event, 'serviceType')">
                    <el-option
                      v-for="item in serviceTypeOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="服务营收(元)" prop="revenue">
                  <el-input
                    :value="social.revenue"
                    type="number"
                    @input="inputHandler($event, 'revenue')">
                  </el-input>
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
import _ from 'lodash';
import FileCarousel from '@/components/FileCarousel';
import AddressSelect from '@/components/AddressSelect';
import Uploader from '@/components/Uploader';
import constants from '@/util/constants';
import {inputFarmEditContent} from "@/util/asyncFun";
export default {
  name: 'SocialDialog',
  components: {FileCarousel, AddressSelect, Uploader},
  data() {
    return {
      submitDisabled: false,
      visible: false,
      id: '',
      validRules: {
        serviceClients: [{required: true, message: "请选择服务对象"}],
        serviceTime: [{required: true, message: "请选择服务时间"}],
        revenueCertificates: [{required: true, message: "请上传营收证明"}],
        serviceType: [{required: true, message: "请选择服务类型"}],
        revenue: [
          {required: true, message: "请输入服务营收"},
          {pattern: constants.REG_EXP.positiveNumber, message: '请输入正确的金额'}
        ]
      },
    };
  },
  computed: {
    ...mapGetters({
      social: "social/currentSocial",
      dict: 'dict/dict'
    }),
    serviceClientsOptions() {
      return this.dict.serviceClient || [];
    },
    serviceTypeOptions() {
      return this.dict.serviceType || [];
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentSocial: "social/updateCurrentSocial"
    }),
    ...mapActions({
      createSocial: 'social/createSocial',
      updateSocialById: 'social/updateSocialById',
      getSocialList: 'social/getSocialList'
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
      this.updateCurrentSocial({key, value});
    },
    // 农场主角色 填写更新内容 wangshuo
    editContent(value) {
      this.updateCurrentSocial({key: 'updateInfo', value})
    },    
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.$refs.socialForm.clearValidate();
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
    deleteFileHandler(index) {
        let fileList = _.get(this.social, 'revenueCertificates');
        let _fileList = fileList.filter((item, _index) => index !== _index);
        this.updateCurrentSocial({key: 'revenueCertificates', value: _fileList});
    },
    fileUploadHandler(data) {
        let fileList = _.get(this.social, 'revenueCertificates');
        let _fileList = _.chain(fileList)
                        .concat(data)
                        .uniqBy('fileUrl')
                        .value();
        this.updateCurrentSocial({key: 'revenueCertificates', value: _fileList});
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.socialForm.validate();
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
            let res = await this.updateSocialById({id: this.id, farmId: id});
            if (res && res.code === 0) {
              await this.getSocialList(id);
              this.cancelHandler();
            }
          } else {
            let res = await this.createSocial(id);
            if (res && res.code === 0) {
              await this.getSocialList(id);
              this.cancelHandler();
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
