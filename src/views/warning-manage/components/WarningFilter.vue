<!--预警列表搜索参数设置组件-->
<template>
  <div id="warning-search-container">
    <div @keyup.enter="getWarningList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.keyword"
            @change="getWarningList(true)"
            class="border-input keyword-input"
            placeholder="农场名称、设备ID">
            <span slot="append" @click="getWarningList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item label="预警类型">
          <el-select
            v-model="listQueryParams.warnType"
            @change="selectWarningType"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in warningTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警模型">
          <el-autocomplete
            :disabled="listQueryParams.warnType !== 'MODEL_WARN'"
            v-model="listQueryParams.name"
            value-key="name"
            :fetch-suggestions="querySearchModelAsync"
            placeholder="全部"
            @select="handleSelectModel">
          </el-autocomplete>
          <!--<el-select-->
          <!--:disabled="listQueryParams.warnType !== 'MODEL_WARN'"-->
          <!--v-model="listQueryParams.modelId"-->
          <!--@change="getWarningList(true)"-->
          <!--clearable-->
          <!--placeholder="全部">-->
          <!--<el-option-->
          <!--v-for="item in warningModelOptions"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
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
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'WarningFilter',
    data() {
      return {
        listQueryParams: {
          keyword: '',
          status: '',
          warnType: '',
          modelId: '',
          name: ''
        },
        warningTypeOptions: [{
          value: 'DEVICE_ERROR',
          label: '设备异常'
        }, {
          value: 'MODEL_WARN',
          label: '模型预警'
        }],
        warningModelOptions: []
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.$service.getModelList({pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            this.warningModelOptions = response.data.list;
          }
        });
      },
      // 获取预警模型列表
      querySearchModelAsync(queryString, cb) {
        this.$service.getModelList({keyword: queryString, pageNum: 0, pageSize: 10000}).then(response => {
          if (response && response.code === 0) {
            cb(response.data.list);
          }
        });
      },
      handleSelectModel(item) {
        this.listQueryParams.modelId = item.id;
        this.getWarningList(true);
      },
      initFilterParams(params) {
        this.listQueryParams.keyword = params.keyword ? params.keyword : '';
        this.listQueryParams.status = params.status ? params.status : '';
        this.listQueryParams.warnType = params.warnType ? params.warnType : '';
        this.listQueryParams.name = params.name ? params.name : '';
        this.listQueryParams.modelId = params.modelId ? params.modelId : '';
      },
      selectWarningType() {
        if (this.listQueryParams.warnType !== 'MODEL_WARN') {
          this.listQueryParams.modelId = '';
          this.listQueryParams.name = '';
        }
        this.getWarningList(true);
      },
      getWarningList(isReset) {
        if (!this.$authority.isHasAuthority('admin:warn:page')) {
          return;
        }
        this.$emit('getWarningList', this.listQueryParams, isReset);
      },
      clearFilters() {
        for (let key in this.listQueryParams) {
          if (Array.isArray(this.listQueryParams[key])) {
            this.listQueryParams[key] = [];
          } else {
            this.listQueryParams[key] = '';
          }
        }
        this.getWarningList(true);
      }
    }
  };
</script>

<style lang="scss" scoped>

  #warning-search-container {
    margin-bottom: 10px;
  }

</style>
