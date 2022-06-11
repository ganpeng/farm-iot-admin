<!-- 摄像头表格组件 -->
<template>
  <div class="camera-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="cameraList">
      <el-table-column
        type="selection"
        width="66px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        align="left"
        label="设备名称">
        <template slot-scope="scope">
          <div class="cell-id" @click="toDetailPage(scope.row)">{{scope.row.deviceName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceType"
        align="left"
        label="接入类型">
        <template slot-scope="scope">
          <div>{{scope.row.deviceType === 'CAMERA' ? '摄像头':'平台NVR'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        align="left"
        label="设备类型">
        <template slot-scope="scope">
          <div>{{cameraType(scope.row.cameraType)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        min-width="180"
        label="streamname">
        <template slot-scope="scope">
          <div>{{scope.row.streamName}}</div>
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
        label="所属农场">
      </el-table-column>
      <!-- <el-table-column
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
      </el-table-column> -->
      <el-table-column
        prop="nationalStandardId"
        align="left"
        width="110px"
        label="devicename">
        <template slot-scope="scope">
          <div>{{scope.row.nationalStandardId}}</div>
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
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="102px"
        label="是否截图">
        <template slot-scope="scope">
          <input
            class="my-switch switch-anim"
            type="checkbox"
            v-model="scope.row.snapshotStatus === 'ON'"
            :checked="scope.row.snapshotStatus === 'ON'"
            @click.prevent="updateDeviceSnapshotStatus(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="102px"
        label="是否录制">
        <template slot-scope="scope">
          <input
            class="my-switch switch-anim"
            type="checkbox"
            v-model="scope.row.monitorRecordStatus === 'ON'"
            :checked="scope.row.monitorRecordStatus === 'ON'"
            @click.prevent="updateDeviceRecordStatus(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="102px"
        label="接收状态">
        <template slot-scope="scope">
          <input
            class="my-switch switch-anim"
            type="checkbox"
            v-model="scope.row.pullable"
            :checked="scope.row.pullable"
            @click.prevent="updateDevicePullable(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column width="130px" align="left" label="操作">
        <template slot-scope="scope">
          <div class="operator-btn-wrapper">
            <span class="btn-text" @click="editCamera(scope.row)">编辑</span>
            <span :class="{disabled:!(!scope.row.pullable || scope.row.deviceStatus === 'UNACTIVE')}"
                  class="btn-text text-danger" @click="removeCamera(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import XLSX from 'xlsx';

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
      return {
        multipleSelection: []
      };
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
    filters: {
      getDeviceStatusName(tag) {
        return {'ONLINE': '在线', 'OFFLINE': '离线', 'UNACTIVE': '未激活', 'LOCKED': '锁定', 'DELETED': '删除'}[tag]
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
      toDetailPage(item) {
        if (!this.$authority.isHasAuthority('admin:camera:detail')) {
          return;
        }
        this.$router.push({
          name: 'CameraDetail',
          params: {id: item.deviceId, status: 'normal'}
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
      updateDevicePullable(item) {
        if (!this.$authority.isHasAuthority('admin:camera:status')) {
          return;
        }
        this.$confirm('此操作将' + (item.pullable ? '拒收' : '接收') + (item.name || '当前') + '设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$service.setCameraPullable({
            deviceId: item.deviceId,
            streamId: item.streamId,
            isPull: !item.pullable
          }).then(response => {
            if (response && response.code === 0) {
              this.$message.success('"' + (item.name || '当前') + '"设备' + (item.pullable ? '拒收成功' : '接收成功'));
              item.pullable = !item.pullable;
            }
          });
        });
      },
      updateDeviceSnapshotStatus(item) {
        this.$confirm('此操作将' + (item.snapshotStatus === 'ON' ? '关闭' : '打开') + (item.name || '当前') + '设备截图功能, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$service.setCameraSnapshotStatus({
            streamId: item.streamId,
            snapshotStatus: item.snapshotStatus === 'ON' ? 'OFF' : 'ON'
          }).then(response => {
            if (response && response.code === 0) {
              if (response.data) {
                this.$message.success('"' + (item.name || '当前') + '"设备' + (item.snapshotStatus === 'ON' ? '关闭截图功能成功' : '打开截图功能成功'));
                item.snapshotStatus = item.snapshotStatus === 'ON' ? 'OFF' : 'ON';
              } else {
                this.$message.warning('"' + (item.name || '当前') + '"设备' + (item.snapshotStatus === 'ON' ? '关闭截图功能失败' : '打开截图功能失败'));
              }
            }
          });
        });
      },
      updateDeviceRecordStatus(item) {
        this.$confirm('此操作将' + (item.monitorRecordStatus === 'ON' ? '关闭' : '打开') + (item.name || '当前') + '设备录制功能, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$service.setCameraRecordStatus({
            streamId: item.streamId,
            monitorRecordStatus: item.monitorRecordStatus === 'ON' ? 'OFF' : 'ON'
          }).then(response => {
            if (response && response.code === 0) {
              if (response.data) {
                this.$message.success('"' + (item.name || '当前') + '"设备' + (item.monitorRecordStatus === 'ON' ? '关闭录制功能成功' : '打开录制功能成功'));
                item.monitorRecordStatus = item.monitorRecordStatus === 'ON' ? 'OFF' : 'ON';
              } else {
                this.$message.warning('"' + (item.name || '当前') + '"设备' + (item.monitorRecordStatus === 'ON' ? '关闭录制功能失败' : '打开录制功能失败'));
              }
            }
          });
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length === 0) {
          this.$emit('setBatchDisabledStatus', true);
        } else {
          this.$emit('setBatchDisabledStatus', false);
        }
      },
      // 删除摄像头，只有离线和未激活的可删除
      removeCamera(camera) {
        if (!this.$authority.isHasAuthority('admin:camera:delete')) {
          return;
        }
        if (!(!camera.pullable || camera.deviceStatus === 'UNACTIVE')) {
          this.$message.warning('只有拒绝 、未激活状态的设备可以删除');
          return;
        }
        this.$confirm('此操作将删除该摄像头, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$service.removeCamera(camera.deviceId).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('摄像头删除成功');
              this.$emit('getCameraList');
            }
          });
        });
      },
      editCamera(item) {
        if (!this.$authority.isHasAuthority('admin:camera:edit')) {
          return;
        }
        this.$router.push({
          name: 'EditCamera',
          params: {id: item.deviceId}
        });
      },
      // 批量导出选择的文件列表的EXCEL文件
      batchExport() {
        let list = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let obj = this.multipleSelection[i];
          list.push({
            '农场名称': obj.farmName,
            '地块名称': obj.landName,
            '设备名称': obj.deviceName,
            '设备位置（经纬度）': (obj.latitude || '') + '/' + (obj.longitude || ''),
            '厂商': {'HAIKANG': '海康', 'DAHUA': '大华', 'HUAWEI': '华为', 'TIANDIWEIYE': '天地伟业'}[obj.cameraVendor],
            '接入类型': obj.deviceType === 'CAMERA' ? '摄像头':'平台NVR',
            '摄像头类型': parseInt(obj.cameraType) === 1 ? '枪机' : '球机',
            '设备账号（设备ID）': obj.deviceId,
            'devicename': obj.nationalStandardId,
            'streamname': obj.streamName,
            '创建时间': this.$util.formatDate(new Date(obj.createdAt), 'yyyy-MM-DD_HH:mm:SS'),
            '负责人姓名': obj.manager,
            '负责人电话': obj.managerPhone,
            '负责人所属公司': obj.managerCompany
          });
        }
        let wb = XLSX.utils.book_new();
        let newWsName = '表1';
        let ws = XLSX.utils.json_to_sheet(list);
        XLSX.utils.book_append_sheet(wb, ws, newWsName);
        XLSX.writeFile(wb, '摄像头设备导出表_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
      }
    }
  };
</script>

<style lang="scss" scoped>

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

  .operator-btn-wrapper {
    justify-content: flex-start;
  }

</style>
