<!--多张图片预览组件-->
<template>
  <div v-if="visible" class="cover-mask">
    <div class="title">
      <label>{{previewMultipleImages.activeIndex + 1}}/{{previewMultipleImages.list.length}}</label>
    </div>
    <div class="image-box">
      <img :src="currentImage">
    </div>
    <div
      class="scroll-btn left"
      @click="scrollImageList('LEFT')"
      :class="{'disabled': previewMultipleImages.list.length === 1}"
    >
      <i class="el-icon-arrow-left"></i>
    </div>
    <div
      class="scroll-btn right"
      @click="scrollImageList('RIGHT')"
      :class="{'disabled': previewMultipleImages.list.length === 1}"
    >
      <i class="el-icon-arrow-right"></i>
    </div>
    <i class="el-icon-close" @click="closePreview"></i>
  </div>
</template>

<script>
export default {
  name: "PreviewMultipleImages",
  props: ["previewMultipleImages"],
  data() {
    return {
      visible: false
    };
  },
  computed: {
    currentImage() {
      let image = this.previewMultipleImages.list[this.previewMultipleImages.activeIndex];
      return image.fileUrl ? image.fileUrl : image;
    }
  },
  methods: {
    show() {
      this.visible = true;
      console.log('aaa');
    },
    hide() {
      this.visible = false;
    },
    scrollImageList(directionSign) {
      switch (directionSign) {
        case "LEFT":
          if (this.previewMultipleImages.activeIndex === 0) {
            this.previewMultipleImages.activeIndex =
              this.previewMultipleImages.list.length - 1;
          } else {
            this.previewMultipleImages.activeIndex =
              this.previewMultipleImages.activeIndex - 1;
          }
          break;
        case "RIGHT":
          if (
            this.previewMultipleImages.activeIndex ===
            this.previewMultipleImages.list.length - 1
          ) {
            this.previewMultipleImages.activeIndex = 0;
          } else {
            this.previewMultipleImages.activeIndex =
              this.previewMultipleImages.activeIndex + 1;
          }
          break;
        default:
          break;
      }
    },
    closePreview() {
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
  background-color: rgba(0, 0, 0, 0.8);
}

.image-box {
  text-align: center;
  width: 100%;
  overflow-x: scroll;
}

.scroll-btn {
  display: block;
  position: fixed;
  bottom: 50%;
  margin-bottom: -25px;
  &.left {
    left: 20px;
  }
  &.right {
    right: 20px;
  }
  i {
    font-size: 50px;
    color: #fff;
    cursor: pointer;
    &:hover {
      color: $mainColor;
    }
  }
  &.disabled {
    pointer-events: none;
    i {
      opacity: 0.3;
      cursor: not-allowed;
      &:hover {
        color: #fff;
      }
    }
  }
}

.el-icon-close {
  position: fixed;
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
