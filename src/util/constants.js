
export const DEFAULT_PAGINATION = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

export const DEFAULT_LIST = {
    data: [],
    pagination: DEFAULT_PAGINATION
};

export const FARM_TYPE_OPTIONS = [
  {
    value: 'FARMER_PROFESSIONAL_COOPERATIVES',
    label: '农民专业合作社'
  },
  {
      value: 'STATE_ENTERPRISE',
      label: '国有企业'
  },
  {
      value: 'SELF_EMPLOYED_BUSSINESS',
      label: '个体企业'
  }
];

// 经营项目
export const MANAGE_TYPE_OPTIONS = [
    {
        value: 'RICE',
        label: '水稻种植'
    },
    {
        value: 'GRAINS',
        label: '杂粮种植'
    },
    {
        value: 'FUNGI',
        label: '菌类种植'
    },
    {
        value: 'FRUITS_VEGETABLES',
        label: '果蔬种植'
    },
    {
        value: 'FOWL',
        label: '家禽养殖'
    },
    {
        value: 'AQUATIC_PRODUCT',
        label: '水产养殖'
    },
    {
        value: 'OTHERS',
        label: '其他'
    }
];

export const PROFESSIONAL_TYPE_OPTIONS = [
  {
      value: 'PROVINCE',
      label: '省级专业合作社'
  },
  {
      value: 'CITY',
      label: '市级专业合作社'
  },
  {
      value: 'COUNTY',
      label: '县级专业合作社'
  }
];

export const MACHINERY_TYPE_OPTIONS = [
  {
    value: 'PLOUGHING',
    label: '耕耘和整地机械'
  },
  {
      value: 'PLANTING',
      label: '种植和施肥机械'
  },
  {
      value: 'MANAGE_PROTECTION',
      label: '田间管理和植保机械'
  },
  {
      value: 'HARVEST',
      label: '收获机械'
  },
  {
      value: 'THRESH_WASH_DRY_SAVE',
      label: '脱粒、清洗、烘干、贮存机械'
  },
  {
    value: 'PROCESS',
    label: '农副产品加工机械'
  },
  {
      value: 'TRANSPORT',
      label: '运输机械'
  },
  {
      value: 'IRRIGATION_DRAINAGE',
      label: '排灌机械'
  },
  {
    value: 'LIVESTOCK_FARMING',
    label: '畜牧机械'
  },
  {
    value: 'OTHERS',
    label: '其它机械'
  }
];

export const TRAINING_TYPE_OPTIONS = [
  {
      value: 'AGRI_KNOWLEDGE',
      label: '农业知识'
  },
  {
      value: 'MANAGE_KNOWLEDGE',
      label: '经营知识'
  },
  {
    value: 'AGRI_SKILL',
    label: '农业技能'
  },
  {
    value: 'ELSE',
    label: '其它'
  }
];

export const TRAINING_ORGANIZER_OPTIONS = [
  {
    value: 'ENTERPRISE',
    label: '企业组织'
  },
  {
    value: 'GOVERNMENT',
    label: '政府部门'
  }
];

export const DUTY_OPTIONS = [
  {
    value: 'CORP_PLANTING',
    label: '农作物种植'
  },
  {
    value: 'AQUICULTURE',
    label: '水产养殖'
  },
  {
    value: 'FUNGUS_CULTIVATION',
    label: '菌类培植'
  },
  {
    value: 'TRANSPORTATION',
    label: '运输'
  },
  {
    value: 'PROCESSING',
    label: '加工'
  },
  {
    value: 'ELSE',
    label: '其它'
  }
];

// 农场标签
export const FARM_MARK_OPTIONS = [
  {
    value: '美式农场',
    label: '美式农场'
  },
  {
    value: '人工除草',
    label: '人工除草'
  }
];

// 种植管理
export const STEP_LIST = [
  {
    title: "作物信息",
    active: true
  },
  {
    title: "投入品",
    active: false
  },
  {
    title: "田间管理",
    active: false
  },
  {
    title: "采收管理",
    active: false
  },
  {
    title: "加工管理",
    active: false
  },
  {
    title: "仓储管理",
    active: false
  },
  {
    title: "检测信息",
    active: false
  },
  {
    title: "受灾信息",
    active: false
  },
  {
    title: "农机具使用",
    active: false
  }
];
// 渔业管理
export const FISH_STEP_LIST = [
  {
    title: "水产信息",
    active: true
  },
  {
    title: "投入品",
    active: false
  },
  {
    title: "养殖管理",
    active: false
  },
  {
    title: "采收管理",
    active: false
  },
  {
    title: "加工管理",
    active: false
  },
  {
    title: "仓储管理",
    active: false
  },
  {
    title: "检测信息",
    active: false
  },
  {
    title: "受灾信息",
    active: false
  },
  {
    title: "农机具使用",
    active: false
  }
];

export const P1_TYPE_OPTIONS = [
  {
    id: 1,
    value: '粮食',
    label: '粮食'
  },
  {
    id: 2,
    value: '蔬菜',
    label: '蔬菜'
  },
  {
    id: 3,
    value: '菌类',
    label: '菌类'
  },
  {
    id: 4,
    value: '果类',
    label: '果类'
  },
  {
    id: 5,
    value: '油类',
    label: '油类'
  },
  {
    id: 6,
    value: '药类',
    label: '药类'
  },
  {
    id: 7,
    value: '其它',
    label: '其它'
  }
];

export const P1_NAME_OPTIONS = [
  {
    id: 1,
    options: [
      {
        value: '水稻',
        label: '水稻'
      },
      {
        value: '玉米',
        label: '玉米'
      },
      {
        value: '小麦',
        label: '小麦'
      },
      {
        value: '大豆',
        label: '大豆'
      },
      {
        value: '黄米',
        label: '黄米'
      },
      {
        value: '高粱',
        label: '高粱'
      }
    ]
  }
];

export const P1_CLASS_OPTIONS = [
  {
    value: '吉粳83号(丰优307)',
    label: '吉粳83号(丰优307)'
  },
  {
    value: '吉粳88（超级稻一号）',
    label: '吉粳88（超级稻一号）'
  },
  {
    value: '丰优301',
    label: '丰优301'
  },
  {
    value: '吉开318',
    label: '吉开318'
  }
];

// 投入品
export const P2_TYPE_OPTIONS = [
  {
    value: '有机肥',
    label: '有机肥',
    options: [
      {
        value: '农业废弃物',
        label: '农业废弃物'
      },
      {
        value: '畜禽粪便',
        label: '畜禽粪便'
      },
      {
        value: '工业废弃物',
        label: '工业废弃物'
      },
      {
        value: '生活垃圾',
        label: '生活垃圾'
      },
      {
        value: '城市污泥',
        label: '城市污泥'
      },
      {
        value: '现代理化',
        label: '现代理化'
      },
      {
        value: '其它',
        label: '其它'
      }
    ]
  },
  {
    value: '无机肥',
    label: '无机肥',
    options: [
      {
        value: '氮肥',
        label: '氮肥'
      },
      {
        value: '磷肥',
        label: '磷肥'
      },
      {
        value: '钾肥',
        label: '钾肥'
      },
      {
        value: '复合肥',
        label: '复合肥'
      },
      {
        value: '微量元素肥',
        label: '微量元素肥'
      },
      {
        value: '其它',
        label: '其它'
      }
    ]
  },
  {
    value: '农药',
    label: '农药',
    options: [
      {
        value: '矿物源农药(无机农药)',
        label: '矿物源农药(无机农药)'
      },
      {
        value: '化学农药(有机合成农药)',
        label: '化学农药(有机合成农药)'
      },
      {
        value: '生物源农药',
        label: '生物源农药'
      },
      {
        value: '植物源农药',
        label: '植物源农药'
      },
      {
        value: '生物化学农药',
        label: '生物化学农药'
      },
      {
        value: '转基因生物',
        label: '转基因生物'
      },
      {
        value: '天敌生物',
        label: '天敌生物'
      },
      {
        value: '其它',
        label: '其它'
      }
    ]
  },
  {
    value: '其它',
    label: '其它'
  }
];

export const P3_TYPE_OPTIONS = [
  {
    value: '整地',
    label: '整地'
  },
  {
    value: '补种',
    label: '补种'
  },
  {
    value: '间苗',
    label: '间苗'
  },
  {
    value: '松土',
    label: '松土'
  },
  {
    value: '追肥',
    label: '追肥'
  },
  {
    value: '除孽',
    label: '除孽'
  },
  {
    value: '除草',
    label: '除草'
  },
  {
    value: '查田',
    label: '查田'
  },
  {
    value: '防治病虫害',
    label: '防治病虫害'
  },
  {
    value: '灌溉',
    label: '灌溉'
  },
  {
    value: '其它',
    label: '其它'
  }
];

export const P4_TYPE_OPTIONS = [
  {
    value: '机械化',
    label: '机械化'
  },
  {
    value: '半机械化',
    label: '半机械化'
  },
  {
    value: '人工',
    label: '人工'
  }
];

export const P5_PARTY_OPTIONS = [
  {
    value: '自营',
    label: '自营'
  },
  {
    value: '其它加工厂商',
    label: '其它加工厂商'
  }
];

export const P6_TYPE_OPTIONS = [
  {
    value: '平方型仓储',
    label: '平方型仓储'
  },
  {
    value: '二层楼房型仓储',
    label: '二层楼房型仓储'
  },
  {
    value: '多层楼房型仓储',
    label: '多层楼房型仓储'
  },
  {
    value: '地下仓库',
    label: '地下仓库'
  },
  {
    value: '立体仓库',
    label: '立体仓库'
  },
  {
    value: '简易仓库',
    label: '简易仓库'
  }
];

export const P7_USER_OPTIONS = [
  {
    value: '王进',
    label: '王进'
  },
  {
    value: '刘能',
    label: '刘能'
  },
  {
    value: '李三桂',
    label: '李三桂'
  },
  {
    value: '李雪',
    label: '李雪'
  }
];

export const P7_PROJECT_OPTIONS = [
  {
    value: '成米34项检测',
    label: '成米34项检测'
  },
  {
    value: '其它',
    label: '其它'
  }
];

export const P8_TYPE_OPTIONS = [
  {
    value: '霜灾',
    label: '霜灾'
  },
  {
    value: '水灾',
    label: '水灾'
  },
  {
    value: '旱灾',
    label: '旱灾'
  },
  {
    value: '冰冻灾害',
    label: '冰冻灾害'
  },
  {
    value: '其它',
    label: '其它'
  }
];

export const P9_SOURCE_OPTIONS = [
  {
    value: '自有',
    label: '自有'
  },
  {
    value: '租借他人',
    label: '租借他人'
  }
];

// 经营管理
export const PROJECT_CLASS_OPTIONS = [
  {
    value: '乡级',
    label: '乡级'
  },
  {
    value: '县级',
    label: '县级'
  },
  {
    value: '市级',
    label: '市级'
  },
  {
    value: '省级',
    label: '省级'
  },
  {
    value: '国家级',
    label: '国家级'
  }
];

export const PROJECT_STAGE_OPTIONS = [
  {
    value: '立项阶段',
    label: '立项阶段'
  },
  {
    value: '执行阶段',
    label: '执行阶段'
  },
  {
    value: '验收阶段',
    label: '验收阶段'
  }
];

export const ACCOUNT_ARRIVAL_TYPE_OPTIONS = [
  {
    value: '银行转账',
    label: '银行转账'
  },
  {
    value: '其它',
    label: '其它'
  }
];

export const USE_DETAIL_TYPE_OPTIONS = [
  {
    name: '设备费',
    label: '设备费'
  },
  {
    name: '材料费',
    label: '材料费'
  },
  {
    name: '测试化验加工费',
    label: '测试化验加工费'
  },
  {
    name: '燃料动力费',
    label: '燃料动力费'
  },
  {
    name: '差旅费',
    label: '差旅费'
  },
  {
    name: '会议费',
    label: '会议费'
  },
  {
    name: '国际合作与交流费',
    label: '国际合作与交流费'
  },
  {
    name: '出版/文献/信息传播/知识产权事务费',
    label: '出版/文献/信息传播/知识产权事务费'
  },
  {
    name: '劳务费',
    label: '劳务费'
  },
  {
    name: '专家咨询费',
    label: '专家咨询费'
  },
  {
    name: '管理费',
    label: '管理费'
  }
];

export const SUBSIDY_TYPE_OPTIONS = [
  {
    value: '耕地地力保护补贴',
    label: '耕地地力保护补贴'
  },
  {
    value: '农机购置补贴',
    label: '农机购置补贴'
  },
  {
    value: '玉米、大豆和稻谷生产者补贴',
    label: '玉米、大豆和稻谷生产者补贴'
  },
  {
    value: '农机深松整地',
    label: '农机深松整地'
  },
  {
    value: '农作物绿色高质高效行动',
    label: '农作物绿色高质高效行动'
  },
  {
    value: '农作物秸秆综合利用试点',
    label: '农作物秸秆综合利用试点'
  },
  {
    value: '其他',
    label: '其他'
  }
];

export const SUBSIDY_STATUS_OPTIONS = [
  {
    value: '申请中',
    label: '申请中'
  },
  {
    value: '已通过',
    label: '已通过'
  },
  {
    value: '款项到位',
    label: '款项到位'
  },
  {
    value: '未通过',
    label: '未通过'
  }
];

export const SERVICE_CLIENTS_OPTIONS = [
  {
    value: '农户',
    label: '农户'
  },
  {
    value: '企业',
    label: '企业'
  }
];

export const SERVICE_TYPE_OPTIONS = [
  {
    value: '农资直供',
    label: '农资直供'
  },
  {
    value: '土地托管',
    label: '土地托管'
  },
  {
    value: '农技指导',
    label: '农技指导'
  },
  {
    value: '农业金融',
    label: '农业金融'
  },
  {
    value: '农机配套',
    label: '农机配套'
  },
  {
    value: '粮食收购',
    label: '粮食收购'
  }
];

const REG_EXP = {
  // 有两位小数的正实数
  positiveInteger2: /^[1-9][0-9]*(.[0-9]{1,2})?$/,
  // 6位小数以内
  positiveInteger6: /^[0-9]*(.[0-9]{1,6})?$/,
  // 非负整数
  nonnegativeInteger: /^\d+$/,
  // 非负浮点数
  nonnegativeFloat: /^\d+(\.\d+)?$/,
  // 身份证号
  idCode: /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/,
  // 手机号
  // phoneNum: /^(1[3-9][0-9]{9})$/,
  phoneNum: /^[0-9\\-]+$/,
  // 正数
  positiveNumber: /^([0]|[1-9][0-9]*)$/,
  // 不包括0的正数
  positiveNumber2: /^([1-9][0-9]*)$/
};

const COMMODITY_BORD_LIST = [
  {
    title: '总数',
    count: 0
  },
  {
    title: '稻米',
    count: 0
  },
  {
    title: '杂粮',
    count: 0
  },
  {
    title: '果蔬',
    count: 0
  },
  {
    title: '菌类',
    count: 0
  },
  {
    title: '其它',
    count: 0
  }
];

const FARM_BORD_LIST = [
  {
    title: '总数',
    count: 0
  },
  {
    title: '农民专业合作社',
    count: 0
  },
  {
    title: '国有企业',
    count: 0
  },
  {
    title: '个体企业',
    count: 0
  },
  {
    title: '其它',
    count: 0
  }
];

const TRACING_CODE_BORD_LIST = [
  {
    title: '总数',
    count: 0
  },
  {
    title: '已激活',
    count: 0
  },
  {
    title: '未激活',
    count: 0
  }
];

const SENSOR_VENDOR_OPTIONS = [
  {
    value: '飞利信',
    label: '飞利信'
  },
  {
    value: '罗博飞',
    label: '罗博飞'
  },
  {
    value: '欧柯奇',
    label: '欧柯奇'
  }
];

const SENSOR_TYPE_OPTIONS = [
  {
    value: '耕地种植传感器',
    label: '耕地种植传感器'
  },
  {
    value: '水产养殖传感器',
    label: '水产养殖传感器'
  },
  {
    value: '气象传感器',
    label: '气象传感器'
  },
  {
    value: '虫情测报灯',
    label: '虫情测报灯'
  }
];

const CAMERA_TYPE_OPTIONS = [
  {
    value: 'NVR',
    label: '平台NVR'
  },
  {
    value: 'CAMERA',
    label: '摄像头'
  }
];
export const FARM_CHECK_LIST = [
  {
      title: '总数',
      count: 0
  },
  {
      title: '待审核',
      count: 0
  },
  {
      title: '已拒绝',
      count: 0
  }
];
// 农场审核-查询条件-审核状态option
export const APPROVE_STATUS_LIST = [
  {value: 'APPROVING', name: '待审核'},
  {value: 'REJECT', name: '已拒绝'},
  {value: 'WITHDRAW', name: '已撤回'},
];
export const APPROVE_STATUS_LIST_ADMIN = [
  {value: 'APPROVING', name: '待审核'},
  {value: 'REJECT', name: '已拒绝'},
];
// 农场审核-查询条件-模块option
export const MODEL_NAME_LIST = [
  {value: "FARM_INFO", name: '农场信息'},
  {value: "HOMESTEAD_MANAGE", name: '宅基地管理'},
  {value: "LAND_MANAGE", name: '耕地管理'},
  {value: "MACHINERY_MANAGE", name: '农机具管理'},
  {value: "MANAGE_MEMBER_MANAGE", name: '经营人员管理'},
  {value: "PLANT_MEMBER_MANAGE", name: '种植人员管理'},
  {value: "PLANT_MANAGE", name: '种植管理'},
  {value: "GOVERN_PROJECT", name: '政府项目'},
  {value: "SUBSIDY", name: '补贴'},
  {value: "SOCIAL_SERVICE", name: '社会化服务'},
];

// 商品列表上下架  wangshuo
const MARKET_ENABLE = [
  {value: 0, name: '下架'},
  {value: 1, name: '上架'},
];

const CONTROLLER_VENDOR_OPTIONS = [
  {
    value: '欧柯奇',
    label: '欧柯奇'
  }
];

export default {
  // 正则表达式
  REG_EXP,
  // 分页
  DEFAULT_PAGINATION,
  DEFAULT_LIST,
  // 农场基本信息
  FARM_TYPE_OPTIONS,
  FARM_MARK_OPTIONS,
  MANAGE_TYPE_OPTIONS,
  PROFESSIONAL_TYPE_OPTIONS,
  // 农机具
  MACHINERY_TYPE_OPTIONS,
  // 成员管理
  TRAINING_TYPE_OPTIONS,
  TRAINING_ORGANIZER_OPTIONS,
  DUTY_OPTIONS,
  // 种植管理
  STEP_LIST,
  P1_TYPE_OPTIONS,
  P1_NAME_OPTIONS,
  P1_CLASS_OPTIONS,
  // 投入品
  P2_TYPE_OPTIONS,
  // 田间管理
  P3_TYPE_OPTIONS,
  // 采收管理
  P4_TYPE_OPTIONS,
  // 加工厂商
  P5_PARTY_OPTIONS,
  // 仓储管理
  P6_TYPE_OPTIONS,
  // 检测信息
  P7_USER_OPTIONS,
  P7_PROJECT_OPTIONS,
  // 灾害信息
  P8_TYPE_OPTIONS,
  // 农机具使用
  P9_SOURCE_OPTIONS,
  // 经营管理
  PROJECT_CLASS_OPTIONS,
  PROJECT_STAGE_OPTIONS,
  ACCOUNT_ARRIVAL_TYPE_OPTIONS,
  USE_DETAIL_TYPE_OPTIONS,
  SUBSIDY_TYPE_OPTIONS,
  SUBSIDY_STATUS_OPTIONS,
  SERVICE_CLIENTS_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  // 销售管理
  COMMODITY_BORD_LIST,
  FARM_BORD_LIST,
  TRACING_CODE_BORD_LIST,
  // 渔业种植管理
  FISH_STEP_LIST,
  // 传感器
  SENSOR_VENDOR_OPTIONS,
  // 农场信息审核
  FARM_CHECK_LIST,
  // 农场模块
  MODEL_NAME_LIST,
  // 审核状态
  APPROVE_STATUS_LIST,
  // 审核状态-管理员
  APPROVE_STATUS_LIST_ADMIN,
  // 摄像头
  CAMERA_TYPE_OPTIONS,
  // 传感器类型
  SENSOR_TYPE_OPTIONS,
  // 商品列表上下架
  MARKET_ENABLE,
  // 控制设备
  CONTROLLER_VENDOR_OPTIONS
};
