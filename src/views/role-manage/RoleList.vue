<!--角色列表-->
<template>
  <div id="role-list-container">
    <div id="device-data-block">
      <div>
        <label><i></i>总数</label>
        <span>{{fixedTotal}}</span>
      </div>
    </div>
    <role-filter
      ref="roleFilter"
      v-on:getRoleList="getRoleList">
    </role-filter>
    <div id="filter-operate-block">
      <div></div>
      <el-button
        class="filter-add-btn"
        @click="createRole">
        <svg-icon icon-class="add_plus"></svg-icon>
        添加
      </el-button>
    </div>
    <role-table
      ref="roleTable"
      :roleList="roleList"
      v-on:getRoleList="getRoleList">
    </role-table>
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
  import RoleFilter from './components/RoleFilter';
  import RoleTable from './components/RoleTable';

  export default {
    name: 'RoleList',
    components: {
      RoleFilter,
      RoleTable,
    },
    data() {
      return {
        deviceDataObj: {},
        listQueryParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 1000000,
        roleList: [],
        fixedTotal: 0
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.$wsCache.localStorage.get('roleFilter')) {
          this.listQueryParams.pageSize = this.$wsCache.localStorage.get('roleFilter').pageSize;
          this.listQueryParams.pageNum = this.$wsCache.localStorage.get('roleFilter').pageNum;
          this.listQueryParams = this.$wsCache.localStorage.get('roleFilter');
          this.$refs.roleFilter.initFilterParams(this.listQueryParams);
        }
        this.getRoleFixedTotal().then((res) => {
          // 没有权限，就不请求角色的list
          if (res.code !== 402) {
            this.getRoleList();
          } else {
            this.total = 0;
          }
        });
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getRoleList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getRoleList();
      },
      getRoleList(searchParams, isReset) {
        // 设置请求参数
        if (searchParams) {
          for (let key in searchParams) {
            this.listQueryParams[key] = searchParams[key];
          }
        }
        if (isReset) {
          this.listQueryParams.pageNum = 1;
        }
        this.$wsCache.localStorage.set('roleFilter', this.listQueryParams);
        this.$service.getRoleList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.roleList = response.data.list;
            this.total = response.data.total;
          } else {
            this.total = 0;
          }
        });
      },
      editRole() {
        let routeData = this.$router.resolve({
          name: 'EditRole'
        });
        window.open(routeData.href, '_blank');
      },
      // 创建角色
      createRole() {
        this.$router.push({
          name: 'CreateRole'
        });
      },
      getRoleFixedTotal() {
        return this.$service.getRoleTotal().then(response => {
          if (response && response.code === 0) {
            this.fixedTotal = response.data.total;
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
    justify-content: space-between;

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

  #role-list-container {
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
