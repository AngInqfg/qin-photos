<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useGetData } from "./utils/index";
useGetData();
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
@import "./static/css/index.css";
:deep(.uni-picker-action.uni-picker-action-confirm) {
  color: var(--maxColor) !important;
}
page,
body {
  height: 100%;
  overflow: hidden;
}
</style>
