<template>
  <div>
    <video ref="videoPlayer" class="video-js" data-setup="{}"></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default {
  name: "VideoPlayer",
  props: {
    cameraInfo: Object
  },
  data() {
    return {
      player: null
    };
  },
  watch: {
    cameraInfo(cameraInfo) {
      this.player.src({
        src: cameraInfo.playUrl,
        type: "application/x-mpegURL"
      });
    }
  },
  mounted() {
    let that = this;
    this.options = {
      //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
      controls: true,
      //自动播放属性,muted:静音播放
      autoplay: "muted",
      preload: "auto",
      width: "568px",
      //设置视频播放器的显示高度（以像素为单位）
      height: "320px",
      liveui: true
    };
    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {
        console.log("onPlayerReady");
      }
    );
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>
