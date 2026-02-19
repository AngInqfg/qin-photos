import { ref } from "vue";
import { defineStore } from "pinia";
import type { ImageItem, dataStore } from "@/types/store";
export const useDataStore = defineStore("useDataStore", (): dataStore => {
  // 首页列表
  const homeData = ref<ImageItem[]>([]);
  const myData = ref<ImageItem[]>([]);
  // 我的列表
  const collectData = ref<ImageItem[]>([]);
  return {
    homeData,
    myData,
    collectData,
  };
});
