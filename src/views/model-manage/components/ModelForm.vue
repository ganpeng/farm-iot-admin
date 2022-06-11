<!--模型信息表单组件-->
<template>
  <div id="model-container">
    <el-form
      :model="modelInfo"
      :rules="infoRules"
      status-icon
      ref="modelInfoBasic"
      label-width="160px"
      class="form-block fill-form">
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="模型名称" prop="name" label-width="181px" required>
          <el-input
            v-model="modelInfo.name"
            size="medium"
            maxlength="20"
            placeholder="模型名称">
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="模型说明" prop="description" label-width="181px" required>
          <el-input
            type="textarea"
            maxlength="100"
            :rows="6"
            v-model="modelInfo.description"
            size="medium"
            placeholder="模型说明">
          </el-input>
          <i class="notice">100字以内</i>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="status === 'EDIT'" class="el-form-split-block big-margin" label-width="0" >
        <el-form-item label="设备类型" label-width="181px">
        <div class="content-item">
          <span>{{modelInfo.sensorType | deviceType}}</span>
        </div>          
        </el-form-item>
      </el-form-item>
      <el-form-item v-else class="el-form-split-block big-margin" label-width="0">
        <el-form-item label="设备类型" prop="sensorType" label-width="181px" required>
          <el-select
            v-model="modelInfo.sensorType"
            placeholder="请选择"
            @change="sensorTypeChange"
          >
            <el-option
              v-for="(item, _index) in deviceTypeOptios"
              :key="_index"
              :label="item.value"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div id="form-list-block">
      <el-form
        v-for="(modelInfo, index) in  modelMetricList"
        :key="index"
        :model="modelInfo"
        :rules="infoRulesList[0]"
        :ref="'modelInfo-' + index"
        label-width="80px"
        class="form-block fill-form">
        <el-form-item class="el-form-split-block big-margin" label-width="0">
          <el-form-item :label="'指标' + (index + 1)" prop="metric" required label-width="180px">
            <el-select
              v-model="modelInfo.metric"
              popper-class="separate-option"
              placeholder="请选择">
              <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                  :disabled="setOptionDisable(item, modelInfo.metric)">
                </el-option>
              </el-option-group>
            </el-select>
            <i class="unit">{{getMetricUnit(modelInfo.metric)}}</i>
          </el-form-item>
          <el-form-item label="正常范围" prop="min" required label-width="188px">
            <el-input
              class="range-input"
              v-model="modelInfo.min"
              size="medium"
              placeholder="最低值(包含)">
            </el-input>
            <i class="range-tag">至</i>
          </el-form-item>
          <el-form-item label="" prop="max" label-width="0px" required>
            <el-input
              class="range-input"
              v-model="modelInfo.max"
              size="medium"
              placeholder="最高值(包含)">
            </el-input>
          </el-form-item>
          <div class="operate-block">
            <div class="remove-btn-block" v-if="modelMetricList.length !== 1" @click="removeFarmItem(index)">
              删除
              <svg-icon icon-class="remove_image_default"></svg-icon>
              <svg-icon icon-class="remove_image_hover"></svg-icon>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-item-btn"
         @click="addModel">
      <svg-icon icon-class="add_item_normal"></svg-icon>
      <svg-icon icon-class="add_item_active"></svg-icon>
      添加指标
    </div>
    <div class="fixed-btn-container">
      <el-button
        class="btn-style-two"
        type="primary"
        @click="createModel"
        :loading="isLoading">
        {{status === 'EDIT' ? '保存' : '新建'}}
      </el-button>
      <el-button class="btn-style-three" @click="toModelList" plain>返回列表</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

  export default {
    name: 'CreateModel',
    props: {
      status: {
        type: String,
        default: 'CREATE'
      }
    },
    data() {
      let checkName = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入模型名称'));
        } else {
          callback();
        }
      };
      let checkDescription = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请输入模型说明'));
        } else {
          callback();
        }
      };
      let checkMetric = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择指标'));
        } else {
          callback();
        }
      };
      let checkSensorType = (rule, value, callback) => {
        if (this.$util.isEmpty(value)) {
          return callback(new Error('请选择设备类型'));
        } else {
          callback();
        }
      };
      let checkMin = (index) => {
        let that = this;
        return function (rule, value, callback) {
          console.log('checkMin------' + index);
          console.log('min' + value);
          console.log('max' + that.modelMetricList[index].max);
          if (that.$util.isEmpty(value)) {
            return callback(new Error('请填写指标最小值'));
          } else if (that.modelMetricList[index] && !that.$util.isEmpty(that.modelMetricList[index].max)) {
            callback();
            // 判断是否min < max
            // if (parseInt(value) < parseInt(that.modelMetricList[index].max)) {
            //   callback();
            // } else {
            //   return callback(new Error('最小值要小于最大值'));
            // }
          } else {
            callback();
          }
        };
      };
      let checkMax = (index) => {
        let that = this;
        let indexObj = {index: index};
        console.log(indexObj);
        return function (rule, value, callback) {
          let index = index;
          console.log('checkMax------' + indexObj);
          console.log('checkMax------' + indexObj);
          console.log('max' + value);
          // console.log('min' + that.modelMetricList[index].min);
          if (that.$util.isEmpty(value)) {
            return callback(new Error('请填写指标最大值'));
          } else if (that.modelMetricList[index] && !that.$util.isEmpty(that.modelMetricList[index].min)) {
            callback();
            // // 判断是否min < max
            // if (parseInt(value) > parseInt(that.modelMetricList[index].min)) {
            //   callback();
            // } else {
            //   return callback(new Error('最大值要大于最小值'));
            // }
          } else {
            callback();
          }
        };
      };
      return {
        metricList: [],
        options: [],
        modelInfo: {
          name: '',
          description: '',
          sensorType: '',
        },
        modelMetricList: [{
          metric: '',
          max: '',
          min: ''
        }],
        infoRules: {
          name: [
            {validator: checkName, trigger: 'change'},
            {validator: checkName, trigger: 'blur'}
          ],
          description: [
            {validator: checkDescription, trigger: 'blur'},
            {validator: checkDescription, trigger: 'change'}
          ],
          sensorType: [
            {validator: checkSensorType, trigger: 'blur'},
            {validator: checkSensorType, trigger: 'change'}
          ]
        },
        isLoading: false,
        farmOptions: [],
        modelVendorOptions: [{
          value: '飞利信',
          label: '飞利信'
        }],
        checkMetric: checkMetric,
        checkMin: checkMin,
        checkMax: checkMax,
        infoRulesList: [{
          metric: [
            {validator: checkMetric, trigger: 'change'}
          ],
          min: [
            {validator: checkMin(0), trigger: 'blur'},
            {validator: checkMin(0), trigger: 'change'}
          ],
          max: [
            {validator: checkMax(0), trigger: 'blur'},
            {validator: checkMax(0), trigger: 'change'}
          ]
        }]
      };
    },
    mounted() {
      this.init();
    },
    computed: {
      ...mapGetters({
        dict: "dict/dict",
      }),  
      deviceTypeOptios() {
        return this.dict.sensorType || [];
      }, 
    },     
    methods: {
      // 判断是否禁用当前的option
      setOptionDisable(currentOption, currentSelectItem) {
        let tag = false;
        this.modelMetricList.map(metricItem => {
          if (currentOption.value === metricItem.metric && currentOption.value !== currentSelectItem) {
            tag = true;
          }
        });
        return tag;
      },
      init() {
        this.$util.toggleFixedBtnContainer();
        // this.getMetricList();
        if (this.status === 'EDIT') {
          this.getModelDetail();
        }
      },
      getMetricUnit(metric) {
        let unit = '';
        this.metricList.map(item => {
          if (item.value === metric) {
            unit = item.unit;
          }
        });
        return unit;
      },
      getModelDetail() {
        this.$service.getModelDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            this.modelInfo = response.data;
            this.modelMetricList = response.data.metrics;

            let obj = this.getCurrentSensor(this.modelInfo.sensorType);
            console.log(obj)
            this.getSensorTypeChildren(obj.id);
          }
        })
      },
      getMetricList() {
        this.$service.getMetricList().then(response => {
          if (response && response.code === 0) {
            this.metricList = response.data;
            // 处理数据
            let obj = {};
            for (let i = 0; i < response.data.length; i++) {
              if (obj[response.data[i].description]) {
                obj[response.data[i].description].push(response.data[i]);
              } else {
                obj[response.data[i].description] = [response.data[i]];
              }
            }
            let options = [];
            for (let key in obj) {
              options.push({label: key.toString(), options: obj[key]});
            }
            this.options = options;
          }
        })
      },
      removeFarmItem(index) {
        this.modelMetricList.splice(index, 1);
        this.infoRulesList.splice(index, 1);
      },
      addModel() {
        this.validateForm().then((resolve, reject) => {
          if (resolve) {
            // 添加之前验证表单
            this.modelMetricList.push({
              metric: '',
              min: '',
              max: ''
            });
            let length = this.infoRulesList.length;
            this.infoRulesList.push({
              metric: [
                {validator: this.checkMetric, trigger: 'change'}
              ],
              min: [
                {validator: this.checkMin(length), trigger: 'blur'},
                {validator: this.checkMin(length), trigger: 'change'}
              ],
              max: [
                {validator: this.checkMax(length), trigger: 'blur'},
                {validator: this.checkMax(length), trigger: 'change'}
              ]
            });
          }
        }).catch((e) => {
          this.$message.warning('请处理当前表单问题之后再进行添加操作');
        });
      },
      validateForm() {
        let validateFuncList = [];
        for (let i = 0; i < this.modelMetricList.length; i++) {
          validateFuncList.push(this.$refs['modelInfo-' + i][0].validate());
        }
        return Promise.all(validateFuncList);
      },
      validateAllForm() {
        let validateFuncList = [];
        validateFuncList.push(this.$refs['modelInfoBasic'].validate());
        for (let i = 0; i < this.modelMetricList.length; i++) {
          validateFuncList.push(this.$refs['modelInfo-' + i][0].validate());
        }
        return Promise.all(validateFuncList);
      },
      createModel() {
        this.validateAllForm().then((resolve, reject) => {
          if (resolve) {
            if (!this.$authority.isHasAuthority('admin:model:edit')) {
              return;
            }
            if (this.status === 'EDIT') {
              this.$service.updateModel({
                id: this.$route.params.id,
                name: this.modelInfo.name,
                description: this.modelInfo.description,
                sensorType: this.modelInfo.sensorType,
                metrics: this.modelMetricList
              }).then(response => {
                if (response && response.code === 0) {
                  this.$message.success('成功更新模型信息');
                  this.$router.push({name: 'ModelList'});
                } else {
                  this.$message.warning(response.message);
                }
              });
            } else {
              if (!this.$authority.isHasAuthority('admin:model:add')) {
                return;
              }
              this.$service.createModel({
                name: this.modelInfo.name,
                description: this.modelInfo.description,
                sensorType: this.modelInfo.sensorType,
                metrics: this.modelMetricList
              }).then(response => {
                if (response && response.code === 0) {
                  this.$message.success('成功创建模型');
                  this.$router.push({name: 'ModelList'});
                } else {
                  this.$message.warning(response.message);
                }
              });
            }
          }
        }).catch((e) => {
        });
      },
      toModelList() {
        if (!this.$authority.isHasAuthority('admin:model:page')) {
          return;
        }
        this.$router.push({name: 'ModelList'});
      },
      // 修改设备类型
      sensorTypeChange() {
        const typeList = this.dict.sensorType;
        let typeObj = typeList.filter(item => item.name === this.modelInfo.sensorType)
        this.modelMetricList = [{
          metric: '',
          max: '',
          min: ''
        }];
        this.$service.getSensorTypeChildren(typeObj[0].id).then(res => {
          if (res && res.code === 0) {
              this.metricList = res.data;
              this.formatSensorChildren(res.data);
            } else {
              this.$message.warning(response.message);
            }
        });
      },
      // 获取当前设备类型对象
      getCurrentSensor(sensorType) {
        const typeList = this.dict.sensorType;
        return typeList.filter(item => item.name === sensorType)[0]
      },
      // 根据设备ID请求指标类型
      getSensorTypeChildren(id) {
        this.$service.getSensorTypeChildren(id).then(res => {
          if (res && res.code === 0) {
              this.metricList = res.data;
              this.formatSensorChildren(res.data);
            } else {
              this.$message.warning(response.message);
            }
        });        
      },
      // 处理设备类型的子类型
      formatSensorChildren(data) {
        // 处理数据
        let obj = {};
        for (let i = 0; i < data.length; i++) {
          if (obj[data[i].description]) {
            obj[data[i].description].push(data[i]);
          } else {
            obj[data[i].description] = [data[i]];
          }
        }
        let options = [];
        for (let key in obj) {
          options.push({label: key.toString(), options: obj[key]});
        }
        this.options = options;
      },
    }
  };
</script>

<style lang="scss" scoped>

  #model-container {
    padding: 18px;
  }

  #form-list-block {
    .form-block {
      margin-bottom: 20px;

      &:last-child {
        border: none;
      }
    }
  }

  .operate-block {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .remove-btn-block {
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 400;
    color: rgba(220, 74, 81, 1);
    cursor: pointer;

    &:hover {
      color: rgba(164, 32, 39, 1);

      .svg-icon {
        &:last-child {
          display: block;
        }

        &:first-child {
          display: none;
        }
      }
    }

    .svg-icon {
      margin-left: 2px;
      width: 11px;
      height: 11px;

      &:last-child {
        display: none;
      }
    }
  }

  .notice {
    margin-left: 10px;
    align-self: flex-end;
    font-size: 12px;
    font-weight: 400;
    color: rgba(111, 116, 128, 1);
  }

  .range-tag {
    margin: 0 10px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(168, 171, 179, 1);
  }

  .add-item-btn {
    margin-left: 112px;
  }

  .unit {
    width: 30px;
  }

  .content-item {
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

</style>
