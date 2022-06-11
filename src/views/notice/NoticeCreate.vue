<template>
    <div class="notice-create-container my-content-container">
        <notice-form ref="noticeForm"></notice-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="noticeCreateHandler">保存</el-button>
            <el-button class="btn-style-three" @click="gotoNoticeList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapMutations, mapActions} from 'vuex';
import NoticeForm from './NoticeForm';
export default {
    name: 'FarmCreate',
    components: { NoticeForm },
    async created() {
      try {
        await this.$nextTick();
        this.resetCurrentNotice();
        this.$util.toggleFixedBtnContainer();
      } catch (err) {
        console.log(err);
      }
    },
    methods: {
        ...mapMutations({
            resetCurrentNotice: 'notice/resetCurrentNotice'
        }),
        ...mapActions({
            createNotice: 'notice/createNotice'
        }),
        async noticeCreateHandler() {
            try {
                // 设置地址
                if (!this.$authority.isHasAuthority('admin:notice:add')) {
                  return;
                }
                let valid = await this.$refs.noticeForm.formValidate();
                if (valid) {
                  let res = await this.createNotice();
                  if (res && res.code === 0) {
                      this.gotoNoticeList();
                  } else {
                    this.$message.error(res.message);
                  }
                }
            } catch (err) {
                console.log(err);
            }
        },
        gotoNoticeList() {
            this.$router.push({name: 'NoticeList'});
        }
    }
};
</script>
<style lang="scss" scoped>
.farm-create-container {}
</style>
