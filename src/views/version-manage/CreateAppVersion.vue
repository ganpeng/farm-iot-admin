<!-- 创建模型 -->
<template>
  <div id="create-model-container">
    <app-version-form></app-version-form>
  </div>
</template>

<script>
  import AppVersionForm from './components/AppVersionForm';

  export default {
    name: 'create-app-version',
    components: {
      AppVersionForm
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">

  #create-model-container {
    padding: 18px;
  }

</style>
