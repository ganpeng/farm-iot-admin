<template>
  <div class="empty-container">
    <svg-icon icon-class="no_data_icon"></svg-icon>
    <div class="tips">{{text}}</div>
  </div>
</template>
<script>
export default {
  name: 'NoData',
  props: {
    text: String,
    default: '暂无数据'
  }
};
</script>
<style lang="scss" scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .svg-icon {
    width: 34px;
    height: 34px;
  }
  .tips {
    font-size: 14px;
    color: #9FA8B8;
    margin-top: 14px;
  }
}
</style>