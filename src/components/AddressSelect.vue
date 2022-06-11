<template>
  <div class="address-select">
    <el-select
      class="my-select"
      v-model="one"
      filterable
      clearable
      value-key="id"
      @change="oneChangeHandler($event)"
      placeholder="请选择省">
      <el-option
        v-for="item in oneOption"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      class="my-select"
      v-model="two"
      filterable
      clearable
      value-key="id"
      @change="twoChangeHandler($event)"
      placeholder="请选择市">
      <el-option
        v-for="item in twoOption"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      class="my-select"
      v-model="three"
      filterable
      clearable
      value-key="id"
      @change="threeChangeHandler($event)"
      placeholder="请选择区县">
      <el-option
        v-for="item in threeOption"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      class="my-select"
      v-model="four"
      filterable
      clearable
      value-key="id"
      @change="fourChangeHandler($event)"
      placeholder="请选择街道">
      <el-option
        v-for="item in fourOption"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      class="my-select"
      v-model="five"
      filterable
      clearable
      value-key="id"
      @change="fiveChangeHandler($event)"
      placeholder="请选择村">
      <el-option
        v-for="item in fiveOption"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <el-input
      class="my-input"
      v-model="supplement">
    </el-input>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  name: 'AddressSelect',
  data() {
    return {
      one: {},
      two: {},
      three: {},
      four: {},
      five: {},
      oneOption: [],
      twoOption: [],
      threeOption: [],
      fourOption: [],
      fiveOption: [],
      supplement: ''
    };
  },
  created() {
    this.getOneOption();
  },
  methods: {
    async getOneOption() {
      try {
        let res = await this.$service.getDistrict({parentCode: 0});
        if (res && res.code === 0) {
          this.oneOption = res.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getTwoOption() {
      try {
        let {areaCode} = this.one;
        if (areaCode) {
            let res = await this.$service.getDistrict({parentCode: areaCode});
            if (res && res.code === 0) {
                this.twoOption = res.data;
            }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getThreeOption() {
      try {
        let {areaCode} = this.two;
        if (areaCode) {
            let res = await this.$service.getDistrict({parentCode: areaCode});
            if (res && res.code === 0) {
                this.threeOption = res.data;
            }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getFourOption() {
      try {
        let {areaCode} = this.three;
        if (areaCode) {
            let res = await this.$service.getDistrict({parentCode: areaCode});
            if (res && res.code === 0) {
            this.fourOption = res.data;
            }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getFiveOption() {
      try {
        let {areaCode} = this.four;
        if (areaCode) {
            let res = await this.$service.getDistrict({parentCode: areaCode});
            if (res && res.code === 0) {
                this.fiveOption = res.data;
            }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async oneChangeHandler(value) {
        this.two = {};
        this.three = {};
        this.four = {};
        this.five = {};
        this.twoOption = [];
        this.threeOption = [];
        this.fourOption = [];
        this.fiveOption = [];
        this.getTwoOption();
    },
    async twoChangeHandler(value) {
      this.three = {};
      this.four = {};
      this.five = {};
      this.threeOption = [];
      this.fourOption = [];
      this.fiveOption = [];
      this.getThreeOption();
    },
    async threeChangeHandler(value) {
      this.four = {};
      this.five = {};
      this.fourOption = [];
      this.fiveOption = [];
      this.getFourOption();
    },
    async fourChangeHandler(value) {
      this.five = {};
      this.fiveOption = [];
      this.getFiveOption();
    },
    async fiveChangeHandler(value) {
        console.log(value);
    },
    getAddress() {
        let oneName = _.get(this.one, 'name') || '';
        let twoName = _.get(this.two, 'name') || '';
        let threeName = _.get(this.three, 'name') || '';
        let fourName = _.get(this.four, 'name') || '';
        let fiveName = _.get(this.five, 'name') || '';
        let oneCode = _.get(this.one, 'areaCode') || '';
        let twoCode = _.get(this.two, 'areaCode') || '';
        let threeCode = _.get(this.three, 'areaCode') || '';
        let fourCode = _.get(this.four, 'areaCode') || '';
        let fiveCode = _.get(this.five, 'areaCode') || '';
        let areaCode = fiveCode || fourCode || threeCode || twoCode || oneCode;
        let address = [oneName, twoName, threeName, fourName, fiveName]
                        .filter((item) => item).join('');
        return {address, areaCode, detailAddress: this.supplement};
    },
    reset() {
      this.one = {};
      this.two = {};
      this.three = {};
      this.four = {};
      this.five = {};
      // this.oneOption = [];
      this.twoOption = [];
      this.threeOption = [];
      this.fourOption = [];
      this.fiveOption = [];
      this.supplement = '';
    }
  }
}
</script>
<style lang="scss">
.address-select {
  display: flex;
  align-items: center;
  .my-select {
    width: 140px;
    margin-right: 8px;
    .el-input.el-input--suffix {
      width: 140px;
    }
    .el-input__inner {
      border-color: #3E495E;
    }
  }
  .my-input {
    width: 160px;
  }
}
</style>
