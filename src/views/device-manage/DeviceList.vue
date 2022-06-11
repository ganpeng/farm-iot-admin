<template>
  <div id="device-list-container">
    <div id="device-data-block">
      <div>
        <label><i></i>总数</label>
        <span>{{deviceDataObj.deviceTotal}}</span>
      </div>
      <div>
        <label><i></i>传感器</label>
        <span>{{deviceDataObj.sensorNum}}</span>
      </div>
      <div>
        <label><i></i>枪机摄像头</label>
        <span>{{deviceDataObj.boxCamera}}</span>
      </div>
      <div>
        <label><i></i>球机摄像头</label>
        <span>{{deviceDataObj.domeCamera}}</span>
      </div>
      <div>
        <label><i></i>在线</label>
        <span>{{deviceDataObj.deviceOnlineNum}}</span>
      </div>
      <div>
        <label><i></i>离线</label>
        <span>{{deviceDataObj.deviceOfflineNum}}</span>
      </div>
      <div>
        <label><i></i>未激活</label>
        <span>{{deviceDataObj.deviceUnactiveNum}}</span>
      </div>
    </div>
    <page-switch></page-switch>
    <router-view/>
  </div>
</template>

<script>
  import PageSwitch from './PageSwitch';

  export default {
    name: "device-list",
    components: {PageSwitch},
    data() {
      return {
        deviceDataObj: {},
      }
    },
    mounted() {
      this.$service.getAllDeviceData().then(response => {
        if (response && response.code === 0) {
          this.deviceDataObj = response.data;
        }
      })
    }
  }
</script>

<style scoped lang="scss">

  #device-list-container {
    padding-left: 18px;
    padding-right: 18px;
  }

  #device-data-block {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
      padding: 10px;
      margin-right: 12px;
      flex-grow: 1;
      flex-shrink: 1;
      display: flex;
      flex-direction: column;
      width: 177px;
      height: 80px;
      background: rgba(32, 44, 65, 1);
      border-radius: 10px;

      label {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);

        i {
          margin-right: 8px;
          width: 2px;
          height: 20px;
          background: rgba(248, 101, 73, 1);
        }
      }

      span {
        align-self: flex-end;
        font-size: 32px;
        font-weight: 400;
        color: rgba(138, 185, 232, 1);
        line-height: 45px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

</style>
