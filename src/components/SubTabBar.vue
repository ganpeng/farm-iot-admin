<template>
  <div class="sub-tab-bar-container">
    <div class="sub-tab-bar-wrapper">
      <div class="active-bar" :style="activeBarStyle"></div>
      <ul class="sub-tab-bar-list">
        <li
          @click="changeSubTab(index)"
          v-for="(item, index) in tabBarList"
          :key="index"
          :class="['sub-tab-bar-item', subActiveIndex === index && 'active']"
        >
          <span class="title">{{item.title}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SubTabBar',
  props: {
    tabBarList: {
      type: Array,
      default: () => []
    },
    subActiveIndex: {
      type: Number,
      default: 0
    },
    changeSubActiveIndexHandler: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      activeBarStyle: ''
    };
  },
  watch: {
    subActiveIndex() {
      this.getActiveBarStyle();
    }
  },
  created() {
    this.getActiveBarStyle();
  },
  methods: {
    async changeSubTab(index) {
      this.changeSubActiveIndexHandler(index);
    },
    async getActiveBarStyle() {
      try {
        await this.$nextTick();
        let tabBarList = document.querySelectorAll('.sub-tab-bar-list .sub-tab-bar-item');
        let currentTab = tabBarList[this.subActiveIndex];
        let computedStyle = document.defaultView.getComputedStyle(currentTab, null);
        let {width} = computedStyle;
        let translateX = 0;
        for (let i = 0; i < this.subActiveIndex; i++) {
          let currentTabBar = tabBarList[i];
          let {width, marginRight} = document.defaultView.getComputedStyle(currentTabBar, null);
          let _one = parseFloat(marginRight.replace('px', ''));
          let _two = parseFloat(width.replace('px', ''));
          translateX = translateX + _two + _one;
        }
        let activeBarStyle = `width: ${width};transform: translateX(${translateX}px)`;
        this.activeBarStyle = activeBarStyle;
      } catch (err) {
        console.log(err);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sub-tab-bar-container {
  .sub-tab-bar-wrapper {
    position: relative;
    margin-left: 60px;
    .active-bar {
      position: absolute;
      bottom: 8px;
      left: 0px;
      width: 50px;
      height: 2px;
      transition: all 400ms;
      background-color: #64A4E5;
    }
    .sub-tab-bar-list {
      display: flex;
      align-items: center;
      .sub-tab-bar-item {
        margin-top: 20px;
        margin-bottom: 12px;
        margin-right: 60px;
        margin-left: 0;
        cursor: pointer;
        .title {
          font-size: 14px;
          line-height: 14px;
          color: #9FA8B8;
        }
        &.active {
          .title {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>