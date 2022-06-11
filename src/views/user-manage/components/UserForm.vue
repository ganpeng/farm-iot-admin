<!--用户信息表单组件-->
<template>
  <div id="user-container">
    <div id="page-title">基本信息</div>
    <el-form
      :model="adminInfo"
      :rules="infoRules"
      status-icon
      ref="adminInfoBasic"
      label-width="160px"
      class="form-block fill-form">
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="姓名" prop="name" label-width="181px" required>
          <el-input
            v-model="adminInfo.name"
            size="medium"
            maxlength="20"
            placeholder="请输入姓名">
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="性别" prop="gender" label-width="181px">
          <el-radio-group v-model="adminInfo.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="手机号" prop="mobile" label-width="181px" required>
          <el-input
            v-model="adminInfo.mobile"
            size="medium"
            maxlength="20"
            placeholder="请输入手机号">
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="角色" prop="roleId" label-width="181px" required>
          <el-select v-model="adminInfo.roleId"
                     placeholder="请选择角色"
                     :disabled="(adminInfo.roleName === '企业主' || adminInfo.roleName === '企业员工') && status === 'EDIT'"
                     @change="selectRole($event)">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin"
                    label-width="0"
                    v-if="adminInfo.roleName === '企业主' || adminInfo.roleName === '企业员工'">
        <el-form-item label="所属企业" prop="farmId" label-width="181px"
                      :required="adminInfo.roleName === '企业主' || adminInfo.roleName === '企业员工'">
          <el-select v-model="adminInfo.farmId"
                     placeholder="请选择所属企业"
                     @change="selectFarm($event)">
            <el-option
              v-for="item in farmOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <!-- 创建用户密码 -->
      <el-form-item class="el-form-split-block big-margin" label-width="0" v-if="status === 'CREATE'">
        <el-form-item label="初始密码" prop="password" label-width="181px" required>
          <el-input
            v-model="adminInfo.password"
            size="medium"
            maxlength="20"
            placeholder="请输入8-20位含数字和英文的密码">
          </el-input>
          <div class="generate-btn" @click="generatePassword">智能生成</div>
          <i class="copy" @click="copyInfo" v-if="adminInfo.password && adminInfo.name && adminInfo.mobile">
            <svg-icon icon-class="copy_btn"></svg-icon>
          </i>
        </el-form-item>
      </el-form-item>
      <!-- 编辑用户密码 -->
      <el-form-item class="el-form-split-block big-margin" label-width="0" v-else>
        <el-form-item prop="password" label-width="181px">
          <template v-slot:label>
            <div class="reset-btn" @click="resetPassword">重置密码</div>
          </template>
          <div :class="{'active':resetVisible}" class="password-block">
            <el-input
              v-model="adminInfo.password"
              size="medium"
              maxlength="20"
              placeholder="请输入8-20位含数字和英文的密码">
            </el-input>
            <div class="generate-btn" @click="generatePassword">智能生成</div>
            <i class="copy" @click="copyInfo" v-if="adminInfo.password && adminInfo.name && adminInfo.mobile">
              <svg-icon icon-class="copy_btn"></svg-icon>
            </i>
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div class="fixed-btn-container">
      <el-button
        class="btn-style-two"
        type="primary"
        @click="createUser"
        :loading="isLoading">
        {{status === 'EDIT' ? '保存' : '新建'}}
      </el-button>
      <el-button class="btn-style-three" @click="toUserList" plain>返回列表</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'UserForm',
    props: {
      status: {
        type: String,
        default: 'CREATE'
      }
    },
    data() {
      let checkName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入用户名称'));
        } else {
          callback();
        }
      };
      let checkMobile = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入手机号'));
        } else if (!this.$util.isMobile(value)) {
          return callback(new Error('请填写正确的手机号码'));
        } else {
          callback();
        }
      };
      let checkRoleId = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择角色'));
        } else {
          callback();
        }
      };
      let checkFarmId = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择所属企业'));
        } else {
          callback();
        }
      };
      let checkPassword = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          if (this.status === 'CREATE' || (this.status === 'EDIT' && this.resetVisible)) {
            return callback(new Error('请输入密码'));
          } else {
            callback();
          }
        } else if (!this.$util.isPassword(value)) {
          return callback(new Error('请输入8-20位含数字和英文的密码'));
        } else {
          callback();
        }
      };
      return {
        resetVisible: false,
        adminInfo: {
          name: '',
          farmId: '',
          farmName: '',
          gender: '',
          mobile: '',
          password: '',
          roleId: '',
          roleName: ''
        },
        roleOptions: [],
        farmOptions: [],
        infoRules: {
          name: [
            {validator: checkName, trigger: 'change'},
            {validator: checkName, trigger: 'blur'}
          ],
          mobile: [
            {validator: checkMobile, trigger: 'blur'},
            {validator: checkMobile, trigger: 'change'}
          ],
          roleId: [
            {validator: checkRoleId, trigger: 'change'}
          ],
          farmId: [
            {validator: checkFarmId, trigger: 'change'}
          ],
          password: [
            {validator: checkPassword, trigger: 'blur'},
            {validator: checkPassword, trigger: 'change'}
          ]
        },
        isLoading: false
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      resetPassword() {
        this.resetVisible = true;
      },
      copyInfo() {
        try {
          this.$util.clipboardCopy(this.adminInfo.name + '  ' + this.adminInfo.mobile + '  ' + this.adminInfo.password);
          this.$message.success('复制成功');
        } catch (err) {
          console.log(err);
          this.$message.error('复制失败');
        }
      },
      init() {
        this.$util.toggleFixedBtnContainer();
        this.$service.getSimpleRoleList({isAdmin: this.$wsCache.localStorage.get('login').roleType !== 'FARM_EMPLOYEE' && this.$wsCache.localStorage.get('login').roleType !== 'FARM_OWNER'}).then(res => {
          if (res && res.code === 0) {
            this.roleOptions = res.data;
          }
        });
        this.getFarmList();
        if (this.status === 'EDIT') {
          this.getUserDetail();
        }
      },
      generatePassword() {
        this.$service.generatePassword().then(res => {
          if (res && res.code === 0) {
            this.adminInfo.password = res.data;
          }
        })
      },
      getFarmList() {
        this.$service.getFarmList({pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            this.farmOptions = response.data.list;
          }
        });
      },
      selectRole(roleId) {
        this.roleOptions.map(role => {
          if (role.id === roleId) {
            this.adminInfo.roleName = role.roleName;
            this.adminInfo.roleType = role.roleType;
            //  判断是否为'企业主'和'企业员工'
            if (this.adminInfo.roleName !== '企业主' && this.adminInfo.roleName !== '企业员工') {
              this.adminInfo.farmId = '';
              this.adminInfo.farmName = '';
            }
          }
        })
      },
      selectFarm(farmId) {
        this.farmOptions.map(farm => {
          if (farm.id === farmId) {
            this.adminInfo.farmName = farm.name;
          }
        })
      },
      getUserDetail() {
        this.$service.getAdminDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            for (let key in response.data) {
              this.adminInfo[key] = response.data[key];
            }
          }
        })
      },
      createUser() {
        this.$refs['adminInfoBasic'].validate().then((resolve, reject) => {
          if (this.adminInfo.roleName !== '企业主' && this.adminInfo.roleName !== '企业员工') {
            this.adminInfo.farmId = '';
          }
          if (resolve) {
            if (this.status === 'EDIT') {
              if (!this.$authority.isHasAuthority('admin:admin:put')) {
                return;
              }
              this.$service.updateAdmin(this.$route.params.id, this.adminInfo).then(response => {
                if (response && response.code === 0) {
                  this.$message.success('成功更新用户信息');
                  this.$router.push({name: 'UserList'});
                }
              });
            } else {
              if (!this.$authority.isHasAuthority('admin:admin:add')) {
                return;
              }
              this.$service.createAdmin(this.adminInfo).then(response => {
                if (response && response.code === 0) {
                  this.$message.success('成功创建用户');
                  this.$router.push({name: 'UserList'});
                }
              });
            }
          }
        }).catch((e) => {
        });
      },
      toUserList() {
        if (!this.$authority.isHasAuthority('admin:admin:page')) {
          return;
        }
        this.$router.push({name: 'UserList'});
      }
    }
  };
</script>

<style lang="scss" scoped>

  #user-container {
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

  .generate-btn {
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    flex-shrink: 0;
    flex-grow: 0;
    height: 30px;
    border-radius: 15px;
    border: 1px solid rgba(46, 171, 255, 1);
    font-size: 12px;
    font-weight: 400;
    color: rgba(46, 171, 255, 1);
    cursor: pointer;
    &:hover {
      color: rgba(255, 255, 255, 1);
      background: rgba(15, 112, 243, 1);
      border: none;
    }
  }

  .copy {
    margin-left: 10px;
    cursor: pointer;
    .svg-icon {
      height: 17px;
      width: 17px;
    }
  }

  .el-radio-group {
    margin-top: 7px;
  }

  .reset-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 30px;
    background: rgba(38, 146, 255, 1);
    border-radius: 15px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(218, 237, 255, 1);
    cursor: pointer;
    &:hover {
      background-color: #0F70F3;
    }
  }

  .password-block {
    display: flex;
    align-items: center;
    visibility: hidden;
    &.active {
      visibility: visible;
    }
  }

</style>

<style lang="scss">

  #user-container {
    .el-radio-group {
      .el-radio.is-checked {
        .el-radio__label {
          color: rgba(168, 171, 179, 1);
        }
      }
    }
  }

</style>
