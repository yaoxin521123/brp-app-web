<template>
  <div class="wrap">
    <div class="top">
      <div class="hosname">{{ workData.baseMap?.hosname }}</div>
      <div class="line"></div>
      <div>{{ workData.baseMap?.bigname }}</div>
      <div class="dot">.</div>
      <div class="hosdeparment">{{ workData.baseMap?.depname }}</div>
    </div>
    <div class="center">
      <h1 class="time">{{ workData.baseMap?.workDateString }}</h1>
      <div class="container">
        <div
          class="item"
          @click="changeTime(item)"
          :class="{
            active: item.status == -1 || item.availableNumber == -1,
            cur: item.workDate == workTime.workDate,
          }"
          v-for="item in workData.bookingScheduleList"
          :key="item"
        >
          <div class="top1">{{ item.workDate }} {{ item.dayOfWeek }}</div>
          <div class="bottom">
            <div v-if="item.status == -1">停止挂号</div>
            <div v-if="item.status == 0">
              {{
                item.availableNumber == -1
                  ? "满号"
                  : `有号(${item.availableNumber})`
              }}
            </div>
            <div v-if="item.status == 1">即将放号</div>
          </div>
        </div>
      </div>
      <el-pagination
        v-model:current-page="pageNo"
        layout="prev, pager, next"
        :total="workData.total"
        @current-change="fetchWorkData"
      />
    </div>
    <div class="bottom">
      <div class="will" v-if="workTime.status == 1">
        <span class="time">123</span>
        <span class="willText">放号</span>
      </div>
      <div class="doctor" v-else>
        <div class="moring">
          <div class="tip">
            <svg
              t="1702273660065"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2981"
              width="32"
              height="32"
            >
              <path
                d="M904.101037 676.946871H118.670712c-15.461511 0-28.105271-12.535384-28.105271-28.033021 0-15.461511 12.643759-28.105271 28.105271-28.10527h785.430325c15.461511 0 28.105271 12.643759 28.105271 28.10527s-12.607634 28.033021-28.105271 28.033021z m-56.029916-324.980738c-11.018133 10.945883-28.719396 10.945883-39.665279 0-11.018133-10.945883-11.018133-28.755521 0-39.665279l39.665279-39.665279a27.97522 27.97522 0 0 1 39.593029 0 27.93187 27.93187 0 0 1 0 39.665279l-39.593029 39.665279z m-62.279545 212.776406c-26.082269-128.027094-138.683977-224.444789-274.441826-224.44479-135.649474 0-248.287307 96.417696-274.369576 224.44479H177.915755c21.602766-158.263741 162.454244-280.583081 333.433995-280.583081 171.088125 0 311.903478 122.31934 333.506244 280.583081h-59.064418z m-274.441826-336.612997c-15.461511 0-28.033021-12.535384-28.033021-28.10527V143.95823c0-15.461511 12.535384-28.105271 28.033021-28.10527 15.569886 0 28.105271 12.643759 28.10527 28.10527v56.029916c0 15.606011-12.535384 28.141396-28.10527 28.141396zM174.700628 351.966133L135.035349 312.264729c-10.945883-10.945883-10.945883-28.755521 0-39.665279 11.018133-10.945883 28.719396-10.945883 39.665279 0l39.665279 39.665279a27.93187 27.93187 0 0 1 0 39.665279c-10.909758 10.982008-28.647146 10.982008-39.665279 0.036125z m-28.033021 381.119029h729.40041c15.497636 0 28.033021 12.535384 28.03302 28.03302a28.033021 28.033021 0 0 1-28.03302 28.033021H146.667607c-15.497636 0-28.033021-12.535384-28.03302-28.033021 0.036125-15.497636 12.571509-28.033021 28.03302-28.03302z m84.171312 112.168207h561.093911c15.497636 0 28.033021 12.535384 28.033021 28.033021 0 15.569886-12.535384 28.105271-28.033021 28.10527H230.838919c-15.497636 0-28.033021-12.535384-28.03302-28.10527 0-15.497636 12.535384-28.033021 28.03302-28.033021z"
                fill="#1296db"
                p-id="2982"
              ></path>
            </svg>
            <span class="text">上午号源</span>
          </div>
          <div class="doc_info" v-for="doctor in moringArr" :key="doctor.id">
            <div class="left">
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname }}</span>
              </div>
              <div class="skill">{{ doctor.skill }}</div>
            </div>
            <div class="right">
              <div class="money">{{ doctor.amount }}</div>
              <el-button type="primary" size="default"  @click="goStep2(doctor)">{{
                doctor.availableNumber
              }}</el-button>
            </div>
          </div>
        </div>
        <div class="moring">
          <div class="tip">
            <svg
              t="1702274450511"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4809"
              width="32"
              height="32"
            >
              <path
                d="M219.005 365.192h473.799v48H219.005z"
                fill="#1296db"
                p-id="4810"
              ></path>
              <path
                d="M428.666 567.874h64v326.881h-64zM628.666 959.046h-336c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h336c17.673 0 32 14.327 32 32 0 17.673-14.326 32-32 32z"
                fill="#1296db"
                p-id="4811"
              ></path>
              <path
                d="M460.666 662.367L130.627 332.329c-18.369-18.37-23.814-45.747-13.873-69.747s33.15-39.507 59.127-39.507H745.45c25.978 0 49.187 15.508 59.128 39.508s4.495 51.377-13.874 69.747L460.666 662.367zM175.882 287.074l284.784 284.783 284.783-284.784-569.567 0.001z m-0.303 0.02c-0.001 0-0.001 0 0 0-0.001 0-0.001 0 0 0z m0.102-0.249c0.001 0 0 0 0 0z m569.97 0z"
                fill="#1296db"
                p-id="4812"
              ></path>
              <path
                d="M730.379 470.437c-23.28 0-45.996-4.259-67.518-12.659l17.453-44.715c15.936 6.22 32.78 9.374 50.064 9.374 75.954 0 137.747-61.792 137.747-137.746 0-75.954-61.793-137.747-137.747-137.747s-137.747 61.793-137.747 137.747h-48c0-102.421 83.326-185.747 185.747-185.747s185.747 83.326 185.747 185.747c0.001 102.421-83.325 185.746-185.746 185.746z"
                fill="#1296db"
                p-id="4813"
              ></path>
            </svg>
            <span class="text">下午号源</span>
          </div>
          <div class="doc_info" v-for="doctor in afterArr" :key="doctor.id">
            <div class="left">
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname }}</span>
              </div>
              <div class="skill">{{ doctor.skill }}</div>
            </div>
            <div class="right">
              <div class="money">{{ doctor.amount }}</div>
              <el-button
                type="primary"
                size="default"
                @click="goStep2(doctor)"
                >{{ doctor.availableNumber }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { reqHospitalWork, reqHospitalDoctor } from "@/api/hospital";
import { useRoute, useRouter } from "vue-router";
import type {
  HospitalWorkData,
  DoctorResponseData,
  DocArr,
  Doctor,
} from "@/api/hospital/type";
let $route = useRoute();
let $router = useRouter();
let pageNo = ref<number>(1);
let limit = ref<number>(6);
let workData = ref<any>({});

let workTime: any = ref({});

let docArr = ref<DocArr>([]);
onMounted(() => {
  fetchWorkData();
});

const fetchWorkData = async () => {
  let result: HospitalWorkData = await reqHospitalWork(
    pageNo.value,
    limit.value,
    $route.query.hoscode as string,
    $route.query.depcode as string
  );
  if (result.code == 200) {
    workData.value = result.data;
    workTime.value = workData.value.bookingScheduleList[0];
    getDoctorWorkData();
  }
  console.log(result);
};
const getDoctorWorkData = async () => {
  let hoscode = $route.query.hoscode;
  let depcode = $route.query.depcode;
  let wordDate = workTime.value.workDate;

  let result: DoctorResponseData = await reqHospitalDoctor(
    hoscode as string,
    depcode as string,
    wordDate
  );
  if ((result.code = 200)) {
    docArr.value = result.data;
  }
};

const changeTime = (item: any) => {
  workTime.value = item;
  getDoctorWorkData();
};

let moringArr = computed(() => {
  return docArr.value.filter((doc: Doctor) => {
    return doc.workTime == 0;
  });
});
let afterArr = computed(() => {
  return docArr.value.filter((doc: Doctor) => {
    return doc.workTime == 1;
  });
});
const goStep2 = (doctor: Doctor) => {
  console.log(doctor);
  $router.push({
    path: "/hospital/register_step2",
    query: { docId: doctor.id },
  });
};
</script>

<style scoped lang="scss">
.wrap {
  .top {
    display: flex;
    color: #7f7f7f;
    .line {
      width: 0.5px;
      height: 18px;
      background: gray;
      margin: 0px 5px;
    }
    .dot {
      margin: 0px 5px;
    }
  }
  .center {
    margin: 20px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .time {
      font-weight: 900;
    }
    .container {
      width: 100%;
      display: flex;
      margin: 30px 0px;
      .item {
        flex: 1;
        width: 100%;
        border: 1px solid skyblue;
        margin: 0px 5px;
        color: #7f7f7f;
        transition: all 0.5s;
        &.active {
          border: 1px solid #ccc;

          .top1 {
            background: #ccc;
          }
        }
        &.cur {
          transform: scale(1.1);
        }
        .top1 {
          background: #e8f2ff;
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px;
        }
        .bottom {
          width: 100%;
          height: 60px;
          text-align: center;
          line-height: 60px;
        }
      }
    }
  }
  .bottom {
    .will {
      text-align: center;
      font-size: 30px;
      font-weight: 900;
      .time {
      }
      .willText {
      }
    }
    .doctor {
      .moring {
        .tip {
          display: flex;
          align-items: center;
          .text {
            margin-left: 10px;
            color: #7f7f7f;
            font-weight: 900;
          }
        }
        .doc_info {
          display: flex;
          justify-content: space-between;
          margin: 10px 0px;
          border-bottom: 1px solid #ccc;
          .left {
            .info {
              color: skyblue;
              margin: 10px 0px;
              span {
                margin: 0px 5px;
                font-size: 16px;
                font-weight: 900;
              }
            }
            .skill {
              margin: 10px 0px;
              color: #7f7f7f;
            }
          }
          .right {
            width: 150px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .money {
              color: #7f7f7f;
              font-weight: 900;
            }
          }
        }
      }
    }
  }
}
</style>
