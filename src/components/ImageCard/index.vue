<template>
  <view
    class="relative rounded-[8px] overflow-hidden bg-white cursor-pointer  group"
    :style="{
      width: `${IMAGE_CARD_WIDTH}px`,
      height: '230px',
    }"
  >
    <template v-if="visible">
      <checkbox-group
        class="check_box absolute top-[4px] right-[4px] z-[1]"
        @tap.stop="() => null"
        @change="handleCheck()"
      >
        <checkbox value="checkAll" :checked="data?.check" />
      </checkbox-group>
      <view
        :style="{
          width: `${IMAGE_CARD_WIDTH}px`,
        }"
        :title="data?.name || null"
        @tap="handleImageClick()"
      >
        <view
          :style="{
            width: `${IMAGE_CARD_WIDTH}px`,
            height: `${IMAGE_CARD_WIDTH}px`,
            overflow: 'hidden',
          }"
        >
          <image
            class="w-[100%] h-[100%] transform group-hover:scale-[1.1] transition-transform duration-500"
            mode="aspectFill"
            loading="lazy"
            :src="data?.url"
            @error="visible = false"
          />
        </view>
        <view class="px-[10px] text-[14px]">
          <view
            class="overflow-hidden w-[100%] text-ellipsis whitespace-nowrap pt-[4px] pb-[8px] hover:text-mainColor"
            @tap.stop="copy(data?.url, '已复制链接')"
            >{{ data?.name || "未知" }}</view
          >
          <view class="text-[12px] text-[#B0B4BC]"
            >{{ sizeText }} · {{ updateTimeText }}</view
          >
        </view>
      </view>
    </template>
    <view
      v-else
      class="w-[100%] h-[100%] flex flex-col justify-end items-center font-[cursive]"
    >
      <view
        class="flex flex-col justify-center items-center"
        :style="{
          width: `${IMAGE_CARD_WIDTH}px`,
          height: `${IMAGE_CARD_WIDTH}px`,
        }"
      >
        <svg
          class="mb-[12px]"
          viewBox="0 0 1280 1024"
          version="1.1"
          width="30px"
          height="30px"
        >
          <path
            d="M829.952 237.21c0 39.219 32.154 71.065 71.68 71.065 39.578 0 71.68-31.846 71.68-71.065 0-39.27-32.102-71.117-71.68-71.117-39.526 0-71.68 31.846-71.68 71.117z"
          />
          <path
            d="M751.923 924.672H71.833V71.475h1003.623v406.272c25.446 5.12 49.562 12.493 71.68 24.576V71.526c0-39.219-32.154-71.116-71.68-71.116H71.834C32.256 0.41 0.154 32.307 0.154 71.526v853.095c0 39.27 32.102 71.117 71.68 71.117H820.89c-32.666-19.764-45.876-41.472-68.967-71.117z"
          />
          <path
            d="M1147.136 548.352a254.566 254.566 0 0 0-122.88-31.232 255.386 255.386 0 0 0-143.104 43.52l-62.106-82.125a107.622 107.622 0 0 0-95.744-42.137 107.213 107.213 0 0 0-79.77 47.104l-119.96-158.72c-20.993-27.648-54.273-45.824-89.089-42.65-34.816 1.024-67.072 18.79-86.425 47.514l-230.554 343.04a35.328 35.328 0 0 0 10.035 49.254 35.942 35.942 0 0 0 49.664-9.882l230.4-342.937a35.482 35.482 0 0 1 28.826-15.872 36.3 36.3 0 0 1 29.696 14.233l154.368 204.135c7.424 9.881 19.456 14.694 31.846 14.08a35.891 35.891 0 0 0 28.826-19.559l19.814-39.372a35.482 35.482 0 0 1 28.826-19.508 35.226 35.226 0 0 1 31.897 13.927l66.15 87.552a250.675 250.675 0 0 0-58.674 161.331c0 58.214 19.814 111.82 53.145 154.624a255.693 255.693 0 0 0 201.933 98.304c140.8 0 255.027-113.203 255.027-252.928a252.57 252.57 0 0 0-132.147-221.696z m0 356.25a183.245 183.245 0 0 1-122.88 47.001 183.296 183.296 0 0 1-96.051-26.982 181.094 181.094 0 0 1-87.04-154.573c0-37.786 11.673-72.909 31.59-101.94a183.296 183.296 0 0 1 151.501-79.564 183.194 183.194 0 0 1 122.88 47.002 180.429 180.429 0 0 1 0 269.056z"
          />
          <path
            d="M987.955 884.326c0 19.866 16.23 35.994 36.301 35.994a36.147 36.147 0 0 0 36.25-35.994 36.147 36.147 0 0 0-36.301-35.993 36.147 36.147 0 0 0-36.25 35.993z m36.301-253.286c-25.651 0-46.438 20.634-46.438 46.08 0 25.395 20.787 138.035 46.438 138.035 25.6 0 46.387-112.64 46.387-138.086a46.234 46.234 0 0 0-46.438-46.029z"
          />
        </svg>
      </view>
      <view class="text-center word-break: break-all p-[8px]">
        <view @tap="copy(`图片丢失了.${data?.id}`)"
          >图片丢失了,{{ data?.id }}</view
        >
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { IMAGE_CARD_WIDTH } from "@/config/index";
import { copy } from "@/utils/index";
import type { ImageItem } from "@/types/index";
import { useStore } from "@/stores";
const props = defineProps<{
  data: ImageItem;
}>();
const sizeText = computed(() => {
  return props?.data?.size
    ? `${(props?.data?.size / 1024 / 1024).toFixed(1)}MB`
    : "未知";
});
const updateTimeText = computed(() => {
  const time = props?.data?.updateTime;
  let date: Date;
  date = new Date((time + '').toString().length === 10 ? time * 1000 : time);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
});
function handleImageClick() {
  useStore().imgDetailDialog = true;
}
function handleCheck() {
  const have = useStore()?.checkList?.find((n) => n?.id === props?.data?.id);
  const newList = have
    ? useStore()?.checkList?.filter((n) => n?.id !== props?.data?.id)
    : [...useStore()?.checkList, props?.data];
  useStore().setCheckList(newList);
}
const visible = ref(true);
</script>
