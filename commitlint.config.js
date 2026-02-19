module.exports = {
  // 继承的规则，采用官方推荐的规范
  extends: ["@commitlint/config-conventional"],
  // 自定义规则
  rules: {
    // 提交类型必须符合下列类型之一
    "type-enum": [
      2,
      "always",
      [
        "bug", // 修改bug
        "frame", // 架构体系修改
        "add", // 新增文件
        "remove", // 删除文件
        "style", // 修改样式
        "annotation", // 打印 注释
        "text", // 静态文本
        "performance", // 优化
      ],
    ],
    "subject-case": [0],
  },
};
