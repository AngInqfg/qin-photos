<template>
  <view class="w-[100% - 24px] flex justify-between items-center p-[12px]">
    <view class="flex-1 flex items-center gap-[12px]">
      <view
        v-for="item in typeData"
        :key="item.id"
        class="w-[fit-content] flex items-center text-[16px] py-[8px] px-[16px] rounded-[4px] cursor-pointer hover:text-mainColor hover:fill-mainColor"
        :class="item.id === typeActive ? 'bg-[#F3F4F6] text-mainColor fill-mainColor' : ''"
        @tap="handleClickType(item.id)"
      >
        <view
          v-if="item?.icon"
          v-html="item?.icon"
          class="w-[20px] h-[20px] mr-[4px]"
        ></view>
        {{ item.name }}
      </view>
    </view>
    <view class="relative flex items-center max-[450px]:hidden">
      <text class="whitespace-nowrap text-[#6B737F] mr-[16px]">排序:</text>
      <view
        class="text-center bg-[#F3F4F6] py-[8px] px-[16px] rounded-[12px] hover:text-mainColor cursor-pointer"
        :class="isShowSortSelect ? 'text-mainColor' : ''"
        @tap.stop="handleClickSort()"
      >
        {{ useStore()?.sortTabData[useStore()?.sortTabActive]?.label }}
        <svg
          :class="isShowSortSelect ? 'rotate-[180deg]' : ''"
          viewBox="0 0 1024 1024"
          width="12"
          height="12"
        >
          <path
            d="M904 332c0-8.189-3.124-16.379-9.372-22.628-12.497-12.496-32.759-12.496-45.256 0L512 646.745 174.628 309.372c-12.497-12.496-32.758-12.496-45.255 0-12.497 12.498-12.497 32.758 0 45.256l360 360c12.497 12.496 32.758 12.496 45.255 0l360-360C900.876 348.379 904 340.189 904 332z"
          />
        </svg>
      </view>
      <view
        v-show="isShowSortSelect"
        class="absolute bg-[#ffffff] top-[150%] w-[200px] right-[-12px] p-[8px] rounded-[8px]"
      >
        <view
          v-for="(item, index) in useStore()?.sortTabData"
          :key="item?.value"
          class="p-2 hover:text-mainColor cursor-pointer hover:bg-[#F3F4F6]"
          :class="[
            useStore()?.sortTabActive === index &&
              'bg-[#F3F4F6] text-mainColor',
          ]"
          @tap.stop="handleClickSortItem(index)"
        >
          {{ item?.label }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/stores/index";
import type { typeDataItem } from "@/types/index";
const emits = defineEmits<{
  (e: "typeClick", id: typeDataItem["id"]): void;
  (e: "sortChange", sort: string): void;
}>();
const typeData = ref<typeDataItem[]>([
  { id: 0, name: "全部类型" },
  {
    id: 1,
    name: "照片",
    icon: `<svg viewBox="0 0 1024 1024" version="1.1" >
  <path d="M911.36 768.768A55.6032 55.6032 0 0 1 855.9616 824.32H168.0384A55.6032 55.6032 0 0 1 112.64 768.768V255.232A55.6032 55.6032 0 0 1 168.0384 199.68h687.9232A55.6032 55.6032 0 0 1 911.36 255.232z" />
  <path d="M855.9616 847.36H168.0384a78.6944 78.6944 0 0 1-78.6432-78.592V255.232A78.6944 78.6944 0 0 1 168.0384 176.64h687.9232a78.6944 78.6944 0 0 1 78.6432 78.592v513.536a78.6944 78.6944 0 0 1-78.6432 78.592zM168.0384 222.72a32.5632 32.5632 0 0 0-32.5632 32.512v513.536a32.5632 32.5632 0 0 0 32.5632 32.512h687.9232a32.5632 32.5632 0 0 0 32.5632-32.512V255.232a32.5632 32.5632 0 0 0-32.5632-32.512z" />
  <path d="M348.16 570.8288l-146.0736 189.696a20.48 20.48 0 0 0 16.2816 33.0752h292.1472a20.48 20.48 0 0 0 16.2304-33.0752l-146.0224-189.44a20.48 20.48 0 0 0-32.5632-0.256z" fill="#FFFFFF" p-id="14802"></path><path d="M624.64 441.9072l-213.4528 319.744a20.48 20.48 0 0 0 17.0496 31.9488H855.04a20.48 20.48 0 0 0 17.1008-31.9488l-213.4016-319.744a20.48 20.48 0 0 0-34.0992 0z" fill="#FFFFFF" />
  <path d="M326.2976 385.3824m-84.4288 0a84.4288 84.4288 0 1 0 168.8576 0 84.4288 84.4288 0 1 0-168.8576 0Z" fill="#FFFFFF" />
  </svg>`,
  },
]);
const typeActive = ref<typeDataItem["id"]>(0);
function handleClickType(id: typeDataItem["id"]) {
  typeActive.value = id;
  emits("typeClick", typeActive.value);
}
const isShowSortSelect = ref<boolean>(false);
function handleClickSort() {
  isShowSortSelect.value = !isShowSortSelect.value;
}
function handleClickSortItem(index: number) {
  useStore().sortTabActive = index;
  isShowSortSelect.value = false;
  emits('sortChange', useStore()?.sortTabData[index]?.value);
}
function setIsShowSortSelect(value: boolean) {
  isShowSortSelect.value = value;
}
defineExpose({
  setIsShowSortSelect,
});
</script>

<style></style>
