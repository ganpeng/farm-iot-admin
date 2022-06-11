<!-- 登录 -->
<template>
  <!-- 密码登录表单 -->
  <div id="password-login-block">
    <div @keyup.enter="login">
      <el-form ref="loginForm" :rules="rules" :model="loginData" label-width="0">
        <el-form-item prop="mobile">
          <el-input v-model="loginData.mobile" placeholder="账号">
            <i slot="prefix">
              <svg-icon icon-class="login_account"></svg-icon>
            </i>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="loginData.password" placeholder="密码" show-password>
            <i slot="prefix">
              <svg-icon icon-class="login_password"></svg-icon>
            </i>
            <i slot="suffix" @click="switchPasswordVisible">
              <svg-icon icon-class="eyeclose" v-if="passwordVisible"></svg-icon>
              <svg-icon icon-class="eyeopen" v-else></svg-icon>
            </i>
          </el-input>
        </el-form-item>
        <div class="save-password">
          <el-checkbox v-model="isSave">记住密码</el-checkbox>
        </div>
      </el-form>
      <label v-if="errorMessage" class="error-msg">{{errorMessage}}</label>
    </div>
    <div class="login-btn" @click="login">登录</div>
    <div class="code-login-btn"><label @click="setLoginIndex">手机验证码登录</label></div>
  </div>
</template>

<script>
  export default {
    name: 'login-psd',
    data() {
      return {
        passwordVisible: false,
        errorMessage: '',
        rules: {},
        loginData: {
          mobile: '',
          password: ''
        },
        isSave: false,
      }
    },
    init() {

    },
    mounted() {
      const loginData = this.$wsCache.localStorage.get('loginData');
      if(loginData) {
        this.isSave = true;
        this.loginData = Object.assign({}, JSON.parse(loginData));
      }
    },
    methods: {
      login() {
        this.$service.login(this.loginData).then(res => {
          if (res && res.code === 0) {
            this.$message.success('登录成功');
            this.$wsCache.localStorage.set('login', res.data);
            if(this.isSave) {
              this.$wsCache.localStorage.set('loginData', JSON.stringify(this.loginData));
            } else {
              this.$wsCache.localStorage.remove('loginData');
            }
            this.$router.push({name: 'Dashboard'});
          } else {
            this.errorMessage = res.message;
          }
        })
      },
      setLoginIndex() {
        this.$emit('setLoginIndex', 1);
      },
      switchPasswordVisible() {
        this.$el.querySelector('.el-icon-view').click();
        this.passwordVisible = !this.passwordVisible;
      }
    }
  }
</script>

<style scoped lang="scss">

  #login-container {
    height: 100%;
    width: 100%;
    background: url("../../assets/img/login_bg.png") center no-repeat;
    background-color: rgba(26, 34, 51, 1);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #login-block {
    padding: 40px 125px 38px 125px;
    width: 650px;
    height: 460px;
    background: rgba(35, 52, 79, 1);
    box-shadow: 2px 4px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    opacity: 0.94;
    border: 1px solid rgba(107, 125, 161, 1);
    .login-header {
      display: flex;
      align-items: center;
      .svg-icon {
        margin-right: 14px;
        margin-left: 4px;
        width: 42px;
        height: 52px;
      }
      label {
        font-size: 28px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
    }
    .error-msg {
      display: block;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(220, 74, 81, 1);
    }
    .save-password {
      height: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .login-btn {
      margin-top: 30px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 400px;
      height: 50px;
      background: rgba(38, 146, 255, 1);
      border-radius: 4px;
      font-size: 18px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      &:hover {
        background: rgba(15, 112, 243, 1);
      }
    }
    .code-login-btn {
      text-align: right;
      label {
        font-size: 14px;
        font-weight: 400;
        color: rgba(168, 171, 179, 1);
        cursor: pointer;
      }
    }
  }

</style>

<style lang="scss">

  #login-container {
    .el-form {
      margin-top: 40px;
      .el-form-item {
        &:first-child {
          margin-bottom: 30px;
        }
      }
    }
    .el-input {
      height: 50px;
      .el-input__inner {
        height: 50px;
        padding-left: 40px;
        padding-right: 40px;
        border-radius: 4px !important;
        border: 1px solid #6F7480 !important;
      }
    }
    .el-input__prefix {
      margin-left: 18px;
      display: flex;
      align-items: center;
    }
    .el-input__suffix {
      margin-right: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .el-icon-view {
        display: none;
      }
    }
  }


</style>
