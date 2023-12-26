<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>就诊人管理</span>
          <el-button class="button" type="primary" :icon="User" @click="addUser"
            >添加就诊人</el-button
          >
        </div>
      </template>
      <div class="visitors" v-if="scene == 0">
        <Visitor
          @changeScene="changeScene"
          @removeUser="removeUser"
          class="item"
          v-for="(user, index) in userArr"
          :key="user.id"
          :user="user"
          :index="index"
        />
      </div>

      <div class="form" v-if="scene == 1">
        <el-divider content-position="left">就诊人信息</el-divider>
        <el-form style="width: 60%; margin: 10px auto">
          <el-form-item label="用户姓名">
            <el-input
              placeholder="请输入用户姓名"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select
              placeholder="请选择证件的类型"
              style="width: 100%"
              v-model="userParams.certificatesType"
            >
              <el-option
                v-for="item in certationArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input
              placeholder="请输入证件号码"
              v-model="userParams.certificatesNo"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户性别">
            <el-radio-group v-model="userParams.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker
              type="date"
              placeholder="请你选择日期"
              value-format="YYYY-MM-DD"
              v-model="userParams.birthdate"
            />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input
              placeholder="请输入手机号码"
              v-model="userParams.phone"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-divider content-position="left"
          >建档信息（完善后部分医院首次就诊不排队建档）</el-divider
        >
        <el-form style="width: 60%; margin: 10px auto">
          <el-form-item label="婚姻状况">
            <el-radio-group v-model="userParams.isMarry">
              <el-radio :label="0">未婚</el-radio>
              <el-radio :label="1">已婚</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自费/医保">
            <el-radio-group v-model="userParams.isInsure">
              <el-radio :label="0">医保</el-radio>
              <el-radio :label="1">自费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="当前住址">
            <el-cascader :props="props" v-model="userParams.addressSelected"   style="width: 100%" />
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input
              placeholder="请你输入用户详细地址"
              v-model="userParams.address"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-divider content-position="left">联系人信息（选填）</el-divider>
        <el-form style="width: 60%; margin: 10px auto" label-width="80">
          <el-form-item label="用户姓名">
            <el-input
              placeholder="请你输入用户姓名"
              v-model="userParams.contactsName"
            ></el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select
              placeholder="请你选择证件的类型"
              style="width: 100%"
              v-model="userParams.contactsCertificatesType"
            >
              <el-option
                v-for="item in certationArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input
              placeholder="请你输入证件号码"
              v-model="userParams.contactsCertificatesNo"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input
              placeholder="请你输入用户手机号码"
              v-model="userParams.contactsPhone"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="default" @click="submit"
              >提交</el-button
            >
            <el-button type="primary" size="default" @click="reset"
              >重写</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { User } from "@element-plus/icons-vue";
import { reqGetUser } from "@/api/hospital";
import { reqCertationType, reqCity, reqAddOrUpdateUser } from "@/api/user";
import { onMounted, ref, reactive, watch } from "vue";
import type { UserResponseData, UserArr } from "@/api/hospital/type";
import type {
  CertationTypeResponseData,
  CertationArr,
  AddOrUpdateUser,
} from "@/api/user/type";
import type { CascaderProps } from "element-plus";

import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
let $route = useRoute();
let $router = useRouter();
let userArr = ref<UserArr>([]);
let scene = ref<number>(0);

let userParams = reactive<AddOrUpdateUser>({
  name: "",
  certificatesType: "",
  certificatesNo: "",
  sex: 1,
  birthdate: "",
  phone: "",
  isMarry: 0,
  isInsure: 0,
  addressSelected: [],
  address: "",
  contactsName: "",
  contactsCertificatesType: "",
  contactsCertificatesNo: "",
  contactsPhone: "",
});
let certationArr = ref<CertationArr>([]);
onMounted( () => {
   getAllUser();
   getCertationType();
  if ($route.query.type == "add") {
    scene.value = 1;
  }

  if ($route.query.type == "edit") {
    scene.value = 1;
  }
});
const getAllUser = async () => {
  let result: UserResponseData = await reqGetUser();
  if (result.code == 200) {
    userArr.value = result.data;
  }
};
const addUser = () => {
  reset();
  scene.value = 1;
};
const reset = () => {
  Object.assign(userParams, {
    id: null,
    name: "",
    certificatesType: "",
    certificatesNo: "",
    sex: 1,
    birthdate: "",
    phone: "",
    isMarry: 0,
    isInsure: 0,
    addressSelected: [],
    address: "",
    contactsName: "",
    contactsCertificatesType: "",
    contactsCertificatesNo: "",
    contactsPhone: "",
  });
};
const changeScene = (user: AddOrUpdateUser) => {
  scene.value = 1;
  Object.assign(userParams, user);
};
const getCertationType = async () => {
  let result: CertationTypeResponseData = await reqCertationType();
  if (result.code == 200) {
    certationArr.value = result.data;
  }
};
const props: CascaderProps = {
  lazy: true,
  async lazyLoad(node: any, resolve: any) {
    let result: any = await reqCity(node.data.id || "86");
    let showData = result.data.map((item: any) => {
      return {
        id: item.value,
        label: item.name,
        value: item.value,
        leaf: !item.hasChildren,
      };
    });
    //注入组件需要展示的数据
    resolve(showData);
  },
};

//提交按钮的方法的回调
const submit = async () => {
  //要么新增就诊人|更新一个已有的就诊人
  try {
    //要么新增用户成功|更新已有的用户成功
    await reqAddOrUpdateUser(userParams);
    //提示文字
    ElMessage({
      type: "success",
      message: userParams.id ? "更新成功" : "新增成功",
    });
    //提交按钮的时候判断是不是从预约挂号而来
    if ($route.query.type) {
      $router.back();
    } else {
      scene.value = 0;
    }
    //在获取全部的就诊人的信息
    getAllUser();
  } catch (error) {
    ElMessage({
      type: "success",
      message: userParams.id ? "更新失败" : "新增失败",
    });
  }
};

watch(
  () => userArr.value,
  () => {
    if ($route.query.type == "edit") {
       let user  = userArr.value.find((item:any)=>{
           return item.id==$route.query.id;
       });
      Object.assign(userParams,user)
    }
  }
);
const removeUser = ()=>{
   getAllUser();
}
</script>
<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card {
  margin-bottom: 10px;
}
.visitors {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 32%;
    margin: 5px;
  }
}
</style>
