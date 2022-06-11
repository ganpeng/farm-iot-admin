<template>
  <video id="video-player" ref="videoPlayer" class="video-js"></video>
</template>
<script>
import videojs from "video.js";
import "video.js/dist/alt/video-js-cdn.min.css";
export default {
  name: "VideoPlayer",
  props: {
    playUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      player: null
    };
  },
  watch: {
    playUrl: function() {
      this.player.src({
        src: this.playUrl,
        type: 'video/mp4'
      });
    }
  },
  mounted() {
    this.init(this.playUrl);
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  methods: {
    async init(playUrl) {
      try {
        await this.$nextTick();
        let options = {
          autoplay: false,
          controls: true,
          language: 'zh',
          notSupportedMessage: '加载中，请稍后...',
          fluid: true,
          sources: [
            {
              src: playUrl,
              type: 'video/mp4'
            }
          ]
        };
        this.player = videojs(this.$refs.videoPlayer, options, () => {
          console.log("准备播放", this);
        });

        this.player.on('error', () => {
          // this.player.errorDisplay.close();
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
