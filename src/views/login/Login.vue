<!-- 登录 -->
<template>
  <div id="login-container">
    <div id="login-block">
      <div class="login-header">
        <svg-icon icon-class="site_logo"></svg-icon>
        <label>吉视农业物联网大数据平台</label>
      </div>
      <!-- 密码登录表单 -->
      <login-password v-if="loginIndex === 0" v-on:setLoginIndex="setLoginIndex"></login-password>
      <!-- 验证码登录表单 -->
      <login-code v-else v-on:setLoginIndex="setLoginIndex"></login-code>
    </div>
  </div>
</template>

<script>
  import LoginPassword from './LoginPassword';
  import LoginCode from './LoginCode';

  export default {
    name: 'login',
    components: {
      LoginPassword,
      LoginCode
    },
    data() {
      return {
        loginIndex: 0,
        errorMessage: '',
        rules: {},
        loginData: {
          mobile: '13333333333',
          password: '1234c56ab'
        }
      }
    },
    init() {

    },
    methods: {
      login() {
        this.$service.login(this.loginData).then(res => {
          if (res && res.code === 0) {
            this.$message.success('登录成功');
            this.$wsCache.localStorage.set('login', res.data);
            this.$router.push({name: 'Dashboard'});
          } else {
            this.errorMessage = res.message;
          }
        })
      },
      setLoginIndex(index) {
        this.loginIndex = index;
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
      }
    }
  }

</style>
