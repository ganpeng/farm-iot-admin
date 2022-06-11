<!--导入excel组件-->
<template>
  <div class="upload-excel">
    <input id="excel-upload-input" ref="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <label class="tips">拖拽文件到此区域进行上传</label>
    <div id="drop"
         @drop="handleDrop"
         @dragover="handleDragover"
         @dragenter="handleDragover">
      <svg-icon icon-class="file_upload"></svg-icon>
    </div>
    <div class="select-btn" @click="handleUpload">选择文件</div>
  </div>
</template>

<script>
  import XLSX from 'xlsx';

  export default {
    name: 'uploadExcel',
    props: {
      beforeUpload: Function,
      onSuccess: Function
    },
    data() {
      return {
        loading: false,
        excelData: {
          header: null,
          results: null
        }
      };
    },
    methods: {
      generateDate({header, results}) {
        this.excelData.header = header;
        this.excelData.results = results;
        this.onSuccess && this.onSuccess(this.excelData);
      },
      handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.loading) return;
        const files = e.dataTransfer.files;
        if (files.length !== 1) {
          this.$message.error('Only support uploading one file!');
          return;
        }
        const rawFile = files[0];// only use files[0]

        if (!this.isExcel(rawFile)) {
          this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files');
          return false;
        }
        this.upload(rawFile);
        this.uploadToServer(rawFile);
        e.stopPropagation();
        e.preventDefault();
      },
      handleDragover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      },
      handleUpload() {
        document.getElementById('excel-upload-input').click();
      },
      handleClick(e) {
        const files = e.target.files;
        const rawFile = files[0]; // only use files[0]
        if (!rawFile) return;
        this.upload(rawFile);
        this.uploadToServer(rawFile);
      },
      // 上传到服务器上导入用户
      uploadToServer(rawFile) {
        let that = this;
        let formData = new FormData();
        formData.append("file", rawFile);
        let request = new XMLHttpRequest();
        request.open("POST", "/v1/farm/upload");
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            //根据服务器的响应内容格式处理响应结果
            let response = JSON.parse(request.responseText);
            if (response && response.code === 0) {
              that.$message.success('上传导入文件成功，请稍后查看创建信息');
            } else {
              that.$message.warning(response.message);
            }
          }
        };
        request.send(formData);
      },
      upload(rawFile) {
        this.$refs['excel-upload-input'].value = null; // fix can't select the same excel

        if (!this.beforeUpload) {
          this.readerData(rawFile);
          return;
        }
        const before = this.beforeUpload(rawFile);
        if (before) {
          this.readerData(rawFile);
        }
      },
      readerData(rawFile) {
        this.loading = true;
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => {
            const data = e.target.result;
            const fixedData = this.fixdata(data);
            const workbook = XLSX.read(btoa(fixedData), {type: 'base64'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const header = this.get_header_row(worksheet);
            const results = XLSX.utils.sheet_to_json(worksheet);
            this.generateDate({header, results});
            this.loading = false;
            resolve();
          };
          reader.readAsArrayBuffer(rawFile);
        });
      },
      fixdata(data) {
        let o = '';
        let l = 0;
        const w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      },
      get_header_row(sheet) {
        const headers = [];
        const range = XLSX.utils.decode_range(sheet['!ref']);
        let C;
        const R = range.s.r;
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
          var cell = sheet[XLSX.utils.encode_cell({c: C, r: R})];
          /* find the cell in the first row */
          var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
          headers.push(hdr);
        }
        return headers;
      },
      isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name);
      }
    }
  };
</script>

<style lang="scss" scoped>

  .upload-excel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    #excel-upload-input {
      display: none;
      z-index: -9999;
    }
    .tips {
      font-size: 14px;
      font-weight: 400;
      color: rgba(168, 171, 179, 1);
    }
    #drop {
      height: 160px;
      width: 160px;
      margin: 14px 0px 30px 0;
      .svg-icon {
        height: 160px;
        width: 160px;
      }
    }
    .select-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 30px;
      background: rgba(38, 146, 255, 1);
      border-radius: 15px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(218, 237, 255, 1);
      cursor: pointer;
    }
  }

</style>
