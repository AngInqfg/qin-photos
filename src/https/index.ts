const userCloudObj = uniCloud.importObject("q-photos-user");
import { HTTPCODE } from "@/config";
import { getClientInfo } from "@/utils";
import type { ImageItem } from "@/types";
const client = getClientInfo()?.client;
/**上传 */
export const upload = async (params: uploadImageParamsDTO, item?: any) => {
  await http<string, any>("deleteUploadFile", params?.oldAvatar || "");
  const res = await uniCloud.uploadFile({
    filePath: params?.path || "",
    cloudPathAsRealPath: true,
    cloudPath: `${params?.prefix}/${params?.name}`,
    onUploadProgress: function (progressEvent) {
      if (item) {
        const percentCompleted = progressEvent.loaded / progressEvent.total;
        item.prog =
          ((percentCompleted * 100).toFixed(2) as unknown as number) - 0;
        if (progressEvent.loaded === progressEvent.total) {
          item.create_time = Date.now();
        }
      }
    },
  });
  return res;
};
/**登录 */
export const login = async (params: loginParamsDTO) => {
  return await http<loginParamsDTO, loginResultDTO>("login", params);
};
/**注册email code */
type queryEmailCodeType = (
  | registerECodeParamsDTO
  | retrievePasswordParamsDTO
  | { email: string }
) & { type: "register" | "retrieve" | "updatePassword" };
export const queryEmailCode = async (params: queryEmailCodeType) => {
  return await http<queryEmailCodeType, null>("getEmailCode", params);
};
/**注册 */
export const queryRegister = async (params: registerParamsDTO) => {
  return await http<registerParamsDTO, registerResultDTO>("register", params);
};
/**找回密码 */
export const queryRetrievePassword = async (
  params: retrievePasswordParamsDTO
) => {
  return await http<retrievePasswordParamsDTO, string>(
    "retrievePassword",
    params
  );
};
/**获取位置信息 */
export const getMapLocation = async (params: getLocationParamsDTO) => {
  return await request<getLocationParamsDTO, getLocationResultDTO>(
    "https://restapi.amap.com/v3/geocode/regeo",
    params,
    { method: "GET" }
  );
};
/**更新用户信息 */
export async function queryUpdateUserInfo(params: updateUserInfoParamsDTO) {
  return await http<updateUserInfoParamsDTO, string>("updateUserInfo", params);
}
/**更换密码 */
export async function queryUpdateUserPass(params: updatePasswordParamsDTO) {
  return await http<updatePasswordParamsDTO, string>(
    "updateUserPassword",
    params
  );
}
/**上传图片用户更新 */
export async function queryUploadImageInfo(params: uploadImageInfoParamsDTO) {
  return await http<uploadImageInfoParamsDTO, uploadImageInfoResultDTO>(
    "uploadImageInfo",
    params
  );
}
/**获取首页列表 */
export async function queryIndexList(params: indexParamsDTO) {
  return await http<indexParamsDTO, ImageItem[]>("getIndexList", params);
}
export async function queryMyList(params: myParamsDTO) {
  return await http<myParamsDTO, ImageItem[]>("getMyUploads", params);
}
/**获取用户操作记录 */
export async function queryOperationRecords(params: pageParamsDTO) {
  return await http<pageParamsDTO, any>("getOperationRecords", params);
}
/**获取用户操作记录 */
export async function queryCollectList(params: collectParamsDTO) {
  return await http<collectParamsDTO, any>("getCollectList", params);
}

function http<P, T>(
  name: string,
  params: P,
  option?: any
): Promise<httpResolve<T>> {
  return new Promise((resolve, reject) => {
    if (Object.prototype.toString.call(params) === "[object Object]") {
      for (let key in params) {
        if (typeof params[key] === "string") {
          params[key] = (params[key] as unknown as string).trim() as any;
        }
      }
    }
    const cloudObj = option?.cloud ?? userCloudObj;
    cloudObj[name](params, {
      ...option,
      header: {
        auth:
          "Bearer " + (uni.getStorageSync("token") || "qphotots19980503qfg"),
        ...option?.header,
      },
    })
      .then((res: any) => {
        const result = {
          ...res,
          clientMessage: HTTPCODE[res?.code || 0],
        } as httpResolve<T>;
        resolve(result);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}
function request<P, R>(
  url: string,
  param?: P,
  option?: any
): Promise<httpResolve<R>> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: "POST",
      data: param,
      ...option,
      success: (res: any) => {
        const result = { ...res?.data } as httpResolve<R>;
        resolve(result);
      },
      fail: (err: Error) => {
        reject(err);
      },
    });
  });
}
export { http, request };
