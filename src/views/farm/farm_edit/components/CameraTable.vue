<!-- 物联网数据---摄像头表格组件 -->
<template>
  <div id="camera-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      class="my-table-style"
      :data="cameraList">
      <el-table-column
        width="20px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nationalStandardId"
        align="left"
        width="200px"
        label="设备ID">
        <template slot-scope="scope">
          <div class="cell-id" @click="toDetailPage(scope.row)">{{scope.row.nationalStandardId}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        align="left"
        label="设备名称">
        <template slot-scope="scope">
          <div>{{scope.row.deviceName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        align="left"
        label="设备类型">
        <template slot-scope="scope">
          <div>{{scope.row.type === 1 ? '枪机':'球机'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="cameraVendor"
        align="left"
        label="厂商名称">
        <template slot-scope="scope">
          {{scope.row.cameraVendor | getCameraVendorName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="farmName"
        align="left"
        label="地块">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.landName || '/'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="负责人">
        <template slot-scope="scope">
          <el-popover class="my-popover" placement="left-start" width="180" trigger="hover" v-if="scope.row.manager">
            <div class="pop-content table-manage-block">
              <div>姓名：{{scope.row.manager}}</div>
              <div>电话：{{scope.row.managerPhone}}
                <label class="svg-block copy-btn"
                       :data-clipboard-text="scope.row.managerPhone"
                       @click="copyPhoneNo(scope.row.managerPhone)">
                  <svg-icon icon-class="copy"></svg-icon>
                </label>
              </div>
            </div>
            <span class="cell-manager" slot="reference">{{scope.row.manager || '/'}}</span>
          </el-popover>
          <span v-else class="cell-manager" slot="reference">{{scope.row.manager || '/'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="接入时间">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.createdAt | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        align="left"
        label="最后上报">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.updatedAt | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        prop="deviceStatus"
        width="95px"
        label="在线状态">
        <template slot-scope="scope">
          <div class="online-status" v-if="scope.row.deviceStatus === 'ONLINE'">
            {{scope.row.deviceStatus | getDeviceStatusName}}
          </div>
          <div class="offline-status" v-if="scope.row.deviceStatus === 'OFFLINE'">
            {{scope.row.deviceStatus | getDeviceStatusName}}
          </div>
          <div class="unstaged-status" v-if="scope.row.deviceStatus === 'UNACTIVE'">
            {{scope.row.deviceStatus | getDeviceStatusName}}
          </div>
          <!--删除状态 -->
          <div class="delete-status" v-if="scope.row.deviceStatus === 'DELETED'">
            {{scope.row.deviceStatus | getDeviceStatusName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="130px" align="left" label="操作">
        <template slot-scope="scope">
          <!-- 物联网数据下载 -->
          <div class="operator-btn-wrapper">
            <span class="btn-text" @click="downloadCamera(scope.row)">数据下载</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据下载弹窗 -->
    <el-dialog
      title="数据下载"
      :visible.sync="downloadVisible"
      :close-on-click-modal=false
      :before-close="beforeClose"
      custom-class="normal-dialog download-dialog"
      top="13vh"
      width="70%">
      <el-form
        :model="cameraInfo"
        :rules="infoRules"
        status-icon
        ref="cameraInfo"
        label-width="160px"
        class="form-block fill-form">
        <el-form-item class="el-form-split-block simple-big-margin" label-width="0">
          <el-form-item label=设备名称 label-width="160px">
            <label>{{currentCamera.deviceName || '未设置'}}</label>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item label=时间范围 prop="createRangeTime" label-width="160px" required>
            <el-date-picker
              v-model="cameraInfo.createRangeTime"
              @change="selectCreateRangeTime"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block simple-big-margin radio-block" label-width="0">
          <el-form-item label="数据类型" prop="type" label-width="160px" required>
            <el-radio-group v-model="cameraInfo.type">
              <el-radio :label="1">延时摄影</el-radio>
              <el-radio :label="2">截图</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form-item>
        <el-form-item class="el-form-split-block simple-big-margin radio-block" label-width="0">
          <el-form-item label-width="160px">
            <div class="download-notice">说明：延时摄影视频每月自动生成一条，单次最多支持下载12条；截图每15分钟生成一张，单次最多支持下载7天的数据。</div>
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="modify-btn" @click="cancelDataExport">取消</el-button>
        <el-button
          type="primary"
          class="create-btn"
          @click="exportCameraData"
          :loading="isPreviewLoading">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  import JSZip from 'jszip';
  import FileSaver from "file-saver";

  export default {
    name: 'CameraTable',
    props: {
      cameraList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      let checkCreateRangeTime = (rule, value, callback) => {
        if (this.cameraInfo.createRangeTime.length === 0) {
          return callback(new Error('请选择时间范围'));
        } else {
          callback();
        }
      };
      let checkType = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择指标'));
        } else {
          callback();
        }
      };
      return {
        currentCamera: {},
        createRangeTime: [],
        infoRules: {
          createRangeTime: [
            {validator: checkCreateRangeTime, trigger: 'blur'},
            {validator: checkCreateRangeTime, trigger: 'change'}
          ],
          type: [
            {validator: checkType, trigger: 'blur'},
            {validator: checkType, trigger: 'change'}
          ]
        },
        cameraInfo: {
          type: '',
          deviceName: '',
          startDate: '',
          endDate: '',
          createRangeTime: []
        },
        downloadVisible: false,
        isPreviewLoading: false
      };
    },
    filters: {
      getDeviceStatusName(tag) {
        return {'ONLINE': '在线', 'OFFLINE': '离线', 'UNACTIVE': '未激活', 'LOCKED': '锁定', 'DELETED': '已删除'}[tag]
      }
    },
    mounted() {
    },
    methods: {
      getArrayBuffer(zip, url, name) {
        return new Promise((resolve, reject) => {
          axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer'
          }).then(res => {
            zip.file(name + '.mp4', res.data, {binary: true});
            console.log(res.data);
            resolve(res.data)
          }).catch(error => {
            reject(error.toString())
          })
        })
      },
      exportCameraData() {
        this.$refs['cameraInfo'].validate((valid) => {
          if (valid) {
            this.isPreviewLoading = true;
            if (this.cameraInfo.type === 1) {
              this.$service.getCameraVideoList({
                streamName: '34020000001320000004'
              }).then(response => {
                if (response && response.code === 0) {
                  this.videoList = response.data;
                  const zip = new JSZip();
                  let promiseArray = [];
                  for (let i = 0; i < this.videoList.length; i++) {
                    promiseArray.push(this.getArrayBuffer(zip, this.videoList[i].url, this.$util.formatDate(new Date(this.videoList[i].createdAt), 'yyyy-MM-DD')));
                  }
                  let file_name = this.$route.query.name + (this.currentCamera.landName || '') + '起止' + (this.currentCamera.deviceName || '') + this.$util.formatDate(new Date(this.cameraInfo.startDate), 'yyyy-MM-DD') + '-' + this.$util.formatDate(new Date(this.cameraInfo.endDate), 'yyyy-MM-DD') + '摄像头数据下载' + this.$util.formatDate(new Date(), 'yyyy-MM-DD');
                  Promise.all(promiseArray).then(() => {
                    this.isPreviewLoading = false;
                    this.cancelDataExport();
                    zip.generateAsync({type: "blob"}).then(function (content) {
                      FileSaver.saveAs(content, file_name);
                    });
                  });
                } else {
                  this.isPreviewLoading = false;
                  this.$message.warning('数据下载失败，请稍后再试');
                }
              })
            } else if (this.cameraInfo.type === 2) {
              this.downloadAllCameraScreenshots();
            }
          } else {
            return false;
          }
        });
      },
      // 下载全部截图
      downloadAllCameraScreenshots() {
        this.$service.getCameraScreenshotList({
          streamName: '34020000001320000004',
          pageNum: 0,
          pageSize: 10000,
          startedAt: this.cameraInfo.startDate,
          endedAt: this.cameraInfo.endDate
        }).then(response => {
          if (response && response.code === 0) {
            this.isPreviewLoading = false;
            if (response.data.total !== 0) {
              this.$message.success('正在下载,请稍后');
              this.allImageList = response.data.list;
              // 限制下载数量672张
              if (this.allImageList.length > 672) {
                this.$message.warning('单次最多支持7天的数据下载，请重新选择')
              } else {
                this.cancelDataExport();
                this.zipDownloadFile();
              }
            } else {
              this.$message.warning('当前无截图数据');
            }
          } else {
            this.isPreviewLoading = false;
          }
        });
      },
      zipDownloadFile() {
        let that = this;
        //*****创建实例，zip是对象实例
        let zip = new JSZip();
        let file_name = this.$route.query.name + (this.currentCamera.landName || '') + (this.currentCamera.deviceName || '') + '起止' + this.$util.formatDate(new Date(this.cameraInfo.startDate), 'yyyy-MM-DD') + '-' + this.$util.formatDate(new Date(this.cameraInfo.endDate), 'yyyy-MM-DD') + '摄像头数据下载' + this.$util.formatDate(new Date(), 'yyyy-MM-DD');
        let len = function (arr) {
          let l = 0;
          for (let key in arr) {
            l++;
          }
          return l;
        };
        for (let i = 0; i < this.allImageList.length; i++) {
          //对每一个图片链接获取base64的数据，并使用回调函数处理
          this.getBase64Image(that.allImageList[i], function (dataURL) {
            let imageTitle = that.allImageList[i].value.toString().split('.jpg')[0].split('/')[6];
            //对获取的图片base64数据进行处理
            let img_arr = dataURL.split(',');
            zip.file(imageTitle + '.jpg', img_arr[1], {base64: true});//根据base64数据在压缩包中生成jpg数据
            let ziplength = len(zip.files);
            if (ziplength == that.allImageList.length) {//当所有图片都已经生成打包并保存zip
              zip.generateAsync({type: "blob"}).then(function (content) {
                FileSaver.saveAs(content, file_name);
              });
            }
          });
        }
      },
      getBase64Image(image, callback) {
        let img = new Image();
        let canvas = document.createElement("canvas");
        img.setAttribute('crossorigin', 'anonymous');
        img.onload = function () {
          canvas.getContext("2d").drawImage(img, 0, 0, 640, 320);
          let dataURL = canvas.toDataURL();//使用canvas获取图片的base64数据
          callback ? callback(dataURL) : null; //调用回调函数
        };
        img.src = image.value;
      },
      cancelDataExport() {
        this.cameraInfo.startDate = '';
        this.cameraInfo.endDate = '';
        this.cameraInfo.type = '';
        this.cameraInfo.deviceName = '';
        this.$refs['cameraInfo'].resetFields();
        this.downloadVisible = false;
      },
      selectCreateRangeTime() {
        if (this.cameraInfo.createRangeTime && this.cameraInfo.createRangeTime.length === 2) {
          this.cameraInfo.startDate = this.cameraInfo.createRangeTime[0];
          this.cameraInfo.endDate = this.cameraInfo.createRangeTime[1];
        } else {
          this.cameraInfo.startDate = '';
          this.cameraInfo.endDate = '';
        }
      },
      beforeClose(doneCallback) {
        if (!this.isPreviewLoading) {
          doneCallback();
        }
      },
      toDetailPage(item) {
        this.$router.push({
          name: 'CameraDetail',
          params: {id: item.deviceId, status: 'data'}
        });
      },
      copyPhoneNo(phoneNo) {
        try {
          this.$util.clipboardCopy(phoneNo);
          this.$message.success('复制成功');
        } catch (err) {
          console.log(err);
          this.$message.error('复制失败');
        }
      },
      // 数据下载
      downloadCamera(item) {
        this.currentCamera = item;
        this.cameraInfo.deviceName = item.deviceName;
        this.downloadVisible = true;
      }
    }
  };
</script>

<style lang="scss" scoped>

  .operator-btn-wrapper {
    justify-content: flex-start;
  }

  .cell-id {
    font-size: 12px;
    font-weight: 400;
    color: rgba(46, 171, 255, 1);
    cursor: pointer;
    &:hover {
      color: rgba(136, 195, 255, 1);
    }
  }

  .cell-manager {
    font-size: 12px;
    font-weight: 400;
    color: rgba(138, 185, 232, 1);
    cursor: pointer;
  }

  /* 设备状态 */
  .online-status {
    color: rgba(126, 211, 33, 1);
  }

  .offline-status {
    color: rgba(255, 110, 110, 1);
  }

  .unstaged-status {
    color: rgba(155, 155, 155, 1);
  }

  .delete-status {
    color: rgba(155, 155, 155, 1);
  }

  .time-block {
    width: 75px;
    text-align: center;
  }

  .table-manage-block {
    div {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: rgba(168, 171, 179, 1);
      &:first-child {
        margin-top: 4px;
        margin-bottom: 6px;
      }
      .svg-block {
        display: flex;
        align-items: center;
        margin-left: 8px;
        height: 10px;
        width: 10px;
        cursor: pointer;
        .svg-icon {
          height: 10px !important;
          width: 10px !important;
        }
      }
    }
  }

  .download-notice {
    width: 251px;
    height: 51px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(111, 116, 128, 1);
    line-height: 17px;
  }

</style>

<style lang="scss">

  #camera-table-container {
    .el-date-editor .el-icon-date, .el-range-editor .el-icon-date {
      display: block;
    }
    .el-date-editor .el-range-input {
      margin-left: 10px;
    }
  }
</style>
