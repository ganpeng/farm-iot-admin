<template>
  <div class="tab-content-three">
    <sub-tab-bar
      :tabBarList="tabBarList"
      :subActiveIndex="subActiveIndex"
      :changeSubActiveIndexHandler="changeSubActiveIndexHandler">
    </sub-tab-bar>
    <div class="sub-tab-content">
      <div v-if="subActiveIndex === 0" class="content-one">
        <land-list></land-list>
      </div>
      <div v-if="subActiveIndex === 1" class="content-two">
        <homestead-list></homestead-list>
      </div>
    </div>
  </div>
</template>
<script>
import SubTabBar from '@/components/SubTabBar';
import LandList from "./components/LandList";
import HomesteadList from "./components/HomesteadList";
export default {
  name: "TabContent3",
  components: { SubTabBar, LandList, HomesteadList },
  data() {
    return {
      subActiveIndex: 0,
      tabBarList: [
        {
          title: "耕地管理",
          active: true
        },
        {
          title: "宅基地管理",
          active: false
        }
      ]
    };
  },
  methods: {
    changeSubActiveIndexHandler(index) {
      this.subActiveIndex = index;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
