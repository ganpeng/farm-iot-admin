<template>
  <el-dialog
    :title="title"
    class="my-dialog"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-body">
      <el-form
        :model="batch"
        :rules="validRules"
        ref="batchForm"
        class="my-form my-dialog-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
          <el-col :span="12">
            <el-form-item label="溯源批号" prop="batchNo">
              <span v-if="id">{{batch.batchNo}}</span>
              <el-input
                v-else
                :value="batch.batchNo"
                @input="inputHandler($event, 'batchNo')"
              ></el-input>
              <span v-if="!id" class="prompt-info-icon">
                <svg-icon icon-class="info_i_1"></svg-icon>
                <div class="prompt-info-dialog">
                  <p>批号关联到溯源码后将不可修改，请谨慎填写</p>
                </div>
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="农场" class="is-required">
              <span>{{farmName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="所属地块" prop="landId">
              <el-select
                :value="landId"
                filterable
                clearable
                @change="landChangeHandler($event)"
                placeholder="请选择地块"
              >
                <el-option
                  v-for="(item, index) in landList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="年份" prop="year">
              <el-date-picker
                :clearable="false"
                @change="yearChangeHandler"
                :picker-options="datePickerOptions"
                class="year-select"
                type="year"
                v-model="year"
                value-format="yyyy">
              </el-date-picker>
            </el-form-item>   
          </el-col>
          <el-col>
            <el-form-item label="作物名称">
              <el-select
                v-model="selectPlantId"
                filterable
                clearable
                @change="plantChangeHandler"
                placeholder="请选择作物"
              >
                <el-option
                  v-for="(item, index) in plantList"
                  :key="index"
                  :label="item.plantName + '-' + item.seedName"
                  :value="item.plantName + '-' + item.seedName"
                ></el-option>
              </el-select>
            </el-form-item>   
          </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">溯源步骤</h4>
          <div class="training-list-container">
            <ul class="training-list">
              <li
                v-for="(tracing, index) in batch.traceInfo"
                :key="index"
                class="training-item">
                <div class="training-item-header">
                  <div class="left">
                    <span class="title two">{{index + 1}}</span>
                  </div>
                  <div class="right">
                    <span v-if="index > 2" @click="deleteTracingHandler(index)" class="delete-btn">
                      删除
                      <svg-icon icon-class="item_delete_icon"/>
                    </span>
                    <span
                      @click="expandHandler('traceInfo', index)"
                      :class="['expand-btn', tracing.isExpanded && 'is-expanded']">
                      {{tracing.isExpanded ? '收起' : '展开'}}
                      <svg-icon icon-class="array_top"/>
                    </span>
                  </div>
                </div>
                <div v-show="tracing.isExpanded" class="training-item-content">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        label="步骤名称"
                        :prop="`traceInfo.${index}.name`"
                        :rules="requiredRules">
                        <el-input
                          :value="tracing.name"
                          @input="inputHandler($event, `traceInfo.${index}.name`)"
                          placeholder="10字以内"
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        class="img-form-item"
                        label="图片"
                        :prop="`traceInfo.${index}.imageUrl`"
                        :rules="requiredRules">
                        <!--
                        <el-image
                          class="cover-image"
                          fit="cover"
                          @click="showFarmImage(tracing.imageUrl)"
                          v-if="tracing.imageUrl"
                          :src="tracing.imageUrl">
                        </el-image>
                        -->
                        <file-carousel
                          v-if="tracing.imageUrl.length > 0"
                          :deleteFile="deleteTraceImageHandler(index, `traceInfo`)"
                          :files="tracing.imageUrl"
                        ></file-carousel>
                        <uploader
                          v-if="tracing.imageUrl.length < 5"
                          :maxSize="500"
                          :id="`imageUploader${index}`"
                          :uploadSuccessHandler="imageUploadHandler(index, 'traceInfo')"
                        ></uploader>
                        <!--
                        <uploader
                          v-if="certificate.url.length < 5"
                          :maxSize="500"
                          :status="tracing.imageUrl ? 2 : 1"
                          :id="`imageUploader${index}`"
                          :uploadSuccessHandler="imageUploadHandler(index, 'traceInfo')"
                        ></uploader>
                        -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="时间"
                        :prop="`traceInfo.${index}.date`"
                        :rules="requiredRules">
                        <el-date-picker
                          :value="tracing.date"
                          type="date"
                          @input="inputHandler($event, `traceInfo.${index}.date`)"
                          value-format="timestamp"
                          placeholder="选择日期"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item
                        class="img-form-item"
                        label="视频">
                        <div v-if="tracing.videoUrl" class="video-wrapper">
                          <mp4-video-player :playUrl="tracing.videoUrl"></mp4-video-player>
                        </div>
                        <uploader
                          :status="tracing.videoUrl ? 2 : 1"
                          :id="`videoUploader${index}`"
                          type="video"
                          :uploadSuccessHandler="videoUploadHandler(index, 'traceInfo')"
                        ></uploader>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="seperator-line"></div>
                  <div class="detail-data-container">
                    <h5 class="detail-data-header">
                      <div class="title">
                        详细数据
                      </div>
                      <div @click="addDetailDataItem({index})" class="add-detail-data-btn">添加数据</div>
                    </h5>
                    <el-row>
                      <el-col v-for="(detail, _index) in tracing.detailList" :key="_index" :span="12">
                        <div class="training-item-header">
                          <div class="left">
                            <span class="title">数据{{_index + 1}}</span>
                          </div>
                          <div class="right">
                            <span @click="deleteDetailDataHandler(index, _index)" class="delete-btn">
                              删除
                              <svg-icon icon-class="item_delete_icon"/>
                            </span>
                          </div>
                        </div>
                        <el-form-item :label="`数据标题`">
                          <el-input
                            :value="detail.title"
                            placeholder="8字以内"
                            maxlength="8"
                            @input="inputHandler($event, `traceInfo.${index}.detailList.${_index}.title`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item :label="`数据内容`">
                          <el-input
                            :rows="2"
                            :value="detail.content"
                            maxlength="50"
                            type="textarea"
                            placeholder="50字以内"
                            @input="inputHandler($event, `traceInfo.${index}.detailList.${_index}.content`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="seperator-line"></div>
                  <div class="more-info">
                    <el-row>
                      <el-col :span="12">
                          <el-form-item label="其他说明">
                            <el-input
                              :rows="2"
                              :value="tracing.moreInfo"
                              type="textarea"
                              maxlength="30"
                              placeholder="30字以内"
                              @input="inputHandler($event, `traceInfo.${index}.moreInfo`)"
                            ></el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </li>
            </ul>
            <div class="add-btn-container">
              <span @click="addTracingHandler" class="add-btn">
                <svg-icon icon-class="add_plus"/>
                添加条目
              </span>
            </div>
          </div>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">取 消</el-button>
      <el-button :disabled="submitDisabled" class="enter-btn" @click="enterHandler">确 定</el-button>
    </div>
    <preview-single-image ref="previewSingleImage" :url="previewImageUrl"></preview-single-image>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import Uploader from "@/components/Uploader";
import PreviewSingleImage from "@/components/PreviewSingleImage";
import constants from "@/util/constants";
import Mp4VideoPlayer from '@/components/Mp4VideoPlayer';
import FileCarousel from "@/components/FileCarousel";
export default {
  name: "TracingDialog",
  components: { Uploader, PreviewSingleImage, Mp4VideoPlayer, FileCarousel },
  data() {
    return {
      submitDisabled: false,
      visible: false,
      previewImageUrl: '',
      id:'',
      goodsId: '',
      goodsName: '',
      validRules: {
        batchNo: [
          { required: true, message: "请输入批次号码" },
          { pattern: /^[a-zA-Z0-9]{1,100}$/, message: '批次号只能包含字母数字' },
        ],
      },
      requiredRules: { required: true, message: "该选项不能为空" },
      farmId: '',
      farmName: '',
      landList: [],
      plantList: [],
      seedList: [],
      selectPlantId: '',
      plantSeedName: '',
      year: '',
      landId: '',
      datePickerOptions: {
        disabledDate(date) {
          let today = new Date().getTime();
          return date.getTime() >= today;
        }
      }      
    };
  },
  computed: {
    ...mapGetters({
      batch: "batch/currentBatch",
      list: "commodity/list",
      listIndex: 'commodity/listIndex',
    }),
    title() {
      return this.id ? "编辑批次" : "新增批次";
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentBatch: "batch/updateCurrentBatch",
      addTracing: "batch/addTracing",
      deleteTracingByIndex: "batch/deleteTracingByIndex",
      updateExpandedByKeyIndex: 'batch/updateExpandedByKeyIndex',
      addDetailDataItem: 'batch/addDetailDataItem',
      deleteDetailDataItemByIndex: 'batch/deleteDetailDataItemByIndex'
    }),
    ...mapActions({
      createBatch: "batch/createBatch",
      updateBatchById: "batch/updateBatchById",
      getBatchList: "batch/getBatchList",
    }),
    show({id, goodsId, goodsName, farmName, farmId}) {
      this.visible = true;
      this.id = id;
      this.goodsId = goodsId;
      this.goodsName = goodsName;
      this.getLandList({farmName, farmId});
    },
    hide() {
      this.id = '';
      this.goodsId = '';
      this.goodsName = '';
      this.farmId = '';
      this.farmName = '';
      this.year = '';
      this.plantList = [];
      this.selectPlantId = '';
      this.landId = '';
      this.visible = false;
    },
    inputHandler(value, key) {
      this.updateCurrentBatch({ key, value });
    },
    // 培训
    addTracingHandler() {
      this.addTracing();
    },
    async deleteTracingHandler(index) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          this.deleteTracingByIndex({ index });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteDetailDataHandler(index, _index) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          this.deleteDetailDataItemByIndex({ index, _index });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.$refs.batchForm.clearValidate();
        console.log(this.$refs.imageCarousel);
      } catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    cancelHandler() {
      this.hide();
    },
    expandHandler(key, index) {
      this.updateExpandedByKeyIndex({key, index});
    },
    deleteTraceImageHandler(index, key) {
      return _index => {
        let url = _.get(this.batch, `${key}.${index}.imageUrl`);
        let urlList = url.filter((item, __index) => _index !== __index);
        this.updateCurrentBatch({
          key: `${key}.${index}.imageUrl`,
          value: urlList
        });
      };
    },
    imageUploadHandler(index, key) {
      return data => {
        let url = _.get(this.batch, `${key}.${index}.imageUrl`);
        let urlList = _.chain(url)
          .concat(data.fileUrl)
          .uniqBy()
          .value();
        this.updateCurrentBatch({
          key: `${key}.${index}.imageUrl`,
          value: urlList
        });
      };
    },
    videoUploadHandler(index, key) {
      return data => {
        this.updateCurrentBatch({
          key: `${key}.${index}.videoUrl`,
          value: data.fileUrl
        });
      };
    },
    showFarmImage(url) {
      this.previewImageUrl = url;
      this.$refs.previewSingleImage.show();
    },
    editContent(value) {
      this.updateCurrentBatch({key: 'updateInfo', value});
    },
    async inputEditContent(callback) {
      try {
        let prompt = await this.$prompt("请填写更新内容", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请填写更新内容（200字以内）",
          inputValidator: value => {
            if(!value) {
              return `更新内容不能为空`;
            }            
            if(value.trim().length === 0) {
              return `更新内容不能为空`
            }
            if (value.length > 200) {
              return `更新内容不能超过200个字`;
            }
          }
        });
        if (prompt.action === "confirm") {
          callback(prompt.value);
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },    
    async enterHandler() {
      try {
        let valid = await this.$refs.batchForm.validate();
        if (valid) {
          this.submitDisabled = true;
          this.updateCurrentBatch({key: 'farmName', value: this.farmName});
          this.updateCurrentBatch({key: 'farmId', value: this.farmId});
          this.updateCurrentBatch({key: 'goodsId', value: this.goodsId});
          this.updateCurrentBatch({key: 'goodsName', value: this.goodsName});
          if(this.$wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || this.$wsCache.localStorage.get('login').roleType === 'FARM_OWNER') {
            let isEdit = await this.inputEditContent(this.editContent);
            if(!isEdit) {
              this.submitDisabled = false;
              return;
            }            
          }
          if (this.id) {
            let res = await this.updateBatchById(this.id);
            if (res && res.code === 0) {
              await this.getBatchList();
              this.cancelHandler();
            } else {
              // this.$message.error(res.message);
              this.submitDisabled = false;
            }
          } else {
            let res = await this.createBatch();
            if (res && res.code === 0) {
              await this.getBatchList();
              this.cancelHandler();
            } else {
              // this.$message.error(res.message);
              this.submitDisabled = false;
            }
          }
        }
      } catch (err) {
        console.log(err);
        this.submitDisabled = false;
      }
    },
    async getLandList(farmInfo) {
      const {farmName, farmId} = farmInfo;
      this.farmId = farmId;
      this.farmName = farmName;
      if(this.id) {
        const {year, plantName, seedName, landId} = this.batch;
        if(year) {
          this.selectPlantId = `${plantName}-${seedName}`;
          this.landId = landId;
          this.year = year + '';
        }
      }
      let params = {
          pageNum: 0,
          pageSize: 1000,
          farmId
      };
      let res = await this.$service.getLandList(params);
      if(res.code === 0 && res.data) {
        this.landList = res.data.list;
      } else {
        console.log(res.message)
      }
    },
    landChangeHandler(landId) {
      this.landId = landId;
      try {
        this.getPlantList();
        this.clearPlantInfo();
      } catch (err) {
        console.log(err);
      }
    },
    yearChangeHandler(year) {
      this.year = year;
      try {
        this.getPlantList();
        this.clearPlantInfo();
      } catch (err) {
        console.log(err);
      }
    },
    // 根据地块和年份查询作物列表
    async getPlantList() {
      if(this.landId && this.year) {
        this.updateCurrentBatch({
          key: 'year',
          value: new Date(this.year).getFullYear(),
        });
        this.updateCurrentBatch({
          key: 'landId',
          value: this.landId,
        });
        this.landList.map(item => {
          if(item.id === this.landId) {
            this.updateCurrentBatch({
              key: 'landName',
              value: item.name,
            });
          }
        });
        let params = {
          farmId: this.farmId,
          landId: this.landId,
          year: new Date(this.year).getFullYear(),
        }
        let res = await this.$service.getAgriculRecordPlantNameList(params)
        console.log(res);
        this.plantList = res.data;
      }
    },
    // 清空作物和品种
    clearPlantInfo() {
      this.selectPlantId = '';
    },
    plantChangeHandler() {
      try {
        this.plantList.map(item => {
          const {plantName, seedName} = item;
          let str = `${plantName}-${seedName}`;
          if(str === this.selectPlantId) {
            this.updateCurrentBatch({
              key: 'plantName',
              value: plantName,
            });
            this.updateCurrentBatch({
              key: 'seedName',
              value: seedName,
            });            
          }
        });
      } catch (err) {
        console.log(err);
      }

    },
  }
};
</script>
<style lang="scss" scoped>
.training-list-container {
  .training-list {
    .training-item {
      .training-item-header {
        .left {
          .title {
            &.two {
              color: #fff;
              font-size: 16px;
              height: 26px;
              line-height: 26px;
              border-radius: 0px;
              border: none;
              text-align: left;
              background-image: url('../../assets/img/tracing_icon_step.png');
              background-size: 100% 100%;
              background-position: center center;
              background-repeat: no-repeat;
            }
          }
        }
      }
      .cover-image {
        width: 260px;
        height: 160px;
      }
      .video-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 260px;
        height: 160px;
        overflow: hidden;
        background-color: #202c41;
      }
      .detail-data-container {
        margin-top: 20px;
        .detail-data-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .title {
            width: 140px;
            font-size: 14px;
            color: #A8ABB3;
            text-align: right;
            padding-right: 10px;
          }
          .add-detail-data-btn {
            width: 80px;
            height: 30px;
            line-height: 30px;
            color: #2EABFF;
            font-size: 12px;
            text-align: center;
            border-radius: 15px;
            border: 1px solid #2EABFF;
            cursor: pointer;
          }
        }
      }
      .more-info {
        margin-top: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
.my-dialog-form .el-textarea .el-textarea__inner {
  height: 60px!important;
}
.el-date-picker {
  .el-picker-panel__body {
    .el-date-picker__header {
      .el-date-picker__header-label {
        color: #fff;
      }
    }
  }
  .el-year-table {
    td {
      .cell {
        color: #fff;
      }
      &.disabled {
        .cell {
          background-color: transparent;
          color: #777;
        }
      }
    }
  }
}
</style>
