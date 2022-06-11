<template>
  <div class="farm-edit-container my-content-container">
    <!-- <check-farm-form ref="farmFormComponent"></check-farm-form>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two" type="primary" @click="farmEditHandler">保存</el-button>
      <el-button class="btn-style-three" @click="gotoFarmList" plain>返回列表</el-button>
    </div> -->
  </div>
</template>
<script>
// import { mapActions } from "vuex";
// import CheckFarmForm from "./CheckFarmForm";
// export default {
//   name: "FarmEdit",
//   components: { FarmForm },
//   async created() {
//     try {
//       let { id } = this.$route.params;
//       await this.getFarmById(id);
//       await this.$nextTick();
//       this.$util.toggleFixedBtnContainer();
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   methods: {
//     ...mapMutations({
//       updateCurrentFarm: "farm/updateCurrentFarm"
//     }),
//     ...mapActions({
//       getFarmById: "farm/getFarmById",
//       updateFarmById: "farm/updateFarmById"
//     }),
//     async farmEditHandler() {
//       try {
//         // 设置地址
//         if (!this.$authority.isHasAuthority('admin:farm:edit')) {
//           return;
//         }
//         this.$refs.farmFormComponent.setAddress();
//         this.$refs.farmFormComponent.setCorporationAddress();
//         this.$refs.farmFormComponent.setContactAddress();
//         let valid = await this.$refs.farmFormComponent.$refs.farmForm.validate();
//         if (valid) {
//           if($wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || $wsCache.localStorage.get('login').roleType === 'FARM_OWNER') {
//             let isInputContent = await this.inputEditContent();
//             if(!isInputContent) {
//               return;
//             }
//           }
//           let { id } = this.$route.params;
//           let res = await this.updateFarmById(id);
//           if (res && res.code === 0) {
//             this.gotoFarmList();
//           }
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     },
//     gotoFarmList() {
//       this.$router.push({ name: "FarmList" });
//     }
//   }
// };
</script>
<style lang="scss" scoped>
</style>
