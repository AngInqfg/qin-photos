<template>
  <view
    class="w-[450px] h-[500px] bg-white rounded-[4px] text-center max-sm:w-[300px]"
    style="box-shadow: 0 0 10px white"
  >
    <view
      class="my-[36px] flex justify-center items-center text-[30px] font-[math]"
    >
      <image class="w-[28px] h-[28px]" src="@/static/images/logo.png" />
      -PHOTOS
    </view>
    <!-- 登录表单 -->
    <template v-if="type === 'login'">
      <view class="text-[24px] font-[math]">欢迎进入Q-PHOTOS</view>
      <view class="my-[24px] text-[14px] text-[#636364]">
        登录后即可查看和管理您的照片
      </view>
      <view
        class="flex flex-col gap-[16px] text-left w-[70%] mx-auto mt-[24px] my-[48px]"
      >
        <view
          class="h-[32px] rounded-[99px] border-[1px] border-[#B0B4BC] border-solid px-[12px]"
        >
          <input
            class="h-[100%]"
            placeholder="Account"
            type="text"
            cursor-color="var(--mainColor)"
            v-model="loginFormData.username"
          />
        </view>
        <view
          class="h-[32px] rounded-[99px] border-[1px] border-[#B0B4BC] border-solid px-[12px]"
        >
          <input
            class="h-[100%]"
            placeholder="Password"
            type="password"
            cursor-color="var(--mainColor)"
            v-model="loginFormData.password"
          />
        </view>
        <view
          class="h-[32px] rounded-[99px] border-[1px] border-mainColor bg-mainColor text-white border-solid px-[12px] cursor-pointer"
          @tap="handleLogin()"
        >
          <view class="h-[100%] flex justify-center items-center">登录</view>
        </view>
      </view>
      <view
        class="flex justify-between items-center w-[70%] mx-auto mb-[32px] text-[#B0B4BC]"
      >
        <view
          class="hover:text-mainColor cursor-pointer"
          @tap="handleSetType('retrieve')"
          >忘记密码？</view
        >
        <view
          class="hover:text-mainColor cursor-pointer"
          @tap="handleSetType('register')"
          >注册账号</view
        >
      </view>
    </template>
    <template v-if="type === 'register'">
      <view class="text-[24px] font-[math]">注册</view>
      <view
        class="flex flex-col gap-[16px] text-left w-[70%] mx-auto mt-[24px] my-[48px]"
      >
        <view
          class="h-[32px] border-b-[1px] border-solid border-[rgba(0,0,0,0)] border-b-[#B0B4BC] px-[12px]"
        >
          <input
            class="h-[100%]"
            placeholder="Account"
            type="text"
            cursor-color="var(--mainColor)"
            v-model="registerFormData.username"
          />
        </view>
        <view
          class="h-[32px] border-b-[1px] border-solid border-[rgba(0,0,0,0)] border-b-[#B0B4BC] px-[12px]"
        >
          <input
            class="h-[100%]"
            placeholder="Password"
            type="text"
            cursor-color="var(--mainColor)"
            v-model="registerFormData.password"
          />
        </view>
        <view
          class="h-[32px] border-b-[1px] border-solid border-[rgba(0,0,0,0)] border-b-[#B0B4BC] px-[12px]"
        >
          <input
            class="h-[100%]"
            placeholder="Email"
            type="text"
            cursor-color="var(--mainColor)"
            v-model="registerFormData.email"
          />
        </view>
        <view
          v-if="registerFormData?.email"
          class="h-[32px] border-b-[1px] border-solid border-[rgba(0,0,0,0)] border-b-[#B0B4BC] px-[12px] flex items-center"
        >
          <input
            class="flex-1 h-[100%]"
            placeholder="ECode"
            type="text"
            cursor-color="var(--mainColor)"
            v-model="registerFormData.eCode"
          />
          <view
            class="w-[5rem] cursor-pointer text-center hover:text-mainColor"
            :class="`${emailTimer > 0 ? 'hover:text-[#B0B4BC] cursor-default text-[#B0B4BC]' : null}`"
            @tap="handleGetEmail()"
          >
            {{ emailTimer ? `${emailTimer}s` : "获取验证码" }}
          </view>
        </view>
        <view class="flex justify-between items-center gap-[16px]">
          <view
            class="flex-[3] h-[32px] flex justify-center items-center text-white rounded-[99px] bg-mainColor cursor-pointer"
            @tap="handleRegister()"
          >
            注册
          </view>
          <view
            class="flex-[2] h-[32px] flex justify-center items-center text-white rounded-[99px] bg-[#1C1C1E] cursor-pointer"
            @tap="handleSetType('login')"
          >
            返回登录
          </view>
        </view>
      </view>
    </template>
    <template v-if="type === 'retrieve'">
      <view class="text-[24px] font-[math]">找回密码</view>
      <view
        class="flex flex-col gap-[16px] text-left w-[70%] mx-auto mt-[24px] my-[48px]"
      >
        <view
          class="h-[32px] border-b-[1px] border-solid border-[rgba(0,0,0,0)] border-b-[#B0B4BC] px-[12px]"
        >
          <input
            class="h-[100%]"
            placeholder="Account"
            type="text"
            cursor-color="var(--mainColor)"
            v-model="retrievePasswordFormData.username"
          />
        </view>
        <view
          class="h-[32px] border-b-[1px] border-solid border-[rgba(0,0,0,0)] border-b-[#B0B4BC] px-[12px]"
        >
          <input
            class="h-[100%]"
            placeholder="Email"
            type="text"
            cursor-color="var(--mainColor)"
            v-model="retrievePasswordFormData.email"
          />
        </view>
        <view
          class="h-[32px] border-b-[1px] border-solid border-[rgba(0,0,0,0)] border-b-[#B0B4BC] px-[12px] flex items-center"
        >
          <input
            class="flex-1 h-[100%]"
            placeholder="ECode"
            type="text"
            cursor-color="var(--mainColor)"
            v-model="retrievePasswordFormData.eCode"
          />
          <view
            v-if="retrievePasswordFormData?.email"
            class="w-[5rem] cursor-pointer text-center hover:text-mainColor"
            :class="`${emailTimer > 0 ? 'hover:text-[#B0B4BC] cursor-default text-[#B0B4BC]' : null}`"
            @tap="handleGetEmail()"
          >
            {{ emailTimer ? `${emailTimer}s` : "获取验证码" }}
          </view>
        </view>
        <view
          class="h-[32px] border-b-[1px] flex justify-center items-center text-[12px] text-[#636364]"
        >
          <view> 密码找回成功后请及时前往用户中心修改密码</view>
        </view>
        <view class="flex justify-between items-center gap-[16px]">
          <view
            class="flex-[3] h-[32px] flex justify-center items-center text-white rounded-[99px] bg-mainColor cursor-pointer"
            @tap="handleRetrievePassword()"
          >
            提交
          </view>
          <view
            class="flex-[2] h-[32px] flex justify-center items-center text-white rounded-[99px] bg-[#1C1C1E] cursor-pointer"
            @tap="handleSetType('login')"
          >
            返回登录
          </view>
        </view>
      </view>
    </template>
    <view class="text-[#636364] text-[14px]">{{ FOOTER_MESSAGE }}</view>
  </view>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { FOOTER_MESSAGE } from "@/config/index";
import {
  login,
  queryEmailCode,
  queryRegister,
  queryRetrievePassword,
} from "@/https/index";
import { useStore } from "@/stores";
const emits = defineEmits<{
  (e: "loginType", data: "login" | "retrieve"): void;
}>();
const type = ref<"login" | "register" | "retrieve">("login");
const loginFormData = ref<loginParamsDTO>({
  username: "",
  password: "",
});
const emailTimer = ref<number>(0);
const timer = ref<number>(0);
const registerFormData = ref<registerParamsDTO>({
  username: "",
  password: "",
  email: "",
  eCode: "",
});
const retrievePasswordFormData = ref<retrievePasswordParamsDTO>({
  username: "",
  email: "",
  eCode: "",
});
watchEffect(() => {
  if (!["register", "retrieve"].includes(type.value)) {
    registerFormData.value = {
      username: "",
      password: "",
      email: "",
      eCode: "",
    };
    retrievePasswordFormData.value = {
      username: "",
      email: "",
      eCode: "",
    };
    emailTimer.value = 0;
    if (timer.value > 0) {
      clearInterval(timer.value);
      timer.value = 0;
    }
  }
});
function handleSetType(str: "login" | "register" | "retrieve", pw?: string) {
  if (str === "login" && pw) {
    loginFormData.value.username = retrievePasswordFormData.value.username;
    loginFormData.value.password = pw;
  }
  type.value = str;
}
/**登录 */
async function handleLogin(obj?: any) {
  if (!obj?.loginType && Object.values(loginFormData.value)?.some((n) => !n)) {
    uni.showToast({ title: "请输入账号密码", icon: "error" });
    return;
  }
  const res = await login(obj ? obj : loginFormData.value);
  uni.showToast({
    title: res?.message,
    icon: "none",
    success: () => {
      if (res?.code === 0) {
        useStore().setUserInfo({
          ...res.data,
          name: res?.data?.name || res?.data?.username,
        });
        emits("loginType", obj?.loginType || "login");
      }
    },
  });
}
/**获取注册email code */
async function handleGetEmail() {
  const isRegister = type.value === "register";
  const formData = isRegister
    ? registerFormData.value
    : retrievePasswordFormData.value;
  const { username, password, email } = formData as any;
  const obj = isRegister ? { username, password, email } : { username, email };

  if (Object.values(obj).some((n) => !n)) {
    uni.showToast({ title: "请输入表单", icon: "error" });
    return;
  }
  const reg = /^[^@]+@[^@.]+\.[^@]+$/;
  if (!reg.test(email)) {
    uni.showToast({ title: "邮箱格式错误", icon: "error" });
    return;
  }
  const res = await queryEmailCode({
    ...formData,
    type: isRegister ? "register" : "retrieve",
  });
  uni.showToast({
    title: res?.message,
    icon: "none",
  });
  if (res?.code !== 0) return;
  if (emailTimer.value > 0) return;
  emailTimer.value = 60;
  timer.value = setInterval(() => {
    emailTimer.value--;
    if (emailTimer.value <= 0) {
      clearInterval(timer.value);
    }
  }, 1000);
}
/**注册 */
async function handleRegister() {
  if (Object.values(registerFormData.value)?.some((n) => !n)) {
    uni.showToast({ title: "请输入表单", icon: "error" });
    return;
  }
  const reg = /^[^@]+@[^@.]+\.[^@]+$/;
  if (!reg.test(registerFormData.value.email)) {
    uni.showToast({ title: "请输入正确的邮箱", icon: "error" });
    return;
  }
  const res = await queryRegister(registerFormData.value);
  uni.showToast({
    title: res?.message,
    icon: "none",
    success: () => {
      if (res?.code === 0) {
        emailTimer.value = 0;
        if (timer.value > 0) {
          clearInterval(timer.value);
          timer.value = 0;
        }
      }
    },
  });
}
/**找回密码 */
async function handleRetrievePassword() {
  if (Object.values(retrievePasswordFormData.value)?.some((n) => !n)) {
    uni.showToast({ title: "请输入表单", icon: "error" });
    return;
  }
  const reg = /^[^@]+@[^@.]+\.[^@]+$/;
  if (!reg.test(retrievePasswordFormData.value.email)) {
    uni.showToast({ title: "请输入正确的邮箱", icon: "error" });
    return;
  }
  const res = await queryRetrievePassword(retrievePasswordFormData.value);
  uni.showToast({
    title: res?.message + "， 即将跳转",
    icon: "none",
    success: async () => {
      if (res?.code === 0) {
        handleLogin({
          username: retrievePasswordFormData.value.email,
          password: res?.data,
          loginType: "retrieve",
        });
      }
    },
  });
}
</script>

<style></style>
