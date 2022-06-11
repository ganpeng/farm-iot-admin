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
        :model="manageMember"
        :rules="validRules"
        ref="manageMemberForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent
      >
        <el-row>
          <h4 class="content-sub-title">基础信息</h4>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input :value="manageMember.name" @input="inputHandler($event, 'name')"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="identityId">
              <el-input
                :value="manageMember.identityId"
                @input="inputHandler($event, 'identityId')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile">
              <el-input :value="manageMember.mobile" @input="inputHandler($event, 'mobile')"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio
                @input="inputHandler('MALE', 'gender')"
                :value="manageMember.gender"
                label="MALE"
              >男</el-radio>
              <el-radio
                @input="inputHandler('FEMALE', 'gender')"
                :value="manageMember.gender"
                label="FEMALE"
              >女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="住址" prop="address">
              <p class="address">{{manageMember.address}}</p>
              <address-select ref="addressSelect"></address-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">出资信息</h4>
          <el-row>
            <el-col :span="12">
              <el-form-item label="现金出资" prop="isFundInvest">
                <el-radio
                  @input="inputHandler(true, 'isFundInvest')"
                  :value="manageMember.isFundInvest"
                  :label="true"
                >是</el-radio>
                <el-radio
                  @input="inputHandler(false, 'isFundInvest')"
                  :value="manageMember.isFundInvest "
                  :label="false"
                >否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="manageMember.isFundInvest" label="现金出资金额(元)" prop="fundAmount">
                <el-input
                  :value="manageMember.fundAmount"
                  @input="inputHandler($event, 'fundAmount')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="土地出资" prop="isLandInvest">
                <el-radio
                  @input="inputHandler(true, 'isLandInvest')"
                  :value="manageMember.isLandInvest"
                  :label="true"
                >是</el-radio>
                <el-radio
                  @input="inputHandler(false, 'isLandInvest')"
                  :value="manageMember.isLandInvest"
                  :label="false"
                >否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="manageMember.isLandInvest" label="出地面积(公顷)" prop="landArea">
                <el-input :value="manageMember.landArea" @input="inputHandler($event, 'landArea')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">参加培训</h4>
          <div class="training-list-container">
            <ul class="training-list">
              <li
                v-for="(training, index) in manageMember.trainingList"
                :key="index"
                class="training-item"
              >
                <div class="training-item-header">
                  <div class="left">
                    <span class="title">培训{{index + 1}}</span>
                  </div>
                  <div class="right">
                    <span @click="deleteTrainingHandler(index)" class="delete-btn">
                      删除
                      <svg-icon icon-class="item_delete_icon"/>
                    </span>
                    <span
                      @click="expandHandler('trainingList', index)"
                      :class="['expand-btn', training.isExpanded && 'is-expanded']">
                      {{training.isExpanded ? '收起' : '展开'}}
                      <svg-icon icon-class="array_top"/>
                    </span>
                  </div>
                </div>
                <div v-if="training.isExpanded" class="training-item-content">
                  <el-col :span="12">
                    <el-form-item
                      label="培训类型"
                      :prop="`trainingList.${index}.type`"
                      :rules="requiredRules"
                    >
                      <el-select
                        :value="training.type"
                        clearable
                        placeholder="请选择"
                        @input="inputHandler($event, `trainingList.${index}.type`)"
                      >
                        <el-option
                          v-for="item in trainingTypeOptions"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="组织者"
                      :prop="`trainingList.${index}.organizer`"
                      :rules="requiredRules"
                    >
                      <el-select
                        :value="training.organizer"
                        clearable
                        placeholder="请选择"
                        @input="inputHandler($event, `trainingList.${index}.organizer`)"
                      >
                        <el-option
                          v-for="item in trainingOrganizerOptions"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="培训时段"
                      :prop="`trainingList.${index}.dateRange`"
                      :rules="requiredRules"
                    >
                      <el-date-picker
                        :value="training.dateRange"
                        type="daterange"
                        @input="inputHandler($event, `trainingList.${index}.dateRange`)"
                        value-format="timestamp"
                        :unlink-panels="true"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      class="img-form-item"
                      label="培训证明"
                      :prop="`trainingList.${index}.url`"
                      :rules="requiredRules"
                    >
                      <file-carousel
                        v-if="training.url.length > 0"
                        :deleteFile="deleteFileHandler(index, 'trainingList')"
                        :files="training.url"
                      ></file-carousel>
                      <uploader
                        v-if="training.url.length < 5"
                        :id="`fileUploader${index}`"
                        :uploadSuccessHandler="fileUploadHandler(index, 'trainingList')"
                      ></uploader>
                    </el-form-item>
                  </el-col>
                </div>
              </li>
            </ul>
            <div class="add-btn-container">
              <span @click="addTrainingHandler" class="add-btn">
                <svg-icon icon-class="add_plus"/>
                添加条目
              </span>
            </div>
          </div>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">所获证书</h4>
          <div class="training-list-container">
            <ul class="training-list">
              <li
                v-for="(certificate, index) in manageMember.certificateList"
                :key="index"
                class="training-item"
              >
                <div class="training-item-header">
                  <div class="left">
                    <span class="title">证书{{index + 1}}</span>
                  </div>
                  <div class="right">
                    <span @click="deleteCertificateHandler(index)" class="delete-btn">
                      删除
                      <svg-icon icon-class="item_delete_icon"/>
                    </span>
                    <span
                      @click="expandHandler('certificateList', index)"
                      :class="['expand-btn', certificate.isExpanded && 'is-expanded']">
                      {{certificate.isExpanded ? '收起' : '展开'}}
                      <svg-icon icon-class="array_top"/>
                    </span>
                  </div>
                </div>
                <div v-if="certificate.isExpanded" class="training-item-content">
                  <el-col :span="12">
                    <el-form-item
                      label="证书名称"
                      :prop="`certificateList.${index}.name`"
                      :rules="requiredRules"
                    >
                      <el-input
                        :value="certificate.name"
                        @input="inputHandler($event, `certificateList.${index}.name`)"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="发证机关"
                      :prop="`certificateList.${index}.authority`"
                      :rules="requiredRules"
                    >
                      <el-input
                        :value="certificate.authority"
                        @input="inputHandler($event, `certificateList.${index}.authority`)"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="发证时间"
                      :prop="`certificateList.${index}.issueDate`"
                      :rules="requiredRules"
                    >
                      <el-date-picker
                        :value="certificate.issueDate"
                        type="date"
                        @input="inputHandler($event, `certificateList.${index}.issueDate`)"
                        value-format="timestamp"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      class="img-form-item"
                      label="证书图片"
                      :prop="`certificateList.${index}.url`"
                      :rules="requiredRules"
                    >
                      <file-carousel
                        v-if="certificate.url.length > 0"
                        :deleteFile="deleteFileHandler(index, 'certificateList')"
                        :files="certificate.url"
                      ></file-carousel>
                      <uploader
                        v-if="certificate.url.length < 5"
                        :id="`certificateFileUploader${index}`"
                        :uploadSuccessHandler="fileUploadHandler(index, 'certificateList')"
                      ></uploader>
                    </el-form-item>
                  </el-col>
                </div>
              </li>
            </ul>
            <div class="add-btn-container">
              <span @click="addCertificateHandler" class="add-btn">
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
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import FileCarousel from "@/components/FileCarousel";
import AddressSelect from "@/components/AddressSelect";
import Uploader from "@/components/Uploader";
import constants from "@/util/constants";
import {inputFarmEditContent} from "@/util/asyncFun"
export default {
  name: "ManageMemberDialog",
  components: { FileCarousel, AddressSelect, Uploader },
  data() {
    return {
      submitDisabled: false,
      visible: false,
      id: "",
      validRules: {
        name: [{ required: true, message: "请输入名称" }],
        identityId: [{ required: true, message: "请输入证件号" }],
        mobile: [
          { required: true, message: "请输入联系电话" },
          {
            pattern: constants.REG_EXP.phoneNum,
            message: "请输入正确的电话号码"
          }
        ],
        gender: [{ required: true, message: "请选择性别" }],
        address: [{ required: true, message: "请选择住址" }],
        isFundInvest: [{ required: true, message: "请选择是否现金出资" }],
        isLandInvest: [{ required: true, message: "请选择是否土地出资" }],
        fundAmount: [
          { required: true, message: "请输入现金出资金额" },
          { pattern: /^\d+$/, message: "请输入正确的金额" }
        ],
        landArea: [
          { required: true, message: "请输入出地面积" },
          {
            pattern: constants.REG_EXP.positiveInteger2,
            message: "输入的面积数值格式不对"
          }
        ]
      },
      requiredRules: { required: true, message: "该选项不能为空" },
      moneyRules: [
        { required: true, message: "该选项不能为空" },
        {
          pattern: constants.REG_EXP.positiveNumber,
          message: "请输入正确的金额"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      manageMember: "manageMember/currentManageMember",
      dict: 'dict/dict'
    }),
    trainingTypeOptions() {
      return this.dict.trainType || [];
    },
    trainingOrganizerOptions() {
      return this.dict.organizer || [];
    },
    title() {
      return this.id ? "编辑人员信息" : "新增人员信息";
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentManageMember: "manageMember/updateCurrentManageMember",
      addTraining: "manageMember/addTraining",
      deleteTrainingByIndex: "manageMember/deleteTrainingByIndex",
      addCertificate: "manageMember/addCertificate",
      deleteCertificateByIndex: "manageMember/deleteCertificateByIndex",
      updateExpandedByKeyIndex: 'manageMember/updateExpandedByKeyIndex'
    }),
    ...mapActions({
      createManageMember: "manageMember/createManageMember",
      updateManageMemberById: "manageMember/updateManageMemberById",
      getManageMemberList: "manageMember/getManageMemberList",
      approveManageMemberSubmit: 'manageMember/approveManageMemberSubmit',
      approveFarmEditSubmit: 'farm/approveFarmEditSubmit'
    }),
    show(id, checkId) {
      this.visible = true;
      this.id = id;
      this.checkId = checkId;
    },
    hide() {
      this.id = "";
      this.checkId = "";
      this.visible = false;
    },
    inputHandler(value, key) {
      this.updateCurrentManageMember({ key, value });
    },
    // 培训
    addTrainingHandler() {
      this.addTraining();
    },
    async deleteTrainingHandler(index) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          this.deleteTrainingByIndex({ index });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 证书
    addCertificateHandler() {
      this.addCertificate();
    },
    async deleteCertificateHandler(index) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          this.deleteCertificateByIndex({ index });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.$refs.addressSelect.reset();
        this.$refs.manageMemberForm.clearValidate();
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
    setAddress() {
      let { address, areaCode, detailAddress } = this.$refs.addressSelect.getAddress();
      if (address || areaCode) {
        if (
          _.get(this.manageMember, "address") !== address ||
          _.get(this.manageMember, "areaCode") !== areaCode
        ) {
          this.updateCurrentManageMember({ key: "address", value: address });
          this.updateCurrentManageMember({ key: "areaCode", value: areaCode });
          this.updateCurrentManageMember({ key: "detailAddress", value: detailAddress || '' });
        }
      }
    },
    expandHandler(key, index) {
      this.updateExpandedByKeyIndex({key, index});
    },
    deleteFileHandler(index, key) {
      return _index => {
        let url = _.get(this.manageMember, `${key}.${index}.url`);
        let urlList = url.filter((item, __index) => _index !== __index);
        this.updateCurrentManageMember({
          key: `${key}.${index}.url`,
          value: urlList
        });
      };
    },
    fileUploadHandler(index, key) {
      return data => {
        let url = _.get(this.manageMember, `${key}.${index}.url`);
        let urlList = _.chain(url)
          .concat(data.fileUrl)
          .uniqBy()
          .value();
        this.updateCurrentManageMember({
          key: `${key}.${index}.url`,
          value: urlList
        });
      };
    },
    // 农场主角色 填写更新内容 wangshuo
    editContent(value) {
      this.updateCurrentManageMember({key: 'updateInfo', value})
      this.updateInfo = value;
    },
    async enterHandler() {
      try {
        this.setAddress(); // 设置地址
        let valid = await this.$refs.manageMemberForm.validate();
        if (valid) {
          this.submitDisabled = true;
          // 农场主权限 需要填写更新内容 wangshuo
          if(this.$wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || this.$wsCache.localStorage.get('login').roleType === 'FARM_OWNER') {
            let isEdit = await inputFarmEditContent(this.editContent);
            if(!isEdit) {
              this.submitDisabled = false;
              return;
            }
          }
          let res = await this.approveFarmEditSubmit({id: this.checkId, approveInfo: this.manageMember, updateInfo: this.updateInfo});
          if (res && res.code === 0) {
            await this.$parent.getCheckList();
            this.cancelHandler();
          } else {
            this.$message.error(res.message);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
