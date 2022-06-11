<!-- 数据统计-设备统计 -->
<template>
  <div id="farm-data-container">
    <div id="tab-list">
      <div class="active">种类统计</div>
    </div>
    <div id="data-content-block">
      <device-type-module></device-type-module>
    </div>
  </div>
</template>

<script>
  import DeviceTypeModule from './components/DeviceTypeModule';

  export default {
    name: 'device-statistics',
    components: {
      DeviceTypeModule
    },
    data() {
      return {
        activeIndex: 0
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style scoped lang="scss">

  #data-content-block {
    padding: 0 18px;
  }

  #tab-list {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 18px;
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
