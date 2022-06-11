<!-- 数据统计-农场统计-->
<template>
  <div id="farm-data-container">
    <div id="tab-list">
      <div :class="{'active':activeIndex === 0}" @click="selectTab(0)">用地统计</div>
      <div :class="{'active':activeIndex === 1}" @click="selectTab(1)">从业人员统计</div>
      <div :class="{'active':activeIndex === 2}" @click="selectTab(2)">农机具统计</div>
      <div :class="{'active':activeIndex === 3}" @click="selectTab(3)">产量统计</div>
      <div :class="{'active':activeIndex === 4}" @click="selectTab(4)">投入品统计</div>
      <div :class="{'active':activeIndex === 5}" @click="selectTab(5)">经营统计</div>
    </div>
    <div id="data-content-block">
      <land-module v-if="activeIndex === 0"></land-module>
      <member-module v-if="activeIndex === 1"></member-module>
      <machine-module v-if="activeIndex === 2"></machine-module>
      <plant-module v-if="activeIndex === 3"></plant-module>
      <input-module v-if="activeIndex === 4"></input-module>
      <operate-module v-if="activeIndex === 5"></operate-module>
    </div>
  </div>
</template>

<script>
  import LandModule from './components/LandModule';
  import MemberModule from './components/MemberModule';
  import MachineModule from './components/MachineModule';
  import InputModule from './components/InputModule';
  import OperateModule from './components/OperateModule';
  import PlantModule from './components/PlantModule';
  export default {
    name: 'farm-statistics',
    components: {
      LandModule,
      MemberModule,
      MachineModule,
      InputModule,
      OperateModule,
      PlantModule
    },
    data() {
      return {
        activeIndex: ''
      }
    },
    async created() {
      try {
        await this.$nextTick();
        let {index} = this.$route.query;
        setTimeout(() => {
          this.activeIndex = parseInt(index);
        }, 100);
      } catch (err) {
        console.log(err);
      }
    },
    methods: {
      selectTab(index) {
        this.activeIndex = index;
        this.$router.push({name: 'FarmStatistics', query: {index: index}});
      }
    }
  }
</script>

<style scoped lang="scss">

  #data-content-block {
    padding: 0 18px;
  }

  #tab-list {
    padding: 0 18px;
    display: flex;
    align-items: center;
    height: 50px;
    background: rgba(15, 22, 35, 1);
    div {
      margin-right: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 112px;
      height: 32px;
      border-radius: 20px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      &.active {
        background: rgba(15, 112, 243, 1);
      }
    }
  }

</style>
