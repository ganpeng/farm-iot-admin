<template>
  <el-dialog
    title="宅基地信息"
    class="my-dialog detail-dialog"
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
        ref="homesteadForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent
      >
        <el-row>
          <h4 class="content-sub-title">基本信息</h4>
          <el-col :span="12">
            <el-form-item label="地块编码">
              <span class="value" v-if="homestead.code">{{homestead.code}}</span>
              <span v-else class="no-value">创建后自动生成</span>
            </el-form-item>
            <el-form-item label="面积(平米)" prop="area">
              <span class="value">{{homestead.area}}</span>
            </el-form-item>
            <el-form-item label="是否闲置" prop="idle">
              <span class="value">{{homestead.idle ? '是' : '否'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地块用途" prop="purpose">
              <span class="value">{{homestead.purpose}}</span>
            </el-form-item>
            <el-form-item label="是否有房屋" prop="house">
              <span class="value">{{homestead.house ? '是' : '否'}}</span>
            </el-form-item>
            <el-form-item label="房产证" prop="propertyCertificate">
              <span class="value">{{homestead.propertyCertificate ? '是' : '否'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <p class="address">{{homestead.address}}</p>
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
                  <div class="right"></div>
                </div>
                <div class="training-item-content">
                  <el-col :span="12">
                    <el-form-item label="姓名">
                      <span class="value">{{holder.name}}</span>
                    </el-form-item>
                    <el-form-item label="身份证">
                      <span class="value">{{holder.identityId}}</span>
                    </el-form-item>
                    <el-form-item label="联系电话">
                      <span class="value">{{holder.mobile}}</span>
                    </el-form-item>
                    <el-form-item label="流转期限">
                        <span class="value">{{holder.startedAt | formatDate('yyyy-MM-DD')}} ~ {{holder.endedAt | formatDate('yyyy-MM-DD')}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="img-form-item" label="流转合同">
                      <file-carousel
                        v-if="holder.contractPdfList.length > 0"
                        :hasDelete="false"
                        :deleteFile="deleteFileHandler(index)"
                        :files="holder.contractPdfList"
                      ></file-carousel>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="地块地址">
                      <p class="address">{{holder.address}}</p>
                    </el-form-item>
                  </el-col>
                </div>
              </li>
            </ul>
          </div>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import FileCarousel from "@/components/FileCarousel";
import constants from "@/util/constants";
export default {
  name: "HomesteadDetailDialog",
  components: { FileCarousel },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    ...mapGetters({
      homestead: "homestead/currentHomestead",
      dict: "dict/dict"
    })
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    async openDialogHandler() {
      try {} catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    cancelHandler() {
      this.hide();
    },
    deleteFileHandler() {}
  }
};
</script>
<style lang="scss" scoped>
.no-value {
  font-size: 14px;
  color: #5f697c;
}
</style>
