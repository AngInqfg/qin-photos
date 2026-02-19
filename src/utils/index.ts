import LOGO from "@/static/images/logo.png";
import { getMapLocation } from "@/https/index";
import type { GetRoute, GetClientInfo } from "./type";
import type { userInfo } from "@/types/store";
import { useStore } from "@/stores";
import Pages from "../pages.json";
const routeList: string[] = Pages?.pages
  ?.map((n: any) => `/${n?.path}`)
  ?.filter((_, i) => i > 0);
const routeNameList: string[] = Pages?.pages
  ?.map((n: any) => `${n?.title}`)
  ?.filter((_, i) => i > 0);
/**
 * 设置应用图标
 */
export const setLogo = () => {
  // #ifdef H5
  const oldIcon = document.querySelector('link[rel="icon"]');
  if (oldIcon) document.head.removeChild(oldIcon);
  const newIcon = document.createElement("link");
  newIcon.rel = "icon";
  newIcon.type = "image/png";
  newIcon.href = LOGO;
  document.head.appendChild(newIcon);
  // #endif
};
/**
 * 获取当前路由信息
 * @returns {Promise<GetRoute>} 当前路由信息
 */
export const getRoute = (): GetRoute => {
  // #ifdef H5
  const route = window.location;
  const urlParams: any = new URLSearchParams(route.search);
  const paramsObj: Record<string, string> = {};
  for (const [key, value] of urlParams.entries()) {
    paramsObj[key] = value;
  }
  const oldUrl = route?.href || "";
  const go = (url: string) => {
    if (url === oldUrl) return;
    uni?.navigateTo({ url: url });
    // #ifdef H5
    setTimeout(() => {
      document.title = routeNameList?.[routeList?.indexOf(url)] || "";
    });
    // #endif
    uni.setStorageSync("url", url);
  };
  return {
    ...route,
    params: paramsObj,
    path: route?.href.match(/#(.*?)(?=\?|$)/)?.[1] || "",
    routeData: routeList,
    go,
  };
  // #endif
};
/**
 * 复制文本
 * @param {string} text 要复制的文本
 */
export function copy(text: string, title: string = "") {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      icon: "none",
      success: () => {
        if (title) {
          uni.showToast({
            title: title,
            icon: "success",
          });
        } else {
          uni.hideToast();
        }
        resolve(true);
      },
      fail: () => {
        reject(false);
      },
    });
  });
}
/**
 * 获取当前环境
 * @returns {Object} 当前环境信息
 */
export function getClientInfo(): GetClientInfo {
  const sysInfo = uni.getSystemInfoSync();
  const { uniPlatform, platform } = sysInfo;
  let env: GetClientInfo["client"] = "PC";
  if (uniPlatform === "app-plus") {
    env = platform === "ios" ? "app_ios" : "app_android";
  } else if (uniPlatform === "web") {
    env = sysInfo.deviceType === "pc" ? "PC" : "H5";
  } else if (uniPlatform.startsWith("mp-")) {
    env = "xcx";
  }
  return {
    client: env,
    ...sysInfo,
    uniPlatform,
  };
}
/**获取位置信息 */
export const useGetData = () => {
  useStore()?.setHeaderSelectLoading(true);
  const loactions = ref<{ country: string; city: string }>({
    country: "未知",
    city: "--",
  });
  /**位置信息 */
  uni.getLocation({
    success: async (success) => {
      if (success?.errMsg === "getLocation:ok") {
        const { longitude, latitude } = success;
        const res: any = await getMapLocation({
          location: `${longitude},${latitude}`,
          key: "a85ddf16d221c67ae5fd55d661dac764",
        });
        loactions.value = {
          country: res?.regeocode?.addressComponent?.country || "未知",
          city: res?.regeocode?.addressComponent?.city || "--",
        };
        uni.setStorageSync(
          "qphotosCity",
          loactions.value?.country + "_" + loactions.value?.city,
        );
      }
    },
    fail: (e) => {
      loactions.value = { country: "未知", city: "--" };
      uni.setStorageSync("qphotosCity", "未知");
    },
    complete: () => {
      useStore()?.setHeaderSelectLoading(false);
    },
  });
  return { loactions };
};

/**退出登录 */
export function logout() {
  uni.removeStorageSync("userInfo");
  useStore()?.setUserInfo({} as userInfo);
  if (!useStore()?.userInfo?.token) return;
  uni.showToast({
    title: "已退出",
    icon: "success",
    duration: 1000,
  });
}
