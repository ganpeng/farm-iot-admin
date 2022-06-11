<!-- 版本表格组件 -->
<template>
  <div class="version-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="versionList">
      <el-table-column
        width="20px">
      </el-table-column>
      <el-table-column
        prop="no"
        align="left"
        label="编号">
        <template slot-scope="scope">
          <div>{{scope.row.no}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="left"
        label="版本名称">
        <template slot-scope="scope">
          <div class="cell-id" @click="toDetailPage(scope.row)">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        align="left"
        label="版本号">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.id}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="clientType"
        align="left"
        label="类型">
        <template slot-scope="scope">
          <label>{{scope.row.clientType === 'ANDROID' ? 'Android':'iOS'}}</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="versionName"
        align="left"
        label="升级包">
        <template slot-scope="scope">
          <label class="cell-id" @click="downloadFile(scope.row)">{{scope.row.versionName}}</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="upgradeType"
        align="left"
        label="升级方式">
        <template slot-scope="scope">
          <label>{{scope.row.upgradeType === 'FORCE' ? '强制升级' : '选择升级'}}</label>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="160px"
        label="创建时间">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.createDate | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.createDate | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        align="left"
        width="160px"
        label="发布时间">
        <template slot-scope="scope">
          <div class="time-block" v-if="scope.row.releaseDate">
            <div>{{scope.row.releaseDate | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.releaseDate | formatDate('HH:mm')}}</div>
          </div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="102px"
        label="状态">
        <template slot-scope="scope">
          <div>{{getVersionStatus(scope.row.versionStatus)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="150px"
        align="left"
        label="操作">
        <template slot-scope="scope">
          <div class="operator-btn-wrapper">
            <span class="btn-text" @click="editVersion(scope.row)"
                  v-if="scope.row.versionStatus === 'UNRELEASED'">编辑</span>
            <span class="btn-text" @click="updateStatus(scope.row)"
                  v-if="scope.row.versionStatus === 'UNRELEASED'">发布</span>
            <span class="btn-text" @click="updateStatus(scope.row)"
                  v-if="scope.row.versionStatus === 'RELEASED'">撤回</span>
            <!--<span class="btn-text text-danger" v-if="scope.row.versionStatus === 'UNRELEASED'"-->
            <!--@click="removeVersion(scope.row)">删除</span>-->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name: 'VersionTable',
    props: {
      versionList: {
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
      getVersionStatus(versionStatus) {
        switch (versionStatus) {
          case 'UNRELEASED':
            return '未发布';
          case 'RELEASED':
            return '已发布';
          case 'WITHDRAW':
            return '已撤回';
          default:
            return '/';
        }
      },
      toDetailPage(item) {
        if (!this.$authority.isHasAuthority('admin:version:get')) {
          return;
        }
        this.$router.push({
          name: 'VersionDetail',
          params: {no: item.no}
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
      downloadFile(item) {
        this.$message.success('正在下载中');
        let aLink = document.createElement('a');
        aLink.href = item.upgradeUrl;
        aLink.setAttribute('download', item.versionName);
        aLink.click();
      },
      removeVersion(item) {
        if (!this.$authority.isHasAuthority('admin:version:delete')) {
          return;
        }
        this.$confirm('<div class="message-notice-block"><div>确定删除该版本？</div><div>删除后将不能恢复，请谨慎操作。</div></div>', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$service.removeVersion(item.no).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('版本删除成功');
              this.$emit('getVersionList');
              this.$emit('getVersionFixedTotal');
            }
          });
        });
      },
      updateStatus(item) {
        if (!this.$authority.isHasAuthority('admin:version:operate')) {
          return;
        }
        this.$confirm('此操作将' + (item.versionStatus === 'UNRELEASED' ? '发布' : '撤回') + (item.name || '当前') + '版本, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'simple-message'
        }).then(() => {
          this.$service.updateVersionStatus({
            no: item.no,
            versionStatus: item.versionStatus === 'UNRELEASED' ? 'RELEASED' : 'WITHDRAW'
          }).then(response => {
            if (response && response.code === 0) {
              this.$message.success('"' + (item.name || '当前') + '"版本' + (item.versionStatus === 'UNRELEASED' ? '发布' : '撤回') + '成功');
              this.$emit('getVersionList');
            }
          });
        });
      },
      editVersion(item) {
        if (!this.$authority.isHasAuthority('admin:version:edit')) {
          return;
        }
        this.$router.push({
          name: 'EditVersion',
          params: {no: item.no}
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
