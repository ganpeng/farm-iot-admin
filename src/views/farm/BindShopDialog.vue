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
        :model="shop"
        :rules="rules"
        ref="bindShopForm"
        class="my-form"
        label-width="140px"
        @submit.native.prevent>
        <div class="my-form-container">
          <el-form-item label="店铺名称" prop="shopId">
            <el-select
              v-model="shop.shopId"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in shopList"
                :title="item.farmId && '该店铺已经和其他农场关联'"
                :key="index"
                :disabled="!!item.farmId"
                :label="shopListLabel(item)"
                :value="item.shopId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺ID">
            <span>{{shop.shopId}}</span>
          </el-form-item>
          <el-form-item label=" ">
            <span class="prompt">
              <svg-icon icon-class="info_i_1"></svg-icon>&nbsp;
              农场绑定店铺后，店铺下的商品将默认与农场建立关联关系，请谨慎操作
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
  name: 'BindShopDialog',
  data() {
    return {
      submitDisabled: false,
      visible: false,
      farmId: '',
      rules: {
        shopId: [{ required: true, message: "请选择生产企业" }]
      },
      shopList: [],
      shop: {
        shopId: ''
      }
    };
  },
  async created() {
    try {
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    shopListLabel() {
      return (shop) => {
        let label = shop.shopName || shop.shopId;
        return label;
      };
    }
  },
  methods: {
    ...mapActions({
      getFarmList: "farm/getFarmList"
    }),
    show({farmId, shopId}) {
      this.visible = true;
      this.farmId = farmId;
      this.shop.shopId = shopId;
    },
    hide() {
      this.visible = false;
      this.farmId = '';
      this.shopList = [];
      this.shop = {
        shopId: ''
      };
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        this.$refs.bindShopForm.clearValidate();
        let res = await this.$service.getShopList();
        if (res && res.code === 0) {
          this.shopList = res.data;
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
    async enterHandler() {
      try {
        let valid = await this.$refs.bindShopForm.validate();
        if (valid) {
          this.submitDisabled = true;
          let {shopId} = this.shop;
          let shop = this.shopList.find((shop) => shop.shopId === shopId);
          let shopName = _.get(shop, 'shopName');
          let res = await this.$service.bindShop({farmId: this.farmId, shopId, shopName});
          if (res && res.code === 0) {
            this.cancelHandler();
            this.getFarmList();
            this.submitDisabled = false;
          } else {
            this.$message.error('店铺绑定失败');
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
