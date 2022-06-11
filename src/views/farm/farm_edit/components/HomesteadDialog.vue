<template>
  <el-dialog
    title="宅基地信息"
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
        :model="homestead"
        :rules="validRules"
        ref="homesteadForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent
      >
        <el-row>
          <h4 class="content-sub-title">基本信息</h4>
          <el-col :span="12">
            <el-form-item label="地块编码">
              <span v-if="homestead.code">{{homestead.code}}</span>
              <span v-else class="no-value">创建后自动生成</span>
            </el-form-item>
            <el-form-item label="面积(平米)" prop="area">
              <el-input :value="homestead.area" @input="inputHandler($event, 'area')"></el-input>
            </el-form-item>
            <el-form-item label="是否闲置" prop="idle">
              <el-radio @input="inputHandler(true, 'idle')" :value="homestead.idle" :label="true">是</el-radio>
              <el-radio
                @input="inputHandler(false, 'idle')"
                :value="homestead.idle"
                :label="false"
              >否</el-radio>
            </el-form-item>
            <el-form-item label="是否有房屋" prop="house">
              <el-radio
                @input="inputHandler(true, 'house')"
                :value="homestead.house"
                :label="true"
              >是</el-radio>
              <el-radio
                @input="inputHandler(false, 'house')"
                :value="homestead.house"
                :label="false"
              >否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地块名称" prop="name">
              <el-input :value="homestead.name" @input="inputHandler($event, 'name')"></el-input>
            </el-form-item>
            <el-form-item label="地块用途" prop="purpose">
              <el-select
                :value="homestead.purpose"
                clearable
                placeholder="请选择"
                @input="inputHandler($event, 'purpose')"
              >
                <el-option
                  v-for="item in purposeOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="房产证" prop="propertyCertificate">
              <el-radio
                @input="inputHandler(true, 'propertyCertificate')"
                :value="homestead.propertyCertificate"
                :label="true"
              >是</el-radio>
              <el-radio
                @input="inputHandler(false, 'propertyCertificate')"
                :value="homestead.propertyCertificate"
                :label="false"
              >否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <p class="address">{{homestead.address}}</p>
              <address-select ref="addressSelect"></address-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="seperator-line"></div>
        <el-row>
          <h4 class="content-sub-title">地块流转方</h4>
          <div class="training-list-container">
            <ul class="training-list">
              <li
                v-for="(holder, index) in homestead.homesteadHolderList"
                :key="index"
                class="training-item"
              >
                <div class="training-item-header">
                  <div class="left">
                    <span class="title">流转方{{index + 1}}</span>
                  </div>
                  <div class="right">
                    <span @click="deleteHolderHandler(index)" class="delete-btn">删除</span>
                    <!-- <span class="expand-btn">收起</span> -->
                  </div>
                </div>
                <div class="training-item-content">
                  <el-col :span="12">
                    <el-form-item
                      label="姓名"
                      :prop="`homesteadHolderList.${index}.name`"
                      :rules="requiredRules"
                    >
                      <el-input
                        :value="holder.name"
                        @input="inputHandler($event, `homesteadHolderList.${index}.name`)"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="身份证"
                      :prop="`homesteadHolderList.${index}.identityId`"
                      :rules="requiredRules"
                    >
                      <el-input
                        :value="holder.identityId"
                        @input="inputHandler($event, `homesteadHolderList.${index}.identityId`)"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="联系电话"
                      :prop="`homesteadHolderList.${index}.mobile`"
                      :rules="mobileRules"
                    >
                      <el-input
                        :value="holder.mobile"
                        type="number"
                        @input="inputHandler($event, `homesteadHolderList.${index}.mobile`)"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="流转期限"
                      :prop="`homesteadHolderList.${index}.dateRange`"
                      :rules="requiredRules"
                    >
                      <el-date-picker
                        :value="holder.dateRange"
                        type="daterange"
                        @input="inputHandler($event, `homesteadHolderList.${index}.dateRange`)"
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
                      label="流转合同"
                      :prop="`homesteadHolderList.${index}.contractPdfList`">
                      <file-carousel
                        v-if="holder.contractPdfList.length > 0"
                        :deleteFile="deleteFileHandler(index)"
                        :files="holder.contractPdfList"
                      ></file-carousel>
                      <uploader
                        v-if="holder.contractPdfList.length < 5"
                        :id="`fileUploader${index}`"
                        :uploadSuccessHandler="fileUploadHandler(index)"
                      ></uploader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="地块地址"
                      :prop="`homesteadHolderList.${index}.address`"
                      :rules="requiredRules"
                    >
                      <p class="address">{{holder.address}}</p>
                      <address-select ref="holderAddressSelect"></address-select>
                    </el-form-item>
                  </el-col>
                </div>
              </li>
            </ul>
            <div v-if="homestead.homesteadHolderList.length === 0" class="add-btn-container">
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
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import FileCarousel from "@/components/FileCarousel";
import Uploader from "@/components/Uploader";
import AddressSelect from "@/components/AddressSelect";
import constants from "@/util/constants";
import {inputFarmEditContent} from "@/util/asyncFun";
export default {
  name: "HomesteadDialog",
  components: { FileCarousel, AddressSelect, Uploader },
  data() {
    return {
      submitDisabled: false,
      visible: false,
      id: "",
      validRules: {
        name: [{required: true, message: "请输入地块名称"}],
        area: [
          { required: true, message: "请输入面积" },
          {
            pattern: constants.REG_EXP.positiveInteger2,
            message: "输入的面积数值格式不对"
          }
        ],
        idle: [{ required: true, message: "请选择是否闲置" }],
        purpose: [{ required: true, message: "请选择地块用途" }],
        address: [{ required: true, message: "请选择住址" }],
        propertyCertificate: [
          { required: true, message: "请选择是否有房产证" }
        ],
        isLandInvest: [{ required: true, message: "请选择是否土地出资" }],
        house: [{ required: true, message: "请选择是否有房屋" }]
      },
      requiredRules: { required: true, message: "该选项不能为空" },
      mobileRules: [
        { required: true, message: "该选项不能为空" },
        { pattern: constants.REG_EXP.phoneNum, message: "请输入正确的电话号码" }
      ]
    };
  },
  computed: {
    ...mapGetters({
      homestead: "homestead/currentHomestead",
      dict: "dict/dict"
    }),
    purposeOptions() {
      return this.dict.landUse || [];
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentHomestead: "homestead/updateCurrentHomestead",
      addHolder: "homestead/addHolder",
      deleteHolderByIndex: "homestead/deleteHolderByIndex"
    }),
    ...mapActions({
      createHomestead: "homestead/createHomestead",
      updateHomesteadById: "homestead/updateHomesteadById",
      getHomesteadList: "homestead/getHomesteadList"
    }),
    show(id) {
      this.visible = true;
      this.id = id;
    },
    hide() {
      this.id = "";
      this.visible = false;
    },
    inputHandler(value, key) {
      this.updateCurrentHomestead({ key, value });
    },
    // 农场主角色 填写更新内容 wangshuo
    editContent(value) {
      this.updateCurrentHomestead({key: 'updateInfo', value})
    },
    // 流转方
    addHolderHandler() {
      this.addHolder();
    },
    async deleteHolderHandler(index) {
      try {
        let confirm = await this.$confirm("你确定要删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          this.deleteHolderByIndex({ index });
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
        this.$refs.homesteadForm.clearValidate();
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
          _.get(this.homestead, "address") !== address ||
          _.get(this.homestead, "areaCode") !== areaCode
        ) {
          this.updateCurrentHomestead({ key: "address", value: address });
          this.updateCurrentHomestead({ key: "areaCode", value: areaCode });
          this.updateCurrentHomestead({ key: "detailAddress", value: detailAddress || ''});
        }
      }
    },
    setHolderListAddress() {
      let homesteadHolderList = this.homestead.homesteadHolderList.map(
        (item, index) => {
          let { address, areaCode, detailAddress } = _.get(
            this.$refs,
            `holderAddressSelect.${index}`
          ).getAddress();
          if (address || areaCode) {
            if (
              _.get(item, "address") !== address ||
              _.get(item, "areaCode") !== areaCode
            ) {
              item.address = address;
              item.areaCode = areaCode;
              item.detailAddress = detailAddress || '';
            }
          }
          return item;
        }
      );
      this.updateCurrentHomestead({
        key: "homesteadHolderList",
        value: homesteadHolderList
      });
    },
    deleteFileHandler(index) {
      return _index => {
        let url = _.get(
          this.homestead,
          `homesteadHolderList.${index}.contractPdfList`
        );
        let urlList = url.filter((item, __index) => _index !== __index);
        this.updateCurrentHomestead({
          key: `homesteadHolderList.${index}.contractPdfList`,
          value: urlList
        });
      };
    },
    fileUploadHandler(index) {
      return data => {
        let contractPdfList = _.get(
          this.homestead,
          `homesteadHolderList.${index}.contractPdfList`
        );
        let urlList = _.chain(contractPdfList)
          .concat(data)
          .uniqBy("fileUrl")
          .value();
        this.updateCurrentHomestead({
          key: `homesteadHolderList.${index}.contractPdfList`,
          value: urlList
        });
      };
    },
    async enterHandler() {
      try {
        this.setAddress(); // 设置地址
        this.setHolderListAddress(); // 设置流转方的地址
        let valid = await this.$refs.homesteadForm.validate();
        if (valid) {
          let { id } = this.$route.params;
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
            let res = await this.updateHomesteadById({
              id: this.id,
              farmId: id
            });
            if (res && res.code === 0) {
              await this.getHomesteadList(id);
              this.cancelHandler();
            }
          } else {
            let res = await this.createHomestead(id);
            if (res && res.code === 0) {
              await this.getHomesteadList(id);
              this.cancelHandler();
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
.no-value {
  font-size: 14px;
  color: #5f697c;
}
</style>
