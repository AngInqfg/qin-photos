<template>
  <view
    class="w-full h-full flex flex-col relative overflow-auto max-md:overflow-hidden"
  >
    <!-- loading -->
    <view
      class="pointer-events-none absolute top-[-35px] left-1/2 -translate-x-1/2 transition-transform duration-300 linear z-[98]"
      :class="{ 'translate-y-[85px]': useStore().headerSelectLoading }"
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
    <view
      v-if="showError"
      class="text-white w-full h-[50px] bg-mainColor flex items-center justify-center absolute top-[0] left-[0]"
    >
      请及时修改密码, 3秒后自动关闭
      <image
        class="w-[20px] h-[20px] absolute top-[12px] right-[12px] cursor-pointer"
        src="@/static/images/close.png"
        @tap="handleCloseError()"
      />
    </view>
    <view
      class="h-[250px] flex-[0_0_250px] pt-[50px] max-md:h-[0px] max-md:flex-[0_0_0] max-md:pt-[0px]"
    >
    </view>
    <view
      class="w-[100%] max-md:w-[100%] flex-[1] bg-[#F5F7FA] flex max-md:block gap-[20px] max-md:overflow-auto"
    >
      <view
        class="flex-[1] max-w-[300px] relative max-md:max-w-[100%] translate-y-[-50px] max-md:translate-y-[0px]"
      >
        <view
          class="w-[100%] max-md:w-[calc(100%-20px)] py-[20px] bg-[#FFFFFF] max-md:static max-md:my-[10px] ml-[20px] max-md:mx-[10px] sticky top-[70px] rounded-[20px] flex flex-col items-center justify-center"
        >
          <view
            class="w-[calc(100%-32px)] text-[12px] text-[#616E7E] cursor-pointer absolute top-[16px] left-[16px] flex justify-between items-center gap-[12px]"
          >
            <view class="hover:text-mainColor" @tap="handleGoRoute('home')"
              >←首页</view
            >
            <view class="hover:text-mainColor" @tap="handleEditPassword(true)"
              >修改密码</view
            >
          </view>
          <template v-if="!isEdit">
            <view
              class="w-[65px] h-[65px] rounded-[50%] overflow-hidden bg-[#CBCFDA] mb-[12px] border-[3px] border-[#ffffff] border-solid"
              style="box-shadow: 0 2px 4px #dddddd"
            >
              <image
                class="w-[100%] h-[100%] transform hover:scale-[1.2]"
                :src="useStore()?.userInfo?.avatar || defaultAvatar"
                @tap="
                  handleShowImage(useStore()?.userInfo?.avatar || defaultAvatar)
                "
              />
            </view>
            <view class="font-[600] text-[24px] pb-[8px]">
              {{
                useStore()?.userInfo?.name
                  ? useStore()?.userInfo?.name
                  : useStore()?.userInfo?.username
                    ? useStore()?.userInfo?.username?.length > 16
                      ? useStore()?.userInfo?.username?.substring(0, 16)
                      : useStore()?.userInfo?.username
                    : "用户"
              }}
            </view>
            <view
              class="pb-[16px] text-[#8684A4] text-[14px]"
              :title="useStore()?.userInfo?.desc || null"
            >
              {{ useStore()?.userInfo?.desc?.substring(0, 200) || "暂无描述" }}
            </view>
            <view
              class="w-[calc(100%-40px)] mx-auto flex justify-between items-center gap-[12px] pb-[30px] mb-[20px]"
              style="border-bottom: 1px solid #f5f6f8"
            >
              <view
                v-if="!isEdit"
                class="flex-[1] bg-mainColor text-white text-center h-[30px] flex items-center justify-center rounded-[4px] cursor-pointer"
                @tap="
                  () => (
                    handleSetForm(useStore()?.userInfo),
                    handleSetEdit(true)
                  )
                "
                >编辑资料</view
              >
              <view
                class="whitespace-nowrap text-[#8684A4] bg-[#F5F7FA] h-[28px] px-[6px] rounded-[4px] flex items-center justify-center border-[1px] border-[#E7EAEE] border-solid cursor-pointer hover:bg-[#ffffff] hover:text-mainColor hover:border-mainColor"
                @tap="handleExit()"
              >
                退出
              </view>
            </view>
          </template>
          <!-- 修改用户信息 -->
          <template v-else>
            <view
              class="w-[65px] shadow-[0_2px_4px_#dddddd] hover:shadow-[0_2px_4px_var(--mainColor)] h-[65px] rounded-[50%] overflow-hidden bg-[#CBCFDA] mb-[18px] border-[3px] border-[#ffffff] border-solid cursor-pointer"
            >
              <image
                class="w-[100%] h-[100%]"
                :src="editForm?.avatar || defaultAvatar"
                @tap="handleUploadAvatar()"
              />
            </view>
            <view class="pb-[12px] w-[calc(100%-40px)]">
              <input
                class="text-center w-[100%] border-[0] border-b-[1px] border-[#E7EAEE] border-solid py-[6px]"
                v-model="editForm.name"
                placeholder="请输入昵称（10）"
                :maxlength="10"
                cursor-color="var(--mainColor)"
              />
            </view>
            <view class="pb-[16px] w-[calc(100%-40px)]">
              <textarea
                class="text-left w-[100%] text-[12px] h-[50px] border-[0] border-b-[1px] border-[#E7EAEE] border-solid"
                v-model="editForm.desc"
                placeholder="请输入描述（500）"
                :maxlength="500"
                cursor-color="var(--mainColor)"
              ></textarea>
            </view>
            <view
              class="w-[calc(100%-40px)] mx-auto flex justify-between items-center gap-[12px] pb-[30px] mb-[20px]"
              style="border-bottom: 1px solid #f5f6f8"
            >
              <view
                class="flex-[1] bg-mainColor text-white text-center h-[30px] flex items-center justify-center rounded-[4px] cursor-pointer"
                @tap="handleEditConfirm()"
                >确认</view
              >
              <view
                class="whitespace-nowrap text-[#8684A4] bg-[#F5F7FA] h-[28px] px-[6px] rounded-[4px] flex items-center justify-center border-[1px] border-[#E7EAEE] border-solid cursor-pointer hover:bg-[#ffffff] hover:text-mainColor hover:border-mainColor"
                @tap="handleSetEdit(false)"
              >
                取消
              </view>
            </view>
          </template>
          <view
            class="text-left w-[calc(100%-40px)] text-[14px] text-[#616E7E]"
          >
            <view class="mb-[12px] flex items-center gap-[4px]">
              <image
                class="w-[20px] h-[20px]"
                src="@/static/images/position.png"
              />
              {{ loactions?.[1]?.substring(0, 5) }}
              {{ loactions?.[1] ? "，" : "" }}
              {{ loactions?.[0]?.substring(0, 5) }}
            </view>
            <view class="mb-[12px] flex items-center gap-[4px]">
              <image
                class="w-[20px] h-[20px]"
                src="@/static/images/email.png"
              />
              {{ useStore()?.userInfo?.email || "暂无邮箱" }}
            </view>
            <view class="flex items-center gap-[4px]">
              <image class="w-[18px] h-[18px]" src="@/static/images/date.png" />
              {{
                useStore()?.userInfo?.createTime
                  ? dayjs(useStore()?.userInfo?.createTime).format(
                      "YYYY-MM-DD HH:mm",
                    )
                  : "--"
              }}
            </view>
          </view>
        </view>
      </view>
      <view class="flex-[1] h-[100%] max-md:h-auto ml-[20px] max-md:mx-[0px]">
        <HaveUserCType class="h-[100%]" />
      </view>
    </view>
    <!-- 修改密码 -->
    <view
      v-if="isEditPassword"
      class="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)]"
    >
      <view class="w-[500px] bg-white py-[12px]">
        <view class="text-center my-[8px]">修改密码</view>
        <input
          v-model="editPassForm.password"
          class="text-center mb-[12px] w-[80%] mx-auto py-[6px] border-[0px] border-b-[1px] border-solid"
          :class="{
            'border-[#acf76f]': isPassOk,
            'border-[#fa3636]': !isPassOk,
          }"
          type="password"
          placeholder="请输入密码"
        />
        <input
          v-model="editPassForm.confirmPassword"
          class="text-center mb-[12px] w-[80%] mx-auto py-[6px] border-[0px] border-b-[1px] border-solid"
          :class="{
            'border-[#acf76f]': isPassOk,
            'border-[#fa3636]': !isPassOk,
          }"
          type="password"
          placeholder="请再次确认密码"
        />
        <view class="flex justify-center items-center">
          即将向{{ useStore()?.userInfo?.email }}发送验证码，
          <text
            class="text-mainColor cursor-pointer hover:text-mainColor2"
            @tap="handleSendEmail()"
          >
            {{ emailTimer ? `${emailTimer}s` : "发送" }}
          </text>
          <input
            class="text-center max-w-[80px]"
            type="number"
            placeholder="验证码"
            v-model="editPassForm.eCode"
          />
        </view>
        <view class="flex justify-around items-center my-[8px]">
          <view
            class="px-[12px] py-[4px] bg-mainColor1 hover:bg-mainColor2 hover:text-white rounded-[4px] cursor-pointer"
            @tap="handleEditPassword(false)"
            >取消</view
          >
          <view
            class="px-[12px] py-[4px] bg-mainColor text-white rounded-[4px] cursor-pointer"
            :class="{
              'bg-mainColor1': !isPassOk || !editPassForm.eCode,
            }"
            @tap="handleUpdatePassword()"
            >确认</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useStore } from "@/stores";
import defaultAvatar from "@/static/images/default_avatar.png";
import { getRoute } from "@/utils";
import { useEditHooks } from "./useEditHooks";
import HaveUserCType from "./haveUserCType.vue";
import dayjs from "dayjs";
import { queryEmailCode, queryUpdateUserPass } from "@/https";
const props = defineProps({
  loginType: {
    type: String as PropType<"login" | "retrieve">,
    default: "login",
  },
});

const loactions = uni.getStorageSync("qphotosCity")?.split("_");
const {
  isEdit,
  editForm,
  handleSetForm,
  handleSetEdit,
  handleUploadAvatar,
  handleEditConfirm,
} = useEditHooks();
const editPassForm = ref({
  password: "",
  confirmPassword: "",
  eCode: "",
});
const isPassOk = computed(() => {
  return (
    editPassForm.value.password &&
    editPassForm.value.confirmPassword &&
    editPassForm.value.password.trim() ===
      editPassForm.value.confirmPassword.trim()
  );
});
/**退出 */
function handleExit() {
  uni.showModal({
    title: "提示",
    content: "确定退出登录吗？",
    confirmColor: "var(--mainColor)",
    success: (res) => {
      if (res.confirm) {
        useStore()?.setUserInfo({
          id: "",
          username: "",
          name: "",
          avatar: "",
          token: "",
          email: "",
          createTime: "",
        });
        getRoute()?.go(`/qphotos/user/index`);
      }
    },
  });
}

function handleGoRoute(route: string) {
  getRoute()?.go(`/qphotos/${route}/index`);
}
const showError = ref(false);
let timer: any = null;
watchEffect(() => {
  if (props.loginType === "retrieve") {
    showError.value = true;
    timer = setTimeout(() => {
      timer = null;
      handleCloseError();
    }, 3000);
  }
});
/**  关闭错误提示 */
function handleCloseError() {
  showError.value = false;
  if (timer) {
    clearTimeout(timer);
  }
}
/**  显示图片 */
function handleShowImage(str: string) {
  uni.previewImage({
    urls: [str],
  });
}
const isEditPassword = ref<boolean>(false);
//**  修改密码 */
function handleEditPassword(bool: boolean) {
  isEditPassword.value = bool;
}
const emailTimer = ref<number>(0);
const timer2 = ref<number>(0);
/**发送验证码 */
async function handleSendEmail() {
  if (emailTimer.value > 0) return;
  emailTimer.value = 60;
  timer2.value = setInterval(() => {
    emailTimer.value--;
    if (emailTimer.value <= 0) {
      clearInterval(timer2.value);
    }
  }, 1000);
  await queryEmailCode({
    email: useStore()?.userInfo?.email || "",
    type: "updatePassword",
  });
}
/** 更新密码 */
async function handleUpdatePassword() {
  if (!isPassOk.value) return;
  if (!editPassForm.value.eCode.trim()) return;
  const res = await queryUpdateUserPass({
    password: editPassForm.value.password,
    eCode: editPassForm.value.eCode,
    email: useStore()?.userInfo?.email || "",
  });
  uni.showToast({
    title: res?.message || "更新成功",
  });
  if (res?.code === 0) {
    handleEditPassword(false);
    editPassForm.value = {
      password: "",
      confirmPassword: "",
      eCode: "",
    };
  }
}
</script>

<style></style>
