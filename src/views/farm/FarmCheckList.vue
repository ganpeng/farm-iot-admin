<template>
  <div class="farm-check-container my-content-container">
    <my-bord :bordList="bordList"></my-bord>
    <div class="my-search-field">
      <div class="field-row">
        <div class="row-left">
          <div class="search-field-item input-search">
            <el-input
              v-model="farmForm.keyword"
              placeholder="农场名称"
              @keyup.enter.native="searchHandler"
            ></el-input>
            <span
              @click="searchHandler"
              class="input-search-btn"
            >
              <svg-icon
                class="input-search-btn"
                icon-class="input_search_btn"
              />
              <svg-icon
                class="input-search-btn-active"
                icon-class="input_search_btn_hover"
              />
            </span>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">模块</label>
            <el-select
              v-model="farmForm.modelName"
              filterable
              clearable
              placeholder="请选择"
              @input="inputHandler"
            >
              <el-option
                v-for="(item, index) in farmModuleOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-field-item">
            <label class="search-field-item-label">状态</label>
            <el-select
              v-model="farmForm.approveStatus"
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
          <div
            @click="clearSearchField"
            class="clear-btn"
          >
            <span class="reset-icon">
              <svg-icon
                class="reset-btn"
                icon-class="reset_btn"
              />
              <svg-icon
                class="reset-btn-active"
                icon-class="reset_btn_active"
              />
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
        <el-table-column
          min-width="120px"
          label="农场名称"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.farmName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          label="模块"
        >
          <template slot-scope="scope">
            <span
              class="ellipsis two detail-name"
              @click="showEditDetail(scope.row)"
            >{{ farmTypeLabel(scope.row.modelName) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          label="更新内容"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.approveDesc || "/" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="280px"
          label="拒绝原因"
        >
          <template slot-scope="scope">{{ scope.row.reasonDesc || "/" }}</template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          label="状态"
        >
          <template slot-scope="scope">
            {{
            scope.row.approveStatus | checkStatus
            }}
          </template>
        </el-table-column>
        <el-table-column
          center
          min-width="120px"
          label="提交人"
        >
          <template slot-scope="scope">{{ scope.row.submitUser }}</template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          label="提交时间"
        >
          <template slot-scope="scope">
            {{
            scope.row.submitDate | formatDate("yyyy-MM-DD HH:mm")
            }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          label="操作"
        >
          <!-- 管理员端权限 -->
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
                $wsCache.localStorage.get('login').roleType ===
                  'FARM_EMPLOYEE' ||
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
    
    <manage-member-detail-dialog ref="manageMemberDetailDialog"></manage-member-detail-dialog>
    <homestead-detail-dialog ref="homesteadDetailDialog"></homestead-detail-dialog>
    <plant-member-detail-dialog ref="plantMemberDetailDialog"></plant-member-detail-dialog>
    <land-detail-dialog ref="landDetailDialog"></land-detail-dialog>
    <farm-machine-detail-dialog ref="farmMachineDetailDialog"></farm-machine-detail-dialog>
    <government-project-detail-dialog ref="governmentProjectDetailDialog"></government-project-detail-dialog>
    <subsidy-detail-dialog ref="subsidDetailDialog"></subsidy-detail-dialog>
    <social-detail-dialog ref="socialDetailDialog"></social-detail-dialog>
    <plant-history-dialog ref="plantHistoryDialog"></plant-history-dialog>
    <fish-history-dialog ref="fishHistoryDialog"></fish-history-dialog>

    <manage-member-dialog ref="manageMemberDialog"></manage-member-dialog>
    <plant-member-dialog ref="plantMemberDialog"></plant-member-dialog>
    <land-dialog ref="landDialog"></land-dialog>
    <homestead-dialog ref="homesteadDialog"></homestead-dialog>
    <farm-machine-dialog ref="farmMachineDialog"></farm-machine-dialog>
    <government-project-dialog ref="governmentProjectDialog"></government-project-dialog>
    <subsidy-dialog ref="subsidDialog"></subsidy-dialog>
    <social-dialog ref="socialDialog"></social-dialog>
    <plant-dialog ref="plantDialog"></plant-dialog>
    <fish-dialog ref="fishDialog"></fish-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import { mapGetters, mapMutations, mapActions } from "vuex";
import MyBord from "@/components/MyBord";
import constants from "@/util/constants";
import HomesteadDetailDialog from "./checkDetailDialog/HomesteadDetailDialog";
import LandDetailDialog from "./checkDetailDialog/LandDetailDialog";
import PlantMemberDetailDialog from "./checkDetailDialog/PlantMemberDetailDialog";
import ManageMemberDetailDialog from "./checkDetailDialog/ManageMemberDetailDialog";
import FarmMachineDetailDialog from "./checkDetailDialog/FarmMachineDetailDialog";
import GovernmentProjectDetailDialog from "./checkDetailDialog/GovernmentProjectDetailDialog";
import SubsidyDetailDialog from "./checkDetailDialog/SubsidyDetailDialog";
import SocialDetailDialog from "./checkDetailDialog/SocialDetailDialog";
import PlantHistoryDialog from "./checkDetailDialog/PlantHistoryDialog";
import FishHistoryDialog from "./checkDetailDialog/FishHistoryDialog";

import ManageMemberDialog from "./checkDetailDialog/editDialog/ManageMemberDialog";
import PlantMemberDialog from "./checkDetailDialog/editDialog/PlantMemberDialog";
import LandDialog from './checkDetailDialog/editDialog/LandDialog';
import HomesteadDialog from "./checkDetailDialog/editDialog/HomesteadDialog";
import FarmMachineDialog from "./checkDetailDialog/editDialog/FarmMachineDialog";
import GovernmentProjectDialog from "./checkDetailDialog/editDialog/GovernmentProjectDialog";
import SubsidyDialog from "./checkDetailDialog/editDialog/SubsidyDialog";
import SocialDialog from "./checkDetailDialog/editDialog/SocialDialog";
import PlantDialog from './checkDetailDialog/editDialog/PlantDialog';
import FishDialog from './checkDetailDialog/editDialog/FishDialog';

export default {
  components: {
    MyBord,
    HomesteadDetailDialog,
    LandDetailDialog,
    PlantMemberDetailDialog,
    ManageMemberDetailDialog,
    FarmMachineDetailDialog,
    GovernmentProjectDetailDialog,
    SubsidyDetailDialog,
    SocialDetailDialog,
    PlantHistoryDialog,
    FishHistoryDialog,
    ManageMemberDialog,
    PlantMemberDialog,
    LandDialog,
    HomesteadDialog,
    FarmMachineDialog,
    GovernmentProjectDialog,
    SubsidyDialog,
    SocialDialog,
    PlantDialog,
    FishDialog,
  },
  data() {
    return {
      bordList: constants.FARM_CHECK_LIST,
      farmForm: {
        keyword: "",
        modelName: "",
        approveStatus: "",
      },
      checkStatusOptions: [],
      farmModuleOptions: constants.MODEL_NAME_LIST,
      checkList: [],
      list: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      waterList: ["河流湖泊", "水库坑塘", "沼泽滩涂", "人工鱼塘"],
      isAdmin: false,
    };
  },
  computed: {
    isWaterForm() {
      return (form) => {
        return _.includes(this.waterList, form);
      };
    },
  },
  mounted() {
    this.getCheckInfo();
    // 获取审核列表
    this.getCheckList();

    this.isAdmin = this.$wsCache.localStorage.get('login').roleType === 'SUPER_ADMIN' || this.$wsCache.localStorage.get('login').roleType === 'CUSTOM';
    if(this.isAdmin) {
      // 管理员只有两个状态 
      this.checkStatusOptions = constants.APPROVE_STATUS_LIST_ADMIN;
    } else {
      // 农场主三个状态
      this.checkStatusOptions = constants.APPROVE_STATUS_LIST;
    }
  },
  methods: {
    ...mapMutations({
      setCurrentPlantMember: "plantMember/setCurrentPlantMember",
      setCurrentLand: "land/setCurrentLand",
      setCurrentHomestead: "homestead/setCurrentHomestead",
      setCurrentManageMember: "manageMember/setCurrentManageMember",
      setCurrentFarmMachine: "farmMachine/setCurrentFarmMachine",
      setCurrentGovernmentProject:
        "governmentProject/setCurrentGovernmentProject",
      setCurrentSubsidy: "subsidy/setCurrentSubsidy",
      setCurrentSocial: "social/setCurrentSocial",
      updateCurrentPlant: "plant/updateCurrentPlant",
      setCurrentPlant: 'plant/setCurrentPlant',
    }),
    // 获取审核数量信息
    async getCheckInfo() {
      try {
        let res = await this.$service.getCheckInfo({ approveType: "FARM" });
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
    async getCheckList() {
      let params = {
        pageNum: this.list.pageNum - 1,
        pageSize: this.list.pageSize,
        ...this.farmForm,
      };
      try {
        let res = await this.$service.getCheckList(params);
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
      this.farmForm = {
        keyword: "",
        modelName: "",
        approveStatus: "",
      };
      this.searchHandler();
    },
    // 表格斑马线
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    // 在拒绝之后重新编辑审核的内容
    editAgin(info) {
      const { modelName, approveInfo, approveStatus, id } = info;
      console.log(info, modelName, id);
      switch (modelName) {
        // 运营人员
        case "MANAGE_MEMBER_MANAGE":
          this.showManageMemberEditDialog(approveInfo, id);
          break;
        // 种植人员
        case "PLANT_MEMBER_MANAGE":
          this.showPlantMemberEditDialog(approveInfo, id);
          break;
        // 耕地管理
        case "LAND_MANAGE":
          this.showLandEditDialog(approveInfo, id);
          break;
        // 宅基地
        case "HOMESTEAD_MANAGE":
          this.showHomesteadEditDialog(approveInfo, id);
          break;
        // 农机具
        case "MACHINERY_MANAGE":
          this.showMachineryEditDialog(approveInfo, id);
          break;
        // 政府项目
        case "GOVERN_PROJECT":
          this.showGovernmentEditDialog(approveInfo, id);
          break;
        // 专项补贴
        case "SUBSIDY":
          this.showSubsidyEditDialog(approveInfo, id);
          break;
        // 社会化服务
        case "SOCIAL_SERVICE":
          this.showSocialEditDialog(approveInfo, id);
          break;
          // 种植管理
        case "PLANT_MANAGE":
          this.showHistoryEditDialog(approveInfo, id);
          break;
        case "FARM_INFO":
          this.gotoFarmEdit(info, id);
          break;
      }      
    },
    // 运营人员编辑
    showManageMemberEditDialog(manageMember, checkId) {
      let {id} = manageMember;
      this.setCurrentManageMember({manageMember});
      this.$refs.manageMemberDialog.show(id, checkId);
    }, 
    // 种植人员
    showPlantMemberEditDialog(manageMember, checkId) {
      let {id} = manageMember;
      this.setCurrentPlantMember({manageMember});
      this.$refs.plantMemberDialog.show(id, checkId);
    },
    // 耕地管理
    showLandEditDialog(land, checkId) {
      let {id} = land;
      this.setCurrentLand({land});
      this.$refs.landDialog.show(id, checkId);
    },
    // 宅基地管理
    showHomesteadEditDialog(homestead, checkId) {
      let { id } = homestead;
      this.setCurrentHomestead({ homestead });
      this.$refs.homesteadDialog.show(id, checkId);
    },
    // 农机具管理
    showMachineryEditDialog(farmMachine, checkId) {
      let { id } = farmMachine;
      this.setCurrentFarmMachine({ farmMachine });
      this.$refs.farmMachineDialog.show(id, checkId);
    },
    // 政府项目
    showGovernmentEditDialog(governmentProject, checkId) {
      let {id} = governmentProject;
      this.setCurrentGovernmentProject({governmentProject});
      this.$refs.governmentProjectDialog.show(id, checkId);
    },
    // 专项补贴
    showSubsidyEditDialog(subsidy, checkId) {
      let {id} = subsidy;
      this.setCurrentSubsidy({subsidy});
      this.$refs.subsidDialog.show(id, checkId);
    },
    // 农业社会化服务
    showSocialEditDialog(social, checkId) {
      let {id} = social;
      this.setCurrentSocial({social});
      this.$refs.socialDialog.show(id, checkId);
    },
    // 种植管理
    showHistoryEditDialog(land, checkId) {
      let {id, code, name, area, form, landName, farmLandId} = land;
      this.updateCurrentPlant({key: 'farmLandId', value: farmLandId});
      this.updateCurrentPlant({key: 'farmLandCode', value: code});
      this.updateCurrentPlant({key: 'area', value: area});

      this.setCurrentPlant({land});
      if (this.isWaterForm(form)) {
        this.$refs.fishDialog.show({name, code, id, area, checkId, landName, farmLandId});
      } else {
        this.$refs.plantDialog.show({name, code, id, area, checkId, landName, farmLandId});
      }
    },
    // 农场基本信息修改
    gotoFarmEdit(info, checkId) {
      let id = checkId,
        baseInfo = info.approveInfo;
      if (!this.$authority.isHasAuthority("admin:farm:detail")) {
        return;
      }
      this.$router.push({ name: "FarmCheckEdit", params: { id } });
    },

    // 跳转去农场详情 id：农场ID
    showEditDetail(info) {
      const { modelName, approveInfo, approveStatus, id } = info;
      console.log(info, modelName);
      switch (modelName) {
        // 运营人员
        case "MANAGE_MEMBER_MANAGE":
          this.showManageMemberDialog(approveInfo, approveStatus, id);
          break;
        // 种植人员
        case "PLANT_MEMBER_MANAGE":
          this.showPlantMemberDialog(approveInfo, approveStatus, id);
          break;
        // 耕地管理
        case "LAND_MANAGE":
          this.showLandDetailDialogHandler(approveInfo, approveStatus, id);
          break;
        // 宅基地
        case "HOMESTEAD_MANAGE":
          this.showHomesteadDetailDialog(approveInfo, approveStatus, id);
          break;
        // 农机具
        case "MACHINERY_MANAGE":
          this.showMachineryDetailDialog(approveInfo, approveStatus, id);
          break;
        // 政府项目
        case "GOVERN_PROJECT":
          this.showGovernmentDetailDialog(approveInfo, approveStatus, id);
          break;
        // 专项补贴
        case "SUBSIDY":
          this.showSubsidyDetailDialog(approveInfo, approveStatus, id);
          break;
        // 社会化服务
        case "SOCIAL_SERVICE":
          this.showSocialDetailDialog(approveInfo, approveStatus, id);
          break;
        case "PLANT_MANAGE":
          this.showHistoryDialog(approveInfo, approveStatus, id);
          break;
        case "FARM_INFO":
          this.gotoFarmDetail(info, approveStatus, id);
          break;
      }
    },
    // 农场基本信息展示
    gotoFarmDetail(info, approveStatus, checkId) {
      let id = info.farmId,
        baseInfo = info.approveInfo;
      if (!this.$authority.isHasAuthority("admin:farm:detail")) {
        return;
      }
      this.$router.push({ name: "FarmCheckDetail", params: { id, baseInfo, approveStatus, checkId } });
    },
    // 种植人员管理
    showPlantMemberDialog(manageMember, approveStatus, checkId) {
      this.setCurrentPlantMember({ manageMember });
      this.$refs.plantMemberDetailDialog.show(approveStatus, checkId);
    },
    // 运营人员管理
    showManageMemberDialog(manageMember, approveStatus, checkId) {
      this.setCurrentManageMember({ manageMember });
      this.$refs.manageMemberDetailDialog.show(approveStatus, checkId);
    },
    // 弹框 - 土地管理 - 耕地管理
    showLandDetailDialogHandler(land, approveStatus, checkId) {
      this.setCurrentLand({ land });
      this.$refs.landDetailDialog.show(approveStatus, checkId);
    },
    // 弹框 - 土地管理 - 宅基地管理
    showHomesteadDetailDialog(homestead, approveStatus, checkId) {
      this.setCurrentHomestead({ homestead });
      this.$refs.homesteadDetailDialog.show(approveStatus, checkId);
    },
    // 弹框 - 农机具管理
    showMachineryDetailDialog(farmMachine, approveStatus, checkId) {
      this.setCurrentFarmMachine({ farmMachine });
      this.$refs.farmMachineDetailDialog.show(approveStatus, checkId);
    },
    // 弹框 - 经营管理 - 政府项目
    showGovernmentDetailDialog(governmentProject, approveStatus, checkId) {
      this.setCurrentGovernmentProject({ governmentProject });
      this.$refs.governmentProjectDetailDialog.show(approveStatus, checkId);
    },
    // 弹框 - 经营管理 - 补贴
    showSubsidyDetailDialog(subsidy, approveStatus, checkId) {
      this.setCurrentSubsidy({ subsidy });
      this.$refs.subsidDetailDialog.show(approveStatus, checkId);
    },
    // 弹框 - 经营管理 - 农业社会化服务
    showSocialDetailDialog(social, approveStatus, checkId) {
      this.setCurrentSocial({ social });
      this.$refs.socialDetailDialog.show(approveStatus, checkId);
    },
    // 弹框 - 种植管理 tip: 区分一下 水产和地产 两种
    showHistoryDialog(land, approveStatus, checkId) {
      console.log(land);
      try {
        let { id, code, name, area, form, landName } = land;
        this.updateCurrentPlant({ key: "farmLandId", value: id });
        this.updateCurrentPlant({ key: "farmLandCode", value: code });
        this.updateCurrentPlant({ key: "area", value: area });

        this.setCurrentPlant({land});
        if (this.isWaterForm(form)) {
          this.$refs.fishHistoryDialog.show({ name, code, id, area, landName }, approveStatus, checkId);
        } else {
          this.$refs.plantHistoryDialog.show({ name, code, id, area, landName }, approveStatus, checkId);
        }
      } catch (err) {
        console.log(err);
      }
    },
    handlePaginationChange(value, key) {
      console.log(value, key);
      this.list[key] = value;
      this.searchHandler();
    },
    // 通过审核
    async passEdit(id) {
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
          let res = await this.$service.farmOperate(params);
          if (res && res.code === 0) {
            this.getCheckList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 拒绝审核
    async rejectEdit(id) {
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
          let res = await this.$service.farmOperate(params);
          if (res && res.code === 0) {
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
          let res = await this.$service.approveDelete(id);
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
          let res = await this.$service.approveCancel(id);
          if (res && res.code === 0) {
            this.getCheckList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 模块类型判断
    farmTypeLabel(type) {
      switch (type) {
        case "FARM_INFO":
          return "农场信息";
          break;
        case "HOMESTEAD_MANAGE":
          return "宅基地管理";
          break;
        case "LAND_MANAGE":
          return "耕地管理";
          break;
        case "MACHINERY_MANAGE":
          return "农机具管理";
          break;
        case "MANAGE_MEMBER_MANAGE":
          return "经营人员管理";
          break;
        case "PLANT_MEMBER_MANAGE":
          return "种植人员管理";
          break;
        case "PLANT_MANAGE":
          return "种植管理";
          break;
        case "GOVERN_PROJECT":
          return "政府项目";
          break;
        case "SUBSIDY":
          return "补贴";
          break;
        case "SOCIAL_SERVICE":
          return "社会化服务";
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
