<!--传感器列表搜索参数设置组件-->
<template>
  <div id="sensor-search-container">
    <div @keyup.enter="getSensorList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.keyword"
            @change="getSensorList(true)"
            class="border-input keyword-input"
            placeholder="devicename、农场名称">
            <span slot="append" @click="getSensorList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="listQueryParams.sensorType"
            @change="getSensorList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in sensorTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂商">
          <el-select
            v-model="listQueryParams.sensorVendor"
            @change="getSensorList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in sensorVendorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select
            v-model="listQueryParams.deviceStatus"
            @change="getSensorList(true)"
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
        <el-form-item label="接收状态">
          <el-select
            v-model="listQueryParams.receive"
            @change="getSensorList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in receiveOptions"
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
        <el-form-item label="接入时间">
          <el-date-picker
            v-model="createRangeTime"
            type="daterange"
            @change="getSensorList(true)"
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
    name: 'SensorFilter',
    data() {
      return {
        listQueryParams: {
          keyword: '',
          sensorVendor: '',
          sensorType: '',
          deviceStatus: '',
          receive: '',
          startedTime: '',
          endedTime: ''
        },
        createRangeTime: [],
        sensorVendorOptions: constants.SENSOR_VENDOR_OPTIONS,
        sensorTypeOptions: constants.SENSOR_TYPE_OPTIONS,
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
        receiveOptions: [{
          value: true,
          label: '接收'
        }, {
          value: false,
          label: '拒收'
        }],
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
        this.listQueryParams.sensorVendor = params.sensorVendor ? params.sensorVendor : '';
        this.listQueryParams.sensorType = params.sensorType ? params.sensorType : '';
        this.listQueryParams.deviceStatus = params.deviceStatus ? params.deviceStatus : '';
        this.listQueryParams.receive = params.receive !== '' ? params.receive : '';
        this.listQueryParams.startedTime = params.startedTime ? params.startedTime : '';
        this.listQueryParams.endedTime = params.endedTime ? params.endedTime : '';
        this.createRangeTime = params.startedTime ? [params.startedTime, params.endedTime] : [];
      },
      getSensorList(isReset) {
        if (!this.$authority.isHasAuthority('admin:sensor:page')) {
          return;
        }
        if (this.createRangeTime && this.createRangeTime.length === 2) {
          this.listQueryParams.startedTime = this.createRangeTime[0];
          this.listQueryParams.endedTime = this.createRangeTime[1];
        } else {
          this.listQueryParams.startedTime = '';
          this.listQueryParams.endedTime = '';
        }
        this.$emit('getSensorList', this.listQueryParams, isReset);
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
        this.getSensorList(true);
      }
    }
  };
</script>

<style lang="scss" scoped>

  #sensor-search-container {
    margin-bottom: 10px;
  }

</style>
