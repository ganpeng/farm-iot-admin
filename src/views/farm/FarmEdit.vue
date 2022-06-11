<template>
  <div class="farm-edit-container my-content-container">
    <farm-form ref="farmFormComponent"></farm-form>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two" type="primary" @click="farmEditHandler">保存</el-button>
      <el-button class="btn-style-three" @click="gotoFarmList" plain>返回列表</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import FarmForm from "./FarmForm";
export default {
  name: "FarmEdit",
  components: { FarmForm },
  async created() {
    try {
      let { id } = this.$route.params;
      await this.getFarmById(id);
      await this.$nextTick();
      this.$util.toggleFixedBtnContainer();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentFarm: "farm/updateCurrentFarm"
    }),
    ...mapActions({
      getFarmById: "farm/getFarmById",
      updateFarmById: "farm/updateFarmById"
    }),
    async farmEditHandler() {
      try {
        // 设置地址
        if (!this.$authority.isHasAuthority('admin:farm:edit')) {
          return;
        }
        this.$refs.farmFormComponent.setAddress();
        this.$refs.farmFormComponent.setCorporationAddress();
        this.$refs.farmFormComponent.setContactAddress();
        let valid = await this.$refs.farmFormComponent.$refs.farmForm.validate();
        if (valid) {
          if(this.$wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || this.$wsCache.localStorage.get('login').roleType === 'FARM_OWNER') {
            let isInputContent = await this.inputEditContent();
            if(!isInputContent) {
              return;
            }
          }
          let { id } = this.$route.params;
          let res = await this.updateFarmById(id);
          if (res && res.code === 0) {
            this.gotoFarmList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async inputEditContent() {
      try {
        let prompt = await this.$prompt("请填写更新内容", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请填写更新内容（200字以内）",
          inputValidator: (value) => {
            if(!value) {
              return `更新内容不能为空`;
            }            
            if(value.trim().length === 0) {
              return `更新内容不能为空`;
            }
            if (value.length > 200) {
              return `更新内容不能超过200个字`;
            }
          },
        });
        if (prompt.action === "confirm") {
          this.updateCurrentFarm({ key: "updateInfo", value: prompt.value });
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    gotoFarmList() {
      this.$router.push({ name: "FarmList" });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
