<template>
  <el-dialog
    title="农场坐标"
    class="my-dialog my-dialog-2"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-body">
      <div class="lnglat-info">经度：{{lnglat[0]}} &nbsp; 纬度：{{lnglat[1]}}</div>
      <div class="my-map">
        <div id="map"></div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "MapDisplayDialog",
  props: {
      lnglat: {
        type: Array,
        default: () => []
      },
  },
  data() {
    return {
      visible: false,
      map: null
    };
  },
  methods: {
    async mapInit() {
      try {
        this.map = new window.AMap.Map("map", {
          // 设置地图的显示样式
          mapStyle: "amap://styles/7a60a17fd95cc95785b0397d9ce88d1a",
          zoom: 18
        });
        let marker = new window.AMap.Marker({
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: new AMap.LngLat(116.39, 39.9)
        });

        this.map.add(marker);
        if (this.lnglat.length === 2) {
          this.map.setCenter(this.lnglat);
          marker.setPosition(this.lnglat);
        }
      } catch (e) {
        console.log(e);
      }
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.map = null;
    },
    async openDialogHandler() {
      try {
        await this.$nextTick();
        this.mapInit();
      } catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    cancelHandler() {
      this.hide();
    }
  }
};
</script>
<style lang="scss" scoped>
.lnglat-info {
  height: 40px;
  line-height: 40px;
  color: #fff;
}
.my-map {
  width: 100%;
  height: 600px;
  #map {
    width: 100%;
    height: 600px;
  }
}
</style>
<style lang="scss">
.my-dialog-2 {
  .el-dialog__body {
    overflow: hidden!important;
  }
}
</style>
