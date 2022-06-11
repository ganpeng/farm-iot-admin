<!--模型列表-->
<template>
  <div id="model-list-container">
    <div id="device-data-block">
      <div>
        <label><i></i>总数</label>
        <span>{{fixedTotal}}</span>
      </div>
    </div>
    <model-filter
      ref="modelFilter"
      v-on:getModelList="getModelList">
    </model-filter>
    <div id="filter-operate-block">
      <div></div>
      <el-button
        class="filter-add-btn"
        @click="createModel">
        <svg-icon icon-class="add_plus"></svg-icon>
        添加
      </el-button>
    </div>
    <model-table
      ref="modelTable"
      :modelList="modelList"
      v-on:getModelList="getModelList">
    </model-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQueryParams.pageNum"
      :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
      :page-size="listQueryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import ModelFilter from './components/ModelFilter';
  import ModelTable from './components/ModelTable';

  export default {
    name: 'ModelList',
    components: {
      ModelFilter,
      ModelTable,
    },
    data() {
      return {
        deviceDataObj: {},
        listQueryParams: {
          pageNum: 1,
          pageSize: 10
        },
        total: 1000000,
        modelList: [],
        fixedTotal: 0
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getModelFixedTotal();
        if (this.$wsCache.localStorage.get('modelFilter')) {
          this.listQueryParams.pageSize = this.$wsCache.localStorage.get('modelFilter').pageSize;
          this.listQueryParams.pageNum = this.$wsCache.localStorage.get('modelFilter').pageNum;
          this.listQueryParams = this.$wsCache.localStorage.get('modelFilter');
          this.$refs.modelFilter.initFilterParams(this.listQueryParams);
        }
        this.getModelList();
      },
      handleSizeChange(pageSize) {
        this.listQueryParams.pageSize = pageSize;
        this.getModelList();
      },
      handleCurrentChange(pageNum) {
        this.listQueryParams.pageNum = pageNum;
        this.getModelList();
      },
      getModelList(searchParams, isReset) {
        // 设置请求参数
        if (searchParams) {
          for (let key in searchParams) {
            this.listQueryParams[key] = searchParams[key];
          }
        }
        if (isReset) {
          this.listQueryParams.pageNum = 1;
        }
        this.$wsCache.localStorage.set('modelFilter', this.listQueryParams);
        this.$service.getModelList(this.listQueryParams).then(response => {
          if (response && response.code === 0) {
            this.modelList = response.data.list;
            this.total = response.data.total;
          } else {
            this.total = 0;
          }
        });
      },
      createModel() {
        if (!this.$authority.isHasAuthority('admin:model:add')) {
          return;
        }
        this.$router.push({
          name: 'CreateModel'
        });
      },
      getModelFixedTotal() {
        this.$service.getModelFixedTotal().then(response => {
          if (response && response.code === 0) {
            this.fixedTotal = response.data;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

  #device-data-block {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
      padding: 10px;
      margin-right: 12px;
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      width: 270px;
      height: 80px;
      background: rgba(32, 44, 65, 1);
      border-radius: 10px;

      label {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);

        i {
          margin-right: 8px;
          width: 2px;
          height: 20px;
          background: rgba(248, 101, 73, 1);
        }
      }

      span {
        align-self: flex-end;
        font-size: 32px;
        font-weight: 400;
        color: rgba(138, 185, 232, 1);
        line-height: 45px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  #model-list-container {
    padding-left: 18px;
    padding-right: 18px;
    position: relative;
    margin-top: 14px;

    #filter-operate-block {
      display: flex;
      align-items: center;
      position: absolute;
      right: 40px;
      top: 118px;
    }
  }

  .el-pagination {
    margin-bottom: 77px;
  }

</style>
