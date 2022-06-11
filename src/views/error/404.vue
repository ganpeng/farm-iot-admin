<!-- 404 页面-->
<template>
  <div id="not-found-container">
    <svg-icon icon-class="404"></svg-icon>
  </div>
</template>

<script>
  export default {
    name: "404"
  }
</script>

<style scoped lang="scss">

  #not-found-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: rgba(26, 34, 51, 1);
    .svg-icon {
      width: 594px;
      height: 510px;
    }
  }

</style>
