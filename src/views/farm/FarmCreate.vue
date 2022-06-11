<template>
    <div class="farm-create-container my-content-container">
        <farm-form ref="farmFormComponent"></farm-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="farmCreateHandler">保存</el-button>
            <el-button class="btn-style-three" @click="gotoFarmList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapMutations, mapActions} from 'vuex';
import FarmForm from './FarmForm';
export default {
    name: 'FarmCreate',
    components: { FarmForm },
    async created() {
      try {
        await this.$nextTick();
        this.resetCurrentFarm();
        this.$util.toggleFixedBtnContainer();
      } catch (err) {
        console.log(err);
      }
    },
    methods: {
        ...mapMutations({
            resetCurrentFarm: 'farm/resetCurrentFarm'
        }),
        ...mapActions({
            createFarm: 'farm/createFarm'
        }),
        async farmCreateHandler() {
            try {
                // 设置地址
                if (!this.$authority.isHasAuthority('admin:farm:add')) {
                  return;
                }
                this.$refs.farmFormComponent.setAddress();
                this.$refs.farmFormComponent.setCorporationAddress();
                this.$refs.farmFormComponent.setContactAddress();
                let valid = await this.$refs.farmFormComponent.$refs.farmForm.validate();
                if (valid) {
                  let res = await this.createFarm();
                  if (res && res.code === 0) {
                      this.gotoFarmList();
                  }
                }
            } catch (err) {
                console.log(err);
            }
        },
        gotoFarmList() {
            this.$router.push({name: 'FarmList'});
        }
    }
};
</script>
<style lang="scss" scoped>
.farm-create-container {}
</style>
