<template>
  <div class="downLoad_page">
    <div class="logo_container">
      <div class="logo"></div>
      <div class="plant">
        <p>吉视农业物联网大数据平台</p>
        <span>管理系统</span>
      </div>
    </div>
    <div class="downLoad_container">
      <p class="file_name">文件名：{{downLoadFileName}}</p>
      <el-progress :stroke-width="26" :percentage="percentage"></el-progress>
      <p class="progress_tip" v-if="percentage == 100"><span class="icon success_icon"></span>下载成功！</p>
      <p class="progress_tip" v-else><span class="icon loading_icon"></span>正在下载，请稍后…</p>
      <p class="repeat_download">下载遇到问题？请<span @click="retryAll">点击重试</span></p>
    </div>
  </div>
</template>
<script>
import muxjs from '@/assets/js/mux-mp4.js';
import AESDecryptor from '@/assets/js/aes-decryptor.js'
export default {
  data() {
    return {
      percentage: 0,
      aesConf: { // AES 视频解密配置
        method: '', // 加密算法
        uri: '', // key 所在文件路径
        iv: '', // 偏移值
        key: '', // 秘钥
        decryptor: null, // 解码器对象
        stringToBuffer: function (str) {
          let val = ''
          for (let i = 0; i < str.length; i++) {
            if (val === '') {
              val = str.charCodeAt(i).toString(16)
            } else {
              val += ',' + str.charCodeAt(i).toString(16)
            }
          }
          // 将16进制转化为ArrayBuffer
          return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
          })).buffer
        },  
      },       
      downLoadFileName: "", // 下载文件名称
      downloadUrl: "", // 下载地址
      durationSecond: 0, // 视频持续时长
      tsUrlList: [], // ts URL数组
      finishList: [], // 下载完成项目
      downloadIndex: 0, // 当前下载片段
      mediaFileList: [], // 下载的媒体数组
      isGetMP4: false,
      finishNum: 0,
      errorNum: 0, // 错误数
    };
  },
  watch: {
    finishNum(val) {
      this.percentage = Number((Number(val) / this.tsUrlList.length * 100).toFixed(2));
    }
  },
  mounted() {
    window.addEventListener("beforeunload", (e) => this.removeLocalStorage());
    this.key = this.$route.query.s;
    let downloadObj = JSON.parse(localStorage.getItem(this.key));
    this.downLoadFileName = downloadObj.fileName;
    this.downloadUrl = downloadObj.fileUrl;
    this.downloadVideo();
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", (e) =>
      this.removeLocalStorage()
    );
  },
  methods: {
    // 删除本地存储
    removeLocalStorage() {
      localStorage.removeItem(this.key);
    },
    // 下载文件入口
    downloadVideo() {
      this.downLoadAjax({
        url: this.downloadUrl,
        success: (m3u8Str) => {
          this.tsUrlList = [];

          // 提取 ts 视频片段地址
          m3u8Str.split("\n").forEach((item) => {
            if (item.toUpperCase().indexOf("#EXTINF:") > -1) {
              // 计算视频总时长，设置 mp4 信息时使用
              this.durationSecond += parseFloat(item.split("#EXTINF:")[1]);
            }
            if (item.toLowerCase().indexOf(".ts") > -1) {
              this.tsUrlList.push(this.applyURL(item, this.downloadUrl));
              this.finishList.push({
                title: item,
                status: "",
              });
            }
          });

          // 检测视频 AES 加密
          if (m3u8Str.indexOf("#EXT-X-KEY") > -1) {
            this.aesConf.method = (m3u8Str.match(/(.*METHOD=([^,]+))/) || [
              "",
              "",
              "",
            ])[2];
            this.aesConf.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || [
              "",
              "",
              "",
            ])[2];
            this.aesConf.iv = (m3u8Str.match(/(.*IV=([^,]+))/) || [
              "",
              "",
              "",
            ])[2];
            this.aesConf.iv = this.aesConf.iv
              ? this.aesConf.stringToBuffer(this.aesConf.iv)
              : "";
            this.aesConf.uri = this.applyURL(this.aesConf.uri, this.downloadUrl);
            this.getAES();
          } else if (this.tsUrlList.length > 0) {
            // 如果视频没加密，则直接下载片段，否则先下载秘钥
            this.downloadTS();
          } else {
            this.$message.warning("资源为空，请查看链接是否有效");
          }
        },
        fail: () => {
          this.$message.warning("链接不正确，请查看链接是否有效");
        },
      });
    },
    // 重新下载所有错误片段
    retryAll() {
      if(this.errorNum == 0) {
        this.$message.warning("当前文件正在下载，请稍后...");
        return;
      }
      this.finishList.forEach((item) => { // 重置所有片段状态
        if (item.status === 'error') {
          item.status = ''
        }
      })
      this.errorNum = 0
      this.downloadIndex = 0
      this.downloadTS()
    },    
    // 获取AES配置
    getAES() {
      console.log('视频被 AES 加密，点击确认，进行视频解码')
      this.ajax({
        url: this.aesConf.uri,
        success: (key) => {
          this.aesConf.key = this.aesConf.stringToBuffer(key)
          this.aesConf.decryptor = new AESDecryptor()
          this.aesConf.decryptor.constructor()
          this.aesConf.decryptor.expandKey(this.aesConf.key);
          this.downloadTS()
        },
        fail: () => {
          this.$message.warning('AES 配置不正确')
        }
      })
    }, 
    // 下载分片
    downloadTS() {
      let download = () => {
        let index = this.downloadIndex
        this.downloadIndex++
        if (this.finishList[index] && this.finishList[index].status === '') {
          this.finishList[index].status = 'loading';
          this.downLoadAjax({
            url: this.tsUrlList[index],
            type: 'file',
            success: (file) => {
              this.dealTS(file, index, () => this.downloadIndex < this.tsUrlList.length && download())
            },
            fail: () => {
              this.errorNum++
              this.finishList[index].status = 'error'
              if (this.downloadIndex < this.tsUrlList.length) {
                download()
              }
            }
          })
        } else if (this.downloadIndex < this.tsUrlList.length) { // 跳过已经成功的片段
          download()
        }
      }

      // 建立多少个 ajax 线程
      for (let i = 0; i < 10; i++) {
        download(i)
      }
    }, 
    // 处理 ts 片段，AES 解密、mp4 转码
    dealTS(file, index, callback) {
      const data = this.aesConf.uri ? this.aesDecrypt(file, index) : file
      this.conversionMp4(data, index, (afterData) => { // mp4 转码
        this.mediaFileList[index] = afterData // 判断文件是否需要解密
        this.finishList[index].status = 'finish'
        this.finishNum++
        console.log(this.finishNum, this.tsUrlList.length, this.finishNum === this.tsUrlList.length ? '转码完毕' : '还未完成')
        if (this.finishNum === this.tsUrlList.length) {
          this.downloadFile(this.mediaFileList)
        }
        callback && callback()
      })
    }, 
    aesDecrypt(data, index) {
      console.log('什么时候走到这里了？');
      let iv = this.aesConf.iv || new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, index])
      return this.aesConf.decryptor.decrypt(data, 0, iv.buffer, true)
    },    
    // 格式化时间
    formatTime(date, formatStr) {
      const formatType = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
      }
      return formatStr.replace(
        /Y+|M+|D+|h+|m+|s+/g,
        target => (new Array(target.length).join('0') + formatType[target[0]]).substr(-target.length)
      )
    },    
    // 转码为 mp4
    conversionMp4(data, index, callback) {
      if (this.isGetMP4) {
        let transmuxer = new muxjs.Transmuxer({
          keepOriginalTimestamps: true,
          duration: parseInt(this.durationSecond),
        });
        transmuxer.on('data', segment => {
          if (index === 0) {
            let data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
            data.set(segment.initSegment, 0);
            data.set(segment.data, segment.initSegment.byteLength);
            callback(data.buffer)
          } else {
            callback(segment.data)
          }
        })
        transmuxer.push(new Uint8Array(data));
        transmuxer.flush();
      } else {
        callback(data, index)
      }
    },  
    // 下载整合后的TS文件
    downloadFile(fileDataList) {
      console.log('ts 碎片整合中，请留意浏览器下载');
      let fileBlob = null
      let a = document.createElement('a')
      if (this.isGetMP4) {
        fileBlob = new Blob(fileDataList, { type: 'video/mp4' }) // 创建一个Blob对象，并设置文件的 MIME 类型
        a.download = this.downLoadFileName + '.mp4'
      } else {
        fileBlob = new Blob(fileDataList, { type: 'video/MP2T' }) // 创建一个Blob对象，并设置文件的 MIME 类型
        a.download = this.downLoadFileName + '.ts'
      }
      a.href = URL.createObjectURL(fileBlob)
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
    },               
    // 合成URL
    applyURL(targetURL, baseURL) {
      baseURL = baseURL || location.href;
      if (targetURL.indexOf("http") === 0) {
        return targetURL;
      } else if (targetURL[0] === "/") {
        let domain = baseURL.split("/");
        return domain[0] + "//" + domain[2] + targetURL;
      } else {
        let domain = baseURL.split("/");
        domain.pop();
        return domain.join("/") + "/" + targetURL;
      }
    },
    // ajax 请求
    downLoadAjax(options) {
      options = options || {};
      let xhr = new XMLHttpRequest();
      if (options.type === "file") {
        xhr.responseType = "arraybuffer";
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let status = xhr.status;
          if (status >= 200 && status < 300) {
            options.success && options.success(xhr.response);
          } else {
            options.fail && options.fail(status);
          }
        }
      };

      xhr.open("GET", options.url, true);
      xhr.send(null);
    },
  },
};
</script>
<style lang="scss">
.downLoad_page {
  .el-progress-bar {
    width: 500px;
    padding-right: 0;;
  }
  .el-progress-bar__outer {
    background-color: #202C41;
  }
  .el-progress-bar__inner {
    background: linear-gradient(270deg, #19F0E1 0%, #128EE8 100%) !important;
  }
  .el-progress__text {
    color: #EEAD42;
  }
}
</style>
<style lang="scss" scoped>
.downLoad_page {
  width: 100vw;
  height: 100vh;
  background-color: #1A2233;
  .logo_container {
    width: 100%;
    height: 62px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 180px;
    .logo {
      width: 32px;
      height: 40px;
      background: url('./img/logo@2x.png') center center no-repeat;
      background-size: 100% 100%;
      margin: 0 8px 0 16px;
    }
    .plant {
      color: #99D8FF;
      font-size: 18px;
      font-weight: 500;
      height: 40px;
      p {
        line-height: 18px;
      }
      span {
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
  .downLoad_container {
    width: 660px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .file_name {
      width: 100%;
      height: 22px;
      font-size: 16px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 22px;
      text-align: center;
    }
    .el-progress--line {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      margin: 50px 0 30px 0;
      .el-progress-bar {
        width: 500px;
      }
      .el-progress__text {
        color: #EEAD42;
        width: 100px;
        margin-left: 40px;
      }
    }
    .progress_tip {
      width: 100%;
      height: 20px;
      font-size: 18px;
      font-weight: 500;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    .success_icon {
      background: url("./img/downloaded.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .loading_icon {
      background: url("./img/downloading.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .repeat_download {
      width: 100%;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #6F7480;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 100px;
      span {
        width: 56px;
        height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #2EABFF;
        cursor: pointer;
        text-decoration: underline;
        margin-left: 4px;
      }
    }
  }
}
</style>