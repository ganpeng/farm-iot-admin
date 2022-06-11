<template>
  <div id="import-container">
    <!-- 左侧 -->
    <div id="data-block">
      <div class="model-block">
        <div @click="downloadExcel">
          <svg-icon icon-class="download"></svg-icon>
          <label>下载模板</label>
        </div>
      </div>
      <div class="table-block">
        <label>已上传文件</label>
        <div>
          <el-table
            v-if="farmList.length !== 0"
            :data="farmList"
            header-row-class-name="common-table-header"
            :row-class-name="tableRowClassName"
            class="my-table-style row-table">
            <el-table-column
              align="center"
              v-for='item of tableHeader'
              :prop="item"
              :label="item"
              :key='item'>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div id="import-block">
      <div class="import-title">
        <label>批量导入区域</label>
      </div>
      <div class="file-import-block">
        <upload-excel-component
          :on-success='handleSuccess'
          :before-upload="beforeUpload">
        </upload-excel-component>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-three" @click="gotoFarmList" plain>返回列表</el-button>
    </div>
  </div>
</template>

<script>
  import UploadExcelComponent from './UploadExcel';

  export default {
    name: 'FarmImport',
    components: {UploadExcelComponent},
    data() {
      return {
        farmList: [],
        tableHeader: {}
      }
    },
    async created() {
      try {
        await this.$nextTick();
        this.$util.toggleFixedBtnContainer();
      } catch (err) {
        console.log(err);
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'odd-row';
        } else if (rowIndex % 2 === 0) {
          return 'even-row';
        }
        return '';
      },
      beforeUpload(a) {
        return true;
      },
      handleSuccess({results, header}) {
        this.farmList = results;
        this.tableHeader = header;
      },
      gotoFarmList() {
        this.$router.push({name: 'FarmList'});
      },
      downloadExcel() {
        let a = document.createElement('a');
        let url = 'https://dev-n-tianchi-oss.oss-cn-beijing.aliyuncs.com/farm/dc91b3b3-9e02-4c87-ba7d-3d99bb23fcbf.xlsx?Expires=4762062192&OSSAccessKeyId=LTAI4Fn1GBn1T9Qk1K7wSHRP&Signature=XqOzhJgwHhoOOcna6mcvVmlvSio%3D';
        let filename = '导入农场模板.excel';
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }
  }
</script>

<style scoped lang="scss">

  #import-container {
    width: 100%;
    height: 100%;
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    #data-block {
      height: 100%;
      padding-right: 20px;
      display: flex;
      flex-shrink: 1;
      flex-grow: 1;
      flex-direction: column;
      border-right: 1px solid #3E495E;
    }

    #import-block {
      padding: 0 20px;
      width: 280px;
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }

  .model-block {
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    flex-grow: 0;
    border-bottom: 1px solid #3E495E;
    div {
      width: 80px;
      height: 30px;
      background: rgba(38, 146, 255, 1);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .svg-icon {
        margin-right: 3px;
        width: 13px;
        height: 12px;
      }
      label {
        font-size: 12px;
        font-weight: 400;
        color: rgba(218, 237, 255, 1);
        cursor: pointer;
      }
    }
  }

  .table-block {
    display: flex;
    flex-direction: column;
    label {
      margin: 20px 0 10px 0;
      font-size: 14px;
      font-weight: 400;
      color: rgba(168, 171, 179, 1);
    }
  }

  .import-title {
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #3E495E;
    flex-shrink: 0;
    flex-grow: 0;
    label {
      font-size: 16px;
      font-weight: 500;
      color: rgba(168, 171, 179, 1);
    }
  }

  .file-import-block {
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

</style>
