<!--版本列表搜索参数设置组件-->
<template>
  <div id="version-search-container">
    <div @keyup.enter="getVersionList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.keyword"
            @change="getVersionList(true)"
            class="border-input keyword-input"
            placeholder="版本名称/版本号">
            <span slot="append" @click="getVersionList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="listQueryParams.clientType"
            @change="getVersionList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in clientTypeOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方式">
          <el-select
            v-model="listQueryParams.upgradeType"
            @change="getVersionList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in upgradeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="listQueryParams.versionStatus"
            @change="getVersionList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in versionStatusOptions"
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
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="createRangeTime"
            type="daterange"
            @change="getVersionList(true)"
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

  export default {
    name: 'VersionFilter',
    data() {
      return {
        listQueryParams: {
          keyword: '',
          clientType: '',
          upgradeType: '',
          versionStatus: '',
          releasedStart: '',
          releasedEnd: ''
        },
        createRangeTime: [],
        clientTypeOptions: [{value: 'ANDROID'}, {value: 'IOS'}],
        upgradeTypeOptions: [{value: 'FORCE', label: '强制升级'}, {value: 'OPTIONAL', label: '选择升级'}],
        versionStatusOptions: [{value: 'UNRELEASED', label: '未发布'},
          {value: 'RELEASED', label: '已发布'},
          {value: 'WITHDRAW', label: '已撤回'}],
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
        this.listQueryParams.clientType = params.clientType ? params.clientType : '';
        this.listQueryParams.upgradeType = params.upgradeType ? params.upgradeType : '';
        this.listQueryParams.versionStatus = params.versionStatus ? params.versionStatus : '';
        this.listQueryParams.releasedStart = params.releasedStart ? params.releasedStart : '';
        this.listQueryParams.releasedEnd = params.releasedEnd ? params.releasedEnd : '';
        this.createRangeTime = params.releasedStart ? [params.releasedStart, params.releasedEnd] : [];
      },
      getVersionList(isReset) {
        if (!this.$authority.isHasAuthority('admin:version:page', true)) {
          return;
        }
        if (this.createRangeTime && this.createRangeTime.length === 2) {
          this.listQueryParams.releasedStart = this.createRangeTime[0];
          this.listQueryParams.releasedEnd = this.createRangeTime[1];
        } else {
          this.listQueryParams.releasedStart = '';
          this.listQueryParams.releasedEnd = '';
        }
        this.$emit('getVersionList', this.listQueryParams, isReset);
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
        this.getVersionList(true);
      }
    }
  };
</script>

<style lang="scss" scoped>

  #version-search-container {
    margin-bottom: 10px;
  }

</style>
