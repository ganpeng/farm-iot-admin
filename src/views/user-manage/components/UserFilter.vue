<!--用户列表搜索参数设置组件-->
<template>
  <div id="user-search-container">
    <div @keyup.enter="getUserList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.keyword"
            @change="getUserList(true)"
            class="border-input keyword-input"
            placeholder="用户名称/企业名称">
            <span slot="append" @click="getUserList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item label="角色" v-if="!$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN'">
          <el-select
            v-model="listQueryParams.roleId"
            @change="getUserList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="listQueryParams.status"
            @change="getUserList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in statusOptions"
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
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'UserFilter',
    data() {
      return {
        listQueryParams: {
          keyword: '',
          status: '',
          roleId: ''
        },
        roleOptions: [],
        statusOptions: [{
          value: 'NORMAL',
          label: '正常'
        }, {
          value: 'FORBIDDEN',
          label: '禁用'
        }]
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN') {
          this.$service.getRoleList({visible: true, pageNum: 1, pageSize: 1000}).then(res => {
            if (res && res.code === 0) {
              this.roleOptions = res.data.list;
            }
          });
        }
      },
      initFilterParams(params) {
        this.listQueryParams.keyword = params.keyword ? params.keyword : '';
        this.listQueryParams.status = params.status ? params.status : '';
        this.listQueryParams.roleId = params.roleId ? params.roleId : '';
      },
      getUserList(isReset) {
        if (!this.$authority.isHasAuthority('admin:admin:page')) {
          return;
        }
        this.$emit('getUserList', this.listQueryParams, isReset);
      },
      clearFilters() {
        for (let key in this.listQueryParams) {
          this.listQueryParams[key] = '';
        }
        this.getUserList(true);
      }
    }
  };
</script>

<style lang="scss" scoped>

  #user-search-container {
    margin-bottom: 10px;
  }

</style>
