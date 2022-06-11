<!-- 编辑角色 -->
<template>
  <div id="edit-role-container">
    <role-form status="EDIT"></role-form>
  </div>
</template>

<script>
  import RoleForm from './components/RoleForm';

  export default {
    name: 'edit-role',
    components: {
      RoleForm
    },
    data() {
      return {

      }
    },
    mounted() {

    },
    methods: {

    }
  }
</script>

<style scoped lang="scss">

  #edit-role-container {
    padding: 18px;
  }

</style>
