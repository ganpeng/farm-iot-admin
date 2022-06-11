<!--列表形式切换按钮组件-->
<template>
  <div class="list-style-switch">
    <div :class="['style-active-border', currentListStyle]"></div>
    <div @click="switchListStyleIndex('SensorList')" class="style-item"
         :class="currentListStyle === 'SensorList' ? 'active' : ''">
      <label>传感器</label>
    </div>
    <div @click="switchListStyleIndex('CameraList')" class="style-item"
         :class="currentListStyle === 'CameraList' ? 'active' : ''">
      <label>摄像头</label>
    </div>
    <div @click="switchListStyleIndex('ControlList')" class="style-item"
         :class="currentListStyle === 'ControlList' ? 'active' : ''">
      <label>控制设备</label>
    </div>
  </div>
</template>

<script>
  export default {
    name: "page-switch",
    watch: {
      '$route'() {
        this.switchListStyleIndex(this.$route.name);
      }
    },
    data() {
      return {
        currentListStyle: this.$route.name
      }
    },
    created() {
      this.switchListStyleIndex(this.$route.name);
    },
    methods: {
      switchListStyleIndex(pageName) {
        this.currentListStyle = pageName;
        this.$router.push({name: pageName});
      }
    }
  }
</script>

<style scoped lang="scss">

  // 列表形式切换组件
  .list-style-switch {
    display: flex;
    align-items: center;
    position: relative;
    margin-left: 50px;
    height: 38px;

    .style-item {
      margin-right: 70px;
      display: flex;
      align-items: center;
      height: 22px;
      cursor: pointer;

      &:last-child {
        margin-right: 0px;
      }

      &:hover, &.active {
        label {
          color: rgba(255, 255, 255, 1);
        }
      }

      label {
        font-size: 14px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
        cursor: pointer;
      }
    }

    .style-active-border {
      position: absolute;
      bottom: -2px;
      left: -4px;
      z-index: 100;
      width: 50px;
      height: 2px;
      background: rgba(100, 164, 229, 1);
      border-radius: 1px;


      &.SensorList {
        left: -4px;
        transition: left 0.3s;
      }

      &.CameraList {
        left: 108px;
        transition: left 0.3s;
      }

      &.ControlList {
        left: 226px;
        transition: left 0.3s;
      }
    }
  }

</style>
