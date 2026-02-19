<template>
  <view class="w-full h-screen">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { getRoute } from "@/utils";
import { onShow } from "@dcloudio/uni-app";
const route = getRoute();
onShow(() => {
  uni.setStorageSync("url", route?.path);
});
</script>
