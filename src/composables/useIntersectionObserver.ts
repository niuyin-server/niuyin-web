import { ref, onMounted, onUnmounted, Ref } from 'vue'

export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const target = ref<HTMLElement | null>(null)
  const isIntersecting = ref(false)
  let observer: IntersectionObserver | null = null

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  }

  const observe = () => {
    if (target.value && observer) {
      observer.observe(target.value)
    }
  }

  const unobserve = () => {
    if (target.value && observer) {
      observer.unobserve(target.value)
    }
  }

  const disconnect = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      isIntersecting.value = entry.isIntersecting
      
      if (entry.isIntersecting) {
        callback()
      }
    }, defaultOptions)

    if (target.value) {
      observe()
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    target,
    isIntersecting,
    observe,
    unobserve,
    disconnect
  }
}