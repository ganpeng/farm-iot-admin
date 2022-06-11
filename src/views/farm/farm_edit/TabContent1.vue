<template>
    <div class="tab-content-one">
        <el-row>
            <el-col :span="16">
                <farm-form ref="farmFormComponent"></farm-form>
            </el-col>
        </el-row>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="farmEditHandler">保存</el-button>
            <el-button class="btn-style-three" @click="gotoFarmList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import FarmForm from '../FarmForm';
export default {
    name: 'TabContent1',
    components: {FarmForm},
    methods: {
        gotoFarmList() {
            this.$router.push({name: 'FarmList'});
        },
        farmEditHandler() {
            this.$router.push({name: 'FarmList'});
        }
    }
};
</script>
<style lang="scss" scoped>
.tab-content-one {}
</style>
