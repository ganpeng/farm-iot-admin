<template>
  <div v-if="fileList.length > 0" :class="['my-carousel-container', theme]">
    <div :id="id" :style="siemaStyle" class="siema">
      <div v-for="(file, index) in fileList"
        :key="index"
         @click.stop="previewImageHandler(index)"
        :style="siemaItemStyle(file)" class="siema-item">
        <span v-if="canDelete" @click.stop="deleteFileByIndex(index)" class="file-delete-btn">
          <svg-icon class="file-delete" icon-class="file_delete"/>
          <svg-icon class="file-delete-hover" icon-class="file_delete_hover"/>
        </span>
      </div>
    </div>
    <div v-if="fileList.length > 1" class="prev">
      <span @click="prevHandler" class="prev-btn">
        <svg-icon icon-class="prev_btn"/>
        <svg-icon icon-class="prev_btn_hover"/>
      </span>
    </div>
    <div v-if="fileList.length > 1" class="next">
      <span @click="nextHandler" class="next-btn">
        <svg-icon icon-class="next_btn"/>
        <svg-icon icon-class="next_btn_hover"/>
      </span>
    </div>
    <span class="page">
      {{currentSlide}}/{{fileList.length}}
    </span>
    <preview-multiple-images ref="previewMultipleImagesDialog" :previewMultipleImages="previewMultipleImages"></preview-multiple-images>
  </div>
</template>
<script>
import Siema from './Siema';
import PreviewMultipleImages from './PreviewMultipleImages.vue';
export default {
  name: 'MyCarousel',
  components: {PreviewMultipleImages},
  props: {
    theme: {
      type: String,
      default: 'default'
    },
    id: {
      type: String,
      default: 'siema'
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    fileList: {
      type: Array,
      default: () => [{
        fileUrl: 'https://sorgalla.com/jcarousel/examples/_shared/img/img5.jpg'
      }, {
        fileUrl: 'https://sorgalla.com/jcarousel/examples/_shared/img/img6.jpg'
      }, {
        fileUrl: 'https://sorgalla.com/jcarousel/examples/_shared/img/img4.jpg'
      }, {
        fileUrl: 'https://sorgalla.com/jcarousel/examples/_shared/img/img3.jpg'
      }]
    },
    deleteFile: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      siema: null,
      previewMultipleImages: {
        activeIndex: 0,
        list: []
      }
    };
  },
  watch: {
    fileList() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  computed: {
    currentSlide() {
      return this.siema && this.siema.currentSlide ? (this.siema.currentSlide + 1) : 1;
    },
    siemaStyle() {
      return `width: ${this.width}px;height: ${this.height}px;`;
    },
    siemaItemStyle() {
      return (file) => {
        if (file.fileUrl) {
          return `width: ${this.width}px;height: ${this.height}px;background-image: url('${file.fileUrl}');`;
        } else {
          return `width: ${this.width}px;height: ${this.height}px;background-image: url('${file}');`;
        }
      };
    }
  },
  methods: {
    async init() {
      try {
        await this.$nextTick();
        let siema = document.querySelector(`#${this.id}`);
        this.siema = new Siema({
          selector: siema,
          draggable: false
        });
      } catch (err) {
        console.log(err);
      }
    },
    prevHandler() {
      if (this.siema) {
        if (this.siema.currentSlide === 0) {
          this.siema.goTo(this.fileList.length - 1);
        } else {
          this.siema.prev();
        }
      }
    },
    nextHandler() {
      if (this.siema) {
        if (this.siema.currentSlide === (this.fileList.length - 1)) {
          this.siema.goTo(0);
        } else {
          this.siema.next();
        }
      }
    },
    previewImageHandler(index) {
      this.previewMultipleImages = {
        activeIndex: index,
        list: this.fileList
      };
      this.$refs.previewMultipleImagesDialog.show();
    },
    deleteFileByIndex(index) {
      this.deleteFile(index);
    }
  }
}
</script>
<style lang="scss" scoped>
.my-carousel-container {
  display: inline-block;
  position: relative;
  overflow: hidden;
  &.default {
    padding: 0 30px;
    .page {
      right: 40px;
    }
  }
  .siema {
    .siema-item {
      position: relative;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      .file-delete-btn {
        display: none;
        position: absolute;
        top: 5px;
        right: 5px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        .svg-icon {
          width: 16px;
          height: 16px;
        }
        .file-delete {
          display: block;
        }
        .file-delete-hover {
          display: none;
        }
        &:hover {
          .file-delete {
            display: none;
          }
          .file-delete-hover {
            display: block;
          }
        }
      }
      &:hover {
        .file-delete-btn {
          display: block;
        }
      }
    }
  }
  .prev {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    .svg-icon {
      width: 22px;
      height: 22px;
    }
    .svg-icon-prev_btn {
      display: block;
    }
    .svg-icon-prev_btn_hover {
      display: none;
    }
    &:hover {
      .svg-icon-prev_btn {
        display: none;
      }
      .svg-icon-prev_btn_hover {
        display: block;
      }
    }
  }
  .next {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    .svg-icon {
      width: 22px;
      height: 22px;
    }
    .svg-icon-next_btn {
      display: block;
    }
    .svg-icon-next_btn_hover {
      display: none;
    }
    &:hover {
      .svg-icon-next_btn {
        display: none;
      }
      .svg-icon-next_btn_hover {
        display: block;
      }
    }
  }
  .page {
    position: absolute;
    right: 30px;
    bottom: 6px;
    font-size: 12px;
    color: #fff;
  }
}
</style>

