<template>
  <view
    class="flex flex-col h-screen font-sans bg-[#f3f4f6]"
    @tap="
      () => (useStore().setIsShow450Select(false), (isShowSortSelect = false))
    "
  >
    <view class="w-full h-[64px] bg-[#1C1C1E] relative text-white">
      <!-- loading -->
      <view
        class="pointer-events-none absolute top-[calc(100%-40px)] left-1/2 -translate-x-1/2 transition-transform duration-300 linear z-[98]"
        :class="{ 'translate-y-[50px]': useStore().headerSelectLoading }"
      >
        <svg
          viewBox="0 0 1024 1024"
          class="fill-mainColor animate-spin [animation-duration:0.5s]"
          version="1.1"
          width="35"
          height="35"
        >
          <path
            d="M563.2 819.2a102.4 102.4 0 1 1 0 204.8 102.4 102.4 0 0 1 0-204.8z m-320.4608-153.6a128 128 0 1 1 0 256 128 128 0 0 1 0-256z m592.7936 25.6a102.4 102.4 0 1 1 0 204.8 102.4 102.4 0 0 1 0-204.8zM947.2 477.1328a76.8 76.8 0 1 1 0 153.6 76.8 76.8 0 0 1 0-153.6zM128 307.2a128 128 0 1 1 0 256 128 128 0 0 1 0-256z m782.6432-40.6016a51.2 51.2 0 1 1 0 102.4 51.2 51.2 0 0 1 0-102.4zM409.6 0a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m384 153.6a25.6 25.6 0 1 1 0 51.2 25.6 25.6 0 0 1 0-51.2z"
          />
        </svg>
      </view>
      <!-- 导航栏 -->
      <view
        class="h-[100%] bg-[#1C1C1E] relative px-[16px] max-sm:px-[8px] max-[450px]:px-[2px] flex items-center z-[99]"
      >
        <view
          class="h-[64px] flex items-center ml-[16px] lg:ml-[32px] mr-[16px] lg:mr-[48px] flex-shrink-0 max-sm:hidden hover:text-mainColor"
        >
          <image class="w-[32px] h-[32px]" src="@/static/images/logo.png" />
        </view>
        <!-- 导航栏 -->
        <view
          class="flex mr-[16px] lg:mr-[128px] flex-shrink-0 whitespace-nowrap max-[450px]:hidden"
        >
          <view class="flex items-center gap-[8px] lg:gap-[16px]">
            <view
              v-for="item in tabData"
              :key="item?.id"
              class="hover:text-mainColor cursor-pointer"
              :class="
                `/qphotos/${item?.id}/index` === route?.path
                  ? 'text-mainColor'
                  : ''
              "
              @tap.stop="handleClickGoRoute(item?.id)"
            >
              {{ item?.name }}
            </view>
          </view>
        </view>
        <!-- 排序 -->
        <view
          class="reactive w-[4rem] text-center hidden max-[450px]:flex items-center"
          @tap.stop="() => null"
        >
          <div
            class="w-[100%] text-center hover:text-mainColor cursor-pointer"
            :class="isShowSortSelect ? 'text-mainColor' : ''"
            @tap.stop="handleClickSort()"
          >
            {{
              useStore()?.sortTabData[
                useStore()?.sortTabActive
              ]?.label?.substring(0, 2)
            }}
          </div>
          <view
            v-show="isShowSortSelect"
            class="absolute bg-[#1C1C1E] top-[100%] left-0 w-[100%]"
          >
            <view
              v-for="(item, index) in useStore()?.sortTabData"
              :key="item?.value"
              class="py-2 hover:text-mainColor cursor-pointer hover:bg-[#2C2C2E]"
              :class="[
                useStore()?.sortTabActive === index &&
                  'bg-[#2C2C2E] text-mainColor',
              ]"
              @tap.stop="handleClickSortItem(index)"
            >
              {{ item?.label }}
            </view>
          </view>
        </view>
        <!-- 搜索栏 -->
        <view
          class="flex-1 flex items-center mx-[8px] lg:mx-0 max-[450px]:mx-[0px]"
        >
          <view
            class="relative w-full max-w-[50vw] h-[36px] bg-[#2C2C2E] rounded-[4px]"
          >
            <input
              id="searchInput"
              type="text"
              :placeholder="
                customPlace
                  ? customPlace
                  : clientData?.client === 'PC'
                    ? '输入图片名称，按Enter搜索'
                    : '输入图片名称，按搜索键搜索'
              "
              :value="searchValue"
              class="w-[100% - 28px] h-full pl-[28px] rounded-[4px] bg-transparent text-[14px]"
              placeholder-class="text-gray-400 text-[14px]"
              confirm-type="search"
              @input="handleSearchInput"
              @confirm="handleSearchChange"
            />
            <view class="absolute top-1/2 left-[8px] mt-[1px] -translate-y-1/2">
              <image
                class="w-[16px] h-[16px]"
                src="@/static/images/search.png"
              />
            </view>
            <view
              v-show="searchValue.length > 0"
              class="absolute top-1/2 right-[8px] mt-[1px] -translate-y-1/2"
              @tap="handleClearSearch"
            >
              <image
                class="w-[16px] h-[16px]"
                src="@/static/images/close.png"
              />
            </view>
          </view>
        </view>
        <!-- 上传按钮 用户 -->
        <view
          class="flex items-center lg:mr-[16px] ml-[8px] lg:ml-[96px] flex-shrink-0"
        >
          <view
            class="w-[80px] h-[36px] bg-mainColor rounded-[4px] flex justify-center items-center mr-[16px] lg:mr-[16px] max-sm:rounded-full max-sm:w-[32px] max-sm:h-[32px] flex justify-center items-center mr-[16px] lg:mr-[16px] max-sm:mr-[8px] hover:cursor-pointer"
            @tap="handleUploadClick()"
          >
            <image
              class="w-[20px] h-[16px] mr-[4px] max-sm:mr-0"
              src="@/static/images/upload.png"
            />
            <text class="max-sm:hidden">上传</text>
          </view>
          <view
            class="flex items-center px-[8px] py-[4px] hover:bg-[#2C2C2E] cursor-pointer"
            @tap.stop="handleUserCenterClick()"
          >
            <image
              v-if="useStore()?.userInfo?.avatar"
              class="w-[28px] h-[28px] mr-[8px] rounded-full max-sm:mr-0"
              :src="useStore()?.userInfo?.avatar"
            />
            <image
              v-else
              class="w-[28px] h-[28px] mr-[8px] rounded-full max-sm:mr-0"
              src="@/static/images/default_avatar.png"
            />
            <view class="text-[14px] font-bold max-sm:hidden"> 用户中心 </view>
          </view>
        </view>
        <!-- 450px 导航栏 -->
        <view
          class="absolute top-[100%] left-0 bg-[inherit] w-full max-[450px]:block overflow-hidden"
          :class="
            useStore()?.isShow450Select
              ? 'h-[76px] transition-h duration-300'
              : 'h-0'
          "
          @tap.stop="() => null"
        >
          <view
            class="w-[calc(100%-32px)] h-[34px] flex items-center justify- end mx-[16px] mt-[2px] lg:gap-[16px]"
          >
            <view
              v-for="(item, idx) in tabData"
              :key="item?.id"
              class="flex-1 hover:text-mainColor cursor-pointer"
              :class="
                idx === 0
                  ? 'text-left'
                  : idx === tabData?.length - 1
                    ? 'text-right'
                    : 'text-center'
              "
              @tap.stop="handleClickGoRoute(item?.id)"
            >
              {{ item?.name }}</view
            >
          </view>
          <view
            class="w-[calc(100%-32px)] h-[34px] flex items-center justify-end mx-[16px] lg:gap-[16px]"
          >
            <view class="flex-1 text-left"></view>
            <view class="flex-1 text-center"></view>
            <view
              class="flex-1 text-center cursor-pointer hover:text-mainColor"
              @tap="handleClickGoRoute('user')"
              >用户中心</view
            >
            <view
              class="flex-1 text-right cursor-pointer hover:text-mainColor"
              @tap="(logout(), useStore().setIsShow450Select(false))"
              >退出登录</view
            >
          </view>
        </view>
      </view>
    </view>
    <view class="layout_content flex-1 w-full overflow-hidden">
      <slot></slot>
    </view>
    <view
      v-if="!exclude?.includes('footer')"
      class="w-full bg-white flex justify-between items-center pt-[12px] lg:px-0 relative"
    >
      <view
        v-if="!exclude?.includes('check') && useStore()?.userInfo?.token"
        class="w-[220px] mx-[16px] flex items-center max-lg:w-[fit-content]"
      >
        <checkbox-group @change="handleCheckAll">
          <label
            class="flex items-center bg-gray-200 px-[12px] py-[8px] rounded-[4px] hover:cursor-pointer whitespace-nowrap"
            :class="useStore()?.checkAll ? 'text-mainColor' : ''"
          >
            <checkbox
              class="check_box footer_check mr-1"
              value="checkAll"
              :checked="useStore().checkAll"
            />
            全选
          </label>
        </checkbox-group>
        <text class="ml-[8px] text-gray-700 max-lg:hidden">
          已选择 {{ useStore()?.checkList?.length || 0 }} 张图片
        </text>
      </view>
      <view
        v-if="useStore()?.userInfo?.token && useStore()?.checkList?.length"
        class="w-[220px] mx-[16px] flex justify-end items-center gap-[12px] max-lg:ml-[4px]"
      >
        <view
          v-if="!exclude?.includes('delete')"
          class="flex items-center bg-gray-200 px-[12px] py-[8px] rounded-[4px] hover:cursor-pointer"
          @tap.stop="handleDeleteClick()"
        >
          <image
            class="w-[16px] h-[16px] mr-[4px]"
            src="@/static/images/delete.png"
          />
          <text class="max-sm:hidden">删除</text>
        </view>
        <view
          v-if="!exclude?.includes('download')"
          class="flex items-center bg-mainColor text-white px-[12px] py-[8px] rounded-[4px] hover:cursor-pointer"
          @tap.stop="handleDownloadClick()"
        >
          <image
            class="w-[16px] h-[16px] mr-[4px]"
            src="@/static/images/download.png"
          />
          <text class="max-sm:hidden">批量下载</text>
        </view>
      </view>
    </view>
    <view
      class="w-full bg-[#ffffff] text-center text-gray-300 text-[12px] pt-0 pb-[6px] max-sm:hidden"
      >{{ FOOTER_MESSAGE }}</view
    >
  </view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { ref, onMounted, getCurrentInstance } from "vue";
import { getRoute, copy, getClientInfo, logout } from "@/utils/index";
import { useStore } from "@/stores/index";
import { BREAK_POINT, FOOTER_MESSAGE } from "@/config/index";
import type { checkItem } from "@/types/store";
import { useDownloadClick } from "@/utils/useImageListHook";

const instance = getCurrentInstance();
const route = getRoute();
onShow(() => {
  uni.setStorageSync("url", route?.path);
});
const rImage = import.meta.glob("../../static/images/r_*.png", { eager: true });
const props = defineProps<{
  exclude?: ("footer" | "check" | "delete" | "download")[];
  customPlace?: string
}>();
const emits = defineEmits<{
  (e: "checkAllChange", data: boolean): void;
  (e: "deleteClick", data: checkItem[]): void;
  (e: "downloadClick", data: checkItem[]): void;
  (e: "searchInput", data: string): void;
  (e: "searchChange", data: string): void;
}>();
const tabData = ref([
  {
    name: "首页",
    id: "home",
    icon: getRIMG("r_home.png"),
  },
  {
    name: "我的",
    id: "my",
    icon: getRIMG("r_my.png"),
  },
  {
    name: "收藏",
    id: "collect",
    icon: getRIMG("r_collect.png"),
  },
  {
    name: "分享",
    id: "share",
    icon: getRIMG("r_share.png"),
  },
]);
/** 点击跳转路由 */
function handleClickGoRoute(id: string) {
  isShowSortSelect.value = false;
  useStore()?.setIsShow450Select(false);
  if (id === "share") {
    copy(route?.origin, "已复制分享链接");
    return;
  }
  route.go(`/qphotos/${id}/index`);
}
const isShowSortSelect = ref<boolean>(false);
/** 点击排序显示下拉框 */
function handleClickSort() {
  useStore()?.setIsShow450Select(false);
  isShowSortSelect.value = !isShowSortSelect.value;
}
/** 点击排序 */
function handleClickSortItem(value: number) {
  if (useStore()?.sortTabActive !== value) {
    useStore()?.setSortTabActive(value);
  }
  isShowSortSelect.value = !isShowSortSelect.value;
}
/**搜索 */
const searchValue = ref<string>("");
/**搜索事件 */
function handleSearchInput(e: any) {
  searchValue.value = (e?.detail?.value || "").trim();
  emits("searchInput", searchValue.value);
}
/** 点击清除搜索 */
function handleSearchChange() {
  emits("searchChange", searchValue.value);
}
/** */
function handleClearSearch() {
  searchValue.value = "";
  const query = uni.createSelectorQuery().in(instance);
  query
    .select("#searchInput")
    .node((res) => {
      if (res.node) {
        res.node.value = "";
        res.node.dispatchEvent(new Event("input"));
      }
    })
    .exec();
  emits("searchChange", searchValue.value);
}
/** 点击上传 */
async function handleUploadClick() {
  if (!useStore()?.userInfo?.token) {
    handleClickGoRoute("user");
    return;
  }
  handleClickGoRoute("upload");
}
/** 点击用户中心 */
async function handleUserCenterClick() {
  const clientInfo = getClientInfo();
  const { windowWidth } = clientInfo;
  if (windowWidth <= BREAK_POINT) {
    isShowSortSelect.value = false;
    useStore()?.setIsShow450Select();
  } else {
    route.go("/qphotos/user/index");
  }
}
/** 点击全选 */
function handleCheckAll(e: any) {
  useStore()?.setCheckAll(e.detail.value.includes("checkAll"));
  emits("checkAllChange", useStore()?.checkAll);
}
/** 点击删除 */
function handleDeleteClick() {
  emits("deleteClick", useStore()?.checkList);
}
/** 点击批量下载 */
function handleDownloadClick() {
  console.log(111);
  emits("downloadClick", useStore()?.checkList);
  useDownloadClick(useStore()?.checkList);
}
/** 获取图片路径 */
function getRIMG(fileName: string) {
  const matchKey: any = Object.keys(rImage).find((key) =>
    key.endsWith(fileName),
  );
  return (rImage[matchKey] as any)?.default;
}

const clientData = ref<any>(getClientInfo());
onMounted(() => {
  uni.onWindowResize(() => {
    clientData.value = getClientInfo();
    const { windowWidth } = clientData.value;
    if (windowWidth > BREAK_POINT) {
      isShowSortSelect.value = false;
      useStore()?.setIsShow450Select(false);
    }
  });
});
defineExpose({
  clientData,
  handleClearSearch,
});
</script>

<style scoped>
input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
}
</style>
