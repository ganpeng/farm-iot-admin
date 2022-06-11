<template>
  <el-dialog
    title="添加作物周期"
    class="my-dialog no-footer-border"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-body">
      <div class="plant-protection-detail-container">
        <div class="steps-content">
          <el-form
            :model="cycleForm"
            :rules="requiredRules"
            status-icon
            ref="cycleForm"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <div class="step-content-item">
              <div class="training-list-container">
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="周期名称" prop="name">
                          <el-input v-model.trim="cycleForm.name" maxlength="20" placeholder="周期名称，20字以内"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="排序" prop="sortId">
                          <el-input v-model.trim.number="cycleForm.sortId"></el-input>
                        </el-form-item>
                      </el-col>
                    </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="submitDisabled" class="enter-btn" @click="enterHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "CreateCycleDialog",
  data() {
    let checkSortId = (rule, value, callback) => {
      if (this.$util.isEmpty(value)) {
        return callback(new Error('请输入版本号'));
      } else if(isNaN(Number(value))) {
        return callback(new Error('请输入大于0的整数'));
      } else if(Number(value) < 1) {
        return callback(new Error('请输入大于0的整数'));
      } else {
        callback();
      }
    };
    return {
      requiredRules: { 
        name: [
          {required: true, message: "周期名称不能为空", trigger: 'blur'}
        ],
        sortId: [
          {required: true, message: "排序不能为空", trigger: 'blur'},
          {validator: checkSortId, trigger: 'change'},
          {validator: checkSortId, trigger: 'blur'}
        ]
      },
      submitDisabled: false,
      visible: false,
      cycleForm: {
        name: '',
        sortId: '',
      },
      plantNameOptions: [],

    };
  },
  methods: {
    show(modelInfo, cycle, isEdit) {
      this.isEdit = isEdit;
      const {plantName, farmId} = modelInfo;
      this.plantName = plantName;
      this.farmId = farmId;
      this.visible = true;
      if(isEdit) {
        const {name, sortId, id} = cycle;
        this.cycleForm.name = name;
        this.cycleForm.sortId = sortId;
        this.editId = id;
      }
    },
    hide() {
      this.cycleForm.name = "";
      this.cycleForm.sortId = "";
      this.visible = false;
    },
    beforeCloseHandler() {
      this.hide();
    },
    async openDialogHandler() {
      await this.$nextTick();
      this.$refs.cycleForm.clearValidate();
    },    
    async enterHandler() {
      try {
        let valid = await this.$refs.cycleForm.validate();
        
        if(valid) {
          const params = {
            plantName: this.plantName,
            farmId: this.farmId,
            ...this.cycleForm
          }
          if(this.isEdit) {
            this.$service.editPlantCycle({...params, id: this.editId}).then(res => {
              this.hide();
              this.$parent.getPlantCycleList();
            })
          } else {
            this.$service.addPlantCycle(params).then(res => {
              this.hide();
              this.$parent.getPlantCycleList();
            })
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.plant-protection-detail-container {
  .steps-content {
    margin-top: 50px;
  }

}
</style>
