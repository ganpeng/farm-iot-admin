<template>
  <div class="tab-content-two">
    <sub-tab-bar
      :tabBarList="tabBarList"
      :subActiveIndex="subActiveIndex"
      :changeSubActiveIndexHandler="changeSubActiveIndexHandler">
    </sub-tab-bar>
    <div class="sub-tab-content">
      <div v-if="subActiveIndex === 0" class="content-one">
        <manage-member-list></manage-member-list>
      </div>
      <div v-if="subActiveIndex === 1" class="content-two">
        <plant-member-list></plant-member-list>
      </div>
    </div>
  </div>
</template>
<script>
import SubTabBar from '@/components/SubTabBar';
import ManageMemberList from "./components/ManageMemberList";
import PlantMemberList from "./components/PlantMemberList";
export default {
  name: "TabContent2",
  components: { SubTabBar, ManageMemberList, PlantMemberList },
  data() {
    return {
      subActiveIndex: 0,
      tabBarList: [
        {
          title: "经营人员"
        },
        {
          title: "种植人员"
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
