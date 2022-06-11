<template>
  <div class="notice-form">
    <el-form
      :model="notice"
      status-icon
      ref="noticeForm"
      label-width="140px"
      :rules="noticeRules"
      @submit.native.prevent
      class="my-form"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="消息标题" prop="noticeTitle">
            <el-input
              maxlength="20"
              :value="notice.noticeTitle"
              placeholder="请输入消息标题，20字以内"
              @input="inputHandler($event, 'noticeTitle')"
            ></el-input>
          </el-form-item>
          <el-form-item label="消息类型" prop="noticeType">
            <el-select
              :value="notice.noticeType"
              filterable
              clearable
              placeholder="请选择"
              @input="inputHandler($event, 'noticeType')"
            >
              <el-option
                v-for="(item, index) in noticeTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="有效期"
            prop="effectiveRange"
          >
            <el-date-picker
              :value="notice.effectiveRange"
              type="datetimerange"
              @input="inputHandler($event, 'effectiveRange')"
              value-format="timestamp"
              :unlink-panels="true"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="消息详情" prop="noticeDetail">
            <div class="desc-wrapper">
              <el-input
                class="my-textarea"
                :value="notice.noticeDetail"
                :maxlength="140"
                placeholder="请输入消息详情，140字以内"
                type="textarea"
                @input="inputHandler($event, 'noticeDetail')"
              ></el-input>
              <span class="desc-prompt">已输入{{notice.noticeDetail.length}}/140字</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import options from '@/util/options';
export default {
  name: "NoticeForm",
  data() {
    return {
      noticeRules: {
        noticeTitle: [{ required: true, message: "请输入消息标题" }],
        noticeType: [{ required: true, message: "请选择消息类型" }],
        effectiveRange: [{ required: true, message: "请输入有效期" }],
        noticeDetail: [{ required: true, message: "请输入消息详情" }]
      },
      noticeTypeOptions: options.noticeTypeOptions
    };
  },
  computed: {
    ...mapGetters({
      notice: 'notice/currentNotice'
    })
  },
  methods: {
    ...mapMutations({
      updateCurrentNotice: 'notice/updateCurrentNotice'
    }),
    formValidate() {
      return this.$refs.noticeForm.validate();
    },
    inputHandler(value, key) {
      this.updateCurrentNotice({ key, value });
    },
  }
};
</script>