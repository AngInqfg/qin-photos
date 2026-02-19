import type { ImageItem } from "./index";
export { ImageItem };
export type isShow450Select = boolean;
export interface userInfo extends loginResultDTO {}
export type sortTabData = {
  label: string;
  value: string;
};
export type sortTabActive = number;
export type checkItem = ImageItem;
export type checkAll = boolean;
export type bool = boolean;
export interface piniaStore {
  userInfo: Ref<userInfo>;
  setUserInfo: (params: userInfo) => void;
  isShow450Select: Ref<isShow450Select>;
  setIsShow450Select: (bool?: isShow450Select) => void;
  sortTabActive: Ref<sortTabActive>;
  sortTabData: Ref<sortTabData[]>;
  setSortTabActive: (params: sortTabActive) => void;
  checkList: Ref<checkItem[]>;
  setCheckList: (ids?: checkItem[]) => void;
  checkAll: Ref<checkAll>;
  setCheckAll: (bool: checkAll) => void;
  headerSelectLoading: Ref<bool>;
  setHeaderSelectLoading: (bool: bool) => void;
  loginDialog: Ref<bool>;
  imgDetailDialog: Ref<bool>;
}

/**
 * data
 *
 */
export interface dataStore {
  homeData: Ref<ImageItem[]>;
  myData: Ref<ImageItem[]>;
  collectData: Ref<ImageItem[]>;
}
