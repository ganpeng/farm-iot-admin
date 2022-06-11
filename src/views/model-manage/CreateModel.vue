<!-- 创建模型 -->
<template>
  <div id="create-model-container">
    <model-form></model-form>
  </div>
</template>

<script>
  import ModelForm from './components/ModelForm';

  export default {
    name: 'create-model',
    components: {
      ModelForm
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
