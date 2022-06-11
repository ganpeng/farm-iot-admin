<template>
  <div class="tracing-info-container">
    <ul class="tracing-list">
      <li v-for="(tracing, index) in tracingList" :key="index" class="tracing-item">
        <div class="header">
          <div class="left">
            <span class="index">{{getIndex(index)}}</span>
            <div class="title">{{tracing.name}}</div>
          </div>
          <div class="right">{{tracing.date | formatDate('yyyy-MM-DD')}}</div>
        </div>
        <div class="desc">{{tracing.moreInfo}}</div>
        <div class="img-detail">
          <div
            v-for="(url, index) in tracing.imageUrl"
            :key="index"
            :style="bgImageStyle(url)" :class="['img', index === (tracing.imageUrl.length - 1) && 'no-mb']"></div>
          <ul class="detail-data-list">
            <li v-for="(detail, _index) in tracing.detailList" :key="_index" class="detail-data-item">
              <div class="detail-data-title">{{detail.title}}</div>
              <div class="detail-data-content">{{detail.content}}</div>
            </li>
          </ul>
        </div>
        <div v-if="tracing.videoUrl" class="video-container">
          <video-player :playUrl="tracing.videoUrl"></video-player>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import VideoPlayer from './VideoPlayer';
export default {
  name: 'TracingInfo',
  props: {
    tracingList: {
      type: Array,
      default: () => []
    }
  },
  components: {VideoPlayer},
  data() {
    return {};
  },
  computed: {
    getIndex() {
      return (index) => {
        let _index = index + 1;
        return _index < 10 ? `0${_index}` : _index;
      };
    },
    bgImageStyle() {
      return (url) => {
        return `background-image: url('${url}');`;
      };
    }
  }
}
</script>
<style lang="scss" scoped>
.tracing-info-container {
  background-color: #fff;
  width: 380px;
  padding: 20px;
  margin: 0 auto;
  .tracing-list {
    .tracing-item {
      margin-bottom: 10px;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 36px;
        .left {
          display: flex;
          align-items: center;
          .index {
            color: #FF8600;
            font-size: 18px;
            line-height: 22px;
          }
          .title {
            color: #222;
            font-size: 16px;
            line-height: 22px;
            margin-left: 10px;
          }
        }
        .right {
          color: #98A4AF;
          font-size: 12px;
        }
      }
      .desc {
        color: #777;
        font-size: 14px;
        line-height: 22px;
      }
      .img-detail {
        box-shadow: 0 2px 8px 0 rgba(184,200,227,0.5);
        border-radius: 10px;
        // padding-bottom: 15px;
        margin-bottom: 10px;
        .img {
          width: 100%;
          height: 194px;
          border-radius: 10px;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          background-position: center center;
          margin: 6px 0 10px 0;
          &.no-mb {
            margin-bottom: 0;
          }
        }
        .detail-data-list {
          padding: 0 15px;
          .detail-data-item {
            margin-bottom: 10px;
            .detail-data-title {
              color: #777;
              font-size: 14px;
              line-height: 18px;
            }
            .detail-data-content {
              color: #98A4AF;
              font-size: 12px;
              line-height: 18px;
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      .video-container {
        width: 100%;
        height: 194px;
        overflow: hidden;
      }
    }
    .tracing-item:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
