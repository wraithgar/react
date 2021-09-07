import React, {useEffect} from 'react'
import {iterateFocusableElements} from '../utils/iterateFocusableElements'

export type UseOpenAndCloseFocusSettings = {
  initialFocusRef?: React.RefObject<HTMLElement>
  containerRef: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  overrideInitialFocus?: boolean
}

export function useOpenAndCloseFocus({
  initialFocusRef,
  returnFocusRef,
  containerRef,
  overrideInitialFocus
}: UseOpenAndCloseFocusSettings): void {
  useEffect(() => {
    const returnRef = returnFocusRef.current
    if (!overrideInitialFocus && initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus()
    } else if (!overrideInitialFocus && containerRef.current) {
      const firstItem = iterateFocusableElements(containerRef.current).next().value
      firstItem?.focus()
    }
    return function () {
      returnRef?.focus()
    }
  }, [initialFocusRef, returnFocusRef, containerRef])
}
