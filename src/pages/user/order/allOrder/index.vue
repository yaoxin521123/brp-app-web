<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>挂号订单</span>
        </div>
      </template>
      <el-form :inline="true">
        <el-form-item label="就诊人">
          <el-select
            placeholder="请选择就诊人"
            v-model="patientId"
            @change="changeUser"
          >
            <el-option label="请选择全部就诊人" value=""></el-option>
            <el-option
              v-for="item in allUser"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            placeholder="请选择订单状态"
            v-model="orderStatus"
            @change="changeOrderState"
          >
            <el-option label="全部订单" value=""></el-option>
            <el-option
              v-for="(item, index) in allOrderState"
              :key="index"
              :label="item.comment"
              :value="item.status"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table border style="margin: 10px 0px" :data="allOrderArr">
        <el-table-column label="就诊时间" prop="reserveDate"></el-table-column>
        <el-table-column label="医院" prop="hosname"></el-table-column>
        <el-table-column label="科室" prop="depname"></el-table-column>
        <el-table-column label="医生" prop="title"></el-table-column>
        <el-table-column label="服务费" prop="amount"></el-table-column>
        <el-table-column label="就诊人" prop="patientName"></el-table-column>
        <el-table-column
          label="订单状态"
          prop="param.orderStatusString"
        ></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="text" @click="goDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getOrderInfo"
        @size-change="handler"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// @ts-ignore
import type {
  AllOrderState,
  AllOrderStateResponseData,
  AllUserResponseData,
  AllUser,
  UserOrderInfoResponseData,
  Records,
} from "@/api/user/type";

import { reqUserOrderInfo, reqAllUser, reqOrderState } from "@/api/user";
import { useRouter } from "vue-router";
let $router = useRouter();
let pageNo = ref<number>(1);

let pageSize = ref<number>(10);
let patientId = ref<string>("");
let orderStatus = ref<string>("");
let allOrderArr = ref<Records>([]);
let total = ref<number>(0);

let allUser = ref<AllUser>([]);

let allOrderState = ref<AllOrderState>([]);
onMounted(() => {
  getOrderInfo();
  getData();
});
const getOrderInfo = async (pager: number = 1) => {
  pageNo.value = pager;
  let result: UserOrderInfoResponseData = await reqUserOrderInfo(
    pageNo.value,
    pageSize.value,
    patientId.value,
    orderStatus.value
  );
  if (result.code == 200) {
    allOrderArr.value = result.data.records;
    total.value = result.data.total;
  }
};
const goDetail = (row: any) => {
  $router.push({ path: "/user/order", query: { orderId: row.id } });
};
const handler = (pageSizes: number) => {
  pageSize.value = pageSizes;
  getOrderInfo();
};
const getData = async () => {
  //获取全部的就诊人信息
  const result: AllUserResponseData = await reqAllUser();
  //获取全部的订单状态
  const result1: AllOrderStateResponseData = await reqOrderState();
  allUser.value = result.data;
  allOrderState.value = result1.data;
};


const changeUser = () => {

  getOrderInfo();
};

const changeOrderState = ()=>{
  getOrderInfo();
}
</script>

<style scoped></style>
