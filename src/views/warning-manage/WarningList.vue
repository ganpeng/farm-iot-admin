<!--预警列表-->
<template>
  <div id="warning-list-container">
    <div id="device-data-block">
      <div>
        <label><i></i>总数</label>
        <span>{{warningDataObj.total}}</span>
      </div>
      <div>
        <label><i></i>模型预警</label>
        <span>{{warningDataObj.modelWarnTotal}}</span>
      </div>
      <div>
        <label><i></i>设备状态异常</label>
        <span>{{warningDataObj.deviceErrorTotal}}</span>
      </div>
    </div>
    <warning-filter
      ref="warningFilter"
      v-on:getWarningList="getWarningList">
    </warning-filter>
    <warning-table
      ref="warningTable"
      :warningList="warningList"
      v-on:getWarningList="getWarningList">
    </warning-table>
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
  import WarningFilter from './components/WarningFilter';
  import WarningTable from './components/WarningTable';

  export default {
    name: 'WarningList',
    components: {
      WarningFilter,
      WarningTable,
    },
    data() {
      return {
        warningDataObj: {},
        listQueryParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 1000000,
        warningList: []
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getWarningData();
        if (this.$wsCache.localStorage.get('warningFilter')) {
          this.listQueryParams.pageSize = this.$wsCache.localStorage.get('warningFilter').pageSize;
          this.listQueryParams.pageNum = this.$wsCache.localStorage.get('warningFilter').pageNum;
          this.listQueryParams = this.$wsCache.localStorage.get('warningFilter');
          this.$refs.warningFilter.initFilterParams(this.listQueryParams);
        }
        this.getWarningList();
      },
      getWarningData() {
        this.$service.getWarningData().then(response => {
          if (response && response.code === 0) {
            this.warningDataObj = response.data;
          }
        })
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getWarningList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getWarningList();
      },
      getWarningList(searchParams, isReset) {
        if (!this.$authority.isHasAuthority('admin:warn:page')) {
          return;
        }
        // 设置请求参数
        if (searchParams) {
          for (let key in searchParams) {
            this.listQueryParams[key] = searchParams[key];
          }
        }
        if (isReset) {
          this.listQueryParams.pageNum = 1;
        }
        this.$wsCache.localStorage.set('warningFilter', this.listQueryParams);
        this.$service.getWarningList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.warningList = response.data.list;
            this.total = response.data.total;
          } else if (response.code === 402) {
            this.total = 0;
          }
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

  #warning-list-container {
    padding-left: 18px;
    padding-right: 18px;
    position: relative;
    margin-top: 14px;
  }

  .el-pagination {
    margin-bottom: 77px;
  }

</style>
