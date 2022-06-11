<template>
  <div class="planting-record-container">
    <div v-if="plant.p1.length > 0" class="have-crop-container">
      <div class="crop-list-container">
        <ul class="crop-list">
          <li v-for="(crop, index) in plant.p1"
            :key="index"
            :class="['crop-item', cropActiveIndex === index && 'active']">
            <span @click="changeCropHandler(index)" class="title">{{crop.p1PlantName}}-{{crop.p1SeedName}}</span>
            <span @click="editCropHandler(index)" class="crop-edit-btn">
              <svg-icon icon-class="crop_edit_icon"/>
            </span>
            <span @click="deleteHandler(index, `p1`)" class="crop-delete-btn">
              <svg-icon icon-class="crop_delete_icon"/>
            </span>
          </li>
        </ul>
        <span @click="addCropHandler" class="add-btn">
          <svg-icon icon-class="add_icon_2"/>
        </span>
      </div>
      <sub-tab-bar
        :tabBarList="tabBarList"
        :subActiveIndex="subActiveIndex"
        :changeSubActiveIndexHandler="changeSubActiveIndexHandler">
      </sub-tab-bar>
      <div class="tab-content-container my-content-container">
        <div v-if="subActiveIndex === 0" class="tab-content">
          <farming-plan-list ref="farmingPlanList" :cropActiveIndex="cropActiveIndex"></farming-plan-list>
        </div>
        <div v-if="subActiveIndex === 1" class="tab-content">
          <farming-record-list :cropActiveIndex="cropActiveIndex"></farming-record-list>
        </div>
        <div v-if="subActiveIndex === 2" class="tab-content">
          <processing-record></processing-record>
        </div>
      </div>
    </div>
    <div v-else class="no-crop-container">
      <div class="empty-content">
        <div class="tip">
          <p>还没有选择作物</p>
          <p>点击下方按钮选择地块种植的作物</p>
        </div>
        <el-button class="btn-style-two" type="primary" @click="addCropHandler">添加作物</el-button>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-three" @click="gotoPlantManageList" plain>返回列表</el-button>
    </div>
    <add-crop-dialog ref="addCropDialog"></add-crop-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import SubTabBar from '@/components/SubTabBar';
import AddCropDialog from './AddCropDialog';
import ProcessingRecord from './ProcessingRecord';
import FarmingPlanList from './farming_plan/FarmingPlanList';
import FarmingRecordList from './farming_record/FarmingRecordList';
export default {
  name: "PlantingRecord",
  components: { SubTabBar, AddCropDialog, ProcessingRecord, FarmingPlanList, FarmingRecordList },
  data() {
    return {
      cropActiveIndex: 0,
      subActiveIndex: 0,
      tabBarList: [
        {
          title: "农事计划"
        },
        {
          title: "农事记录"
        },
        {
          title: '加工记录'
        }
      ]
    };
  },
  async created() {
    try {
      let { id } = this.$route.params;
      await this.getPlantById(id);
      await this.getLandById(id);
      this.$refs.farmingPlanList.getAgriculPlanList();
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    ...mapGetters({
      plant: "plant/currentPlant",
      land: 'land/currentLand',
      dict: "dict/dict",
      dictList: "dict/dictList",
    }),
  },
  methods: {
    ...mapMutations({
      updateCurrentPlant: 'plant/updateCurrentPlant'
    }),
    ...mapActions({
      getPlantById: "plant/getPlantById",
      createPlant: 'plant/createPlant',
      deletePlant: 'plant/deletePlant',
      getLandById: 'land/getLandById'
    }),
    changeCropHandler(index) {
      this.cropActiveIndex = index;
    },
    changeSubActiveIndexHandler(index) {
      this.subActiveIndex = index;
    },
    addCropHandler() {
      this.$refs.addCropDialog.show();
    },
    editCropHandler(index) {
      this.$refs.addCropDialog.show(index);
    },
    async deleteHandler(index, prop) {
      try {
        let confirm = await this.$confirm("你确定要删除该作物吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let {id, code, area, farmId, form, name} = this.land;
          let data = _.cloneDeep(_.get(this.plant, prop));
          let uuid = _.get(this.plant, `p1.${index}.uuid`);
          let newData = data.filter((item, _index) => index !== _index);
          this.updateCurrentPlant({ key: "farmLandId", value: id });
          this.updateCurrentPlant({ key: "farmLandCode", value: code });
          this.updateCurrentPlant({ key: "area", value: area });
          this.updateCurrentPlant({ key: "form", value: form });
          this.updateCurrentPlant({ key: "landName", value: name });
          this.updateCurrentPlant({ key: "deleteUuid", value: [uuid] });
          this.updateCurrentPlant({ key: prop, value: newData });
          let res = await this.deletePlant(farmId);
          if (res && res.code === 0) {
            this.$message.success(`作物删除成功`);
            this.getPlantById(id);
          } else {
            this.$message.error(`作物删除失败`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    gotoPlantManageList() {
      let {farmId} = this.land;
      this.$router.push({ name: "FarmManage", params: {id: farmId}, query: {mindex: 4} });
    }
  },
};
</script>
<style lang="scss" scoped>
.planting-record-container {
  width: 100%;
  height: 100%;
  .crop-list-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    background-color: #0f1623;
    .crop-list {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 32px;
      margin-left: 36px;
      .crop-item {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 120px;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        margin-right: 16px;
        .title {
          display: inline-block;
          font-size: 16px;
          color: #9fa8b8;
          height: 32px;
          line-height: 32px;
          cursor: pointer;
        }
        .crop-edit-btn {
          cursor: pointer;
          margin: 0 14px;
        }
        .crop-delete-btn {
          cursor: pointer;
        }
        &:hover {
          .title {
            color: #fff;
          }
        }
        &.active {
          background-color: $mainColor;
          border-radius: 20px;
          .title {
            color: #fff;
          }
        }
      }
    }
    .add-btn {
      cursor: pointer;
      .svg-icon {
        width: 22px;
        height: 22px;
      }
    }
  }
  .no-crop-container {
    position: relative;
    width: 100%;
    height: 100%;
    .empty-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .tip {
        color: #6F7480;
        font-size: 18px;
      }
      .btn-style-two {
        margin-top: 20px;
      }
    }
  }
}
</style>