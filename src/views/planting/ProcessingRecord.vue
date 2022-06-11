<template>
  <div class="processing-record-container">
    <div class="table-item">
      <div class="table-title">
        <div class="left-title">加工</div>
        <div class="right-btn">
          <el-button class="btn-style-two" @click="addProcessingHandler">
            <svg-icon icon-class="add_plus"/>
            添加
          </el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table
          header-row-class-name="common-table-header"
          size="small"
          :row-class-name="tableRowClassName"
          class="my-table-style"
          :data="plant.p5ProcessManage">
          <el-table-column prop="party" label="加工方"></el-table-column>
          <el-table-column prop="batch" label="加工批次"></el-table-column>
          <el-table-column prop="amount" label="加工量"></el-table-column>
          <el-table-column min-width="80px" label="加工日期">
            <template slot-scope="scope">{{scope.row.date | formatDate('yyyy-MM-DD')}}</template>
          </el-table-column>
          <el-table-column min-width="120px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="editProcessingHandler(scope.$index)">编辑</span>
                <span class="btn-text" @click="deleteHandler(scope.$index, `p5ProcessManage`)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-item">
      <div class="table-title">
        <div class="left-title">仓储</div>
        <div class="right-btn">
          <el-button class="btn-style-two" @click="addSaveHandler">
            <svg-icon icon-class="add_plus"/>
            添加
          </el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table
          header-row-class-name="common-table-header"
          size="small"
          :row-class-name="tableRowClassName"
          class="my-table-style"
          :data="plant.p6SaveManage">
          <el-table-column prop="type" label="仓储类型"></el-table-column>
          <el-table-column prop="address" label="仓库地址"></el-table-column>
          <el-table-column prop="totalAmount" label="仓库容量"></el-table-column>
          <el-table-column prop="amount" label="本次容量"></el-table-column>
          <el-table-column label="入仓时间">
            <template slot-scope="scope">{{scope.row.date | formatDate('yyyy-MM-DD')}}</template>
          </el-table-column>
          <el-table-column min-width="120px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="editSaveHandler(scope.$index)">编辑</span>
                <span class="btn-text" @click="deleteHandler(scope.$index, `p6SaveManage`)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-item">
      <div class="table-title">
        <div class="left-title">检测信息</div>
        <div class="right-btn">
          <el-button class="btn-style-two" @click="addCheckHandler">
            <svg-icon icon-class="add_plus"/>
            添加
          </el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table
          header-row-class-name="common-table-header"
          size="small"
          :row-class-name="tableRowClassName"
          class="my-table-style"
          :data="plant.p7CheckManage">
          <el-table-column prop="org" label="检测机构"></el-table-column>
          <el-table-column prop="user" label="送检人">
            <template slot-scope="scope">{{scope.row.user || '/'}}</template>
          </el-table-column>
          <el-table-column prop="project" label="检测项目"></el-table-column>
          <el-table-column prop="tester" label="检测员"></el-table-column>
          <el-table-column prop="mobile" label="检测员电话"></el-table-column>
          <el-table-column prop="lose" label="检测报告">
            <template slot-scope="scope">
              <span v-if="scope.row.fileList && scope.row.fileList.length > 0" class="detail-name" @click="showImagePreview(scope.row.fileList)">查看</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="检测时间">
            <template slot-scope="scope">{{scope.row.date | formatDate('yyyy-MM-DD')}}</template>
          </el-table-column>
          <el-table-column min-width="120px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="editCheckHandler(scope.$index)">编辑</span>
                <span class="btn-text" @click="deleteHandler(scope.$index, `p7CheckManage`)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-item">
      <div class="table-title">
        <div class="left-title">受灾信息</div>
        <div class="right-btn">
          <el-button class="btn-style-two" @click="addDisasterHandler">
            <svg-icon icon-class="add_plus"/>
            添加
          </el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table
          header-row-class-name="common-table-header"
          size="small"
          :row-class-name="tableRowClassName"
          class="my-table-style"
          :data="plant.p8DisasterInfo">
          <el-table-column prop="type" label="受灾类型"></el-table-column>
          <el-table-column prop="area" label="受灾面积"></el-table-column>
          <el-table-column prop="reduce" label="预计减产"></el-table-column>
          <el-table-column prop="lose" label="损失"></el-table-column>
          <el-table-column prop="lose" label="受灾图片">
            <template slot-scope="scope">
              <span v-if="scope.row.fileList && scope.row.fileList.length > 0" class="detail-name" @click="showImagePreview(scope.row.fileList)">查看</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="受灾时间">
            <template slot-scope="scope">{{scope.row.date | formatDate('yyyy-MM-DD')}}</template>
          </el-table-column>
          <el-table-column min-width="120px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="editDisasterHandler(scope.$index)">编辑</span>
                <span class="btn-text" @click="deleteHandler(scope.$index, `p8DisasterInfo`)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-item">
      <div class="table-title">
        <div class="left-title">农机具使用</div>
        <div class="right-btn">
          <el-button class="btn-style-two" @click="addMachineryHandler">
            <svg-icon icon-class="add_plus"/>
            添加
          </el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table
          header-row-class-name="common-table-header"
          size="small"
          :row-class-name="tableRowClassName"
          class="my-table-style"
          :data="plant.p9MachineryUse">
          <el-table-column prop="source" label="农机具来源"></el-table-column>
          <el-table-column prop="type" label="农机具类型"></el-table-column>
          <el-table-column prop="name" label="农机具名称"></el-table-column>
          <el-table-column prop="area" label="做用面积"></el-table-column>
          <el-table-column label="使用时间">
            <template slot-scope="scope">{{scope.row.date | formatDate('yyyy-MM-DD')}}</template>
          </el-table-column>
          <el-table-column min-width="120px" label="操作">
            <template slot-scope="scope">
              <div class="operator-btn-wrapper">
                <span class="btn-text" @click="editMachineryHandler(scope.$index)">编辑</span>
                <span class="btn-text" @click="deleteHandler(scope.$index, `p9MachineryUse`)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  相关弹窗 -->
    <processing-dialog ref="processingDialog"></processing-dialog>
    <save-dialog ref="saveDialog"></save-dialog>
    <check-dialog ref="checkDialog"></check-dialog>
    <disaster-dialog ref="disasterDialog"></disaster-dialog>
    <machinery-dialog ref="machineryDialog"></machinery-dialog>
    <image-preview ref="imagePreview"></image-preview>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapGetters, mapMutations, mapActions } from "vuex";
import ProcessingDialog from './processing_dialog/ProcessingDialog';
import SaveDialog from './processing_dialog/SaveDialog';
import CheckDialog from './processing_dialog/CheckDialog';
import DisasterDialog from './processing_dialog/DisasterDialog';
import MachineryDialog from './processing_dialog/MachineryDialog';
import ImagePreview from '@/components/ImagePreview';
export default {
  name: 'ProcessingRecord',
  components: {ProcessingDialog, SaveDialog, CheckDialog, DisasterDialog, MachineryDialog, ImagePreview},
  data() {
    return {};
  },
  created() {
    let { id } = this.$route.params;
    this.getPlantById(id);
  },
  computed: {
    ...mapGetters({
      plant: "plant/currentPlant",
      land: 'land/currentLand'
    })
  },
  methods: {
    ...mapMutations({
      updateCurrentPlant: 'plant/updateCurrentPlant'
    }),
    ...mapActions({
      createPlant: "plant/createPlant",
      getPlantById: "plant/getPlantById"
    }),
    tableRowClassName({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    // 加工
    addProcessingHandler() {
      this.$refs.processingDialog.show();
    },
    editProcessingHandler(index) {
      this.$refs.processingDialog.show(index);
    },
    // 仓储
    addSaveHandler() {
      this.$refs.saveDialog.show();
    },
    editSaveHandler(index) {
      this.$refs.saveDialog.show(index);
    },
    // 检测
    addCheckHandler() {
      this.$refs.checkDialog.show();
    },
    editCheckHandler(index) {
      this.$refs.checkDialog.show(index);
    },
    // 受灾
    addDisasterHandler() {
      this.$refs.disasterDialog.show();
    },
    editDisasterHandler(index) {
      this.$refs.disasterDialog.show(index);
    },
    // 农机具
    addMachineryHandler() {
      this.$refs.machineryDialog.show();
    },
    editMachineryHandler(index) {
      this.$refs.machineryDialog.show(index);
    },
    async deleteHandler(index, prop) {
      try {
        let confirm = await this.$confirm("你确定要删除该记录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let {id, code, area, farmId} = this.land;
          let data = _.cloneDeep(_.get(this.plant, prop));
          let newData = data.filter((item, _index) => index !== _index);
          this.updateCurrentPlant({ key: "farmLandId", value: id });
          this.updateCurrentPlant({ key: "farmLandCode", value: code });
          this.updateCurrentPlant({ key: "area", value: area });
          this.updateCurrentPlant({ key: prop, value: newData });
          let res = await this.createPlant(farmId);
          if (res && res.code === 0) {
            this.$message.success(`记录删除成功`);
            this.getPlantById(id);
          } else {
            this.$message.error(`记录删除失败`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    showImagePreview(fileList) {
      let imageList = fileList.map((file) => file.fileUrl || '');
      this.$refs.imagePreview.init(imageList, 0);
    }
  }
}
</script>
<style lang="scss" scoped>
.processing-record-container {
  padding-bottom: 100px;
  .table-item {
    margin-bottom: 20px;
    .table-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .left-title {
        font-size: 16px;
        color: #A8ABB3;
      }
      .right-btn {
        .btn-style-two {
          min-width: 66px;
        }
      }
    }
  }
}
</style>