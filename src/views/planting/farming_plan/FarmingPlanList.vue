<template>
  <div class="farming-plant-list-container">
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
        </div>
        <div class="row-right">
          <el-button class="btn-style-two" @click="addFarmingPlanHandler">
            <svg-icon icon-class="add_plus"/>
            添加
          </el-button>
        </div>
      </div>
    </div>
    <div class="tabel-field">
      <el-table
        size="small"
        header-row-class-name="common-table-header"
        :row-class-name="tableRowClassName"
        class="my-table-style"
        :data="list.data">
        <el-table-column min-width="80px" label="操作日期">
          <template slot-scope="scope">{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="作物周期">
          <template slot-scope="scope">
            <span class="ellipsis">{{scope.row.cropCycleName}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px" label="农事类型">
          <template slot-scope="scope">{{scope.row.agriculTypeName}}</template>
        </el-table-column>
        <el-table-column min-width="180px" label="农事描述">
          <template slot-scope="scope">{{scope.row.farmDes || '/'}}</template>
        </el-table-column>
        <el-table-column min-width="60px" label="状态">
          <template slot-scope="scope">{{statusLabel(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span v-if="scope.row.status !== 'COMPLETE'" class="btn-text" @click="completeFarmingPlanHandler(scope.row.id)">完成</span>
              <span class="btn-text" @click="farmingPlanDetailHandler(scope.row.id)">详情</span>
              <span class="btn-text" @click="editFarmingPlanHandler(scope.row.id)">编辑</span>
              <span class="btn-text" @click="deleteFarmingPlanHandler(scope.row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handlePaginationChange($event, 'pageSize')"
      @current-change="handlePaginationChange($event, 'pageNum')"
      :current-page="list.pagination.pageNum + 1"
      :page-sizes="[5, 10, 20, 50,100, 200, 500]"
      :page-size="list.pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.pagination.total"
    ></el-pagination>
    <farming-plan-dialog ref="farmingPlanDialog" :getAgriculPlanList="getAgriculPlanList" :cropActiveIndex="cropActiveIndex"></farming-plan-dialog>
    <farming-plan-detail-dialog ref="farmingPlanDetailDialog" :cropActiveIndex="cropActiveIndex"></farming-plan-detail-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import {mapGetters} from 'vuex';
import FarmingPlanDialog from './FarmingPlanDialog';
import FarmingPlanDetailDialog from './FarmingPlanDetailDialog';
export default {
  name: 'FarmingPlanList',
  components: { FarmingPlanDialog, FarmingPlanDetailDialog },
  props: {
    cropActiveIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    cropActiveIndex() {
      this.getAgriculPlanList();
    }
  },
  data() {
    return {
      status: {
        'UNCOMPLETE': '未开始',
        'HAVEINHAND': '进行中',
        'COMPLETE': '已完成',
        'POSTPONED': '已延期',
        'DELETED': '已删除'
      },
      list: {
        data: [],
        pagination: {
          pageNum: 0,
          pageSize: 10,
          total: 0
        }
      }
    };
  },
  async created() {
    try {
      this.getAgriculPlanList();
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    ...mapGetters({
      plant: 'plant/currentPlant',
      land: 'land/currentLand',
      dict: "dict/dict",
      dictList: "dict/dictList"
    }),
    statusLabel() {
      return (status) => {
        return _.get(this.status, status) || '';
      }
    },
    getCurrentCropValueByKey() {
      return (key) => {
        return _.get(this.plant, `p1.${this.cropActiveIndex}.${key}`);
      };
    }
  },
  methods: {
    getAgriculPlanList() {
      let farmId = _.get(this.land, 'farmId');
      let landId = _.get(this.land, 'id');
      let plantId = _.get(this.plant, 'id');
      let plantName = this.getCurrentCropValueByKey('p1PlantName');
      let uuid = this.getCurrentCropValueByKey('uuid');
      let {pageNum, pageSize} = this.list.pagination;
      let params = _.assign({},{farmId, landId, plantId, plantName, uuid}, {
        pageSize,
        pageNum: pageNum > 0 ? pageNum - 1 : pageNum
      });
      this.$service.getAgriculPlanList(params)
        .then((res) => {
          if (res && res.code === 0) {
            let {list, pageNum, pageSize, total} = res.data;
            this.list.data = list || [];
            this.list.pagination = { pageNum, pageSize, total };
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    tableRowClassName({rowIndex}) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    handlePaginationChange(value, key) {
      _.set(this.list.pagination, key, value);
      this.getAgriculPlanList();
    },
    addFarmingPlanHandler() {
      this.$refs.farmingPlanDialog.show();
    },
    completeFarmingPlanHandler(id) {
      this.$refs.farmingPlanDialog.show(id, true);
    },
    farmingPlanDetailHandler(id) {
      this.$refs.farmingPlanDetailDialog.show(id);
    },
    editFarmingPlanHandler(id) {
      this.$refs.farmingPlanDialog.show(id);
    },
    async deleteFarmingPlanHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除该计划吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.$service.updateAgriculPlan({id, status: 'DELETED'});
          if (res && res.code === 0) {
            this.$message.success(`计划删除成功`);
            this.getAgriculPlanList();
          } else {
            this.$message.error(`计划删除失败`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}
</script>