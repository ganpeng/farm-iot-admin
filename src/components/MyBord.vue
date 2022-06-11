<template>
    <div class="my-bord-status">
        <div :style="itemStyle" v-for="(bord, index) in bordList" :key="index" class="status-item">
          <div class="label">
            <div class="line"></div>
            <div class="title">
                {{bord.title}}
            </div>
          </div>
          <div class="value">{{bord.count}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MyBord',
    props: {
        width: {
          type: Number
        },
        bordList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
      itemStyle() {
        return this.width ? `width: ${this.width}px;` : `flex: 1;`;
      }
    }
}
</script>
<style lang="scss" scoped>
</style>
