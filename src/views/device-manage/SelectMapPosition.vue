<!--选择地图经纬度-->
<template>
  <div id="page-container">
    <div class="data-block" v-if="lng !== 116.3">经度：{{lng}} 纬度：{{lat}}</div>
    <div class="data-block" v-else>未设置</div>
    <div id="amap-wrapper">
    </div>
    <div id="myPageTop">
      <label>请输入关键字：</label>
      <div><input id="tipinput"/></div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "SelectMapPosition",
    props: ['mapCenter', 'move'],
    data() {
      return {
        map: {},
        marker: {},
        // 经度
        lng: '',
        // 纬度
        lat: ''
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      // 实例化点标记
      addMarker() {
        let that = this;
        this.marker = new window.AMap.Marker({
          icon: "/img/map_marker.png",
          position: [that.lng, that.lat],
          offset: new window.AMap.Pixel(-13, -30)
        });
        this.marker.setMap(this.map);
      },
      // 清除 marker
      clearMarker() {
        if (this.marker && this.marker.setMap) {
          this.marker.setMap(null);
          this.marker = null;
        }
      },
      init() {
        let that = this;
        this.lng = this.mapCenter[0] || 116.3;
        this.lat = this.mapCenter[1] || 39.9;
        let center = [parseFloat(this.lng), parseFloat(this.lat)];
        this.map = new window.AMap.Map("amap-wrapper", {
          resizeEnable: true,
          center: center,
          zoom: 10
        });
        // 为地图注册click事件获取鼠标点击出的经纬度坐标
        if (this.move) {
          this.map.on('click', function (e) {
            that.lat = e.lnglat.lat;
            that.lng = e.lnglat.lng;
            that.clearMarker();
            that.addMarker();
          });
        }
        if (this.mapCenter[0]) {
          this.addMarker();
        }
        //输入提示
        let autoOptions = {
          input: 'tipinput'
        };
        let auto = new window.AMap.Autocomplete(autoOptions);
        let placeSearch = new window.AMap.PlaceSearch({
          map: that.map
        });
        //构造地点查询类
        window.AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询
        }
      },
      getPosition() {
        return {lat: this.lat, lng: this.lng};
      },
      resetMap() {
        this.clearMarker();
        if (this.mapCenter[0]) {
          this.lng = this.mapCenter[0] || 39.9;
          this.lat = this.mapCenter[1] || 116.3;
          this.addMarker();
        }
        this.map.setCenter([this.lng, this.lat]);
        this.map.setZoom(10);
      }
    }, destroyed() {
      this.map = null;
    }
  }
</script>

<style scoped lang="scss">

  #amap-wrapper {
    width: 100%;
    height: 630px;
  }

  .data-block {
    font-size: 14px;
    margin-bottom: 10px;
    color: white;
  }

</style>

<style lang="scss">

  .amap-sug-result {
    z-index: 10000 !important;
    width: 240px;
    background: rgba(33, 50, 77, 1);
    box-shadow: 2px 4px 10px 0px rgba(0, 0, 0, 0.2);
    opacity: 0.9;
    border: 1px solid rgba(99, 116, 151, 1);
    .auto-item {
      font-size: 12px;
      font-weight: 400;
      color: rgba(216, 216, 216, 1);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &:hover {
        background: rgba(33, 50, 77, 1);
      }
    }
    span {
      font-size: 12px;
      font-weight: 400;
      color: rgba(168, 171, 179, 1);
    }
  }

  #page-container {
    #myPageTop {
      padding-right: 10px;
      top: 50px;
      display: flex;
      align-items: center;
      background-color: transparent;
      border: none;
      label {
        margin-right: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(168, 171, 179, 1);
      }
      div {
        display: flex;
        align-items: center;
        width: 240px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid rgba(62, 73, 94, 1);
        input {
          padding: 0 10px;
          width: 100%;
          background: transparent !important;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 1) !important;
        }
        input:-internal-autofill-previewed,
        input:-internal-autofill-selected {
          -webkit-text-fill-color: #FFFFFF !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
      }
    }
  }

</style>
