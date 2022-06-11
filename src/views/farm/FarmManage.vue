<template>
  <div class="farm-edit-container">
    <div class="tab-bar-container">
      <ul class="tab-bar-list">
        <li
          @click="changeTab(index)"
          v-for="(item, index) in tabBarList"
          :key="index"
          :class="['tab-bar-item', item.active && 'active']">
          <span class="title">{{item.title}}</span>
        </li>
      </ul>
    </div>
    <div class="tab-content">
      <tab-content2 v-if="activeIndex === 0"></tab-content2>
      <tab-content3 v-if="activeIndex === 1"></tab-content3>
      <tab-content4 v-if="activeIndex === 2"></tab-content4>
      <tab-content5 v-if="activeIndex === 3"></tab-content5>
      <tab-content6 v-if="activeIndex === 4"></tab-content6>
      <tab-content7 v-if="activeIndex === 5"></tab-content7>
    </div>
  </div>
</template>
<script>
  import {mapMutations} from "vuex";
  import TabContent2 from "./farm_edit/TabContent2";
  import TabContent3 from "./farm_edit/TabContent3";
  import TabContent4 from "./farm_edit/TabContent4";
  import TabContent5 from "./farm_edit/TabContent5";
  import TabContent6 from "./farm_edit/TabContent6";
  import TabContent7 from "./farm_edit/TabContent7";

  export default {
    name: "FarmEdit",
    components: {
      TabContent2,
      TabContent3,
      TabContent4,
      TabContent5,
      TabContent6,
      TabContent7
    },
    data() {
      return {
        tabBarList: [
          {
            title: "成员管理",
            active: true
          },
          {
            title: "土地管理",
            active: false
          },
          {
            title: "农机具管理",
            active: false
          },
          {
            title: "经营管理",
            active: false
          },
          {
            title: "种植管理",
            active: false
          },
          {
            title: "物联网数据",
            active: false
          }
        ]
      };
    },
    async created() {
      try {
        let {mindex} = this.$route.query;
        if (mindex) {
          this.setTab(parseInt(mindex));
        }
      } catch (err) {
        console.log(err);
      }
    },
    computed: {
      activeIndex() {
        return this.tabBarList.findIndex(item => item.active);
      }
    },
    methods: {
      ...mapMutations({}),
      setTab(index) {
        this.tabBarList = this.tabBarList.map((item, _index) => {
          if (index === _index) {
            item.active = true;
          } else {
            item.active = false;
          }
          return item;
        });
      },
      changeTab(index) {
        let {id} = this.$route.params;
        let {name} = this.$route.query;
        this.setTab(index);
        this.$router.push({name: 'FarmManage', params: {id}, query: {mindex: index, name}});
      }
    }
  };
</script>
<style lang="scss" scoped>
  .farm-edit-container {
    .tab-bar-container {
      // position: absolute;
      // top: 1px;
      // left: 0;
      // right: 0;
      background-color: #0f1623;
      // z-index: 10;
      .tab-bar-list {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 50px;
        .tab-bar-item {
          display: flex;
          align-items: center;
          height: 50px;
          line-height: 50px;
          .title {
            display: inline-block;
            font-size: 16px;
            color: #9fa8b8;
            height: 32px;
            line-height: 32px;
            padding: 0 24px;
            cursor: pointer;
          }
          &:hover {
            .title {
              color: #fff;
            }
          }
          &.active {
            .title {
              color: #fff;
              background-color: $mainColor;
              border-radius: 20px;
            }
          }
        }
        .tab-bar-item {
          margin-left: 20px;
        }
      }
    }
    .tab-content {
      // margin-top: 40px;
    }
  }
</style>
