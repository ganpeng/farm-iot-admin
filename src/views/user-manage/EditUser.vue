<!-- 编辑用户 -->
<template>
  <div id="create-model-container">
    <user-form status="EDIT"></user-form>
  </div>
</template>

<script>
  import UserForm from './components/UserForm';

  export default {
    name: 'edit-user',
    components: {
      UserForm
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
