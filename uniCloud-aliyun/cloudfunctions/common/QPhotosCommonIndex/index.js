const nodemailer = require("nodemailer");
const my = "3258744368@qq.com";
const myPass = "zahyvbaqofqydaah";
/**创建token*/
function createToken() {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < 64; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
/**发送邮件*/
async function sendEmail(to, subjectType, contentHtml) {
  const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: {
      user: my,
      pass: myPass,
    },
  });
  const mailOptions = {
    from: `寻<${my}>`,
    to: to,
    subject: subjectType,
    html: contentHtml,
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (e) {
    console.log("===sendEmailError===", e);
    return false;
  }
}
/**处理找回密码 */
function retrievePasswordChange(str) {
  const key = "qphotos";
  function encrypt() {
    if (!str) return "";
    let result = "";
    let keyIndex = 0;
    for (let i = 0; i < str.length; i += 3) {
      const chunk = str.slice(i, i + 3);
      result += chunk;
      if (chunk.length === 3 && i + 3 < str.length) {
        if (keyIndex < key.length) {
          result += key[keyIndex];
          keyIndex++;
        }
      }
    }
    if (keyIndex < key.length) {
      result += key.slice(keyIndex);
    }
    return result;
  }
  function decrypt() {
    if (!str) return "";
    const originalLen = str.length - key.length;
    if (originalLen < 0) return str; // 异常情况，直接返回
    let result = "";
    let currentIdx = 0;
    let keyIndex = 0;
    while (result.length < originalLen) {
      const remain = originalLen - result.length;
      const count = Math.min(3, remain);
      result += str.slice(currentIdx, currentIdx + count);
      currentIdx += count;
      if (count === 3 && result.length < originalLen && keyIndex < key.length) {
        currentIdx++;
        keyIndex++;
      }
    }
    return result;
  }
  return {
    encrypt,
    decrypt,
  };
}
module.exports = function (e) {
  return {
    sendEmail,
    createToken,
    retrievePasswordChange,
  };
};
