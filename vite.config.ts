import { defineConfig, ConfigEnv, UserConfig } from "vite";
import { resolve } from "path";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const pathSrc = resolve(__dirname, "src");
  console.log(mode, "envStatus");
  return {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    plugins: [
      uni(),
      AutoImport({
        imports: ["vue", "uni-app"],
        dts: "./src/types/auto-imports.d.ts",
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                @use "antp-component/style/index.scss" as *;
              `,
        },
      },
    },
  };
});
