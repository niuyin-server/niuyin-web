import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export interface WaterfallItem {
  id: string | number
  height?: number
  [key: string]: any
}

export interface UseWaterfallLayoutOptions {
  columnWidth?: number
  gap?: number
  minColumns?: number
  maxColumns?: number
}

export function useWaterfallLayout(options: UseWaterfallLayoutOptions = {}) {
  const {
    columnWidth = 280,
    gap = 16,
    minColumns = 1,
    maxColumns = 5
  } = options

  const containerRef = ref<HTMLElement>()
  const columns = ref(2)
  const columnHeights = ref<number[]>([])
  const itemPositions = ref<Map<string | number, { x: number; y: number; column: number }>>(new Map())

  // 计算列数
  const calculateColumns = () => {
    if (!containerRef.value) return

    const containerWidth = containerRef.value.clientWidth
    const availableWidth = containerWidth - gap
    const possibleColumns = Math.floor(availableWidth / (columnWidth + gap))
    
    columns.value = Math.max(minColumns, Math.min(maxColumns, possibleColumns))
    columnHeights.value = new Array(columns.value).fill(0)
  }

  // 获取最短列的索引
  const getShortestColumnIndex = () => {
    let shortestIndex = 0
    let shortestHeight = columnHeights.value[0]

    for (let i = 1; i < columnHeights.value.length; i++) {
      if (columnHeights.value[i] < shortestHeight) {
        shortestHeight = columnHeights.value[i]
        shortestIndex = i
      }
    }

    return shortestIndex
  }

  // 计算项目位置
  const calculateItemPosition = (item: WaterfallItem, itemHeight: number) => {
    if (columnHeights.value.length === 0) {
      columnHeights.value = new Array(columns.value).fill(0)
    }
    
    const columnIndex = getShortestColumnIndex()
    const x = columnIndex * (columnWidth + gap)
    const y = columnHeights.value[columnIndex]

    // 更新列高度
    columnHeights.value[columnIndex] += itemHeight + gap

    // 存储位置信息
    itemPositions.value.set(item.id, { x, y, column: columnIndex })

    return { x, y, column: columnIndex }
  }

  // 重置布局
  const resetLayout = () => {
    columnHeights.value = new Array(columns.value).fill(0)
    itemPositions.value.clear()
  }

  // 获取容器高度
  const getContainerHeight = () => {
    return Math.max(...columnHeights.value)
  }

  // 响应式处理
  const handleResize = () => {
    calculateColumns()
    resetLayout()
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    if (containerRef.value) {
      calculateColumns()
      
      // 使用 ResizeObserver 监听容器大小变化
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return {
    containerRef,
    columns,
    columnHeights,
    itemPositions,
    calculateItemPosition,
    resetLayout,
    getContainerHeight,
    handleResize
  }
}