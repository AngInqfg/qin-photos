import { ref, computed, getCurrentInstance, onMounted, onUnmounted } from "vue";
import { getClientInfo } from "./index";
import type { Ref } from "vue";
const { client } = getClientInfo();
/**
 * 瀑布流Hook入参类型
 */
export interface UseWaterfallOptions<T = any> {
  // 瀑布流原始数据列表
  data: Ref<T[]>;
  // 图片卡片宽度（配置项）
  cardWidth: number;
  // 卡片之间的间距（配置项）
  cardGap: number;
  // 瀑布流容器的ID（与模板中对应）
  containerId: string;
}

/**
 * 瀑布流通用Hook - 支持多页面复用
 * @param options 入参配置
 * @returns 瀑布流相关计算属性、方法、Ref
 */
export function useWaterfall<T = any>(options: UseWaterfallOptions<T>) {
  const { data, cardWidth, cardGap, containerId } = options;
  const instance = getCurrentInstance();
  // 瀑布流容器宽度
  const containerWidth = ref<number>(0);

  // 计算瀑布流列数（核心逻辑与原代码一致）
  const calculateColNum = computed(() => {
    if (!containerWidth.value) return 1;
    const colNum = Math.floor(
      (containerWidth.value + cardGap) / (cardWidth + cardGap),
    );
    return Math.max(colNum, 1);
  });

  // 瀑布流分栏数据（核心逻辑与原代码一致）
  const columnData = computed<T[][]>(() => {
    const colNum = calculateColNum.value;
    const arr = data.value;
    if (colNum === 0 || arr.length === 0) return [];

    const baseCount = Math.floor(arr.length / colNum);
    const remainder = arr.length % colNum;
    const result: T[][] = [];
    let startIndex = 0;

    for (let i = 0; i < colNum; i++) {
      const currentCount = baseCount + (i < remainder ? 1 : 0);
      result.push(arr.slice(startIndex, startIndex + currentCount));
      startIndex += currentCount;
    }

    return result;
  });

  // 获取瀑布流容器的实际宽度（适配uni-app的selectorQuery）
  async function getContainerWidth(): Promise<number> {
    return new Promise<number>((resolve) => {
      if (!instance) {
        resolve(0);
        return;
      }
      const query = uni.createSelectorQuery().in(instance);
      query
        .select(`#${containerId}`)
        .boundingClientRect((rect: any) => {
          resolve(rect?.width || 0);
        })
        .exec();
    });
  }

  // 更新瀑布流布局（重新获取宽度+计算列数）
  async function updateWaterfallLayout() {
    containerWidth.value = await getContainerWidth();
  }

  // 生命周期：挂载时初始化+监听窗口大小变化
  onMounted(async () => {
    await updateWaterfallLayout();
    uni.onWindowResize(updateWaterfallLayout);
  });

  // 生命周期：卸载时移除监听，防止内存泄漏
  onUnmounted(() => {
    uni.offWindowResize(updateWaterfallLayout);
  });
  // 暴露给外部的属性和方法
  return {
    containerWidth, // 容器宽度Ref
    calculateColNum, // 计算出的列数（computed）
    columnData, // 分栏后的瀑布流数据（computed）
    updateWaterfallLayout, // 手动更新布局方法（可外部主动调用）
    getContainerWidth, // 手动获取容器宽度方法
  };
}
export const useDownloadClick = (list: any) => {
  if (!list?.length) {
    return uni.showToast({
      title: "请先选择图片",
      icon: "none",
      duration: 1500,
    });
  }
  if (client === "PC" || client === "H5") {
  
  } else {
   
  }
};
