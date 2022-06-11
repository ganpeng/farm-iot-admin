<!--传感器列表-->
<template>
  <div id="sensor-list-container">
    <sensor-filter
      ref="sensorFilter"
      v-on:getSensorList="getSensorList">
    </sensor-filter>
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
      <!--
      <el-button
        class="filter-add-btn"
        @click="createSensor">
        <svg-icon icon-class="add_plus"></svg-icon>
        添加
      </el-button>
      -->
      <el-dropdown class="my-dropdown-btn" @command="createSensor($event)" placement="bottom">
          <el-button class="btn-style-two contain-svg-icon">
              <svg-icon icon-class="add_plus"></svg-icon>
              添加
              <svg-icon icon-class="arrow_down"></svg-icon>
          </el-button>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="耕地种植传感器">耕地种植传感器</el-dropdown-item>
              <el-dropdown-item command="水产养殖传感器">水产养殖传感器</el-dropdown-item>
              <el-dropdown-item command="气象传感器">气象传感器</el-dropdown-item>
              <el-dropdown-item command="虫情测报灯">虫情测报灯</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>
    <sensor-table
      ref="sensorTable"
      :sensorList="sensorList"
      v-on:getSensorList="getSensorList"
      v-on:setBatchDisabledStatus="setBatchDisabledStatus">
    </sensor-table>
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
  import SensorFilter from './components/SensorFilter';
  import SensorTable from './components/SensorTable';

  export default {
    name: 'SensorList',
    components: {
      SensorFilter,
      SensorTable,
    },
    data() {
      return {
        listQueryParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        sensorList: [],
        isDisabled: true
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.$wsCache.localStorage.get('sensorFilter')) {
          this.listQueryParams.pageSize = this.$wsCache.localStorage.get('sensorFilter').pageSize;
          this.listQueryParams.pageNum = this.$wsCache.localStorage.get('sensorFilter').pageNum;
          this.listQueryParams = this.$wsCache.localStorage.get('sensorFilter');
          this.$refs.sensorFilter.initFilterParams(this.listQueryParams);
        }
        this.getSensorList();
      },
      setBatchDisabledStatus(isDisabled) {
        this.isDisabled = isDisabled;
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getSensorList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getSensorList();
      },
      getSensorList(searchParams, isReset) {
        // 设置请求参数
        if (searchParams) {
          for (let key in searchParams) {
            this.listQueryParams[key] = searchParams[key];
          }
        }
        if (isReset) {
          this.listQueryParams.pageNum = 1;
        }
        this.$wsCache.localStorage.set('sensorFilter', this.listQueryParams);
        this.$service.getSensorList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.sensorList = response.data.list;
            this.total = response.data.total;
          }
        });
      },
      // 批量导出
      batchExport() {
        this.$refs.sensorTable.batchExport();
      },
      // 创建传感器
      createSensor(sensorType) {
        if (!this.$authority.isHasAuthority('admin:sensor:add')) {
          return;
        }
        this.$router.push({name: 'CreateSensor', query: {sensorType}});
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
