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
        :model="governmentProject"
        :rules="validRules"
        ref="governmentProjectForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基本信息</h4>
            <el-col :span="12">
                <el-form-item label="项目名称" prop="projectName">
                    <el-input
                        :value="governmentProject.projectName"
                        @input="inputHandler($event, 'projectName')">
                    </el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="belongDepartment">
                    <el-input
                        :value="governmentProject.belongDepartment"
                        @input="inputHandler($event, 'belongDepartment')">
                    </el-input>
                </el-form-item>
                <el-form-item label="负责人电话" prop="managerTel">
                    <el-input
                        :value="governmentProject.managerTel"
                        @input="inputHandler($event, 'managerTel')">
                    </el-input>
                </el-form-item>
                <el-form-item label="项目周期" prop="dateRange">
                  <el-date-picker
                    :value="governmentProject.dateRange"
                    type="daterange"
                    @input="inputHandler($event, 'dateRange')"
                    value-format="timestamp"
                    :unlink-panels="true"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="项目总额(元)" prop="projectTotal">
                    <el-input
                      :value="governmentProject.projectTotal"
                      type="number"
                      @input="inputHandler($event, 'projectTotal')">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目级别" prop="projectClass">
                <el-select
                  :value="governmentProject.projectClass"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, 'projectClass')"
                >
                  <el-option
                    v-for="item in projectClassOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目负责人" prop="projectManager">
                  <el-input
                      :value="governmentProject.projectManager"
                      @input="inputHandler($event, 'projectManager')">
                  </el-input>
              </el-form-item>
              <el-form-item label="项目阶段" prop="projectStage">
                <el-select
                  :value="governmentProject.projectStage"
                  clearable
                  placeholder="请选择"
                  @input="inputHandler($event, 'projectStage')"
                >
                  <el-option
                    v-for="item in projectStageOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="政府拨款(元)" prop="appropriation">
                  <el-input
                    :value="governmentProject.appropriation"
                    type="number"
                    @input="inputHandler($event, 'appropriation')">
                  </el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
            <h4 class="content-sub-title">到账情况
              <span v-if="governmentProject.accountTotal"
              class="acount-total">到账总计: {{governmentProject.accountTotal}}元</span>
            </h4>
            <div class="training-list-container">
              <ul class="training-list">
                <li v-for="(accountArrival, index) in governmentProject.accountArrival"
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
                        :rules="requiredRules"
                      >
                        <file-carousel v-if="accountArrival.fileList.length > 0" :deleteFile="deleteFileHandler(index, 'accountArrival')" :files="accountArrival.fileList"></file-carousel>
                        <uploader :id="`accountArrivalFileUploader${index}`" :uploadSuccessHandler="fileUploadHandler(index, 'accountArrival')"></uploader>
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
                <li v-for="(_useDetail, index) in governmentProject.useDetail"
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
                        :rules="requiredRules"
                      >
                        <file-carousel v-if="_useDetail.fileList.length > 0" :deleteFile="deleteFileHandler(index, 'useDetail')" :files="_useDetail.fileList"></file-carousel>
                        <uploader v-if="_useDetail.fileList.length < 5" :id="`fileUploader${index}`" :uploadSuccessHandler="fileUploadHandler(index, 'useDetail')"></uploader>
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
  name: 'GovernmentProjectDialog',
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
      id: '',
      validRules: {
        projectName: [{required: true, message: "请输入项目名"}],
        // belongDepartment: [{required: true, message: "请输入所属部门"}],
        // projectManager: [{required: true, message: "请输入项目负责人"}],
        managerTel: [
          { validator: checkPhoneNum }
          // {required: true, message: "请输入负责人电话"},
          // {pattern: constants.REG_EXP.phoneNum, message: '请输入正确的电话号码'}
        ],
        dateRange: [{required: true, message: "请选择项目周期"}],
        projectTotal: [
          {required: true, message: "请输入项目总额"},
          {pattern: constants.REG_EXP.positiveNumber, message: '请输入正确的金额'}
        ],
        projectClass: [{required: true, message: "请选择项目级别"}],
        projectStage: [{required: true, message: "请选择项目阶段"}],
        appropriation: [
          {required: true, message: "请输入政府拨款"},
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
      governmentProject: "governmentProject/currentGovernmentProject",
      dict: 'dict/dict'
    }),
    projectClassOptions() {
      return this.dict.classType || [];
    },
    projectStageOptions() {
      return this.dict.stageType || [];
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
      updateCurrentGovernmentProject: "governmentProject/updateCurrentGovernmentProject",
      addAccountArrival: "governmentProject/addAccountArrival",
      deleteAccountArrivalByIndex: "governmentProject/deleteAccountArrivalByIndex",
      addUseDetail: "governmentProject/addUseDetail",
      deleteUseDetailByIndex: "governmentProject/deleteUseDetailByIndex",
      updateExpandedByKeyIndex: "governmentProject/updateExpandedByKeyIndex"
    }),
    ...mapActions({
      createGovernmentProject: 'governmentProject/createGovernmentProject',
      updateGovernmentProjectById: 'governmentProject/updateGovernmentProjectById',
      getGovernmentProjectList: 'governmentProject/getGovernmentProjectList',
      approveFarmEditSubmit: 'farm/approveFarmEditSubmit'
    }),
    show(id, checkId) {
      this.visible = true;
      this.id = id;
      this.checkId = checkId;
    },
    hide() {
      this.id = '';
      this.checkId = '';
      this.visible = false;
    },
    inputHandler(value, key) {
      this.updateCurrentGovernmentProject({key, value});
    },
    // 农场主角色 填写更新内容 wangshuo
    editContent(value) {
      this.updateCurrentGovernmentProject({key: 'updateInfo', value})
      this.updateInfo = value;
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
        this.submitDisabled = false;
        await this.$nextTick();
        this.$refs.governmentProjectForm.clearValidate();
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
        let fileList = _.get(this.governmentProject, `${key}.${index}.fileList`);
        let _fileList = fileList.filter((item, __index) => _index !== __index);
        this.updateCurrentGovernmentProject({key: `${key}.${index}.fileList`, value: _fileList});
      }
    },
    fileUploadHandler(index, key) {
      return (data) => {
        let fileList = _.get(this.governmentProject, `${key}.${index}.fileList`);
        let _fileList = _.chain(fileList)
                        .concat(data)
                        .uniqBy('fileUrl')
                        .value();
        this.updateCurrentGovernmentProject({key: `${key}.${index}.fileList`, value: _fileList});
      };
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.governmentProjectForm.validate();
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
          let res = await this.approveFarmEditSubmit({id: this.checkId, approveInfo: this.governmentProject, updateInfo: this.updateInfo});
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
