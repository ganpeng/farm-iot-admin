<template>
  <div class="uploader-container">
    <div v-if="status === 1" class="uploader">
      <label class="upload-btn-container" :for="id">
        <span class="upload-btn">
          <svg-icon class="upload-btn-default" icon-class="add_btn"/>
          <svg-icon class="upload-btn-hover" icon-class="add_btn_hover"/>
        </span>
      </label>
      <input ref="fileUploader" type="file" :id="id" :accept="accept">
    </div>
    <div v-else class="uploader2">
      <label class="upload-btn" :for="id">
        更改
      </label>
      <input ref="fileUploader" type="file" :id="id" :accept="accept">
    </div>
    <span v-if="this.isUploading" class="complete">{{this.complete}}%</span>
  </div>
</template>
<script>
  import axios from 'axios';
  import wsCache from '@/util/webStorage';

  export default {
    name: 'Uploader',
    props: {
      id: {
        type: String,
        default: 'file-uploader'
      },
      status: {
        type: Number,
        default: 1
      },
      saveFileName: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'image'
      },
      uploadSuccessHandler: {
        type: Function,
        default: () => {
        }
      },
      maxSize: {
        type: Number,
        default: 200
      }
    },
    data() {
      return {
        complete: '',
        isUploading: false
      };
    },
    async created() {
      try {
        await this.$nextTick();
        let uploader = document.querySelector(`#${this.id}`);
        uploader.addEventListener('change', this.uploadHandler.bind(this), false);
      } catch (err) {
        console.log(err);
      }
    },
    computed: {
      accept() {
        let accept = `image/*`;
        switch (this.type) {
          case 'video':
            accept = 'video/*';
            break;
          case 'all':
            accept = 'video/*, image/*';
            break;
          default:
            accept = `image/*`;
        }

        console.log(accept);
        return accept;
      }
    },
    methods: {
      uploadHandler(e) {
        if (this.type === 'image') {
          this.uploadImage(e);
        } else {
          this.uploadVideo(e);
        }
      },
      uploadImage(e) {
        let file = e.target.files[0];
        if (file.size > this.maxSize * 1024) {
          this.$message.error(`上传的文件必须小于${this.maxSize}K`);
        } else {
          this.upload(file);
        }
      },
      uploadVideo(e) {
        let file = e.target.files[0];
        if (file.size > 100 * 1024 * 1024) {
          this.$message.error(`上传的视频必须小于100M`);
        } else {
          this.upload(file);
        }
      },
      async upload(file) {
        try {
          let _this = this;
          let formData = new FormData();
          formData.append('file', file);
          let uri = this.saveFileName ? `/admin/v1/file/uploadFile` : `/admin/v1/file/upload`;
          let token = wsCache.localStorage.get('login') && wsCache.localStorage.get('login').token;
          this.isUploading = true;
          let res = await axios.post(uri, formData, {
            headers: {
              'x-tianchi-token': token
            },
            onUploadProgress: progressEvent => {
              let complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
              _this.complete = complete;
            }
          });
          if (res && res.data.code === 0) {
            this.uploadSuccessHandler(res.data.data);
            this.$message.success('上传成功');
          } else {
            this.$message.error('上传失败');
          }
          this.isUploading = false;
          this.$refs.fileUploader.value = '';
        } catch (err) {
          console.log(err);
          this.isUploading = false;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .uploader-container {
    position: relative;
    display: inline-block;
    margin-left: 10px;
    .uploader {
      position: relative;
      width: 40px;
      height: 40px;
      overflow: hidden;
      .upload-btn-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        margin-right: 10px;
        .upload-btn {
          cursor: pointer;
          .svg-icon {
            width: 40px;
            height: 40px;
          }
          .upload-btn-default {
            display: block;
          }
          .upload-btn-hover {
            display: none;
          }
          &:hover {
            .upload-btn-default {
              display: none;
            }
            .upload-btn-hover {
              display: block;
            }
          }
        }
      }
      input {
        position: absolute;
        left: -99999px;
      }
    }
    .uploader2 {
      position: relative;
      width: 30px;
      height: 12px;
      .upload-btn {
        position: absolute;
        width: 30px;
        height: 12px;
        line-height: 12px;
        font-size: 12px;
        color: #2EABFF;
        cursor: pointer;
        // margin-left: 10px;
      }
      input {
        position: absolute;
        left: -99999px;
      }
    }
    .complete {
      position: absolute;
      top: 50%;
      right: -60px;
      transform: translateY(-50%);
      width: 50px;
      flex-wrap: nowrap;
    }
  }
</style>
