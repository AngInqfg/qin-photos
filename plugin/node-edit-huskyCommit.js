const fs = require("fs");
const path = require("path");
const preCommitFilePath = path.resolve(
  __dirname,
  "../.husky",
  "",
  "pre-commit",
);
const commitMsgFilePath = path.resolve(
  __dirname,
  "../.husky",
  "",
  "commit-msg",
);

const newPreCommitContent = `#!/bin/sh
echo " "
echo "-----##### 执行代码格式化中 #####-----"
echo " "
# 获取 Git 暂存区中所有已修改的文件
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=AM)
# 如果有修改的文件
if [ -n "$CHANGED_FILES" ]; then
  # 使用 Prettier 格式化所有已修改的文件
  npx prettier --write $CHANGED_FILES
  git add $CHANGED_FILES  # 重新添加格式化后的文件到暂存区
  echo " "
  echo "-----##### 格式化完成 #####-----"
  echo " "
else
  echo " "
  echo "-----##### 没有需要格式化的文件 #####-----"
  echo " "
fi
`;

const newCommitMsgContent = `#!/usr/bin/env sh
echo "-----##### 提交git规范检测中 #####-----"
echo " "
. "$(dirname -- "$0")/_/husky.sh"
if ! npx --no-install commitlint --edit "$1"; then
  # 只有在 commitlint 失败时才显示以下内容
  echo "❌start 提交信息不符合规范，请修正后再提交！"
  echo "commitLint.config.js"
  echo "bug          修改bug"
  echo "frame        架构体系修改"
  echo "add          新增文件"
  echo "remove       删除文件"
  echo "style        修改样式"
  echo "annotation   打印 注释"
  echo "text         静态文本"
  echo "performance  优化"
  echo "❌end 提交信息不符合规范，请修正后再提交！"
  echo " "
  exit 1  # 强制退出并标记为失败
fi
  # 如果成功则显示成功信息
  echo "✅ 提交信息符合规范"
  echo " "
`;
fs.writeFileSync(preCommitFilePath, newPreCommitContent, "utf-8");
fs.writeFileSync(commitMsgFilePath, newCommitMsgContent, "utf-8");
console.log("");
console.log("-----##### .husky commit-msg && pre-commit 文件已替换 #####-----");
