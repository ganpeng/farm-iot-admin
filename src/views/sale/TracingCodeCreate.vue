<template>
  <div class="tracing-code-create-container my-content-container">
    <el-form
      :model="tracingCode"
      status-icon
      ref="tracingForm"
      label-width="140px"
      :rules="rules"
      @submit.native.prevent
      class="my-form"
    >
      <el-row>
        <h4 class="content-sub-title">基础信息</h4>
        <el-col :span="12">
          <el-form-item label="溯源码数量" prop="num">
            <el-input
              type="number"
              v-model="tracingCode.num"
              placeholder="请输入溯源码数量(最多500个)"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="isAdmin" label="生产企业" prop="shopId">
            <el-select
              v-model="tracingCode.shopId"
              filterable
              clearable
              @change="shopChangeHandler"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in shopList"
                :key="index"
                :label="item.shopName"
                :value="item.shopId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodsId">
            <el-select
              v-model="tracingCode.goodsId"
              filterable
              clearable
              @change="selectGoods"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in goodsList"
                :key="index"
                :label="item.goodsName"
                :value="item.goodsId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品ID" prop="goodsId">
            <span>{{tracingCode.goodsId}}</span>
            <!-- <el-select
              v-model="tracingCode.goodsId"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in goodsList"
                :key="index"
                :label="item.goodsId"
                :value="item.goodsId"
              ></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="溯源批号" prop="batchNo">
            <el-select
              v-model="tracingCode.batchNo"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in batchList"
                :key="index"
                :label="item.batchNo"
                :value="item.batchNo"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <h4 class="content-sub-title">数据包下载示例（.xslx）</h4>
        <div class="tabel-field">
          <el-table
            header-row-class-name="common-table-header"
            size="small"
            :row-class-name="tableRowClassName"
            class="my-table-style"
            :data="list.data"
          >
            <el-table-column min-width="120px" label="生产企业">
              <template slot-scope="scope"><span>{{scope.row.company}}</span></template>
            </el-table-column>
            <el-table-column min-width="120px" label="商品名称">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column min-width="120px" label="商品ID">
              <template slot-scope="scope">{{scope.row.goodsId}}</template>
            </el-table-column>
            <el-table-column prop="sn" min-width="120px" label="溯源批号">
              <template slot-scope="scope">{{scope.row.code}}</template>
            </el-table-column>
            <el-table-column prop="sn" min-width="120px" label="二维码链接">
              <template slot-scope="scope">{{scope.row.codeUrl}}</template>
            </el-table-column>
            <el-table-column prop="sn" min-width="120px" label="防伪码">
              <template slot-scope="scope">{{scope.row.trueCode}}</template>
            </el-table-column>
            <el-table-column prop="sn" min-width="120px" label="创建人">
              <template slot-scope="scope">{{scope.row.creator}}</template>
            </el-table-column>
            <el-table-column min-width="80px" label="创建时间">
              <template slot-scope="scope">{{scope.row.createdAt}}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
    </el-form>
    <div class="fixed-btn-container">
      <el-button :disabled="submitDisabled" class="btn-style-two" @click="createHandler">生成并下载</el-button>
      <el-button class="btn-style-three" @click="gotoTracingCodeListHandler" plain>返回列表</el-button>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import axios from 'axios';
import qs from 'querystring';
import constants from "@/util/constants";
export default {
  name: 'TracingCodeCreate',
  data() {
    let checkScore = (rule, value, callback) => {
      if (!_.isEmpty(value)) {
        if (!_.isNumber(parseFloat(value))) {
          callback(new Error('请输入正确的溯源码数量'));
        } else {
          if (value > 500 || value < 1) {
            callback(new Error('请输入正确的溯源码数量'));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    return {
      submitDisabled: false,
      shopList: [],
      goodsList: [],
      batchList: [],
      tracingCode: {
        goodsId: '',
        shopId: '',
        num: '',
        batchNo: ''
      },
      rules: {
        num: [
          { required: true, message: "请输入溯源码数量" },
          { pattern: constants.REG_EXP.positiveNumber2, message: '请输入正确的溯源码数量' },
          { validator: checkScore }
        ],
        goodsId: [{ required: true, message: "请选择商品名称" }],
        shopId: [{ required: true, message: "请选择生产企业" }],
        batchNo: [{ required: true, message: "请选择溯源批号" }]
      },
      list: {
        data: [
          {
            company: '生产企业A',
            name: '商品A',
            goodsId: '×××××××',
            code: '×××××××',
            codeUrl: 'http/https:×××××××',
            trueCode: '××× ×××',
            creator: '用户A',
            createdAt: '2020-09-08 12:00:00'
          },
          {
            company: '生产企业B',
            name: '商品B',
            goodsId: '×××××××',
            code: '×××××××',
            codeUrl: 'http/https:×××××××',
            trueCode: '××× ×××',
            creator: '用户B',
            createdAt: '2020-09-09 12:00:00'
          }
        ]
      },
      // 判断是否是管理员
      isAdmin: this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' || this.$wsCache.localStorage.get('login').roleType === 'CUSTOM',
    };
  },
  async created() {
    try {
      if(this.isAdmin) {
        let res = await this.$service.getShopList();
        if (res && res.code === 0) {
          this.shopList = res.data;
        }
      } else {
        this.shopChangeHandler();
      }
      await this.$nextTick();
      this.$util.toggleFixedBtnContainer();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    async selectGoods(id) {
      try {
        let res = await this.$service.getBatchList({goodsId: id});
        if (res && res.code === 0) {
          this.batchList = res.data.list;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async shopChangeHandler(id) {
      try {
        let res = await this.$service.getCommodityList({sellerId: id, pageNum: 0, pageSize: 1000});
        if (res && res.code === 0) {
          this.goodsList = res.data.list;
        }
      } catch (err) {
        console.log(err);
      }
    },
    inputHandler() {},
    downloadFile(url, name) {
      if (typeof url === 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
      }
      let aLink = document.createElement('a');
      aLink.href = url;
      aLink.download = name || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      let event;
    if (window.MouseEvent) {
        event = new MouseEvent('click');
      } else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      }
      aLink.dispatchEvent(event);
    },
    async createHandler() {
      try {
        let valid = await this.$refs.tracingForm.validate();
        if (valid) {
          this.submitDisabled = true;
          let {batchNo, num, goodsId, shopId} = this.tracingCode;
          let params = {
            batchNo,
            num,
            goodsId
          }
          let goods = this.goodsList.find((goods) => goods.goodsId === goodsId);
          params.goodsName = _.get(goods, 'goodsName');
          let shop = this.shopList.find((shop) => shop.shopId === shopId)
          params.factoryName = _.get(shop, 'shopName');
          let token = '';
          let user = localStorage.getItem('login');
          if (user) {
            let userObj = JSON.parse(user);
            token = _.get(userObj, 'token');
          }
          params.token = token;
          this.$service.createTracingQrcode(params)
            .then((res) => {
              let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
              let name = `${params.factoryName}_${params.goodsName}_${batchNo}_${num}_${this.$util.formatDate(new Date(), 'yyyy-MM-DD')}.xlsx`;
              this.downloadFile(blob, name);
              this.submitDisabled = false;
              this.$router.push({name: "TracingCodeList"});
            }).catch((err) => {
              console.log(err);
            });
        }
      } catch (err) {
        console.log(err);
        this.submitDisabled = false;
      }
    },
    gotoTracingCodeListHandler() {
      if (!this.$authority.isHasAuthority('admin:trace:page')) {
        return;
      }
      this.$router.push({name: "TracingCodeList"});
    }
  }
}
</script>
