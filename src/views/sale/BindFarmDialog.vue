<template>
  <el-dialog
    title="绑定店铺"
    class="my-dialog"
    width="50%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div class="dialog-body">
      <el-form
        :model="farm"
        :rules="rules"
        ref="bindShopForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <div class="my-form-container">
          <el-form-item label="农场名称" prop="id">
            <el-select
              :value="farm.name"
              filterable
              clearable
              @input="inputHander($event)"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in farmList"
                :key="index"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <span class="prompt">
              <svg-icon icon-class="info_i_1"></svg-icon>&nbsp;
              商品绑定农场后，已选商品将默认与农场建立关联关系，请谨慎操作
            </span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandler">取 消</el-button>
      <el-button :disabled="submitDisabled" class="enter-btn" @click="enterHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {mapActions} from 'vuex';
import _ from 'lodash';
export default {
  name: 'BindFarmDialog',
  data() {
    return {
      submitDisabled: false,
      visible: false,
      goodsList: [],
      farmList: [],
      farm: {
        id: ''
      },
      rules: {
        id: [{ required: true, message: "请选择农场" }]
      }
    };
  },
  async created() {
    try {} catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapActions({
      getCommodityList: "commodity/getCommodityList"
    }),
    show(goodsList) {
      if (goodsList.length > 0) {
        this.visible = true;
        this.goodsList = goodsList;
      }
    },
    hide() {
      this.visible = false;
      this.goodsList = [];
      this.farmList = [];
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.$refs.bindShopForm.clearValidate();
        let res = await this.$service.getFarmList({pageSize: 100});
        if (res && res.code === 0) {
          this.farmList = res.data.list;
        }
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
    inputHander(farm) {
      this.farm = farm;
    },
    async enterHandler() {
      try {
        let valid = await this.$refs.bindShopForm.validate();
        if (valid) {
          this.submitDisabled = true;
          let goodsIdList = this.goodsList.map((goods) => goods.goodsId);
          let farmId = this.farm.id;
          let farmName = this.farm.name;
          let res = await this.$service.goodsListBindFarm({farmId, goodsIdList, farmName});
          if (res && res.code === 0) {
            this.cancelHandler();
            this.getCommodityList();
            this.submitDisabled = false;
          } else {
            this.$message.error('农场绑定失败');
            this.submitDisabled = false;
          }
        }
      } catch (err) {
        this.submitDisabled = false;
        console.log(err);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.my-dialog {
  .my-form-container {
    .prompt {
      color: #98A4AF;
      font-size: 12px;
    }
  }
}
</style>
