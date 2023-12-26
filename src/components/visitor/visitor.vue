<template>
  <div class="visitor">
    <div class="top">
      <div class="left">
        <span class="free">{{ user.isInsure == 1 ? "医保" : "自费" }}</span
        ><span class="username">{{ user.name }}</span>
      </div>
      <div class="right">
        <el-button
          type="primary"
          size="default"
          :icon="Edit"
          @click="handler"
          circle
        ></el-button>

        <el-popconfirm
          @confirm="removeUser"
          :title="`你确定要删除${user.id}`"
          width="200px"
        >
          <template #reference>
            <el-button
              v-if="$route.path == '/user/patient'"
              circle
              type="danger"
              size="default"
              :icon="Delete"
            ></el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="bottom">
      <p>证件类型：{{ user.param?.certificatesTypeString }}</p>
      <p>证件号码：{{ user.certificatesNo }}</p>
      <p>用户性别：{{ user.sex == 0 ? "女生" : "男士" }}</p>
      <p>出生日期：{{ user.birthdate }}</p>
      <p>手机号码：{{ user.phone }}</p>
      <p>婚姻状况：{{ user.isMarry == 0 ? "未婚" : "已婚" }}</p>
      <p>详细地址：{{ user.address }}</p>

      <transition name="confirm">
        <div class="confirm" v-if="index == currentIndex">已选择</div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { Edit, Delete } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { reqRemoveUser } from "@/api/user";
import { ElMessage } from "element-plus";
let $route = useRoute();
let $router = useRouter();
let props = defineProps(["user", "index", "currentIndex"]);
let $emit = defineEmits(["changeScene",'removeUser']);
const handler = () => {
  if ($route.path == "/user/patient") {
    $emit("changeScene", props.user);
  } else {
    $router.push({
      path: "/user/patient",
      query: { type: "edit", id: props.user.id },
    });
  }
};
const removeUser = async () => {
  try {

    await reqRemoveUser(props.user.id);
    //消息提示
    ElMessage({
      type:'success',
      message:'删除成功'
    });
    $emit('removeUser');
  } catch (error) {}
};
</script>

<style scoped lang="scss">
.visitor {
  box-shadow: 0px 0px 12px rgb(0, 0, 0, 0.12);
  .top {
    height: 60px;
    background: #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    .left {
      .free {
        background: white;
        padding: 5px;
        font-size: 12px;
        margin-right: 10px;
        border-radius: 5px;
      }
      .username {
        color: #7f7f7f;
      }
    }
  }
  .bottom {
    position: relative;
    padding: 0px 10px;
    p {
      line-height: 40px;
    }
    .confirm {
      position: absolute;
      width: 200px;
      height: 200px;
      color: red;
      border-radius: 50%;
      border: 1px dashed red;
      text-align: center;
      line-height: 200px;
      left: 15%;
      top: 15%;
      opacity: 0.5;
      transform: rotate(35deg);
      font-weight: 900;
    }
    .confirm-enter-from {
      transform: scale(1);
    }
    .confirm.enter-active {
      transform: all 0.3s;
    }
    .confirm-enter-to {
      transform: scale(1.2);
    }
  }
}
</style>
