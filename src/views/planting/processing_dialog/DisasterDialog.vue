<template>
  <el-dialog
    title="受灾信息"
    class="my-dialog no-footer-border"
    width="50%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-body">
      <div class="plant-protection-detail-container">
        <div class="steps-content">
          <el-form
            :model="p8DisasterInfo"
            :rules="validRules"
            status-icon
            ref="p1Form"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <el-col :span="12">
              <el-form-item label="受灾类型" prop="type">
                <el-select
                  :value="p8DisasterInfo.type"
                  clearable
                  placeholder="请选择"
                  @change="inputHandler($event, `type`)"
                  @input="inputHandler($event, `type`)"
                >
                  <el-option
                    v-for="(item, index) in p8TypeOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="受灾面积(公顷)" prop="area">
                <el-input
                  :value="p8DisasterInfo.area"
                  @input="inputHandler($event, 'area')"
                ></el-input>
              </el-form-item>
              <el-form-item label="预计损失(元)" prop="lose">
                <el-input
                  :value="p8DisasterInfo.lose"
                  @input="inputHandler($event, 'lose')"
                ></el-input>
              </el-form-item>
              <el-form-item label="预计减产(公斤)" prop="reduce">
                <el-input
                  :value="p8DisasterInfo.reduce"
                  @input="inputHandler($event, 'reduce')"
                ></el-input>
              </el-form-item>
              <el-form-item label="受灾时间" prop="date">
                <el-date-picker
                  :value="p8DisasterInfo.date"
                  type="date"
                  value-format="timestamp"
                  :picker-options="datePickerOptions"
                  @input="inputHandler($event, `date`)"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                class="img-form-item"
                label="受灾图片">
                <file-carousel
                  v-if="p8DisasterInfo.fileList.length > 0"
                  :deleteFile="deleteFileHandler()"
                  :files="p8DisasterInfo.fileList"
                ></file-carousel>
                <uploader
                  v-if="p8DisasterInfo.fileList.length < 5"
                  :id="`p7FileUploader`"
                  :uploadSuccessHandler="fileUploadHandler()"
                ></uploader>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">取 消</el-button>
      <el-button :disabled="submitDisabled" class="enter-btn" @click="enterHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { mapGetters, mapMutations, mapActions } from "vuex";
import constants from "@/util/constants";
import FileCarousel from "@/components/FileCarousel";
import Uploader from "@/components/Uploader";
export default {
  name: 'DisasterDialog',
  components: { FileCarousel, Uploader },
  data() {
    return {
      submitDisabled: false,
      visible: false,
      editIndex: undefined,
      p7UserOPtions: [],
      p8DisasterInfo: {
        uuid: '', // 前端生成的uuid
        type: '', // 受灾类型
        date: '', // 受灾时间
        area: '', // 受灾面积
        reduce: '', // 预计减产
        lose: '', // 损失
        fileList: [], // 受灾图片
        isExpanded: false // 展开收起
      },
      validRules: {
        type: [
          { required: true, message: "该选项不能为空" }
        ],
        area: [
          { required: true, message: "该选项不能为空" },
          { pattern: constants.REG_EXP.positiveInteger2, message: "请输入正确的数值" }
        ],
        reduce: [
          { required: true, message: "该选项不能为空" },
          { pattern: constants.REG_EXP.positiveInteger2, message: "请输入正确的数值" }
        ],
        lose: [
          { required: true, message: "该选项不能为空" },
          { pattern: constants.REG_EXP.positiveInteger2, message: "请输入正确的数值" }
        ],
        date: [
          { required: true, message: "该选项不能为空" }
        ]
      },
      datePickerOptions: {
        disabledDate(date) {
          let year = new Date().getFullYear();
          let dateTimeOfFirstDay = new Date(`${year}-01-01 00:00:00`).getTime();
          let dateTimeOfLastDay = new Date(`${year}-12-31 23:59:59`).getTime();
          return !(
            date.getTime() >= dateTimeOfFirstDay &&
            date.getTime() <= dateTimeOfLastDay
          );
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      plant: 'plant/currentPlant',
      land: 'land/currentLand',
      dict: "dict/dict",
      dictList: "dict/dictList"
    }),
    // p8
    p8TypeOptions() {
      return this.dict.disasterType || [];
    },
    isEdit() {
      return this.editIndex !== undefined && this.editIndex !== null;
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentPlant: 'plant/updateCurrentPlant'
    }),
    ...mapActions({
      createPlant: "plant/createPlant",
      getPlantById: "plant/getPlantById",
      getAllDictList: 'dict/getAllDictList'
    }),
    show(index) {
      this.editIndex = index;
      if (this.isEdit) {
        this.p8DisasterInfo = _.get(this.plant, `p8DisasterInfo.${index}`);
      }
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.editIndex = undefined;
      this.submitDisabled = false;
      this.p7UserOPtions = [];
      this.p8DisasterInfo = {
        type: '', // 受灾类型
        date: '', // 受灾时间
        area: '', // 受灾面积
        reduce: '', // 预计减产
        lose: '', // 损失
        fileList: [], // 受灾图片
        isExpanded: false // 展开收起
      };
    },
    inputHandler(value, key) {
      _.set(this.p8DisasterInfo, key, value);
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.$refs.p1Form.clearValidate();
      } catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    async cancelHandler() {
      this.hide();
    },
    deleteFileHandler() {
      return index => {
        let url = _.get(this.p8DisasterInfo, `fileList`);
        let urlList = url.filter((item, _index) => _index !== index);
        this.inputHandler(urlList, `fileList`);
      };
    },
    fileUploadHandler() {
      return data => {
        let fileList = _.get(this.p8DisasterInfo, `fileList`);
        let urlList = _.chain(fileList)
          .concat(data)
          .uniqBy("fileUrl")
          .value();
        this.inputHandler(urlList, `fileList`);
      };
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.p1Form.validate();
        if (valid) {
          let {id, code, area, farmId, form, name} = this.land;
          if (this.isEdit) {
            let newData = this.plant.p8DisasterInfo.map((item, index) => {
              if (index === this.editIndex) {
                return this.p8DisasterInfo;
              } else {
                return item;
              }
            });
            this.updateCurrentPlant({ key: "p8DisasterInfo", value: newData });
          } else {
            let uuid = uuidv4();
            this.inputHandler(uuid, 'uuid');
            let p8DisasterInfo = _.cloneDeep(this.plant.p8DisasterInfo);
            let newData = _.concat(p8DisasterInfo, [this.p8DisasterInfo]);
            this.updateCurrentPlant({ key: "p8DisasterInfo", value: newData });
          }
          this.updateCurrentPlant({ key: "farmLandId", value: id });
          this.updateCurrentPlant({ key: "farmLandCode", value: code });
          this.updateCurrentPlant({ key: "area", value: area });
          this.updateCurrentPlant({ key: "form", value: form });
          this.updateCurrentPlant({ key: "landName", value: name });
          let res = await this.createPlant(farmId);
          if (res && res.code === 0) {
            this.cancelHandler();
            this.$message.success(`记录添加成功`);
            this.getPlantById(id);
          } else {
            this.submitDisabled = false;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}
</script>