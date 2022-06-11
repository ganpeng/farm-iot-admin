<template>
  <div class="video_box">
    <video v-if="videoObj.fileFormat === 'hls'" id="videoSelf" controls></video>
    <video v-else ref="videoPlayer" class="video-js" autoplay controls>
      <source :src="url" type="video/mp4" />
    </video>
  </div>
</template>

<script>
import videojs from "video.js";
import Hls from "hls.js";

export default {
  name: "VideoPlayer",
  props: {
    url: String,
    type: String,
    videoObj: Object
  },
  data() {
    return {
      player: null
    };
  },
  watch: {
    url(url) {
      this.hls.destroy();
      this.createHls();
      this.videoSelf.play();
    }
  },
  mounted() {
    let that = this;
    // this.createVideoPlayer();

    this.$nextTick(function() {
      if (Hls.isSupported()) {
        console.log("hello hls.js");
        this.videoSelf = document.getElementById("videoSelf");
        this.createHls();
      }
      this.videoSelf.play();
    });
  },
  methods: {
    createHls() {
      let that = this;
      this.hls = new Hls();
      // bind them together
      this.hls.attachMedia(this.videoSelf);
      // MEDIA_ATTACHED event is fired by hls object once MediaSource is ready
      this.hls.on(Hls.Events.MEDIA_ATTACHED, function() {
        console.log("video and hls.js are now bound together !");
        that.hls.loadSource(that.url);
        that.hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
          console.log(
            "manifest loaded, found " + data.levels.length + " quality level"
          );
        });
      });
      this.hls.on(Hls.Events.ERROR, function(event, data) {
        var errorType = data.type;
        var errorDetails = data.details;
        var errorFatal = data.fatal;

        switch (data.details) {
          case Hls.ErrorDetails.FRAG_LOAD_ERROR:
            console.log("FRAG_LOAD_ERROR error");
            break;
          case Hls.ErrorDetails.NETWORK_ERROR:
            console.log("NETWORK_ERROR error");
            that.startLoad();
            break;
          case Hls.ErrorDetails.MEDIA_ERROR:
            console.log("MEDIA_ERROR error");
            that.hls.recoverMediaError();
            break;
          case Hls.ErrorDetails.OTHER_ERROR:
            console.log("OTHER_ERROR error");
            break;
          default:
            that.hls.destroy();
            break;
        }
      });
    },
    createVideoPlayer() {
      this.player = videojs(
        this.$refs.videoPlayer,
        {
          //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          controls: true,
          //自动播放属性,muted:静音播放
          autoplay: "muted",
          preload: "auto",
          //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          width: "568px",
          //设置视频播放器的显示高度（以像素为单位）
          height: "320px"
        },
        function onPlayerReady() {
          console.log("onPlayerReady", this);
        }
      );
    }
  },
  beforeDestroy() {
    if(this.hls) {
      this.hls.destroy();
    }
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>
<style lang="scss">
.video_box {
  width: 568px;
  height: 320px;
  border-radius: 2px;
  > div {
    width: 568px;
    height: 320px;
    border-radius: 2px;
  }
}
</style>
