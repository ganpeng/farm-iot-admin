<!--角色信息表单组件-->
<template>
  <div id="role-container">
    <el-form
      :model="roleInfo"
      :rules="infoRules"
      status-icon
      ref="roleInfoBasic"
      label-width="160px"
      class="form-block fill-form">
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="角色名称" prop="roleName" label-width="181px" required>
          <el-input
            :disabled="roleInfo.roleType === 'FARM_EMPLOYEE' || roleInfo.roleType === 'FARM_OWNER'"
            v-model="roleInfo.roleName"
            size="medium"
            maxlength="20"
            placeholder="角色名称">
          </el-input>
          <small>不超过20字</small>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="角色说明" prop="roleDesc" label-width="181px" required>
          <el-input
            type="textarea"
            maxlength="150"
            :rows="6"
            v-model="roleInfo.roleDesc"
            size="medium"
            placeholder="角色说明">
          </el-input>
          <i class="notice">不超过150字</i>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="权限分配" prop="resourceList" label-width="181px">
          <div class="tree-block">
            <div class="check-all-block">
              <el-checkbox v-model="checkedAll" @change="selectResourceAll">全选</el-checkbox>
              <label>农业大数据平台</label>
            </div>
            <el-tree
              @check="checkTreeChange"
              :data="resourceData"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="authorityTree"
              highlight-current
              :props="defaultProps">
            </el-tree>
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div class="fixed-btn-container">
      <el-button
        class="btn-style-two"
        type="primary"
        @click="createRole"
        :loading="isLoading">
        {{status === 'EDIT' ? '保存' : '新建'}}
      </el-button>
      <el-button class="btn-style-three" @click="toRoleList" plain>返回列表</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'CreateRole',
    props: {
      status: {
        type: String,
        default: 'CREATE'
      }
    },
    data() {
      let checkName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入角色名称'));
        } else {
          callback();
        }
      };
      let checkDescription = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入角色说明'));
        } else {
          callback();
        }
      };
      let checkTreeResourceList = (rule, value, callback) => {
        if (this.$refs.authorityTree.getCheckedKeys().length === 0) {
          return callback(new Error('请选择角色权限'));
        } else {
          callback();
        }
      };
      return {
        resourceData: [],
        resourceLength: 0,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        roleInfo: {
          roleName: '',
          roleDesc: ''
        },
        infoRules: {
          roleName: [
            {validator: checkName, trigger: 'change'},
            {validator: checkName, trigger: 'blur'}
          ],
          roleDesc: [
            {validator: checkDescription, trigger: 'blur'},
            {validator: checkDescription, trigger: 'change'}
          ],
          resourceList: [
            {validator: checkTreeResourceList, trigger: 'change'}
          ]
        },
        isLoading: false,
        checkedAll: false
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      selectResourceAll(value) {
        if (value) {
          let idList = [];
          for (let i = 0; i < this.resourceData.length; i++) {
            for (let m = 0; m < this.resourceData[i].children.length; m++) {
              idList.push(this.resourceData[i].children[m].id);
            }
          }
          this.$nextTick(function () {
            this.$refs.authorityTree.setCheckedKeys(idList);
          });
        } else {
          this.$refs.authorityTree.setCheckedKeys([]);
        }
      },
      checkTreeChange() {
        let keyList = this.$refs.authorityTree.getCheckedKeys();
        let idList = [];
        keyList.map(key => {
          if (key) {
            idList.push(key)
          }
        });
        this.checkedAll = idList.length === this.resourceLength;
      },
      init() {
        this.$util.toggleFixedBtnContainer();
        this.getRoleTreeResourceList().then(() => {
          if (this.status === 'EDIT') {
            this.getRoleDetail();
          }
        });
      },
      getRoleTreeResourceList() {
        return this.$service.getRoleTreeResourceList().then(res => {
          if (res && res.code === 0) {
            this.resourceData = res.data;
            let idList = [];
            for (let i = 0; i < this.resourceData.length; i++) {
              for (let m = 0; m < this.resourceData[i].children.length; m++) {
                idList.push(this.resourceData[i].children[m].id);
              }
            }
            this.resourceLength = idList.length;
          }
        })
      },
      getRoleDetail() {
        this.$service.getRoleDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            for (let key in response.data) {
              this.roleInfo[key] = response.data[key];
            }
            let idList = [];
            this.roleInfo.resourceList.map(role => {
              idList.push(role.id);
            });
            if (idList.length === this.resourceLength) {
              this.checkedAll = true;
            }
            this.$nextTick(function () {
              this.$refs.authorityTree.setCheckedKeys(idList);
            });
          }
        })
      },
      createRole() {
        this.$refs['roleInfoBasic'].validate((valid) => {
          if (valid) {
            // 编辑权限列表
            let idList = this.$refs.authorityTree.getCheckedKeys();
            this.roleInfo.resourceList = [];
            idList.map(id => {
              if (id) {
                this.roleInfo.resourceList.push({id: id});
              }
            });
            this.isLoading = true;
            switch (this.status) {
              case 'CREATE':
                this.$service.createRole(this.roleInfo).then(response => {
                  if (response && response.code === 0) {
                    this.$message.success('成功创建角色');
                    this.toRoleList();
                  } else {
                    this.isLoading = false;
                  }
                });
                break;
              case 'EDIT':
                this.$service.updateRoleInfo(this.roleInfo).then(response => {
                  if (response && response.code === 0) {
                    this.$message.success('保存角色信息成功');
                    this.toRoleList();
                  } else {
                    this.isLoading = false;
                  }
                });
                break;
              default:
                break;
            }
          } else {
            return false;
          }
        });
      },
      toRoleList() {
        this.$router.push({name: 'RoleList'});
      }
    }
  };
</script>

<style lang="scss">

  #role-container {
    .el-checkbox {
      margin-right: 48px;
      order: 1;
      .el-checkbox__input {
        height: 14px;
        width: 14px;
        &.is-checked {
          .el-checkbox__inner {
            background-color: #1478FE;
            border: none;
          }
        }
        .el-checkbox__inner {
          border-radius: 2px;
          border: 1px solid rgba(62, 73, 94, 1);
          background-color: transparent;
          &::after {
            top: 2px;
            left: 5px;
            height: 8px;
          }
        }
      }
    }
    .el-checkbox {
      .el-checkbox__label {
        color: rgba(168, 171, 179, 1) !important;
      }
      &.is-checked {
        .el-checkbox__label {
          font-size: 14px;
          font-weight: 400;
          color: rgba(168, 171, 179, 1) !important;
        }
      }
    }
    .el-tree-node__content {
      padding-left: 10px !important;
      display: flex;
      align-items: center;
      background-color: transparent !important;
      &:hover {
        background-color: transparent !important;
      }
      .el-tree-node__expand-icon {
        order: 2;
        &.is-leaf {
          margin-right: 20px;
        }
      }
      .el-tree-node__label {
        order: 3;
        font-size: 14px;
        font-weight: 400;
        color: rgba(168, 171, 179, 1);
      }
    }
    .el-tree {
      /*padding: 10px 0;*/
      /*width: 240px;*/
      /*height: 490px;*/
      /*background: rgba(32, 44, 65, 1);*/
      /*border-radius: 4px;*/
      /*overflow-y: scroll;*/
      background-color: transparent;
    }
  }

</style>

<style lang="scss" scoped>

  #role-container {
    padding: 18px;
  }

  .operate-block {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .notice {
    margin-left: 10px;
    align-self: flex-end;
    font-size: 12px;
    font-weight: 400;
    color: rgba(111, 116, 128, 1);
  }

  small {
    position: absolute;
    right: -70px;
    top: 14px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(111, 116, 128, 1);
  }

  #role-container {
    .tree-block {
      display: flex;
      flex-direction: column;
      overflow: scroll;
      padding: 10px 0;
      width: 240px;
      height: 490px;
      background: rgba(32, 44, 65, 1);
      border-radius: 4px;
      .check-all-block {
        padding-left: 10px;
        .el-checkbox {
          margin-right: 22px;
        }
      }
    }
  }

</style>
