<template>
  <div class="my-video-carousel">
    <video-player :playUrl="recordUrl" videoType="video/mp4"></video-player>
    <span v-if="displayIndex > 0" @click="prevHandler" class="prev-btn">
      <svg-icon v-if="displayIndex !== 0" icon-class="prev_btn"></svg-icon>
      <svg-icon v-else icon-class="prev_btn_disabled"></svg-icon>
    </span>
    <span v-if="displayIndex < dataList.length - 1" @click="nextHandler" class="next-btn">
      <svg-icon
        v-if="displayIndex !== dataList.length - 1"
        icon-class="next_btn"
      ></svg-icon>
      <svg-icon v-else icon-class="next_btn_disabled"></svg-icon>
    </span>
    <div v-if="dataList.length > 0" class="page">
      {{ displayIndex + 1 }}/{{ dataList.length }}
    </div>
    <span @click="deleteVideo" class="file-delete-btn">
      <svg-icon class="file-delete" icon-class="file_delete"/>
      <svg-icon class="file-delete-hover" icon-class="file_delete_hover"/>
    </span>
  </div>
</template>
<script>
import _ from 'lodash';
import VideoPlayer from "@/components/VideoPlayer";
export default {
  name: "VideoCarousel",
  components: { VideoPlayer },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    deleteVideoByIndex: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      displayIndex: 0, // 当前展示的轮播图的索引
    };
  },
  computed: {
    recordUrl() {
      let url = _.get(this.dataList, `${this.displayIndex}`);
      return url;
    }
  },
  methods: {
    changeDisplayIndex(index) {
      this.displayIndex = index;
    },
    prevHandler() {
      if (this.displayIndex === 0) {
        this.displayIndex = this.dataList.length - 1;
      } else {
        this.displayIndex = this.displayIndex - 1;
      }
    },
    nextHandler() {
      if (this.displayIndex === this.dataList.length - 1) {
        this.displayIndex = 0;
      } else {
        this.displayIndex = this.displayIndex + 1;
      }
    },
    deleteVideo() {
      this.deleteVideoByIndex(this.displayIndex);
      this.displayIndex = 0;
    }
  },
};
</script>
<style scoped lang="scss">
.my-video-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .prev-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }
    .svg-icon {
      width: 20px;
      height: 20px;
    }
  }
  .next-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }
    .svg-icon {
      width: 20px;
      height: 20px;
    }
  }
  .page {
    position: absolute;
    bottom: 25px;
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
    z-index: 30;
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