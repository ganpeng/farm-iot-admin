<template>
  <el-dialog
    title="耕地信息"
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
        :model="land"
        :rules="validRules"
        ref="landForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <el-row>
            <h4 class="content-sub-title">基本信息</h4>
            <el-col :span="12">
                <el-form-item label="地块编码">
                  <span v-if="land.code">{{land.code}}</span>
                  <span v-else class="no-value">创建后自动生成</span>
                </el-form-item>
                <el-form-item label="面积(公顷)" prop="area">
                    <el-input
                        :value="land.area"
                        type="number"
                        @input="inputHandler($event, 'area', 'isArea')">
                    </el-input>
                </el-form-item>
                <el-form-item label="地块形式" prop="form">
                  <el-select
                    :value="land.form"
                    clearable
                    placeholder="请选择"
                    @input="inputHandler($event, `form`)"
                  >
                    <el-option
                      v-for="item in formOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="地块名称" prop="name">
                  <el-input
                      :value="land.name"
                      maxlength="10"
                      @input="inputHandler($event, 'name')">
                  </el-input>
                </el-form-item>
                <el-form-item label="水利条件" prop="irrigation">
                  <el-select
                    :value="land.irrigation"
                    clearable
                    placeholder="请选择"
                    @input="inputHandler($event, `irrigation`)"
                  >
                    <el-option
                      v-for="item in irrigationOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="img-form-item" label="地块封面" prop="farmLandUrl">
                <el-image
                  class="cover-image"
                  fit="cover"
                  @click="showFarmImage"
                  v-if="land.farmLandUrl"
                  :src="land.farmLandUrl">
                </el-image>
                <uploader
                  :maxSize="500"
                  :status="land.farmLandUrl ? 2 : 1"
                  :uploadSuccessHandler="imageUploadHandler"
                ></uploader>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址" prop="address">
                <p class="address">{{land.address}}{{land.detailAddress}}</p>
                <address-select ref="addressSelect"></address-select>
              </el-form-item>
            </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
            <h4 class="content-sub-title">地块流转方</h4>
            <div class="training-list-container">
              <ul class="training-list">
                <li v-for="(holder, index) in land.landHolderList"
                  :key="index" class="training-item">
                  <div class="training-item-header">
                    <div class="left">
                      <span class="title">流转方{{index + 1}}</span>
                    </div>
                    <div class="right">
                      <span @click="deleteHolderHandler(index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                      </span>
                      <span
                        @click="expandHandler('landHolderList', index)"
                        :class="['expand-btn', holder.isExpanded && 'is-expanded']">
                        {{holder.isExpanded ? '收起' : '展开'}}
                        <svg-icon icon-class="array_top"/>
                      </span>
                    </div>
                  </div>
                  <div v-if="holder.isExpanded" class="training-item-content">
                    <el-col :span="12">
                      <el-form-item label="姓名"
                        :prop="`landHolderList.${index}.name`"
                        :rules="requiredRules"
                      >
                        <el-input
                            :value="holder.name"
                            @input="inputHandler($event, `landHolderList.${index}.name`)">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="身份证"
                        :prop="`landHolderList.${index}.identityId`"
                        :rules="requiredRules"
                      >
                        <el-input
                            :value="holder.identityId"
                            @input="inputHandler($event, `landHolderList.${index}.identityId`)">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="联系电话"
                        :prop="`landHolderList.${index}.mobile`"
                        :rules="mobileRules"
                      >
                        <el-input
                            :value="holder.mobile"
                            @input="inputHandler($event, `landHolderList.${index}.mobile`)">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="合同面积(公顷)"
                        :prop="`landHolderList.${index}.contractArea`"
                        :rules="areaRules"
                      >
                        <el-input
                            :value="holder.contractArea"
                            type="number"
                            @input="inputHandler($event, `landHolderList.${index}.contractArea`, 'isArea')">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="流转期限"
                        :prop="`landHolderList.${index}.dateRange`"
                        :rules="requiredRules"
                      >
                        <el-date-picker
                          :value="holder.dateRange"
                          type="daterange"
                          @input="inputHandler($event, `landHolderList.${index}.dateRange`)"
                          value-format="timestamp"
                          :unlink-panels="true"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实测面积(公顷)"
                        :prop="`landHolderList.${index}.area`"
                        :rules="areaRules"
                      >
                        <el-input
                            :value="holder.area"
                            type="number"
                            @input="inputHandler($event, `landHolderList.${index}.area`, 'isArea')">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="确权面积(公顷)"
                        :prop="`landHolderList.${index}.authenticArea`"
                        :rules="areaRules"
                      >
                        <el-input
                            :value="holder.authenticArea"
                            type="number"
                            @input="inputHandler($event, `landHolderList.${index}.authenticArea`, 'isArea')">
                        </el-input>
                      </el-form-item>
                      <el-form-item class="img-form-item" label="流转合同"
                        :prop="`landHolderList.${index}.contractPdfList`"
                        :rules="requiredRules">
                        <file-carousel
                          v-if="holder.contractPdfList.length > 0"
                          :deleteFile="deleteFileHandler(index)" :files="holder.contractPdfList"></file-carousel>
                        <uploader v-if="holder.contractPdfList.length < 5" :id="`fileUploader${index}`" :uploadSuccessHandler="fileUploadHandler(index)"></uploader>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="地块地址"
                        :prop="`landHolderList.${index}.address`"
                        :rules="requiredRules"
                      >
                        <p class="address">{{holder.address}}{{holder.detailAddress}}</p>
                        <address-select ref="holderAddressSelect"></address-select>
                      </el-form-item>
                    </el-col>
                  </div>
                </li>
              </ul>
              <div class="add-btn-container">
                <span @click="addHolderHandler" class="add-btn">
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
    <preview-single-image ref="previewSingleImage" :url="land.farmLandUrl"></preview-single-image>
  </el-dialog>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import FileCarousel from '@/components/FileCarousel';
import Uploader from '@/components/Uploader';
import AddressSelect from '@/components/AddressSelect';
import PreviewSingleImage from "@/components/PreviewSingleImage";
import constants from '@/util/constants';
import {inputFarmEditContent} from "@/util/asyncFun";
export default {
  name: 'LandDialog',
  components: {FileCarousel, AddressSelect, Uploader, PreviewSingleImage},
  data() {
    return {
      submitDisabled: false,
      visible: false,
      id: '',
      irrigationOptions: [], // 水利条件
      validRules: {
        name: [{required: true, message: "请输入地块名称"}],
        area: [
          {required: true, message: "请输入面积"},
          {pattern: constants.REG_EXP.positiveInteger2, message: "输入的面积数值格式不对"}
        ],
        form: [{required: true, message: "请选择地块形式"}],
        irrigation: [{required: true, message: "请选择水利条件"}],
        gender: [{required: true, message: "请选择性别"}],
        address: [{required: true, message: "请选择住址"}],
        farmLandUrl: [{required: true, message: "请选择地图封面图"}],
        isFundInvest: [{required: true, message: "请选择是否现金出资"}],
        isLandInvest: [{required: true, message: "请选择是否土地出资"}],
        fundAmount: [{required: true, message: "请输入现金出资金额"}],
        landArea: [{required: true, message: "请输入土地折算金额"}]
      },
      requiredRules: {required: true, message: '该选项不能为空'},
      mobileRules: [
        { required: true, message: "该选项不能为空" },
        { pattern: constants.REG_EXP.phoneNum, message: "请输入正确的电话号码" }
      ],
      areaRules: [
        {required: true, message: '该选项不能为空'},
        {pattern: constants.REG_EXP.positiveInteger2, message: "输入的面积数值格式不对"}
      ]
    };
  },
  computed: {
    ...mapGetters({
      land: "land/currentLand",
      dict: 'dict/dict',
      dictList: 'dict/dictList'
    }),
    // irrigationOptions() {
    //   return this.dict.irrigation || [];
    // },
    formOptions() {
      return this.dict.landForm || [];
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentLand: "land/updateCurrentLand",
      addHolder: "land/addHolder",
      deleteHolderByIndex: "land/deleteHolderByIndex",
      updateExpandedByKeyIndex: 'land/updateExpandedByKeyIndex'
    }),
    ...mapActions({
      createLand: 'land/createLand',
      updateLandById: 'land/updateLandById',
      getLandList: 'land/getLandList'
    }),
    show(id) {
      this.visible = true;
      this.id = id;
    },
    hide() {
      this.id = '';
      this.visible = false;
    },
    inputHandler(value, key, type) {
      this.updateCurrentLand({key, value});
      if (key === 'form') {
        this.updateCurrentLand({key: 'irrigation', value: ''});
        this.setIrrigationOptions(value);
      }
    },
    // 农场主角色 填写更新内容 wangshuo
    editContent(value) {
      this.updateCurrentLand({key: 'updateInfo', value})
    },
    // 流转方
    addHolderHandler() {
      this.addHolder();
    },
    async deleteHolderHandler(index) {
      try {
        let confirm = await this.$confirm('你确定要删除吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        if (confirm) {
          this.deleteHolderByIndex({index});
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
        this.$refs.landForm.clearValidate();
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
      let {address, areaCode, detailAddress} = this.$refs.addressSelect.getAddress();
      if (address || areaCode) {
        if (_.get(this.land, 'address') !== address
          || _.get(this.land, 'areaCode') !== areaCode) {
          this.updateCurrentLand({key: 'address', value: address});
          this.updateCurrentLand({key: 'areaCode', value: areaCode});
          this.updateCurrentLand({key: 'detailAddress', value: detailAddress || ''});
        }
      }
    },
    // 下拉选项相关
    setIrrigationOptions(value) {
      if (value) {
        let form = this.formOptions.find(item => item.name === value);
        let irrigationOptions = this.dictList.filter(
          item => parseInt(item.parentId) === _.get(form, "id")
        );
        this.irrigationOptions = irrigationOptions;
      } else {
        this.plantNameOptions = [];
      }
    },
    setHolderListAddress() {
      let landHolderList = this.land.landHolderList.map((item, index) => {
        let {address, areaCode, detailAddress} = _.get(this.$refs, `holderAddressSelect.${index}`).getAddress();
        if (address || areaCode) {
          if (_.get(item, 'address') !== address
            || _.get(item, 'areaCode') !== areaCode) {
              item.address = address;
              item.areaCode = areaCode;
              item.detailAddress = detailAddress || '';
          }
        }
        return item;
      });
      this.updateCurrentLand({key: 'landHolderList', value: landHolderList});
    },
    deleteFileHandler(index) {
      return (_index) => {
        let url = _.get(this.land, `landHolderList.${index}.contractPdfList`);
        let urlList = url.filter((item, __index) => _index !== __index);
        this.updateCurrentLand({key: `landHolderList.${index}.contractPdfList`, value: urlList});
      }
    },
    expandHandler(key, index) {
      this.updateExpandedByKeyIndex({key, index});
    },
    fileUploadHandler(index) {
      return (data) => {
        let contractPdfList = _.get(this.land, `landHolderList.${index}.contractPdfList`);
        let urlList = _.chain(contractPdfList)
                        .concat(data)
                        .uniqBy('fileUrl')
                        .value();
        this.updateCurrentLand({key: `landHolderList.${index}.contractPdfList`, value: urlList});
      };
    },
    validArea() {
      let amount = this.land.landHolderList.reduce((res, curr) => {
        res += parseFloat(curr.contractArea);
        return res;
      }, 0);
      return this.land.area >= amount;
    },
    showFarmImage() {
      this.$refs.previewSingleImage.show();
    },
    imageUploadHandler(data) {
      let { fileUrl } = data;
      this.updateCurrentLand({ key: "farmLandUrl", value: fileUrl });
    },
    async enterHandler() {
      try {
        this.setAddress(); // 设置地址
        this.setHolderListAddress(); // 设置流转方的地址
        let valid = await this.$refs.landForm.validate();
        if (valid) {
          if (this.validArea()) {
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
              let res = await this.updateLandById({id: this.id, farmId: id});
              if (res && res.code === 0) {
                await this.getLandList(id);
                this.cancelHandler();
              }
            } else {
              let res = await this.createLand(id);
              if (res && res.code === 0) {
                await this.getLandList(id);
                this.cancelHandler();
              }
            }
          } else {
            this.$message.error('合同面积不得超过地块面积');
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
.no-value {
  font-size: 14px;
  color: #5F697C;
}
</style>
