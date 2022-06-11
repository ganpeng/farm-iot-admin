<template>
  <div class="tab-content-five">
    <sub-tab-bar
      :tabBarList="tabBarList"
      :subActiveIndex="subActiveIndex"
      :changeSubActiveIndexHandler="changeSubActiveIndexHandler">
    </sub-tab-bar>
    <div class="sub-tab-content">
      <div v-if="subActiveIndex === 0" class="content-one">
        <government-project-list></government-project-list>
      </div>
      <div v-if="subActiveIndex === 1" class="content-two">
        <subsidy-list></subsidy-list>
      </div>
      <div v-if="subActiveIndex === 2" class="content-four">
        <social-list></social-list>
      </div>
    </div>
  </div>
</template>
<script>
import SubTabBar from '@/components/SubTabBar';
import GovernmentProjectList from "./management/GovernmentProjectList";
import SubsidyList from "./management/SubsidyList";
import SocialList from "./management/SocialList";
export default {
  name: "TabContent5",
  components: {
    SubTabBar,
    GovernmentProjectList,
    SubsidyList,
    SocialList
  },
  data() {
    return {
      subActiveIndex: 0,
      tabBarList: [
        {
          title: "政府项目",
          active: true
        },
        {
          title: "专项补贴",
          active: false
        },
        {
          title: "农业社会化服务",
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
