<template>
  <div class="farm-form-container">
    <el-form
      :model="farm"
      status-icon
      ref="farmForm"
      label-width="140px"
      :rules="farmRules"
      @submit.native.prevent
      class="my-form"
    >
      <el-row>
        <h4 class="content-sub-title">基础信息</h4>
        <el-col :span="12">
          <el-form-item label="农场名称" prop="name">
            <!-- <span v-if="isEdit">{{farm.name}}</span> -->
            <el-input
              maxlength="20"
              :value="farm.name"
              placeholder="农场名称，20字以内"
              @input="inputHandler($event, 'name')"
            ></el-input>
          </el-form-item>
          <el-form-item label="成立日期" prop="createdAt">
            <el-date-picker
              :value="farm.createdAt"
              type="date"
              @input="inputHandler($event, 'createdAt')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="农场坐标" prop="longitude">
            <span v-if="farm.longitude" class="latitude">E{{farm.longitude}}</span>
            <span v-if="farm.latitude" class="longitude">N{{farm.latitude}}</span>
            <span @click="showMyMap" class="show-btn">{{ isEdit ? '修改' : '设置'}}</span>
          </el-form-item>
          <el-form-item label="经营项目" prop="manageTypes">
            <div class="my-tags">
              <el-tag
                :key="index"
                v-for="(item, index) in farm.manageTypes"
                closable
                :disable-transitions="false"
                @close="deleteManageType(item.name)"
              >{{item.name}}</el-tag>
            </div>
            <search-input :handleSelect="manageTypeSelectHandler" :restaurants="manageTypeOptions"></search-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="农场类型" prop="farmType">
            <el-select
              :value="farm.farmType"
              filterable
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'farmType')"
            >
              <el-option
                v-for="(item, index) in farmTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="creditCode">
            <el-input
              :value="farm.creditCode"
              placeholder="18位代码"
              @input="inputHandler($event, 'creditCode')"
            ></el-input>
          </el-form-item>
          <el-form-item label="农场标签" prop="farmMarks">
            <div class="my-tags">
              <el-tag
                :key="index"
                v-for="(item, index) in farm.farmMarks"
                closable
                :disable-transitions="false"
                @close="deleteFarmMark(item.name)"
              >{{item.name}}</el-tag>
            </div>
            <search-input :handleSelect="farmMarkSelectHandler" :restaurants="farmMarksOptions"></search-input>
            <div class="add-btn" @click="addFarmMark">新增标签</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经营地址" prop="address">
            <p class="address">{{farm.address}}</p>
            <address-select ref="addressSelect"></address-select>
          </el-form-item>
          <el-form-item label="农场简介" prop="description">
            <div class="desc-wrapper">
              <el-input
                class="my-textarea"
                :value="farm.description"
                :maxlength="300"
                placeholder="农场简介，100~300字以内"
                type="textarea"
                @input="inputHandler($event, 'description')"
              ></el-input>
              <span class="desc-prompt">已输入{{farm.description.length}}/300字</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="img-form-item" label="农场封面" prop="farmIndexUrl">
            <el-image
              class="cover-image"
              fit="cover"
              @click="showFarmImage"
              v-if="farm.farmIndexUrl"
              :src="farm.farmIndexUrl">
            </el-image>
            <uploader
              :maxSize="500"
              :status="farm.farmIndexUrl ? 2 : 1"
              :uploadSuccessHandler="imageUploadHandler"
            ></uploader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="img-form-item" label="农场证书" prop="farmCertificates">
            <file-carousel
              v-if="farm.farmCertificates.length > 0"
              :deleteFile="deleteCertificateFileHandler"
              :files="farm.farmCertificates"
            ></file-carousel>
            <uploader
              v-if="farm.farmCertificates.length < 10"
              id="certificates-uploader"
              :uploadSuccessHandler="fileUploadHandler"
            ></uploader>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="seperator-line"></div>
      <el-row>
        <h4 class="content-sub-title">法人信息</h4>
        <el-col :span="12">
          <el-form-item label="姓名" prop="corporationName">
            <el-input
              maxlength="10"
              placeholder="姓名，10字以内"
              :value="farm.corporationName"
              @input="inputHandler($event, 'corporationName')"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="corporationId">
            <el-input
              maxlength="18"
              placeholder="18位身份证号"
              :value="farm.corporationId"
              @input="inputHandler($event, 'corporationId')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="corporationTel">
            <el-input
              maxlength="11"
              placeholder="11位手机号"
              :value="farm.corporationTel"
              @input="inputHandler($event, 'corporationTel')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="住址" prop="corporationAddr">
            <p class="address">{{farm.corporationAddr}}</p>
            <address-select ref="corporationAddrSelect"></address-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="seperator-line"></div>
      <el-row>
        <h4 class="content-sub-title">常务联系人</h4>
        <el-col :span="12">
          <el-form-item label="姓名" prop="contactName">
            <el-input
              maxlength="10"
              placeholder="姓名，10字以内"
              :value="farm.contactName"
              @input="inputHandler($event, 'contactName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactTel">
            <el-input
              maxlength="11"
              placeholder="11位手机号"
              :value="farm.contactTel"
              @input="inputHandler($event, 'contactTel')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="住址" prop="contactAddr">
            <p class="address">{{farm.contactAddr}}</p>
            <address-select ref="contactAddrSelect"></address-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="seperator-line"></div>
      <el-row>
        <h4 class="content-sub-title">党组信息</h4>
        <el-col :span="10">
          <el-form-item label="成立党组织" prop="partyOrg">
            <el-radio @input="inputHandler(true, 'partyOrg')" :value="farm.partyOrg" :label="true">是</el-radio>
            <el-radio
              @input="inputHandler(false, 'partyOrg')"
              :value="farm.partyOrg"
              :label="false"
            >否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item v-if="farm.partyOrg" label="人数" prop="partyMemberNum">
            <el-input
              :value="farm.partyMemberNum"
              placeholder="包含预备党员"
              type="number"
              @input="inputHandler($event, 'partyMemberNum')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <my-map-dialog :setSuccessHandler="setLnglat" ref="myMapDialog"></my-map-dialog>
    <preview-single-image ref="previewSingleImage" :url="farm.farmIndexUrl"></preview-single-image>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import SearchInput from "@/components/SearchInput";
import AddressSelect from "@/components/AddressSelect";
import Uploader from "@/components/Uploader";
import FileCarousel from "@/components/FileCarousel";
import PreviewSingleImage from "@/components/PreviewSingleImage";
import MyMapDialog from "./MyMapDialog";
import constants from "@/util/constants";
export default {
  name: "FarmForm",
  components: {
    SearchInput,
    AddressSelect,
    Uploader,
    FileCarousel,
    MyMapDialog,
    PreviewSingleImage
  },
  data() {
    return {
      farmMarkOptions: constants.FARM_MARK_OPTIONS,
      farmRules: {
        name: [{ required: true, message: "请输入农场名称" }],
        createdAt: [{ required: true, message: "请输入成立日期" }],
        latitude: [{ required: true, message: "请输入经度" }],
        longitude: [{ required: true, message: "请输入纬度" }],
        fieldArea: [{ required: true, message: "请输入地块面积" }],
        address: [{ required: true, message: "请输入农场地址" }],
        feature: [{ required: true, message: "请输入农场特色" }],
        description: [
          { required: true, message: "请输入农场简介" },
          { min: 100, max: 300, message: '农场简介长度在100~300字符之间' }
        ],
        farmType: [{ required: true, message: "请选择农场类型" }],
        // creditCode: [{ required: true, message: "请输入统一社会信用代码" }],
        manageTypes: [{ required: true, message: "请选择农场经营项目" }],
        // farmMarks: [{ required: true, message: "请选择农场标签" }],
        professionalType: [{ required: true, message: "请选择专业级别" }],
        // corporationName: [{ required: true, message: "请输入法人姓名" }],
        // corporationId: [{ required: true, message: "请输入法人身份证号" }],
        corporationTel: [
          // { required: true, message: "请输入法人电话" },
          {
            pattern: constants.REG_EXP.phoneNum,
            message: "请输入正确的电话号码"
          }
        ],
        // corporationAddr: [{ required: true, message: "请输入法人地址" }],
        contactName: [{ required: true, message: "请输入常务联系人姓名" }],
        contactTel: [
          { required: true, message: "请输入常务联系人电话" },
          {
            pattern: constants.REG_EXP.phoneNum,
            message: "请输入正确的电话号码"
          }
        ],
        // contactAddr: [{ required: true, message: "请选择常务联系人住址" }],
        // partyOrg: [{ required: true, message: "请选择是否有党组织" }],
        // partyMemberNum: [{ required: true, message: "请输入党员数量" }],
        farmIndexUrl: [{ required: true, message: "请上传农场封面" }]
      }
    };
  },
  computed: {
    ...mapGetters({
      farm: "farm/currentFarm",
      dict: "dict/dict"
    }),
    farmTypeOptions() {
      return this.dict.farmCategory || [];
    },
    manageTypeOptions() {
      return this.dict.manageRange || [];
    },
    farmMarksOptions() {
      return this.dict.farmMarks || [];
    },
    isEdit() {
      let { id } = this.$route.params;
      return id;
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentFarm: "farm/updateCurrentFarm"
    }),
    ...mapActions({
      getAllDictList: "dict/getAllDictList"
    }),
    inputHandler(value, key) {
      this.updateCurrentFarm({ key, value });
    },
    setAddress() {
      let { address, areaCode } = this.$refs.addressSelect.getAddress();
      if (address || areaCode) {
        if (
          _.get(this.homestead, "address") !== address ||
          _.get(this.homestead, "areaCode") !== areaCode
        ) {
          this.updateCurrentFarm({ key: "address", value: address });
          this.updateCurrentFarm({ key: "areaCode", value: areaCode });
        }
      }
    },
    setCorporationAddress() {
      let { address, areaCode } = this.$refs.corporationAddrSelect.getAddress();
      if (address || areaCode) {
        if (_.get(this.homestead, "corporationAddr") !== address) {
          this.updateCurrentFarm({ key: "corporationAddr", value: address });
        }
      }
    },
    setContactAddress() {
      let { address, areaCode } = this.$refs.contactAddrSelect.getAddress();
      if (address || areaCode) {
        if (_.get(this.homestead, "contactAddr") !== address) {
          this.updateCurrentFarm({ key: "contactAddr", value: address });
        }
      }
    },
    // 经营项目相关操作
    manageTypeSelectHandler(data) {
      let index = this.farm.manageTypes.findIndex(
        item => item.name === data.name
      );
      if (index >= 0) {
        return false;
      }
      let manageTypes = [...this.farm.manageTypes, data];
      this.updateCurrentFarm({ key: "manageTypes", value: manageTypes });
      if (this.farm.manageTypes.length > 0) {
        this.$refs.farmForm.clearValidate(["manageTypes"]);
      }
    },
    deleteManageType(name) {
      let manageTypes = this.farm.manageTypes.filter(
        item => item.name !== name
      );
      this.updateCurrentFarm({ key: "manageTypes", value: manageTypes });
    },
    // 标签操作
    farmMarkSelectHandler(data) {
      let index = this.farm.farmMarks.findIndex(
        item => item.name === data.name
      );
      if (index >= 0) {
        return false;
      }
      console.log(data);
      let farmMarks = [...this.farm.farmMarks, data];
      this.updateCurrentFarm({ key: "farmMarks", value: farmMarks });
      if (this.farm.farmMarks.length > 0) {
        this.$refs.farmForm.clearValidate(["farmMarks"]);
      }
    },
    async addFarmMark() {
      try {
        let prompt = await this.$prompt(`请输入新标签`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputValidator: value => {
            if (value.length > 8) {
              return `新标签不能超过8个字符`;
            }

            let index = this.farmMarksOptions.findIndex(
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
            keyType: _.get(this.farmMarksOptions, "0.keyType"),
            name: prompt.value,
            value: _.get(this.farmMarksOptions, "0.value")
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
    deleteFarmMark(name) {
      let farmMarks = this.farm.farmMarks.filter(item => item.name !== name);
      this.updateCurrentFarm({ key: "farmMarks", value: farmMarks });
    },
    imageUploadHandler(data) {
      let { fileUrl } = data;
      this.updateCurrentFarm({ key: "farmIndexUrl", value: fileUrl });
    },
    fileUploadHandler(data) {
      let farmCertificates = _.chain(this.farm.farmCertificates)
        .concat(data)
        .uniqBy("fileUrl")
        .value();
      this.updateCurrentFarm({
        key: "farmCertificates",
        value: farmCertificates
      });
    },
    deleteCertificateFileHandler(index) {
      let farmCertificates = this.farm.farmCertificates.filter(
        (item, _index) => index !== _index
      );
      this.updateCurrentFarm({
        key: "farmCertificates",
        value: farmCertificates
      });
    },
    showMyMap() {
      this.$refs.myMapDialog.show();
    },
    setLnglat(lnglat) {
      this.updateCurrentFarm({ key: "longitude", value: lnglat[0] });
      this.updateCurrentFarm({ key: "latitude", value: lnglat[1] });
    },
    showFarmImage() {
      this.$refs.previewSingleImage.show();
    }
  }
};
</script>
<style lang="scss" scoped>
.farm-form-container {
  padding-bottom: 100px;
  .latitude,
  .longitude {
    color: #9fa8b8;
  }
  .longitude {
    margin: 0 20px 0 10px;
  }
  .show-btn {
    color: #2eabff;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.farm-form-container {
  .cover-mask {
    img {
      max-width: 100%!important;
    }
  }
}
</style>
