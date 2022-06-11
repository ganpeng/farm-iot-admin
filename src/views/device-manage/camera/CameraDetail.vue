<template>
  <div id="camera-detail-container">
    <div id="block-container">
      <!-- 基本信息 -->
      <div id="basic-info-block">
        <div class="header">
          <div class="title">
            <svg-icon icon-class="device_info"></svg-icon>
            设备信息
          </div>
          <div class="status-container">
            <div class="status-block">
              <label v-if="cameraInfo.snapshotStatus === 'ON'"><i class="online">•</i>截图开启</label>
              <label v-if="cameraInfo.snapshotStatus === 'OFF'"><i class="offline">•</i>截图关闭</label>
            </div>
            <div class="status-block">
              <label v-if="cameraInfo.deviceStatus === 'ONLINE'"><i class="online">•</i>在线</label>
              <label v-if="cameraInfo.deviceStatus === 'OFFLINE'"><i class="offline">•</i>离线</label>
              <label v-if="cameraInfo.deviceStatus === 'UNACTIVE'"><i class="UNACTIVE">•</i>未激活</label>
              <label><i :class="{'active':cameraInfo.pullable}">•</i>{{cameraInfo.pullable ? '接收' : '拒收'}}</label>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="block">
            <div>
              <span>名称</span>
              <label>{{cameraInfo.deviceName}}</label>
            </div>
            <div>
              <span>经纬度</span>
              <label v-if="cameraInfo.latitude || cameraInfo.longitude">
                E{{cameraInfo.longitude}}
                N{{cameraInfo.latitude}}</label>
              <i @click="selectMapPositionVisible = true" v-if="cameraInfo.latitude || cameraInfo.longitude">查看</i>
              <label v-else>未设置</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>接入类型</span>
              <label>{{deviceType(cameraInfo.deviceType)}}</label>
            </div>
            <div>
              <span>所属农场</span>
              <label>{{cameraInfo.farmName}}</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>设备类型</span>
              <label>{{cameraType(cameraInfo.cameraType)}}</label>
            </div>
            <div>
              <span>所属地块</span>
              <label>{{cameraInfo.landName || '未设置'}}</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>streamname</span>
              <label>{{cameraInfo.streamName}}</label>
            </div>
            <div>
              <span>厂商</span>
              <label>{{cameraInfo.cameraVendor | getCameraVendorName}}</label>
            </div>
          </div>
          <div class="block">
            <div>
              <span>devicename</span>
              <label>{{cameraInfo.nationalStandardId}}</label>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
      <!-- 运维信息 -->
      <div id="manager-info-block">
        <div class="header">
          <svg-icon icon-class="manager_info"></svg-icon>
          <label>运维负责人</label>
        </div>
        <div class="content">
          <div>
            <span>所属公司</span>
            <label>{{cameraInfo.managerCompany || '未设置'}}</label>
          </div>
          <div>
            <span>员工姓名</span>
            <label>{{cameraInfo.manager || '未设置'}}</label>
          </div>
          <div>
            <span>员工电话</span>
            <label>{{cameraInfo.managerPhone || '未设置'}}</label>
          </div>
        </div>
      </div>
    </div>
    <!-- 数据信息 -->
    <div id="data-info-block">
      <div class="header">
        <svg-icon icon-class="data_info"></svg-icon>
        <label>数据信息</label>
      </div>
      <div class="content">
        <div class="content-header">
          <div class="switch-btn-block">
            <div :class="{'active':activeIndex === 0}" @click="switchTab(0)">实时</div>
            <div :class="{'active':activeIndex === 1}" @click="switchTab(1)">延时摄影</div>
            <div :class="{'active':activeIndex === 2}" @click="switchTab(2)">截图</div>
            <div :class="{'active':activeIndex === 3}" @click="switchTab(3)">监控回放</div>
          </div>
          <div class="filters-container" v-show="activeIndex === 2">
            <div class="filter-form">
              <el-date-picker
                v-model="createRangeTime"
                @change="getCameraScreenshotList(true)"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :default-time="['00:00:00', '23:59:59']"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <!-- 监控回放视频事件选择 -->
          <div class="filters-container" v-show="activeIndex === 3">
            <div class="filter-form">
              <el-date-picker
                v-model="playBackRange"
                @change="getPlayBackVideoList"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :default-time="['00:00:00', '23:59:59']"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="data-block">
          <!--  实时-->
          <div id="real-time-block" v-show="activeIndex === 0">
          <VideoPlayer :cameraInfo="cameraInfo"></VideoPlayer>
            <div v-if="parseInt(cameraInfo.cameraType) === 2" class="control-block">
              <div>
                <span @click="moveCameraPosition('PAN_WEST_TILE_NORTH')">
                  <svg-icon icon-class="ptz_1_0"></svg-icon>
                  <svg-icon icon-class="ptz_1_1"></svg-icon>
                </span>
                <span @click="moveCameraPosition('TILT_NORTH')">
                  <svg-icon icon-class="ptz_2_0"></svg-icon>
                  <svg-icon icon-class="ptz_2_1"></svg-icon>
                </span>
                <span @click="moveCameraPosition('PAN_EAST_TILE_NORTH')">
                  <svg-icon icon-class="ptz_3_0"></svg-icon>
                  <svg-icon icon-class="ptz_3_1"></svg-icon>
                </span>
              </div>
              <div>
                <span @click="moveCameraPosition('PAN_WEST')">
                  <svg-icon icon-class="ptz_4_0"></svg-icon>
                  <svg-icon icon-class="ptz_4_1"></svg-icon>
                </span>
                <span @click="moveCameraPosition('PAN_EAST')">
                  <svg-icon icon-class="ptz_5_0"></svg-icon>
                  <svg-icon icon-class="ptz_5_1"></svg-icon>
                </span>
              </div>
              <div>
                <span @click="moveCameraPosition('PAN_WEST_TILE_SOUTH')">
                  <svg-icon icon-class="ptz_6_0"></svg-icon>
                  <svg-icon icon-class="ptz_6_1"></svg-icon>
                </span>
                <span @click="moveCameraPosition('TILT_SOUTH')">
                  <svg-icon icon-class="ptz_7_0"></svg-icon>
                  <svg-icon icon-class="ptz_7_1"></svg-icon>
                </span>
                <span @click="moveCameraPosition('PAN_EAST_TILE_SOUTH')">
                  <svg-icon icon-class="ptz_8_0"></svg-icon>
                  <svg-icon icon-class="ptz_8_1"></svg-icon>
                </span>
              </div>
            </div>
          </div>
          <!-- 延时摄影 -->
          <div id="video-block" v-show="activeIndex === 1">
            <div class="empty-block video-empty-block" v-show="videoList.length === 0">
              <div class="empty-sign">
                <svg-icon icon-class="empty_notice"></svg-icon>
                <label>暂无数据</label>
              </div>
              <div>
                <span @click="createCurrentMonthVideo">生成当月视频</span>
                <label class="download-notice">注：当月视频需要实时生成，可能耗时较长，请耐心等候</label>
              </div>
            </div>
            <div class="view-block" v-show="videoList.length !== 0">
              <video :src="videoList[currentVideoIndex] && videoList[currentVideoIndex].url" autoplay controls></video>
              <div class="download">
                <a :href="videoList[currentVideoIndex] && videoList[currentVideoIndex].url">
                  <svg-icon icon-class="download_resource_default"></svg-icon>
                  <svg-icon icon-class="download_resource_active"></svg-icon>
                </a>
              </div>
              <div class="download-all video-section" @click="createCurrentMonthVideo">生成当月视频</div>
              <label class="download-notice">注：当月视频需要实时生成，可能耗时较长，请耐心等候</label>
            </div>
            <div class="video-slide-block" v-show="videoList.length !== 0">
              <div class="device-pre" @click="clickVideoPreButton" v-show="videoList.length > 5">
                <svg-icon icon-class="device_pre"></svg-icon>
                <svg-icon icon-class="device_pre_active"></svg-icon>
              </div>
              <carousel
                :per-page="5"
                :navigationEnabled="true"
                :paginationEnabled="false">
                <slide v-for="(item, index) in videoList" :key="item.timestamp">
                  <video :src="item.url"
                         :class="{'active':currentVideoIndex === index}"
                         @click="selectVideo(index)">
                  </video>
                  <div class="download">
                    <a :href="item.url">
                      <svg-icon icon-class="download_resource_default"></svg-icon>
                      <svg-icon icon-class="download_resource_active"></svg-icon>
                    </a>
                  </div>
                  <label>{{item.createdAt | formatDate('yyyy/MM/DD-HH:mm')}}.mp4</label>
                </slide>
              </carousel>
              <div class="device-next"
                   @click="clickVideoNextButton"
                   v-show="videoList.length > 5">
                <svg-icon icon-class="device_next"></svg-icon>
                <svg-icon icon-class="device_next_active"></svg-icon>
              </div>
            </div>
          </div>
          <!-- 截图 -->
          <div id="screenshot-block" v-show="activeIndex === 2">
            <div class="empty-block screenshot-empty" v-show="imageList.length === 0">
              <svg-icon icon-class="empty_notice"></svg-icon>
              <label>暂无数据</label>
            </div>
            <div class="view-block" v-show="imageList.length !== 0">
              <img :src="imageList[currentScreenshotIndex] && imageList[currentScreenshotIndex].value">
              <div class="download image-download">
                <a :href="imageList[currentScreenshotIndex] && imageList[currentScreenshotIndex].value">
                  <svg-icon icon-class="download_resource_default"></svg-icon>
                  <svg-icon icon-class="download_resource_active"></svg-icon>
                </a>
              </div>
              <div class="image-index">{{currentScreenshotIndex + 1}}/{{imageList.length}} {{`共 ${imageTotal} 张`}}</div>
              <div class="download-all-image">
                <div class="download-button" @click="downloadAllCameraScreenshots">全部下载</div>
                <el-tooltip class="download-max" effect="dark" content="截图每15分钟生成一张，单次最多支持下载7天的数据。" placement="right">
                  <el-button class="icon-button">
                    i
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div class="image-slide-block" v-show="imageList.length !== 0">
              <div class="device-pre" @click="clickScreenshotPreButton">
                <svg-icon icon-class="device_pre"></svg-icon>
                <svg-icon icon-class="device_pre_active"></svg-icon>
              </div>
              <carousel
                @navigation-click="pageSlideDown"
                :per-page="5"
                :navigationEnabled="true"
                :paginationEnabled="false">
                <slide v-for="(item, index) in imageList" :key="item.timestamp">
                  <img :src="item.value" :class="{'active':currentScreenshotIndex === index}"
                       @click="selectImage(index)">
                  <div class="download">
                    <a :href="item.value">
                      <svg-icon icon-class="download_resource_default"></svg-icon>
                      <svg-icon icon-class="download_resource_active"></svg-icon>
                    </a>
                  </div>
                  <label>{{item.timestamp | formatDate('yyyy/MM/DD-HH:mm')}}.jpg</label>
                </slide>
              </carousel>
              <div class="device-next" @click="clickScreenshotNextButton">
                <svg-icon icon-class="device_next"></svg-icon>
                <svg-icon icon-class="device_next_active"></svg-icon>
              </div>
            </div>
          </div>
          <!-- 监控回放视频区域 -->
          <div id="playback-block" v-show="activeIndex === 3">
            <!-- 数据为空 -->
            <div class="empty-block video-empty-block" v-show="playBackVideoList.length === 0">
              <div class="empty-sign">
                <svg-icon icon-class="empty_notice"></svg-icon>
                <label>暂无数据</label>
              </div>
            </div>
            <!-- 视频区域 播放 下载 -->
            <div class="view-block" v-show="playBackVideoList.length !== 0">
              <div v-if="playBackVideoList[playBackIndex] && playBackVideoList[playBackIndex].url">
                  <VideoPlayerBack :url="playBackCurrentVideoUrl" :videoObj="playBackVideoList[playBackIndex]" :type="playBackVideoList[playBackIndex].fileFormat"></VideoPlayerBack>
              </div>
              <div class="download">
                <!-- <a href="javascript: void(0)" @click="downLoadVideoRecord(playBackVideoList[playBackIndex].url)">
                  <svg-icon icon-class="download_resource_default"></svg-icon>
                  <svg-icon icon-class="download_resource_active"></svg-icon>
                </a>-->
              </div>
              <div class="image-index">{{playBackIndex + 1}}/{{playBackVideoList.length}}</div>
            </div>
            <!-- 列表 -->
            <div class="video-slide-block" v-show="playBackVideoList.length !== 0">
              <!-- 视频数>5 左侧箭头 -->
              <div class="device-pre" @click="playBackPre" v-show="playBackVideoList.length > 5">
                <svg-icon icon-class="device_pre"></svg-icon>
                <svg-icon icon-class="device_pre_active"></svg-icon>
              </div>
              <carousel
                @navigation-click="getPlayBackNextPage"
                :per-page="5"
                :navigationEnabled="true"
                :paginationEnabled="false">
                <slide v-for="(item, index) in playBackVideoList" :key="index">
                  <img src="./img/play.png" :class="{'active': playBackIndex === index}" @click="selectPlayBackVideo(index)" />
                  <div class="download">
                    <a href="javascript: void(0)" @click="downLoadVideoRecord(playBackVideoList[playBackIndex])">
                      <svg-icon icon-class="download_resource_default"></svg-icon>
                      <svg-icon icon-class="download_resource_active"></svg-icon>
                    </a>
                  </div>
                  <label class="timeFormate">{{item.startTime | formatDate('yyyy/MM/DD-HH:mm')}}{{item.fileFormat === "mp4" ? ".mp4" : ".m3u8"}}</label>
                </slide>
              </carousel>
              <!-- 视频>5 右侧箭头 -->
              <div class="device-next"
                   @click="playBackNext"
                   v-show="playBackVideoList.length > 5">
                <svg-icon icon-class="device_next"></svg-icon>
                <svg-icon icon-class="device_next_active"></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button v-if="$route.params.status === 'normal'"
                 class="btn-style-two edit-bottom-btn"
                 type="primary"
                 @click="editCamera">编辑
      </el-button>
      <el-button class="btn-style-three" @click="toCameraList" plain>返回列表</el-button>
    </div>
    <el-dialog
      title="查看摄像头坐标"
      :visible.sync="selectMapPositionVisible"
      :close-on-click-modal=false
      custom-class="normal-dialog"
      top="13vh"
      width="80%">
      <select-map-position
        ref="map"
        :move="false"
        :mapCenter="[cameraInfo.longitude, cameraInfo.latitude]"
        v-if="selectMapPositionVisible">
      </select-map-position>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectMapPositionVisible = false" class="modify-btn">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import video from "video.js";
  import JSZip from 'jszip';
  import FileSaver from "file-saver";
  import 'video.js/dist/video-js.css'
  import {Carousel, Slide} from 'vue-carousel';
  import SelectMapPosition from "../SelectMapPosition";
  import util from "../../../util/extend";
  import VideoPlayer from "./components/VideoPlayer"
  import VideoPlayerBack from "./components/VideoPlayerBack"

  export default {
    name: "CameraDetail",
    components: {
      SelectMapPosition,
      Carousel,
      VideoPlayer,
      VideoPlayerBack,
      Slide
    },
    data() {
      return {
        // myPlayer: {},
        videoList: [],
        currentVideoIndex: 0,
        screenshotPageNum: 0,
        currentScreenshotIndex: 0,
        cameraInfo: {},
        selectMapPositionVisible: false,
        activeIndex: 0,
        imageList: [],
        imageTotal: 0,
        allImageList: [],
        playBackVideoList: [],// 监控回放视频列表
        playBackIndex: 0, // 回放视频当前播放的index
        playBackVideoPage: 0, // 回放视频当前页数
        playBackCurrentVideoUrl: '',
        playBackRange: [Date.now() - 24 * 60 * 60 * 1000, Date.now()], // 回放视频默认的时间范围
        createRangeTime: [Date.now() - 24 * 60 * 60 * 1000, Date.now()]
      }
    },
    mounted() {
      this.init();
      this.downLoadList = [];
    },
    // beforeDestroy() {
    //   // 销毁video
    //   this.myPlayer.dispose();
    // },
    computed: {
      deviceType() {
        return (deviceType) => {
            switch (deviceType) {
            case 'NVR':
              return '平台NVR';
            case 'CAMERA':
              return '摄像头';
            default:
              return '未设置';
          };
        }
      },
      cameraType() {
        return (cameraType) => {
          switch (parseInt(cameraType)) {
            case 1:
              return '枪机';
            case 2:
              return '球机';
            case 6:
              return '全景';
            default:
              return '/';
          }
        };
      }
    },
    methods: {
      init() {
        this.$util.toggleFixedBtnContainer();
        this.getCameraDetail().then(() => {
          this.getCameraScreenshotList(true);
          this.getCameraVideoList();
          this.getPlayBackVideoList(); // 获取回放视频列表
        });
      },
      getCameraDetail() {
        return this.$service.getCameraDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            this.cameraInfo = response.data;
            this.initVideo();
          }
        });
      },
      /**
       * 获取回放视频列表
       * isFirstPage 是否是第一页 默认true第一页
       */
      getPlayBackVideoList(isFirstPage = true) {
        if(isFirstPage) {
          this.playBackVideoPage = 0;
        } else {
          this.playBackVideoPage++;
        }
        let params = {
          streamId: this.cameraInfo.streamId,
          startTime: this.playBackRange[0],
          endTime: this.playBackRange[1],
          pageNum: this.playBackVideoPage,
          pageSize: 10,
        };
        this.$service.getPlayBackList(params).then(response => {
          if(response && response.code === 0) {
            // response.data 没有数据返回null，获取length属性时会报错
            if(response.data && response.data.list && response.data.list.length > 0) {
              if(isFirstPage) {
                this.playBackVideoList = response.data.list;
                this.playBackIndex = 0;
                this.playBackCurrentVideoUrl = this.httpToHttps(this.playBackVideoList[this.playBackIndex].url);
              } else {
                this.playBackVideoList = this.playBackVideoList.concat(response.data.list);
              }
            }
          }
        })
      },
      downLoadVideoRecord(videoObject) {
        let url = videoObject.url;
        let httpReg = /^http:\/\//;
        this.downLoadFileName = `${util.formatDate(new Date(videoObject.startTime), 'yyyy/MM/DD-HH:mm')}`;
        if(httpReg.test(url)) {
          url = url.replace(httpReg, 'https://');
          videoObject.url = url;
        }
        // mp4 hls
        if(videoObject.fileFormat === 'mp4') {
          this.downLoadMP4(url);
        } else if(videoObject.fileFormat === 'hls') {
          this.downLoadHLS(videoObject);
        } else {
          console.log("格式不支持");
        }
      },
      downLoadMP4(url) {
        let that = this;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
          if (xhr.status === 200) {
            // 获取文件blob数据并保存
            that.saveAs(xhr.response, `${this.downLoadFileName}.mp4`, url);
          }
        };

        xhr.send();
        this.$message.success('正在下载，视频较大请耐心等待');
      },
      downLoadHLS(videoObject) {
        let key = new Date(videoObject.startTime).getTime();
        localStorage.setItem(key, JSON.stringify({fileName: this.downLoadFileName, fileUrl: videoObject.url}));
        let routeData = this.$router.resolve({ path: '/download/video', query: {  s: key } });
        window.open(routeData.href, '_blank');
      },
    /**
     * URL方式保存文件到本地
     * @param data 文件的blob数据
     * @param name 文件名
     */
    saveAs(data, name, url) {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var save_link = document.createElement('a')
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        save_link.click();
        this.$message.success(`${name}下载成功！`);
        let index = this.downLoadList.indexOf(url);
        if(index !== -1) {
          this.downLoadList.splice(index, 1);
        }

    },

      // 生成当月视频
      createCurrentMonthVideo() {
        this.$service.createCameraCurrentMonthVideo({streamName: this.cameraInfo.streamName}).then(response => {
          if (response && response.code === 0) {
            this.$message.success('正在生成当月视频，请耐心等待');
          }
        })
      },
      initVideo() {
        let tag = false;
        let that = this;
        // let myPlayer = video('my-player', {
        //     //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        //     controls: true,
        //     //自动播放属性,muted:静音播放
        //     autoplay: 'muted',
        //     preload: "auto",
        //     //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        //     // video: {url: that.cameraInfo.playUrl1},
        //     width: "568px",
        //     //设置视频播放器的显示高度（以像素为单位）
        //     height: "320px"
        //   }, function onPlayerReady() {
        //   }
        // );
        // myPlayer.on('error', function () {     //请求数据时遇到错误
        //   if (that.cameraInfo.playUrl && tag) {
        //     // that.$message.warning('直播流异常，请刷新页面重试，或检查网络，您也可以联系运维人员查看问题');
        //   }
        // });
        // this.$nextTick(function () {
        //   myPlayer.src({
        //     src: that.cameraInfo.playUrl,
        //     type: 'application/x-mpegURL'
        //   });
        //   tag = true;
        // });
        // this.myPlayer = myPlayer;
      },
      // 下载全部截图
      downloadAllCameraScreenshots() {
        this.$service.getCameraScreenshotList({
          streamName: this.cameraInfo.streamName,
          pageNum: this.screenshotPageNum,
          pageSize: 10000,
          startedAt: this.createRangeTime[0],
          endedAt: this.createRangeTime[1]
        }).then(response => {
          if (response && response.code === 0) {
            this.$message.success('正在下载,请稍后');
            this.allImageList = response.data.list;
            // 限制下载数量672张
            if (this.allImageList.length > 672) {
              this.$message.warning('单次最多支持7天的数据下载，请重新选择')
            } else {
              this.zipDownloadFile();
            }
          }
        });
      },
      zipDownloadFile() {
        let that = this;
        //*****创建实例，zip是对象实例
        let zip = new JSZip();
        let file_name = 'pic.zip';
        let len = function (arr) {
          let l = 0;
          for (let key in arr) {
            l++;
          }
          return l;
        };
        for (let i = 0; i < this.allImageList.length; i++) {
          //对每一个图片链接获取base64的数据，并使用回调函数处理
          this.getBase64Image(that.allImageList[i], function (dataURL) {
            let imageTitle = that.allImageList[i].value.toString().split('.jpg')[0].split('/')[6];
            //对获取的图片base64数据进行处理
            let img_arr = dataURL.split(',');
            zip.file(imageTitle + '.jpg', img_arr[1], {base64: true});//根据base64数据在压缩包中生成jpg数据
            let ziplength = len(zip.files);
            if (ziplength == that.allImageList.length) {//当所有图片都已经生成打包并保存zip
              zip.generateAsync({type: "blob"}).then(function (content) {
                FileSaver.saveAs(content, file_name);
              });
            }
          });

        }
      },
      getBase64Image(images, callback) {
        let img = new Image();
        let canvas = document.createElement("canvas");
        img.setAttribute('crossorigin', 'anonymous');
        img.onload = function () {
          canvas.getContext("2d").drawImage(img, 0, 0, 640, 320);
          let dataURL = canvas.toDataURL();//使用canvas获取图片的base64数据
          callback ? callback(dataURL) : null; //调用回调函数
        };
        img.src = images.value;
      },
      selectImage(index) {
        this.currentScreenshotIndex = index;
      },
      selectVideo(index) {
        this.currentVideoIndex = index;
      },
      // 选择要播放的视频回放
      selectPlayBackVideo(index) {
        this.playBackIndex = index;
        this.playBackCurrentVideoUrl = this.httpToHttps(this.playBackVideoList[this.playBackIndex].url);
      },
      // http => https 解决跨域问题
      httpToHttps(url) {
        let httpReg = /^http:\/\//;
        if(httpReg.test(url)) {
          url = url.replace(httpReg, 'https://');
        }
        return url;
      },
      // 获取回放数据的下一页数据
      getPlayBackNextPage(e) {
        if (e === 'forward') {
          this.getPlayBackVideoList(false);
        }
      },
      // 回放视频向前翻页
      playBackPre() {
        this.$el.querySelector('#playback-block .VueCarousel-navigation-prev').click();
      },
      // 回放视频向后翻页
      playBackNext() {
        this.$el.querySelector('#playback-block .VueCarousel-navigation-next').click();
      },
      pageSlideDown(e) {
        if (e === 'forward') {
          this.getCameraScreenshotList();
        }
      },
      clickVideoPreButton() {
        this.$el.querySelector('#video-block .VueCarousel-navigation-prev').click();
      },
      clickVideoNextButton() {
        this.$el.querySelector('#video-block .VueCarousel-navigation-next').click();
      },
      clickScreenshotPreButton() {
        this.$el.querySelector('#screenshot-block .VueCarousel-navigation-prev').click();
      },
      clickScreenshotNextButton() {
        this.$el.querySelector('#screenshot-block .VueCarousel-navigation-next').click();
      },
      getCameraVideoList() {
        this.$service.getCameraVideoList({
          streamName: this.cameraInfo.streamName
        }).then(response => {
          if (response && response.code === 0) {
            this.videoList = response.data;
          }
        })
      },
      getCameraScreenshotList(isReset) {
        if (isReset) {
          this.screenshotPageNum = 0;
        } else {
          this.screenshotPageNum++
        }
        this.$service.getCameraScreenshotList({
          streamName: this.cameraInfo.streamName,
          pageNum: this.screenshotPageNum,
          pageSize: 10,
          startedAt: this.createRangeTime[0],
          endedAt: this.createRangeTime[1]
        }).then(response => {
          if (response && response.code === 0) {
            if (isReset) {
              this.imageList = response.data.list;
              this.imageTotal = response.data.total;
              this.currentScreenshotIndex = 0;
            } else {
              this.imageList = this.imageList.concat(response.data.list);
            }
          }
        })
      },
      switchTab(index) {
        this.activeIndex = index;
      },
      editCamera() {
        if (!this.$authority.isHasAuthority('admin:camera:edit')) {
          return;
        }
        this.$router.push({
          name: 'EditCamera',
          params: {id: this.$route.params.id}
        });
      },
      toCameraList() {
        if (!this.$authority.isHasAuthority('admin:camera:page')) {
          return;
        }
        this.$router.go(-1);
      },
      // 控制球机方向
      moveCameraPosition(position) {
        this.$service.controlCameraPosition({
          deviceId: this.cameraInfo.nationalStandardId,
          cameraMovement: position
        }).then(response => {
          if (response && response.code === 0) {
            this.$message.success('已调整，请稍后观看效果');
          }
        })
      },
    }
  }
</script>

<style lang="scss">
#playback-block .video-slide-block .VueCarousel-slide label.timeFormate {
  font-size: 12px;
}
  /* 截图 */
  #screenshot-block, #video-block, #playback-block {
    padding-top: 40px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .image-slide-block, .video-slide-block {
      display: flex;
      align-items: center;
      margin-top: 40px;
      width: 1124px;
      /* 轮播导航 */
      .device-pre {
        margin-right: 20px;
        width: 42px;
        height: 42px;
        cursor: pointer;
        &:hover {
          .svg-icon-device_pre {
            display: none;
          }
          .svg-icon-device_pre_active {
            display: block;
          }
        }
        .svg-icon {
          width: 42px;
          height: 42px;
        }
        .svg-icon-device_pre {
          display: block;
        }
        .svg-icon-device_pre_active {
          display: none;
        }
      }

      .device-next {
        margin-left: 20px;
        width: 42px;
        height: 42px;
        cursor: pointer;
        &:hover {
          .svg-icon-device_next {
            display: none;
          }
          .svg-icon-device_next_active {
            display: block;
          }
        }
        .svg-icon {
          width: 42px;
          height: 42px;
        }
        .svg-icon-device_next {
          display: block;
        }
        .svg-icon-device_next_active {
          display: none;
        }
      }

      .VueCarousel {
        width: 900px;

        .VueCarousel-navigation-prev, .VueCarousel-navigation-next {
          visibility: hidden;
        }
      }

      .VueCarousel-slide {
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        position: relative;
        height: 120px;

        img, video {
          width: 160px;
          height: 90px;
          cursor: pointer;
          border: 2px solid transparent;

          &:hover, &.active {
            border: 2px solid white;
          }
        }

        label {
          margin-top: 10px;
          text-align: left;
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
        }

        .download {
          position: absolute;
          cursor: pointer;
          bottom: 40px;
          right: 40px;

          a {
            display: block;
            width: 17px;
            height: 15px;
          }

          &:hover, &:focus {
            .svg-icon {
              &.svg-icon-download_resource_default {
                display: none;
              }

              &.svg-icon-download_resource_active {
                display: block;
              }
            }
          }

          .svg-icon {
            width: 17px;
            height: 15px;

            &.svg-icon-download_resource_default {
              display: block;
            }

            &.svg-icon-download_resource_active {
              display: none;
            }
          }
        }
      }
    }

    .view-block {
      display: flex;
      justify-content: center;
      position: relative;
      width: 858px;

      img, video {
        width: 568px;
        height: 320px;
        border-radius: 2px;
      }

      .image-index, .video-index {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 14px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }

      .download-all {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 78px;
        height: 30px;
        border-radius: 15px;
        border: 1px solid rgba(46, 171, 255, 1);
        font-size: 14px;
        font-weight: 400;
        color: rgba(46, 171, 255, 1);
        cursor: pointer;

        &.video-section {
          bottom: 71px;
          width: 100px;
        }

        &:hover {
          border: none;
          color: rgba(255, 255, 255, 1);
          background: rgba(15, 112, 243, 1);
        }
      }
      .download-all-image {
        position: absolute;
        right: 0;
        bottom: 50px;
        display: flex;
        height: 26px;
        justify-content: flex-end;
        align-items: center;

        .download-button {
          width: 78px;
          height: 30px;
          border-radius: 15px;
          border: 1px solid rgba(46, 171, 255, 1);
          font-size: 14px;
          font-weight: 400;
          color: rgba(46, 171, 255, 1);
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 8px;

          &:hover {
            border: none;
            color: rgba(255, 255, 255, 1);
            background: rgba(15, 112, 243, 1);
          }
        }
        .download-max {
          min-width: 10px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 20px;
          font-weight: 600;
          color: #202C41;
          background-color: #667288;
          border: none;
        }
      }

      .download-notice {
        position: absolute;
        cursor: pointer;
        bottom: 0px;
        right: 0px;
        width: 109px;
        height: 51px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
        line-height: 17px;
      }

      .download {
        position: absolute;
        cursor: pointer;
        bottom: 70px;
        right: 170px;
        &.image-download {
          bottom: 20px;
        }

        &:hover, &:focus {
          .svg-icon {
            &.svg-icon-download_resource_default {
              display: none;
            }

            &.svg-icon-download_resource_active {
              display: block;
            }
          }
        }

        .svg-icon {
          width: 33px;
          height: 30px;

          &.svg-icon-download_resource_default {
            display: block;
          }

          &.svg-icon-download_resource_active {
            display: none;
          }
        }
      }
    }
  }

</style>

<style scoped lang="scss">

  #camera-detail-container {
    margin: 20px;
  }

  /* 实时 */
  #real-time-block {
    padding-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .my-player-dimensions {
      height: 320px;
      width: 568px;
    }
    .control-block {
      position: relative;
      margin-left: 120px;
      width: 238px;
      height: 238px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      label {
        position: absolute;
        bottom: -37px;
        left: 42px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }

      div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        span {
          width: 70px;
          height: 70px;
          cursor: pointer;

          &:focus, &:hover {
            .svg-icon {
              width: 70px !important;
              height: 70px !important;

              &:first-child {
                display: none;
              }

              &:last-child {
                display: block;
              }
            }
          }

          .svg-icon {
            width: 70px !important;
            height: 70px !important;

            &:first-child {
              display: block;
            }

            &:last-child {
              display: none;
            }
          }
        }
      }
    }
  }

  /* 数据信息 */
  #data-info-block {
    margin-top: 20px;
    height: 740px;
    border-radius: 10px;
    background: rgba(32, 44, 65, 1);

    .content {
      .content-header {
        padding-right: 90px;
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .filters-container .filter-form {
          padding: 0;
        }
      }

      .switch-btn-block {
        display: flex;
        align-items: center;
        margin-left: 44px;

        div {
          margin-right: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 72px;
          height: 30px;
          border-radius: 4px;
          border: 1px solid rgba(62, 73, 94, 1);
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
          cursor: pointer;

          &.active, &:focus, &:hover {
            color: rgba(255, 255, 255, 1);
            background: rgba(38, 146, 255, 1);
          }
        }
      }
    }

    .header {
      display: flex;
      align-items: center;
      height: 64px;
      border-bottom: 1px solid rgba(62, 73, 94, 1);

      .svg-icon {
        margin-left: 20px;
        margin-right: 12px;
        height: 15px;
        width: 20px;
      }

      label {
        font-size: 16px;
        font-weight: 500;
        color: rgba(240, 240, 240, 1);
      }
    }
  }

  #block-container {
    display: flex;
    flex-direction: row;
  }

  /* 运维信息 */
  #manager-info-block {
    flex-grow: 1;
    margin-left: 20px;
    width: 404px;
    height: 203px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;

    .content {
      height: 140px;
      padding: 30px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      div {
        display: flex;
        align-items: center;

        span {
          margin-right: 20px;
          margin-left: 85px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
        }

        label {
          font-size: 14px;
          font-weight: 400;
          color: rgba(168, 171, 179, 1);
        }
      }

    }

    .header {
      display: flex;
      align-items: center;
      height: 62px;
      border-bottom: 1px solid rgba(62, 73, 94, 1);

      .svg-icon {
        margin-left: 20px;
        margin-right: 12px;
        height: 18px;
        width: 18px;
      }

      label {
        font-size: 16px;
        font-weight: 500;
        color: rgba(240, 240, 240, 1);
      }
    }
  }

  /*   基本信息 */
  #basic-info-block {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 700px;
    height: 203px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;

    .content {
      height: 140px;
      padding: 30px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .block {
        display: flex;
        align-items: center;

        div {
          display: flex;
          align-items: center;

          &:last-child {
            span {
              width: 60px;
            }

            label {
              width: auto;
            }
          }

          span {
            margin-right: 20px;
            text-align: right;
            width: 143px;
          }

          label {
            width: 200px;
          }

          i {
            margin-left: 20px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 400;
            color: rgba(46, 171, 255, 1);
          }
        }
      }
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 62px;
      border-bottom: 1px solid rgba(62, 73, 94, 1);
      .status-container {
        display: flex;
        align-items: center;
      }

      .title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        color: rgba(240, 240, 240, 1);

        .svg-icon {
          margin-left: 20px;
          margin-right: 12px;
          height: 18px;
          width: 18px;
        }
      }

      .status-block {
        display: flex;
        align-items: center;

        label {
          margin-right: 20px;
          display: flex;
          align-items: center;
          width: 80px;
          height: 32px;
          background: rgba(42, 57, 78, 1);
          border-radius: 4px;
          justify-content: center;

          i {
            margin-right: 4px;
            font-size: 14px;
            color: #EF9545;

            &.active {
              color: #4BB5FF;
            }

            &.offline {
              color: #F35151;
            }

            &.online {
              color: #7ED321;
            }

            &.UNACTIVE {
              color: #5E6B82;
            }
          }
        }
      }
    }
  }

  .empty-block {
    position: relative;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.screenshot-empty {
      width: 568px;
      height: 320px;
      background: rgba(41, 53, 74, 1);
      border-radius: 2px;
    }

    &.video-empty-block {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      .empty-sign {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 568px;
        height: 320px;
        background: rgba(41, 53, 74, 1);
        border-radius: 2px;
      }
      .download-notice {
        margin-left: 20px;
        display: block;
        width: 109px;
        height: 51px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        height: 30px;
        border-radius: 15px;
        border: 1px solid rgba(46, 171, 255, 1);
        font-size: 14px;
        font-weight: 400;
        color: rgba(46, 171, 255, 1);
        cursor: pointer;
        bottom: 71px;
        width: 100px;
        &:hover {
          border: none;
          color: rgba(255, 255, 255, 1);
          background: rgba(15, 112, 243, 1);
        }
      }

    }

    .svg-icon {
      width: 64px;
      height: 64px;
    }

    label {
      margin-top: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(159, 168, 184, 1);
    }
  }

  #real-time-block {
    .video-js {
      width: 568px;
      height: 320px;
    }
  }

</style>
