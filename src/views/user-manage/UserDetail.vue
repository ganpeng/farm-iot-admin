<!-- 用户详情 -->
<template>
  <div id="user-detail-container">
    <div id="detail-block">
      <div class="header">用户详情</div>
      <div class="content-block">
        <div class="content-item">
          <label>姓名</label>
          <span>{{userInfo.name}}</span>
        </div>
        <div class="content-item">
          <label>角色</label>
          <span>{{userInfo.roleName}}</span>
        </div>
        <div class="content-item">
          <label>性别</label>
          <span v-if="userInfo.gender === 0  || userInfo.gender === 1">{{userInfo.gender === 0 ? '女':'男'}}</span>
          <span v-else>未设置</span>
        </div>
        <div class="content-item">
          <label>企业名称</label>
          <span>{{userInfo.farmName || '无'}}</span>
        </div>
        <div class="content-item">
          <label>手机号</label>
          <span>{{userInfo.mobile}}</span>
        </div>
        <div class="content-item">
          <label>使用状态</label>
          <span>{{userInfo.status === 'NORMAL'?'正常':'禁用'}}</span>
        </div>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two edit-bottom-btn"
                 type="primary"
                 @click="editUser">编辑
      </el-button>
      <el-button class="btn-style-three" @click="toUserList" plain>返回列表</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'user-detail',
    data() {
      return {
        userInfo: {}
      }
    },
    mounted() {
      this.getUserDetail();
    },
    methods: {
      getUserDetail() {
        this.$service.getAdminDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            this.userInfo = response.data;
          }
        })
      },
      editUser() {
        if (!this.$authority.isHasAuthority('admin:admin:put')) {
          return;
        }
        this.$router.push({name: 'EditUser', params: {id: this.$route.params.id}});
      },
      toUserList() {
        if (!this.$authority.isHasAuthority('admin:admin:page')) {
          return;
        }
        this.$router.push({name: 'UserList'});
      }
    }
  }
</script>

<style scoped lang="scss">

  #user-detail-container {
    padding: 0 20px;
  }

  #detail-block {
    margin-top: 20px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;
    .header {
      padding-left: 20px;
      display: flex;
      align-items: center;
      height: 62px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(240, 240, 240, 1);
      border-bottom: 1px solid rgba(62, 73, 94, 1);
    }
    .content-block {
      display: flex;
      flex-wrap: wrap;
      padding: 30px 0;
      .content-item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        width: 50%;
        label {
          align-self: flex-start;
          margin-right: 20px;
          text-align: right;
          width: 160px;
          color: rgba(159, 168, 184, 1);
        }
        span {
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
          width: 240px;
        }
      }
    }
  }

</style>
