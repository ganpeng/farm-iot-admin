<!--单张图片预览组件-->
<template>
  <div v-if="visible" class="cover-mask">
    <div class="image-box">
      <img :src="url">
      <i class="el-icon-close" @click="hide"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "PreviewSingleImage",
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.cover-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  z-index: 3000;
  background-color: transparent;
}

.image-box {
  position: relative;
  padding: 0px 120px 45px 120px;
  background: rgba(12, 16, 25, 0.9);
  box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow-x: scroll;
  .title {
    height: 75px;
    line-height: 89px;
    font-size: 14px;
    color: #a8abb3;
  }
}

.el-icon-close {
  position: absolute;
  right: 26px;
  top: 26px;
  padding: 6px;
  font-size: 16px;
  cursor: pointer;
  color: #c35757;
  &:hover {
    color: #d0021b;
  }
}
</style>
