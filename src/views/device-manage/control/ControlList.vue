<!--传感器列表-->
<template>
  <div id="sensor-list-container">
    <controller-filter
      ref="controllerFilter"
      v-on:getControllerList="getControllerList">
    </controller-filter>
    <div id="filter-operate-block">
      <el-dropdown
        trigger="hover"
        class="my-dropdown"
        :class="{'is-disabled':isDisabled}">
          <span class="el-dropdown-link">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="batchExport">批量导出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button
        class="filter-add-btn"
        @click="createControl">
        <svg-icon icon-class="add_plus"></svg-icon>
        添加
      </el-button>
    </div>
    <controller-table
      ref="sensorTable"
      :controllerList="controllerList"
      v-on:getControllerList="getControllerList"
      v-on:setBatchDisabledStatus="setBatchDisabledStatus">
    </controller-table>
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
  import ControllerFilter from './components/ControllerFilter';
  import ControllerTable from './components/ControllerTable';

  export default {
    name: 'ControlList',
    components: {
      ControllerFilter,
      ControllerTable,
    },
    data() {
      return {
        listQueryParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        controllerList: [],
        isDisabled: true
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.$wsCache.localStorage.get('controllerFilter')) {
          this.listQueryParams.pageSize = this.$wsCache.localStorage.get('controllerFilter').pageSize;
          this.listQueryParams.pageNum = this.$wsCache.localStorage.get('controllerFilter').pageNum;
          this.listQueryParams = this.$wsCache.localStorage.get('controllerFilter');
          this.$refs.controllerFilter.initFilterParams(this.listQueryParams);
        }
        this.getControllerList();
      },
      setBatchDisabledStatus(isDisabled) {
        this.isDisabled = isDisabled;
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getControllerList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getControllerList();
      },
      getControllerList(searchParams, isReset) {
        // 设置请求参数
        if (searchParams) {
          for (let key in searchParams) {
            this.listQueryParams[key] = searchParams[key];
          }
        }
        if (isReset) {
          this.listQueryParams.pageNum = 1;
        }
        this.$wsCache.localStorage.set('controllerFilter', this.listQueryParams);
        let params = Object.assign({}, this.listQueryParams, {
          pageNum: this.listQueryParams.pageNum - 1
        })
        this.$service.getControllerList(params).then(response => {
          if (response && response.code === 0) {
            this.controllerList = response.data.list;
            this.total = response.data.total;
          }
        });
      },
      // 批量导出
      batchExport() {
        this.$refs.sensorTable.batchExport();
      },
      // 创建传感器
      createControl() {
        if (!this.$authority.isHasAuthority('admin:sensor:add')) {
          return;
        }
        this.$router.push({name: 'CreateControl', query: {controllerType: '智能灌溉机'}});
      }
    }
  };
</script>

<style lang="scss" scoped>

  #sensor-list-container {
    position: relative;
    margin-top: 14px;

    #filter-operate-block {
      display: flex;
      align-items: center;
      position: absolute;
      right: 22px;
      top: 17px;
      .el-dropdown {
        .btn-style-two {
          min-width: 80px;
          width: 60px;
        }
      }
    }
  }

  .el-pagination {
    margin-bottom: 77px;
  }

</style>
