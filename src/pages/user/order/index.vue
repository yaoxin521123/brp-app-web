<template>
  <div>
    <div v-if="$route.query.orderId"><Detail /></div>
    <div v-else><AllOrder /></div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
// @ts-ignore
import Detail from "./detail/index.vue";
// @ts-ignore
import AllOrder from "./allOrder/index.vue";
let $route = useRoute();

</script>

<style scoped></style>
