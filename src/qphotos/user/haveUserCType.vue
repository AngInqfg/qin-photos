<template>
  <view class="w-[100%] h-[100%] flex flex-col">
    <view
      class="flex flex-wrap items-center bg-white p-[4px] gap-[4px] shadow-[0_4px_4px_rgba(0,0,0,0.1)] sticky top-[20px] max-md:mx-[10px] max-md:rounded-[6px] max-md:shadow-[0_0_0_rgba(0,0,0,0.1)]"
    >
      <view
        v-for="(item, idx) in types"
        class="flex-[1] flex justify-center items-center whitespace-nowrap py-[6px] cursor-pointer hover:text-mainColor hover:bg-mainColor1"
        :class="
          activeType === idx
            ? 'text-mainColor bg-mainColor1 shadow-[0_0_0_1px_var(--mainColor)]'
            : ''
        "
        @tap="
          () =>
            idx === 0
              ? (activeType = idx)
              : getRoute()?.go(
                  idx === 1 ? '/qphotos/my/index' : '/qphotos/collect/index',
                )
        "
      >
        {{ item }}
      </view>
    </view>
    <view
      class="w-[100%] min-h-[100px] flex-[1] max-md:mx-[10px] max-md:w-[calc(100%-20px)]"
    >
      <view v-show="activeType === 2">
        <view v-for="(item, idx) in list" :key="idx" class="pt-[6px]">
          <view
            class="flex justify-between items-center bg-white px-[16px] py-[6px]"
          >
            <view>
              执行事件：{{ OPERATION_TYPE[item?.type] }}
              <text class="text-[12px]" v-if="item?.type === 'uploadImageInfo'"
                >点击图片预览</text
              >
            </view>
            <view>{{
              dayjs(item?.create_time).format("YYYY-MM-DD HH:mm:ss")
            }}</view>
          </view>
          <view
            v-if="item?.data && Object?.values(item?.data)?.length > 0"
            class="p-[12px]"
          >
            <template v-if="item?.type === 'uploadImageInfo'">
              <view>
                <view
                  v-for="(child, idxs) in item?.data?.files"
                  class="flex items-center mb-[4px]"
                >
                  <image
                    :src="child"
                    class="w-[35px] flex-shrink-0 h-[35px] object-cover mr-[4px] cursor-pointer"
                    @click="handleShowImage(item?.data?.files, idxs)"
                  />
                  <view style="word-break: break-all">
                    {{ child }}
                  </view>
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
    <view
      v-show="activeData?.length > 0"
      class="bg-white flex justify-end p-[12px] shadow-[0_-4px_4px_rgba(0,0,0,0.1)] sticky bottom-[0px]"
    >
      <view class="mr-auto flex items-center gap-[12px]">
        <view
          class="w-[30px] h-[30px] cursor-pointer hover:text-mainColor hover:bg-mainColor1 flex items-center justify-center"
          ><</view
        >
        <view
          class="w-[30px] h-[30px] cursor-pointer hover:text-mainColor hover:bg-mainColor1 flex items-center justify-center"
          >></view
        >
      </view>
      <view
        v-show="activeType === 0"
        class="p-[4px_12px] cursor-pointer hover:text-mainColor"
      >
        删除
      </view>
      <view
        v-show="activeType === 0"
        class="p-[4px_12px] cursor-pointer hover:text-mainColor"
      >
        收藏
      </view>

      <view
        v-show="activeType === 1"
        class="p-[4px_12px] cursor-pointer hover:text-mainColor"
      >
        取消收藏
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { OPERATION_TYPE } from "@/config";
import { useDataStore } from "@/stores";
import { useOperationHooks } from "./useEditHooks";
import { getRoute } from "@/utils/index";
import dayjs from "dayjs";
// "我的照片", "我的收藏",
const types = ["操作记录", "我的照片", "我的收藏"];
const activeType = ref<number>(0);
const dataList = ref([useDataStore()?.myData, useDataStore()?.collectData, []]);
const activeData = computed(() => dataList.value[activeType.value]);
const { list } = useOperationHooks();
function handleShowImage(list: string[], idx: number) {
  uni.previewImage({
    urls: list,
    current: list[idx],
  });
}
</script>
