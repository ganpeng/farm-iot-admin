<template>
  <div class="live-trace-container">
    <div v-if="cameraList.length > 0" class="live-trace-wrapper">
      <div class="left-camera-list-container">
        <el-date-picker class="my-date-picker" :clearable="false" v-model="day" @input="dateChangeHandler($event)" type="date" value-format="timestamp" format="yyyy-MM-dd"></el-date-picker>
        <div class="camera-list-wrapper">
          <ul v-if="cameraList.length > 0" class="camera-list">
            <li
              @click="changeActiveCameraHandler(index)"
              v-for="(camera, index) in cameraList" :key="index"
              :class="['camera-item', activeCameraIndex === index && 'active']">
              {{camera.deviceName}}
            </li>
          </ul>
          <no-data v-else></no-data>
        </div>
      </div>
      <div class="middle-video-player">
        <div v-if="recordList.length > 0" class="video-player-wrapper">
          <div class="video-container">
            <video-player v-if="recordUrl" :playUrl="recordUrl"></video-player>
            <no-data v-else></no-data>
          </div>
          <div class="timeline-wrapper">
            <div v-dragscroll class="timeline">
              <ul class="list" :style="`width: ${width}px;`">
                <li v-for="(record, index) in recordList" :key="index" :style="listItemStyle(record)" class="list-item">
                  <div @click="changeVideoPlayUrl(index)" :class="['play-btn', activeRecordIndex === index && 'active']">
                    <svg-icon class-name="video_play_icon" icon-class="video_play_icon"></svg-icon>
                    <svg-icon class-name="video_play_hover_icon" icon-class="video_play_hover_icon"></svg-icon>
                    <div class="time">{{record.startTime | formatDate(`yyyy-MM-DD HH:MM`)}}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <no-data v-else></no-data>
      </div>
    </div>
    <no-data v-else></no-data>
  </div>
</template>
<script>
import _ from 'lodash';
import VideoPlayer from "@/components/VideoPlayer";
export default {
  name: 'LiveTrace',
  components: {VideoPlayer},
  props: {
    goods: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      width: 650,
      day: new Date().getTime(),
      activeRecordIndex: 0,
      recordList: [],
      cameraList: [],
      activeCameraIndex: 0
    };
  },
  watch: {
    goods() {
      this.getCameraListByFarmId();
    }
  },
  created() {
    this.getCameraListByFarmId();
  },
  computed: {
    listItemStyle() {
      return (record) => {
        let {startTime, endTime} = record;
        let ms = endTime - startTime;
        let width = ms * 10 / (1000 * 60);
        return `width: ${width}px;`;
      };
    },
    recordUrl() {
      let recordUrl = _.get(this.recordList, `${this.activeRecordIndex}.url`);
      return recordUrl;
    },
    selectedRecordCameraStreamId() {
      return _.get(this.cameraList, `${this.activeCameraIndex}.streamId`);
    }
  },
  methods: {
    getCameraListByFarmId() {
      let {farmId} = this.goods;
      if (farmId) {
        this.$service.getCameraListByFarmId({farmId, pageSize: 1000})
          .then((res) => {
            if (res && res.code === 0) {
              let cameraList = _.get(res.data, `list`) || [];
              this.cameraList = cameraList;
              this.getCameraRecordList();
            }
          }).catch((err) => {
            console.log(err);
          });
      }
    },
    // 回看请求数据
    async getCameraRecordList() {
      try {
        //  `206296998843061418-cn-qingdao`
        if (this.selectedRecordCameraStreamId) {
          let params = Object.assign({}, {streamId: this.selectedRecordCameraStreamId, pageNum: 0, pageSize: 10000}, this.getStartEndDateTime(this.day))
          let res = await this.$service.getCameraRecordList(params);
          if (res && res.code === 0) {
            let resList = _.get(res.data, 'list') || [];
            let recordList = resList.map((item) => {
              item.startTime = new Date(item.startTime).getTime();
              item.endTime = new Date(item.endTime).getTime();
              return item;
            });
            this.recordList = recordList;
            if (this.recordList.length >= 2) {
              let startTime = _.get(this.recordList, `0.startTime`);
              let endTime = _.get(this.recordList, `${this.recordList.length - 1}.endTime`);
              let ms = endTime - startTime;
              let width = ms * 10 / (1000 * 60);
              this.width = width;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    changeVideoPlayUrl(index) {
      this.activeRecordIndex = index;
    },
    changeActiveCameraHandler(index) {
      this.activeCameraIndex = index;
      this.activeRecordIndex = 0;
      this.getCameraRecordList();
    },
    dateChangeHandler() {
      this.activeRecordIndex = 0;
      this.getCameraRecordList();
    },
    getStartEndDateTime(dateTime) {
      let today = new Date(dateTime);
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      let dayStart = `${year}-${month}-${day} 00:00:00`;
      let dayEnd = `${year}-${month}-${day} 23:59:59`;
      let dateStart = new Date(dayStart);
      let dateEnd = new Date(dayEnd);
      let startTime = dateStart.getTime();
      let endTime = dateEnd.getTime();
      return { startTime, endTime };
    }
  }
}
</script>
<style lang="scss" scoped>
.live-trace-container {
  position: relative;
  width: 100%;
  height: 600px;
  .live-trace-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 600px;
  }
  .left-camera-list-container {
    width: 320px;
    height: 466px;
    margin-right: 70px;
    .camera-list-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      margin-top: 20px;
      background-color: #233350;
    }
    .camera-list {
      width: 320px;
      height: 366px;
      overflow: hidden;
      overflow-y: scroll;
      .camera-item {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #00DCFF;
        font-size: 18px;
        cursor: pointer;
        background-color: transparent;
        &.active {
          color: #FFF;
          background-color: #1A8DD2;
        }
      }
    }
  }
  .middle-video-player {
    position: relative;
    width: 650px;
    height: 466px;
    .video-container {
      position: relative;
      width: 650px;
      height: 366px;
    }
    .timeline-wrapper {
      height: 80px;
      margin-top: 20px;
      .timeline {
        display: flex;
        align-items: flex-end;
        width: 650px;
        height: 80px;
        overflow-x: scroll;
        cursor: pointer;
        &::-webkit-scrollbar {
          display: none;
        }
        .list {
          display: flex;
          background-color: #10254B;
          .list-item {
            position: relative;
            height: 26px;
            background-color: #1A8DD2;
            margin-right: 10px;
            .play-btn {
              position: absolute;
              top: -30px;
              left: 50%;
              width: 22px;
              height: 16px;
              transform: translateX(-50%);
              .svg-icon {
                width: 22px;
                height: 16px;
              }
              .video_play_icon {
                display: block;
              }
              .video_play_hover_icon {
                display: none;
              }
              .time {
                display: none;
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                color: #FFF;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
              }
              &.active,
              &:hover {
                .video_play_icon {
                  display: none;
                }
                .video_play_hover_icon {
                  display: block;
                }
                .time {
                  display: block;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>