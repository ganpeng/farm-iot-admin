<template>
  <div class="farming-plant-list-container">
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
        </div>
        <div class="row-right">
          <el-button class="btn-style-two" @click="addFarmingRecordHandler">
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
          <template slot-scope="scope">{{scope.row.startAt | formatDate('yyyy-MM-DD')}} ~ {{scope.row.endAt | formatDate('yyyy-MM-DD')}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="地块名称">
          <template slot-scope="scope">
            <span class="ellipsis">{{scope.row.landName}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px" label="种植作物">
          <template slot-scope="scope">{{scope.row.plantName}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="作物品种">
          <template slot-scope="scope">{{scope.row.seedName || '/'}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="操作人">
          <template slot-scope="scope">{{scope.row.userName || '/'}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="投入品">
          <template slot-scope="scope">{{scope.row.inputs ? '有' : '无'}}</template>
        </el-table-column>
        <el-table-column min-width="120px" label="操作">
          <template slot-scope="scope">
            <div class="operator-btn-wrapper">
              <span class="btn-text" @click="farmingRecordDetailHandler(scope.row.id)">详情</span>
              <span class="btn-text" @click="editFarmingRecordHandler(scope.row.id)">编辑</span>
              <span class="btn-text" @click="deleteFarmingRecordHandler(scope.row.id)">删除</span>
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
    <farming-record-dialog ref="farmingRecordDialog" :getAgriculRecordList="getAgriculRecordList" :cropActiveIndex="cropActiveIndex"></farming-record-dialog>
    <farming-record-detail-dialog ref="farmingRecordDetailDialog" :cropActiveIndex="cropActiveIndex"></farming-record-detail-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import {mapGetters} from 'vuex';
import FarmingRecordDialog from './FarmingRecordDialog';
import FarmingRecordDetailDialog from './FarmingRecordDetailDialog';
export default {
  name: 'FarmingRecordList',
  components: { FarmingRecordDialog, FarmingRecordDetailDialog },
  props: {
    cropActiveIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    cropActiveIndex() {
      this.getAgriculRecordList();
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
  created() {
    this.getAgriculRecordList();
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
    getAgriculRecordList() {
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
      this.$service.getAgriculRecordList(params)
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
      this.getAgriculRecordList();
    },
    addFarmingRecordHandler() {
      this.$refs.farmingRecordDialog.show();
    },
    completeFarmingRecordHandler() {},
    editFarmingRecordHandler(id) {
      this.$refs.farmingRecordDialog.show(id);
    },
    farmingRecordDetailHandler(id) {
      this.$refs.farmingRecordDetailDialog.show(id);
    },
    async deleteFarmingRecordHandler(id) {
      try {
        let confirm = await this.$confirm("你确定要删除该记录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (confirm) {
          let res = await this.$service.updateAgriculRecord({id, status: 'DELETED'});
          if (res && res.code === 0) {
            this.$message.success(`记录删除成功`);
            this.getAgriculRecordList();
          } else {
            this.$message.error(`记录删除失败`);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}
</script>