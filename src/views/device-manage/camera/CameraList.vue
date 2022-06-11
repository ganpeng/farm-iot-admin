<!--摄像头列表-->
<template>
  <div id="camera-list-container">
    <camera-filter
      ref="cameraFilter"
      v-on:getCameraList="getCameraList">
    </camera-filter>
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
      <el-dropdown class="my-dropdown-btn" @command="createCamera($event)" placement="bottom">
          <el-button class="btn-style-two contain-svg-icon">
              <svg-icon icon-class="add_plus"></svg-icon>
              添加
              <svg-icon icon-class="arrow_down"></svg-icon>
          </el-button>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="NVR">平台NVR</el-dropdown-item>
              <el-dropdown-item command="CAMERA">摄像头</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>
    <camera-table
      ref="cameraTable"
      :cameraList="cameraList"
      v-on:getCameraList="getCameraList"
      v-on:setBatchDisabledStatus="setBatchDisabledStatus">
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
  import CameraFilter from './components/CameraFilter';
  import CameraTable from './components/CameraTable';

  export default {
    name: 'CameraList',
    components: {
      CameraFilter,
      CameraTable,
    },
    data() {
      return {
        listQueryParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        cameraList: [],
        isDisabled: true
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.$wsCache.localStorage.get('cameraFilter')) {
          this.listQueryParams.pageNum = this.$wsCache.localStorage.get('cameraFilter').pageNum;
          this.listQueryParams.pageSize = this.$wsCache.localStorage.get('cameraFilter').pageSize;
          this.listQueryParams = this.$wsCache.localStorage.get('cameraFilter');
          this.$refs.cameraFilter.initFilterParams(this.listQueryParams);
        }
        this.getCameraList();
      },
      setBatchDisabledStatus(isDisabled) {
        this.isDisabled = isDisabled;
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
        this.$wsCache.localStorage.set('cameraFilter', this.listQueryParams);
        this.$service.getCameraList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.cameraList = response.data.list;
            this.total = response.data.total;
          }
        });
      },
      // 批量导出
      batchExport() {
        this.$refs.cameraTable.batchExport();
      },
      // 创建摄像头
      createCamera(type) {
        if (!this.$authority.isHasAuthority('admin:camera:add')) {
          return;
        }
        this.$router.push({name: 'CreateCamera', query: {type}});
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
  #filter-operate-block {
    .el-dropdown {
      .btn-style-two {
        min-width: 80px;
        width: 60px;
      }
    }
  }
</style>
