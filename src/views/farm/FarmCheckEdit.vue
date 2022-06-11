<template>
  <div class="farm-edit-container my-content-container">
    <farm-check-form-edit ref="farmFormComponent"></farm-check-form-edit>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two" type="primary" @click="farmEditHandler">保存</el-button>
      <el-button class="btn-style-three" @click="gotoFarmCheckList" plain>返回列表</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import FarmCheckFormEdit from "./FarmCheckFormEdit";
export default {
  name: "FarmEdit",
  components: { FarmCheckFormEdit },
  async created() {
    try {
      let { id } = this.$route.params;
      await this.getFarmByCheckId(id);
      await this.$nextTick();
      this.$util.toggleFixedBtnContainer();
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    ...mapGetters({
      farm: "farm/currentFarm",
    }),
  },
  methods: {
    ...mapMutations({
      updateCurrentFarm: "farm/updateCurrentFarm",
    }),
    ...mapActions({
      getFarmById: "farm/getFarmById",
      getFarmByCheckId: "farm/getFarmByCheckId",
      updateFarmById: "farm/updateFarmById",
      approveFarmEditSubmit: 'farm/approveFarmEditSubmit'
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
          let res = await this.approveFarmEditSubmit({id, approveInfo: this.farm, updateInfo: this.updateInfo});
          if (res && res.code === 0) {
            this.gotoFarmCheckList();
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
          this.updateInfo = prompt.value;
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },    
    gotoFarmCheckList() {
      this.$router.push({ name: "FarmCheckList" });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
