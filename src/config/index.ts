export const BREAK_POINT: number = 450;
export const FOOTER_MESSAGE: string = "仅个人使用，请勿用于商业用途";
export const IMAGE_CARD_WIDTH: number = 170;
export const IMAGE_CARD_GAP: number = 16;

export const HTTPCODE: Record<number, string> = {
  0: "成功",
  1: "未注册用户",
  999: "未知异常",
};

export const OPERATION_TYPE: Record<string, string> = {
  'login': "登录",
  'register': "注册",
  'retrievePassword': "忘记密码",
  'updateUserPassword': "修改密码",
  'updateUserInfo': "更新用户信息",
  'uploadImageInfo': "上传图片",
  
}