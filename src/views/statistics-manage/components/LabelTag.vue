<template>
  <div class="label-tag">
    <template v-if="labelList">
      <div class="label-item-wrapper">
        <div @click="toggleTrendLabel(index)"
          v-for="(item, index) in labelList" :key="index"
          :title="tagDisabled(item) && '最多可同时查看7项数据'"
          :class="['label-item', item.active && 'active', tagDisabled(item) && 'disabled']">
          <div :style="`background-color: ${ item.active ? item.color : '#667799'};`"></div>
          {{item.name}}
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "LabelTag",
  props: {
    labelList: {
      type: Array,
      default: () => []
    },
    labelChangedHandler: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    tagDisabled() {
      return (label) => {
        let activeLength = this.labelList.filter((item) => item.active).length;
        return !label.active && activeLength >= 7;
      };
    }
  },
  methods: {
    toggleTrendLabel(index) {
      let active = _.get(this.labelList, `${index}.active`);
      let length = this.labelList.filter((item) => item.active).length;
      if (active && length === 1) {
        return false;
      }

      let labelList = this.labelList.map((item, _index) => {
        if (index === _index) {
          item.active = !item.active;
        }
        return item;
      });
      this.labelChangedHandler(labelList)
    },
  }
};
</script>
<style lang="scss" scoped>
.label-tag {
  .label-item-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .label-item {
    margin: 5px;
    font-size: 12px;
    display: flex;
    align-items: center;
    color: #9FA8B8;
    cursor: pointer;
    div {
      width: 12px;
      height: 12px;
      margin-right: 5px;
    }
  }
}
</style>
