import { ref } from "vue";
import { defineStore } from "pinia";
import { useDataStore } from "./data";
import type {
  isShow450Select,
  piniaStore,
  userInfo,
  sortTabData,
  sortTabActive,
  checkItem,
  checkAll,
  bool,
} from "../types/store";
export const useStore = defineStore("useStore", (): piniaStore => {
  // 排序
  const sortTabActive = ref<sortTabActive>(0);
  const sortTabData = ref<sortTabData[]>([
    {
      label: "最新上传",
      value: "latest",
    },
    {
      label: "时间",
      value: "month",
    },
    {
      label: "地区",
      value: "province",
    },
  ]);
  async function setSortTabActive(params: sortTabActive) {
    sortTabActive.value = params;
  }
  // 450px一下显示菜单
  const isShow450Select = ref<isShow450Select>(false);
  async function setIsShow450Select(bool?: isShow450Select) {
    isShow450Select.value = bool === undefined ? !isShow450Select.value : bool;
  }
  // 用户
  const userInfo = ref<userInfo>(
    (uni.getStorageSync("userInfo")
      ? JSON.parse(uni.getStorageSync("userInfo"))
      : {}) as userInfo,
  );
  async function setUserInfo(params: userInfo) {
    userInfo.value = params;
    uni.setStorageSync("userInfo", JSON.stringify(params));
  }
  // 选中
  const checkAll = ref<checkAll>(false);
  async function setCheckAll(bool: checkAll) {
    checkAll.value = bool;
  }
  const checkList = ref<checkItem[]>([]);
  async function setCheckList(ids?: checkItem[]) {
    checkList.value = ids || [];
  }
  //loading
  const headerSelectLoading = ref<bool>(false);
  function setHeaderSelectLoading(bool: bool) {
    headerSelectLoading.value = bool;
  }
  // 登录弹窗
  const loginDialog = ref<bool>(false);
  // 图片详情弹窗
  const imgDetailDialog = ref<bool>(false);
  return {
    isShow450Select,
    setIsShow450Select,
    userInfo,
    setUserInfo,
    sortTabActive,
    sortTabData,
    setSortTabActive,
    checkList,
    setCheckList,
    checkAll,
    setCheckAll,
    headerSelectLoading,
    setHeaderSelectLoading,
    loginDialog,
    imgDetailDialog,
  };
});
export { useDataStore };
