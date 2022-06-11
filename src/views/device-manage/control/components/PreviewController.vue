<template>
  <div id="dialog-content-container">
    <div class="data-tag">共{{controllerInfoList.length}}个农场，{{previewedControllerList.length}}个传感器</div>
    <div class="table-block">
      <el-table
        ref="multipleTable"
        header-row-class-name="common-table-header"
        class="my-table-style row-table"
        :row-class-name="tableRowClassName"
        :data="currentPreviewControllerList">
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
          prop="controllerVendor"
          align="center"
          label="厂商">
          <template slot-scope="scope">
            {{scope.row.controllerVendor}}
          </template>
        </el-table-column>
        <el-table-column
          prop="deviceName"
          align="center"
          label="devicename">
        </el-table-column>
        <el-table-column
          align="left"
          label="设备类型">
          <template slot-scope="scope">
            <div class="table-item">{{scope.row.controllerType || '/'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="productKey"
          align="center"
          label="productkey">
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
    name: "previewController",
    data() {
      return {
        total: 0,
        currentPreviewControllerList: [],
        listQueryParams: {
          pageNum: 1,
          pageSize: 5
        }
      }
    },
    props: ['controllerInfoList', 'previewedControllerList'],
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.total = this.previewedControllerList.length;
        this.getPreviewSensorList();
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
        this.getPreviewSensorList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getPreviewSensorList();
      },
      getPreviewSensorList() {
        let begin = (this.listQueryParams.pageNum - 1) * this.listQueryParams.pageSize;
        let end = this.listQueryParams.pageNum * this.listQueryParams.pageSize;
        this.currentPreviewControllerList = this.previewedControllerList.slice(
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
