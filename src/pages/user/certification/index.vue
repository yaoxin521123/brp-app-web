<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header"><h1>实名信息</h1></div>
      </template>
      <div class="tip">
        <el-icon><InfoFilled /></el-icon>
        <p style="color: #7f7f7f">
          完成实名认证后才能添加就诊人，正常进行挂号，为了不影响后续步骤，建议提前实名认证。
        </p>
      </div>
      <el-descriptions
        v-if="userInfo.authStatus == 1"
        style="margin: 20px auto"
        class="margin-top"
        :column="1"
        size="small"
        border
      >
        <el-descriptions-item label-align="center" :width="5">
          <template #label>
            <div class="cell-item">用户姓名</div>
          </template>
          {{ userInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item label-align="center" :width="5">
          <template #label>
            <div class="cell-item">证件类型</div>
          </template>
          {{ userInfo.certificatesType == "10" ? "身份证" : "户口本" }}
        </el-descriptions-item>
        <el-descriptions-item label-align="center" :width="5">
          <template #label>
            <div class="cell-item">证件号码</div>
          </template>
          {{ userInfo.certificatesNo }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        v-if="userInfo.authStatus == 0"
        style="width: 60%; margin: 20px auto"
        label-width="80"
        :model="params"
        ref="form"
        :rules="rules"
      >
        <el-form-item label="用户姓名" prop="name">
          <el-input
            placeholder="请输入用户姓名"
            v-model="params.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="certificatesType">
          <el-select
            placeholder="请选择证件类型"
            style="width: 100%"
            v-model="params.certificatesType"
          >
            <el-option
              :label="item.name"
              :value="item.value"
              v-for="(item, index) in arrType"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="certificatesNo">
          <el-input
            placeholder="请输入证件号码"
            v-model="params.certificatesNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传证件" prop="certificatesUrl">
          <el-upload
            ref="upload"
            list-type="picture-card"
            :limit="1"
            :on-exceed="exceedhandler"
            :on-success="successhandler"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :action="`/api/oss/file/fileUpload?fileHost=userAuah&userId=${userInfo.id}`"
          >
            <img
              style="width: 100%; height: 100%"
              src="@\assets\images\auth_example.png"
              alt=""
            />
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img
              w-full
              v-if="params.certificatesUrl"
              style="width: 100%; height: 100%"
              :src="params.certificatesUrl"
              alt="Preview Image"
            />
          </el-dialog>
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import { InfoFilled, Plus } from "@element-plus/icons-vue";

import { reqUserInfo, reqCertationType, reqUserCertation } from "@/api/user";

import { onMounted, ref, reactive } from "vue";
import type {
  UseringoResponseData,
  CertationTypeResponseData,
  CertationArr,
  UserParams,
} from "@/api/user/type";
import { ElMessage } from "element-plus";
let params = reactive<UserParams>({
  certificatesNo: "",
  certificatesType: "",
  certificatesUrl: "",
  name: "",
  id: "",
});
let dialogVisible = ref<boolean>(false);
let form = ref();
let upload = ref();
let userInfo: any = ref<any>({});
let arrType = ref<CertationArr>([]);
onMounted(() => {
  getUserInfo();
  getType();
});

const getUserInfo = async () => {
  let result: UseringoResponseData = await reqUserInfo();
  if (result.code == 200) {
    userInfo.value = result.data;
   
  }
};
const getType = async () => {
  let result: CertationTypeResponseData = await reqCertationType();
  if (result.code == 200) {
    arrType.value = result.data;
  }
};
const exceedhandler = () => {
  ElMessage({
    type: "error",
    message: "图片只能上传一张图片",
  });
};
const successhandler = (response: any) => {
  form.value.clearValidate("certificatesUrl");
  params.certificatesUrl = response.data;
  console.log(params.certificatesUrl);
};
const handlePictureCardPreview = () => {
  //触发预览的钩子的时候，对话框显示
  dialogVisible.value = true;
};
const handleRemove = () => {
  params.certificatesUrl = "";
};
const reset = () => {
  //清除文件上传列表
  upload.value.clearFiles();
  //清空数据
  Object.assign(params, {
    certificatesNo: "",
    certificatesType: "",
    certificatesUrl: "",
    name: "",
    id: "",
  });
};

const submit = async () => {

  await form.value.validate();

  try {
    //认证成功
    params.id = userInfo.value.id;
    await reqUserCertation(params);
    //提示消息
    ElMessage({
      type: "success",
      message: "认证成功",
    });
    //认证成功以后再次获取用户信息
    getUserInfo();
  } catch (error) {
    ElMessage({
      type: "error",
      message: "认证失败",
    });
  }
};

//自定义校验规则姓名方法
const validatorName = (_: any, value: any, callBack: any) => {
  //rule:即为当前校验字段的校验规则对象
  const reg =
    /^[\u00B7\u3007\u3400-\u4DBF\u4E00-\u9FFF\uE000-\uF8FF\uD840-\uD8C0\uDC00-\uDFFF\uF900-\uFAFF]+$/;
  if (reg.test(value)) {
    callBack();
  } else {
    callBack(new Error("请输入正确中国人的名字"));
  }
};

//证件类型校验的方法
const validatorType = (_: any, value: any, callBack: any) => {
  if (value == "10" || value == "20") {
    callBack();
  } else {
    callBack(new Error("请选择证件的类型"));
  }
};

//证件号码的校验方法
const validatorNo = (_: any, value: any, callBack: any) => {
  let sfz = /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[Xx\d]$/;
  let hkb = /^\d{9}$/;
  if (sfz.test(value) || hkb.test(value)) {
    callBack();
  } else {
    callBack(new Error("请输入正确的身份证或者户口本的号码"));
  }
};
//证件照图片的
const validatorUrl = (_: any, value: any, callBack: any) => {
  if (value.length) {
    callBack();
  } else {
    callBack(new Error("请上传证件照图片"));
  }
};

const rules = {
  //用户姓名的校验规则
  //required:true,代表当前字段务必进行校验
  name: [
    {
      required: true,
      validator: validatorName,
    },
  ],
  certificatesType: [
    {
      required: true,
      validator: validatorType,
    },
  ],
  certificatesNo: [
    {
      required: true,
      validator: validatorNo,
    },
  ],
  certificatesUrl: [
    {
      required: true,
      validator: validatorUrl,
    },
  ],
};
</script>

<style scoped lang="scss">
.box-card {
  .tip {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
