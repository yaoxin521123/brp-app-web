<template>
  <div>
    <span>获取验证码({{ time }}s)</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
let props = defineProps(["flag"]);
let time = ref<number>(5);
watch(
  () => props.flag,
  () => {
    let timer = setInterval(() => {
      time.value--;
      if (time.value == 0) {
        $emit("getFlag", false);
        clearInterval(timer);
      }
    }, 1000);
  },
  {
    immediate: true,
  }
);
let $emit = defineEmits(["getFlag"]);
</script>

<style scoped></style>
