<!--角色列表搜索参数设置组件-->
<template>
  <div id="role-search-container">
    <div @keyup.enter="getRoleList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.keyword"
            @change="getRoleList(true)"
            class="border-input keyword-input"
            placeholder="角色名称">
            <span slot="append" @click="getRoleList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item v-show="false">
          <el-input
            v-model="listQueryParams.keyword"
            @change="getRoleList(true)"
            class="border-input keyword-input"
            placeholder="角色名称">
            <span slot="append" @click="getRoleList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
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
    name: 'RoleFilter',
    data() {
      return {
        listQueryParams: {
          keyword: ''
        }
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
      },
      getRoleList(isReset) {
        this.$emit('getRoleList', this.listQueryParams, isReset);
      },
      clearFilters() {
        for (let key in this.listQueryParams) {
          this.listQueryParams[key] = '';
        }
        this.getRoleList(true);
      }
    }
  };
</script>

<style lang="scss" scoped>

  #role-search-container {
    margin-bottom: 10px;
  }

</style>
