<!--版本信息表单组件-->
<template>
  <div id="version-container">
    <div id="page-title">基本信息</div>
    <el-form
      :model="versionInfo"
      :rules="infoRules"
      status-icon
      ref="versionInfoBasic"
      label-width="160px"
      class="form-block fill-form">
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="版本名称" prop="name" label-width="181px" required>
          <el-input
            v-model="versionInfo.name"
            size="medium"
            maxlength="20"
            placeholder="请输入版本名称，20字以内">
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="类型" prop="clientType" label-width="181px" required>
          <el-radio-group v-model="versionInfo.clientType" @change="selectClientType">
            <el-radio label="ANDROID">Android</el-radio>
            <el-radio label="IOS">iOS</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="更新描述" prop="upgradeDesc" label-width="181px" required>
          <el-input
            type="textarea"
            maxlength="200"
            :rows="6"
            v-model="versionInfo.upgradeDesc"
            size="medium"
            placeholder="请输入更新描述">
          </el-input>
          <i class="notice">不超过200字</i>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="升级方式" prop="upgradeType" label-width="181px" required>
          <el-radio-group v-model="versionInfo.upgradeType">
            <el-radio label="FORCE">强制升级</el-radio>
            <el-radio label="OPTIONAL">选择升级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="升级包" prop="upgradeUrl" label-width="181px" required>
          <div class="upload-file-block" v-if="versionInfo.upgradeUrl">
            <div>{{versionInfo.versionName}}</div>
            <div class="remove-block" @click="removeUploadFile">
              删除
              <i>
                <svg-icon icon-class="remove_image_default"></svg-icon>
                <svg-icon icon-class="remove_image_hover"></svg-icon>
              </i>
            </div>
          </div>
          <uploader
            v-else
            :maxSize="102400"
            :status="1"
            :saveFileName="true"
            :type="versionInfo.clientType === 'ANDROID' ? '.apk' : '.ipa'"
            :uploadSuccessHandler="fileUploadHandler">
          </uploader>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div class="fixed-btn-container">
      <el-button
        class="btn-style-two"
        type="primary"
        @click="createVersion"
        :loading="isLoading">
        {{status === 'EDIT' ? '保存' : '新建'}}
      </el-button>
      <el-button class="btn-style-three" @click="toVersionList" plain>返回列表</el-button>
    </div>
  </div>
</template>

<script>
  import Uploader from "@/components/Uploader";

  export default {
    name: 'VersionForm',
    components: {
      Uploader
    },
    props: {
      status: {
        type: String,
        default: 'CREATE'
      }
    },
    data() {
      let checkName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入版本名称'));
        } else {
          callback();
        }
      };
      let checkClientType = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择类型'));
        } else {
          callback();
        }
      };
      let checkUpgradeType = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择升级方式'));
        } else {
          callback();
        }
      };
      let checkUpgradeDesc = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择更新描述'));
        } else {
          callback();
        }
      };
      let checkUpgradeUrl = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请上传升级包'));
        } else {
          callback();
        }
      };
      return {
        versionInfo: {
          name: '',
          clientType: '',
          upgradeType: '',
          upgradeDesc: '',
          upgradeUrl: '',
          versionName: '12343223454323456'
        },
        infoRules: {
          name: [
            {validator: checkName, trigger: 'change'},
            {validator: checkName, trigger: 'blur'}
          ],
          clientType: [
            {validator: checkClientType, trigger: 'change'},
          ],
          upgradeType: [
            {validator: checkUpgradeType, trigger: 'change'},
          ],
          upgradeDesc: [
            {validator: checkUpgradeDesc, trigger: 'change'},
            {validator: checkUpgradeDesc, trigger: 'blur'}
          ],
          upgradeUrl: [
            {validator: checkUpgradeUrl, trigger: 'change'}
          ],
        },
        isLoading: false
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.$util.toggleFixedBtnContainer();
        if (this.status === 'EDIT') {
          this.getVersionDetail();
        }
      },
      selectClientType() {
        this.versionInfo.upgradeUrl = '';
        this.versionInfo.versionName = '';
      },
      removeUploadFile() {
        this.versionInfo.upgradeUrl = '';
        this.versionInfo.versionName = '';
      },
      fileUploadHandler(data) {
        let {fileName, fileUrl} = data;
        this.versionInfo.upgradeUrl = fileUrl;
        this.versionInfo.versionName = fileName;
      },
      getVersionDetail() {
        this.$service.getVersionDetail(this.$route.params.no).then(response => {
          if (response && response.code === 0) {
            for (let key in response.data) {
              this.versionInfo[key] = response.data[key];
            }
          }
        })
      },
      createVersion() {
        this.$refs['versionInfoBasic'].validate().then((resolve, reject) => {
          if (resolve) {
            if (this.status === 'EDIT') {
              if (!this.$authority.isHasAuthority('admin:version:edit')) {
                return;
              }
              this.$service.updateVersion(this.versionInfo).then(response => {
                if (response && response.code === 0) {
                  this.$message.success('成功更新版本信息');
                  this.$router.push({name: 'VersionList'});
                }
              });
            } else {
              if (!this.$authority.isHasAuthority('admin:version:add')) {
                return;
              }
              this.$service.createVersion(this.versionInfo).then(response => {
                if (response && response.code === 0) {
                  this.$message.success('成功创建版本');
                  this.$router.push({name: 'VersionList'});
                }
              });
            }
          }
        }).catch((e) => {
        });
      },
      toVersionList() {
        if (!this.$authority.isHasAuthority('admin:version:page')) {
          return;
        }
        this.$router.push({name: 'VersionList'});
      }
    }
  };
</script>

<style lang="scss" scoped>

  #version-container {
    padding: 18px;
    #page-title {
      font-size: 16px;
      font-weight: 500;
      color: rgba(168, 171, 179, 1);
    }
  }

  .operate-block {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .el-radio-group {
    margin-top: 7px;
  }

  .notice {
    margin-left: 10px;
    align-self: flex-end;
    font-size: 12px;
    font-weight: 400;
    color: rgba(111, 116, 128, 1);
  }

  .uploader-container {
    margin-left: 0;
    padding-left: 0;
    padding-right: 15px;
  }

  .upload-file-block {
    height: 30px;
    display: flex;
    align-items: center;
    div:first-child {
      margin-right: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #9FA8B8;
    }
    div:last-child {
      cursor: pointer;
      font-size: 12px;
      font-weight: 400;
      color: #DC4A51;
      .svg-icon {
        width: 11px;
        height: 11px;
      }
      .svg-icon-remove_image_default {
        display: inline-block;
      }
      .svg-icon-remove_image_hover {
        display: none;
      }
      &:hover {
        .svg-icon-remove_image_default {
          display: none;
        }
        .svg-icon-remove_image_hover {
          display: inline-block;
        }
      }
    }
  }

</style>

<style lang="scss">

  #version-container {
    .el-radio-group {
      .el-radio.is-checked {
        .el-radio__label {
          color: rgba(168, 171, 179, 1);
        }
      }
    }
  }

</style>
