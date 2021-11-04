import React from 'react'
import {Box} from '..'

export function worksWithAs(ref: React.RefObject<HTMLAnchorElement>) {
  return <Box ref={ref} as="a" href="#" />
}

export function worksWithoutAs(ref: React.RefObject<HTMLDivElement>) {
  return <Box ref={ref} />
}

export function failsForUnavailableProps() {
  // @ts-expect-error href should not be available unless as="a" is passed
  return <Box href="#" />
}
