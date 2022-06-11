<!-- 多选、分组选择框 -->
<template>
  <div id="select-container">
    <div id="select-tag-block">
      <label v-for="(item, index) in selectedTags">
        <span>{{item.name}}</span>
        <div @click="removeMetric(item,index)">
          <svg-icon icon-class="remove_btn_default"></svg-icon>
          <svg-icon icon-class="remove_btn_active"></svg-icon>
        </div>
      </label>
    </div>
    <el-select
      v-model="value"
      placeholder="请选择"
      popper-class="separate-option"
      multiple
      @change="selectChangeHandler">
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'multiple-separate-select',
    props: {
      options: {
        type: Array,
        default: function () {
          return [];
        }
      },
      metricAllList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        value: '',
        selectedTags: [],
        metricList: [],
        innerOptions: []
      }
    },
    mounted() {
      this.innerOptions = this.options.slice(0);
    },
    methods: {
      removeMetric(item, index) {
        this.value.splice(index, 1);
        this.selectedTags.splice(index, 1);
        this.validateFormItem();
      },
      selectChangeHandler(value) {
        let selectedTags = [];
        for (let i = 0; i < value.length; i++) {
          for (let m = 0; m < this.metricAllList.length; m++) {
            if (this.metricAllList[m].value === value[i]) {
              selectedTags.push(this.metricAllList[m]);
            }
          }
        }
        this.selectedTags = selectedTags;
        this.validateFormItem();
      },
      getSelectedMetric() {
        return this.value;
      },
      validateFormItem() {
        this.$emit('validateFormItem');
      }
    }
  }
</script>

<style scoped lang="scss">

  #select-container {
    display: flex;
    flex-direction: column;
  }

</style>

<style lang="scss">

  #select-container {
    .el-select__tags {
      height: 0;
      width: 0;
      overflow: hidden;
    }
    .el-select {
      width: 240px;
    }
  }

  #select-tag-block {
    width: 350px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    label {
      margin-bottom: 10px;
      margin-right: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      height: 20px;
      background: rgba(41, 54, 81, 1);
      border-radius: 2px;
      border: 1px solid rgba(66, 78, 103, 1);
      span {
        margin-right: 5px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(159, 168, 184, 1);
      }
      div {
        cursor: pointer;
        &:hover {
          .svg-icon {
            &:first-child {
              display: none;
            }
            &:last-child {
              display: block;
            }
          }
        }
        .svg-icon {
          width: 12px;
          height: 12px;
          &:first-child {
            display: block;
          }
          &:last-child {
            display: none;
          }
        }
      }
    }
  }

</style>
