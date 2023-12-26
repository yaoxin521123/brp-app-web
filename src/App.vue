<template>
  <div class="container">
    <HosptialTop />
    <div class="content"><router-view></router-view></div>
    <HosptialBottom />
    <Login />
  </div>
</template>

<script setup lang="ts">


</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
    width: 1200px;
    min-height: 800px;
  }
}
</style>
