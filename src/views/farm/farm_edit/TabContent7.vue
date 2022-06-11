<!-- 物联网项目 -->
<template>
  <div class="tab-content-two">
    <sub-tab-bar
      :tabBarList="tabBarList"
      :subActiveIndex="subActiveIndex"
      :changeSubActiveIndexHandler="changeSubActiveIndexHandler"
    >
    </sub-tab-bar>
    <div class="sub-tab-content">
      <div v-if="subActiveIndex === 0" class="content-one">
        <!-- 传感器 -->
        <sensor-list></sensor-list>
      </div>
      <div v-if="subActiveIndex === 1" class="content-two">
        <!-- 摄像头 -->
        <camera-list></camera-list>
      </div>
    </div>
  </div>
</template>

<script>
import SubTabBar from "@/components/SubTabBar";
import SensorList from "./management/SensorList";
import CameraList from "./management/CameraList";
export default {
  name: "TabContent7",
  components: { SubTabBar, SensorList, CameraList },
  data() {
    return {
      subActiveIndex: 0,
      tabBarList: [
        {
          title: "传感器",
        },
        {
          title: "摄像头",
        },
      ],
    };
  },
  methods: {
    changeSubActiveIndexHandler(index) {
      this.subActiveIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
