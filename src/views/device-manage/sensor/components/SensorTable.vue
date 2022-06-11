<!-- 传感器表格组件 -->
<template>
  <div class="sensor-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="sensorList">
      <el-table-column
        width="66px"
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        align="left"
        label="设备名称">
        <template slot-scope="scope">
          <div class="cell-id" @click="toDetailPage(scope.row)">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sensorType"
        align="left"
        label="设备类型">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.sensorType || '/'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sensorVendor"
        align="left"
        label="厂商名称">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.sensorVendor}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="farmName"
        align="left"
        label="所属农场">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.farmName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="manager"
        align="left"
        label="负责人">
        <template slot-scope="scope">
          <el-popover class="my-popover" placement="left-start" width="180" trigger="hover"
                      v-if="scope.row.manager">
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
        prop="deviceName"
        align="left"
        width="110px"
        label="devicename">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.deviceName}}</div>
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
        label="接收状态">
        <template slot-scope="scope">
          <input
            v-if="scope.row.sensorType !== '虫情测报灯'"
            class="my-switch switch-anim"
            type="checkbox"
            v-model="scope.row.receive"
            :checked="!!scope.row.receive"
            @click.prevent="updateDeviceReceive(scope.row)"/>
          <input
            v-else
            class="my-switch switch-anim switch-disabled"
            disabled
            type="checkbox"
            :checked="false" />
        </template>
      </el-table-column>
      <el-table-column width="150px" align="left" label="操作">
        <template slot-scope="scope">
          <div class="operator-btn-wrapper">
              <span class="btn-text"
                    v-if="scope.row.sensorType !== '虫情测报灯'"
                    :class="{'disabled': scope.row.deviceStatus === 'OFFLINE' || scope.row.deviceStatus === 'UNACTIVE'}"
                    @click="resetSensor(scope.row)">重启</span>
            <span class="btn-text" @click="editSensor(scope.row)">编辑</span>
            <span :class="{disabled:!(!scope.row.receive || scope.row.deviceStatus === 'UNACTIVE')}"
                  class="btn-text text-danger" @click="removeSensor(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import XLSX from 'xlsx';

  import ClipboardJS from 'clipboard';

  export default {
    name: 'SensorTable',
    props: {
      sensorList: {
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
    filters: {
      getDeviceStatusName(tag) {
        return {'ONLINE': '在线', 'OFFLINE': '离线', 'UNACTIVE': '未激活', 'LOCKED': '锁定', 'DELETED': '删除'}[tag]
      }
    },
    mounted() {
    },
    methods: {
      toDetailPage(item) {
        if (!this.$authority.isHasAuthority('admin:sensor:detail')) {
          return;
        }
        this.$router.push({
          name: 'SensorDetail',
          params: {id: item.id, status: 'normal'}
        });
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'odd-row';
        } else if (rowIndex % 2 === 0) {
          return 'even-row';
        }
        return '';
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
      // 只有在线设备重启
      resetSensor(item) {
        if (!this.$authority.isHasAuthority('admin:sensor:reboot')) {
          return;
        }
        if (item.deviceStatus === 'OFFLINE' || item.deviceStatus === 'UNACTIVE') {
          this.$message.warning('只有状态为在线的设备才可以重启');
          return;
        }
        this.$confirm('此操作将重启' + (item.name || '当前') + '设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$service.resetSensor({
            deviceName: item.deviceName,
            id: item.id,
          }).then(response => {
            if (response && response.code === 0) {
              this.$message.success('当前设备重启成功');
            }
          });
        });
      },
      updateDeviceReceive(item) {
        if (!this.$authority.isHasAuthority('admin:sensor:status')) {
          return;
        }
        this.$confirm('此操作将' + (!!item.receive ? '拒收' : '接收') + (item.name || '当前') + '设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$service.updateDeviceReceive({
            deviceName: item.deviceName,
            id: item.id,
            receive: item.receive === 0 ? 1 : 0
          }).then(response => {
            if (response && response.code === 0) {
              this.$message.success('"' + (item.name || '当前') + '"设备' + (!!item.receive ? '拒收成功' : '接收成功'));
              item.receive = !item.receive;
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
      // 删除传感器，只有离线和未激活的可删除
      removeSensor(sensor) {
        if (!this.$authority.isHasAuthority('admin:sensor:delete')) {
          return;
        }
        if (!(!sensor.receive || sensor.deviceStatus === 'UNACTIVE')) {
          this.$message.warning('只有拒绝 、未激活状态的设备可以删除');
          return;
        }
        this.$confirm('<div class="message-notice-block"><div>确定删除该设备？</div><div>删除后将不能恢复，请谨慎操作。</div></div>', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$service.removeSensor(sensor.id).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('传感器删除成功');
              this.$emit('getSensorList');
            }
          });
        });
      },
      editSensor(item) {
        if (!this.$authority.isHasAuthority('admin:sensor:edit')) {
          return;
        }
        this.$router.push({
          name: 'EditSensor',
          params: {id: item.id}
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
            '设备名称': obj.name,
            '传感器类型': obj.sensorType || '/',
            '设备位置（经纬度）': (obj.latitude || '') + '/' + (obj.longitude || ''),
            '厂商': obj.sensorVendor,
            'devicename': obj.deviceId,
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
        XLSX.writeFile(wb, '传感器设备导出表_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
      }
    }
  };
</script>
<style>
.switch-disabled {
  cursor: not-allowed;
}
.switch-disabled.my-switch:before {
  background-color: #92999E;
}
</style>
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

  .table-item {
    &:hover {
      color: #f0f0f0;
    }
  }

  .cell-manager {
    font-size: 12px;
    font-weight: 400;
    color: rgba(138, 185, 232, 1);
    cursor: pointer;
  }

  .time-block {
    width: 75px;
    text-align: center;
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
