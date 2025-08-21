import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  immediate?: boolean
}

export function useInfiniteScroll(
  callback: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    immediate = true
  } = options

  const targetRef = ref<HTMLElement>()
  const isLoading = ref(false)
  const isIntersecting = ref(false)
  
  let observer: IntersectionObserver | null = null

  const createObserver = () => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]
        isIntersecting.value = entry.isIntersecting

        if (entry.isIntersecting && !isLoading.value) {
          isLoading.value = true
          try {
            await callback()
          } catch (error) {
            console.error('Infinite scroll callback error:', error)
          } finally {
            isLoading.value = false
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(targetRef.value)
  }

  const stop = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const start = () => {
    stop()
    nextTick(() => {
      createObserver()
    })
  }

  onMounted(() => {
    if (immediate) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    targetRef,
    isLoading,
    isIntersecting,
    start,
    stop
  }
}