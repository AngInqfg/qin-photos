<template>
  <Layout
    ref="LayoutRef"
    :customPlace="customPlace"
    class="h-screen"
    @checkAllChange="checkAllChange"
    @searchChange="searchChange"
    :exclude="['delete']"
  >
    <scroll-view
      :scrollTop="scrollTop"
      scroll-y="true"
      :show-scrollbar="LayoutRef?.clientData?.client !== 'PC'"
      @tap="cTypeRef?.setIsShowSortSelect(false)"
      class="h-full flex"
    >
      <view class="mx-[40px] max-sm:mx-[12px] max-[450px]:mx-[0px] flex-1">
        <view
          class="sticky z-[1] top-[40px] max-sm:top-[12px] max-[450px]:top-[1px] bg-[#ffffff] rounded-[8px] max-sm:rounded-[0] px-[16px] max-sm:px-[8px] shadow-[0_0_24px_rgba(150,150,150,0.3)]"
          style="z-index: 20"
        >
          <CType ref="cTypeRef" @sortChange="sortChange"></CType>
        </view>
        <view
          v-show="params?.sort === 'latest'"
          class="flex justify-center w-full"
        >
          <view
            id="imageList"
            class="mt-[40px] max-sm:mt-[12px] max-[450px]:mt-[1px] py-[16px] flex w-full"
            :style="{ gap: `${IMAGE_CARD_GAP}px` }"
          >
            <view
              v-for="(col, colIndex) in columnData"
              :key="colIndex"
              class="flex-1"
              :style="{ gap: `${IMAGE_CARD_GAP}px` }"
            >
              <ImageCard
                v-for="item in col"
                :key="item.id"
                :data="item"
                class="w-full"
              ></ImageCard>
            </view>
          </view>
        </view>
        <view
          v-show="params?.sort !== 'latest'"
          class="flex justify-center w-full"
        >
          <view
            class="mt-[40px] max-sm:mt-[12px] max-[450px]:mt-[1px] py-[16px] flex w-full flex-col"
            :style="{ gap: `${IMAGE_CARD_GAP}px` }"
          >
            <view
              v-for="(_, colTime) in useDataStore().homeData"
              :key="colTime"
              class="w-full"
            >
              <view
                class="font-semibold mb-[8px]"
                v-if="typeof colTime === 'string'"
                >{{ colTime }}</view
              >
              <view
                class="max-sm:mt-[12px] max-[450px]:mt-[1px] py-[16px] flex w-full"
                :style="{ gap: `${IMAGE_CARD_GAP}px` }"
              >
                <view
                  v-for="(col, colIndex) in groupedColumnData[colTime] || []"
                  :key="colIndex"
                  class="flex-1"
                  :style="{ gap: `${IMAGE_CARD_GAP}px` }"
                >
                  <ImageCard
                    v-for="item in col"
                    :key="item.id"
                    :data="item"
                    class="w-full"
                  ></ImageCard>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useWaterfall } from "@/utils/useImageListHook";
import Layout from "@/components/Layout/index.vue";
import ImageCard from "@/components/ImageCard/index.vue";
import CType from "@/qphotos/home/cType.vue";
import { IMAGE_CARD_WIDTH, IMAGE_CARD_GAP } from "@/config/index";
import { useStore, useDataStore } from "@/stores";
import type { ImageItem } from "@/types/index";
import { queryIndexList } from "@/https/index";
import { getClientInfo } from "@/utils";
const scrollTop = ref(0);
const customPlace = ref();
const params = ref<indexParamsDTO>({
  pageNum: 1,
  pageSize: 30,
  total: 0,
  sort: "latest",
  search: "",
});
getList();
function sortChange(e: string) {
  params.value.sort = e;
  if (e === "month") {
    customPlace.value =
      getClientInfo()?.client === "PC"
        ? "输入月份，按Enter搜索"
        : "输入月份，按搜索键搜索";
  } else if (e === "province") {
    customPlace.value =
      getClientInfo()?.client === "PC"
        ? "输入省份，按Enter搜索"
        : "输入省份，按搜索键搜索";
  } else {
    customPlace.value = undefined;
  }
  LayoutRef.value?.handleClearSearch();
  getList();
}
function searchChange(e: string) {
  params.value.search = e;
  getList();
}
function getList() {
  params.value.sort = useStore()?.sortTabData[useStore()?.sortTabActive]?.value;
  queryIndexList(params.value).then((res) => {
    params.value.total = res?.total || 0;
    useDataStore().homeData = res?.data || [];
    scrollTop.value = 0.01;
    setTimeout(() => {
      scrollTop.value = 0;
    }, 0);
  });
}
const LayoutRef = ref();
const cTypeRef = ref();
const data = computed<ImageItem[]>(() =>
  useDataStore()?.homeData?.length > 0 ? useDataStore().homeData : [],
);
watchEffect(() => {
  if (data.value?.length > 0) {
    const isAll = useStore()?.checkList?.length === data.value?.length;
    useStore().setCheckAll(isAll);
  }
});
const checkAllChange = (e: boolean) => {
  data.value.forEach((n) => {
    n.check = e;
  });
  useStore().setCheckList(e ? data.value : []);
};
const { columnData, calculateColNum, updateWaterfallLayout } =
  useWaterfall<ImageItem>({
    data, // 原始图片数据
    cardWidth: IMAGE_CARD_WIDTH, // 卡片宽度（配置项）
    cardGap: IMAGE_CARD_GAP, // 卡片间距（配置项）
    containerId: "imageList", // 瀑布流容器ID（与模板中id一致）
  });
onShow(() => {
  customPlace.value = undefined;
  setTimeout(() => {
    updateWaterfallLayout();
  }, 500);
});

const groupedColumnData = computed<Record<string, ImageItem[][]>>(() => {
  if (params.value.sort === "latest") {
    return {};
  }
  const raw: any = useDataStore().homeData || {};
  if (!raw || typeof raw !== "object") {
    return {};
  }
  const colNum = Math.max(calculateColNum.value || 1, 1);
  const result: Record<string, ImageItem[][]> = {};
  Object.keys(raw).forEach((key) => {
    const arr = (raw as any)[key] as ImageItem[];
    if (!Array.isArray(arr) || arr.length === 0) {
      result[key] = [];
      return;
    }
    const baseCount = Math.floor(arr.length / colNum);
    const remainder = arr.length % colNum;
    const cols: ImageItem[][] = [];
    let startIndex = 0;
    for (let i = 0; i < colNum; i++) {
      const currentCount = baseCount + (i < remainder ? 1 : 0);
      cols.push(arr.slice(startIndex, startIndex + currentCount));
      startIndex += currentCount;
    }
    result[key] = cols;
  });
  return result;
});
</script>

<style scoped>
.flex-1 {
  display: flex;
  flex-direction: column;
}
</style>
