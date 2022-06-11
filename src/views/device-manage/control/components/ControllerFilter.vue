<!--传感器列表搜索参数设置组件-->
<template>
  <div id="sensor-search-container">
    <div @keyup.enter="getControllerList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.keyword"
            @change="getControllerList(true)"
            class="border-input keyword-input"
            placeholder="devicename、农场名称">
            <span slot="append" @click="getControllerList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <!--
        <el-form-item label="类型">
          <el-select
            v-model="listQueryParams.controllerType"
            @change="getControllerList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in controllerTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        -->
        <el-form-item label="厂商">
          <el-select
            v-model="listQueryParams.controllerVendor"
            @change="getControllerList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in controllerVendorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select
            v-model="listQueryParams.deviceStatus"
            @change="getControllerList(true)"
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
            @change="getControllerList(true)"
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
            @change="getControllerList(true)"
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
    name: 'ControllerFilter',
    data() {
      return {
        listQueryParams: {
          keyword: '',
          controllerVendor: '',
          // controllerType: '',
          deviceStatus: '',
          receive: '',
          startedTime: '',
          endedTime: ''
        },
        createRangeTime: [],
        controllerVendorOptions: constants.CONTROLLER_VENDOR_OPTIONS,
        // controllerTypeOptions: constants.SENSOR_TYPE_OPTIONS,
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
          value: '1',
          label: '接收'
        }, {
          value: '0',
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
        this.listQueryParams.controllerVendor = params.controllerVendor ? params.controllerVendor : '';
        // this.listQueryParams.controllerType = params.controllerType ? params.controllerType : '';
        this.listQueryParams.deviceStatus = params.deviceStatus ? params.deviceStatus : '';
        this.listQueryParams.receive = params.receive !== '' ? params.receive : '';
        this.listQueryParams.startedTime = params.startedTime ? params.startedTime : '';
        this.listQueryParams.endedTime = params.endedTime ? params.endedTime : '';
        this.createRangeTime = params.startedTime ? [params.startedTime, params.endedTime] : [];
      },
      getControllerList(isReset) {
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
        this.$emit('getControllerList', this.listQueryParams, isReset);
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
        this.getControllerList(true);
      }
    }
  };
</script>

<style lang="scss" scoped>

  #sensor-search-container {
    margin-bottom: 10px;
  }

</style>
