<!-- 编辑用户 -->
<template>
  <div id="create-model-container">
    <version-form status="EDIT"></version-form>
  </div>
</template>

<script>
  import VersionForm from './components/AppVersionForm';

  export default {
    name: 'edit-version',
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
