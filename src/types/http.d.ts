interface httpResolve<T> {
  code: number;
  data: T;
  message: string;
  clientMessage: string;
  total?: number
}

/**登录参数 */
interface loginParamsDTO {
  username: string;
  password: string;
  loginType?: "login" | "retrieve";
}
/**登录结果 */
interface loginResultDTO {
  id: string;
  username: string;
  name: string;
  avatar: string;
  token: string;
  desc?: string;
  email: string;
  createTime: string;
}
/**注册参数 */
interface registerParamsDTO extends loginParamsDTO {
  email: string;
  eCode: string;
}
/**注册结果 */
interface registerResultDTO {
  username: string;
  status: boolean;
}
/**注册email code 参数 */
interface registerECodeParamsDTO extends registerParamsDTO {
  eCode?: string;
}
/** 找回密码 */
interface retrievePasswordParamsDTO extends loginParamsDTO {
  password?: string;
  email: string;
  eCode: string;
}
/**获取位置信息参数 */
interface getLocationParamsDTO {
  location: string;
  key: string;
}
/**获取位置信息结果 */
interface getLocationResultDTO {
  status: string;
  info: string;
  infocode: string;
  regeocode: {
    formatted_address: string;
    addressComponent: {
      province: string;
      city: string;
      district: string;
      street: string;
      street_number: string;
    };
  };
}
/**上传图片参数 */
interface uploadImageParamsDTO {
  oldAvatar?: string;
  path?: string;
  file?: any;
  prefix: string;
  name: string;
}
/**上传图片结果 */
interface uploadImageResultDTO {
  url: string;
}
/**更新用户信息参数 */
interface updateUserInfoParamsDTO {
  oldAvatar?: string;
  avatar?: string;
  name?: string;
  desc?: string;
  email: string;
}
/**上传图片更新 */
interface uploadImageInfoParamsDTO {
  files: ImageInfo[];
  uploadTime: number;
  tags: string[];
  createUser: string;
  city: string;
}
/**上传图片更新结果 */
interface uploadImageInfoResultDTO {}
/**更新密码 */
interface updatePasswordParamsDTO {
  password?: string;
  eCode?: string;
  email?: string;
}
/**获取首页列表参数 */
interface indexParamsDTO extends pageParamsDTO {
  sort?: string;
  search?: string
}
/**获取我的列表 */
interface myParamsDTO extends pageParamsDTO {
  search?: string;
  email?: string;
}
/**获取收藏列表 */
interface collectParamsDTO extends pageParamsDTO {
  search?: string;
  email?: string;
}
/**page */
interface pageParamsDTO {
  pageNum: number;
  pageSize: number;
  total: number;
  createUser?: string;
}