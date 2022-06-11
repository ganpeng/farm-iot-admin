<template>
  <el-dialog
    title="选择农场坐标"
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
      <div class="my-search-field">
        <div class="field-row">
          <div class="row-left">
            <div class="search-field-item input-search">
              <el-autocomplete
                v-model="qs"
                :fetch-suggestions="querySearchAsync"
                :trigger-on-focus="false"
                value-key="name"
                placeholder="请输入内容"
                @select="selectHandler"
              ></el-autocomplete>
              <!--
              <el-input
                v-model="search.keyword"
                @input="inputHandler($event)"
              ></el-input>
              <span @click="searchHandler" class="input-search-btn">
                <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
                <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
              </span>
              -->
            </div>
          </div>
        </div>
      </div>
      <div class="my-map">
        <div id="map"></div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">取 消</el-button>
      <el-button class="enter-btn" @click="enterHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from 'lodash';
export default {
  name: "MyMapDialog",
  props: {
    setSuccessHandler: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      qs: '',
      map: null,
      autoComplete: null,
      lnglat: [],
      marker: null
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

        //输入提示
        let autoComplete = new window.AMap.Autocomplete({});
        this.autoComplete = autoComplete;

        this.map.add(marker);
        this.marker = marker;

        this.map.on('click', this.setLngLat.bind(this));
      } catch (e) {
        console.log(e);
      }
    },
    setLngLat(e) {
      let lnglat = new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat())
      this.lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
      this.marker.setPosition(lnglat);
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.map = null;
      this.lnglat = [];
      this.marker = null;
      this.qs = '';
      this.autoComplete = null;
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
    },
    enterHandler() {
      if (this.lnglat.length === 2) {
        this.setSuccessHandler(this.lnglat);
        this.cancelHandler();
      } else {
        this.$message.error('请选择坐标');
      }
    },
    querySearchAsync(queryString, cb) {
      this.autoComplete.search(queryString, (status, result) => {
        if (status === 'complete') {
          cb(result.tips);
        }
      });
    },
    selectHandler(address) {
      this.map.setCenter([address.location.lng, address.location.lat]);
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
