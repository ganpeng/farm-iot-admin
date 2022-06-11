<!-- 创建模型 -->
<template>
  <div id="create-model-container">
    <version-form></version-form>
  </div>
</template>

<script>
  import VersionForm from './components/VersionForm';

  export default {
    name: 'create-version',
    components: {
      VersionForm
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
