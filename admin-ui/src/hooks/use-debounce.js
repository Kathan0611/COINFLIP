//src/hooks/use-debounce.js
import React, { useCallback } from 'react'

export function useDebounce(callback, delay) {
  const timeoutRef = React.useRef(null)

  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  )
}
