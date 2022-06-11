<!-- 模块详情 -->
<template>
  <div id="model-detail-container">
    <div id="detail-block">
      <div class="header">模型详情</div>
      <div class="content-block">
        <div class="content-item">
          <label>模型名称</label>
          <span>{{modelInfo.name}}</span>
        </div>
        <div class="content-item">
          <label>模型说明</label>
          <span>{{modelInfo.description}}</span>
        </div>
        <div class="content-item">
          <label>传感器类型</label>
          <span>{{modelInfo.sensorType | deviceType}}</span>
        </div>
        <div class="metric-item" v-for="(item, index) in  modelMetricList">
          <label>指标{{index + 1}}</label>
          <label>{{getMetricName(item.metric)}}
            <small>{{getMetricUnit(item.metric)}}</small>
          </label>
          <span>正常范围</span>
          <span>{{item.min}}-{{item.max}}</span>
        </div>
      </div>
    </div>
    <div class="fixed-btn-container">
      <el-button class="btn-style-two edit-bottom-btn"
                 type="primary"
                 @click="editModel">编辑
      </el-button>
      <el-button class="btn-style-three" @click="toModelList" plain>返回列表</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'model-detail',
    data() {
      return {
        modelInfo: {},
        modelMetricList: [],
        metricList: []
      }
    },
    mounted() {
      this.getMetricList().then(() => {
        this.getModelDetail();
      });
    },
    methods: {
      getMetricName(metric) {
        let name = '';
        this.metricList.map(item => {
          if (item.value === metric) {
            name = item.name;
          }
        });
        return name;
      },
      getMetricUnit(metric) {
        let unit = '';
        this.metricList.map(item => {
          if (item.value === metric) {
            unit = item.unit;
          }
        });
        return unit;
      },
      getMetricList() {
        return this.$service.getMetricList().then(response => {
          if (response && response.code === 0) {
            this.metricList = response.data;
          }
        })
      },
      getModelDetail() {
        this.$service.getModelDetail(this.$route.params.id).then(response => {
          if (response && response.code === 0) {
            this.modelInfo = response.data;
            this.modelMetricList = response.data.metrics;
          }
        })
      },
      editModel() {
        if (!this.$authority.isHasAuthority('admin:model:edit')) {
          return;
        }
        this.$router.push({name: 'EditModel', params: {id: this.$route.params.id}});
      },
      toModelList() {
        if (!this.$authority.isHasAuthority('admin:model:page')) {
          return;
        }
        this.$router.push({name: 'ModelList'});
      }
    }
  }
</script>

<style scoped lang="scss">

  #model-detail-container {
    padding: 0 20px;
  }

  #detail-block {
    margin-top: 20px;
    background: rgba(32, 44, 65, 1);
    border-radius: 10px;
    .header {
      padding-left: 20px;
      display: flex;
      align-items: center;
      height: 62px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(240, 240, 240, 1);
      border-bottom: 1px solid rgba(62, 73, 94, 1);
    }
    .content-block {
      padding: 30px 0;
      .content-item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        &:last-child {
          margin-bottom: 20px;
        }
        label {
          align-self: flex-start;
          margin-right: 20px;
          text-align: right;
          width: 160px;
          color: rgba(159, 168, 184, 1);
        }
        span {
          font-size: 14px;
          font-weight: 400;
          color: rgba(159, 168, 184, 1);
          width: 240px;
        }
      }
      .metric-item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        label {
          margin-right: 20px;
          text-align: right;
          width: 160px;
          color: rgba(159, 168, 184, 1);
          &:nth-child(2) {
            text-align: left;
            width: 380px;
            margin-right: 8px;
          }
        }
        span {
          margin-right: 20px;
          color: rgba(159, 168, 184, 1);
        }
      }
    }
  }

</style>
