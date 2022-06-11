<!-- 版本详情 -->
<template>
  <div id="version-detail-container">
    <div id="detail-block">
      <div class="header-block">
        <div class="title">版本信息</div>
        <label class="status status-unreleased" v-if="versionInfo.versionStatus === 'UNRELEASED'">未发布</label>
        <label class="status status-released" v-if="versionInfo.versionStatus === 'RELEASED'">已发布</label>
        <label class="status status-withdraw" v-if="versionInfo.versionStatus === 'WITHDRAW'">已撤回</label>
      </div>
      <div class="content-block">
        <div class="part-content-block">
          <div class="content-item">
            <label>版本名称</label>
            <span>{{versionInfo.name}}</span>
          </div>
          <div class="content-item">
            <label>类型</label>
            <span>{{versionInfo.clientType === 'ANDROID' ? 'Android':'iOS'}}</span>
          </div>
          <div class="content-item">
            <label>更新描述</label>
            <span>{{versionInfo.upgradeDesc}}</span>
          </div>
          <div class="content-item">
            <label>升级包</label>
            <span>{{versionInfo.versionName}}</span>
            <i @click="downloadFile">下载</i>
          </div>
        </div>
        <div class="part-content-block">
          <div class="content-item">
            <label>版本号</label>
            <span>{{versionInfo.versionNo}}</span>
          </div>
          <div class="content-item">
            <label>升级方式</label>
            <span>{{versionInfo.upgradeType === 'FORCE' ? '强制升级' : '选择升级'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two edit-bottom-btn"
                 type="primary"
                 @click="editVersion"
                 v-if="versionInfo.versionStatus === 'UNRELEASED'">编辑
      </el-button>
      <el-button class="btn-style-three" @click="toVersionList" plain>返回列表</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app-version-detail',
    data() {
      return {
        versionInfo: {}
      }
    },
    mounted() {
      this.getVersionDetail();
    },
    methods: {
      getVersionDetail() {
        this.$service.getAppVersionDetail(this.$route.params.no).then(response => {
          if (response && response.code === 0) {
            this.versionInfo = response.data;
          }
        })
      },
      editVersion() {
        // TODO
        if (!this.$authority.isHasAuthority('admin:version:edit')) {
          return;
        }
        this.$router.push({
          name: 'EditAppVersion',
          params: {no: this.$route.params.no}
        });
      },
      toVersionList() {
        // TODO 
        if (!this.$authority.isHasAuthority('admin:version:page')) {
          return;
        }
        this.$router.push({name: 'AppVersion'});
      },
      downloadFile() {
        this.$message.success('正在下载中');
        let aLink = document.createElement('a');
        aLink.href = this.versionInfo.upgradeUrl;
        aLink.setAttribute('download', this.versionInfo.versionName);
        aLink.click();
      }
    }
  }
</script>

<style scoped lang="scss">

  #version-detail-container {
    padding: 0 20px;
  }

  #detail-block {
    margin-top: 20px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;
    .header-block {
      height: 62px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid #3E495E;
      .title {
        margin: 0 20px;
        font-size: 16px;
        font-weight: 500;
        color: #F0F0F0;
      }
      .status {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 32px;
        background: #2A394E;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 400;
        &.status-unreleased {
          color: #FFA147;
        }
        &.status-released {
          color: #7ED321;
        }
        &.status-withdraw {
          color: #9B9B9B;
        }
      }
    }
  }

  .content-block {
    padding: 30px 0;
    display: flex;
    .part-content-block {
      margin-left: 72px;
      display: flex;
      flex-direction: column;
      &:first-child {
        margin-left: 105px;
      }
      .content-item {
        margin-bottom: 10px;
        display: flex;
        &:last-child {
          margin-bottom: 0;
        }
        label {
          margin-right: 20px;
          text-align: right;
          width: 60px;
          font-size: 14px;
          font-weight: 400;
          color: #9FA8B8;
        }
        span {
          margin-right: 20px;
          max-width: 400px;
          font-size: 14px;
          font-weight: 400;
          color: #9FA8B8;
        }
        i {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 400;
          color: #2EABFF;
          cursor: pointer;
        }
      }
    }
  }

</style>
