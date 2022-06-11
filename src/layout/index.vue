<template>
  <div class="app-container" ref="mainContainer">
    <div class="header clearfix">
      <div class="header-left">
        <div class="breadcrumb">{{breadcrumb}}{{manageTitle}}</div>
        <div v-if="showEnterManageBtn" @click="gotoEnterManageBtn" class="enter-manage-btn">
          进入管理后台
          <svg-icon class-name="arrow" icon-class="home_icon8"/>
        </div>
      </div>
      <div v-if="farmName" class="farm-name">
      </div>
      <div class="user-info">
        <div class="avatar-block" @click="toPersonalCenter">
          <img :src="avatarUrl" v-if="avatarUrl"/>
          <img src="../assets/img/avatar_default.png" v-else/>
          <label>{{userName}}</label>
        </div>
        <div class="logout" @click="logout">
          <svg-icon icon-class="logout"/>
          <svg-icon icon-class="logout_active"/>
          <span>退出</span>
        </div>
      </div>
    </div>
    <div class="aside">
      <div @click="gotoHome" class="logo">
        <svg-icon icon-class="logo"/>
        <div class="name">
          <p>吉视农业物联网</p>
          <p>大数据平台</p>
        </div>
      </div>
      <div @click="gotoBigScreen" class="in-big-screen">
        <svg-icon class="default_svg" icon-class="aside10"/>
        <span>数据大屏</span>
      </div>
      <div class="aside-list-wrapper">
        <el-menu
          router
          :default-active="activeMenu"
          class="aside-list">
          <el-menu-item index="/dashboard">
            <svg-icon class="default_svg" icon-class="aside1"/>
            <svg-icon class="active_svg" icon-class="aside1_active"/>
            <span class="title" slot="title">数据概览</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <svg-icon class="default_svg" icon-class="aside2"/>
              <svg-icon class="active_svg" icon-class="aside2_active"/>
              <span class="title">企业管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/farm/list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">企业列表</span>
              </el-menu-item>
              <!--
              <el-menu-item>
                <i class="point"></i>
                <span class="sub-title">可视农场</span>
              </el-menu-item>
              -->

              <el-menu-item index="/farm/check">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">企业信息审核</span>
              </el-menu-item>

            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <svg-icon class="default_svg" icon-class="aside3"/>
              <svg-icon class="active_svg" icon-class="aside3_active"/>
              <span class="title">物环设备</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/device-manage/sensor-list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">设备列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <svg-icon class="default_svg" icon-class="aside4"/>
              <svg-icon class="active_svg" icon-class="aside4_active"/>
              <span class="title">销售管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/sale/commodity/list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">商品列表</span>
              </el-menu-item>
              <el-menu-item index="/sale/tracingcode/list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">溯源码管理</span>
              </el-menu-item>
              <el-menu-item index="/sale/tracingcode/check">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">溯源信息审核</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <svg-icon class="default_svg" icon-class="aside5"/>
              <svg-icon class="active_svg" icon-class="aside5_active"/>
              <span class="title">5G网络</span>
            </template>
            <el-menu-item-group>
              <el-menu-item>
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">基站管理 (待开发)</span>
              </el-menu-item>
              <el-menu-item>
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">网络管理 (待开发)</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <svg-icon class="default_svg" icon-class="aside6"/>
              <svg-icon class="active_svg" icon-class="aside6_active"/>
              <span class="title">仓储物流</span>
            </template>
            <el-menu-item-group>
              <el-menu-item>
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">仓储管理 (待开发)</span>
              </el-menu-item>
              <el-menu-item>
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">车辆管理 (待开发)</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <svg-icon class="default_svg" icon-class="aside7"/>
              <svg-icon class="active_svg" icon-class="aside7_active"/>
              <span class="title">数据洞察</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/statistics-manage/statistics-display">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">数据统计</span>
              </el-menu-item>
              <el-menu-item index="/warning-manage/warning-list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">数据预警</span>
              </el-menu-item>
              <el-menu-item index="/model-manage/model-list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">模型列表</span>
              </el-menu-item>
              <el-menu-item index="/notice/list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">预警通知</span>
              </el-menu-item>
              <el-menu-item index="/plant-manage/plant-model"
                            v-if="this.$wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || this.$wsCache.localStorage.get('login').roleType === 'FARM_OWNER'">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">种植模型</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="8">
            <template slot="title">
              <svg-icon class="default_svg" icon-class="aside_user"/>
              <svg-icon class="active_svg" icon-class="aside_user_active"/>
              <span class="title">用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/user-manage/user-list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">用户列表</span>
              </el-menu-item>
              <el-menu-item index="/role-manage/role-list"
                            v-if="$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN'">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="/personal-manage/detail">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">个人中心</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="9" v-if="$authority.isHasAuthority('admin:version:page', true)">
            <template slot="title">
              <svg-icon class="default_svg" icon-class="aside_version"/>
              <svg-icon class="active_svg" icon-class="aside_version_active"/>
              <span class="title">版本管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/version-manage/version-list">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">电商APP版本</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/version-manage/app-version">
                <i class="point-wrapper">
                  <i class="point"></i>
                </i>
                <span class="sub-title">管理APP版本</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div :style="contentStyleStr()" id="global-content" class="content">
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex';
  export default {
    data() {
      return {
        minHeight: 400,
        top: 60,
        left: 200,
        avatarUrl: '',
        userName: '',
        farmName: ''
      };
    },
    computed: {
      activeMenu() {
        const route = this.$route;
        const {meta, path} = route;
        if (meta.activeMenu) {
          return meta.activeMenu;
        }
        return path
      },
      // farmName() {
      //   const {name, query} = this.$route;
      //   return name === 'FarmManage' && query.name ? query.name : '';
      // },
      breadcrumb() {
        const {meta} = this.$route;
        return meta.title;
      },
      showEnterManageBtn() {
        let {id} = this.$route.query;
        return id === 1 || id === 2 || id === 3;
      },
      manageTitle() {
        let {mindex} = this.$route.query;
        switch (parseInt(mindex)) {
          case 0:
            return '>成员管理';
          case 1:
            return '>土地管理';
          case 2:
            return '>农机具管理';
          case 3:
            return '>经营管理';
          case 4:
            return '>种植管理';
          case 5:
            return '>物联网数据';
          default:
            return '';
        }
      },
      subTitle() {
        let {id} = this.$route.query;
        switch (parseInt(id)) {
          case 1:
            return '>吉视农业电商平台数据统计';
          case 2:
            return '>淘宝旗舰店数据统计';
          case 3:
            return '>欧亚商都数据统计';
          default:
            return '';
        }
      }
    },
    async created() {
      try {
        this.userName = this.$wsCache.localStorage.get('login').name;
        this.farmName = this.$wsCache.localStorage.get('login').farmName;
        this.avatarUrl = this.$wsCache.localStorage.get('login').avatarUrl;
        this.setMinHeight();
        window.addEventListener('resize', this.setMinHeight, false);
        await this.getAllDictList();
      } catch (err) {
        console.log(err);
      }
    },
    methods: {
      ...mapActions({
        getAllDictList: 'dict/getAllDictList'
      }),
      setUserAvatar(url) {
        this.avatarUrl = url;
      },
      contentStyleStr() {
        return `top: ${this.top}px;left: ${this.left}px;`;
      },
      setMinHeight() {
        let minHeight = window.innerHeight - 60;
        this.minHeight = minHeight;
      },
      logout() {
        this.$service.logout(this.$wsCache.localStorage.get('login').id).then(res => {
          if (res && res.code === 0) {
            this.$message.success('登出成功');
            this.$wsCache.localStorage.set('login', '');
            this.$router.push({name: 'Login'});
          }
        });
      },
      gotoHome() {
        this.$router.push({name: 'Dashboard'});
      },
      toPersonalCenter() {
        this.$router.push({name: 'PersonalCenter'});
      },
      gotoBigScreen() {
        if (!this.$authority.isBigScreenAuth()) {
          return;
        }
        let host = window.location.host;
        let href = '';
        if (host === 'n.tianchimedia.com') {
          href = 'https://monitor-n.tianchimedia.com';
        } else {
          href = 'https://demo-monitor-n.tianchimedia.com';
        }
        window.open(href, '_blank');
      },
      gotoEnterManageBtn() {
        let href = '';
        let {id} = this.$route.query;
        switch (id) {
          case 1:
            href = 'https://ds.tianchimedia.com/admin';
            break;
          case 2:
            href = 'https://login.taobao.com/member/login.jhtml?redirectURL=http%3A%2F%2Fopenshop.taobao.com%2Findex.htm';
            break;
          case 3:
            href = 'http://www.oysd.cn/Default.aspx';
            break;
          default:
            return '';
        }
        window.open(href, '_blank');
      }
    }
  };
</script>
<style lang="scss" scoped>
  .app-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      top: 0;
      left: 200px;
      right: 0;
      height: $headerHeight;
      background: $headerBg;
      color: $navText;
      .header-left {
        display: flex;
        align-items: center;
      }
      .farm-name {
        font-size: 20px;
        color: #fff;
      }
      .breadcrumb {
        margin-left: 20px;
        height: 28px;
        line-height: 28px;
        font-size: 16px;
        font-weight: 500;
        color: #9FA8B8;
        border-left: 4px solid #0F70F3;
        padding-left: 15px;
      }
      .enter-manage-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #0062C4;
        width: 162px;
        height: 32px;
        border-radius: 20px;
        color: #fff;
        font-size: 16px;
        margin-left: 120px;
        cursor: pointer;
        .svg-icon {
          width: 11px;
          height: 12px;
          margin-left: 15px;
        }
      }
      .user-info {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .avatar-block {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        img {
          margin-right: 10px;
          width: 40px;
          height: 40px;
          border-radius: 20px;
        }
        label {
          margin-right: 30px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(46, 171, 255, 1);
        }
        div {
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            span {
              color: rgba(240, 240, 240, 1);
            }
            .svg-icon-logout {
              display: none;
            }
            .svg-icon-logout_active {
              display: block;
            }
          }
          .svg-icon {
            width: 14px;
            height: 15px;
          }
          .svg-icon-logout {
            display: block;
          }
          .svg-icon-logout_active {
            display: none;
          }
          span {
            cursor: pointer;
            margin-left: 3px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(159, 168, 184, 1);
          }
        }
      }
    }
    .aside {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0px;
      bottom: 0px;
      width: 200px;
      background: #232F46;
      .logo {
        display: flex;
        align-items: flex-end;
        width: 200px;
        height: $headerHeight;
        text-align: left;
        padding: 0 16px;
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, #000000 100%);
        cursor: pointer;
        .svg-icon {
          width: 32px;
          height: 39px;
          margin-right: 8px;
        }
        p {
          font-size: 16px;
          line-height: 20px;
          color: rgba(153, 216, 255, 1);
        }
      }

      .in-big-screen {
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #9FA8B8;
        text-align: left;
        border-left: 2px solid transparent;
        background: transparent;
        padding: 0 10px 0 20px;
        margin-top: 36px;
        cursor: pointer;
        &:hover {
          background: #0A1730 !important;
        }
        .svg-icon {
          margin-right: 20px;
          width: 22px;
          height: 22px;
        }
      }
    }
    .content {
      position: absolute;
      top: $headerHeight;
      left: 200px;
      right: 0px;
      bottom: 0px;
      overflow: scroll;
      background: $contentBg;
      .content-wrapper {
        width: 100%;
        height: 100%;
        min-width: 1240px;
      }
    }
  }

  .aside-list-wrapper {
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .aside-list {
    font-weight: lighter;
    > .el-menu-item {
      // margin: 10px 0;
    }
    > .el-submenu {
      // margin: 10px 0;
    }
    .el-menu-item {
      display: flex;
      align-items: center;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #9FA8B8;
      text-align: left;
      border-left: 2px solid transparent;
      background: transparent;
      padding: 0 10px;
      .svg-icon {
        margin-right: 20px;
        width: 22px;
        height: 22px;

        &.default_svg {
          display: block;
        }

        &.active_svg {
          display: none;
        }
      }

      &:hover {
        background: #0A1730 !important;
      }

      &.is-active {
        border-left-color: $mainColor;

        .title {
          color: #fff;
        }

        .svg-icon {
          fill: $headerNavActiveText;

          &.default_svg {
            display: none;
          }

          &.active_svg {
            display: block;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .aside {
    .aside-list {
      .el-menu {
        background-color: transparent;
      }
      .el-submenu {
        &.is-opened {
          .el-submenu__title {
            background: #121C2E;
          }

          .el-menu-item {
            background: #1A263B;
          }
        }

        .el-submenu__title {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          span.title {
            width: 90px;
            font-size: 16px;
            color: #9FA8B8;
          }

          .el-submenu__icon-arrow {
            position: static !important;
            margin-top: 0;
            display: block;
          }

          &:hover {
            background: #0A1730 !important;
          }

          .svg-icon {
            margin-right: 20px;
            width: 22px;
            height: 22px;

            &.default_svg {
              display: block;
            }

            &.active_svg {
              display: none;
            }
          }
        }

        .el-menu-item-group {
          .el-menu-item-group__title {
            padding: 0;
          }

          .el-menu-item {
            padding-left: 0 !important;
            padding: 0 20px !important;
            .point-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 22px;
              height: 22px;
              margin-right: 20px;
              .point {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 1px solid #667799;
              }
            }
            .sub-title {
              // margin-left: 20px;
              font-size: 14px;
            }

            padding: 0;
          }
        }

        &.is-active {
          .el-menu-item {
            &.is-active {
              .sub-title {
                color: #fff;
              }

              .point {
                border-color: #fff;
                background-color: #fff;
              }
            }
          }

          .el-submenu__title {
            span {
              color: #fff;
            }

            .default_svg {
              display: none;
            }

            .active_svg {
              display: block;
            }
          }
        }
      }
    }

    .el-menu {
      border-right: none;
      background: transparent;
    }
  }
</style>
