<template>
  <div class="media-carousel-container">
    <div v-if="urlList.length > 0" class="video-player-wrapper">
      <div v-if="isVideo" class="video-wrapper">
        <video-player :playUrl="currentUrl"></video-player>
      </div>
      <div v-else class="img" @click="showImagePreview" :style="imageStyle"></div>
    </div>
    <div v-if="urlList.length > 1" @click="prevHandler" class="prev-btn">
      <svg-icon v-if="activeIndex !== 0" icon-class="prev_btn_hover"></svg-icon>
      <svg-icon v-else icon-class="prev_btn"></svg-icon>
    </div>
    <div v-if="urlList.length > 1" @click="nextHandler" class="next-btn">
      <svg-icon v-if="activeIndex !== (urlList.length - 1)" icon-class="next_btn_hover"></svg-icon>
      <svg-icon v-else icon-class="next_btn"></svg-icon>
    </div>
    <div v-if="urlList.length > 0" class="page">
      {{activeIndex + 1}}/{{urlList.length}}
    </div>
    <span v-if="canDelete" @click="deleteFileByIndex" class="file-delete-btn">
      <svg-icon class="file-delete" icon-class="file_delete"/>
      <svg-icon class="file-delete-hover" icon-class="file_delete_hover"/>
    </span>
    <image-preview ref="imagePreview"></image-preview>
  </div>
</template>
<script>
import VideoPlayer from '@/components/Mp4VideoPlayer';
import ImagePreview from '@/components/ImagePreview';
export default {
  name: 'Carousel',
  components: {VideoPlayer, ImagePreview},
  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    deleteFile: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  computed: {
    currentUrl() {
      return _.get(this.urlList, `${this.activeIndex}.fileUrl`);
    },
    isVideo() {
      let index = this.currentUrl.indexOf('.mp4?');
      return index >= 0;
    },
    imageStyle() {
      return `background-image: url(${this.currentUrl});`
    }
  },
  methods: {
    prevHandler() {
      if (this.activeIndex > 0) {
        this.activeIndex = this.activeIndex - 1;
      }
    },
    nextHandler() {
      if (this.activeIndex < this.urlList.length - 1) {
        this.activeIndex = this.activeIndex + 1;
      }
    },
    deleteFileByIndex() {
      this.deleteFile(this.activeIndex);
    },
    showImagePreview() {
      this.$refs.imagePreview.init([this.currentUrl], this.activeIndex);
    }
  }
}
</script>
<style lang="scss" scoped>
.media-carousel-container {
  position: relative;
  width: 400px;
  height: 240px;
  padding: 0 40px;
  .video-player-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .video-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    .img {
      width: 100%;
      height: 100%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
  .prev-btn {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    .svg-icon {
      width: 24px;
      height: 24px;
    }
  }
  .next-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    .svg-icon {
      width: 24px;
      height: 24px;
    }
  }
  .page {
    position: absolute;
    bottom: 15px;
    right: 15px;
    color: #fff;
    font-size: 14px;
  }
  .file-delete-btn {
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
}
</style>