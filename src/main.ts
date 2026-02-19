import "./tailwind.css";
import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from "pinia";
import { setLogo } from "./utils/index";
export function createApp() {
  setLogo();
  const app = createSSRApp(App);
  app.use(Pinia.createPinia() as any);
  return {
    app,
    Pinia,
  };
}
