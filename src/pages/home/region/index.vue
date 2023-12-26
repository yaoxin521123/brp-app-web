<template>
  <div class="region">
    <div class="content">
      <div class="left">地区：</div>
      <ul class="hospital">
        <li :class="{ active: regionFlag == '' }" @click="changeLevel('')">
          全部
        </li>
        <li
          v-for="level in regionArr"
          :key="level.value"
          :class="{ active: regionFlag == level.value }"
          @click="changeLevel(level.value)"
        >
          {{ level.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqHospitalLevelAndRegion } from "@/api/home";
import { onMounted, ref } from "vue";
import {
  HospitalLevelAndRegionResponseData,
  HospitalLevelAndRegionArr,
} from "@/api/home/type";
import { ElMessage } from "element-plus";
let regionArr = ref<HospitalLevelAndRegionArr>([]);
let regionFlag = ref<string>("");
onMounted(() => {
  getRegion();
});
const getRegion = async () => {
  let result: HospitalLevelAndRegionResponseData =
    await reqHospitalLevelAndRegion("Beijin");
  if (result.code == 200) {
    regionArr.value = result.data;
  } else {
    ElMessage({
      type: "error",
      message: "区域接口：" + result.message,
    });
  }
};
const changeLevel = (level: string) => {
  regionFlag.value = level;
  $emit("getRegion", level);
};

let $emit = defineEmits(["getRegion"]);
</script>

<style scoped lang="scss">
.region {
  color: #7f7f7f;
  margin-top: 10px;
  .content {
    display: flex;
    .left {
      margin-right: 10px;
      flex: 0.5;
    }
    .hospital {
      flex: 9;
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 10px;
        margin-bottom: 10px;
        &.active {
          color: #55a6fe;
        }
      }
      li:hover {
        color: #55a6fe;
        cursor: pointer;
      }
    }
  }
}
</style>

<script lang="ts">
export default { name: "Region" };
</script>
