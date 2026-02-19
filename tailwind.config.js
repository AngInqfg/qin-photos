/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "",
  corePlugins: {
    preflight: false, // uniapp必备，关闭默认样式重置
  },
  content: [
    "./index.html",
    // 精准扫描src下所有业务文件，排除css/scss等样式文件（关键！）
    "./src/**/*.{vue,js,ts,jsx,tsx,nvue}",
    "./pages/**/*.{vue,js,ts,jsx,tsx,nvue}",
    "./components/**/*.{vue,js,ts,jsx,tsx,nvue}",
    "!./src/**/*.{css,scss,less,stylus}", // 排除所有样式文件，彻底杜绝循环更新
    "!./src/tailwind.css", // 单独再排除一次，双重保险
  ],
  theme: {
    extend: {
      colors: {
        // mainColor: "#409eff",
        mainColor: "rgba(212, 100, 212, 1)",
        mainColor1: "rgba(212, 100, 212, 0.1)",
        mainColor2: "rgba(212, 100, 212, 0.2)",
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ":root": {
          // 遍历theme.colors里的所有自定义颜色，自动生成CSS变量
          ...Object.entries(theme("colors")).reduce((vars, [key, value]) => {
            // 生成变量名规则：--tw-xxx（和Tailwind原生变量规范一致，避免冲突）
            // 比如 mainColor → --tw-mainColor，secondColor → --tw-secondColor
            vars[`--${key}`] = value;
            return vars;
          }, {}),
        },
      });
    },
  ],
};
