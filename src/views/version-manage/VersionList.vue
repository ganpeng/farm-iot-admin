<!--版本列表-->
<template>
  <div id="version-list-container">
    <div id="device-data-block">
      <div>
        <label><i></i>总数</label>
        <span>{{allTotal}}</span>
      </div>
    </div>
    <version-filter
      ref="versionFilter"
      v-on:getVersionList="getVersionList">
    </version-filter>
    <div id="filter-operate-block">
      <div></div>
      <el-button
        class="filter-add-btn"
        @click="createVersion">
        <svg-icon icon-class="add_plus"></svg-icon>
        新增
      </el-button>
    </div>
    <version-table
      ref="versionTable"
      :versionList="versionList"
      v-on:getVersionList="getVersionList"
      v-on:getVersionFixedTotal="getVersionFixedTotal">
    </version-table>
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
  import VersionFilter from './components/VersionFilter';
  import VersionTable from './components/VersionTable';

  export default {
    name: 'VersionList',
    components: {
      VersionFilter,
      VersionTable,
    },
    data() {
      return {
        allTotal: 0,
        listQueryParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 1000000,
        versionList: []
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.$wsCache.localStorage.get('versionFilter')) {
          this.listQueryParams.pageSize = this.$wsCache.localStorage.get('versionFilter').pageSize;
          this.listQueryParams.pageNum = this.$wsCache.localStorage.get('versionFilter').pageNum;
          this.listQueryParams = this.$wsCache.localStorage.get('versionFilter');
          this.$refs.versionFilter.initFilterParams(this.listQueryParams);
        }
        this.getVersionFixedTotal().then((res) => {
          // 没有权限，就不请求角色的list
          if (res.code !== 402) {
            this.getVersionList();
          } else {
            this.total = 0;
          }
        });
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getVersionList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getVersionList();
      },
      getVersionList(searchParams, isReset) {
        // 设置请求参数
        if (searchParams) {
          for (let key in searchParams) {
            this.listQueryParams[key] = searchParams[key];
          }
        }
        if (isReset) {
          this.listQueryParams.pageNum = 1;
        }
        this.$wsCache.localStorage.set('versionFilter', this.listQueryParams);
        this.$service.getVersionList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.versionList = response.data.list;
            this.total = response.data.total;
          }
        });
      },
      // 创建版本
      createVersion() {
        if (!this.$authority.isHasAuthority('admin:version:add')) {
          return;
        }
        this.$router.push({
          name: 'CreateVersion'
        });
      },
      getVersionFixedTotal() {
        return this.$service.getVersionList({pageNum: 1, pageSize: 10}).then(response => {
          if (response && response.code === 0) {
            this.allTotal = response.data.total;
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

  #version-list-container {
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
