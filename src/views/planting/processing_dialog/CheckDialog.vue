<template>
  <el-dialog
    title="检测信息"
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
            :model="p7CheckManage"
            :rules="validRules"
            status-icon
            ref="p1Form"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <el-col :span="14">
              <el-form-item label="检测机构" prop="org">
                <el-input
                  :value="p7CheckManage.org"
                  @input="inputHandler($event, 'org')"
                ></el-input>
              </el-form-item>
              <el-form-item label="送检人" prop="user">
                <el-select
                  :value="p7CheckManage.user"
                  clearable
                  placeholder="请选择"
                  @change="inputHandler($event, `user`)"
                  @input="inputHandler($event, `user`)"
                >
                  <el-option
                    v-for="(item, index) in p7UserOPtions"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
                <span class="prompt-info-icon">
                  <svg-icon icon-class="info_i_1"></svg-icon>
                  <div class="prompt-info-dialog">
                    <p>数据来自【成员管理】中添加的经营人员或种植人员信息</p>
                  </div>
                </span>
              </el-form-item>
              <el-form-item label="检测员" prop="tester">
                <el-input
                  :value="p7CheckManage.tester"
                  @input="inputHandler($event, 'tester')"
                ></el-input>
              </el-form-item>
              <el-form-item label="检测项目" prop="project">
                <el-select
                  :value="p7CheckManage.project"
                  clearable
                  placeholder="请选择"
                  @change="inputHandler($event, `project`)"
                  @input="inputHandler($event, `project`)"
                >
                  <el-option
                    v-for="(item, index) in p7ProjectOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
                <span class="add-btn" @click="addCheckManage">新增</span>
              </el-form-item>
              <el-form-item label="检测员电话" prop="mobile">
                <el-input
                  :value="p7CheckManage.mobile"
                  @input="inputHandler($event, 'mobile')"
                ></el-input>
              </el-form-item>
              <el-form-item label="检测时间" prop="date">
                <el-date-picker
                  :value="p7CheckManage.date"
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
                label="检测报告">
                <file-carousel
                  v-if="p7CheckManage.fileList.length > 0"
                  :deleteFile="deleteFileHandler()"
                  :files="p7CheckManage.fileList"
                ></file-carousel>
                <uploader
                  v-if="p7CheckManage.fileList.length < 5"
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
  name: 'CheckDialog',
  components: { FileCarousel, Uploader },
  data() {
    return {
      submitDisabled: false,
      visible: false,
      editIndex: undefined,
      p7UserOPtions: [],
      p7CheckManage: {
        uuid: '', // 前端生成的uuid
        org: '', // 检测机构
        date: '', // 检测时间
        user: '', // 送检人
        project: '', // 检测项目
        tester: '', // 检测员
        mobile: '', // 检测员电话
        fileList: [], // 检测报告
        isExpanded: false // 展开收起
      },
      validRules: {
        org: [
          { required: true, message: "该选项不能为空" }
        ],
        tester: [
          { required: true, message: "该选项不能为空" }
        ],
        project: [
          { required: true, message: "该选项不能为空" }
        ],
        mobile: [
          { required: true, message: "该选项不能为空" },
          { pattern: constants.REG_EXP.phoneNum, message: "请输入正确的电话号码" }
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
    // p7
    p7ProjectOptions() {
      return this.dict.checkType || [];
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
        this.p7CheckManage = _.get(this.plant, `p7CheckManage.${index}`);
      }
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.editIndex = undefined;
      this.submitDisabled = false;
      this.p7UserOPtions = [];
      this.p7CheckManage = {
        org: '', // 检测机构
        date: '', // 检测时间
        user: '', // 送检人
        project: '', // 检测项目
        tester: '', // 检测员
        mobile: '', // 检测员电话
        fileList: [], // 检测报告
        isExpanded: false // 展开收起
      };
    },
    inputHandler(value, key) {
      _.set(this.p7CheckManage, key, value);
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.getMemberList();
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
        let url = _.get(this.p7CheckManage, `fileList`);
        let urlList = url.filter((item, _index) => _index !== index);
        this.inputHandler(urlList, `fileList`);
      };
    },
    fileUploadHandler() {
      return data => {
        let fileList = _.get(this.p7CheckManage, `fileList`);
        let urlList = _.chain(fileList)
          .concat(data)
          .uniqBy("fileUrl")
          .value();
        this.inputHandler(urlList, `fileList`);
      };
    },
    async getMemberList() {
      try {
        let { id } = this.$route.params;
        let res1 = await this.$service.getPlantMemberList({ farmId: id });
        let res2 = await this.$service.getManageMemberList({ farmId: id });

        if (res1 && res1.code === 0) {
          this.p7UserOPtions = _.concat(this.p7UserOPtions, res1.data.list);
        }
        if (res2 && res2.code === 0) {
          this.p7UserOPtions = _.concat(this.p7UserOPtions, res2.data.list);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async addCheckManage() {
      try {
        let prompt = await this.$prompt(`请输入新检测项目`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputValidator: value => {
            if (value.length > 20) {
              return `新检测项目不能超过20个字符`;
            }

            let index = this.p7ProjectOptions.findIndex(
              item => item.name === value
            );
            if (index >= 0) {
              return `新标签${value}已经存在`;
            } else {
              return true;
            }
          },
          inputErrorMessage: `标签不能为空`
        });
        if (prompt.action === "confirm") {
          let mark = {
            description: prompt.value,
            keyType: _.get(this.p7ProjectOptions, "0.keyType"),
            name: prompt.value,
            value: _.get(this.p7ProjectOptions, "0.value")
          };
          let res = await this.$service.postDict(mark);
          if (res && res.code === 0) {
            this.getAllDictList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.p1Form.validate();
        if (valid) {
          let {id, code, area, farmId, form, name} = this.land;
          if (this.isEdit) {
            let newData = this.plant.p7CheckManage.map((item, index) => {
              if (index === this.editIndex) {
                return this.p7CheckManage;
              } else {
                return item;
              }
            });
            this.updateCurrentPlant({ key: "p7CheckManage", value: newData });
          } else {
            let uuid = uuidv4();
            this.inputHandler(uuid, 'uuid');
            let p7CheckManage = _.cloneDeep(this.plant.p7CheckManage);
            let newData = _.concat(p7CheckManage, [this.p7CheckManage]);
            this.updateCurrentPlant({ key: "p7CheckManage", value: newData });
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