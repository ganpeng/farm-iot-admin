<!-- 预警表格组件 -->
<template>
  <div class="warning-table-container">
    <el-table
      ref="multipleTable"
      header-row-class-name="common-table-header"
      :row-class-name="tableRowClassName"
      class="my-table-style row-table"
      :data="warningList">
      <el-table-column
        width="20px">
      </el-table-column>
      <el-table-column
        prop="warnCode"
        align="left"
        width="200px"
        label="预警编号">
        <template slot-scope="scope">
          <div>{{scope.row.warnCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceName"
        align="left"
        label="设备ID/devicename">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.deviceName || '/'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="farmName"
        align="left"
        label="所属农场">
        <template slot-scope="scope">
          <div class="table-item">{{scope.row.farmName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="warnType"
        align="left"
        label="预警类型">
        <template slot-scope="scope">
          <span>{{scope.row.warnType | getErrorStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        align="left"
        width="450px"
        label="预警详情">
        <template slot-scope="scope">
          <el-tooltip v-if="Array.isArray(scope.row.description) && scope.row.description.length > 0"
                      popper-class="description-display larger" effect="light"
                      placement="bottom-start">
            <div slot="content">
              <div v-for="item in scope.row.description">
                <label>{{getMetricName(item.metric)}}{{item.value}}{{getMetricUnit(item.metric)}}，</label>
                <span class="up-data" v-if="item.up">↑{{item.up}}</span>
                <span class="down-data" v-if="item.low">↓{{item.low}}</span>
                <label>，</label>
                <label v-if="item.max">最高阈值：{{item.max}}{{getMetricUnit(item.metric)}}</label>
                <label v-if="item.min">最低阈值：{{item.min}}{{getMetricUnit(item.metric)}}</label>
              </div>
            </div>
            <span>
              <div v-for="(item, index) in scope.row.description" v-if="index < 2">
                <label>{{getMetricName(item.metric)}}{{item.value}}{{getMetricUnit(item.metric)}}，</label>
                <span class="up-data" v-if="item.up">↑{{item.up}}</span>
                <span class="down-data" v-if="item.low">↓{{item.low}}</span>
                <label>，</label>
                <label v-if="item.max">最高阈值：{{item.max}}{{getMetricUnit(item.metric)}}</label>
                <label v-if="item.min">最低阈值：{{item.min}}{{getMetricUnit(item.metric)}}</label>
              </div>
            </span>
          </el-tooltip>
          <div v-else>
            <span>{{(scope.row.description && scope.row.description.description)}}</span>
            <div v-for="(item, index) in scope.row.description"
                 v-if="Array.isArray(scope.row.description) && scope.row.description.length > 0 && index < 2">
              <label>{{getMetricName(item.metric)}}{{item.value}}{{getMetricUnit(item.metric)}}，</label>
              <span class="up-data" v-if="item.up">↑{{item.up}}</span>
              <span class="down-data" v-if="item.low">↓{{item.low}}</span>
              <label>，</label>
              <label v-if="item.max">最高阈值：{{item.max}}{{getMetricUnit(item.metric)}}</label>
              <label v-if="item.min">最低阈值：{{item.min}}{{getMetricUnit(item.metric)}}</label>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="发出时间">
        <template slot-scope="scope">
          <div class="time-block">
            <div>{{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}</div>
            <div>{{scope.row.updatedAt | formatDate('HH:mm')}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name: 'WarningTable',
    props: {
      warningList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        metricList: []
      };
    },
    filters: {
      getStatus(status) {
        return {'HANDLED': '已处理', 'UNHANDLED': '未处理', 'RECOVER': '自动恢复'}[status]
      },
      getErrorStatus(status) {
        return {'DEVICE_ERROR': '设备异常', 'MODEL_WARN': '模型预警'}[status]
      }
    },
    mounted() {
      this.getMetricList();
    },
    methods: {
      getMetricList() {
        this.$service.getMetricList().then(response => {
          if (response && response.code === 0) {
            this.metricList = response.data;
          }
        })
      },
      getMetricUnit(metric) {
        let unit = '';
        this.metricList.map(item => {
          if (item.value.toLowerCase() === metric) {
            unit = item.unit;
          }
        });
        return unit;
      },
      getMetricName(metric) {
        let name = '';
        this.metricList.map(item => {
          if (item.value.toLowerCase() === metric) {
            name = item.name;
          }
        });
        return name && (name + '：');
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 1) {
          return 'odd-row';
        } else if (rowIndex % 2 === 0) {
          return 'even-row';
        }
        return '';
      }
    }
  };
</script>

<style lang="scss" scoped>

  .cell-id {
    font-size: 12px;
    font-weight: 400;
    color: rgba(46, 171, 255, 1);
  }

  .table-item {
    &:hover {
      color: #f0f0f0;
    }
  }

  .cell-manager {
    font-size: 12px;
    font-weight: 400;
    color: rgba(138, 185, 232, 1);
    cursor: pointer;
  }

  .time-block {
    width: 75px;
    text-align: center;
  }

  .up-data {
    color: #FF6E6E;
  }

  .down-data {
    color: #7ED321;
  }

</style>
