<template>
  <Layout
    ref="LayoutRef"
    class="h-screen"
    @checkAllChange="checkAllChange"
    @searchChange="searchChange"
  >
    <view
      v-if="!useStore()?.userInfo?.token"
      :scrollTop="scrollTop"
      class="w-full h-full bg-gray-200 flex justify-center items-center"
      @tap="handleGoLogin()"
    >
      <text>前往登录</text>
    </view>
    <scroll-view
      scroll-y="true"
      :show-scrollbar="LayoutRef?.clientData?.client !== 'PC'"
      @tap="cTypeRef?.setIsShowSortSelect(false)"
      class="h-full flex"
    >
      <view class="mx-[40px] max-sm:mx-[12px] max-[450px]:mx-[0px] flex-1">
        <view class="flex justify-center w-full">
          <view
            id="imageList"
            class="max-sm:mt-[12px] max-[450px]:mt-[1px] py-[16px] flex w-full"
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
      </view>
    </scroll-view>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getRoute } from "@/utils";
import { useWaterfall } from "@/utils/useImageListHook";
import Layout from "@/components/Layout/index.vue";
import ImageCard from "@/components/ImageCard/index.vue";
import { IMAGE_CARD_WIDTH, IMAGE_CARD_GAP } from "@/config/index";
import { useStore, useDataStore } from "@/stores";
import { queryCollectList } from "@/https";
import type { ImageItem } from "@/types/index";
const LayoutRef = ref();
const cTypeRef = ref();
const scrollTop = ref(0);
const params = ref<collectParamsDTO>({
  pageNum: 1,
  pageSize: 30,
  total: 0,
  search: "",
  email: useStore()?.userInfo?.email,
});
function searchChange(e: string) {
  params.value.search = e;
  getList();
}
function getList() {
  queryCollectList(params.value).then((res) => {
    params.value.total = res?.total || 0;
    useDataStore().myData = res?.data || [];
    scrollTop.value = 0.01;
    setTimeout(() => {
      scrollTop.value = 0;
    }, 0);
  });
}
getList();
const data = computed<ImageItem[]>(() =>
  useDataStore()?.collectData?.length > 0 ? useDataStore().collectData : []
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
  useStore().setCheckList(e ? data.value?.map((n) => n) : []);
};
const { columnData } = useWaterfall<ImageItem>({
  data, // 原始图片数据
  cardWidth: IMAGE_CARD_WIDTH, // 卡片宽度（配置项）
  cardGap: IMAGE_CARD_GAP, // 卡片间距（配置项）
  containerId: "imageList", // 瀑布流容器ID（与模板中id一致）
});
// 前往登录
function handleGoLogin() {
  getRoute()?.go("/qphotos/user/index");
}
</script>

<style scoped>
.flex-1 {
  display: flex;
  flex-direction: column;
}
</style>
