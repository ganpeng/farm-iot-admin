<!-- 模型表格组件 -->
<template>
  <div class="model-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="modelList">
      <el-table-column
        width="20px">
      </el-table-column>
      <el-table-column
        prop="modelCode"
        align="left"
        width="200px"
        label="模型ID">
        <template slot-scope="scope">
          <div class="cell-id" @click="toDetailPage(scope.row)">{{scope.row.modelCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="left"
        min-width="220px"
        label="模型名称">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="isUsedNum"
        align="left"
        min-width="135px"
        label="在用设备（个）">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.isUsedNum}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="isUsedNum"
        align="left"
        min-width="135px"
        label="设备类型">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.sensorType | deviceType}}</div>
        </template>
      </el-table-column>      
      <el-table-column
        prop="description"
        align="left"
        min-width="350px"
        label="模型说明">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.description.length > 20" popper-class="description-display" effect="light"
                      :content="scope.row.description"
                      placement="bottom-start">
            <span class="description my-ellipsis">{{scope.row.description}}</span>
          </el-tooltip>
          <span v-else class="description my-ellipsis">{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="160px"
        label="创建时间">
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
        width="160px"
        label="更新时间">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.updatedAt | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="left" label="操作">
        <template slot-scope="scope">
          <div class="operator-btn-wrapper">
            <span class="btn-text" @click="editModel(scope.row)">编辑</span>
            <span :class="{disabled:scope.row.isUsedNum !== 0}"
                  class="btn-text text-danger" @click="removeModel(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name: 'ModelTable',
    props: {
      modelList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {};
    },
    mounted() {
    },
    methods: {
      toDetailPage(item) {
        if (!this.$authority.isHasAuthority('admin:model:detail')) {
          return;
        }
        this.$router.push({
          name: 'ModelDetail',
          params: {id: item.id}
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
      // 删除模型，只有未关联的才可以删除，后端处理
      removeModel(model) {
        if (!this.$authority.isHasAuthority('admin:model:delete')) {
          return;
        }
        if (model.isUsedNum !== 0) {
          this.$message.warning('有设备在使用该模型，不支持删除');
          return;
        }
        this.$confirm('<div class="message-notice-block"><div>确定删除该模型？</div><div>删除后将不能恢复，请谨慎操作。</div></div>', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$service.removeModel(model.id).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('模型删除成功');
              this.$emit('getModelList');
            }
          });
        });
      },
      editModel(item) {
        if (!this.$authority.isHasAuthority('admin:model:edit')) {
          return;
        }
        this.$router.push({
          name: 'EditModel',
          params: {id: item.id}
        });
      }
    }
  };
</script>

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

  .operator-btn-wrapper {
    justify-content: flex-start;
  }

  .el-tooltip {
    display: block;
    width: 80%;
  }

  .description {
    margin-right: 40px;
    color: #8AB9E8;
  }


</style>
