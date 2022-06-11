// TO_EFFECT EFFECTING EXPIRED WITHDRAW DELETE
const noticeStatusOptions = [
  {
    name: '未生效',
    value: 'TO_EFFECT'
  },
  {
    name: '生效中',
    value: 'EFFECTING'
  },
  {
    name: '已过期',
    value: 'EXPIRED'
  },
  {
    name: '已撤销',
    value: 'WITHDRAW'
  }
];
// WARNING NOTICE
const noticeTypeOptions = [
  {
    name: '气象播报',
    value: 'WARNING'
  },
  {
    name: '平台公告',
    value: 'NOTICE'
  }
];

export default {
  noticeTypeOptions,
  noticeStatusOptions
};
