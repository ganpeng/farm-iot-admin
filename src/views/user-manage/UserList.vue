<!--用户列表-->
<template>
  <div id="user-list-container">
    <div id="device-data-block">
      <div>
        <label><i></i>总数</label>
        <span v-if="deviceDataObj.farmOwner !== undefined">{{deviceDataObj.farmOwner + deviceDataObj.farmEmployee + deviceDataObj.custom}}</span>
        <span v-else></span>
      </div>
      <div>
        <label><i></i>企业主</label>
        <span>{{deviceDataObj.farmOwner}}</span>
      </div>
      <div>
        <label><i></i>企业员工</label>
        <span>{{deviceDataObj.farmEmployee}}</span>
      </div>
    </div>
    <user-filter
      ref="userFilter"
      v-on:getUserList="getUserList">
    </user-filter>
    <div id="filter-operate-block">
      <div></div>
      <el-button
        class="filter-add-btn"
        @click="createUser">
        <svg-icon icon-class="add_plus"></svg-icon>
        新增
      </el-button>
      <el-button
        class="filter-add-btn"
        @click="importUser">
        <svg-icon icon-class="import"></svg-icon>
        导入
      </el-button>
    </div>
    <user-table
      ref="userTable"
      :userList="userList"
      v-on:getUserList="getUserList">
    </user-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQueryParams.pageNum"
      :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
      :page-size="listQueryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import UserFilter from './components/UserFilter';
  import UserTable from './components/UserTable';

  export default {
    name: 'UserList',
    components: {
      UserFilter,
      UserTable,
    },
    data() {
      return {
        deviceDataObj: {},
        listQueryParams: {
          pageNum: 1,
          pageSize: 10,
          farmId: this.$wsCache.localStorage.get('login').farmId
        },
        total: 1000000,
        userList: []
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.$wsCache.localStorage.get('userFilter')) {
          this.listQueryParams.pageSize = this.$wsCache.localStorage.get('userFilter').pageSize;
          this.listQueryParams.pageNum = this.$wsCache.localStorage.get('userFilter').pageNum;
          this.listQueryParams = this.$wsCache.localStorage.get('userFilter');
          this.$refs.userFilter.initFilterParams(this.listQueryParams);
        }
        this.getUserFixedTotal().then((res) => {
          // 没有权限，就不请求角色的list
          if (res.code !== 402) {
            this.getUserList();
          } else {
            this.total = 0;
          }
        });
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getUserList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getUserList();
      },
      getUserList(searchParams, isReset) {
        this.listQueryParams.farmId = this.$wsCache.localStorage.get('login').farmId;
        // 设置请求参数
        if (searchParams) {
          for (let key in searchParams) {
            this.listQueryParams[key] = searchParams[key];
          }
        }
        if (isReset) {
          this.listQueryParams.pageNum = 1;
        }
        this.$wsCache.localStorage.set('userFilter', this.listQueryParams);
        this.$service.getAdminList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.userList = response.data.list;
            this.total = response.data.total;
          }
        });
      },
      // 创建用户
      createUser() {
        if (!this.$authority.isHasAuthority('admin:admin:add')) {
          return;
        }
        this.$router.push({
          name: 'CreateUser'
        });
      },
      importUser() {
        if (!this.$authority.isHasAuthority('admin:admin:import')) {
          return;
        }
        this.$router.push({
          name: 'ImportUser'
        });
      },
      getUserFixedTotal() {
        return this.$service.getAdminStatistics({farmId: (this.$wsCache.localStorage.get('login').farmId || '')}).then(response => {
          if (response && response.code === 0) {
            this.deviceDataObj = response.data;
          }
          return response;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

  #device-data-block {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    div {
      padding: 10px;
      margin-right: 12px;
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      width: 270px;
      height: 80px;
      background: rgba(32, 44, 65, 1);
      border-radius: 10px;

      label {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);

        i {
          margin-right: 8px;
          width: 2px;
          height: 20px;
          background: rgba(248, 101, 73, 1);
        }
      }

      span {
        align-self: flex-end;
        font-size: 32px;
        font-weight: 400;
        color: rgba(138, 185, 232, 1);
        line-height: 45px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  #user-list-container {
    padding-left: 18px;
    padding-right: 18px;
    position: relative;
    margin-top: 14px;

    #filter-operate-block {
      display: flex;
      align-items: center;
      position: absolute;
      right: 40px;
      top: 118px;
    }
  }

  .el-pagination {
    margin-bottom: 77px;
  }

</style>
