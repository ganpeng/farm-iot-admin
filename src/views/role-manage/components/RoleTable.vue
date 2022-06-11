<!-- 角色表格组件 -->
<template>
  <div class="role-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="roleList">
      <el-table-column
        width="20px">
      </el-table-column>
      <el-table-column
        prop="roleName"
        align="left"
        label="角色名称">
        <template slot-scope="scope">
          <label>{{scope.row.roleName}}</label>
          <svg-icon icon-class="farm_member" v-if="scope.row.roleName === '企业主'"></svg-icon>
          <svg-icon icon-class="farm_member" v-if="scope.row.roleName === '企业员工'"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column
        prop="adminNumber"
        align="left"
        label="成员数量">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.adminNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        align="left"
        label="角色描述">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.roleDesc.length > 20" popper-class="description-display" effect="light"
                      :content="scope.row.roleDesc"
                      placement="bottom-start">
            <span class="description my-ellipsis">{{scope.row.roleDesc}}</span>
          </el-tooltip>
          <span v-else class="description my-ellipsis">{{scope.row.roleDesc}}</span>
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
      <el-table-column width="150px" align="left" label="操作">
        <template slot-scope="scope">
          <div class="operator-btn-wrapper">
            <span class="btn-text" @click="editRole(scope.row)">编辑</span>
            <span :class="{disabled:scope.row.adminNumber !== 0 || scope.row.roleType !== 'CUSTOM'}"
                  class="btn-text text-danger" @click="removeRole(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name: 'RoleTable',
    props: {
      roleList: {
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
        this.$router.push({
          name: 'RoleDetail',
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
      // 删除角色，只有未关联的才可以删除，后端处理
      removeRole(role) {
        if (role.adminNumber !== 0 || role.roleType !== 'CUSTOM') {
          this.$message.warning('角色含有用户或者为系统角色时，不支持删除');
          return;
        }
        this.$confirm('<div class="message-notice-block"><div>确定删除该角色？</div><div>删除后将不能恢复，请谨慎操作。</div></div>', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$service.removeRole(role.id).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('角色删除成功');
              this.$emit('getRoleList');
            }
          });
        });
      },
      editRole(item) {
        this.$router.push({
          name: 'EditRole',
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

  .el-table {
    .svg-icon {
      margin-left: 6px;
    }
  }


</style>
