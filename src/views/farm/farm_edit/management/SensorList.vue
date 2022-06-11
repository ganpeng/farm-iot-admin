<!--物联网数据---传感器列表-->
<template>
  <div id="sensor-list-container">
    <sensor-filter
      ref="dataSensorFilter"
      v-on:getSensorList="getSensorList">
    </sensor-filter>
    <sensor-table
      ref="sensorTable"
      :sensorList="sensorList"
      v-on:getSensorList="getSensorList">
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
  import SensorFilter from '../components/SensorFilter';
  import SensorTable from '../components/SensorTable';

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
          pageSize: 10,
          farmId: this.$route.params.id
        },
        total: 1000000,
        sensorList: []
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getSensorList();
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
        this.$service.getDataSensorList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.sensorList = response.data.list;
            this.total = response.data.total;
          }
        });
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
    }
  }

  .el-pagination {
    margin-bottom: 77px;
  }

</style>
