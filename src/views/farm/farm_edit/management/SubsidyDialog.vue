<template>
  <el-dialog
    title="项目信息"
    class="my-dialog"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div class="dialog-body">
      <el-form
        :model="subsidy"
        :rules="validRules"
        ref="subsidyForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基本信息</h4>
            <el-col :span="12">
              <el-form-item label="补贴类型" prop="subsidyType">
                <el-select
                  :value="subsidy.subsidyType"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, 'subsidyType')"
                >
                  <el-option
                    v-for="item in subsidyTypeOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申请负责人" prop="applyManager">
                <el-select
                  :value="subsidy.applyManager"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, 'applyManager')"
                >
                  <el-option
                    v-for="item in managerList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span class="prompt-info-icon">
                  <svg-icon icon-class="info_i_1"></svg-icon>
                  <div class="prompt-info-dialog">
                    <p>数据来自【成员管理】中添加的经营人员</p>
                  </div>
                </span>
              </el-form-item>
              <el-form-item label="政府负责人" prop="governmentAgent">
                  <el-input
                      :value="subsidy.governmentAgent"
                      @input="inputHandler($event, 'governmentAgent')">
                  </el-input>
              </el-form-item>
              <el-form-item label="申请时间" prop="applyTime">
                <el-date-picker
                  :value="subsidy.applyTime"
                  type="date"
                  prefix-icon="''"
                  @input="inputHandler($event, 'applyTime')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="补贴状态" prop="subsidyStatus">
                <el-select
                  :value="subsidy.subsidyStatus"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, 'subsidyStatus')"
                >
                  <el-option
                    v-for="item in subsidyStatusOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="文件编号" prop="fileNo">
                    <el-input
                        :value="subsidy.fileNo"
                        @input="inputHandler($event, 'fileNo')">
                    </el-input>
                </el-form-item>
                <el-form-item label="申请人电话" prop="applicantTel">
                    <el-input
                        :value="subsidy.applicantTel"
                        @input="inputHandler($event, 'applicantTel')">
                    </el-input>
                </el-form-item>
                <el-form-item label="政府负责人电话" prop="governmentAgentTel">
                  <el-input
                    :value="subsidy.governmentAgentTel"
                    @input="inputHandler($event, 'governmentAgentTel')">
                  </el-input>
                </el-form-item>
                <el-form-item label="通过时间" prop="approveTime">
                  <el-date-picker
                    :value="subsidy.approveTime"
                    :picker-options="datePickerOptions()"
                    type="date"
                    @input="inputHandler($event, 'approveTime')"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="补贴金额(元)" prop="subsidyMoney">
                    <el-input
                        :value="subsidy.subsidyMoney"
                        type="number"
                        @input="inputHandler($event, 'subsidyMoney')">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
            <h4 class="content-sub-title">到账情况
              <span v-if="subsidy.accountTotal"
              class="acount-total">到账总计: {{subsidy.accountTotal}}元</span>
            </h4>
            <div class="training-list-container">
              <ul class="training-list">
                <li v-for="(accountArrival, index) in subsidy.accountArrival"
                  :key="index" class="training-item">
                  <div class="training-item-header">
                    <div class="left">
                      <span class="title">记录{{index + 1}}</span>
                    </div>
                    <div class="right">
                      <span @click="deleteAccountArrivalHandler(index)" class="delete-btn">
                        删除
                        <svg-icon icon-class="item_delete_icon"/>
                      </span>
                      <span
                        @click="expandHandler('accountArrival', index)"
                        :class="['expand-btn', accountArrival.isExpanded && 'is-expanded']">
                        {{accountArrival.isExpanded ? '收起' : '展开'}}
                        <svg-icon icon-class="array_top"/>
                      </span>
                    </div>
                  </div>
                  <div v-if="accountArrival.isExpanded" class="training-item-content">
                    <el-col :span="12">
                      <el-form-item label="到账金额(元)"
                        :prop="`accountArrival.${index}.amount`"
                        :rules="moneyRules"
                      >
                        <el-input
                            :value="accountArrival.amount"
                            type="number"
                            @input="inputHandler($event, `accountArrival.${index}.amount`)">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="到账日期"
                        :prop="`accountArrival.${index}.date`"
                        :rules="requiredRules"
                      >
                        <el-date-picker
                          class="my-date-picker"
                          :value="accountArrival.date"
                          type="date"
                          prefix-icon="''"
                          @input="inputHandler($event, `accountArrival.${index}.date`)"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item label="到账方式"
                        :prop="`accountArrival.${index}.mode`"
                        :rules="requiredRules"
                      >
                        <el-select
                          :value="accountArrival.mode"
                          clearable
                          placeholder="请选择"
                          @input="inputHandler($event, `accountArrival.${index}.mode`)">
                          <el-option
                            v-for="item in accountArrivalTypeOptions"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="img-form-item" label="使用证明"
                        :prop="`accountArrival.${index}.fileList`"
                        :rules="requiredRules">
                        <file-carousel
                          v-if="accountArrival.fileList.length > 0"
                          :deleteFile="deleteFileHandler(index, 'accountArrival')"
                          :files="accountArrival.fileList"></file-carousel>
                        <uploader v-if="accountArrival.fileList.length < 5" :id="`accountArrivalFileUploader${index}`" :uploadSuccessHandler="fileUploadHandler(index, 'accountArrival')"></uploader>
                      </el-form-item>
                    </el-col>
                  </div>
                </li>
              </ul>
              <div class="add-btn-container">
                <span @click="addAccountArrivalHandler" class="add-btn">
                  <svg-icon icon-class="add_plus"/>
                  添加条目
                </span>
              </div>
            </div>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
            <h4 class="content-sub-title">使用明细</h4>
            <div class="training-list-container">
              <ul class="training-list">
                <li v-for="(_useDetail, index) in subsidy.useDetail"
                  :key="index" class="training-item">
                  <div class="training-item-header">
                    <div class="left">
                      <span class="title">记录{{index + 1}}</span>
                    </div>
                    <div class="right">
                      <span @click="deleteUseDetailHandler(index)" class="delete-btn">
                        删除
                        <svg-icon icon-class="item_delete_icon"/>
                      </span>
                      <span
                        @click="expandHandler('useDetail', index)"
                        :class="['expand-btn', _useDetail.isExpanded && 'is-expanded']">
                        {{_useDetail.isExpanded ? '收起' : '展开'}}
                        <svg-icon icon-class="array_top"/>
                      </span>
                    </div>
                  </div>
                  <div v-if="_useDetail.isExpanded" class="training-item-content">
                    <el-col :span="12">
                      <el-form-item label="费用金额(元)"
                        :prop="`useDetail.${index}.amount`"
                        :rules="moneyRules"
                      >
                        <el-input
                            :value="_useDetail.amount"
                            type="number"
                            @input="inputHandler($event, `useDetail.${index}.amount`)">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="费用类型"
                        :prop="`useDetail.${index}.type`"
                        :rules="requiredRules"
                      >
                        <el-select
                          :value="_useDetail.type"
                          clearable
                          placeholder="请选择"
                          @input="inputHandler($event, `useDetail.${index}.type`)"
                        >
                          <el-option
                            v-for="item in useDetailTypeOptions"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="资金使用凭证号"
                        :prop="`useDetail.${index}.voucherNo`"
                        :rules="requiredRules"
                      >
                        <el-input
                            :value="_useDetail.voucherNo"
                            @input="inputHandler($event, `useDetail.${index}.voucherNo`)">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="费用产生时间"
                        :prop="`useDetail.${index}.date`"
                        :rules="requiredRules"
                      >
                        <el-date-picker
                          :value="_useDetail.date"
                          type="date"
                          prefix-icon="''"
                          @input="inputHandler($event, `useDetail.${index}.date`)"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="img-form-item" label="使用证明"
                        :prop="`useDetail.${index}.fileList`"
                        :rules="requiredRules">
                        <file-carousel
                          v-if="_useDetail.fileList.length > 0"
                          :deleteFile="deleteFileHandler(index, 'useDetail')" :files="_useDetail.fileList"></file-carousel>
                        <uploader
                          v-if="_useDetail.fileList.length < 5"
                          :id="`useDetailFileUploader${index}`" :uploadSuccessHandler="fileUploadHandler(index, 'useDetail')"></uploader>
                      </el-form-item>
                    </el-col>
                  </div>
                </li>
              </ul>
              <div class="add-btn-container">
                <span @click="addUseDetailHandler" class="add-btn">
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
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import FileCarousel from '@/components/FileCarousel';
import AddressSelect from '@/components/AddressSelect';
import Uploader from '@/components/Uploader';
import constants from '@/util/constants';
import {inputFarmEditContent} from "@/util/asyncFun";
export default {
  name: 'SubsidyDialog',
  components: {FileCarousel, AddressSelect, Uploader},
  data() {
    let checkPhoneNum = (rule, value, callback) => {
      if (!_.isEmpty(value)) {
        if (!constants.REG_EXP.phoneNum.test(value)) {
          callback(new Error('请输入正确的电话号码'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      submitDisabled: false,
      visible: false,
      managerList: [],
      id: '',
      validRules: {
        subsidyType: [{required: true, message: "请选择补贴类型"}],
        // applyManager: [{required: true, message: "请选择申请负责人"}],
        // governmentAgent: [{required: true, message: "请输入政府负责人"}],
        applyTime: [{required: true, message: "请选择申请时间"}],
        subsidyStatus: [{required: true, message: "请选择补贴状态"}],
        fileNo: [{required: true, message: "请输入文件编号"}],
        applicantTel: [
          { validator: checkPhoneNum }
          // {required: true, message: "请输入申请人电话"},
          // {pattern: constants.REG_EXP.phoneNum, message: '请输入正确的电话号码'}
        ],
        governmentAgentTel: [
          { validator: checkPhoneNum }
          // {required: true, message: "请输入政府负责人电话"},
          // {pattern: constants.REG_EXP.phoneNum, message: '请输入正确的电话号码'}
        ],
        approveTime: [{required: true, message: "请选择通过时间"}],
        subsidyMoney: [
          {required: true, message: "请输入补贴金额"},
          {pattern: constants.REG_EXP.positiveNumber, message: '请输入正确的金额'}
        ]
      },
      requiredRules: {required: true, message: '该选项不能为空'},
      moneyRules: [
        {required: true, message: '该选项不能为空'},
        {pattern: constants.REG_EXP.positiveNumber, message: '请输入正确的金额'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      subsidy: "subsidy/currentSubsidy",
      dict: 'dict/dict'
    }),
    subsidyTypeOptions() {
      return this.dict.subsidyType || [];
    },
    subsidyStatusOptions() {
      return this.dict.approveType || [];
    },
    accountArrivalTypeOptions() {
      return this.dict.accountType || [];
    },
    useDetailTypeOptions() {
      return constants.USE_DETAIL_TYPE_OPTIONS;
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentSubsidy: "subsidy/updateCurrentSubsidy",
      addAccountArrival: "subsidy/addAccountArrival",
      deleteAccountArrivalByIndex: "subsidy/deleteAccountArrivalByIndex",
      addUseDetail: "subsidy/addUseDetail",
      deleteUseDetailByIndex: "subsidy/deleteUseDetailByIndex",
      updateExpandedByKeyIndex: "subsidy/updateExpandedByKeyIndex"
    }),
    ...mapActions({
      createSubsidy: 'subsidy/createSubsidy',
      updateSubsidyById: 'subsidy/updateSubsidyById',
      getSubsidyList: 'subsidy/getSubsidyList'
    }),
    datePickerOptions() {
      let _this = this;
      return {
        disabledDate(date) {
          if (_this.subsidy.applyTime) {
            let startedTime = new Date(_this.subsidy.applyTime).getTime();
            let endedTime = new Date(date).getTime();
            return endedTime < startedTime;
          } else {
            return true;
          }
        }
      };
    },
    show(id) {
      this.visible = true;
      this.id = id;
    },
    hide() {
      this.id = '';
      this.visible = false;
    },
    inputHandler(value, key) {
      this.updateCurrentSubsidy({key, value});
    },
    // 农场主角色 填写更新内容 wangshuo
    editContent(value) {
      this.updateCurrentSubsidy({key: 'updateInfo', value})
    },    
    expandHandler(key, index) {
      this.updateExpandedByKeyIndex({key, index});
    },
    // 到账情况
    addAccountArrivalHandler() {
      this.addAccountArrival();
    },
    async deleteAccountArrivalHandler(index) {
      try {
        let confirm = await this.$confirm('你确定要删除吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        if (confirm) {
          this.deleteAccountArrivalByIndex({index});
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 使用明细
    addUseDetailHandler() {
      this.addUseDetail();
    },
    async deleteUseDetailHandler(index) {
      try {
        let confirm = await this.$confirm('你确定要删除吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        if (confirm) {
          this.deleteUseDetailByIndex({index});
        }
      } catch (err) {
        console.log(err);
      }
    },
    async openDialogHandler() {
      try {
        await this.$nextTick();
        this.submitDisabled = false;
        let {id} = this.$route.params;
        let res = await this.$service.getManageMemberList({farmId: id});
        if (res && res.code === 0) {
          if (_.isArray(res.data.list)) {
            this.managerList = res.data.list.map((item) => {
              return {
                label: item.name,
                value: item.name
              };
            });
          }
        }
        this.$refs.subsidyForm.clearValidate();
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
    deleteFileHandler(index, key) {
      return (_index) => {
        let fileList = _.get(this.subsidy, `${key}.${index}.fileList`);
        let _fileList = fileList.filter((item, __index) => _index !== __index);
        this.updateCurrentSubsidy({key: `${key}.${index}.fileList`, value: _fileList});
      }
    },
    fileUploadHandler(index, key) {
      return (data) => {
        let fileList = _.get(this.subsidy, `${key}.${index}.fileList`);
        let _fileList = _.chain(fileList)
                        .concat(data)
                        .uniqBy('fileUrl')
                        .value();
        this.updateCurrentSubsidy({key: `${key}.${index}.fileList`, value: _fileList});
      };
    },
    delay() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 4000);
      });
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.subsidyForm.validate();
        if (valid) {
          let {id} = this.$route.params;
          this.submitDisabled = true;
          // 农场主权限 需要填写更新内容 wangshuo
          if(this.$wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || this.$wsCache.localStorage.get('login').roleType === 'FARM_OWNER') {
            let isEdit = await inputFarmEditContent(this.editContent);
            if(!isEdit) {
              this.submitDisabled = false;
              return;
            }
          }            
          if (this.id) {          
            let res = await this.updateSubsidyById({id: this.id, farmId: id});
            if (res && res.code === 0) {
              this.cancelHandler();
              await this.getSubsidyList(id);
            }
          } else {
            let res = await this.createSubsidy(id);
            if (res && res.code === 0) {
              this.cancelHandler();
              await this.getSubsidyList(id);
            }
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
