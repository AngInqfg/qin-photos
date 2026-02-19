const db = uniCloud.database();
const UserDataset = db.collection("q-photo-user");
const ListDataset = db.collection("q-photo-list");
const MyImageDataset = db.collection("q-photo-myImage");
const CollectDataset = db.collection("q-photo-collect");
const VerifyDataset = db.collection("q-photo-verify");
const QPhotosCommonIndex = require("QPhotosCommonIndex");

/**操作记录 */
async function setOperation(param) {
  try {
    const { createUser, type, data } = param || {};
    if (!createUser) {
      return { code: 999, message: "缺少用户标识", data: null };
    }
    const { data: users } = await UserDataset.where({
      email: createUser,
    }).get();
    if (!users || !users.length) {
      return { code: 999, message: "用户不存在", data: null };
    }
    const user = users[0];
    const ops = Array.isArray(user.operation) ? user.operation : [];
    const op = { type, data, create_time: new Date() };
    const trimmed = [op].concat(ops).slice(0, 100);
    await UserDataset.doc(user._id).update({
      operation: trimmed,
      update_time: new Date(),
    });
    return { code: 0, message: "操作记录已保存", data: null };
  } catch (e) {
    console.error(e);
    return { code: 999, message: "操作记录保存失败", data: null };
  }
}
module.exports = {
  _before: function () {
    const __internalObject = this.__internalObject || {};
    const event = __internalObject.event || {};
    const header = event.headers || {};
    // const validAuth = "Basic qphotos19980503qfg";
    // if (!header['x-auth'] || ![validAuth].includes(header['x-auth']) ) {
    //   return {
    //     code: 999,
    //     message: '登录过期',
    //     data: null
    //   };
    // }
  },
  /**
   * 登录业务方法：仅接收前端业务参数，无options参数（云对象不传递配置项）
   * @param {Object} param - 前端传的{username, password}
   */
  async login(param) {
    try {
      const { createToken, retrievePasswordChange } = QPhotosCommonIndex();
      const { username, password, loginType = "login" } = param || {};
      const dbCmd = db.command;
      const { data: userData } = await UserDataset.where(
        dbCmd.or([{ username: username }, { email: username }]),
      ).get();
      const pw =
        loginType === "login"
          ? password
          : retrievePasswordChange(password || "").decrypt();
      if (!userData?.length) {
        return { code: 1, message: "未查询到用户，请前往注册", data: null };
      } else if (userData[0]?.password !== pw) {
        return { code: 999, message: "账号密码错误", data: null };
      }
      const token = createToken();
      await UserDataset.doc(userData[0]._id).update({
        token,
        update_time: new Date(),
      });
      await setOperation({
        createUser: userData?.[0]?.email,
        type: "login",
        data: null,
      }).catch(() => {});
      return {
        code: 0,
        message: "登录成功",
        data: {
          id: userData?.[0]?.id || "",
          username: userData?.[0]?.username,
          name: userData?.[0]?.name || "",
          avatar: userData?.[0]?.avatar || "",
          token: token,
          createTime: userData?.[0]?.create_time,
          email: userData?.[0]?.email,
          desc: userData?.[0]?.desc || "",
        },
      };
    } catch (e) {
      return { code: 999, message: e, data: null };
    }
  },
  /**
   * 获取邮箱验证码
   * @param {Object} param - 前端传的{type, email}
   */
  async getEmailCode(param) {
    const { type, email } = param || {};
    const { data: userData } = await UserDataset.where({ email }).get();
    if (userData?.[0] && type === "register") {
      return { code: 999, message: "该邮箱已注册" };
    }
    const code = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    const now = Date.now();
    const expiredAt = now + 5 * 60 * 1000;

    try {
      await VerifyDataset.where({ email, type }).remove(); // 先删掉旧的（可选）
      await VerifyDataset.add({
        email,
        code,
        type,
        expired_at: expiredAt,
        create_time: new Date(),
      });
      const subject =
        type === "register"
          ? "注册验证码"
          : type === "retrieve"
            ? "找回密码验证码"
            : type === "updatePassword"
              ? "修改密码验证码"
              : "";
      const content = `<div>QPHOTOS${subject}验证码为：<b style="font-size:20px;">${code}</b> , 5分钟内有效。</div>`;
      const { sendEmail } = QPhotosCommonIndex();
      await sendEmail(email, subject, content);
      return {
        code: 0,
        message: "验证码已发送",
        data: null,
      };
    } catch (e) {
      console.error(e);
      return { code: 999, message: "发送失败，请稍后再试", data: null };
    }
  },
  /**
   * 注册业务方法：仅接收前端业务参数，无options参数（云对象不传递配置项）
   * @param {Object} param - 前端传的{email, code, username, password}
   */
  async register(param) {
    try {
      const { email, code, username, password } = param || {};
      if (username?.length < 6 || password?.length < 6) {
        return {
          code: 999,
          message: "用户名或密码长度不能小于6位",
          data: null,
        };
      }
      const { data: userData } = await UserDataset.where({ email }).get();
      if (userData?.[0]) {
        return { code: 999, message: "该邮箱已注册", data: null };
      }
      const { data: verifyData } = await VerifyDataset.where({
        email,
        code,
        type: "register",
      }).get();
      if (!verifyData?.[0]) {
        return { code: 999, message: "验证码错误", data: null };
      }
      const now = Date.now();
      if (now > verifyData?.[0]?.expired_at) {
        return { code: 999, message: "验证码已过期", data: null };
      }
      await UserDataset.add({
        email,
        username,
        password,
        create_time: new Date().getTime(),
      });
      await VerifyDataset.doc(verifyData?.[0]?._id).remove();
      await setOperation({
        createUser: email,
        type: "register",
        data: null,
      }).catch(() => {});
      return {
        code: 0,
        message: "注册成功",
        data: null,
      };
    } catch (e) {
      console.error(e);
      return { code: 999, message: "注册失败，请稍后再试", data: null };
    }
  },
  /**
   * 找回密码业务方法：仅接收前端业务参数，无options参数（云对象不传递配置项）
   * @param {Object} param - 前端传的{email, code, password}
   */
  async retrievePassword(param) {
    try {
      const { email, code, password } = param || {};
      const { data: verifyData } = await VerifyDataset.where({
        email,
        code,
        type: "retrieve",
      }).get();
      if (!verifyData?.[0]) {
        return { code: 999, message: "验证码错误", data: null };
      }
      const now = Date.now();
      if (now > verifyData?.[0]?.expired_at) {
        return { code: 999, message: "验证码已过期", data: null };
      }
      await UserDataset.where({ email }).update({
        update_time: new Date(),
      });
      const { data: userData } = await UserDataset.where({
        email,
      }).get();
      const { retrievePasswordChange } = QPhotosCommonIndex();
      const pw = retrievePasswordChange(
        userData?.[0]?.password || "",
      ).encrypt();
      await setOperation({
        createUser: email,
        type: "retrievePassword",
        data: null,
      }).catch(() => {});
      return {
        code: 0,
        message: "找回密码成功",
        data: pw,
      };
    } catch (e) {
      console.error(e);
      return { code: 999, message: "找回密码失败，请稍后再试", data: null };
    }
  },
  /**
   * 更新用户信息业务方法：仅接收前端业务参数，无options参数（云对象不传递配置项）
   * @param {Object} param - 前端传的{avatar, name, desc}
   */
  async updateUserInfo(param) {
    try {
      const { avatar = "", name = "", desc = "", email } = param || {};
      await UserDataset.where({ email }).update({
        avatar,
        name,
        desc,
        update_time: new Date(),
      });
      await setOperation({
        createUser: email,
        type: "updateUserInfo",
        data: null,
      }).catch(() => {});
      return {
        code: 0,
        message: "更新成功",
        data: null,
      };
    } catch (e) {
      return { code: 999, message: "更新失败", data: null };
    }
  },
  /**修改密码 */
  async updateUserPassword(param) {
    try {
      const { password = "", eCode = "", email } = param || {};
      const { data: verifyData } = await VerifyDataset.where({
        email,
        code: eCode,
        type: "updatePassword",
      }).get();
      if (!verifyData?.[0]) {
        return { code: 999, message: "验证码错误", data: null };
      }
      const now = Date.now();
      if (now > verifyData?.[0]?.expired_at) {
        return { code: 999, message: "验证码已过期", data: null };
      }
      await UserDataset.where({ email }).update({
        password,
        update_time: new Date(),
      });
      await VerifyDataset.doc(verifyData?.[0]?._id).remove();
      await setOperation({
        createUser: email,
        type: "updateUserPassword",
        data: null,
      }).catch(() => {});
      return {
        code: 0,
        message: "更新成功",
        data: null,
      };
    } catch (e) {
      return { code: 999, message: "更新失败", data: null };
    }
  },
  /**上传图片后更新用户图片信息 */
  async uploadImageInfo(param) {
    try {
      const {
        files = [],
        uploadTime,
        tags = [],
        createUser,
        city,
      } = param || {};
      const docs = files.map((file) => ({
        file,
        uploadTime,
        tags,
        createUser,
        city,
        create_time: new Date(),
      }));
      // 保存到图片总表
      await Promise.all(docs.map((doc) => ListDataset.add(doc)));
      // 保存到我的图片表
      const dbCmd = db.command;
      const { data: myImageUser } = await MyImageDataset.where({
        createUser,
      }).get();
      if (myImageUser && myImageUser.length) {
        await MyImageDataset.doc(myImageUser[0]._id).update({
          list: dbCmd.push(docs),
          update_time: new Date(),
        });
      } else {
        await MyImageDataset.add({
          createUser,
          list: docs,
          create_time: new Date(),
        });
      }
      await setOperation({
        createUser,
        type: "uploadImageInfo",
        data: { files: files, count: files.length, tags, city },
      }).catch(() => {});
      return { code: 0, message: "上传成功", data: null };
    } catch (e) {
      console.error(e);
      return { code: 999, message: "上传失败", data: null };
    }
  },
  /**获取首页列表 */
  async getIndexList(params) {
    const {
      pageNum = 1,
      pageSize = 10,
      sort = "latest",
      search = "",
    } = params || {};
    const keyword = (search || "").trim();
    let result = {};
    const whereCondition = {};
    if (sort === "latest") {
      if (keyword) {
        const { data: allList } = await ListDataset.where(whereCondition)
          .orderBy("uploadTime", "desc")
          .get();
        const filteredList = allList.filter((n) => {
          const name = n?.file?.name || "";
          return name.includes(keyword);
        });
        const total = filteredList.length;
        const start = (pageNum - 1) * pageSize;
        const end = start + pageSize;
        const pageList = filteredList.slice(start, end);
        result = {
          code: 0,
          message: "获取成功",
          data: pageList.map((n) => ({
            id: n?._id,
            ...n?.file,
            ...n,
          })),
          total,
          pageNum: pageNum,
          pageSize: pageSize,
          hasMore: false,
        };
      } else {
        const { total } = await ListDataset.where(whereCondition).count();
        const { data: list } = await ListDataset.where(whereCondition)
          .orderBy("uploadTime", "desc")
          .skip((pageNum - 1) * pageSize)
          .limit(pageSize)
          .get();
        result = {
          code: 0,
          message: "获取成功",
          data: list?.map((n) => ({
            id: n?._id,
            ...n?.file,
            ...n,
          })),
          total,
          pageNum: pageNum,
          pageSize: pageSize,
          hasMore: false,
        };
      }
    } else if (sort === "month") {
      const { data: list } = await ListDataset.where(whereCondition)
        .orderBy("uploadTime", "desc")
        .get();
      const grouped = {};
      list.forEach((n) => {
        const ts = n?.uploadTime || n?.create_time;
        if (!ts) {
          return;
        }
        const d = new Date(ts);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0",
        )}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push({
          id: n?._id,
          ...n?.file,
          ...n,
        });
      });
      let data = grouped;
      if (keyword) {
        const filtered = {};
        Object.keys(grouped).forEach((key) => {
          if (key.includes(keyword)) {
            filtered[key] = grouped[key];
          }
        });
        data = filtered;
      }
      result = {
        code: 0,
        message: "获取成功",
        data,
        total: list.length,
        pageNum: 1,
        pageSize: list.length,
        hasMore: false,
      };
    } else if (sort === "province") {
      const { data: list } = await ListDataset.where(whereCondition)
        .orderBy("city", "asc")
        .get();
      const grouped = {};
      list.forEach((n) => {
        const key = n?.city || "未知";
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push({
          id: n?._id,
          ...n?.file,
          ...n,
        });
      });
      let data = grouped;
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const filtered = {};
        Object.keys(grouped).forEach((key) => {
          if ((key || "").toLowerCase().includes(lowerKeyword)) {
            filtered[key] = grouped[key];
          }
        });
        data = filtered;
      }
      result = {
        code: 0,
        message: "获取成功",
        data,
        total: list.length,
        pageNum: 1,
        pageSize: list.length,
        hasMore: false,
      };
    }
    return result;
  },
  /**获取我的上传 */
  async getMyUploads(param) {
    try {
      const {
        email = "",
        pageNum = 1,
        pageSize = 10,
        search = "",
      } = param || {};

      if (!email) {
        return { code: 999, message: "缺少用户标识", data: null };
      }

      const keyword = search?.trim() || "";
      const p = Math.max(1, parseInt(pageNum, 10) || 1);
      const ps = Math.max(1, parseInt(pageSize, 10) || 10);
      const whereCondition = { createUser: email };

      // 使用 ListDataset 进行分页查询
      if (keyword) {
        // 有搜索关键词时，先获取所有数据再过滤
        const { data: allList } = await ListDataset.where(
          whereCondition,
        ).orderBy("uploadTime", "desc").get();
        
        const filteredList = allList.filter((n) =>
          (n?.file?.name || "").includes(keyword),
        );
        
        const total = filteredList.length;
        const start = (p - 1) * ps;
        const end = start + ps;
        const pageList = filteredList.slice(start, end).map((n) => ({
          id: n?._id,
          ...n?.file,
          ...n,
        }));

        return {
          code: 0,
          message: "获取成功",
          data: pageList,
          total,
          pageNum: p,
          pageSize: ps,
          hasMore: end < total,
        };
      }

      // 无搜索关键词时使用数据库分页
      const { total } = await ListDataset.where(whereCondition).count();
      const { data: list } = await ListDataset.where(whereCondition)
        .orderBy("uploadTime", "desc")
        .skip((p - 1) * ps)
        .limit(ps)
        .get();

      return {
        code: 0,
        message: "获取成功",
        data: list?.map((n) => ({
          id: n?._id,
          ...n?.file,
          ...n,
        })),
        total,
        pageNum: p,
        pageSize: ps,
        hasMore: p * ps < total,
      };
    } catch (e) {
      console.error(e);
      return { code: 999, message: "获取失败，请稍后再试", data: null };
    }
  },
  /**获取收藏列表 */
  async getCollectList(params) {
    try {
      const {
        email = "",
        pageNum = 1,
        pageSize = 10,
        search = "",
      } = params || {};

      if (!email) {
        return { code: 999, message: "缺少用户标识", data: null };
      }

      const keyword = search?.trim() || "";
      const p = Math.max(1, parseInt(pageNum, 10) || 1);
      const ps = Math.max(1, parseInt(pageSize, 10) || 10);
      const whereCondition = { createUser: email };

      // 使用 CollectDataset 进行分页查询
      if (keyword) {
        // 有搜索关键词时，先获取所有数据再过滤
        const { data: allList } = await CollectDataset.where(
          whereCondition,
        ).orderBy("create_time", "desc").get();
        
        const filteredList = allList.filter((n) =>
          (n?.file?.name || "").includes(keyword),
        );
        
        const total = filteredList.length;
        const start = (p - 1) * ps;
        const end = start + ps;
        const pageList = filteredList.slice(start, end).map((n) => ({
          id: n?._id,
          ...n?.file,
          ...n,
        }));

        return {
          code: 0,
          message: "获取成功",
          data: pageList,
          total,
          pageNum: p,
          pageSize: ps,
          hasMore: end < total,
        };
      }

      // 无搜索关键词时使用数据库分页
      const { total } = await CollectDataset.where(whereCondition).count();
      const { data: list } = await CollectDataset.where(whereCondition)
        .orderBy("create_time", "desc")
        .skip((p - 1) * ps)
        .limit(ps)
        .get();

      return {
        code: 0,
        message: "获取成功",
        data: list?.map((n) => ({
          id: n?._id,
          ...n?.file,
          ...n,
        })),
        total,
        pageNum: p,
        pageSize: ps,
        hasMore: p * ps < total,
      };
    } catch (e) {
      console.error(e);
      return { code: 999, message: "获取失败，请稍后再试", data: null };
    }
  },
  /**获取操作记录 */
  async getOperationRecords(param) {
    try {
      const { createUser = "", pageNum = 1, pageSize = 20 } = param || {};
      const { data: records } = await UserDataset.where({
        email: createUser,
      }).get();
      const ops = Array.isArray(records?.[0]?.operation)
        ? records[0].operation
        : [];
      const p = Math.max(1, parseInt(pageNum, 10) || 1);
      const ps = Math.max(1, parseInt(pageSize, 10) || 10);
      const start = (p - 1) * ps;
      const end = start + ps;
      const total = ops.length;
      const list = ops.slice(start, end);
      return {
        code: 0,
        message: "获取成功",
        data: { list, total, pageNum: p, pageSize: ps, hasMore: end < total },
      };
    } catch (e) {
      return { code: 999, message: "获取失败", data: null };
    }
  },
  // 删除文件
  async deleteUploadFile(ids) {
    try {
      await uniCloud.deleteFile({
        fileList: Array?.isArray(ids) ? ids : [ids],
      });
      return { code: 0, message: "", data: null };
    } catch {
      return { code: 999, message: "", data: null };
    }
  },
};
