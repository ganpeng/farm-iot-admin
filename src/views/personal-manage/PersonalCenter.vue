<template>
  <div id="personal-container">
    <div id="info-block">
      <div class="header">基本信息</div>
      <div class="info">
        <div class="avatar">
          <img :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl"/>
          <img src="../../assets/img/avatar_default.png" v-else/>
          <label @click="uploadAvatar">更改头像</label>
        </div>
        <div class="list">
          <div>
            <label>姓名</label>
            <span>{{userInfo.name}}</span>
          </div>
          <div>
            <label>性别</label>
            <span v-if="userInfo.gender === 0  || userInfo.gender === 1">{{userInfo.gender === 0 ? '女':'男'}}</span>
            <span v-else>未设置</span>
          </div>
          <div>
            <label>手机号</label>
            <span>{{userInfo.mobile}}</span>
            <i @click="dialogPhoneNumVisible = true">
              <svg-icon icon-class="edit_personal"></svg-icon>
              <svg-icon icon-class="edit_active"></svg-icon>
            </i>
          </div>
          <div>
            <label>角色</label>
            <span>{{userInfo.roleName}}</span>
          </div>
          <div>
            <label>修改密码</label>
            <i @click="dialogPasswordVisible = true">
              <svg-icon icon-class="edit_personal"></svg-icon>
              <svg-icon icon-class="edit_active"></svg-icon>
            </i>
          </div>
        </div>
      </div>
    </div>
    <uploader :uploadSuccessHandler="uploadSuccessHandler"></uploader>
    <!-- 更换手机号 -->
    <el-dialog
      title="更换手机号"
      :visible.sync="dialogPhoneNumVisible"
      :close-on-click-modal=false
      custom-class="normal-dialog simple-dialog"
      top="30vh"
      width="500px">
      <el-form
        :model="phoneNumInfo"
        :rules="infoRulesMobile"
        ref="mobileForm"
        status-icon
        label-width="160px"
        class="form-block fill-form">
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label="新手机号" prop="mobile" required>
            <el-input v-model="phoneNumInfo.mobile" placeholder="请填写新手机号"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label="验证码" prop="code" required>
            <el-input v-model="phoneNumInfo.code" placeholder="请填写验证码" class="captcha"></el-input>
            <div class="send-btn" @click="acquireCode" v-if="codeSeconds === 0">发送验证码</div>
            <div class="send-btn seconds-btn" v-else>{{codeSeconds}}s</div>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div class="operate-block">
        <div @click="confirmModifyMobile" class="confirm-btn">确定</div>
        <div @click="cancelModifyMobile" class="cancel-btn">取消</div>
      </div>
    </el-dialog>
    <!-- 更换密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPasswordVisible"
      :close-on-click-modal=false
      custom-class="normal-dialog simple-dialog password-modify"
      top="30vh"
      width="500px">
      <el-form
        :model="passwordInfo"
        :rules="infoRulesPassword"
        ref="passwordInfoBasic"
        status-icon
        label-width="160px"
        class="form-block fill-form">
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label="原密码" prop="password" required>
            <el-input v-model="passwordInfo.password"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label="新密码" required prop="newPassword">
            <el-input v-model="passwordInfo.newPassword"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label="确认新密码" prop="newPassword2" required>
            <el-input v-model="passwordInfo.newPassword2"></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div class="operate-block">
        <div @click="confirmReplacePassword" class="confirm-btn">确定</div>
        <div @click="cancelReplacePassword" class="cancel-btn">取消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Uploader from '../../components/Uploader';

  export default {
    name: 'personal-center',
    components: {Uploader},
    data() {
      let checkMobile = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入手机号'));
        } else if (!this.$util.isMobile(value)) {
          return callback(new Error('请填写正确的手机号码'));
        } else {
          callback();
        }
      };
      let checkMobileChange = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入手机号'));
        } else {
          callback();
        }
      };
      let checkCode = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };
      // 密码验证
      let checkPassword = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('原密码不能为空'));
        } else if (!this.$util.isPassword(value)) {
          return callback(new Error('请输入8-20位含数字和英文的密码'));
        } else {
          callback();
        }
      };
      let checkPasswordChange = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('原密码不能为空'));
        } else {
          callback();
        }
      };
      let checkNewPassword = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          callback(new Error('请输入新密码'));
        } else if (!this.$util.isPassword(value)) {
          return callback(new Error('请输入8-20位含数字和英文的密码'));
        } else {
          callback();
        }
      };
      let checkNewPasswordChange = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          callback(new Error('请输入新密码'));
        } else {
          callback();
        }
      };
      let checkNewPassword2 = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          callback(new Error('请再次输入密码'));
        } else if (this.$util.trim(value) !== this.$util.trim(this.passwordInfo.newPassword)) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let checkNewPassword2Change = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          callback(new Error('请再次输入密码'));
        } else {
          callback();
        }
      };
      return {
        codeSeconds: 0,
        userInfo: {
          avatarUrl: ''
        },
        phoneNumInfo: {
          id: this.$wsCache.localStorage.get('login').id,
          mobile: '',
          code: ''
        },
        passwordInfo: {
          password: '',
          newPassword: '',
          newPassword2: ''
        },
        dialogPhoneNumVisible: false,
        dialogPasswordVisible: false,
        infoRulesMobile: {
          mobile: [
            {validator: checkMobileChange, trigger: 'change'},
            {validator: checkMobile, trigger: 'blur'}
          ],
          code: [
            {validator: checkCode, trigger: 'change'},
            {validator: checkCode, trigger: 'blur'}
          ]
        },
        infoRulesPassword: {
          password: [
            {validator: checkPassword, trigger: 'blur'},
            {validator: checkPasswordChange, trigger: 'change'},
          ],
          newPassword: [
            {validator: checkNewPassword, trigger: 'blur'},
            {validator: checkNewPasswordChange, trigger: 'change'},
          ],
          newPassword2: [
            {validator: checkNewPassword2, trigger: 'blur'},
            {validator: checkNewPassword2Change, trigger: 'change'},
          ]
        }
      }
    },
    mounted() {

      this.init();
    },
    methods: {
      init() {
        this.$service.getAdminDetail(this.$wsCache.localStorage.get('login').id).then(response => {
          if (response && response.code === 0) {
            this.userInfo = response.data;
          }
        })
      },
      uploadAvatar() {
        this.$el.querySelector('#file-uploader').click();
      },
      uploadSuccessHandler(image) {
        this.$service.updateAdmin(this.userInfo.id, {avatarUrl: image.fileUrl}).then(res => {
          if (res && res.code === 0) {
            this.userInfo.avatarUrl = image.fileUrl;
            this.$message.success('头像更换成功');
            //  更新header中的头像
            let data = this.$wsCache.localStorage.get('login');
            data.avatarUrl = image.fileUrl;
            this.$wsCache.localStorage.set('login', data);
            this.$parent.setUserAvatar(image.fileUrl);
          }
        })
      },
      // 修改密码
      confirmReplacePassword() {
        this.$refs['passwordInfoBasic'].validate((valid) => {
          if (valid) {
            this.$service.updateAdminPassword({
              id: this.userInfo.id,
              newPassword: this.passwordInfo.newPassword,
              password: this.passwordInfo.password
            }).then(res => {
              if (res && res.code === 0) {
                this.$message.success('密码更新成功');
                //  清除密码信息
                this.passwordInfo.newPassword = '';
                this.passwordInfo.password = '';
                this.passwordInfo.newPassword2 = '';
                this.$nextTick(function () {
                  this.$refs['passwordInfoBasic'].resetFields();
                });
                this.dialogPasswordVisible = false;
              }
            });
          } else {
            return false;
          }
        });
      },
      cancelReplacePassword() {
        //  清除密码信息
        this.passwordInfo.newPassword = '';
        this.passwordInfo.password = '';
        this.passwordInfo.newPassword2 = '';
        this.$nextTick(function () {
          this.$refs['passwordInfoBasic'].resetFields();
        });
        this.dialogPasswordVisible = false;
      },
      // 获取验证码
      acquireCode() {
        // 验证手机号
        this.$refs['mobileForm'].validateField('mobile', (error) => {
          if (!error) {
            this.$service.getMobileSmsCode({
              phoneNum: this.phoneNumInfo.mobile,
              smsType: 'MOBILE_MODIFY'
            }).then(res => {
              if (res && res.code === 0) {
                this.$message.success('短信验证码已发送');
                this.codeSeconds = 60;
                let that = this;
                let timer = setInterval(function () {
                  that.codeSeconds = that.codeSeconds - 1;
                  if (that.codeSeconds === 0) {
                    clearInterval(timer);
                  }
                }, 1000);
              }
            });
          } else {
            return false;
          }
        });
      },
      confirmModifyMobile() {
        this.$refs['mobileForm'].validate((valid) => {
          if (valid) {
            this.$service.updateAdminMobile(this.phoneNumInfo).then(res => {
              if (res && res.code === 0) {
                this.$message.success('手机号更新成功');
                this.phoneNumInfo.mobile = '';
                this.phoneNumInfo.code = '';
                this.codeSeconds = 0;
                this.$nextTick(function () {
                  this.$refs['mobileForm'].resetFields();
                });
                this.dialogPhoneNumVisible = false;
              }
            });
          } else {
            return false;
          }
        });
      },
      cancelModifyMobile() {
        this.phoneNumInfo.mobile = '';
        this.phoneNumInfo.code = '';
        this.codeSeconds = 0;
        this.$nextTick(function () {
          this.$refs['mobileForm'].resetFields();
        });
        this.dialogPhoneNumVisible = false;
      }
    }
  }
</script>

<style scoped lang="scss">

  #personal-container {
    // 表单
    // 2.0 使form表单中的每个item左对齐
    .form-block {
      &.el-form {
        .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
          border-color: rgba(62, 73, 94, 1);
        }

        .el-input__icon {
          height: 30px;
          line-height: 30px;
        }
        .el-form-split-block {
          margin-bottom: 14px;
          &.simple-big-margin {
            margin-top: 24px;
          }
          &.radio-block {
            .el-form-item__label {
              padding-right: 20px;
            }
          }
          &.big-margin {
            margin-top: 20px;
            margin-bottom: 0;
            .el-form-item__label {
              padding-right: 20px;
              line-height: 30px;
            }
          }
          .el-form-item__content {
            display: flex;
            flex-direction: row;
            align-items: center;
            line-height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(168, 171, 179, 1);
            .el-input {
              &.captcha {
                width: 160px;
                .el-input__inner {
                  width: 160px;
                }
              }
            }
            .range-input {
              .el-input__inner {
                width: 126px;
              }
            }
            .el-input__inner {
              padding: 0 30px 0 10px;
              width: 240px;
              height: 30px;
              line-height: 30px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              &::-webkit-input-placeholder {
                font-size: 12px;
                font-weight: 400;
                color: rgba(159, 168, 184, 1);
              }
            }
          }
          .el-textarea {
            width: 240px;
            textarea {
              padding: 5px 10px;
            }
          }
          .el-form-item__label {
            padding-right: 29px;
            line-height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(168, 171, 179, 1);
          }
        }
      }
      .unit {
        height: 30px;
        line-height: 40px;
        margin-left: 10px;
        font-size: 12px;
        font-weight: 400;
        color: #6F7480;
      }
    }
  }

</style>

<style scoped lang="scss">

  #personal-container {
    #info-block {
      margin-top: 20px;
      margin-left: 18px;
      width: 562px;
      height: 300px;
      background: rgba(32, 44, 65, 1);
      border-radius: 10px;
      .header {
        padding: 20px 0 30px 32px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(240, 240, 240, 1);
      }
      .info {
        display: flex;
        justify-content: center;
        .avatar {
          margin-right: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
          label {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 12px;
            width: 80px;
            height: 30px;
            background: rgba(38, 146, 255, 1);
            border-radius: 15px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(218, 237, 255, 1);
            cursor: pointer;
            &:hover {
              background: #0F70F3;
              color: #DAEDFF;
            }
          }
        }
        .list {
          display: flex;
          flex-direction: column;
          width: 192px;
          > div {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            label {
              margin-right: 20px;
              text-align: right;
              width: 56px;
              font-size: 14px;
              font-weight: 400;
              color: rgba(159, 168, 184, 1);
            }
            span {
              margin-right: 10px;
              font-size: 14px;
              font-weight: 400;
              color: rgba(159, 168, 184, 1);
            }
            i {
              cursor: pointer;
              &:hover {
                .svg-icon-edit_personal {
                  display: none;
                }
                .svg-icon-edit_active {
                  display: block;
                }
              }
            }
            .svg-icon {
              width: 16px;
              height: 17px;
            }
            .svg-icon-edit_personal {
              display: block;
            }
            .svg-icon-edit_active {
              display: none;
            }
          }
        }
      }
    }
  }

  .uploader-container {
    visibility: hidden;
  }

  .send-btn {
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 30px;
    background: rgba(38, 146, 255, 1);
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(218, 237, 255, 1);
    cursor: pointer;
    &.seconds-btn {
      background: rgba(66, 100, 134, 1);
      font-size: 12px;
      font-weight: 400;
      color: rgba(218, 237, 255, 1);
    }
  }

</style>
