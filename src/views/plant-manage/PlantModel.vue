<template>
  <div id="plant-model-container">
    <div id="tab-list-block">
      <label v-for="(item, index) in cropList" :key="index" :class="{'active':index === currentIndex}" @click="currentIndex = index">{{item.plantName}}</label>
      <div class="add_crop" @click="choiceCrop"></div>
    </div>
    <div v-if="cropList.length > 0" class="table-list-scroll">
      <div class="field-row">
        <div class="row-left">作物周期</div>
        
        <div class="row-right">
          <el-button class="btn-style-two" @click="addCycle">
            <svg-icon icon-class="add_plus"/>
            新增
          </el-button>
        </div>
      </div>
      <div class="tabel-field">
        <el-table
          header-row-class-name="common-table-header"
          size="small"
          :row-class-name="tableRowClassName"
          class="my-table-style"
          :data="cycleList"
        >
          <el-table-column min-width="100px" label="周期名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="280px" label="排序">
            <template slot-scope="scope">{{scope.row.sortId}}</template>
          </el-table-column>
          <el-table-column width="140px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="editCycle(scope.row)">编辑</span>
                <span class="btn-text text-danger" @click="deleteCycle(scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="field-row">
        <div class="row-left">农事类型</div>
        
        <div class="row-right">
          <el-button class="btn-style-two" @click="addFarmType">
            <svg-icon icon-class="add_plus"/>
            新增
          </el-button>
        </div>
      </div>
      <div class="tabel-field">
        <el-table
          header-row-class-name="common-table-header"
          size="small"
          :row-class-name="tableRowClassName"
          class="my-table-style"
          :data="farmTypeList"
        >
          <el-table-column min-width="100px" label="周期名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="280px" label="排序">
            <template slot-scope="scope">{{scope.row.sortId}}</template>
          </el-table-column>
          <el-table-column width="140px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="editFarmType(scope.row)">编辑</span>
                <span class="btn-text text-danger" @click="deleteFarmType(scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else class="empty_crop">
      <p>还没有选择作物</p>
      <p>点击下方按钮选择地块种植的作物</p>
      <el-button class="btn-style-two" @click="choiceCrop">选择作物</el-button>
    </div>
    <create-dialog ref="cropDialog"></create-dialog>
    <cycle-dialog ref="cycleDialog"></cycle-dialog>
    <farm-type-dialog ref="farmTypeDialog"></farm-type-dialog>
  </div>
</template>
<script>
import CreateDialog from "./components/CreateCropDialog"
import CycleDialog from "./components/CreateCycleDialog"
import FarmTypeDialog from "./components/CreateFarmTypeDialog"
import CreateFarmTypeDialog from './components/CreateFarmTypeDialog.vue'
export default {
  data: function () {
    return {
      cropList: [], // 农场主自定义的作物列表
      showCropDialog: false,
      currentIndex: 0,
      cycleList: [],

      farmTypeList: [],
    };
  },
  mounted() {
    this.getPlantModelList();
  },
  components: {
    CreateDialog,
    CycleDialog,
    FarmTypeDialog
  },
  watch: {
    currentIndex(value) {
      this.currentPlant = this.cropList[value];
      this.getPlantCycleList();
      this.getFarmTypeList();
    }
  },
  methods: {
    choiceCrop() {
      if(this.$wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || this.$wsCache.localStorage.get('login').roleType === 'FARM_OWNER') {
        this.$refs.cropDialog.show();
      } else {

      }
    },
    // 获取
    getPlantModelList(isChildCall = false) {
      const id = this.$wsCache.localStorage.get('login').farmId;
      this.$service.getPlantModelList(id).then(res => {
        const {code, data, message} = res;
        if(code === 0) {
          this.cropList = data;
          if(!isChildCall) {
            this.currentPlant = this.cropList[this.currentIndex];
            this.getPlantCycleList();
            this.getFarmTypeList();
          }
        } else {
          console.log(message)
        }
      });
    },
    // 刷新种植模型列表 给子组件用
    refreshPlantModelList () {
      this.getPlantModelList(false);
    },
    // 获取作物周期列表
    getPlantCycleList() {
      this.$service.getPlantCycleList({farmId: this.currentPlant.farmId, plantName: this.currentPlant.plantName, pageNum: 0, pageSize: 100}).then(res => {
        const {code, data, message} = res;
        if(code === 0) {
          this.cycleList = data.list;
        } else {
          console.log(message)
        }
      })
    },
    addCycle() {
      this.$refs.cycleDialog.show(this.currentPlant);
    },
    editCycle(cycle) {
      this.$refs.cycleDialog.show(this.currentPlant, cycle, true);
    },
    deleteCycle(cycle) {
      this.$confirm(`确认要删周期：${cycle.name} ？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$service.deletePlantCycle(cycle.id);
        this.getPlantCycleList();
      }).catch((error) => {
        console.log(error);
      });
    },

    getFarmTypeList() {
      this.$service.getFarmTypeList({farmId: this.currentPlant.farmId, plantName: this.currentPlant.plantName, pageNum: 0, pageSize: 100}).then(res => {
        const {code, data, message} = res;
        if(code === 0) {
          this.farmTypeList = data.list;
        } else {
          console.log(message)
        }
      })
    },
    addFarmType() {
      this.$refs.farmTypeDialog.show(this.currentPlant);
    },
    editFarmType(farmType) {
      this.$refs.farmTypeDialog.show(this.currentPlant, farmType, true);
    },
    deleteFarmType(farmType) {
      this.$confirm(`确认要删农事类型：${farmType.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$service.deleteFarmType(farmType.id);
        this.getFarmTypeList();
      }).catch((error) => {
        console.log(error);
      });
    },

    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
  }
};
</script>
<style lang="scss" scoped>
#plant-model-container {
  padding: 18px;
  #tab-list-block {
    padding-left: 18px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    label {
      margin-right: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      height: 40px;
      background: rgba(42, 57, 78, 1);
      border-radius: 40px;
      font-size: 18px;
      font-weight: 400;
      color: rgba(159, 168, 184, 1);
      cursor: pointer;
      &:hover {
        color: #ffffff;
        background: #2a394e;
      }
      &.active {
        background: rgba(15, 112, 243, 1);
        color: rgba(255, 255, 255, 1);
      }
    }

    .add_crop {
      height: 20px;
      width: 20px;
      cursor: pointer;
      background: url('../../assets/img/icon-add-plant@2x.png') center center no-repeat;
      background-size: 100% 100%;
    }
  }
  .table-list-scroll {
    .field-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      background: #202C41;
      margin: 10px auto;
      padding: 0 20px;
      border-radius: 6px;
    }
  }
  .empty_crop {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    color: #6F7480;
    line-height: 28px;
    padding-top: 150px;
    .btn-style-two {
      margin-top: 20px;
    }
  }
}
</style>