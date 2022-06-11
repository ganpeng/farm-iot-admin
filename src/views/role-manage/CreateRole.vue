<!-- 创建角色 -->
<template>
  <div id="create-role-container">
    <role-form></role-form>
  </div>
</template>

<script>
  import RoleForm from './components/RoleForm';

  export default {
    name: 'create-role',
    components: {
      RoleForm
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">

  #create-role-container {
    padding: 18px;
  }

</style>
