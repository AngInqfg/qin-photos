<template>
  <Layout>
    <view
      class="w-full h-full bg-[#1C1C1E] flex justify-center items-center bg-no-repeat"
      style="
        background-image: url(&quot;../../static/images/user_bg.png&quot;);
        background-size: 100% 100%;
      "
    >
      <HaveUser v-if="userInfo?.token" :loginType="loginType"></HaveUser>
      <NotUser v-else @loginType="handleLoginType"></NotUser>
    </view>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/stores";
import Layout from "@/components/Layout/default.vue";
import HaveUser from "./haveUser.vue";
import NotUser from "./notUser.vue";
const loginType = ref<"login" | "retrieve">("login");
const userInfo = computed(() => useStore()?.userInfo);
function handleLoginType(type: "login" | "retrieve") {
  loginType.value = type;
}
</script>
