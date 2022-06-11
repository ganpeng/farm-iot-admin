import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

export const constantRouterMap = [{
  path: '/',
  alias: '/dashboard',
  component: () => import('@/views/login/Login'),
  name: 'Login'
}, {
  path: '/404',
  component: () => import('@/views/error/404'),
  name: 'ErrorNotFound'
}, {
  path: '/layout',
  component: Layout,
  children: [{
    path: '/dashboard',
    component: () => import('@/views/dashboard/Dashboard'),
    name: 'Dashboard',
    meta: {
      title: '数据概览',
      icon: 'index',
      affix: true,
      noCache: true
    }
  },
    // 角色列表
    {
      path: '/role-manage/role-list',
      component: () => import('@/views/role-manage/RoleList'),
      name: 'RoleList',
      meta: {
        title: '角色列表',
        icon: 'role',
        affix: true,
        noCache: true,
        activeMenu: '/role-manage/role-list'
      }
    },
    // 创建角色
    {
      path: '/role-manage/create-role',
      component: () => import('@/views/role-manage/CreateRole'),
      name: 'CreateRole',
      meta: {
        title: '角色列表>添加角色',
        icon: 'role',
        affix: true,
        noCache: true,
        activeMenu: '/role-manage/role-list'
      },
    },
    // 编辑用户
    {
      path: '/role-manage/edit-role/:id',
      component: () => import('@/views/role-manage/EditRole'),
      name: 'EditRole',
      meta: {
        title: '角色列表>编辑角色',
        icon: 'role',
        affix: true,
        noCache: true,
        activeMenu: '/role-manage/role-list'
      },
    },
    // 版本列表
    {
      path: '/version-manage/version-list',
      component: () => import('@/views/version-manage/VersionList'),
      name: 'VersionList',
      meta: {
        title: '版本列表',
        icon: 'version',
        affix: true,
        noCache: true,
        activeMenu: '/version-manage/version-list'
      }
    },
    // 创建版本
    {
      path: '/version-manage/create-version',
      component: () => import('@/views/version-manage/CreateVersion'),
      name: 'CreateVersion',
      meta: {
        title: '版本列表>添加版本',
        icon: 'user',
        affix: true,
        noCache: true,
        activeMenu: '/version-manage/version-list'
      },
    },
    // 编辑版本
    {
      path: '/version-manage/edit-version/:no',
      component: () => import('@/views/version-manage/EditVersion'),
      name: 'EditVersion',
      meta: {
        title: '版本列表>编辑版本',
        icon: 'version',
        affix: true,
        noCache: true,
        activeMenu: '/version-manage/version-list'
      },
    },
    // 版本详情
    {
      path: '/version-manage/detail-version/:no',
      component: () => import('@/views/version-manage/VersionDetail'),
      name: 'VersionDetail',
      meta: {
        title: '版本列表>版本详情',
        icon: 'version',
        affix: true,
        noCache: true,
        activeMenu: '/version-manage/version-list'
      },
    },
    // wangshuo  add  2021.04.12 start
    // 管理APP版本
    {
      path: '/version-manage/app-version',
      component: () => import('@/views/version-manage/AppVersion'),
      name: 'AppVersion',
      meta: {
        title: '管理APP版本',
        icon: 'version',
        affix: true,
        noCache: true,
        activeMenu: '/version-manage/app-version'
      }
    },
    // 创建APP版本
    {
      path: '/version-manage/create-app-version',
      component: () => import('@/views/version-manage/CreateAppVersion'),
      name: 'CreateAppVersion',
      meta: {
        title: '版本列表>添加版本',
        icon: 'user',
        affix: true,
        noCache: true,
        activeMenu: '/version-manage/app-version'
      },
    },
    // 编辑版本
    {
      path: '/version-manage/edit-app-version/:no',
      component: () => import('@/views/version-manage/EditAppVersion'),
      name: 'EditAppVersion',
      meta: {
        title: '版本列表>编辑版本',
        icon: 'version',
        affix: true,
        noCache: true,
        activeMenu: '/version-manage/app-version'
      },
    },
    // 版本详情
    {
      path: '/version-manage/app-detail-version/:no',
      component: () => import('@/views/version-manage/AppVersionDetail'),
      name: 'AppVersionDetail',
      meta: {
        title: '版本列表>版本详情',
        icon: 'version',
        affix: true,
        noCache: true,
        activeMenu: '/version-manage/app-version'
      },
    },
    // 种植模型
    {
      path: '/plant-manage/plant-model',
      component: () => import('@/views/plant-manage/PlantModel'),
      name: 'PlantModel',
      meta: {
        title: '种植模型',
        icon: 'model',
        affix: true,
        noCache: true,
        activeMenu: '/plant-manage/plant-model'
      }
    },
    // wangshuo  add  2021.04.12 end
    // 用户列表
    {
      path: '/user-manage/user-list',
      component: () => import('@/views/user-manage/UserList'),
      name: 'UserList',
      meta: {
        title: '用户列表',
        icon: 'user',
        affix: true,
        noCache: true,
        activeMenu: '/user-manage/user-list'
      }
    },
    // 创建用户
    {
      path: '/user-manage/create-user',
      component: () => import('@/views/user-manage/CreateUser'),
      name: 'CreateUser',
      meta: {
        title: '用户列表>添加用户',
        icon: 'user',
        affix: true,
        noCache: true,
        activeMenu: '/user-manage/user-list'
      },
    },
  // 编辑用户
  {
    path: '/role-manage/edit-role/:id',
    component: () => import('@/views/role-manage/EditRole'),
    name: 'EditRole',
    meta: {
      title: '角色列表>编辑角色',
      icon: 'role',
      affix: true,
      noCache: true,
      activeMenu: '/role-manage/role-list'
    },
  },
  // 版本列表
  {
    path: '/version-manage/version-list',
    component: () => import('@/views/version-manage/VersionList'),
    name: 'VersionList',
    meta: {
      title: '版本列表',
      icon: 'version',
      affix: true,
      noCache: true,
      activeMenu: '/version-manage/version-list'
    }
  },
  // 创建版本
  {
    path: '/version-manage/create-version',
    component: () => import('@/views/version-manage/CreateVersion'),
    name: 'CreateVersion',
    meta: {
      title: '版本列表>添加版本',
      icon: 'user',
      affix: true,
      noCache: true,
      activeMenu: '/version-manage/version-list'
    },
  },
  // 编辑版本
  {
    path: '/version-manage/edit-version/:no',
    component: () => import('@/views/version-manage/EditVersion'),
    name: 'EditVersion',
    meta: {
      title: '版本列表>编辑版本',
      icon: 'version',
      affix: true,
      noCache: true,
      activeMenu: '/version-manage/version-list'
    },
  },
  // 版本详情
  {
    path: '/version-manage/detail-version/:no',
    component: () => import('@/views/version-manage/VersionDetail'),
    name: 'VersionDetail',
    meta: {
      title: '版本列表>版本详情',
      icon: 'version',
      affix: true,
      noCache: true,
      activeMenu: '/version-manage/version-list'
    },
  },
  // 用户列表
  {
    path: '/user-manage/user-list',
    component: () => import('@/views/user-manage/UserList'),
    name: 'UserList',
    meta: {
      title: '用户列表',
      icon: 'user',
      affix: true,
      noCache: true,
      activeMenu: '/user-manage/user-list'
    }
  },
  // 创建用户
  {
    path: '/user-manage/create-user',
    component: () => import('@/views/user-manage/CreateUser'),
    name: 'CreateUser',
    meta: {
      title: '用户列表>添加用户',
      icon: 'user',
      affix: true,
      noCache: true,
      activeMenu: '/user-manage/user-list'
    },
  },
  // 编辑用户
  {
    path: '/user-manage/edit-user/:id',
    component: () => import('@/views/user-manage/EditUser'),
    name: 'EditUser',
    meta: {
      title: '用户列表>编辑用户',
      icon: 'user',
      affix: true,
      noCache: true,
      activeMenu: '/user-manage/user-list'
    },
  },
  // 用户详情
  {
    path: '/user-manage/detail-user/:id',
    component: () => import('@/views/user-manage/UserDetail'),
    name: 'UserDetail',
    meta: {
      title: '用户列表>用户详情',
      icon: 'user',
      affix: true,
      noCache: true,
      activeMenu: '/user-manage/user-list'
    },
  },
  // 导入用户
  {
    path: '/user-manage/import-user',
    component: () => import('@/views/user-manage/ImportUser'),
    name: 'ImportUser',
    meta: {
      title: '用户列表>导入用户',
      icon: 'user',
      affix: true,
      noCache: true,
      activeMenu: '/user-manage/user-list'
    },
  },
  // 个人中心
  {
    path: '/personal-manage/detail',
    component: () => import('@/views/personal-manage/PersonalCenter'),
    name: 'PersonalCenter',
    meta: {
      title: '个人中心',
      icon: 'personal',
      affix: true,
      noCache: true,
      activeMenu: '/personal-manage/detail'
    },
  },
  // 数据统计
  {
    path: '/statistics-manage/statistics-display',
    component: () => import('@/views/statistics-manage/StatisticsDisplay'),
    name: 'StatisticsDisplay',
    meta: {
      title: '数据统计',
      icon: 'statistics',
      affix: true,
      noCache: true,
      activeMenu: '/statistics-manage/statistics-display'
    }
  },
  // 数据统计-农场统计
  {
    path: '/statistics-manage/statistics-farm',
    component: () => import('@/views/statistics-manage/FarmStatistics'),
    name: 'FarmStatistics',
    meta: {
      title: '数据统计>农场统计',
      icon: 'FarmStatistics',
      affix: true,
      noCache: true,
      activeMenu: '/statistics-manage/statistics-display'
    }
  },
  // 数据统计-设备统计
  {
    path: '/statistics-manage/statistics-device',
    component: () => import('@/views/statistics-manage/DeviceStatistics'),
    name: 'DeviceStatistics',
    meta: {
      title: '数据统计>设备统计',
      icon: 'DeviceStatistics',
      affix: true,
      noCache: true,
      activeMenu: '/statistics-manage/statistics-display'
    }
  },
  // 大数据预警
  {
    path: '/warning-manage/warning-list',
    component: () => import('@/views/warning-manage/WarningList'),
    name: 'WarningList',
    meta: {
      title: '大数据预警',
      icon: 'warning',
      affix: true,
      noCache: true,
      activeMenu: '/warning-manage/warning-list'
    }
  },
  // 模型管理
  {
    path: '/model-manage/model-list',
    component: () => import('@/views/model-manage/ModelList'),
    name: 'ModelList',
    meta: {
      title: '模型列表',
      icon: 'model',
      affix: true,
      noCache: true,
      activeMenu: '/model-manage/model-list'
    }
  },
  // 创建模型
  {
    path: '/model-manage/model-create',
    component: () => import('@/views/model-manage/CreateModel'),
    name: 'CreateModel',
    meta: {
      title: '模型列表>添加模型',
      icon: 'model',
      affix: true,
      noCache: true,
      activeMenu: '/model-manage/model-list'
    },
  },
  // 编辑模型
  {
    path: '/model-manage/model-edit/:id',
    component: () => import('@/views/model-manage/EditModel'),
    name: 'EditModel',
    meta: {
      title: '模型列表>编辑模型',
      icon: 'model',
      affix: true,
      noCache: true,
      activeMenu: '/model-manage/model-list'
    },
  },
  // 模型详情
  {
    path: '/model-manage/model-detail/:id',
    component: () => import('@/views/model-manage/ModelDetail'),
    name: 'ModelDetail',
    meta: {
      title: '模型列表>模型详情',
      icon: 'model',
      affix: true,
      noCache: true,
      activeMenu: '/model-manage/model-list'
    },
  },
  // 设备管理
  {
    path: '/device-manage',
    component: () => import('@/views/device-manage/DeviceList'),
    name: 'DeviceList',
    children: [{
      // 传感器列表
      path: '/device-manage/sensor-list',
      component: () => import('@/views/device-manage/sensor/SensorList'),
      name: 'SensorList',
      meta: {
        title: '传感器列表',
        icon: 'sensor',
        affix: true,
        noCache: true,
        activeMenu: '/device-manage/sensor-list'
      },
    }, {
      // 摄像头列表
      path: '/device-manage/camera-list',
      component: () => import('@/views/device-manage/camera/CameraList'),
      name: 'CameraList',
      meta: {
        title: '摄像头列表',
        icon: 'camera',
        affix: true,
        noCache: true,
        activeMenu: '/device-manage/sensor-list'
      }
    }, {
      // 控制设备
      path: '/device-manage/control-list',
      component: () => import('@/views/device-manage/control/ControlList'),
      name: 'ControlList',
      meta: {
        title: '控制设备列表',
        icon: 'camera',
        affix: true,
        noCache: true,
        activeMenu: '/device-manage/sensor-list'
      }
    }]
  }, {
    // 摄像头创建
    path: '/device-manage/camera-create',
    component: () => import('@/views/device-manage/camera/CreateCamera'),
    name: 'CreateCamera',
    meta: {
      title: '设备列表>添加摄像头',
      icon: 'camera',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    },
  }, {
    // 摄像头编辑
    path: '/device-manage/camera-edit/:id',
    component: () => import('@/views/device-manage/camera/EditCamera'),
    name: 'EditCamera',
    meta: {
      title: '设备列表>编辑摄像头',
      icon: 'camera',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    },
  }, {
    // 摄像头详情
    path: '/device-manage/camera-detail/:id/:status',
    component: () => import('@/views/device-manage/camera/CameraDetail'),
    name: 'CameraDetail',
    meta: {
      title: '设备列表>摄像头详情',
      icon: 'camera',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    },
  }, {
    // 传感器创建
    path: '/device-manage/sensor-create',
    component: () => import('@/views/device-manage/sensor/CreateSensor'),
    name: 'CreateSensor',
    meta: {
      title: '设备列表>添加传感器',
      icon: 'sensor',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    },
  }, {
    // 传感器编辑
    path: '/device-manage/sensor-edit/:id',
    component: () => import('@/views/device-manage/sensor/EditSensor'),
    name: 'EditSensor',
    meta: {
      title: '设备列表>编辑传感器',
      icon: 'sensor',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    },
  }, {
    // 传感器详情
    path: '/device-manage/sensor-detail/:id/:status',
    component: () => import('@/views/device-manage/sensor/SensorDetail'),
    name: 'SensorDetail',
    meta: {
      title: '设备列表>传感器详情',
      icon: 'sensor',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    },
  },
  {
    // 控制器创建
    path: '/device-manage/control-create',
    component: () => import('@/views/device-manage/control/CreateControl'),
    name: 'CreateControl',
    meta: {
      title: '设备列表>添加控制器',
      icon: 'sensor',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    },
  }, {
    // 传感器编辑
    path: '/device-manage/control-edit/:id',
    component: () => import('@/views/device-manage/control/EditControl'),
    name: 'EditControl',
    meta: {
      title: '设备列表>编辑控制器',
      icon: 'sensor',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    },
  }, {
    // 传感器详情
    path: '/device-manage/control-detail/:id/:status',
    component: () => import('@/views/device-manage/control/ControlDetail'),
    name: 'ControlDetail',
    meta: {
      title: '设备列表>控制器详情',
      icon: 'sensor',
      affix: true,
      noCache: true,
      activeMenu: '/device-manage/sensor-list'
    }
  }]
},
{
  path: '/farm',
  component: Layout,
  // redirect: '/farm/list',
  children: [{
    path: 'list',
    name: 'FarmList',
    component: () => import('@/views/farm/FarmList'),
    meta: {
      title: '企业列表'
    }
  },
  {
    path: 'detail/:id(\\d+)',
    name: 'FarmDetail',
    component: () => import('@/views/farm/FarmDetail'),
    meta: {
      title: '企业信息>详情',
      activeMenu: '/farm/list'
    }
  },
  {
    path: 'edit/:id(\\d+)',
    name: 'FarmEdit',
    component: () => import('@/views/farm/FarmEdit'),
    meta: {
      title: '企业信息>编辑',
      activeMenu: '/farm/list'
    }
  },
  {
    path: 'create/',
    name: 'FarmCreate',
    component: () => import('@/views/farm/FarmCreate'),
    meta: {
      title: '企业信息>新增',
      activeMenu: '/farm/list'
    }
  },
  {
    path: 'manage/:id(\\d+)',
    name: 'FarmManage',
    component: () => import('@/views/farm/FarmManage'),
    meta: {
      title: '企业信息',
      activeMenu: '/farm/list'
    }
  },
  {
    path: 'import',
    name: 'FarmImport',
    component: () => import('@/views/farm/FarmImport'),
    meta: {
      title: '企业列表>导入',
      activeMenu: '/farm/list'
    }
  },
  {
    path: 'check',
    name: 'FarmCheckList',
    component: () => import('@/views/farm/FarmCheckList'),
    meta: {
      title: '企业信息审核',
      activeMenu: '/farm/check'
    }
  },
  {
    path: 'checkDetail/:id(\\d+)',
    name: 'FarmCheckDetail',
    component: () => import('@/views/farm/FarmCheckDetail'),
    meta: {
      title: '企业信息>详情',
      activeMenu: '/farm/check'
    }
  },
  {
    path: 'checkEdit/:id(\\d+)',
    name: 'FarmCheckEdit',
    component: () => import('@/views/farm/FarmCheckEdit'),
    meta: {
      title: '审核企业信息>编辑',
      activeMenu: '/farm/check'
    }
  },
  // 农事计划
  {
    path: 'planting_record/:id(\\d+)',
    name: 'PlantingRecord',
    component: () => import('@/views/planting/PlantingRecord'),
    meta: {
      title: '企业信息>种植记录',
      activeMenu: '/farm/list'
    }
  },
  ]
},
{
  // 销售相关路由
  path: '/sale',
  component: Layout,
  redirect: '/sale/commodity/list',
  children: [{
    path: 'commodity/list',
    name: 'CommodityList',
    component: () => import('@/views/sale/CommodityList'),
    meta: {
      title: '商品列表'
    }
  },
  {
    path: 'commodity/detail/:id(\\d+)',
    name: 'CommodityDetail',
    component: () => import('@/views/sale/CommodityDetail'),
    meta: {
      title: '商品信息>详情',
      activeMenu: '/sale/commodity/list'
    }
  },
  {
    path: 'commodity/edit/:id(\\d+)',
    name: 'CommodityEdit',
    component: () => import('@/views/sale/CommodityEdit'),
    meta: {
      title: '商品信息>溯源管理',
      activeMenu: '/sale/commodity/list'
    }
  },
  {
    path: 'tracingcode/list',
    name: 'TracingCodeList',
    component: () => import('@/views/sale/TracingCodeList'),
    meta: {
      title: '溯源码管理'
    }
  },
  {
    path: 'tracingcode/create',
    name: 'TracingCodeCreate',
    component: () => import('@/views/sale/TracingCodeCreate'),
    meta: {
      title: '溯源码管理/生成溯源码',
      activeMenu: '/sale/tracingcode/list'
    }
  },
  {
    path: 'tracingcode/check',
    name: 'TracingCodeCheck',
    component: () => import('@/views/sale/TracingCodeCheckList'),
    meta: {
      title: '溯源信息审核',
      activeMenu: '/sale/tracingcode/check'
    }
  }]
},
// 预警通知
{
  path: '/notice',
  component: Layout,
  redirect: '/notice/list',
  children: [{
    path: 'list',
    name: 'NoticeList',
    component: () => import('@/views/notice/NoticeList'),
    meta: {
      title: '预警通知'
    }
  },
  {
    path: 'detail/:id',
    name: 'NoticeDetail',
    component: () => import('@/views/notice/NoticeDetail'),
    meta: {
      title: '预警通知>详情',
      activeMenu: '/notice/list'
    }
  },
  {
    path: 'edit/:id',
    name: 'NoticeEdit',
    component: () => import('@/views/notice/NoticeEdit'),
    meta: {
      title: '预警通知>编辑',
      activeMenu: '/notice/list'
    }
  },
  {
    path: 'create',
    name: 'NoticeCreate',
    component: () => import('@/views/notice/NoticeCreate'),
    meta: {
      title: '预警通知/新增',
      activeMenu: '/notice/list'
    }
  }]
},
// 下载m3u8格式的视频
{
  path: '/download/video',
  component: () => import('@/views/device-manage/camera/DownLoadVideo'),
  name: 'downloadVideo',
  meta: {
    title: '下载视频回放',
  }
},
];


export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
