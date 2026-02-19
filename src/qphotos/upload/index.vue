<template>
  <Layout :exclude="['footer', 'check', 'delete', 'download']">
    <view class="h-full overflow-y-auto p-[20px] lg:p-[40px] box-border">
      <view class="max-w-[1200px] mx-auto">
        <view class="flex items-center gap-[10px] mb-[24px]">
          <text class="text-[20px] font-bold text-[#1C1C1E]">上传照片</text>
        </view>
        <view class="flex flex-col md:flex-row gap-[24px]">
          <view
            id="dragId"
            class="flex-1 cursor-pointer"
            @tap="handleSelectImage"
          >
            <view
              class="w-[calc(100%-40px)] bg-white rounded-[8px] p-[20px] h-[300px] max-[450px]:h-[150px] max-[450px]:py-[0px] border-[2px] border-dashed border-[#E5E7EB] hover:border-mainColor flex flex-col items-center justify-center transition-colors relative"
            >
              <view
                class="w-[80px] h-[80px] rounded-full bg-mainColor2 flex items-center justify-center mb-[24px] max-[450px]:hidden"
              >
                <image
                  src="@/static/images/upload.png"
                  class="w-[30px] h-[24px]"
                />
              </view>
              <text
                class="text-[18px] text-[#303133] mb-[12px] max-[450px]:hidden"
              >
                点击上传
              </text>
              <text
                class="text-[14px] text-[#909399] mb-[32px] text-center leading-[1.5] max-w-[400px]"
              >
                支持
                {{ imageExtensions.join("、").toUpperCase() }}
                等常见格式。单次最多上传{{ count }}张，单张不超过{{ size }}MB。
              </text>

              <button
                class="bg-mainColor text-white px-[32px] h-[40px] leading-[40px] text-[14px] rounded-[4px] border-none"
              >
                选择文件
              </button>
            </view>
          </view>
          <view class="w-full md:w-[300px] flex-shrink-0">
            <view
              class="bg-white rounded-[8px] p-[24px] max-[450px]:py-[15px] shadow-sm"
            >
              <view
                class="text-[16px] font-medium text-[#303133] mb-[8px] pb-[16px] max-[450px]:mb-[0] max-[450px]:pb-[6px]"
              >
                上传设置
              </view>

              <view class="flex flex-col max-[450px]:gap-[0px]">
                <view
                  class="flex items-center mb-[8px] max-[450px]:flex-col max-[450px]:items-start"
                >
                  <text
                    class="block text-[14px] text-[#606266] max-[450px]:mb-[6px]"
                    >添加标签</text
                  >
                  <input
                    v-model="tagsValue"
                    :readonly="loading"
                    type="text"
                    placeholder="例如：风景, 旅行, 2024"
                    class="w-[100%] max-[450px]:w-[calc(100%-24px)] h-[40px] px-[12px] border border-[#DCDFE6] border-solid rounded-[4px] text-[14px] outline-none focus:border-mainColor"
                  />
                </view>
                <view class="text-[12px] text-right text-[#d63434]"
                  >※ 标签以中英文逗号分隔</view
                >
                <button
                  class="w-full h-[40px] leading-[40px] mt-[12px] max-[450px]:mt-[6px] bg-mainColor text-white rounded-[4px] text-[14px] border-none hover:bg-mainColor1 hover:text-mainColor flex items-center justify-center gap-[6px]"
                  :class="{
                    'opacity-60 cursor-not-allowed': loading,
                    'pointer-events-none':
                      fileList?.length === 0 ||
                      fileList?.every((n) => n?.prog === 100),
                  }"
                  :disabled="loading"
                  @tap="handleUpload"
                >
                  <template
                    v-if="
                      fileList?.filter((n) => n?.prog !== 100)?.length === 0
                    "
                  >
                    请上传图片
                  </template>
                  <template v-else-if="loading">
                    <view
                      class="w-[14px] h-[14px] border-[2px] border-white border-t-transparent rounded-full animate-spin"
                    ></view>
                    上传中...
                  </template>
                  <template v-else>
                    <view
                      class="w-[14px] h-[14px] border-[1.5px] border-white rounded-full flex items-center justify-center"
                    >
                      <view
                        class="w-[6px] h-[4px] border-l-[1.5px] border-b-[1.5px] border-white rotate-[-45deg] mt-[-2px]"
                      ></view>
                    </view>
                    开始上传
                  </template>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="max-w-[1200px] mx-auto pt-[24px]">
        <view class="w-[100%]">
          <view
            v-for="(item, idx) in fileList"
            :key="item?.lastModified + item?.name"
            class="w-[calc(100%-24px)] mb-[6px] px-[12px] py-[4px] hover:bg-mainColor1 flex items-center relative"
          >
            <image
              :src="item?.tempUrl"
              mode="aspectFit"
              class="w-[35px] h-[35px] rounded-[4px] mr-[12px] border-[1px] border-[#ffffff] border-solid cursor-pointer"
              @tap="handleImage(idx)"
            />
            <view class="flex-[1]">
              <view
                class="rounded-[4px] flex items-center max-sm:flex-col max-sm:items-start"
              >
                <view class="flex-[1] py-[8px]">
                  <text
                    class="cursor-pointer hover:text-mainColor"
                    @tap="handleImage(idx)"
                  >
                    {{ item?.name }}</text
                  >
                </view>
                <view class="ml-auto max-lg:ml-[0]">
                  {{
                    item?.create_time
                      ? dayjs(item?.create_time)?.format("YYYY-MM-DD HH:mm:ss")
                      : ""
                  }}
                </view>
                <view
                  v-if="!loading && item.prog !== 100"
                  class="ml-[12px] max-sm:ml-[0] cursor-pointer flex justify-center items-center hover:bg-mainColor2 rounded-[4px] p-[4px] max-sm:w-[37px] max-sm:h-[37px] max-sm:absolute max-sm:top-[14px] max-sm:left-[12px] max-sm:p-[0px] max-sm:bg-[rgba(255,255,255,0.7)] max-sm:hover:bg-[rgba(255,255,255,0.7)]"
                  @tap="handleDel(idx)"
                >
                  <image
                    class="w-[20px] h-[20px]"
                    src="@/static/images/delete.png"
                  />
                </view>
              </view>
              <view class="w-[100%] flex items-center">
                <view
                  class="flex-[1] h-[6px] mr-[8px] bg-white rounded-[3px] overflow-hidden"
                >
                  <view
                    class="h-[100%] bg-mainColor"
                    :style="{
                      width: `${item?.prog}%`,
                    }"
                  ></view>
                </view>
                <view class="w-[110px] text-left max-md:w-[fit-content]">
                  <text class="text-mainColor">{{ item?.prog }}</text
                  >/100<text
                    class="ml-[4px] text-mainColor max-md:hidden"
                    v-if="item?.prog === 100"
                  >
                    完成
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Layout from "@/components/Layout/index.vue";
import { upload } from "@/https";
import dayjs from "dayjs";
import { useStore } from "@/stores";
import { queryUploadImageInfo } from "@/https";
const count = 20;
const size = 10;
const imageExtensions = ["jpg", "png", "jpeg", "gif"];
const loading = ref(false);
const tagsValue = ref("");
const fileList = ref<any[]>([]);

const handleSelectImage = () => {
  if (loading.value) return;
  uni.chooseImage({
    count,
    sourceType: ["album", "camera"],
    extension: imageExtensions,
    success: (res) => {
      filesChange(res?.tempFiles as any);
    },
  });
};
function handleImage(idx: number) {
  uni.previewImage({
    urls: fileList.value?.map((n) => n?.tempUrl),
    current: idx,
    loop: true,
  });
}
/**删除 */
function handleDel(idx: number) {
  fileList.value = fileList.value.filter((_, i) => i !== idx);
}
/**上传 */
const handleUpload = async () => {
  const noUploadList = fileList.value?.filter((n) => n?.prog !== 100);
  if (noUploadList?.some((n) => n?.file?.size > size * 1024 * 1024)) {
    uni.showToast({
      title: "文件大小不能超过10MB",
      icon: "none",
      duration: 1500,
    });
    return;
  }
  const names = noUploadList?.map((n) => {
    const arr = n?.file?.name?.split(".");
    return arr?.[arr?.length - 1]?.toLowerCase();
  });
  if (!names?.some((ext) => imageExtensions.includes(ext))) {
    uni.showToast({
      title: `仅支持上传${imageExtensions.join("、")}格式的图片`,
      icon: "none",
      duration: 1500,
    });
    return;
  }
  loading.value = true;
  let i = 0;
  for (const item of noUploadList) {
    const obj = {
      path: item?.tempUrl,
      prefix: `q-photos/images`,
      name: `${item?.name?.split(".")[0]}___${Date.now()}.${item?.name?.split(".")[1]}`,
    };
    upload(obj, item)
      .then((res) => {
        if (res?.fileID) {
          item.tempUrl = `${res?.fileID}`;
          item.prog = 100;
        }
      })
      .finally(async () => {
        i = i + 1;
        if (i === noUploadList?.length) {
          await queryUploadImageUserUpdate(noUploadList);
          loading.value = false;
        }
      })
      .catch((e) => {
        console.error(e);
        uni.showToast({
          title: item?.name + "上传失败",
          icon: "none",
          duration: 1500,
        });
      });
  }
};
/**上传图片用户更新 */
async function queryUploadImageUserUpdate(files: any[]) {
  const obj: uploadImageInfoParamsDTO = {
    files: files?.map((n) => {
      return {
        url: n?.tempUrl,
        name: n?.name,
        updateTime: Date.now(),
        size: n?.file?.size,
        type: n?.file?.type,
      };
    }),
    uploadTime: Date.now(),
    tags:
      tagsValue.value?.trim() === ""
        ? []
        : tagsValue.value.replaceAll("，", ",")?.split(","),
    createUser: useStore()?.userInfo?.email,
    city: uni.getStorageSync("qphotosCity")?.split("_")?.[1],
  };
  const res = await queryUploadImageInfo(obj);
  uni.showToast({
    title: res?.message || "上传成功",
    icon: "none",
    duration: 1500,
  });
}
/**文件改变 */
function filesChange(files: File[] | FileList) {
  if (!files) return;
  const newFiles: any = Array.isArray(files) ? files : Array.from(files);
  const fileObjList = newFiles
    ?.filter((_: any, i: number) => i < 21)
    ?.map((n: any) => {
      return {
        prog: 0,
        name: n?.name,
        tempUrl: n?.path,
        file: n,
      };
    });
  fileList.value.unshift(...fileObjList.reverse());
}
</script>

<style scoped></style>
