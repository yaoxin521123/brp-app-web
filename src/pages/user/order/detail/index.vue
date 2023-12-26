<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="detail">挂号详情</div>
      </template>
      <div class="top">
        <el-tag class="ml-2" type="success">
          <div class="tag">
            <svg
              t="1702467827594"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2347"
              width="16"
              height="16"
            >
              <path
                d="M392.533333 806.4L85.333333 503.466667l59.733334-59.733334 247.466666 247.466667L866.133333 213.333333l59.733334 59.733334L392.533333 806.4z"
                fill="#1afa29"
                p-id="2348"
              ></path>
            </svg>
            <span>{{ orderInfo.param?.orderStatusString }}</span>
          </div>
        </el-tag>
        <div class="right_info">
          <img src="../../../../assets/images/code_app.png" alt="" />
          <div class="info">
            <p>微信 关注 “大姚预约挂号”</p>
            <p>“快速预约挂号”</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <!-- 左侧展示订单详情信息 -->
          <el-descriptions class="margin-top" :column="1" border>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊人信息</div>
              </template>
              {{ orderInfo.patientName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊日期</div>
              </template>
              {{ orderInfo.reserveDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊医院</div>
              </template>
              {{ orderInfo.hosname }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊科室</div>
              </template>
              {{ orderInfo.depname }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">医生职称</div>
              </template>
              {{ orderInfo.title }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">医师服务费</div>
              </template>
              <span style="color: red">{{ orderInfo.amount }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">挂号单号</div>
              </template>
              {{ orderInfo.outTradeNo }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">挂号时间</div>
              </template>
              {{ orderInfo.createTime }}
            </el-descriptions-item>
          </el-descriptions>
          <div
            class="btn"
            v-if="orderInfo.orderStatus == 0 || orderInfo.orderStatus == 1"
          >
            <el-popconfirm title="确定取消预约吗?" @confirm="cancel">
              <template #reference>
                <el-button>取消预约</el-button>
              </template>
            </el-popconfirm>
            <el-button
              type="primary"
              size="default"
              @click="openDialog"
              v-if="orderInfo.orderStatus == 0"
              >支付</el-button
            >
          </div>
        </div>
        <div class="right">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>注意事项</span>
              </div>
            </template>
            <p>
              1.请确认就诊人信息是否准确，若填写错误将无法取号就诊，损失由本人承担；
            </p>
            <p style="color: red">
              2.【取号】就诊当天需在{{ orderInfo.fetchTime }}前
              在医院取号，未取号视为爽约，该号不退不换；
            </p>
            <p>
              3.【退号】在{{ orderInfo.quitTime }}前可在线退号
              ，逾期将不可办理退号退费；
            </p>
            <p>
              4.大姚预约挂号支持自费患者使用身份证预约，同时支持天津市医保患者使用天津社保卡在平台预约挂号。请于就诊当日，携带预约挂号所使用的有效身份证件到院取号；
            </p>
            <p>5.请注意天津市医保患者在住院期间不能使用社保卡在门诊取号。</p>
          </el-card>
        </div>
      </div>
    </el-card>

    <el-dialog
      @close="close"
      v-model="dialogVisible"
      title="微信支付"
      width="400"
    >
      <!-- 支付需要使用的二维码图片 -->
      <div class="qrocde">
        <img :src="imgUrl" alt="" />
        <p>请使用微信扫一扫</p>
        <p>扫描二维码支付</p>
      </div>
      <!-- 对话框底部插槽传递结构 -->
      <template #footer>
        <el-button type="primary" size="default" @click="closeDialog"
          >关闭窗口</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  reqOrderInfo,
  reqCancelOrder,
  reqQueryPayState,
  reqQrcode,
} from "@/api/user";
import { useRoute } from "vue-router";
import type { OrderResponseData, QrCode, PayReslt } from "@/api/user/type";
import { ElMessage } from "element-plus";
//@ts-ignore
import QRCode from "qrcode";
let $route = useRoute();
let imgUrl = ref<string>("");
let dialogVisible = ref<boolean>(false);
// @ts-ignore
let orderInfo = ref<any>({});

let timer = ref<any>();
onMounted(() => {
  getOrderInfo();
});
const getOrderInfo = async () => {
  let result: OrderResponseData = await reqOrderInfo(
    $route.query.orderId as string
  );
  if (result.code == 200) {
    orderInfo.value = result.data;
  }
  console.log(result);
};

const cancel = async () => {
  let result: any = await reqCancelOrder($route.query.orderId as string);
  if (result.code == 200) {
    getOrderInfo();
  } else {
    ElMessage({
      type: "error",
      message: result.message,
    });
  }
};

const openDialog = async () => {
  dialogVisible.value = true;
  let result: QrCode = await reqQrcode($route.query.orderId as string);
  //更具服务器返回二维码信息生成二维码图片
  imgUrl.value = await QRCode.toDataURL(result.data.codeUrl);
  timer.value = setInterval(async () => {
    let result: PayReslt = await reqQueryPayState(
      $route.query.orderId as string
    );
    if (result.data) {
      //关闭对话框
      dialogVisible.value = false;
      //提示信息
      ElMessage({
        type: "success",
        message: "支付成功",
      });
      //清除定时器
      clearInterval(timer.value);
      //再次获取订单详情的数据
      getOrderInfo();
    }
  }, 2000);
};

const closeDialog = () => {
  dialogVisible.value = false;
  clearInterval(timer.value);
};

const close = () => {
  clearInterval(timer.value);
};
</script>

<style scoped lang="scss">
.box-card {
  .detail {
    color: #7f7f7f;
    font-weight: 900;
  }
  .top {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.5px solid #ccc;
    padding: 10px;
    .tag {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
    .right_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
      .info {
        margin-left: 10px;
        p {
          font-size: 12px;
          line-height: 20px;
        }
      }
    }
  }
  .bottom {
    display: flex;
    margin-top: 20px;
    .left {
      flex: 4;
      .btn {
        margin: 10px 0px;
      }
    }
    .right {
      margin-left: 20px;
      flex: 6;
      p {
        line-height: 30px;
      }
    }
  }
}
::v-deep(.el-dialog__body) {
  border-top: 0.5px solid #ccc;
  border-bottom: 0.5px solid #ccc;
}

.qrocde {
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    line-height: 30px;
  }
}
</style>
