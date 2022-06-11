<template>
  <div id="dialog-content-container">
    <div class="data-tag">共{{cameraInfoList.length}}个农场，{{previewedCameraList.length}}个摄像头</div>
    <div class="table-block">
      <el-table
        ref="multipleTable"
        header-row-class-name="common-table-header"
        class="my-table-style row-table"
        :row-class-name="tableRowClassName"
        :data="currentPreviewCameraList">
        <el-table-column
          align="center"
          width="120px"
          label="序号">
          <template slot-scope="scope">
            <div v-if="scope.$index < 9">{{'0' + (scope.$index + 1)}}</div>
            <div v-else>{{scope.$index + 1}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="farmName"
          align="center"
          label="农场名称">
        </el-table-column>
        <el-table-column
          prop="cameraVendor"
          align="center"
          label="厂商">
          <template slot-scope="scope">
            {{scope.row.cameraVendor | getCameraVendorName}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="left"
          width="200px"
          label="设备ID">
          <template slot-scope="scope">
            <div class="cell-id">{{scope.row.streamName || '/'}}</div>
          </template>
        </el-table-column> -->
        <el-table-column
          align="left"
          label="接入类型">
          <template slot-scope="scope">
            <div>{{scope.row.deviceType === 'CAMERA' ? '摄像头':'平台NVR'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          label="摄像头类型">
          <template slot-scope="scope">
            <div>{{cameraType(scope.row.cameraType)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="gatewayId"
          align="center"
          label="服务器ID">
        </el-table-column>
        <el-table-column
          prop="gatewayIp"
          align="center"
          label="服务器IP">
        </el-table-column>
        <el-table-column
          prop="gatewayPort"
          align="center"
          label="端口号">
        </el-table-column>
        <el-table-column
          prop="nationalStandardId"
          align="center"
          label="devicename">
        </el-table-column>
        <el-table-column
          prop="account"
          align="center"
          label="设备账号">
        </el-table-column>
        <el-table-column
          prop="password"
          align="center"
          label="设备登录密码">
        </el-table-column>
        <el-table-column
          prop="streamName"
          align="center"
          label="streamname">
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
  export default {
    name: "PreviewCamera",
    data() {
      return {
        total: 0,
        currentPreviewCameraList: [],
        listQueryParams: {
          pageNum: 1,
          pageSize: 5
        }
      }
    },
    props: ['cameraInfoList', 'previewedCameraList'],
    filters: {
      getCameraVendorName(tag) {
        return {'HAIKANG': '海康', 'DAHUA': '大华', 'HUAWEI': '华为', 'TIANDIWEIYE': '天地伟业'}[tag]
      }
    },
    mounted() {
      this.init();
    },
    computed: {
      cameraType() {
        return (cameraType) => {
          switch (parseInt(cameraType)) {
            case 1:
              return '枪机';
            case 2:
              return '球机';
            case 6:
              return '全景';
            default:
              return '/';
          }
        };
      }
    },
    methods: {
      init() {
        this.total = this.previewedCameraList.length;
        this.getPreviewCameraList();
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'odd-row';
        } else if (rowIndex % 2 === 0) {
          return 'even-row';
        }
        return '';
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getPreviewCameraList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getPreviewCameraList();
      },
      getPreviewCameraList() {
        let begin = (this.listQueryParams.pageNum - 1) * this.listQueryParams.pageSize;
        let end = this.listQueryParams.pageNum * this.listQueryParams.pageSize;
        this.currentPreviewCameraList = this.previewedCameraList.slice(
          begin,
          end
        );
      }
    }
  }
</script>

<style scoped lang="scss">

  .data-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    padding: 0 13px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid rgba(70, 109, 148, 1);
    font-size: 14px;
    font-weight: 400;
    color: rgba(138, 185, 232, 1);
  }

  #dialog-content-container {
    padding-bottom: 80px;
    .table-block {
      padding-bottom: 20px;
      height: 660px;
      overflow-y: scroll;
    }
  }
</style>
