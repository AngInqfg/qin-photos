import { ref } from "vue";
import {
  upload,
  queryUpdateUserInfo,
  queryOperationRecords,
} from "@/https/index";
import type { userInfo } from "@/types/store";
import { useStore } from "@/stores";

export const useEditHooks = () => {
  const isEdit = ref<boolean>(false);
  const editForm = ref<updateUserInfoParamsDTO & { avatarName?: string }>({
    avatar: "",
    name: "",
    desc: "",
    email: useStore()?.userInfo?.email || "",
  });
  /**取消编辑 */
  function handleSetEdit(bool: boolean) {
    isEdit.value = bool;
    if (!bool) {
      editForm.value = {
        avatar: "",
        name: "",
        desc: "",
        email: useStore()?.userInfo?.email || "",
      };
    }
  }
  /**创建值 */
  function handleSetForm(form: userInfo) {
    const { avatar, name, desc, username } = form;
    editForm.value = {
      avatar: avatar || "",
      name: name || username || "",
      desc: desc || "",
      email: useStore()?.userInfo?.email || "",
    };
  }
  /**上传头像 */
  function handleUploadAvatar() {
    uni.chooseImage({
      count: 1,
      success: (res: any) => {
        editForm.value.avatar = res.tempFilePaths[0];
        editForm.value.avatarName = res.tempFiles?.[0]?.name || "";
      },
    });
  }
  /**保存 */
  async function handleEditConfirm() {
    uni.showLoading({
      title: "上传中",
    });
    let avatarRes = null;
    if (editForm.value?.avatar) {
      avatarRes = await upload({
        path: editForm.value.avatar,
        prefix: `q-photos/avatar`,
        name: `${useStore()?.userInfo?.email}.${editForm.value?.avatarName?.split(".")[1]}`,
      });
      if (avatarRes?.fileID) {
        editForm.value.avatar = avatarRes?.fileID || "";
      }
    }
    const { avatar, name, desc, email } = editForm.value;
    const res = await queryUpdateUserInfo({
      oldAvatar: useStore()?.userInfo?.avatar,
      avatar,
      name,
      desc,
      email,
    });
    if (res?.code === 0) {
      useStore()?.setUserInfo({
        ...useStore()?.userInfo,
        avatar: avatar || useStore()?.userInfo?.avatar,
        name: name || useStore()?.userInfo?.name,
        desc,
      });
      handleSetEdit(false);
    }
    uni.showToast({
      title: res?.message,
      icon: res?.code === 0 ? "success" : "error",
      duration: 1500,
    });
  }
  return {
    isEdit,
    editForm,
    handleSetForm,
    handleSetEdit,
    handleUploadAvatar,
    handleEditConfirm,
  };
};
export const useOperationHooks = () => {
  const params = ref({
    pageNum: 1,
    pageSize: 100,
    total: 0,
    createUser: useStore()?.userInfo?.email || "",
  });
  const list = ref<any[]>([]);
  const getList = async () => {
    const res = await queryOperationRecords(params.value);
    if (res?.code === 0) {
      params.value.pageNum = res?.data?.pageNum || 1;
      params.value.pageSize = res?.data?.pageSize || 10;
      params.value.total = res?.data?.total || 0;
    }
    list.value = res?.data?.list || [];
  };
  const setPageNum = (pageNum: number) => {
    params.value.pageNum = pageNum;
    getList();
  };
  const setPageSize = (pageSize: number) => {
    params.value.pageNum = 1;
    params.value.pageSize = pageSize;
    getList();
  };
  getList()
  return {
    list,
    params,
    setPageNum,
    setPageSize,
  };
};
