<!--物联网数据---摄像头列表-->
<template>
  <div id="camera-list-container">
    <camera-filter
      ref="cameraFilter"
      v-on:getCameraList="getCameraList">
    </camera-filter>
    <camera-table
      ref="cameraTable"
      :cameraList="cameraList"
      v-on:getCameraList="getCameraList">
    </camera-table>
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
  import CameraFilter from '../components/CameraFilter';
  import CameraTable from '../components/CameraTable';

  export default {
    name: 'CameraList',
    components: {
      CameraFilter,
      CameraTable,
    },
    data() {
      return {
        listQueryParams: {
          farmId: this.$route.params.id,
          pageNum: 1,
          pageSize: 10
        },
        total: 1000000,
        cameraList: [],
        isDisabled: true
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getCameraList();
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getCameraList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getCameraList();
      },
      getCameraList(searchParams, isReset) {
        // 设置请求参数
        if (searchParams) {
          for (let key in searchParams) {
            this.listQueryParams[key] = searchParams[key];
          }
        }
        if (isReset) {
          this.listQueryParams.pageNum = 1;
        }
        this.$service.getDataCameraList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.cameraList = response.data.list;
            this.total = response.data.total;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

  #camera-list-container {
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
