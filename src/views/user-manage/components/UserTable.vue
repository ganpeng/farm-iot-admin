<!-- 用户表格组件 -->
<template>
  <div class="user-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="userList">
      <el-table-column
        width="20px">
      </el-table-column>
      <el-table-column
        prop="name"
        align="left"
        label="姓名">
        <template slot-scope="scope">
          <div class="cell-id" @click="toDetailPage(scope.row)">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="farmName"
        align="left"
        label="企业名称">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.farmName || '/'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="roleName"
        align="left"
        label="角色">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.roleName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="gender"
        align="left"
        label="性别">
        <template slot-scope="scope">
          <label v-if="scope.row.gender === 0  || scope.row.gender === 1">{{scope.row.gender === 0 ? '女':'男'}}</label>
          <label v-else>/</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        align="left"
        label="手机号">
        <template slot-scope="scope">
          <label>{{scope.row.mobile}}</label>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="160px"
        label="创建时间">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.createdAt | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        align="left"
        width="160px"
        label="更新时间">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.updatedAt | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="102px"
        label="使用状态">
        <template slot-scope="scope">
          <input
            class="my-switch switch-anim"
            type="checkbox"
            v-model="scope.row.status === 'NORMAL'"
            :checked="scope.row.status === 'NORMAL'"
            @click.prevent="updateStatus(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column
        width="150px"
        align="left"
        label="操作">
        <template slot-scope="scope">
          <div class="operator-btn-wrapper">
            <span class="btn-text" @click="editUser(scope.row)">编辑</span>
            <span class="btn-text text-danger" :class="{'disabled':scope.row.status === 'NORMAL'}"
                  @click="removeUser(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name: 'UserTable',
    props: {
      userList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {};
    },
    mounted() {
    },
    methods: {
      toDetailPage(item) {
        if (!this.$authority.isHasAuthority('admin:admin:get')) {
          return;
        }
        this.$router.push({
          name: 'UserDetail',
          params: {id: item.id}
        });
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'odd-row';
        } else if (rowIndex % 2 === 0) {
          return 'even-row';
        }
        return '';
      },
      // 删除用户
      removeUser(user) {
        if (!this.$authority.isHasAuthority('admin:admin:delete')) {
          return;
        }
        if (user.status === 'NORMAL') {
          this.$message.warning('只有禁用的用户才可以删除');
          return;
        }
        this.$confirm('<div class="message-notice-block"><div>确定删除该用户？</div><div>删除后将不能恢复，请谨慎操作。</div></div>', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$service.removeAdmin(user.id).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('用户删除成功');
              this.$emit('getUserList');
            }
          });
        });
      },
      updateStatus(item) {
        if (!this.$authority.isHasAuthority('admin:admin:visible')) {
          return;
        }
        this.$confirm('此操作将' + (item.status === 'NORMAL' ? '禁用' : '恢复') + (item.name || '当前') + '用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'simple-message'
        }).then(() => {
          this.$service.updateAdminStatus({
            id: item.id,
            status: item.status === 'NORMAL' ? 'FORBIDDEN' : 'NORMAL'
          }).then(response => {
            if (response && response.code === 0) {
              this.$message.success('"' + (item.name || '当前') + '"用户' + (item.status === 'NORMAL' ? '禁用' : '恢复') + '成功');
              item.status = item.status === 'NORMAL' ? 'FORBIDDEN' : 'NORMAL';
            }
          });
        });
      },
      editUser(item) {
        if (!this.$authority.isHasAuthority('admin:admin:put')) {
          return;
        }
        this.$router.push({
          name: 'EditUser',
          params: {id: item.id}
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

  .cell-id {
    font-size: 12px;
    font-weight: 400;
    color: rgba(46, 171, 255, 1);
    cursor: pointer;
    &:hover {
      color: rgba(136, 195, 255, 1);
    }
  }

  .table-item {
    &:hover {
      color: #f0f0f0;
    }
  }

  .cell-manager {
    font-size: 12px;
    font-weight: 400;
    color: rgba(138, 185, 232, 1);
    cursor: pointer;
  }

  .time-block {
    width: 75px;
    text-align: center;
  }

  .operator-btn-wrapper {
    justify-content: flex-start;
  }

  .el-tooltip {
    display: block;
    width: 80%;
  }

  .description {
    margin-right: 40px;
    color: #8AB9E8;
  }


</style>
