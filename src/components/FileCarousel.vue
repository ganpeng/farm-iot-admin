<template>
  <div class="file-carousel-container">
    <div class="file-carousel-wrapper">
      <div class="left-field">
        <div class="carousel-container">
          <div class="prev">
            <span @click="prevHandler" class="prev-btn">
              <svg-icon icon-class="prev_btn"/>
              <svg-icon icon-class="prev_btn_hover"/>
            </span>
          </div>
          <el-carousel
            class="file-carousel"
            ref="fileCarousel"
            height="130px"
            :autoplay="false"
            indicator-position="none"
            @change="changeHandler"
            :interval="5000" arrow="never">
            <el-carousel-item :style="bgStyle(file)" class="file-carousel-item" v-for="(file, index) in files" :key="index">
              <div class="click-mask" @click="previewImageHandler(index)"></div>
              <span v-if="hasDelete" @click="deleteFileByIndex(index)" class="file-delete-btn">
                <svg-icon class="file-delete" icon-class="file_delete"/>
                <svg-icon class="file-delete-hover" icon-class="file_delete_hover"/>
              </span>
            </el-carousel-item>
          </el-carousel>
          <div class="next">
            <span @click="nextHandler" class="next-btn">
              <svg-icon icon-class="next_btn"/>
              <svg-icon icon-class="next_btn_hover"/>
            </span>
          </div>
        </div>
      </div>
      <div class="right-field">
        <span class="page">
          {{count}}/{{files.length}}
        </span>
      </div>
    </div>
    <preview-multiple-images ref="previewMultipleImagesDialog" :previewMultipleImages="previewMultipleImages"></preview-multiple-images>
  </div>
</template>
<script>
import PreviewMultipleImages from './PreviewMultipleImages.vue';
export default {
  name: 'FileCarousel',
  components: {PreviewMultipleImages},
  props: {
    files: {
      default: () => []
    },
    hasDelete: {
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
      count: 1,
      previewMultipleImages: {
        activeIndex: 0,
        list: []
      }
    };
  },
  computed: {
    bgStyle() {
      return (data) => {
        if (data.fileUrl) {
          return `background-image: url('${data.fileUrl}');`;
        } else {
          return `background-image: url('${data}');`;
        }
      };
    }
  },
  methods: {
    prevHandler() {
      this.$refs.fileCarousel.prev();
    },
    nextHandler() {
      this.$refs.fileCarousel.next();
    },
    changeHandler(index) {
      this.count = index + 1;
    },
    previewImageHandler(index) {
      this.previewMultipleImages = {
        activeIndex: index,
        list: this.files
      };
      this.$refs.previewMultipleImagesDialog.show();
    },
    deleteFileByIndex(index) {
      this.deleteFile(index);
    }
  }
};
</script>
<style lang="scss" scoped>
.file-carousel-container {
  .file-carousel-wrapper {
    display: flex;
    .left-field {
      .carousel-container {
        display: flex;
        .file-carousel {
          position: relative;
          width: 180px;
          .file-carousel-item {
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
            .click-mask {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
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
        }
        .prev {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          .svg-icon {
            width: 22px;
            height: 22px;
            cursor: pointer;
          }
          .svg-icon-prev_btn {
            display: block;
          }
          .svg-icon-prev_btn_hover {
            display: none;
          }
          &:hover {
            .svg-icon-prev_btn {
              display: none;
            }
            .svg-icon-prev_btn_hover {
              display: block;
            }
          }
        }
        .next {
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center center;
          width: 40px;
          .svg-icon {
            width: 22px;
            height: 22px;
            cursor: pointer;
          }
          .svg-icon-next_btn {
            display: block;
          }
          .svg-icon-next_btn_hover {
            display: none;
          }
          &:hover {
            .svg-icon-next_btn {
              display: none;
            }
            .svg-icon-next_btn_hover {
              display: block;
            }
          }
        }
      }
    }
    .right-field {
      display: flex;
      align-items: flex-end;
      .page {
        font-size: 12px;
        line-height: 12px;
        color: #A8ABB3;
      }
    }
  }
}
</style>
