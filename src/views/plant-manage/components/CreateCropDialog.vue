<template>
  <el-dialog
    title="添加作物"
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
            :model="plant"
            :rules="requiredRules"
            status-icon
            ref="plantForm"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <div class="step-content-item">
              <div class="training-list-container">
                    <div class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="作物分类" prop="plantType" required>
                          <el-select
                            v-model="plant.plantType"
                            clearable
                            placeholder="请选择"
                            @change="p1PlantTypeChangeHandler($event)"
                          >
                            <el-option
                              v-for="(item, index) in plantTypeOptions"
                              :key="index"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="作物名称" prop="plantName" required>
                          <el-select
                            v-model="plant.plantName"
                            clearable
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(item, _index) in plantNameOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
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
  name: "CreateCropDialog",
  data() {
    return {
      requiredRules: { 
        plantType: [
          {required: true, message: "该选项不能为空", trigger: 'blur'}
        ],
        plantName: [
          {required: true, message: "该选项不能为空", trigger: 'blur'}
        ]
      },
      submitDisabled: false,
      visible: false,
      plant: {
        plantType: '',
        plantName: '',
      },
      plantNameOptions: [],

    };
  },
  computed: {
    ...mapGetters({
      dict: "dict/dict",
      dictList: "dict/dictList"
    }),
    // p1
    plantTypeOptions() {
      return this.dict.cropType || [];
    },
    uniqId() {
      return _.uniqueId("option_key");
    },
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.plant.plantType = "";
      this.plant.plantName = "";
    },
    beforeCloseHandler() {
      this.hide();
    },
    p1PlantTypeChangeHandler(value) {
      let p1PlantType = this.plantTypeOptions.find(item => item.name === value);
      let options = this.dictList.filter(
        item => parseInt(item.parentId) === _.get(p1PlantType, "id")
      );
      this.plantNameOptions = options;
    }, 
    async openDialogHandler() {
      await this.$nextTick();
      this.$refs.plantForm.clearValidate();
    },    
    async enterHandler() {
      try {
        let valid = await this.$refs.plantForm.validate();
        
        if(valid) {
          let farmId = this.$wsCache.localStorage.get('login').farmId;
          const params = {
            farmId,
            plantName: this.plant.plantName
          }
          this.$service.addPlantModel(params).then(res => {
            this.$parent.refreshPlantModelList();
            this.hide();
          })
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
