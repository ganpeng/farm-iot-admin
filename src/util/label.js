const colors = [
  '#297CEB',
  '#7C82FB',
  '#71CACF',
  '#23A6F5',
  '#98BD72',
  '#E2CA7F',
  '#2FD2DB',
  '#E9C366',
  '#D9647E',
  '#DF7C57',
  '#884CDE',
  '#8B0000', // #4796FF
  '#C08EF2',
  '#69D073',
  '#2BD52B',
  '#E8A437',
  '#615CE2'
];

const landLabelList = [
  {
    name: '总面积',
    prop: 'totalArea',
    active: true,
    color: colors[0]
  },
  {
    name: '粮食农田',
    prop: 'farmLandArea',
    active: true,
    color: colors[1]
  },
  {
    name: '果树林地',
    prop: 'fruitLandArea',
    active: true,
    color: colors[2]
  },
  {
    name: '育苗大棚',
    prop: 'plantGreenhouseArea',
    active: true,
    color: colors[3]
  },
  {
    name: '蔬菜大棚',
    prop: 'vegetableGreenhouseArea',
    active: true,
    color: colors[4]
  },
  {
    name: '仓储建筑',
    prop: 'warehouseArea',
    active: true,
    color: colors[5]
  },
  {
    name: '生态观光',
    prop: 'ecologicalLandArea',
    active: true,
    color: colors[6]
  },
  {
    name: '河流湖泊',
    prop: 'riverArea',
    active: true,
    color: colors[7]
  },
  {
    name: '水库坑塘',
    prop: 'reservoirArea',
    active: true,
    color: colors[8]
  },
  {
    name: '沼泽滩涂',
    prop: 'moorArea',
    active: true,
    color: colors[9]
  },
  {
    name: '人工鱼塘',
    prop: 'fishpondArea',
    active: true,
    color: colors[10]
  },
  {
    name: '宅基地',
    prop: 'homesteadArea',
    active: true,
    color: colors[11]
  }
];

const memberLabelList = [
  {
    name: '总数(人)',
    prop: 'totalNumber',
    active: true,
    stack: 'a',
    color: colors[0]
  },
  {
    name: '经营人员(人)',
    prop: 'manageMemberNumber',
    active: true,
    stack: 'a',
    color: colors[1]
  },
  {
    name: '种植人员(人)',
    prop: 'plantMemberNumber',
    active: true,
    stack: 'a',
    color: colors[2]
  },
  {
    name: '贫困户成员(人)',
    prop: 'poorMemberNumber',
    active: true,
    stack: 'a',
    color: colors[3]
  },
  {
    name: '有证书人员(人)',
    prop: 'certificatedMemberNumber',
    active: true,
    stack: 'a',
    color: colors[4]
  },
  {
    name: '接受培训(天)',
    prop: 'trainingDays',
    active: true,
    stack: 'b',
    color: colors[5]
  }
];

// 农机具类型
const machineLabelList = [
  {
    name: '总量(台)',
    prop: 'totalNumber',
    stack: 'b',
    active: true,
    color: colors[0]
  },
  {
    name: '总动力(万千瓦)',
    prop: 'totalMilKilowatts',
    stack: 'k',
    active: true,
    color: colors[1]
  },
  {
    name: '种植机械(台)',
    prop: 'plantingMachineryNumber',
    stack: 'a',
    active: true,
    color: colors[2]
  },
  {
    name: '加工机械(台)',
    prop: 'processMachineryNumber',
    stack: 'a',
    active: true,
    color: colors[3]
  },
  {
    name: '运输机械(台)',
    prop: 'transportMachineryNumber',
    stack: 'a',
    active: true,
    color: colors[4]
  },
  {
    name: '水产养殖机械(台)',
    prop: 'aquicultureMachineryNumber',
    stack: 'a',
    active: true,
    color: colors[14]
  },
  {
    name: '其他机械(台)',
    prop: 'otherUseMachineryNumber',
    stack: 'a',
    active: true,
    color: colors[5]
  },
  {
    name: '柴油(万千瓦)',
    prop: 'dieselMachineryMilKilowatts',
    stack: 'c',
    active: true,
    color: colors[6]
  },
  {
    name: '汽油(万千瓦)',
    prop: 'gasolineMachineryMilKilowatts',
    stack: 'd',
    active: true,
    color: colors[7]
  },
  {
    name: '电动(万千瓦)',
    prop: 'electricMachineryMilKilowatts',
    stack: 'e',
    active: true,
    color: colors[8]
  },
  {
    name: '水利(万千瓦)',
    prop: 'hydraulicMachineryMilKilowatts',
    stack: 'f',
    active: true,
    color: colors[9]
  },
  {
    name: '风力(万千瓦)',
    prop: 'windMachineryMilKilowatts',
    stack: 'g',
    active: true,
    color: colors[10]
  },
  {
    name: '煤炭(万千瓦)',
    prop: 'coalMachineryMilKilowatts',
    stack: 'h',
    active: true,
    color: colors[11]
  },
  {
    name: '太阳能(万千瓦)',
    prop: 'solarMachineryMilKilowatts',
    stack: 'i',
    active: true,
    color: colors[12]
  },
  {
    name: '其他动力(万千瓦)',
    prop: 'otherPowerMachineryMilKilowatts',
    stack: 'j',
    active: true,
    color: colors[13]
  }
];

const inputLabelList = [
  {
    name: '总量(吨)',
    prop: 'totalAmount',
    stack: 'a',
    active: true,
    color: colors[0]
  },
  {
    name: '有机肥(吨)',
    prop: 'organicFertilizerAmount',
    stack: 'b',
    active: true,
    color: colors[1]
  },
  {
    name: '无机肥(吨)',
    prop: 'inorganicFertilizerAmount',
    stack: 'b',
    active: true,
    color: colors[2]
  },
  {
    name: '农药(吨)',
    prop: 'pesticideAmount',
    stack: 'b',
    active: true,
    color: colors[3]
  },
  {
    name: '饲料(吨)',
    prop: 'forageAmount',
    stack: 'b',
    active: true,
    color: colors[4]
  },
  {
    name: '鱼药(吨)',
    prop: 'fisheryMedicinesAmount',
    stack: 'b',
    active: true,
    color: colors[5]
  },
  {
    name: '其他(吨)',
    prop: 'otherAmount',
    stack: 'b',
    active: true,
    color: colors[6]
  }
];

const operatorLabelList = [
  {
    name: '资金总额(万元)',
    prop: 'totalAmount',
    stack: 'a',
    yAxisIndex: 0,
    active: true,
    color: colors[0]
  },
  {
    name: '项目拨款(万元)',
    prop: 'appropriationAmount',
    stack: 'a',
    yAxisIndex: 0,
    active: true,
    color: colors[1]
  },
  {
    name: '补贴金额(万元)',
    prop: 'subsidyAmount',
    stack: 'a',
    yAxisIndex: 0,
    active: true,
    color: colors[2]
  },
  {
    name: '农业社会化服务营收(万元)',
    prop: 'revenueAmount',
    stack: 'a',
    yAxisIndex: 0,
    active: true,
    color: colors[3]
  },
  {
    name: '政府项目(个)',
    prop: 'governmentProjectNumber',
    stack: 'b',
    yAxisIndex: 1,
    active: true,
    color: colors[4]
  },
  {
    name: '专项补贴(个)',
    prop: 'subsidyProjectNumber',
    stack: 'b',
    yAxisIndex: 1,
    active: true,
    color: colors[5]
  }
];

const deviceLabelList = [
  {
    name: '总数(套)',
    prop: 'totalNumber',
    stack: 'b',
    yAxisIndex: 0,
    active: true,
    color: colors[0]
  },
  {
    name: '传感器',
    prop: 'sensorNumber',
    stack: 'a',
    yAxisIndex: 0,
    active: true,
    color: colors[1]
  },
  {
    name: '球机摄像头',
    prop: 'domeCameraNumber',
    stack: 'a',
    yAxisIndex: 0,
    active: true,
    color: colors[2]
  },
  {
    name: '枪机摄像头',
    prop: 'boxCameraNumber',
    stack: 'a',
    yAxisIndex: 0,
    active: true,
    color: colors[3]
  },
  {
    name: 'NVR设备',
    prop: 'nvrNumber',
    stack: 'a',
    yAxisIndex: 1,
    active: true,
    color: colors[4]
  }
];

function mixOption(obj) {
  let legendData = obj.series.map((item) => item.name);
  let yAxis = obj.yAxis.map((item) => {
    return {
      min: 0,
      name: item.name || '',
      position: item.position,
      nameLocation: 'start',
      nameTextStyle: {
        color: 'rgba(159,168,184,1)'
      },
      axisLabel: {
        color: "#9FA8B8",
        fontSize: 12
        // formatter: `{value}(${obj.unit || ''})`
      },
      splitLine: {
        lineStyle: {
          color: ['#3D485D'],
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      }
    };
  });

  return {
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: '{b} <br />{a} : {c}'
    },
    legend: {
      data: legendData,
      top: 0,
      left: 'center',
      textStyle: {
        color: '#9FA8B8',
      }
    },
    grid: {
      left: "5%",
      right: "5%",
      top: "12%",
      bottom: "14%"
    },
    xAxis: {
      axisLabel: {
        color: "#9FA8B8",
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: "#3E495E",
          width: 2
        }
      },
      data: obj.year
    },
    yAxis,
    series: obj.series
  };
}

export default {
  colors,
  landLabelList,
  memberLabelList,
  machineLabelList,
  inputLabelList,
  operatorLabelList,
  deviceLabelList,
  mixOption
}
