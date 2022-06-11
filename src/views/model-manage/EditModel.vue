<!-- 编辑模型 -->
<template>
  <div id="edit-model-container">
    <model-form status="EDIT"></model-form>
  </div>
</template>

<script>
  import ModelForm from './components/ModelForm';

  export default {
    name: 'edit-model',
    components: {
      ModelForm
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

  #edit-model-container {
    padding: 18px;
  }

</style>
