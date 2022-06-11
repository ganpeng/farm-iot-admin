<!--模型列表搜索参数设置组件-->
<template>
  <div id="model-search-container">
    <div @keyup.enter="getModelList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.keyword"
            @change="getModelList(true)"
            class="border-input keyword-input"
            placeholder="模型名称">
            <span slot="append" @click="getModelList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select
            v-model="listQueryParams.sensorType"
            clearable
            placeholder="请选择"
            @change="getModelList(true)"
            @clear="getModelList(false)"
          >
            <el-option
              v-for="(item, _index) in deviceTypeOptios"
              :key="_index"
              :label="item.value"
              :value="item.name"
            ></el-option>
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
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

  export default {
    name: 'ModelFilter',
    data() {
      return {
        listQueryParams: {
          keyword: '',
          sensorType: '',
        }
      };
    },
    mounted() {
      this.init();
    },
    computed: {
      ...mapGetters({
        dict: "dict/dict",
      }),  
      deviceTypeOptios() {
        return this.dict.sensorType || [];
      }, 
    }, 
    methods: {
      init() {
      },
      initFilterParams(params) {
        this.listQueryParams.keyword = params.keyword ? params.keyword : '';
        // TODO 1228
        this.listQueryParams.sensorType = params.sensorType ? params.sensorType : '';
        this.listQueryParams.metric = params.metric ? params.metric : '';
      },
      getModelList(isReset) {
        if (!this.$authority.isHasAuthority('admin:model:page')) {
          return;
        }
        this.$emit('getModelList', this.listQueryParams, isReset);
      },
      clearFilters() {
        for (let key in this.listQueryParams) {
          if (Array.isArray(this.listQueryParams[key])) {
            this.listQueryParams[key] = [];
          } else {
            this.listQueryParams[key] = '';
          }
        }
        this.getModelList(true);
      },
    }
  };
</script>

<style lang="scss" scoped>

  #model-search-container {
    margin-bottom: 10px;
  }

</style>
