<!--摄像头列表搜索参数设置组件-->
<template>
  <div id="camera-search-container">
    <div @keyup.enter="getCameraList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.keyword"
            @change="getCameraList(true)"
            class="border-input keyword-input"
            placeholder="devicename、农场名称">
            <span slot="append" @click="getCameraList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item label="接入类型">
          <el-select
            v-model="listQueryParams.deviceType"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in cameraTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="listQueryParams.cameraType"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂商">
          <el-select
            v-model="listQueryParams.cameraVendor"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in cameraVendorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select
            v-model="listQueryParams.deviceStatus"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in deviceStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="reset-btn"
            @click="clearFilters"
            type="primary">
            <svg-icon icon-class="reset_filter_active"></svg-icon>
            <svg-icon icon-class="reset_filter_normal"></svg-icon>
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="text"
            @click="moreFilters = !moreFilters"
            class="more-filters"
            :class="{active:moreFilters}">
            更多筛选
            <i class="el-icon-arrow-up" v-if="moreFilters"></i>
            <i class="el-icon-arrow-down" v-else></i>
          </el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="more-filter-box filter-form" v-if="moreFilters">
        <el-form-item label="截图">
          <el-select
            v-model="listQueryParams.snapshotStatus"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in snapshotStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收状态">
          <el-select
            v-model="listQueryParams.pullable"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in pullableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否录制">
          <el-select
            v-model="listQueryParams.monitorRecordStatus"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in monitorRecordStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接入时间">
          <el-date-picker
            v-model="createRangeTime"
            type="daterange"
            @change="getCameraList(true)"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import constants from "@/util/constants";
  export default {
    name: 'CameraFilter',
    data() {
      return {
        listQueryParams: {
          keyword: '',
          cameraType: '',
          cameraVendor: '',
          deviceStatus: '',
          pullable: '',
          startedTime: '',
          endedTime: '',
          snapshotStatus: '',
          deviceType: '',
          monitorRecordStatus: '' // 是否录制
        },
        createRangeTime: [],
        cameraTypeOptions: constants.CAMERA_TYPE_OPTIONS,
        typeOptions: [{
          value: 1,
          label: '枪机摄像头'
        }, {
          value: 2,
          label: '球机摄像头'
        }, {
          value: 6,
          label: '全景摄像头'
        }],
        cameraVendorOptions: [{
          value: 'HAIKANG',
          label: '海康'
        }, {
          value: 'DAHUA',
          label: '大华'
        }, {
          value: 'HUAWEI',
          label: '华为'
        }, {
          value: 'TIANDIWEIYE',
          label: '天地伟业'
        }],
        deviceStatusOptions: [{
          value: 'ONLINE',
          label: '在线'
        }, {
          value: 'OFFLINE',
          label: '离线'
        }, {
          value: 'UNACTIVE',
          label: '未激活'
        }],
        snapshotStatusOptions: [{
          value: 'ON',
          label: '开启'
        }, {
          value: 'OFF',
          label: '关闭'
        }],
        pullableOptions: [{
          value: true,
          label: '接收'
        }, {
          value: false,
          label: '拒收'
        }],
        monitorRecordStatusOptions: [
          {
            value: 'ON',
            label: '是'
          }, {
            value: 'OFF',
            label: '否'
          }
        ],
        moreFilters: false
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {

      },
      initFilterParams(params) {
        this.listQueryParams.keyword = params.keyword ? params.keyword : '';
        this.listQueryParams.type = params.type ? params.type : '';
        this.listQueryParams.cameraVendor = params.cameraVendor ? params.cameraVendor : '';
        this.listQueryParams.deviceStatus = params.deviceStatus ? params.deviceStatus : '';
        this.listQueryParams.snapshotStatus = params.snapshotStatus ? params.snapshotStatus : '';
        this.listQueryParams.pullable = params.pullable !== '' ? params.pullable : '';
        this.listQueryParams.startedTime = params.startedTime ? params.startedTime : '';
        this.listQueryParams.endedTime = params.endedTime ? params.endedTime : '';
        this.createRangeTime = params.startedTime ? [params.startedTime, params.endedTime] : [];
      },
      getCameraList(isReset) {
        if (!this.$authority.isHasAuthority('admin:camera:page')) {
          return;
        }
        if (this.createRangeTime && this.createRangeTime.length === 2) {
          this.listQueryParams.startedTime = this.createRangeTime[0];
          this.listQueryParams.endedTime = this.createRangeTime[1];
        } else {
          this.listQueryParams.startedTime = '';
          this.listQueryParams.endedTime = '';
        }
        this.$emit('getCameraList', this.listQueryParams, isReset);
      },
      clearFilters() {
        for (let key in this.listQueryParams) {
          if (Array.isArray(this.listQueryParams[key])) {
            this.listQueryParams[key] = [];
          } else {
            this.listQueryParams[key] = '';
          }
        }
        this.createRangeTime = [];
        this.getCameraList(true);
      }
    }
  };
</script>

<style lang="scss" scoped>

  #camera-search-container {
    margin-bottom: 10px;
  }

</style>
