<template>
  <div>
    <Carousel />
    <Search />
    <el-row gutter="20">
      <el-col :span="20">
        <Level @getLevel="getLevel" />
        <Region @getRegion="getRegion" />
        <div class="hospital" v-if="hasHospitalArr.length > 0">
          <Card
            v-for="(item, index) in hasHospitalArr"
            :key="index"
            :hospitalInfo="item"
            class="item"
          />
        </div>
        <el-empty v-else description="暂无数据" />
        <el-pagination
        class="pagination"
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="currentChange"
          @size-change="sizeChange"
        />
      </el-col>
      <el-col :span="4"><Tip /></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { reqHospital } from "@/api/home";
import Carousel from "./carousel/index.vue";
//@ts-ignore
import Search from "./search/index.vue";
//@ts-ignore
import Level from "./level/index.vue";
import Region from "./region/index.vue";
//@ts-ignore
import Card from "./card/index.vue";
import Tip from "./tip/index.vue";
import type { Content, HospitalResponseData } from "@/api/home/type";
let hasHospitalArr = ref<Content>([]);
let pageNo = ref<number>(1);
let pageSize = ref<number>(10);
let total = ref<number>(0);

let hosType = ref<string>("");
let districtCode = ref<string>("");
onMounted(() => {
  getHospitalInfo();
});
const getHospitalInfo = async () => {
  let result: HospitalResponseData = await reqHospital(
    pageNo.value,
    pageSize.value,
    hosType.value,
    districtCode.value
  );
  if (result.code == 200) {
    hasHospitalArr.value = result.data.content;
    total.value = result.data.totalElements;
  }
};

const currentChange = () => {
  getHospitalInfo();
};

const sizeChange = () => {
  pageNo.value = 1;
  getHospitalInfo();
};

const getLevel = (level: string) => {
  hosType.value = level;
  getHospitalInfo();
};
const getRegion = (region: string) => {
  districtCode.value = region;
  getHospitalInfo();
};
</script>

<style scoped lang="scss">
.hospital {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  justify-content: space-between;
  .item {
    margin-top: 10px;
    width: 48%;
  }
}
.pagination{
  margin-bottom: 10px;
}
</style>
