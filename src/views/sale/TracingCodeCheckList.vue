<template>
  <div class="tracing-code-list-container my-content-container">
    <my-bord :width="270" :bordList="bordList"></my-bord>
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              v-model="searchField.keyword"
              placeholder="商品名称、溯源批号"
              @keyup.enter.native="searchHandler"
            ></el-input>
            <span @click="searchHandler" class="input-search-btn">
              <svg-icon class="input-search-btn" icon-class="input_search_btn"/>
              <svg-icon class="input-search-btn-active" icon-class="input_search_btn_hover"/>
            </span>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">状态</label>
            <el-select
              v-model="searchField.approveStatus"
              filterable
              clearable
              placeholder="请选择"
              @input="inputHandler"
            >
              <el-option
                v-for="(item, index) in checkStatusOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div @click="clearSearchField" class="clear-btn">
            <span class="reset-icon">
              <svg-icon class="reset-btn" icon-class="reset_btn"/>
              <svg-icon class="reset-btn-active" icon-class="reset_btn_active"/>
            </span>
            重置
          </div>
        </div>
      </div>
    </div>
    <div class="tabel-field">
      <el-table
        header-row-class-name="common-table-header"
        size="small"
        :row-class-name="tableRowClassName"
        class="my-table-style"
        :data="checkList"
      >
        <el-table-column min-width="120px" label="商品名称">
          <template slot-scope="scope">
            <span class="ellipsis two detail-name" @click="showCheckDetail(scope.row)">{{scope.row.approveInfo.goodsName}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" label="溯源批号">
          <template slot-scope="scope">{{scope.row.approveInfo.batchNo}}</template>
        </el-table-column>
        <el-table-column min-width="180px" label="更新内容">
          <template slot-scope="scope">{{scope.row.approveDesc || '/'}}</template>
        </el-table-column>
        <el-table-column min-width="180px" label="拒绝原因">
          <template slot-scope="scope">{{scope.row.reasonDesc || '/'}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="状态">
          <template slot-scope="scope">{{scope.row.approveStatus | checkStatus}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="提交人">
          <template slot-scope="scope">{{scope.row.submitUser}}</template>
        </el-table-column>
        <el-table-column min-width="80px" label="提交时间">
          <template slot-scope="scope">{{scope.row.submitDate | formatDate("yyyy-MM-DD HH:mm")}}</template>
        </el-table-column>
        <el-table-column min-width="100px" label="操作">
          <template slot-scope="scope">
            <div
              class="operator-btn-wrapper"
              v-if="
                $wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' ||
                $wsCache.localStorage.get('login').roleType === 'CUSTOM'
              "
            >
              <!-- 拒绝的可以删除；待审核的是通过和拒绝 -->
              <span
                v-if="scope.row.approveStatus === 'APPROVING'"
                class="btn-text"
                @click="passEdit(scope.row.id)"
              >通过</span>
              <span
                v-if="scope.row.approveStatus === 'APPROVING'"
                class="btn-text"
                @click="rejectEdit(scope.row.id)"
              >拒绝</span>
              <span
                v-if="scope.row.approveStatus === 'REJECT'"
                class="btn-text text-danger"
                @click="deleteEdit(scope.row.id)"
              >删除</span>
            </div>
            <!-- 农场主端权限 -->
            <div
              class="operator-btn-wrapper"
              v-if="
                $wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' ||
                $wsCache.localStorage.get('login').roleType === 'FARM_OWNER'
              "
            >
              <!-- 待审核的可以撤回 不可删除；已拒绝的可以再次编辑 也可以直接删除；首次编辑是在农场列表 -->
              <span
                v-if="scope.row.approveStatus === 'REJECT' || scope.row.approveStatus === 'WITHDRAW'"
                class="btn-text"
                @click="editAgin(scope.row)"
              >编辑</span>
              <span
                v-if="scope.row.approveStatus === 'APPROVING'"
                class="btn-text"
                @click="cancelEdit(scope.row.id)"
              >撤回</span>
              <span
                v-if="scope.row.approveStatus === 'REJECT' || scope.row.approveStatus === 'WITHDRAW'"
                class="btn-text text-danger"
                @click="deleteEdit(scope.row.id)"
              >删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handlePaginationChange($event, 'pageSize')"
      @current-change="handlePaginationChange($event, 'pageNum')"
      :current-page="list.pageNum"
      :page-sizes="[10, 20, 50,100, 200, 500]"
      :page-size="list.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.total"
    ></el-pagination>

    <!-- 查看溯源详情弹框 -->
    <check-tracing-info ref="checkTracingInfo" :tracingList="traceInfo"></check-tracing-info>
    
    <check-tracing-dialog ref="checkTracingDialog"></check-tracing-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import MyBord from "@/components/MyBord";
import constants from "@/util/constants";
import CheckTracingInfo from './CheckTracingInfo';
import CheckTracingDialog from './CheckTracingDialog'
export default {
  name: "TracingCodeCheckList",
  components: { MyBord, CheckTracingInfo, CheckTracingDialog },
  data() {
    return {
      // 查询条件
      searchField: {
        keyword: '',
        approveStatus: '',
      },
      list: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },      
      checkList: [],
      traceInfo: [],
      // 状态列表
      checkStatusOptions: constants.APPROVE_STATUS_LIST,
      // 审核数量
      bordList: constants.FARM_CHECK_LIST
    };
  },
  computed: {
    ...mapGetters({

    }),
  },
 
  async created() {
    try {
      // 获取审核数量信息
      this.getCheckInfo();  
      // 获取审核列表
      this.getCheckList(); 
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      setCurrentBatch: 'batch/setCurrentBatch',
    }),
    ...mapActions({

    }),

    // 按照条件进行查询
    searchHandler() {
      this.getCheckList();
    }, 
    // 改变查询条件
    inputHandler() {
      this.getCheckList();
    },
    // 重置查询条件
    clearSearchField() {
      this.searchField = {
        keyword: "",
        approveStatus: "",
      };
      this.searchHandler();
    },
    handlePaginationChange(value, key) {
      this.list[key] = value;
      this.searchHandler();
    }, 
    showCheckDetail(row) {
      this.traceInfo = row.approveInfo.traceInfo;
      this.$refs.checkTracingInfo.show({status: row.approveStatus, id: row.id});
    },   
    // 获取审核数量信息
    async getCheckInfo() {
      try {
        let res = await this.$service.getCheckInfo({ approveType: "TRACE" });
        if (res && res.code === 0) {
          let bordList = [];
          let totalNums = {
            title: "总数",
            count: _.get(res.data, "totalNums"),
          };
          let approvingNums = {
            title: "待审核",
            count: _.get(res.data, "approvingNums"),
          };
          let rejectNums = {
            title: "已拒绝",
            count: _.get(res.data, "rejectNums"),
          };
          bordList.push(totalNums);
          bordList.push(approvingNums);
          bordList.push(rejectNums);
          this.bordList = bordList;
        }
      } catch (err) {
        console.log(err);
      }
    },
    editAgin(batch) {
      let {id, approveInfo, approveInfo: {goodsId, goodsName}} = batch;
      batch = approveInfo;
      this.setCurrentBatch({batch});
      this.$refs.checkTracingDialog.show({id, goodsId, goodsName});
    },
    async getCheckList() {
      let params = {
        pageNum: this.list.pageNum - 1,
        pageSize: this.list.pageSize,
        ...this.searchField,
      };
      try {
        let res = await this.$service.getTraceCodeCheckList(params);
        if (res && res.code === 0) {
          const { list } = res.data;
          this.checkList = list;
          this.list = res.data;
          this.list.pageNum = res.data.pageNum + 1;
        }
      } catch (err) {
        console.log(err);
      }
    },  
    // 通过审核
    async passEdit(id, callback) {
      try {
        // TODO 这个权限判断？
        // if (!this.$authority.isHasAuthority('admin:farm:delete')) {
        //   return;
        // }
        let confirm = await this.$confirm(
          "确定通过此次修改内容？通过后不可撤销，请谨慎操作。",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (confirm) {
          let params = {
            id,
            approveStatus: "APPROVED",
            reasonDesc: "",
          };
          let res = await this.$service.approveTraceOperate(params);
          if (res && res.code === 0) {
            callback && callback();
            this.getCheckList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 拒绝审核
    async rejectEdit(id, callback) {
      try {
        // TODO 这个权限判断？
        // if (!this.$authority.isHasAuthority('admin:farm:delete')) {
        //   return;
        // }
        let prompt = await this.$prompt("请填写拒绝原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请输入拒绝原因（100字以内）",
          inputValidator: (value) => {
            if(!value) {
              return `拒绝原因不能为空`;
            }            
            if (value.trim().length === 0) {
              return `拒绝原因不能为空`;
            }
            if (value.length > 100) {
              return `拒绝原因不能超过100个字`;
            }
          },
        });
        if (prompt.action === "confirm") {
          let params = {
            id,
            approveStatus: "REJECT",
            reasonDesc: prompt.value,
          };
          let res = await this.$service.approveTraceOperate(params);
          if (res && res.code === 0) {
            callback && callback();
            this.getCheckList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 删除审核
    async deleteEdit(id) {
      try {
        // TODO 这个权限判断？
        // if (!this.$authority.isHasAuthority('admin:farm:delete')) {
        //   return;
        // }
        let confirm = await this.$confirm("确定删除此次修改操作？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        if (confirm) {
          let res = await this.$service.approveTraceDelete(id);
          if (res && res.code === 0) {
            this.getCheckList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 撤回提交的内容
    async cancelEdit(id) {
      try {
        // TODO 这个权限判断？
        // if (!this.$authority.isHasAuthority('admin:farm:delete')) {
        //   return;
        // }
        let confirm = await this.$confirm("确定撤回此次修改操作？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        if (confirm) {
          let res = await this.$service.approveTraceWithdraw(id);
          if (res && res.code === 0) {
            this.getCheckList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },     
    // 表格斑马线
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
<style lang="scss">
.el-popover {
  .qrcode-title {
    color: #F0F0F0;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
  }
  .image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    .logo-image {
      width: 92px;
      height: 24px;
      background-image: url('../../assets/img/tracing_code_list_logo.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center center;
      margin: 10px 0;
    }
  }
}
</style>
