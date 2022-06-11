<!--物联网数据---摄像头列表搜索参数设置组件-->
<template>
  <div id="camera-search-container">
    <div @keyup.enter="getCameraList" class="text-left filters-container">
      <el-form :inline="true" class="filter-form">
        <el-form-item>
          <el-input
            v-model="listQueryParams.deviceId"
            @change="getCameraList(true)"
            class="border-input keyword-input"
            placeholder="设备ID">
            <span slot="append" @click="getCameraList(false)">
              <svg-icon icon-class="search_filter"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="listQueryParams.type"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地块">
          <el-select
            v-model="listQueryParams.landCode"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in landOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select
            v-model="listQueryParams.deviceStatus"
            @change="getCameraList(true)"
            clearable
            placeholder="全部">
            <el-option
              v-for="item in deviceStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="reset-btn"
            @click="clearFilters"
            type="primary">
            <svg-icon icon-class="reset_filter_active"></svg-icon>
            <svg-icon icon-class="reset_filter_normal"></svg-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'CameraFilter',
    data() {
      return {
        listQueryParams: {
          deviceId: '',
          type: '',
          landCode: '',
          deviceStatus: ''
        },
        landOptions: [],
        typeOptions: [{
          value: 1,
          label: '枪机摄像头'
        }, {
          value: 2,
          label: '球机摄像头'
        }],
        deviceStatusOptions: [{
          value: 'ONLINE',
          label: '在线'
        }, {
          value: 'OFFLINE',
          label: '离线'
        }, {
          value: 'DELETE',
          label: '已删除'
        }]
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getLandList();
      },
      getLandList() {
        let landOptions = [];
        let homesteadPromise = this.$service.getHomesteadList({
          pageNum: 0,
          pageSize: 1000,
          farmId: this.$route.params.id
        }).then(response => {
          if (response && response.code === 0) {
            landOptions = landOptions.concat(response.data.list);
          }
        });
        let landPromise = this.$service.getLandList({
          pageNum: 0,
          pageSize: 1000,
          farmId: this.$route.params.id
        }).then(response => {
          if (response && response.code === 0) {
            landOptions = landOptions.concat(response.data.list);
          }
        });
        Promise.all([homesteadPromise, landPromise]).then(() => {
          this.landOptions = landOptions;
        }).catch(e => {

        });
      },
      initFilterParams(params) {
      },
      getCameraList(isReset) {
        this.$emit('getCameraList', this.listQueryParams, isReset);
      },
      clearFilters() {
        for (let key in this.listQueryParams) {
          if (Array.isArray(this.listQueryParams[key])) {
            this.listQueryParams[key] = [];
          } else {
            this.listQueryParams[key] = '';
          }
        }
        this.getCameraList(true);
      }
    }
  };
</script>

<style lang="scss" scoped>

  #camera-search-container {
    margin-bottom: 10px;
  }

</style>
